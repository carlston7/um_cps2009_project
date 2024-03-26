import React from 'react';
import { Booking } from '../models/Bookings'; // Assuming Booking model is defined there
import { bookCourt } from '../api/Bookings'; // Assuming the bookCourt function is exported from here
import { Court } from '../models/Courts';

interface Props {
  date: string;
  time: string; // need to update this to be dateTime
  court: Court; 
  onBookingSuccess: () => void; // Callback function to inform parent component about successful booking
}

export const BookCourt: React.FC<Props> = ({ date, time, court, onBookingSuccess }) => {
  const handleConfirmClick = async () => {
    const booking: Booking = {
      date, // need to update this to be dateTime
      time,
      courtId: court.id,
    };
    await bookCourt(booking);
    onBookingSuccess();
  };

  return (
    <div>
      <h2>Confirm Your Booking</h2>
      <p>Date: {date}</p>
      <p>Time: {time}</p>
      <p>Court: {court.name}</p>
      <button onClick={handleConfirmClick}>Confirm Booking</button>
    </div>
  );
};