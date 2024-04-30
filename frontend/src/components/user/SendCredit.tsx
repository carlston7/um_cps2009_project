import React, { useState } from 'react';
import { toast } from 'react-toastify';
import sendCredit from '../../api/User';
import { containerStyle } from '../ui/Background';
import { useNavigate } from 'react-router-dom';

const SendCreditForm = () => {
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();

    const handleSendCredit = async () => {
        if (!email || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid email and amount');
            return;
        }
        try {
            const response = await sendCredit(email, parseFloat(amount));
            toast.success(response.message);
            navigate('/profile');
            setEmail('');
            setAmount('');
        } catch (e) {
            toast.error('Failed to send credit: ' + e);
        }
    };

    return (
        <div style={containerStyle}>
            <h3>Send Credit</h3>
            <input
                type="email"
                placeholder="Enter friend's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
            />
            <button onClick={handleSendCredit} style={{ width: '100%' }}>
                Send Credit
            </button>
        </div>
    );
};

export default SendCreditForm;
