import axiosInstance from './AxiosInstance';
import { Booking } from '../models/Bookings';
import { fetchUserCredit } from './User';

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

export const fetchBookings = async (): Promise<Booking[]> => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    console.error('User email not found.');
    throw new Error('You must be logged in to view bookings.');
  }

  try {
    const response = await axiosInstance.post('/user-bookings', { email: userEmail });
    return response.data; // Assuming the response data is an array of bookings
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};