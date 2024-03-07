import React, { useState } from 'react';
import { apiLogin } from '../api/Login';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { containerStyle } from './background';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await apiLogin({ email, password });
            login(response.data.token);
            toast.success('Login successful');
            navigate('/');
        } catch (error) {
            toast.error('Login failed');
            console.log(error);
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center' }}>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px' }}
                />
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px' }}
                    />
                    <div onClick={togglePasswordVisibility} style={{ position: 'absolute', top: '20px', right: '10px', cursor: 'pointer' }}>
                        {showPassword ? <FaEyeSlash size="1em" color="black" /> : <FaEye size="1em" color="black" />}
                    </div>
                </div>
                <Button variant="default" size="default" style={{ width: '100%', marginTop: '10px' }}>Login</Button>
                <p style={{ textAlign: 'center', marginTop: '20px' }}>Not a member? <Link to="/signup">Sign up now</Link></p>
            </form>
        </div>
    );
};
