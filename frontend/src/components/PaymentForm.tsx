import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiCreatePaymentIntent } from '../api/Payment'; 
import { Button } from './ui/button';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { containerStyle } from './ui/Background'; 


export const StripePaymentForm = async () => {
  // Inside your component
  const stripe = useStripe();
  // Make sure stripe is not null
  if (stripe) {
    // Make a call to the backend to create a checkout session
    const response = await fetch('/create-checkout-session', { method: 'POST' });
    const session = await response.json();

    // Redirect the user to the Stripe Checkout page
    stripe.redirectToCheckout({
      sessionId: session.id,
    }).then((result) => {
      // Inform the user if there's an error
      if (result.error) {
        alert(result.error.message);
      }
    });
  } else {
    // Handle the error or inform the user they need to try again
    console.log('Stripe has not loaded yet.');
  }
};

// export const StripePaymentForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (event: { preventDefault: () => void; }) => {
//     event.preventDefault();
//     if (!stripe || !elements) {
//       return;
//     }
  
//     setLoading(true);
  
//     const cardElement = elements.getElement(CardElement);
//     if (!cardElement) {
//       toast.error('Payment failed: Unable to find card details');
//       setLoading(false);
//       return;
//     }
  
//     const {error, paymentMethod} = await stripe.createPaymentMethod({
//       type: 'card',
//       card: cardElement,
//     });
  
//     if (error) {
//       console.log('[error]', error);
//       toast.error(`Payment failed: ${error.message}`);
//       setLoading(false);
//     } else {
//       try {
//         const paymentIntentResponse = await apiCreatePaymentIntent(paymentMethod.id);
  
//         const {paymentIntent, error: confirmError} = await stripe.confirmCardPayment(paymentIntentResponse.data.clientSecret, {
//           payment_method: paymentMethod.id,
//         });
  
//         if (confirmError) {
//           console.log('[confirmError]', confirmError);
//           toast.error(`Payment confirmation failed: ${confirmError.message}`);
//           setLoading(false);
//         } else {
//           console.log('[PaymentIntent]', paymentIntent);
//           toast.success('Payment successful');
//           navigate('/'); 
//           setLoading(false);
//         }
//       } catch (error) {
//         toast.error('Payment process failed');
//         console.error(error);
//         setLoading(false);
//       }
//     }
//   };
  
//   return (
//     <div style={containerStyle}>
//       <h2 style={{ textAlign: 'center' }}>Payment</h2>
//       <form onSubmit={handleSubmit}>
//         <div style={{ padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px' }}>
//           <CardElement />
//         </div>
//         <Button type="submit" disabled={!stripe || loading} style={{ width: '100%', marginTop: '20px' }}>
//           {loading ? 'Processing...' : 'Pay'}
//         </Button>
//         <p style={{ textAlign: 'center', marginTop: '20px' }}>Need help? <Link to="/help">Contact us</Link></p>
//       </form>
//     </div>
//   );
// };
