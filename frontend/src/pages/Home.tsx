import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {Link as RouterLink}  from 'react-router-dom';
import { CSSProperties } from 'react';
import courtPatternImage from '../imgs/court.jpg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const containerStyle: CSSProperties = {
    textAlign: 'center', // Centers the text and image
    paddingTop: '20px', // Provides some spacing at the top
};

const textStyle: CSSProperties = {
    display: 'inline-block', // Allows the text block to fit content width
    backgroundColor: '#097969', // Background color of the text block
    color: 'white',
    padding: '2rem',
    borderRadius: '10px', // Optional: adds rounded corners to the text block
    marginBottom: '20px', // Space between the text block and the image
};

const imageStyle: CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    margin: '0 auto', // Centers the image
    transition: 'transform 0.5s ease',
};

const titleStyle: CSSProperties = {
    fontWeight: 'bold',
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
};

const paragraphStyle: CSSProperties = {
    marginBottom: '2rem',
};

const loginLinkStyle: CSSProperties = {
    color: '#FFD700',
    fontWeight: 'bold',
    textDecoration: 'none',
};
export const Home = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    return (
        <div style={containerStyle}>
            <div style={textStyle}>
                <h1 style={titleStyle}>CPS2009 Tennis Facility</h1>
                <p style={paragraphStyle}>
                    Tennis is a social sport available for players of all ages and our
                    club is present to provide you with the best courts to suit your needs.
                    Book your court and come join us at cps2009project, we can't wait to have you!
                </p>
                {!isAuthenticated ? (
                    <RouterLink to="/login" style={loginLinkStyle}>Login</RouterLink>
                ) : (
                    <a href="#logout" style={loginLinkStyle} onClick={handleLogout}>Logout</a>
                )}
            </div>
            <img
                src={courtPatternImage}
                alt="Tennis court"
                style={imageStyle}
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
        </div>
    );
};