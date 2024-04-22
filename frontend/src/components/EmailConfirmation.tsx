// EmailConfirmation component
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmailConfirmation = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/confirm-email?token=${token}`)
            .then(() => {
                toast.success('Email confirmed successfully!');
                navigate('/login');
            })
            .catch((error) => {
                console.log("Error confirming email", error);
                toast.error('Failed to confirm email. Please try again.');
                navigate('/');
            });
    }, [token, navigate]);

    return (
        <div>Loading...</div>
    );
};

export default EmailConfirmation;
