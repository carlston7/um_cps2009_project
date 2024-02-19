import React, { useEffect, useState } from 'react';

const MyComponent = () => {
    // State to store the fetched data
    const [message, setMessage] = useState('');

    // useEffect to fetch data from the backend
    useEffect(() => {
        // Your fetch call to the Django backend
        fetch('http://17.0.0.1:8000/')
            .then(response => response.json())
            .then(data => {
                console.log(data); // Log the response data
                setMessage(data.message); // Update the state with the fetched message
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []); // The empty array means this effect runs once on mount

    // JSX to render the component
    return (
        <div>
            <h1>Message from Backend</h1>
            <p>{message}</p> {/* Display the fetched message */}
        </div>
    );
};

export default MyComponent;
