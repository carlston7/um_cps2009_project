import axiosInstance from './AxiosInstance';
import { AxiosError } from 'axios';
import { Booking, MyBookings } from '../models/Bookings';
import { fetchUserCredit } from './User';

/**
 * Books a court by making a POST request to the server.
 *
 * @param {Booking} booking - The booking details.
 * @returns {Promise<void>} - A promise that resolves when the court is successfully booked.
 * @throws {Error} - If the user is unauthorized or if the required user email and password are not found.
 */
export const bookCourt = async (booking: Booking): Promise<void> => {
  const userType = localStorage.getItem('userType');
  if (!userType) {
    console.error('No user type found');
    throw new Error('Unauthorized: You must be logged in to make this request');
  }

  const userEmail = localStorage.getItem('userEmail');
  const userPassword = localStorage.getItem('userPassword');
  if (!userPassword || !userEmail) {
    console.error('User email and password not found.');
    throw new Error('User email and password are required for this operation.');
  }
  console.log("booking: ", booking);
  try {
    await axiosInstance.post('/book-court', booking, {
      headers: {
        'User-Email': userEmail,
        'User-Type': userType,
        'User-Password': userPassword
      }
    });
    await fetchUserCredit();
  } catch (error) {
    console.error('Error booking court:', error);
    throw error;
  }
};

/**
 * Fetches the bookings for the current user.
 *
 * @returns {Promise<MyBookings[]>} - A promise that resolves with an array of user bookings.
 * @throws {Error} - If the user email is not found or if there is an error fetching the bookings.
 */
export const fetchBookings = async (): Promise<MyBookings[]> => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    console.error('User email not found.');
    throw new Error('You must be logged in to view bookings.');
  }

  try {
    const response = await axiosInstance.get('/user-bookings', { headers: { 'email': userEmail } });
    return response.data; // Assuming the response data is an array of bookings
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

/**
 * Defines the type for the cancellation request.
 */
interface CancelBookingRequest {
    _id: string;
    court_name: string;
    user_email: string;
}

/**
 * Cancels a booking by making a DELETE request to the server.
 *
 * @param {CancelBookingRequest} data - The cancellation request data.
 * @returns {Promise<any>} - A promise that resolves with the cancellation response.
 * @throws {Error} - If the user email and password are not found or if there is an error cancelling the booking.
 */
export const apiCancelBooking = async (data: CancelBookingRequest): Promise<any> => {
  try {
    console.log("data: ", data)
    const userEmail = localStorage.getItem('userEmail');
    const userPassword = localStorage.getItem('userPassword');
    if (!userPassword || !userEmail) {
      console.error('User email and password not found.');
      throw new Error('User email and password are required for this operation.');
    }
    const response = await axiosInstance.delete(`/cancel-booking`, {
      data: data,
      headers: {
        'User-Email': userEmail,
        'User-Password': userPassword
      }
    });
    console.log("response", response.data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};