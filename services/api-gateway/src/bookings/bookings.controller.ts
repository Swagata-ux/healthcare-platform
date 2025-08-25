import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BookingsService } from './bookings.service';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Body() bookingData: any, @Request() req: any) {
    console.log('User from JWT:', req.user);
    return this.bookingsService.createBooking({
      ...bookingData,
      patientId: req.user.sub,
    });
  }

  @Get('my')
  async getMyBookings(@Request() req: any) {
    return this.bookingsService.getPatientBookings(req.user.sub);
  }

  @Patch(':id/cancel')
  async cancelBooking(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.cancelBooking(id, req.user.sub);
  }
}