import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    createBooking(bookingData: any, req: any): Promise<any>;
    getMyBookings(req: any): Promise<any>;
    cancelBooking(id: string, req: any): Promise<any>;
}
