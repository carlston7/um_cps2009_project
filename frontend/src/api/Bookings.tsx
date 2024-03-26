import axiosInstance from './AxiosInstance';
import { Booking } from '../models/Bookings';
import { toast } from 'react-toastify';

export const bookCourt = async (booking: Booking): Promise<void> => {
    try {
      await axiosInstance.post('/book-court', booking);
      toast.success('Court booked successfully');
    } catch (error) {
      console.error('Error booking court:', error);
      toast.error('Failed to book the court');
      throw error;
    }
  };