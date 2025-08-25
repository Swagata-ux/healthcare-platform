export * from '@prisma/client';
export interface JWTPayload {
    sub: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface SearchProvidersInput {
    specialty?: string;
    location?: {
        lat: number;
        lng: number;
        radius: number;
    };
    availability?: {
        date: string;
        timeRange?: {
            start: string;
            end: string;
        };
    };
}
export interface AIRecommendationInput {
    symptoms?: string[];
    intent?: string;
    patientHistory?: string;
    location?: {
        lat: number;
        lng: number;
    };
}
export interface AIRecommendation {
    type: 'provider' | 'service' | 'slot';
    entityId: string;
    confidence: number;
    reasoning: string;
}
export interface BookingRequest {
    patientId: string;
    clinicId: string;
    serviceId: string;
    slotId: string;
    notes?: string;
}
export interface StaffDemandForecast {
    clinicId: string;
    date: string;
    shift: string;
    recommendedStaffCount: number;
    confidence: number;
}
export interface ErrorResponse {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance?: string;
    timestamp: string;
}
