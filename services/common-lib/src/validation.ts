import { z } from 'zod';

export const UserRoleSchema = z.enum(['PATIENT', 'PROVIDER', 'ADMIN', 'STAFF']);

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  role: UserRoleSchema,
  phone: z.string().optional(),
  locale: z.string().default('en'),
  timezone: z.string().default('UTC'),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const SearchProvidersSchema = z.object({
  specialty: z.string().optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    radius: z.number().min(1).max(100),
  }).optional(),
  availability: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    timeRange: z.object({
      start: z.string().regex(/^\d{2}:\d{2}$/),
      end: z.string().regex(/^\d{2}:\d{2}$/),
    }).optional(),
  }).optional(),
});

export const BookingRequestSchema = z.object({
  patientId: z.string().cuid(),
  clinicId: z.string().cuid(),
  serviceId: z.string().cuid(),
  slotId: z.string().cuid(),
  notes: z.string().max(1000).optional(),
});

export const AIRecommendationInputSchema = z.object({
  symptoms: z.array(z.string()).optional(),
  intent: z.string().max(500).optional(),
  patientHistory: z.string().max(2000).optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
});

export const JobApplicationSchema = z.object({
  jobReqId: z.string().cuid(),
  coverLetter: z.string().max(2000).optional(),
  resumeFile: z.any().optional(), // File upload
});

export const ShiftCreateSchema = z.object({
  clinicId: z.string().cuid(),
  role: z.string().min(1),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  neededCount: z.number().min(1).max(50),
});

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.message}`);
  }
  return result.data;
}