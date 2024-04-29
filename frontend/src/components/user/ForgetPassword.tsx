import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import { apiForgetPassword, apiLogin } from '../../api/Login';
import { useAuth } from '../../context/AuthContext';
import { containerStyle } from '../ui/Background';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const ForgetPasswordForm = () => {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleRePasswordVisibility = () => setShowRePassword(!showRePassword);
    
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await apiForgetPassword({ code, newPassword: password });
            const response = await apiLogin({ email: localStorage.getItem('userEmail') ?? '', password: localStorage.getItem('userPassword') ?? ''});
            login(response.data.token);
            toast.success('Password reset successful. You are now logged in.');
            navigate('/');
        } catch (error) {
            toast.error('Password reset failed. Please try again.');
            console.log(error);
        }
    };

    return (
        <div style={containerStyle}>
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
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        required
                        style={{ width: '100%', margin: '10px 0', padding: '10px' }}
                        
                    />
                    <div onClick={togglePasswordVisibility} style={{ position: 'absolute', top: '20px', right: '10px', cursor: 'pointer' }}>
                            {showPassword ? <FaEyeSlash size="1em" color="black" /> : <FaEye size="1em" color="black" />}
                        </div>
                    </div>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showRePassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        required
                        style={{ width: '100%', margin: '10px 0', padding: '10px' }}
                    />
                    <div onClick={toggleRePasswordVisibility} style={{ position: 'absolute', top: '20px', right: '10px', cursor: 'pointer' }}>
                            {showRePassword ? <FaEyeSlash size="1em" color="black" /> : <FaEye size="1em" color="black" />}
                        </div>
                    </div>
                <Button style={{ width: '100%', marginTop: '10px' }}>Reset Password</Button>
            </form>
        </div>
    );
};
