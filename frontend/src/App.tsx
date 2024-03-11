import React from 'react';
import TopBar from './components/TopBar';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ColorModeProvider from './context/ColourModeContext';
import Dummy from './pages/Dummy';
import { ToastContainer } from 'react-toastify';
import Background from './components/Background';
import PaymentPage from './pages/Payment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_51Ot7JOJ6A0BJ3zLkdnlqc78i8dmfxVLBrGT2wwX7iQ2iGlmpriFXMVZwYYyy6UKf42Y6jCrZCsuWOpAOpt2cEQwa00PAbI230Y'); 

const App = () => {
  return (
    <Elements stripe={stripePromise}>
    <ColorModeProvider>
      <BrowserRouter>
        <ToastContainer />
        <TopBar />
        <Background />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dummy" element={<Dummy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/topup" element={ <PaymentPage />}/>
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </ColorModeProvider>
    </Elements>
  );
};

export default App;
