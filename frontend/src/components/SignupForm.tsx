import React, { useState } from 'react';
import { apiSignup } from '../api/Signup';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { containerStyle } from './ui/Background';

export const SignupForm = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    // const { login } = useAuth();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleRePasswordVisibility = () => setShowRePassword(!showRePassword);
    const navigate = useNavigate();
    const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== rePassword) {
            toast.error("Passwords don't match");
            return;
        }
        try {
            await apiSignup({ name, surname, email, password });
            setAwaitingConfirmation(true);
            toast.info('Waiting for email confirmation');
            // login(response.data.token);
            // navigate('/');
        } catch (error) {
            toast.error('Signup failed');
            console.log(error);
        }
    };
    if (awaitingConfirmation) {
        console.log('awaiting confirmation');
        return (
            <div style={containerStyle}>
                <h2 style={{ textAlign: 'center' }}>Confirm Your Email</h2>
                <p style={{ textAlign: 'center' }}>
                    A confirmation email has been sent to <strong>{email}</strong>.
                    Please check your inbox and click the link to activate your account.
                </p>
                <Button onClick={() => navigate('/login')} style={{ width: '100%', marginTop: '20px' }}>
                    Go to Login
                </Button>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
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
                    <div onClick={togglePasswordVisibility} style={{ position: 'absolute', top: '20px', right: '10px', cursor: 'pointer' }}>
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
                    <div onClick={toggleRePasswordVisibility} style={{ position: 'absolute', top: '20px', right: '10px', cursor: 'pointer' }}>
                        {showRePassword ? <FaEyeSlash size="1em" color="black" /> : <FaEye size="1em" color="black" />}
                    </div>
                </div>
                <Button variant="default" size="default" style={{ width: '100%', marginTop: '20px' }}>Sign Up</Button>
                <p style={{ textAlign: 'center', marginTop: '20px' }}>Already a member? <Link to="/login">Login here</Link></p>
            </form>
        </div>
    );
};
