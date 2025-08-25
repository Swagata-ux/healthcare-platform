"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const common_lib_1 = require("@healthcare/common-lib");
let BookingsService = class BookingsService {
    constructor() {
        this.prisma = new common_lib_1.PrismaClient();
    }
    async createBooking(data) {
        try {
            console.log('Creating booking with data:', data);
            const patient = await this.prisma.patient.findUnique({
                where: { userId: data.patientId },
            });
            console.log('Looking for patient with userId:', data.patientId);
            console.log('Found patient:', patient);
            if (!patient) {
                const user = await this.prisma.user.findUnique({
                    where: { id: data.patientId },
                });
                console.log('User exists:', user);
                throw new Error(`Patient record not found for user ID: ${data.patientId}`);
            }
            console.log('Found patient:', patient.id);
            const slot = await this.prisma.slot.findUnique({
                where: { id: data.slotId },
            });
            console.log('Found slot:', slot);
            if (!slot || slot.available <= 0) {
                throw new Error('Slot not available');
            }
            const booking = await this.prisma.booking.create({
                data: {
                    patientId: patient.id,
                    clinicId: data.clinicId,
                    serviceId: data.serviceId,
                    slotId: data.slotId,
                    notes: data.notes || '',
                    status: 'PENDING',
                },
                include: {
                    service: true,
                    slot: true,
                    clinic: true,
                    patient: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            console.log('Created booking:', booking.id);
            await this.prisma.slot.update({
                where: { id: data.slotId },
                data: { available: slot.available - 1 },
            });
            return booking;
        }
        catch (error) {
            console.error('Booking creation error:', error);
            throw error;
        }
    }
    async getPatientBookings(userId) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
        });
        if (!patient) {
            return [];
        }
        return this.prisma.booking.findMany({
            where: { patientId: patient.id },
            include: {
                service: true,
                slot: true,
                clinic: {
                    include: {
                        providerOrg: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async cancelBooking(bookingId, userId) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
        });
        if (!patient) {
            throw new Error('Patient not found');
        }
        const booking = await this.prisma.booking.findFirst({
            where: { id: bookingId, patientId: patient.id },
            include: { slot: true },
        });
        if (!booking) {
            throw new Error('Booking not found');
        }
        const updatedBooking = await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'CANCELLED' },
        });
        await this.prisma.slot.update({
            where: { id: booking.slotId },
            data: { available: booking.slot.available + 1 },
        });
        return updatedBooking;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)()
], BookingsService);
//# sourceMappingURL=bookings.service.js.map