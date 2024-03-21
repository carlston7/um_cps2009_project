import React from 'react';
import { Court } from '../models/Courts';
import { toast } from 'react-toastify';

interface Props {
    courts: Court[];
}

export const CourtsDisplay: React.FC<Props> = ({ courts }) => {
    if (!Array.isArray(courts)) {
        console.error('courts is not an array', courts);
        toast.error("No courts available for this date and time");
        return <div></div>;
    }
    return (
        <div>
            {courts.map((court) => (
                <div key={court.id}>
                    <h3>{court.name}</h3>
                    <p>Day Price: ${court.dayPrice}</p>
                    <p>Night Price: ${court.nightPrice}</p>
                </div>
            ))}
        </div>
    );
};
