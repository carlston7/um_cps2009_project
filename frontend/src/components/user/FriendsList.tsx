import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { containerStyle } from '../ui/Background';
import axiosInstance from '../../api/AxiosInstance';

export const FriendsList = () => {
    const [friends, setFriends] = useState<any[]>([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axiosInstance.get('/friends/list', {
                    headers: { 'user-email': localStorage.getItem('userEmail') }
                });
                setFriends(response.data);
            } catch (error) {
                console.error('Error fetching friends:', error);
                toast.error('Failed to fetch friends');
            }
        };

        fetchFriends();
    }, []);

    return (
        <div style={containerStyle}>
            <h2>My Friends</h2>
            {friends.length > 0 ? (
                <ul>
                    {friends.map(friend => (
                        <li key={friend.email}>{friend.email}</li>
                    ))}
                </ul>
            ) : (
                <p>No friends to display.</p>
            )}
        </div>
    );
};
