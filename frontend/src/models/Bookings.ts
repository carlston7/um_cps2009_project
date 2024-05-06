/**
 * The booking to be made by the user
 */
export interface Booking {
    dateTimeIso: string;
    courtName: string;
    emails: string[];
}
  
/**
 * Represents a users full booking (as is in the database)
 */
export interface MyBookings {
    _id: string;
    start: string; // Since dates are coming in ISO string format
    user_email: string;
    court_name?: string; // Marked as optional because some bookings might not have this
    __v: number;
}