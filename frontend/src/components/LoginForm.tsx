import React, { useState } from 'react';
import { login } from '../api/Login';
import usePasswordVisibility from '../hooks/Password'; 
export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { passwordShown, togglePasswordVisibility } = usePasswordVisibility();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await login({ email, password });
            console.log('Login successful', response.data);
        } catch (error) {
            console.error('Login failed', error);
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
                />
                <button type="button" onClick={togglePasswordVisibility}>
                    {passwordShown ? 'Hide' : 'Show'}
                </button>
            </div>
            <button type="submit">Login</button>
        </form>
    );
};
