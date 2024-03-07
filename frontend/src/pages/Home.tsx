import React from 'react';
import AiGeneratedFamilyPlayingTennis from '../imgs/homepage.webp';


const imageStyle = {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    margin: '20px auto',
    transition: 'transform 0.5s ease', // Smooth transition for the zoom effect
};
const containerStyle = {
    background: 'linear-gradient(to right, #56CCF2, #2F80ED)', // This is a blue gradient. Choose colors that complement your site's palette.
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const pageStyle = {
    background: 'url("../imgs/background.webp") no-repeat center center fixed',
    backgroundSize: 'cover',
};
const Home = () => {
    return (
        <div style={pageStyle}>
            <h1>Welcome to Our Family Tennis Club!</h1>
            {/* <div style={containerStyle}>
                <p style={{ margin: '0 auto', maxWidth: '600px' }}>
                    Join us at our picturesque courts nestled in the heart of the
                    Mediterranean. With perfect sunny weather, lush surroundings,
                    and top-notch facilities, our club is the ideal spot for families
                    to enjoy the beautiful game of tennis. Whether you're picking up a
                    racket for the first time or you're an experienced player, our friendly
                    and inclusive atmosphere ensures a great experience for all.
                </p>
            </div> */}

            <img
                src={AiGeneratedFamilyPlayingTennis}
                alt="Family playing tennis"
                style={imageStyle}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} // Slightly enlarges the image on hover
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} // Resets the image size when not hovered
            />
        </div>
    );
};

export default Home;
