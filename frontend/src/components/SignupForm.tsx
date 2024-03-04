import React, { useState } from 'react';
import { apiSignup } from '../api/Signup';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const SignupForm = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const { login } = useAuth();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleRePasswordVisibility = () => setShowRePassword(!showRePassword);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== rePassword) {
            toast("Passwords don't match");
            return;
        }
        try {
            const response = await apiSignup({ name, surname, email, password });
            login(response.data.token);
            toast('Signup successful', response.data);
            navigate('/');
        } catch (error) {
            toast('Signup failed');
            console.log(error);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center' }}>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                    style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px' }}
                />
                <input
                    type="name"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="Surname"
                    required
                    style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px' }}
                />
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
                    <div onClick={togglePasswordVisibility} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>
                        {showPassword ? <FaEyeSlash size="1em" color="black" /> : <FaEye size="1em" color="black" />}
                    </div>
                </div>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showRePassword ? "text" : "password"}
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                        placeholder="Re-enter Password"
                        required
                        style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px' }}
                    />
                    <div onClick={toggleRePasswordVisibility} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>
                        {showRePassword ? <FaEyeSlash size="1em" color="black" /> : <FaEye size="1em" color="black" />}
                    </div>
                </div>
                <Button variant="default" size="default" style={{ width: '100%', marginTop: '20px' }}>Sign Up</Button>
                <p style={{ textAlign: 'center', marginTop: '20px' }}>Already a member? <Link to="/login">Login here</Link></p>
            </form>
        </div>
    );
};
