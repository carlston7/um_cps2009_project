import axiosInstance from './AxiosInstance';
import { Booking } from '../models/Bookings';

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
    } catch (error) {
      console.error('Error booking court:', error);
      throw error;
    }
};