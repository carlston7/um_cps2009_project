import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiCancelBooking } from '../../api/Bookings'; // Import the cancellation function
import { toast } from 'react-toastify';
import { containerStyle } from '../ui/Background';
import { fetchUserCredit } from '../../api/User';

const CancelBookingComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { booking, userEmail } = location.state || {}; // Assuming booking and userEmail are passed via state

    const cancelBooking = async () => {
        if (!booking || !userEmail) {
            toast.error('Invalid booking data');
            return;
        }

        try {
            await apiCancelBooking({
                _id: booking._id,
                court_name: booking.court_name,
                user_email: userEmail
            });
            toast.success('Booking successfully cancelled.');
            await fetchUserCredit(); // Update the user's credit
            navigate('/my-bookings'); // Redirect to my-bookings
        } catch (error) {
            toast.error('Failed to cancel the booking');
        }
    };

    const handleCancel = () => {
        navigate('/'); // Navigate back to homepage
    };
    const formatBookingTime = (booking: { start: string | number | Date; }) => {
        console.log("Booking time", booking)
        const startTime = new Date(booking.start);
        const formattedStartTime = startTime.toISOString().replace('Z', '').replace('T', ' ');
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Add 1 hour
        const formattedEndTime = endTime.toISOString().replace('Z', '').replace('T', ' ');
        const startTimeOnly = formattedStartTime.split(' ')[1].substring(0, 5);
        const endTimeOnly = formattedEndTime.split(' ')[1].substring(0, 5);
        return `${startTimeOnly} - ${endTimeOnly}`;
    };

    return (
        <div style={containerStyle}>
            <h2>Are you sure you want to cancel this booking?</h2>
            {booking && (
                <>
                    <p><strong>Court:</strong> {booking.court_name}</p>
                    <p><strong>Time Slot:</strong> {formatBookingTime(booking)}</p>
                    <p><strong>Date:</strong> {new Date(booking.start).toLocaleDateString()}</p>
                    {/* Use the formattedTime from the state */}
                </>
            )}
            <button onClick={cancelBooking} style={{ marginRight: '20px' }}>
                Yes, cancel my booking
            </button>
            <button onClick={handleCancel}>
                No, take me back
            </button>
        </div>
    );
};

export default CancelBookingComponent;
