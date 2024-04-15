import React, { useState, useEffect } from 'react';
import { fetchBookings } from '../api/Bookings';
import { Booking } from '../models/Bookings';
import { toast } from 'react-toastify';

const BookingsComponent: React.FC = () => {
    const [pastBookings, setPastBookings] = useState<Booking[]>([]);
    const [futureBookings, setFutureBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const getBookings = async () => {
            try {
                const bookings = await fetchBookings();
                const now = new Date();
                const sortedBookings = bookings.sort((a, b) =>
                    new Date(a.dateTimeIso).getTime() - new Date(b.dateTimeIso).getTime()
                );

                setPastBookings(sortedBookings.filter(booking => new Date(booking.dateTimeIso) < now));
                setFutureBookings(sortedBookings.filter(booking => new Date(booking.dateTimeIso) >= now));
            } catch (error) {
                console.error(error);
                toast.error("Could not get bookings");
            }
        };

        getBookings();
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
            <div style={{ marginRight: '10px' }}>
                <h2>Past Bookings</h2>
                {pastBookings.map(booking => (
                    <div key={booking.dateTimeIso}>
                        <p>Court: {booking.courtName}</p>
                        <p>Date: {new Date(booking.dateTimeIso).toLocaleString()}</p>
                    </div>
                ))}
            </div>
            <div style={{ marginLeft: '10px' }}>
                <h2>Future Bookings</h2>
                {futureBookings.map(booking => (
                    <div key={booking.dateTimeIso}>
                        <p>Court: {booking.courtName}</p>
                        <p>Date: {new Date(booking.dateTimeIso).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingsComponent;
