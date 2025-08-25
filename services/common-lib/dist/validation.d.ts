import { z } from 'zod';
export declare const UserRoleSchema: z.ZodEnum<["PATIENT", "PROVIDER", "ADMIN", "STAFF"]>;
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["PATIENT", "PROVIDER", "ADMIN", "STAFF"]>;
    phone: z.ZodOptional<z.ZodString>;
    locale: z.ZodDefault<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    role: "PATIENT" | "PROVIDER" | "ADMIN" | "STAFF";
    password: string;
    locale: string;
    timezone: string;
    phone?: string | undefined;
}, {
    email: string;
    role: "PATIENT" | "PROVIDER" | "ADMIN" | "STAFF";
    password: string;
    phone?: string | undefined;
    locale?: string | undefined;
    timezone?: string | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const SearchProvidersSchema: z.ZodObject<{
    specialty: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
        radius: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lat: number;
        lng: number;
        radius: number;
    }, {
        lat: number;
        lng: number;
        radius: number;
    }>>;
    availability: z.ZodOptional<z.ZodObject<{
        date: z.ZodString;
        timeRange: z.ZodOptional<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        timeRange?: {
            start: string;
            end: string;
        } | undefined;
    }, {
        date: string;
        timeRange?: {
            start: string;
            end: string;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    specialty?: string | undefined;
    location?: {
        lat: number;
        lng: number;
        radius: number;
    } | undefined;
    availability?: {
        date: string;
        timeRange?: {
            start: string;
            end: string;
        } | undefined;
    } | undefined;
}, {
    specialty?: string | undefined;
    location?: {
        lat: number;
        lng: number;
        radius: number;
    } | undefined;
    availability?: {
        date: string;
        timeRange?: {
            start: string;
            end: string;
        } | undefined;
    } | undefined;
}>;
export declare const BookingRequestSchema: z.ZodObject<{
    patientId: z.ZodString;
    clinicId: z.ZodString;
    serviceId: z.ZodString;
    slotId: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    patientId: string;
    clinicId: string;
    serviceId: string;
    slotId: string;
    notes?: string | undefined;
}, {
    patientId: string;
    clinicId: string;
    serviceId: string;
    slotId: string;
    notes?: string | undefined;
}>;
export declare const AIRecommendationInputSchema: z.ZodObject<{
    symptoms: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    intent: z.ZodOptional<z.ZodString>;
    patientHistory: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lat: number;
        lng: number;
    }, {
        lat: number;
        lng: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    location?: {
        lat: number;
        lng: number;
    } | undefined;
    symptoms?: string[] | undefined;
    intent?: string | undefined;
    patientHistory?: string | undefined;
}, {
    location?: {
        lat: number;
        lng: number;
    } | undefined;
    symptoms?: string[] | undefined;
    intent?: string | undefined;
    patientHistory?: string | undefined;
}>;
export declare const JobApplicationSchema: z.ZodObject<{
    jobReqId: z.ZodString;
    coverLetter: z.ZodOptional<z.ZodString>;
    resumeFile: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    jobReqId: string;
    coverLetter?: string | undefined;
    resumeFile?: any;
}, {
    jobReqId: string;
    coverLetter?: string | undefined;
    resumeFile?: any;
}>;
export declare const ShiftCreateSchema: z.ZodObject<{
    clinicId: z.ZodString;
    role: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    neededCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    role: string;
    clinicId: string;
    startTime: string;
    endTime: string;
    neededCount: number;
}, {
    role: string;
    clinicId: string;
    startTime: string;
    endTime: string;
    neededCount: number;
}>;
export declare function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T;
