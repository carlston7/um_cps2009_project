import React, { useState } from 'react';
import axiosInstance from '../api/AxiosInstance';
import { containerStyle } from './ui/Background';
import { apiLogin } from '../api/Login';
import { toast } from 'react-toastify';

const TopUp = () => {
  const [amount, setAmount] = useState('');

  const handleTopUp = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      const { data } = await axiosInstance.post('/topup', {
        email: localStorage.getItem('userEmail'), 
        amount: parseFloat(amount),
      });
      if (data.url) {
        window.location.href = data.url; // Redirect user to Stripe Checkout

        const userEmail = localStorage.getItem('userEmail');
        const userPassword = localStorage.getItem('userPassword');
        if (userEmail && userPassword) {
          await apiLogin({ email: userEmail, password: userPassword });
        }
      }
    } catch (error) {
      console.error('Error during top-up:', error);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Top Up</h2>
      <form onSubmit={handleTopUp}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />
        <button type="submit">Top Up</button>
      </form>
    </div>
  );
};

export default TopUp;
