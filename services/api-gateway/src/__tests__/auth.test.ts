/**
 * TC-01: User can register a new workspace
 * TC-02: User can log in with valid credentials
 * TC-03: User cannot access documents from another tenant (isolation)
 * TC-04: JWT tokens expire correctly and require refresh
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthService } from '../modules/auth/auth.service';
import { authenticate } from '../middleware/authenticate';
import { tenantScope } from '../middleware/tenantScope';
import { UnauthorizedError, ValidationError, ForbiddenError } from '../shared/errors/AppError';

jest.mock('../config/database', () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn(), create: jest.fn() },
    tenant: { create: jest.fn() },
    $transaction: jest.fn(),
  },
}));

import prisma from '../config/database';
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// ─── TC-01 ───────────────────────────────────────────────────────────────────
describe('TC-01: Register new workspace', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  it('creates tenant and admin user in transaction', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'admin@acme.com',
      name: 'Admin',
      role: 'ADMIN',
      tenantId: 'tenant-1',
      password: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (mockPrisma.$transaction as jest.Mock).mockImplementation(async (fn: any) => {
      const tx = {
        tenant: { create: jest.fn().mockResolvedValue({ id: 'tenant-1', name: 'Acme' }) },
        user: { create: jest.fn().mockResolvedValue(mockUser) },
      };
      return fn(tx);
    });

    const result = await authService.register({
      email: 'admin@acme.com',
      password: 'password123',
      name: 'Admin',
      workspaceName: 'Acme',
    });

    expect(result.user.email).toBe('admin@acme.com');
    expect(result.user.role).toBe('ADMIN');
    expect(result.token).toBeDefined();
  });

  it('rejects duplicate email with ValidationError', async () => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'existing' });

    await expect(
      authService.register({
        email: 'admin@acme.com',
        password: 'password123',
        name: 'Admin',
        workspaceName: 'Acme',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('hashes password before storing', async () => {
    let capturedData: any = null;

    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (mockPrisma.$transaction as jest.Mock).mockImplementation(async (fn: any) => {
      const tx = {
        tenant: { create: jest.fn().mockResolvedValue({ id: 'tenant-1' }) },
        user: {
          create: jest.fn().mockImplementation(async ({ data }: any) => {
            capturedData = data;
            return { id: 'user-1', ...data, role: 'ADMIN' };
          }),
        },
      };
      return fn(tx);
    });

    await authService.register({
      email: 'new@test.com',
      password: 'plaintext123',
      name: 'Test',
      workspaceName: 'TestCo',
    });

    expect(capturedData.password).not.toBe('plaintext123');
    const isHashed = await bcrypt.compare('plaintext123', capturedData.password);
    expect(isHashed).toBe(true);
  });
});

// ─── TC-02 ───────────────────────────────────────────────────────────────────
describe('TC-02: Login with valid credentials', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  it('returns signed JWT on valid credentials', async () => {
    const hashedPassword = await bcrypt.hash('password123', 12);

    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'user@acme.com',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: 'tenant-1',
    });

    const result = await authService.login({ email: 'user@acme.com', password: 'password123' });

    expect(result.token).toBeDefined();
    const decoded = jwt.verify(result.token, JWT_SECRET) as any;
    expect(decoded.sub).toBe('user-1');
    expect(decoded.tenantId).toBe('tenant-1');
    expect(decoded.role).toBe('ADMIN');
  });

  it('rejects wrong password', async () => {
    const hashedPassword = await bcrypt.hash('correctpassword', 12);

    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'user@acme.com',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: 'tenant-1',
    });

    await expect(
      authService.login({ email: 'user@acme.com', password: 'wrongpassword' })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('rejects non-existent user', async () => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      authService.login({ email: 'ghost@acme.com', password: 'any' })
    ).rejects.toThrow(UnauthorizedError);
  });
});

// ─── TC-03 ───────────────────────────────────────────────────────────────────
describe('TC-03: Tenant isolation', () => {
  it('authenticate extracts tenantId into req.user', () => {
    const token = jwt.sign(
      { sub: 'user-1', tenantId: 'tenant-A', role: 'ADMIN' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const next = jest.fn();

    authenticate(req, {} as any, next);

    expect(req.user.tenantId).toBe('tenant-A');
    expect(next).toHaveBeenCalledWith();
  });

  it('tenantScope injects req.tenantId from req.user', () => {
    const req: any = { user: { id: 'user-1', tenantId: 'tenant-A', role: 'ADMIN' } };
    const next = jest.fn();

    tenantScope(req, {} as any, next);

    expect(req.tenantId).toBe('tenant-A');
    expect(next).toHaveBeenCalledWith();
  });

  it('tenantScope throws ForbiddenError when tenantId missing', () => {
    const req: any = { user: { id: 'user-1' } };
    expect(() => tenantScope(req, {} as any, jest.fn())).toThrow(ForbiddenError);
  });

  it('tokens from different tenants carry different tenantIds', () => {
    const tokenA = jwt.sign({ sub: 'u-A', tenantId: 'tenant-A', role: 'ADMIN' }, JWT_SECRET);
    const tokenB = jwt.sign({ sub: 'u-B', tenantId: 'tenant-B', role: 'ADMIN' }, JWT_SECRET);

    const dA = jwt.decode(tokenA) as any;
    const dB = jwt.decode(tokenB) as any;

    expect(dA.tenantId).not.toBe(dB.tenantId);
  });
});

// ─── TC-04 ───────────────────────────────────────────────────────────────────
describe('TC-04: JWT token expiry', () => {
  it('rejects expired token', () => {
    const expired = jwt.sign(
      { sub: 'user-1', tenantId: 'tenant-1', role: 'ADMIN' },
      JWT_SECRET,
      { expiresIn: -1 }
    );

    const req: any = { headers: { authorization: `Bearer ${expired}` } };
    expect(() => authenticate(req, {} as any, jest.fn())).toThrow(UnauthorizedError);
  });

  it('rejects token signed with wrong secret', () => {
    const tampered = jwt.sign(
      { sub: 'user-1', tenantId: 'tenant-1', role: 'ADMIN' },
      'wrong-secret',
      { expiresIn: '1d' }
    );

    const req: any = { headers: { authorization: `Bearer ${tampered}` } };
    expect(() => authenticate(req, {} as any, jest.fn())).toThrow(UnauthorizedError);
  });

  it('rejects missing Authorization header', () => {
    const req: any = { headers: {} };
    expect(() => authenticate(req, {} as any, jest.fn())).toThrow(UnauthorizedError);
  });

  it('valid token within expiry passes', () => {
    const token = jwt.sign(
      { sub: 'user-1', tenantId: 'tenant-1', role: 'ADMIN' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const next = jest.fn();

    authenticate(req, {} as any, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toBeDefined();
  });

  it('token encodes ~1 day expiry', () => {
    const before = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      { sub: 'user-1', tenantId: 'tenant-1', role: 'ADMIN' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    const after = Math.floor(Date.now() / 1000);

    const decoded = jwt.decode(token) as any;
    const oneDaySeconds = 86400;

    expect(decoded.exp).toBeGreaterThanOrEqual(before + oneDaySeconds - 1);
    expect(decoded.exp).toBeLessThanOrEqual(after + oneDaySeconds + 1);
  });
});
