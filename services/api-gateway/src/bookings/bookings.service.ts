import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@healthcare/common-lib';

@Injectable()
export class BookingsService {
  private prisma = new PrismaClient();

  async createBooking(data: any): Promise<any> {
    try {
      console.log('Creating booking with data:', data);
      
      // Get patient record from user ID
      const patient = await this.prisma.patient.findUnique({
        where: { userId: data.patientId },
      });

      console.log('Looking for patient with userId:', data.patientId);
      console.log('Found patient:', patient);

      if (!patient) {
        // Check if user exists at all
        const user = await this.prisma.user.findUnique({
          where: { id: data.patientId },
        });
        console.log('User exists:', user);
        throw new Error(`Patient record not found for user ID: ${data.patientId}`);
      }

      console.log('Found patient:', patient.id);
      
      // Check slot availability
      const slot = await this.prisma.slot.findUnique({
        where: { id: data.slotId },
      });

      console.log('Found slot:', slot);

      if (!slot || slot.available <= 0) {
        throw new Error('Slot not available');
      }

      // Create booking
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

      // Update slot availability
      await this.prisma.slot.update({
        where: { id: data.slotId },
        data: { available: slot.available - 1 },
      });

      return booking;
    } catch (error) {
      console.error('Booking creation error:', error);
      throw error;
    }
  }

  async getPatientBookings(userId: string): Promise<any> {
    // Get patient record from user ID
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

  async cancelBooking(bookingId: string, userId: string): Promise<any> {
    // Get patient record from user ID
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

    // Update booking status
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    // Restore slot availability
    await this.prisma.slot.update({
      where: { id: booking.slotId },
      data: { available: booking.slot.available + 1 },
    });

    return updatedBooking;
  }
}