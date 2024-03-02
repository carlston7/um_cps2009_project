import React, { useState } from 'react';
import { signup } from '../api/Signup';
import usePasswordVisibility from '../hooks/Password'; // Adjust the path as necessary

export const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false); // New state to manage password error
    const { passwordShown, togglePasswordVisibility } = usePasswordVisibility();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(password !== confirmPassword) {
            setPasswordError(true); // Set password error state to true
            return;
        } else {
            setPasswordError(false); // Reset password error state
        }

        try {
            const response = await signup({ email, password });
            console.log('Signup successful', response.data);
        } catch (error) {
            console.error('Signup failed', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <div>
                <input
                    type={passwordShown ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    style={{ borderColor: passwordError ? 'red' : 'initial' }} // Conditional styling based on passwordError
                />
                <button type="button" onClick={togglePasswordVisibility}>
                    {passwordShown ? 'Hide' : 'Show'}
                </button>
            </div>
            <div>
                <input
                    type={passwordShown ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                    style={{ borderColor: passwordError ? 'red' : 'initial' }} // Conditional styling based on passwordError
                />
                {passwordError && <div style={{ color: 'red' }}>Passwords do not match.</div>}
            </div>
            <button type="submit">Sign Up</button>
        </form>
    );
};
