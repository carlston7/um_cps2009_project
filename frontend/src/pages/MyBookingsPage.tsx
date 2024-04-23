import React from 'react';
import BookingsComponent from '../components/user/MyBookingsComponent';
import { containerStyle } from '../components/ui/Background';

const MyBookingsPage = () => {
    return (
        <div>
            <div style={{ ...containerStyle,  textAlign: 'center', marginBottom: '20px', width: '100%'}}>
                <h1>Click on a future booking to cancel it.</h1>
                <p>Note you can only cancel a booking which is more than 24 hours into the future</p>
            </div>
            <BookingsComponent />
        </div>
    );
};

export default MyBookingsPage;
