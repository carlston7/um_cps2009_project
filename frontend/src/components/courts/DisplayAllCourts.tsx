import React, { CSSProperties } from 'react';
import { Court } from '../../models/Courts';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useCourt } from '../../context/CourtContext';

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


export const DisplayAllCourts: React.FC<Props> = ({ courts }) => {
    const navigate = useNavigate();
    const { selectCourt, setDayPrice, setNightPrice } = useCourt();

    if (!Array.isArray(courts)) {
        console.error('courts is not an array', courts);
        toast.error("No courts available for this date and time");
        return <div>No courts available for this date and time.</div>;
    }


    const tableStyle: CSSProperties = {
        width: '50%',
        tableLayout: 'fixed',
        margin: 'auto',
    };

    const cellStyle: CSSProperties = {
        textAlign: 'center',
        padding: '10px',
        borderBottom: '1px solid #ddd',
    };
    const getRowStyle = (type: string): CSSProperties => ({
        background: getCourtTypeColor(type),
        color: 'white',
        textAlign: 'center',
        width: '100%',
    });
    const getPriceValue = (price: number | { $numberDecimal: string }): string => {
        if (typeof price === 'number') {
            return price.toString();
        } else if (price && typeof price.$numberDecimal === 'string') {
            return price.$numberDecimal;
        }
        return '-1';
    };
    const handleCourtClick = (court: Court) => {
        const dayPrice = getPriceValue(court.dayPrice);
        const nightPrice = getPriceValue(court.nightPrice);
        setDayPrice(dayPrice);
        setNightPrice(nightPrice);
        selectCourt(court);
        navigate('/edit-court', { state: { court } });
    };
    return (
        <table style={tableStyle}>
            <thead>
                <tr>
                    <th style={cellStyle}>Court Name</th>
                    <th style={cellStyle}>Type</th>
                    <th style={cellStyle}>DayPrice</th>
                    <th style={cellStyle}>NightPrice</th>
                </tr>
            </thead>
            <tbody>
                {courts.map((court) => {
                    const handleClick = () => handleCourtClick(court);
                    const courtType = Array.isArray(court.type) ? court.type[0] : court.type;
                    const displayDayPrice = getPriceValue(court.dayPrice);
                    const displayNightPrice = getPriceValue(court.nightPrice);
                    return (
                        <tr key={court._id} onClick={handleClick} style={getRowStyle(courtType)}>
                            <td style={cellStyle}>{court.name}</td>
                            <td style={cellStyle}>{court.type}</td>
                            <td style={cellStyle}>${displayDayPrice}</td>
                            <td style={cellStyle}>${displayNightPrice}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};