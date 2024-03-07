import React from 'react';
import TopBar from './components/TopBar';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ColorModeProvider from './context/ColourModeContext';
import Dummy from './pages/Dummy';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <ColorModeProvider>
      <BrowserRouter>
        <ToastContainer />
        <TopBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dummy" element={<Dummy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </ColorModeProvider>
  );
};

export default App;
