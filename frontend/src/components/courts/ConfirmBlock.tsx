import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/AxiosInstance';
import { toast } from 'react-toastify';

const ConfirmBlock = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Extract courts and dates from the navigation state
    const { courts, dates } = state;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/admin/block-courts', {
                courts: courts.map((court: { _id: any; }) => court._id),
                dates,
                userEmail: localStorage.getItem('userEmail') // Ensure the user email is stored in local storage
            });

            if (response.status === 200) {
                toast.success('Courts successfully blocked!');
                navigate('/dashboard'); // Redirect to dashboard or any other appropriate route
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
                {dates.map((date: boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.Key | null | undefined) => (
                    <li key={date ? String(date) : undefined}>{String(date)}</li>
                ))}
            </ul>
            <h3>Selected Courts</h3>
            <ul>
                {courts.map((court: { _id: React.Key | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                    <li key={court._id}>{court.name}</li>
                ))}
            </ul>
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Blocking...' : 'Confirm Block'}
            </button>
        </div>
    );
};

export default ConfirmBlock;
