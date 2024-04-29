import React from 'react';
import TopBar from './components/TopBar';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Home } from './pages/HomePage';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import ColorModeProvider from './context/ColourModeContext';
import { ToastContainer } from 'react-toastify';
import Background from './components/ui/Background';
import PaymentPage from './pages/PaymentPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import HelpPage from './pages/HelpPage';
import EditCourtPage from './pages/courts/EditCourtPage';
import CreateCourtPage from './pages/courts/CreateCourtPage';
import { ViewCourtPage } from './pages/courts/ViewCourtPage';
import ProfilePage from './pages/ProfilePage';
import BookCourtPage from './pages/courts/BookCourtPage';
import { CourtProvider } from './context/CourtContext';
import EditProfilePage from './pages/EditProfilePage';
import { ViewAllCourtsPage } from './pages/courts/ViewAllCourtsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import CancelBookingPage from './pages/CancelBookingPage';
import EmailConfirmationPage from './pages/EmailConfirmationPage';
import ForgetPasswordPage from './pages/ForgotPasswordPage';
import EmailOneTimeCodePage from './pages/OneTimeCode';
import AcceptBillPage from './pages/AcceptBillPage';
import FriendsListPage from './pages/FriendsListPage';
import RespondToFriendRequestPage from './pages/RespondToFriendRequest';

const stripePromise = loadStripe('pk_test_51P3iC4P46pjciChWBf3bsIRggMExQUZU2ZTzVMToDwJnjtjQjj5FvG16NmnYfSX9OiiZI3DR1zowa4C6L3btGIYh00A4WZwzBX'); 

const App = () => {
  return (
    <Elements stripe={stripePromise}>
    <ColorModeProvider>
      <BrowserRouter>
        <ToastContainer />
        <TopBar />
        <Background />
          <CourtProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit-court" element={<EditCourtPage />} />
          <Route path="/view-all-courts" element={<ViewAllCourtsPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/confirm-email" element={<EmailConfirmationPage />} />
              <Route path="/cancel-booking/:bookingId" element={<CancelBookingPage />} />
              <Route path="/accept-bill" element={<AcceptBillPage />} />
              <Route path="/forget-password" element={<ForgetPasswordPage />} />
              <Route path="/email-code" element={<EmailOneTimeCodePage />} />
              <Route path="/friends/respond" element={<RespondToFriendRequestPage />} />
              <Route path="/friends" element={<FriendsListPage />} />
          <Route path="/view-courts" element={<ViewCourtPage/>} />
          <Route path="/new-court" element={<CreateCourtPage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/book-court" element={<BookCourtPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/topup" element={ <PaymentPage />}/>
          <Route path="/help" element={ <HelpPage />}/>
          <Route path="/profile" element={ <ProfilePage/>}/>
          {/* Add more routes as needed */}
        </Routes>
          </CourtProvider>
      </BrowserRouter>
    </ColorModeProvider>
    </Elements>
  );
};

export default App;
