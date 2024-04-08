import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiEditProfile } from '../api/Profile'; // Update the import path according to your project structure
import { containerStyle } from './ui/Background';
import { toast } from 'react-toastify';

const EditProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        email: localStorage.getItem('userEmail') || '',
        name: localStorage.getItem('userName') || '',
        surname: localStorage.getItem('userSurname') || '',
        password: localStorage.getItem('userPassword') || '',
    });

    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            await apiEditProfile(profile);
            toast.success("Details changed")

            navigate('/profile');
        } catch (error) {
            console.error('Failed to edit profile:', error);
            toast.error('Failed to edit profile');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={containerStyle}>
                <h2 >Edit Profile</h2>
                <label>
                    Email:
                    <input type="email" name="email" value={profile.email} onChange={handleChange} required />
                </label>
                <label>
                    Name:
                    <input type="text" name="name" value={profile.name} onChange={handleChange} required />
                </label>
                <label>
                    Surname:
                    <input type="text" name="surname" value={profile.surname} onChange={handleChange} required />
                </label>
                <button type="submit">Submit Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;
