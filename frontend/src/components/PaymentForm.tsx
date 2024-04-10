import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/AxiosInstance';
import { containerStyle } from './ui/Background';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiLogin } from '../api/Login';

const TopUp = () => {
  const [amount, setAmount] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Check for session_id in the URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const session_id = searchParams.get('session_id');
    
    if (session_id) {
      axiosInstance.post('/success', { session_id, email: localStorage.getItem('userEmail') })
        .then(async ({ data }) => { // Mark this function as async
          toast.success("Balance updated successfully");
          console.log('Balance updated successfully:', data);
          // Now call apiLogin to refresh user details including balance
          try {
            const email = localStorage.getItem('userEmail');
            const password = localStorage.getItem('userPassword'); // Assuming password is stored, which is not recommended
            if (email && password) {
              await apiLogin({ email, password }); // Update the user's session details
              toast.success("User details updated");
            }
          } catch (loginError) {
            console.error('Error updating user details:', loginError);
          }
          navigate('/profile'); // Navigate after updating details
        })
        .catch(error => {
          console.error('Error updating balance with session_id:', error);
        });
    }
  }, [navigate]);

  const handleTopUp = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      const { data } = await axiosInstance.post('/topup', {
        email: localStorage.getItem('userEmail'), 
        amount: parseFloat(amount),
      });
      if (data.url) {
        window.location.href = data.url;
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