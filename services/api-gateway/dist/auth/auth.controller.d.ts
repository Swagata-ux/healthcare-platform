import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            patient: {
                id: string;
                userId: string;
                firstName: string;
                lastName: string;
                dateOfBirth: Date | null;
                gender: string | null;
                address: string | null;
                emergencyContact: string | null;
                medicalNotes: string | null;
            };
            providerUser: {
                id: string;
                clinicId: string;
                userId: string;
                specialties: string[];
                licenseNumber: string | null;
            };
        } & {
            email: string;
            id: string;
            phone: string | null;
            role: import("@healthcare/common-lib").$Enums.UserRole;
            locale: string;
            timezone: string;
            verified: boolean;
            createdAt: Date;
            updatedAt: Date;
            passwordHash: string | null;
            refreshToken: string | null;
            lastLoginAt: Date | null;
        };
    }>;
    register(body: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            email: string;
            id: string;
            phone: string | null;
            role: import("@healthcare/common-lib").$Enums.UserRole;
            locale: string;
            timezone: string;
            verified: boolean;
            createdAt: Date;
            updatedAt: Date;
            passwordHash: string | null;
            refreshToken: string | null;
            lastLoginAt: Date | null;
        };
    }>;
    getProfile(req: any): Promise<any>;
}
