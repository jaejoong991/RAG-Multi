import { stripe } from '../../config/stripe';
import prisma from '../../config/database';
import { NotFoundError, ValidationError } from '../../shared/errors/AppError';
import logger from '../../shared/utils/logger';

export class BillingService {
  async createCheckoutSession(tenantId: string, priceId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundError('Tenant');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.DASHBOARD_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.DASHBOARD_URL}/settings/billing?canceled=true`,
      metadata: {
        tenantId,
      },
    });

    return { url: session.url };
  }

  async handleWebhook(sig: string, body: string | Buffer) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      logger.error({ err }, 'Webhook signature verification failed');
      throw new ValidationError(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as any;
        await this.updateTenantPlan(session.metadata.tenantId, session.subscription);
        break;
      case 'customer.subscription.deleted':
        const subscription = event.data.object as any;
        await this.cancelTenantPlan(subscription.id);
        break;
      // Add more event types as needed
      default:
        logger.info(`Unhandled event type ${event.type}`);
    }
  }

  private async updateTenantPlan(tenantId: string, subscriptionId: string) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;

    // Map Price ID to Plan Enum
    // This should ideally be in a shared config
    let plan: 'PRO' | 'BUSINESS' | 'ENTERPRISE' = 'PRO';
    if (priceId === process.env.STRIPE_PRICE_BUSINESS) plan = 'BUSINESS';
    if (priceId === process.env.STRIPE_PRICE_ENTERPRISE) plan = 'ENTERPRISE';

    await prisma.tenant.update({
      where: { id: tenantId },
      data: { plan },
    });

    logger.info({ tenantId, plan, subscriptionId }, 'Tenant plan updated via stripe');
  }

  private async cancelTenantPlan(subscriptionId: string) {
    // Logic to find tenant by subscription metadata or mapping table
    // For now, we assume metadata was set on subscription too
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const tenantId = subscription.metadata.tenantId;

    if (tenantId) {
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { plan: 'FREE' },
      });
      logger.info({ tenantId, subscriptionId }, 'Tenant plan reverted to FREE');
    }
  }
}

export const billingService = new BillingService();
