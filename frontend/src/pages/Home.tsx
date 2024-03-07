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
                <p>
                    Tennis is a social sport available for players of all ages and our
                    club is present to provide you with the best courts to best suit your needs.
                    Book your court and come join us at cps2009project, we can't wait to have you!
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
