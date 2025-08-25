"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftCreateSchema = exports.JobApplicationSchema = exports.AIRecommendationInputSchema = exports.BookingRequestSchema = exports.SearchProvidersSchema = exports.LoginSchema = exports.RegisterSchema = exports.UserRoleSchema = void 0;
exports.validateInput = validateInput;
const zod_1 = require("zod");
exports.UserRoleSchema = zod_1.z.enum(['PATIENT', 'PROVIDER', 'ADMIN', 'STAFF']);
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    role: exports.UserRoleSchema,
    phone: zod_1.z.string().optional(),
    locale: zod_1.z.string().default('en'),
    timezone: zod_1.z.string().default('UTC'),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.SearchProvidersSchema = zod_1.z.object({
    specialty: zod_1.z.string().optional(),
    location: zod_1.z.object({
        lat: zod_1.z.number().min(-90).max(90),
        lng: zod_1.z.number().min(-180).max(180),
        radius: zod_1.z.number().min(1).max(100),
    }).optional(),
    availability: zod_1.z.object({
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        timeRange: zod_1.z.object({
            start: zod_1.z.string().regex(/^\d{2}:\d{2}$/),
            end: zod_1.z.string().regex(/^\d{2}:\d{2}$/),
        }).optional(),
    }).optional(),
});
exports.BookingRequestSchema = zod_1.z.object({
    patientId: zod_1.z.string().cuid(),
    clinicId: zod_1.z.string().cuid(),
    serviceId: zod_1.z.string().cuid(),
    slotId: zod_1.z.string().cuid(),
    notes: zod_1.z.string().max(1000).optional(),
});
exports.AIRecommendationInputSchema = zod_1.z.object({
    symptoms: zod_1.z.array(zod_1.z.string()).optional(),
    intent: zod_1.z.string().max(500).optional(),
    patientHistory: zod_1.z.string().max(2000).optional(),
    location: zod_1.z.object({
        lat: zod_1.z.number().min(-90).max(90),
        lng: zod_1.z.number().min(-180).max(180),
    }).optional(),
});
exports.JobApplicationSchema = zod_1.z.object({
    jobReqId: zod_1.z.string().cuid(),
    coverLetter: zod_1.z.string().max(2000).optional(),
    resumeFile: zod_1.z.any().optional(), // File upload
});
exports.ShiftCreateSchema = zod_1.z.object({
    clinicId: zod_1.z.string().cuid(),
    role: zod_1.z.string().min(1),
    startTime: zod_1.z.string().datetime(),
    endTime: zod_1.z.string().datetime(),
    neededCount: zod_1.z.number().min(1).max(50),
});
function validateInput(schema, data) {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new Error(`Validation failed: ${result.error.message}`);
    }
    return result.data;
}
