import React, { useState } from 'react';
import { useCourt } from '../../context/CourtContext'; // Adjust import paths as necessary
import { bookCourt } from '../../api/Bookings';
import { toast } from 'react-toastify';
import { containerStyle } from '../../components/ui/Background';
import { useNavigate } from 'react-router-dom';

const BookCourtPage = () => {
    const { selectedCourt, date, time, price } = useCourt();
    const navigate = useNavigate();
    const [emails, setEmails] = useState(['']); // Start with one empty email field

    // Handler to update specific email index
    const handleEmailChange = (index: number, value: string) => {
        const updatedEmails = [...emails];
        updatedEmails[index] = value;
        setEmails(updatedEmails);
    };

    // Add an empty email field
    const addEmailField = () => {
        setEmails([...emails, '']);
    };

    // Remove an email field
    const removeEmailField = (index: number) => {
        const updatedEmails = [...emails];
        updatedEmails.splice(index, 1);
        setEmails(updatedEmails);
    };

    const handleBookingConfirmation = async () => {
        if (!selectedCourt) {
            toast.error("No court selected");
            return;
        }

        const bookingDetails = {
            dateTimeIso: `${date}T${time}:00.000Z`,
            courtName: selectedCourt.name,
            emails: emails.filter(email => email.trim() !== '') // Filter out empty emails
        };

        try {
            await bookCourt(bookingDetails);
            toast.success("Court booked successfully");
            navigate('/my-bookings');
        } catch (error) {
            toast.error("Failed to book court");
        }
    };

    if (!selectedCourt) {
        return <div>Select a court first.</div>;
    }

    return (
        <div style={containerStyle}>
            <h2>Confirm Your Booking</h2>
            <p>Date: {date}</p>
            <p>Time: {time}</p>
            <p>Court: {selectedCourt.name}</p>
            <p>Price: {price}</p>
            <div>
                {emails.map((email, index) => (
                    <div key={index}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => handleEmailChange(index, e.target.value)}
                            placeholder="Enter invitee's email"
                        />
                        {emails.length > 1 && (
                            <button onClick={() => removeEmailField(index)}>Remove</button>
                        )}
                    </div>
                ))}
                <button onClick={addEmailField}>Add Another Email</button>
            </div>
            <button onClick={handleBookingConfirmation}>Confirm Booking</button>
            <button onClick={() => navigate('/view-courts')}>Back to Viewing Courts</button>
        </div>
    );
};

export default BookCourtPage;