// EmailConfirmation component
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../api/AxiosInstance';

const EmailConfirmation = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error("Invalid access. No token provided.");
            navigate('/');
            return;
        }
        axiosInstance.get(`/confirm-email?token=${token}`)
        .then((response) => {
            toast.success(response.data.message);
            navigate('/login');
        })
        .catch((error) => {
            console.log("Error confirming email", error);
            toast.error('Failed to confirm email. Please try again.');
            navigate('/');
        });
    }, [token, navigate]);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Confirming Your Email...</h1>
        </div>
    );
};

export default EmailConfirmation;
