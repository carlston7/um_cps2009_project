export interface Booking {
    dateTimeIso: string;
    courtName: string;
    emails: string[];
}
  
export interface MyBookings {
    _id: string;
    start: string; // Since dates are coming in ISO string format
    user_email: string;
    court_name?: string; // Marked as optional because some bookings might not have this
    __v: number;
}