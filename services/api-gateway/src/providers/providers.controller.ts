import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProvidersService } from './providers.service';

@Controller('providers')
@UseGuards(JwtAuthGuard)
export class ProvidersController {
  constructor(private providersService: ProvidersService) {}

  @Get('search')
  async searchProviders(@Query() query: any) {
    const searchInput = {
      specialty: query.specialty,
      location: query.lat && query.lng ? {
        lat: parseFloat(query.lat),
        lng: parseFloat(query.lng),
        radius: parseFloat(query.radius) || 10,
      } : undefined,
    };
    return this.providersService.searchProviders(searchInput);
  }

  @Get(':id')
  async getProviderDetails(@Param('id') id: string) {
    return this.providersService.getProviderDetails(id);
  }

  @Get(':id/slots')
  async getAvailableSlots(
    @Param('id') serviceId: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.providersService.getAvailableSlots(serviceId, { start, end });
  }
}