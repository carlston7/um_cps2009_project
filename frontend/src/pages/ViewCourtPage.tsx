import React, { useState } from 'react';
import { DateTimeSelector } from '../components/DateTimeSelector';
import { CourtsDisplay } from '../components/DisplayCourts';
import { fetchCourts } from '../api/Courts';
import { Court, DateTimeSelection } from '../models/Courts';

export const ViewCourtPage = () => {
    const [courts, setCourts] = useState<Court[]>([]);

    const handleDateTimeSelected = async (dateTime: DateTimeSelection) => {
        const fetchedCourts = await fetchCourts(dateTime);
        setCourts(fetchedCourts);
    };

    return (
        <div>
            <DateTimeSelector onDateTimeSelected={handleDateTimeSelected} />
            <CourtsDisplay courts={courts} />
        </div>
    );
};
