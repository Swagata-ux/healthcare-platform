export declare class BookingsService {
    private prisma;
    createBooking(data: any): Promise<any>;
    getPatientBookings(userId: string): Promise<any>;
    cancelBooking(bookingId: string, userId: string): Promise<any>;
}
