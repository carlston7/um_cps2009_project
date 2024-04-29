import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/AxiosInstance';
import { containerStyle } from '../ui/Background';

const EmailConfirmation = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        console.log("EmailConfirmation.tsx: token: ", token);
        if (!token) {
            toast.error("Invalid access. No token provided.");
            navigate('/');
            return;
        }
        axiosInstance.get(`/confirm-email?token=${token}`)
            .then((response) => {
                toast.success(response.data.message);
                navigate('/login'); // Redirect to login after successful confirmation
            })
            .catch((error) => {
                toast.error(error.response?.data?.error || 'An unknown error occurred. Please try again.');
                navigate('/');
            });
    }, [token, navigate]);

    return (
        <div style={containerStyle}>
            <h1 style={containerStyle}>Confirming Your Email...</h1>
        </div>
    );
};

export default EmailConfirmation;
