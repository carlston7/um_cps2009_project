import React, { CSSProperties } from 'react';
import { Court } from '../models/Courts';
import { toast } from 'react-toastify';

function getCourtTypeColor(type: string): string {
    switch (type) {
        case 'Hard':
            return 'linear-gradient(to right, #0095B7, #00CCCC)';
        case 'Grass':
            return 'linear-gradient(to right, #3AA655, #63B76C)';
        case 'Clay':
            return 'linear-gradient(to right, #736A62, #8B8680)';
        default:
            return 'transparent'; // Default fallback color
    }
}

interface Props {
    courts: Court[];
}

export const CourtsDisplay: React.FC<Props> = ({ courts }) => {
    if (!Array.isArray(courts)) {
        console.error('courts is not an array', courts);
        toast.error("No courts available for this date and time");
        return <div>No courts available for this date and time.</div>;
    }

    const courtItemStyle = (type: string): CSSProperties => ({
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        background: getCourtTypeColor(type),
        color: 'white', // assuming you want the text to be white
        width: '100%', // Ensure the item takes full width of its container
    });

    return (
        <div>
            {courts.map((court) => {
                const courtType = Array.isArray(court.type) ? court.type[0] : court.type;
                const dayPrice = typeof court.dayPrice === 'object' ? court.dayPrice.$numberDecimal : court.dayPrice;
                const nightPrice = typeof court.nightPrice === 'object' ? court.nightPrice.$numberDecimal : court.nightPrice;
                console.log(courtType);
                return (
                    <div key={court.id} style={courtItemStyle(courtType)}>
                        <span>{court.name}</span>
                        <span>Type: {court.type}</span>
                        <span>Day Price: ${dayPrice}</span>
                        <span>Night Price: ${nightPrice}</span>
                    </div>
                );
            })}
        </div>
    );
};