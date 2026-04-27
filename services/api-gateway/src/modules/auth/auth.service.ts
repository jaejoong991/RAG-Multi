import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import prisma from '../../config/database';
import { UnauthorizedError, ValidationError } from '../../shared/errors/AppError';
import { LoginDto, RegisterDto } from './auth.schema';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '1d';

export class AuthService {
  async register(data: RegisterDto) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ValidationError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create tenant and admin user in one transaction
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const tenant = await tx.tenant.create({
        data: { name: data.workspaceName },
      });

      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          role: 'ADMIN',
          tenantId: tenant.id,
        },
      });

      const token = this.generateToken(user.id, tenant.id, user.role);

      return { user, token };
    });
  }

  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await bcrypt.compare(data.password, user.password);

    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.tenantId, user.role);

    return { user, token };
  }

  private generateToken(userId: string, tenantId: string, role: string) {
    return jwt.sign({ sub: userId, tenantId, role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }
}

export const authService = new AuthService();
