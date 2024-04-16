import React, { useState } from 'react';
import { DateTimeSelection } from '../../models/Courts';
import { containerStyle } from '../ui/Background';
import { useCourt } from '../../context/CourtContext';

interface Props {
    onDateTimeSelected: (dateTime: DateTimeSelection) => void;
}

export const DateTimeSelector: React.FC<Props> = ({ onDateTimeSelected }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('09:00');
    const { setBookingDate, setBookingTime } = useCourt();
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Calculate the max date (one month in advance from today)
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    const maxDateValue = maxDate.toISOString().split('T')[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dateTimeIso = `${date}T${time}:00.000Z`;
        onDateTimeSelected({ dateTime: dateTimeIso });
        setBookingDate(date);
        setBookingTime(time);
    };

    const hours = [];
    for (let i = 9; i <= 22; i++) {
        hours.push(`${i.toString().padStart(2, '0')}:00`);
    }

    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit}>
                <label>
                    Date:
                    <input
                        type="date"
                        min={today} // Set the min attribute to today's date
                        max={maxDateValue} // Set the max attribute to one month in advance
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Time:
                    <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    >
                        {hours.map(hour => (
                            <option key={hour} value={hour}>
                                {hour}
                            </option>
                        ))}
                    </select>
                </label>
                <p>Kindly note that price for use during the day and price for use during night differ</p>
                <button type="submit">Check Availability</button>
            </form>
        </div>
    );
};
