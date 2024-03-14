import React, { useEffect, useState } from 'react';
import { getCourts } from '../api/Courts';
import { Court } from '../models/Courts';

const CourtList: React.FC = () => {
    const [courts, setCourts] = useState<Court[]>([]);

    useEffect(() => {
        const fetchCourts = async () => {
            const courtsData = await getCourts();
            setCourts(courtsData);
        };

        fetchCourts();
    }, []);

    return (
        <div>
            <h2>Available Courts</h2>
            <ul>
                {courts.map((court) => (
                    <li key={court.id}>{court.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default CourtList;
