/**
 * The full court object as is in the database
 */
export interface Court {
    _id: string
    name: string;
    type: string
    dayPrice: number | { $numberDecimal: string };
    nightPrice: number | { $numberDecimal: string };
}
/**
 * Interface for the user to select a date and time
 */
export interface DateTimeSelection {
    dateTime: string;
}
/**
 * Object used to send a request to the server by the admin to create a court
 */
export interface CourtCreateRequest {
    name: string;
    type: string;
    dayPrice: number;
    nightPrice: number;
}
/**
 * Object used to send a request to the server by the admin to update a court
 */
export interface CourtUpdateRequest {
    name: string;
    dayPrice?: number;
    nightPrice?: number;
}
