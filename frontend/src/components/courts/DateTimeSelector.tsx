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
    const [availableHours, setAvailableHours] = useState<string[]>([]);  // Store available hours in state
    const { setBookingDate, setBookingTime } = useCourt();
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.getHours();

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);  // Set max date to one week in advance
    const maxDateValue = maxDate.toISOString().split('T')[0];

    useEffect(() => {
        if (date) {
            const startHour = date === today ? Math.max(currentTime + 1, 9) : 9;  // Use 9 AM as the minimum start time
            const hours = [];
            for (let i = startHour; i <= 22; i++) {  // Assume court hours are between 9 AM and 10 PM
                hours.push(`${i.toString().padStart(2, '0')}:00`);
            }
            setAvailableHours(hours);
            setTime(hours[0]); // Automatically set time to the first available slot
        }
    }, [date, currentTime, today]);

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
                            {availableHours.map(hour => (
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
