import React, { useState, useEffect } from 'react';
import { DateTimeSelection } from '../../models/Courts';
import { containerStyle } from '../ui/Background';
import { useCourt } from '../../context/CourtContext';

interface Props {
    onDateTimeSelected: (dateTime: DateTimeSelection) => void;
}

export const DateTimeSelector: React.FC<Props> = ({ onDateTimeSelected }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const { setBookingDate, setBookingTime } = useCourt();
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.getHours();

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 14);  // Set max date to two weeks in advance
    const maxDateValue = maxDate.toISOString().split('T')[0];

    useEffect(() => {
        const hours = [];
        const startHour = date === today ? Math.max(currentTime + 1, 9) : 9; // Adjusted to start at next hour if today
        for (let i = startHour; i <= 22; i++) {
            hours.push(`${i.toString().padStart(2, '0')}:00`);
        }
        setTime(hours[0]); // Update time to the first available slot
    }, [date, currentTime, today]); // Depend on currentTime and today to adjust startHour

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dateTimeIso = `${date}T${time}:00.000Z`;
        onDateTimeSelected({ dateTime: dateTimeIso });
        setBookingDate(date);
        setBookingTime(time);
    };

    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit}>
                <label>
                    Date:
                    <input
                        type="date"
                        min={today}
                        max={maxDateValue}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </label>
                {date && (
                    <label>
                        Time:
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        >
                            {/* This mapping will react to the useEffect hook's changes */}
                            {Array.from({ length: 14 - (Math.max(currentTime + 1, 9) - 9) }, (_, i) =>
                                `${(Math.max(currentTime + 1, 9) + i).toString().padStart(2, '0')}:00`)
                                .map(hour => (
                                    <option key={hour} value={hour}>
                                        {hour}
                                    </option>
                                ))}
                        </select>
                    </label>
                )}
                <h4>Please select a court to book</h4>
                <p>Kindly note that price for use during the day and price for use during night differ</p>
                <button type="submit">Check Availability</button>
            </form>
        </div>
    );
};
