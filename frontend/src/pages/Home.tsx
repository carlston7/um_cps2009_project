import React from 'react';
import AiGeneratedFamilyPlayingTennis from '../imgs/homepage.webp';
import { CSSProperties } from 'react';

const imageStyle: CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    margin: '20px auto',
    transition: 'transform 0.5s ease',
};

const containerStyle: CSSProperties = {
    background: 'linear-gradient(to right, #097969, #209e61)', 
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: 'white',
};

const headerStyle: CSSProperties = {
    ...containerStyle,
    marginBottom: '20px',
};

const Home = () => {
    return (
        <div>
            <h1>.</h1>
            <div>
                <h1 style={headerStyle}>Welcome to Our Family Tennis Club!</h1>
            </div>
            <div style={containerStyle}>
                <p style={{ margin: '10 auto', maxWidth: '600px' }} >
                    Join us at our picturesque courts nestled in the heart of the
                    Mediterranean. With perfect sunny weather, lush surroundings,
                    and top-notch facilities, our club is the ideal spot for families
                    to enjoy the beautiful game of tennis. Whether you're picking up a
                    racket for the first time or you're an experienced player, our friendly
                    and inclusive atmosphere ensures a great experience for all.
                </p>
            </div>

            <img
                src={AiGeneratedFamilyPlayingTennis}
                alt="Family playing tennis"
                style={imageStyle}
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')} 
            />
        </div>
    );
};

export default Home;
