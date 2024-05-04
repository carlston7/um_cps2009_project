import React, { CSSProperties } from 'react';
import backgroundImage from '../../imgs/seamless.avif';

export const blankStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'transparent',
    textAlign: 'center',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: 'white',
    flexDirection: 'column',
};
export const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right, #097969, #209e61)',
    textAlign: 'center',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: 'white',
    flexDirection: 'column',
};

export const containerStyle2: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right, #134E5E, #00bf8f)',
    textAlign: 'center',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: 'white',
    flexDirection: 'column',
};

export const containerStyle3: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right, #159957, #155799)',
    textAlign: 'center',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: 'white',
    flexDirection: 'column',
};

export const titleStyle: CSSProperties = {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '10px',
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
