import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, AuthService as CommonAuthService } from '@healthcare/common-lib';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();
  private authService = new CommonAuthService(process.env.JWT_SECRET!);

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { patient: true, providerUser: true },
    });

    if (!user?.passwordHash || !await this.authService.verifyPassword(user.passwordHash, password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.authService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        refreshToken: tokens.refreshToken,
        lastLoginAt: new Date(),
      },
    });

    return { user, ...tokens };
  }

  async register(data: any) {
    const passwordHash = await this.authService.hashPassword(data.password);
    
    const user = await this.prisma.user.create({
      data: {
        ...data,
        passwordHash,
      },
    });

    const tokens = this.authService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, ...tokens };
  }

  async validateToken(token: string) {
    try {
      return this.authService.verifyToken(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}