import React, { useState } from 'react';
import { containerStyle } from '../ui/Background';


export const DateTimeSelector: React.FC = () => {
    const [date, setDate] = useState('');
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setDate(date);
    };

    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit}>
                <label>
                    Date:
                    <input
                        type="date"
                        min={today}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </label>
                <h4>Please select a court to book</h4>
                <button type="submit">Check Availability</button>
            </form>
        </div>
    );
};
