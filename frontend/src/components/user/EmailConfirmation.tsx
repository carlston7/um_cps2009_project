import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/AxiosInstance';
import { containerStyle } from '../ui/Background';

const EmailConfirmation = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Component mounted.");
        if (!token) {
            console.log("No token provided.");
            toast.error("Invalid access. No token provided.");
            navigate('/');
            setTimeout(() => { 
                return;
            }, 2000);
        }
        axiosInstance.get(`/confirm-email?token=${token}`)
            .then((response) => {
                console.log("Email confirmation response:", response.data);
                toast.success(response.data.message);
                navigate('/login'); // Redirect to login after successful confirmation
            })
            .catch((error) => {
                // Error handling based on the response status code
                if (error.response) {
                    switch (error.response.status) {
                        case 400: // Bad request, likely invalid token
                            toast.error('Invalid or expired token2.');
                            break;
                        case 500: // Server error
                            toast.error('Server error. Please try again later.');
                            break;
                        default:
                            toast.error('An unknown error occurred. Please try again.');
                    }
                } else {
                    // Handle errors without a response (network errors, etc.)
                    toast.error('Network error. Please check your internet connection.');
                }
                navigate('/'); // Redirect to home on error
            });
    }, [token, navigate]);

    return (
        console.log("Component unmounting."),
        <div style={containerStyle}>
            <h1>Confirming Your Email...</h1>
        </div>
    );
};

export default EmailConfirmation;
