import React, { useEffect, useState } from 'react';
import { getCourts } from '../api/Courts';
import { Court, TimeSlot } from '../models/Courts';
import { toast } from 'react-toastify';

const CourtsComponent: React.FC = () => {
    const [courts, setCourts] = useState<Court[]>([]);
    const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
    const [availableTimeSlots] = useState<TimeSlot[]>([]);
    const [date, setDate] = useState<string>(''); 

    // Fetch courts from the backend
    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const response = await getCourts();
                console.log(response);
                setCourts(response);
            } catch (error) {
                toast.error('Failed to fetch courts');
                console.log("Failed to fetch courts", error);
            }
        };

        fetchCourts();
    }, []);

    const handleCourtSelect = async (courtId: string) => {
        setSelectedCourtId(courtId);
        // Placeholder date for now
        const date = '2024-03-18'; 
        setDate(date);
        try {
        } catch (error) {
            console.error('Failed to fetch available time slots', error);
        }
    };

    return (
        <div>
            <h2>Available Courts</h2>
            <ul>
                {Array.isArray(courts) && courts.map((court) => (
                    <li key={court.id} onClick={() => handleCourtSelect(court.id)}>
                        {court.name} - Day Price: ${court.dayPrice}, Night Price: ${court.nightPrice}
                    </li>
                ))}
            </ul>
            {selectedCourtId && (
                <div>
                    <h3>Available Time Slots for {date}</h3>
                    <ul>
                        {availableTimeSlots.map((slot) => (
                            <li key={slot.index}>Time Slot {slot.index}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CourtsComponent;
