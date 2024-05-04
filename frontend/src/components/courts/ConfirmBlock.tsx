import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/AxiosInstance';
import { toast } from 'react-toastify';
import { containerStyle } from '../ui/Background';
import { Court } from '../../models/Courts';
import { MyBookings } from '../../models/Bookings';

const ConfirmBlock = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    if (!state) {
        return <div style={containerStyle}>No data available.</div>;
    }
    // Extract courts and dates from the navigation state
    const { courts = [], dates = [], bookings = [] } = state;
    console.log("courts; ", courts, "dates; ", dates)
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/admin/block-courts', {
                courts: courts.map((court: { _id: any; }) => court._id),
                dates,
            }, {
                headers: {
                    'User-Email': localStorage.getItem('userEmail'),
                } // Remove the extra comma here
            });

            if (response.status === 200) {
                toast.success('Courts successfully blocked!');
                navigate('/'); // Redirect to dashboard or any other appropriate route
            } else {
                throw new Error('Failed to block courts');
            }
        } catch (error) {
            toast.error("Error");
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Confirm Block of Courts</h2>
            <h3>Selected Dates</h3>
            <ul>
                {dates.map((date: string) => (
                    <li key={date}>{date}</li>
                ))}
            </ul>
            <h3>Selected Courts</h3>
            <ul>
                {courts.map((court: Court) => (
                    <li key={court._id}>{court.name}</li>
                ))}
            </ul>
            <h3>Bookings to be Refunded</h3>
            <ul>
                {bookings.map((booking: MyBookings) => (
                    <li key={booking._id}>
                        {booking.court_name} - {new Date(new Date(booking.start).getTime() - 2 * 60 * 60 * 1000).toLocaleString()}
                    </li>
                ))}
            </ul>
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Blocking...' : 'Confirm Block'}
            </button>
        </div>
    );
};

export default ConfirmBlock;
