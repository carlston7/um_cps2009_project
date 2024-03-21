import React, { useState } from 'react';
import { DateTimeSelector } from '../components/DateTimeSelector';
import { CourtsDisplay } from '../components/DisplayCourts';
import { fetchCourts } from '../api/Courts';
import { Court, DateTimeSelection } from '../models/Courts';

export const ViewCourtPage = () => {
    const [courts, setCourts] = useState<Court[]>([]);

    const handleDateTimeSelected = async (dateTime: DateTimeSelection) => {
        try {
            const courtsData = await fetchCourts(dateTime);
            setCourts(courtsData); // Ensure this is an array
        } catch (error) {
            console.error('Error fetching courts:', error);
        }
    };

    return (
        <div>
            <DateTimeSelector onDateTimeSelected={handleDateTimeSelected} />
            <CourtsDisplay courts={courts} />
        </div>
    );
};
