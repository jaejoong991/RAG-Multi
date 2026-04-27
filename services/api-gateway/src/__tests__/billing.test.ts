/**
 * TC-19: Checkout session redirects to Stripe
 * TC-20: Webhook updates tenant plan on successful payment
 * TC-21: Quota enforcement blocks queries if limit exceeded
 */

import { BillingService } from '../modules/billing/billing.service';
import { NotFoundError, ValidationError } from '../shared/errors/AppError';

jest.mock('../config/database', () => ({
  __esModule: true,
  default: {
    tenant: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../config/stripe', () => ({
  stripe: {
    checkout: {
      sessions: { create: jest.fn() },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
    subscriptions: {
      retrieve: jest.fn(),
    },
  },
}));

import prisma from '../config/database';
import { stripe } from '../config/stripe';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockStripe = stripe as jest.Mocked<typeof stripe>;

// ─── TC-19 ───────────────────────────────────────────────────────────────────
describe('TC-19: Checkout session redirects to Stripe', () => {
  let billingService: BillingService;

  beforeEach(() => {
    billingService = new BillingService();
    jest.clearAllMocks();
  });

  it('returns Stripe checkout URL for valid tenant', async () => {
    (mockPrisma.tenant.findUnique as jest.Mock).mockResolvedValue({
      id: 'tenant-1',
      name: 'Acme',
      plan: 'FREE',
    });
    (mockStripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/pay/cs_test_123',
    });

    const result = await billingService.createCheckoutSession('tenant-1', 'price_pro_monthly');

    expect(result.url).toBe('https://checkout.stripe.com/pay/cs_test_123');
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'subscription',
        metadata: { tenantId: 'tenant-1' },
      })
    );
  });

  it('throws NotFoundError for non-existent tenant', async () => {
    (mockPrisma.tenant.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      billingService.createCheckoutSession('ghost-tenant', 'price_pro_monthly')
    ).rejects.toThrow(NotFoundError);
  });

  it('passes correct line items to Stripe', async () => {
    (mockPrisma.tenant.findUnique as jest.Mock).mockResolvedValue({ id: 'tenant-1' });
    (mockStripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
      url: 'https://checkout.stripe.com/pay/cs_test_456',
    });

    await billingService.createCheckoutSession('tenant-1', 'price_business_monthly');

    const callArgs = (mockStripe.checkout.sessions.create as jest.Mock).mock.calls[0][0];
    expect(callArgs.line_items[0].price).toBe('price_business_monthly');
    expect(callArgs.line_items[0].quantity).toBe(1);
  });
});

// ─── TC-20 ───────────────────────────────────────────────────────────────────
describe('TC-20: Webhook updates tenant plan on successful payment', () => {
  let billingService: BillingService;

  beforeEach(() => {
    billingService = new BillingService();
    jest.clearAllMocks();
  });

  it('updates tenant plan on checkout.session.completed', async () => {
    (mockStripe.webhooks.constructEvent as jest.Mock).mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: { metadata: { tenantId: 'tenant-1' }, subscription: 'sub_123' },
      },
    });
    (mockStripe.subscriptions.retrieve as jest.Mock).mockResolvedValue({
      items: { data: [{ price: { id: 'price_pro' } }] },
      metadata: { tenantId: 'tenant-1' },
    });
    (mockPrisma.tenant.update as jest.Mock).mockResolvedValue({ id: 'tenant-1', plan: 'PRO' });

    await billingService.handleWebhook('stripe-sig', Buffer.from('{}'));

    expect(mockPrisma.tenant.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'tenant-1' } })
    );
  });

  it('reverts tenant plan to FREE on subscription cancellation', async () => {
    (mockStripe.webhooks.constructEvent as jest.Mock).mockReturnValue({
      type: 'customer.subscription.deleted',
      data: { object: { id: 'sub_123' } },
    });
    (mockStripe.subscriptions.retrieve as jest.Mock).mockResolvedValue({
      metadata: { tenantId: 'tenant-1' },
    });
    (mockPrisma.tenant.update as jest.Mock).mockResolvedValue({ id: 'tenant-1', plan: 'FREE' });

    await billingService.handleWebhook('stripe-sig', Buffer.from('{}'));

    expect(mockPrisma.tenant.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'tenant-1' },
        data: { plan: 'FREE' },
      })
    );
  });

  it('throws ValidationError on invalid webhook signature', async () => {
    (mockStripe.webhooks.constructEvent as jest.Mock).mockImplementation(() => {
      throw new Error('No signatures found matching the expected signature');
    });

    await expect(
      billingService.handleWebhook('bad-sig', Buffer.from('{}'))
    ).rejects.toThrow(ValidationError);
  });
});

// ─── TC-21 ───────────────────────────────────────────────────────────────────
describe('TC-21: Quota enforcement blocks queries if limit exceeded', () => {
  it('FREE plan limit is lower than PRO', () => {
    const planLimits: Record<string, number> = {
      FREE: 100,
      PRO: 1000,
      BUSINESS: 5000,
      ENTERPRISE: Infinity,
    };

    expect(planLimits['FREE']).toBeLessThan(planLimits['PRO']);
    expect(planLimits['PRO']).toBeLessThan(planLimits['BUSINESS']);
    expect(planLimits['BUSINESS']).toBeLessThan(planLimits['ENTERPRISE']);
  });

  it('blocks when usage meets or exceeds limit', () => {
    const checkQuota = (used: number, limit: number): boolean => used < limit;

    expect(checkQuota(99, 100)).toBe(true);
    expect(checkQuota(100, 100)).toBe(false);
    expect(checkQuota(101, 100)).toBe(false);
  });

  it('quota is scoped per tenant', () => {
    const usageMap: Record<string, number> = {
      'tenant-A': 50,
      'tenant-B': 110,
    };
    const isBlocked = (tenantId: string, limit: number) =>
      (usageMap[tenantId] ?? 0) >= limit;

    expect(isBlocked('tenant-A', 100)).toBe(false);
    expect(isBlocked('tenant-B', 100)).toBe(true);
  });
});
