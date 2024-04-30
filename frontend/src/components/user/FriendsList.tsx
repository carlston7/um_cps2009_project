import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'; // Assuming you are using react-router for navigation
import { containerStyle } from '../ui/Background';
import axiosInstance from '../../api/AxiosInstance';
import { SendFriendRequest } from './SendFriendRequest'; // Adjust the import path as necessary

export const FriendsList = () => {
    const [friends, setFriends] = useState<any[]>([]);
    const [friendRequestsCount, setFriendRequestsCount] = useState(0);

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

        const fetchFriendRequestsCount = async () => {
            try {
                const response = await axiosInstance.get('/friends/requests/count', {
                    headers: { 'user-email': localStorage.getItem('userEmail') }
                });
                setFriendRequestsCount(response.data.count);
            } catch (error) {
                console.error('Error fetching friend requests count:', error);
                toast.error('Failed to fetch friend requests count');
            }
        };

        fetchFriends();
        fetchFriendRequestsCount();
    }, []);

    return (
        <div style={containerStyle}>
            <h2>My Friends</h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
                <div>
                    {friends.length > 0 ? (
                        <ul>
                            {friends.map(friend => (
                                <li key={friend.email}>{friend.email}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No friends to display.</p>
                    )}
                    {friendRequestsCount > 0 && (
                        <p>
                            You have {friendRequestsCount} active friend request(s).{' '}
                            <Link to="/friends/respond">Click here to review them.</Link>
                        </p>
                    )}
                </div>
            </div>
            <SendFriendRequest />
        </div>
    );
};
