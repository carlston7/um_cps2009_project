import React, { useState } from 'react';
import { DateTimeSelection } from '../models/Courts';
import { containerStyle } from './ui/Background';

interface Props {
    onDateTimeSelected: (dateTime: DateTimeSelection) => void;
}
export const DateTimeSelector: React.FC<Props> = ({ onDateTimeSelected }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('09:00');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dateTimeIso = `${date}T${time}:00`;
        onDateTimeSelected({ dateTime: dateTimeIso });
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
                <button type="submit">Check Availability</button>
            </form>
        </div>
    );
};