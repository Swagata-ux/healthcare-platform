export declare class AuthService {
    private prisma;
    private authService;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            patient: {
                id: string;
                address: string | null;
                userId: string;
                firstName: string;
                lastName: string;
                dateOfBirth: Date | null;
                gender: string | null;
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
            id: string;
            email: string;
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
    register(data: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
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
    validateToken(token: string): Promise<import("@healthcare/common-lib").JWTPayload>;
}
