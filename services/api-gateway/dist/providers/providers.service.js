"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const common_lib_1 = require("@healthcare/common-lib");
let ProvidersService = class ProvidersService {
    constructor() {
        this.prisma = new common_lib_1.PrismaClient();
    }
    async searchProviders(input) {
        const where = {};
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
    async getAvailableSlots(serviceId, dateRange) {
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
    async getProviderDetails(clinicId) {
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
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = __decorate([
    (0, common_1.Injectable)()
], ProvidersService);
//# sourceMappingURL=providers.service.js.map