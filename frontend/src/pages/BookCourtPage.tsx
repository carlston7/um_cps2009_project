import React from 'react';
import { useCourt } from '../context/CourtContext'; // Adjust import paths as necessary
import { bookCourt } from '../api/Bookings';
import { toast } from 'react-toastify';
import { containerStyle } from '../components/ui/Background';
import { useNavigate } from 'react-router-dom';

const BookCourtPage = () => {
    const { selectedCourt, date, time, price } = useCourt();
    const navigate = useNavigate();

    const handleBookingConfirmation = async () => {
        if (!selectedCourt) {
            // Handle error: No court selected
            return;
        }

        try {
            const bookingDetails = {
                dateTimeIso: `${date}T${time}:00`,
                courtName: selectedCourt.name, // Use _id instead of id
            };
            await bookCourt(bookingDetails);
            toast.success("Court booked successfully");
        } catch (error) {
            toast.error("Failed to book court");
        }
    };

    if (!selectedCourt) {
        return <div>Select a court first.</div>;
    }
    return (
        <div style={containerStyle}>
            <h2>Confirm Your Booking</h2>
            <p>Date: {date}</p>
            <p>Time: {time}</p>
            <p>Court: {selectedCourt.name}</p>
            <p>Price: {price}</p>
            <button onClick={handleBookingConfirmation}>Confirm Booking</button>
            <button onClick={() => navigate('/view-courts')}>Back to Viewing Courts</button>
        </div>
    );
};

export default BookCourtPage;
