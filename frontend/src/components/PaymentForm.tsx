import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Assuming you're using axios for HTTP requests

const StripePaymentForm = () => {
  const [amount, setAmount] = useState('');
  //const navigate = useNavigate();

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      const { data } = await axios.post('/topup', {
        amount: parseFloat(amount),
      });

      if (data.url) {
        // Redirect user to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(`Error in top-up: ${error}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Top Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Top Up</button>
      </form>
    </div>
  );
};

export default StripePaymentForm;
