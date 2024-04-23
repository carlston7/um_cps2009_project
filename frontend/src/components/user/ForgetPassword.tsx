import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import { apiForgetPassword } from '../../api/Login';

export const ForgetPasswordForm = () => {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await apiForgetPassword({ code, newPassword: password });
            toast.success('Password reset successful. You are now logged in.');
            navigate('/');
        } catch (error) {
            toast.error('Password reset failed. Please try again.');
            console.log(error);
        }
    };

    return (
        <div style={{ padding: '20px', width: '300px', margin: 'auto' }}>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter your reset code"
                    required
                    style={{ width: '100%', margin: '10px 0', padding: '10px' }}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    required
                    style={{ width: '100%', margin: '10px 0', padding: '10px' }}
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    required
                    style={{ width: '100%', margin: '10px 0', padding: '10px' }}
                />
                <Button style={{ width: '100%', marginTop: '10px' }}>Reset Password</Button>
            </form>
        </div>
    );
};
