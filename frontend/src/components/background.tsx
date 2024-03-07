import React, { CSSProperties } from 'react';
import backgroundImage from '../imgs/background.webp';

export const containerStyle: CSSProperties = {
    background: 'linear-gradient(to right, #097969, #209e61)',
    textAlign: 'center',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: 'white',
};


const Background: React.FC = () => {
    const backgroundStyle: CSSProperties = {
        background: `url(${backgroundImage}) repeat`,
        backgroundSize: 'fill',
        position: 'fixed', 
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        minHeight: '100vh'
    };

    return <div style={backgroundStyle} />;
};

export default Background;
