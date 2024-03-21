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
            {courts.map((court) => {
                const dayPrice = typeof court.dayPrice === 'object' ? court.dayPrice.$numberDecimal : court.dayPrice;
                const nightPrice = typeof court.nightPrice === 'object' ? court.nightPrice.$numberDecimal : court.nightPrice;
                return (
                    <div key={court.id}>
                        <h3>{court.name}</h3>
                        <p>Day Price: ${dayPrice}</p>
                        <p>Night Price: ${nightPrice}</p>
                    </div>
                );
            })}
        </div>
    );
};
