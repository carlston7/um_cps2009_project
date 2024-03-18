import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiCreatePaymentIntent } from '../api/Payment'; 
import { Button } from './ui/button';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { containerStyle } from './ui/Background'; 

export const StripePaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (!stripe || !elements) {
      toast.error('Stripe has not been properly initialized.');
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Payment failed: Unable to find card details');
      setLoading(false);
      return;
    }
  
    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
  
    if (paymentMethodError) {
      console.error('[error]', paymentMethodError);
      toast.error(`Payment failed: ${paymentMethodError.message}`);
      setLoading(false);
      return; // Early return on error
    }

    // Assuming apiCreatePaymentIntent correctly handles the creation and returns the clientSecret
    try {
      const { data: { clientSecret } } = await apiCreatePaymentIntent(paymentMethod.id, 'https://example.com/return_url');
      console.log("client secret: ", clientSecret);
      
      const { error: confirmationError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });
  
      if (confirmationError) {
        console.error('[confirmError]', confirmationError);
        toast.error(`Payment confirmation failed: ${confirmationError.message}`);
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('[PaymentIntent]', paymentIntent);
        toast.success('Payment successful');
        navigate('/'); // Navigate to home or success page
        setLoading(false);
      } else {
        // Handle other paymentIntent statuses as needed (requires_action, processing, etc.)
        toast.error('Payment process was not successful. Please try again or contact support if this issue persists.');
        setLoading(false);
      }
    } catch (error) {
      toast.error('Payment process failed');
      console.error(error);
      setLoading(false);
    }
  };
  
  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center' }}>Payment</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px' }}>
          <CardElement />
        </div>
        <Button type="submit" disabled={!stripe || loading} style={{ width: '100%', marginTop: '20px' }}>
          {loading ? 'Processing...' : 'Pay'}
        </Button>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Need help? <Link to="/help">Contact us</Link></p>
      </form>
    </div>
  );
};
