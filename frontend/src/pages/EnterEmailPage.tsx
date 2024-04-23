import React, { useState } from 'react';
import { apiEmailOneTimeCode } from '../api/Login';
import { Button } from '../components/ui/button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailOneTimeCodePage = () => {
    const [email_address, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            const response = await apiEmailOneTimeCode({ email_address });  // Adjusted to match expected API input
            console.log(response);
            navigate('/forget-password');
            toast.success('A one-time code has been sent to your email.');
        } catch (error) {
            toast.error('Failed to send one-time code. Please try again.');
            console.error('Email one-time code error:', error);
            navigate('/');
        }
    };

    return (
        <div style={{ padding: '20px', width: '300px', margin: 'auto' }}>
            <h2>Get One-Time Code</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email_address}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                />
                <Button style={{ width: '100%', padding: '10px' }}>Send Code</Button>
            </form>
        </div>
    );
};

export default EmailOneTimeCodePage;
