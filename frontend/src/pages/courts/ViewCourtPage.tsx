import React, { useState } from 'react';
import { DateTimeSelector } from '../../components/courts/DateTimeSelector';
import { CourtsDisplay } from '../../components/courts/DisplayCourts';
import { fetchCourts } from '../../api/Courts';
import { Court, DateTimeSelection } from '../../models/Courts';

export const ViewCourtPage = () => {
    const [courts, setCourts] = useState<Court[]>([]);
    const [selectedTime, setSelectedTime] = useState('');


    const handleDateTimeSelected = async (dateTime: DateTimeSelection) => {
        try {
            const courtsData = await fetchCourts(dateTime);
            setCourts(courtsData);
            const time = new Date(dateTime.dateTime).toTimeString().substring(0, 5);
            setSelectedTime(time);
        } catch (error) {
            console.error('Error fetching courts:', error);
        }
    };

    return (
        <div>
            <DateTimeSelector onDateTimeSelected={handleDateTimeSelected} />
            <CourtsDisplay courts={courts} currentTime={selectedTime} />
        </div>
    );
};
