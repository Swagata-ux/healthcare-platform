"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const common_lib_1 = require("@healthcare/common-lib");
let AuthService = class AuthService {
    constructor() {
        this.prisma = new common_lib_1.PrismaClient();
        this.authService = new common_lib_1.AuthService(process.env.JWT_SECRET);
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { patient: true, providerUser: true },
        });
        if (!user?.passwordHash || !await this.authService.verifyPassword(user.passwordHash, password)) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async register(data) {
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
    async validateToken(token) {
        try {
            return this.authService.verifyToken(token);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map