import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { containerStyle } from '../ui/Background';

interface FriendRequest {
  senderEmail: string;
}

export const RespondToRequests = () => {
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('/api/friends/requests', {
                    headers: { 'user-email': localStorage.getItem('userEmail') }
                });
                console.log("Fetch Friend Requests:", response.data);  // Log the response data
                // Ensure the data is an array
                const data = Array.isArray(response.data) ? response.data : [];
                setRequests(data);
            } catch (error) {
                console.error('Error fetching friend requests:', error);
                toast.error('Failed to fetch friend requests');
            }
        };

        fetchRequests();
    }, []);

    const handleResponse = async (senderEmail: string, accept: boolean) => {
        try {
            await axios.post('/api/friends/respond', { senderEmail, accept }, {
                headers: { 'user-email': localStorage.getItem('userEmail') }
            });
            // Update requests state to remove the handled request
            setRequests(prevRequests => prevRequests.filter(req => req.senderEmail !== senderEmail));
            toast.success(`Request ${accept ? 'accepted' : 'declined'}`);
        } catch (error) {
            console.error('Error responding to request:', error);
            toast.error('Failed to respond to request');
        }
    };

    return (
        <div style={containerStyle}>
            <h2>Incoming Friend Requests</h2>
            {requests.length > 0 ? (
                requests.map((request, index) => (
                    <div key={index}>
                        <p>{request.senderEmail}</p>
                        <button onClick={() => handleResponse(request.senderEmail, true)}>Accept</button>
                        <button onClick={() => handleResponse(request.senderEmail, false)}>Decline</button>
                    </div>
                ))
            ) : (
                <p>No incoming friend requests.</p>
            )}
        </div>
    );
};
