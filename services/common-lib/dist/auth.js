"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
class AuthService {
    constructor(jwtSecret) {
        this.accessTokenExpiry = '15m';
        this.refreshTokenExpiry = '7d';
        this.jwtSecret = jwtSecret;
    }
    async hashPassword(password) {
        return argon2_1.default.hash(password, {
            type: argon2_1.default.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1,
        });
    }
    async verifyPassword(hash, password) {
        try {
            return await argon2_1.default.verify(hash, password);
        }
        catch {
            return false;
        }
    }
    generateTokens(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, this.jwtSecret, {
            expiresIn: this.accessTokenExpiry,
        });
        const refreshToken = jsonwebtoken_1.default.sign({ sub: payload.sub }, this.jwtSecret, { expiresIn: this.refreshTokenExpiry });
        return { accessToken, refreshToken };
    }
    verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, this.jwtSecret);
    }
    extractTokenFromHeader(authHeader) {
        if (!authHeader?.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }
}
exports.AuthService = AuthService;
