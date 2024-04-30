import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchUserCredit, respondToInvitation } from '../api/User';
import { toast } from 'react-toastify';
import { containerStyle } from '../components/ui/Background';

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
            if (accept) {
                toast.success('You have accepted the invitation.');
            } else {
                toast.success('You have declined the invitation.');
            }
            await fetchUserCredit();
            navigate('/');
        } catch (error) {
            toast.error('Failed to process your response.');
        }
    };

    return (
        <div style={containerStyle}>
            <h3>Please confirm your participation:</h3>
            <button onClick={() => handleResponse(true)}>I accept</button>
            <button onClick={() => handleResponse(false)}>Decline invitation</button>
        </div>
    );
};

export default AcceptBillPage;
