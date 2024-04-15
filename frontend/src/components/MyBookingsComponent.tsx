import React, { useState, useEffect } from 'react';
import { fetchBookings } from '../api/Bookings';
import { MyBookings } from '../models/Bookings';
import { toast } from 'react-toastify';
import { containerStyle } from './ui/Background';

const BookingsComponent: React.FC = () => {
    const [pastBookings, setPastBookings] = useState<MyBookings[]>([]);
    const [futureBookings, setFutureBookings] = useState<MyBookings[]>([]);

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
    const bookingEntryStyle = {
        backgroundColor: '#708090', // Light Grey
        padding: '10px',
        margin: '10px 0',
        alignItems: 'center',
        borderRadius: '5px',
    };
    const bookingsContainerStyle = {
        display: 'flex',        // This will layout the child divs in a row
        justifyContent: 'center', // This will add space between the child divs
        alignItems: 'flex-start' // This will align the child divs at their start edge vertically
    };
    const formatBookingTime = (booking: { start: string | number | Date; }) => {
        const startTime = new Date(booking.start);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Add 1 hour

        return `${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`;
    };

    return (
        <div style={bookingsContainerStyle}>
            <div style={{ ...containerStyle, marginRight: '10px', alignItems: 'flex-start' }}>
                <h2 style={pastBookingStyle}>Past Bookings</h2>
                {pastBookings.map((booking, index) => (
                    <div key={index} style={bookingEntryStyle}>
                        <p>Date: {new Date(booking.start).toLocaleDateString()}</p>
                        <p>Time: {formatBookingTime(booking)}</p>
                        <p>Court: {booking.court_name || 'Unknown Court'}</p>
                    </div>
                ))}
            </div>
            <div style={{ ...containerStyle, marginLeft: '10px', alignItems: 'flex-start' }}>
                <h2 style={futureBookingStyle}>Future Bookings</h2>
                {futureBookings.map((booking, index) => (
                    <div key={index} style={bookingEntryStyle}>
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
