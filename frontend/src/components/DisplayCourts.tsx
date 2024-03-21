import React from 'react';
import { Court } from '../models/Courts';

interface Props {
    courts: Court[];
}

export const CourtsDisplay: React.FC<Props> = ({ courts }) => {
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
