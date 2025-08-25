import { Injectable } from '@nestjs/common';
import { PrismaClient, SearchProvidersInput } from '@healthcare/common-lib';

@Injectable()
export class ProvidersService {
  private prisma = new PrismaClient();

  async searchProviders(input: SearchProvidersInput): Promise<any> {
    const where: any = {};

    if (input.specialty) {
      where.providerUsers = {
        some: {
          specialties: {
            has: input.specialty,
          },
        },
      };
    }

    if (input.location) {
      const { lat, lng, radius } = input.location;
      // Simplified distance calculation - in production use PostGIS
      where.lat = {
        gte: lat - radius / 111,
        lte: lat + radius / 111,
      };
      where.lng = {
        gte: lng - radius / (111 * Math.cos(lat * Math.PI / 180)),
        lte: lng + radius / (111 * Math.cos(lat * Math.PI / 180)),
      };
    }

    return this.prisma.clinic.findMany({
      where,
      include: {
        providerOrg: true,
        providerUsers: {
          include: {
            user: {
              select: { id: true, email: true },
            },
          },
        },
        services: true,
      },
      take: 50,
    });
  }

  async getAvailableSlots(serviceId: string, dateRange: { start: string; end: string }): Promise<any> {
    return this.prisma.slot.findMany({
      where: {
        serviceId,
        startTime: {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end),
        },
        available: {
          gt: 0,
        },
      },
      include: {
        service: true,
        clinic: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async getProviderDetails(clinicId: string): Promise<any> {
    return this.prisma.clinic.findUnique({
      where: { id: clinicId },
      include: {
        providerOrg: true,
        providerUsers: {
          include: {
            user: {
              select: { id: true, email: true },
            },
          },
        },
        services: true,
      },
    });
  }
}