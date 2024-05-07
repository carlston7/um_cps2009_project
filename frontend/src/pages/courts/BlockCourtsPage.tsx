import React, { useEffect, useState } from 'react';
import { fetchAllCourts } from '../../api/Courts'; // Ensure this path is correct
import { Court } from '../../models/Courts';
import { DisplayAllCourts } from '../../components/courts/BlockCourt'; // Ensure this path is correct

export const BlockCourtsPage = () => {
    const [courts, setCourts] = useState<Court[]>([]);

    useEffect(() => {
        const fetchAllCourtsForPage = async () => {
            try {
                const courtsData = await fetchAllCourts();
                setCourts(courtsData);
            } catch (error) {
                console.error('Error fetching courts:', error);
            }
        };
        fetchAllCourtsForPage();
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div>
            <DisplayAllCourts courts={courts} />
        </div>
    );
};
