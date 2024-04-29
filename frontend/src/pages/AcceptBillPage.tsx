import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { respondToInvitation } from '../api/User';

const AcceptBillPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const _id = searchParams.get('_id');
    const email_address = searchParams.get('email_address');

    const handleResponse = async (accept: boolean) => {
        if (!_id || !email_address) {
            alert('Invalid access. Required parameters are missing.');
            return;
        }
        try {
            await respondToInvitation({ _id, email_address, accept });
            alert(`You have ${accept ? 'accepted' : 'declined'} the invitation.`);
            navigate('/'); // Redirect somewhere relevant
        } catch (error) {
            alert('Failed to process your response.');
        }
    };

    return (
        <div>
            <h1>Accept or Decline Invitation</h1>
            <p>Please confirm your participation:</p>
            <button onClick={() => handleResponse(true)}>Accept</button>
            <button onClick={() => handleResponse(false)}>Decline</button>
        </div>
    );
};

export default AcceptBillPage;
