import React, { useState, useEffect } from 'react';
import { fetchBookings } from '../../api/Bookings';
import { MyBookings } from '../../models/Bookings';
import { toast } from 'react-toastify';
import { containerStyle } from '../ui/Background';
import { useNavigate } from 'react-router-dom';

const BookingsComponent: React.FC = () => {
    const [pastBookings, setPastBookings] = useState<MyBookings[]>([]);
    const [futureBookings, setFutureBookings] = useState<MyBookings[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getBookings = async () => {
            try {
                const bookings = await fetchBookings();
                const now = new Date();
                const sortedBookings = bookings.sort((a, b) =>
                    new Date(a.start).getTime() - new Date(b.start).getTime()
                );

                setPastBookings(sortedBookings.filter(booking => new Date(booking.start) < now));
                setFutureBookings(sortedBookings.filter(booking => new Date(booking.start) >= now));
            } catch (error) {
                console.error(error);
                toast.error("Could not get bookings");
            }
        };

        getBookings();
    }, []);
    const pastBookingStyle = {
        backgroundColor: '#a2d2ff', // Light Blue
        padding: '10px',
        margin: '10px',
        alignItems: 'center',
        borderRadius: '10px',
    };

    const futureBookingStyle = {
        backgroundColor: '#ffb5a7', // Soft Red
        margin: '10px',
        padding: '10px',
        alignItems: 'center',
        borderRadius: '10px',
    };
    const bookingEntryStyle: React.CSSProperties = {
        backgroundColor: '#708090', // Light Grey
        padding: '10px',
        margin: '10px 0',
        alignItems: 'center',
        borderRadius: '5px',
        flexDirection: 'column',
    };
    const bookingsContainerStyle = {
        display: 'flex',        // This will layout the child divs in a row
        justifyContent: 'center', // This will add space between the child divs
        alignItems: 'flex-start' // This will align the child divs at their start edge vertically
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

    const navigateToCancel = (booking: MyBookings) => {
        console.log("Booking sent: ", booking);
        if (!booking || !booking._id) {
            console.error("Invalid booking object:", booking);
            toast.error("Invalid booking data");
            return;
        }
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            console.error("No user email found in localStorage");
            toast.error("User email is not available");
            return;
        }

        navigate(`/cancel-booking/${booking._id}`, {
            state: {
                booking: booking, // assuming booking is a full object with all details
                userEmail: userEmail,
            }
        });
    };

    return (
        <div style={bookingsContainerStyle}>
            <div style={{ ...containerStyle, marginRight: '20px', alignItems: 'flex-column' }}>
                <h2 style={pastBookingStyle}>Past Bookings</h2>
                {pastBookings.map((booking, index) => (
                    <div key={index} style={bookingEntryStyle}>
                        <p>Date: {new Date(booking.start).toLocaleDateString()}</p>
                        <p>Time: {formatBookingTime(booking)}</p>
                        <p>Court: {booking.court_name || 'Unknown Court'}</p>
                    </div>
                ))}
            </div>
            <div style={{ ...containerStyle, marginLeft: '20px', alignItems: 'flex-column' }}>
                <h2 style={futureBookingStyle}>Future Bookings</h2>
                {futureBookings.map((booking, index) => (
                    <div key={index} style={{ ...bookingEntryStyle, cursor: 'pointer' }} onClick={() => navigateToCancel(booking)}>
                        <p>Date: {new Date(booking.start).toLocaleDateString()}</p>
                        <p>Time: {formatBookingTime(booking)}</p>
                        <p>Court: {booking.court_name || 'Unknown Court'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingsComponent;
