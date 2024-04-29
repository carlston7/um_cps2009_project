import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/AxiosInstance';

export const SendFriendRequest = () => {
    const [email, setEmail] = useState('');
    const handleSendRequest = async () => {
        try {
            await axiosInstance.post('/friends/request', { receiverEmail: email }, {
                headers: { 'user-email': localStorage.getItem('userEmail') }
            });
            toast.success('Friend request sent successfully!');
            setEmail('');
        } catch (error: any) {
            console.error('Failed to send friend request:', error.response?.data.message || error.message);
            toast.error('Failed to send friend request');
        }
    };

    return (
        <div>
            <input
                type="email"
                value={email}
                placeholder="Enter friend's email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSendRequest}>Send Friend Request</button>
        </div>
    );
};
