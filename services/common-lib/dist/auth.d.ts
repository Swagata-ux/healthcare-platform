import { JWTPayload, AuthTokens } from './types';
export declare class AuthService {
    private readonly jwtSecret;
    private readonly accessTokenExpiry;
    private readonly refreshTokenExpiry;
    constructor(jwtSecret: string);
    hashPassword(password: string): Promise<string>;
    verifyPassword(hash: string, password: string): Promise<boolean>;
    generateTokens(payload: Omit<JWTPayload, 'iat' | 'exp'>): AuthTokens;
    verifyToken(token: string): JWTPayload;
    extractTokenFromHeader(authHeader?: string): string | null;
}
