import React from 'react';
import { useNavigate } from 'react-router-dom';
import { containerStyle } from './ui/Background';

const ProfileInformation = () => {
    // Hook to navigate programmatically
    const navigate = useNavigate();

    // Fetch user data from localStorage
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const userSurname = localStorage.getItem('userSurname');
    const userCredit = localStorage.getItem('userCredit');
    const userType = localStorage.getItem('userType');

    // Handler for the top-up button
    const handleTopUp = () => {
        navigate('/topup');
    };

    return (
        <div className="container profile-page" style={containerStyle}>
            <h2>User Profile</h2>
            <div className="user-info">
                <p><strong>Email:</strong> {userEmail}</p>
                <p><strong>Name:</strong> {userName}</p>
                <p><strong>Surname:</strong> {userSurname}</p>
                <p><strong>Credit:</strong> ${userCredit}</p>
                <p><strong>Type:</strong> {userType}</p>
            </div>
            <button onClick={handleTopUp} className="btn btn-primary">Top Up Credit</button>
            <button onClick={() => navigate('/edit-profile')} className="btn btn-secondary">Edit Profile</button>
        </div>
    );
};

export default ProfileInformation;
