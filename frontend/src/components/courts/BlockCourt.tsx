import React, { CSSProperties, useState } from 'react';
import { Court } from '../../models/Courts';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useCourt } from '../../context/CourtContext';
import axiosInstance from '../../api/AxiosInstance';

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
    const [selectedCourts, setSelectedCourts] = useState<Court[]>([]);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);

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
    };

    const handleCourtSelection = (court: Court) => {
        const isSelected = selectedCourts.some((selectedCourt) => selectedCourt._id === court._id);
        if (isSelected) {
            setSelectedCourts(selectedCourts.filter((selectedCourt) => selectedCourt._id !== court._id));
        } else {
            setSelectedCourts([...selectedCourts, court]);
        }
    };

    const handleDateSelection = (date: string) => {
        const isSelected = selectedDates.includes(date);
        if (isSelected) {
            setSelectedDates(selectedDates.filter((selectedDate) => selectedDate !== date));
        } else {
            setSelectedDates([...selectedDates, date]);
        }
    };

    const handleSubmit = () => {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            toast.error('User email not found');
            return;
        }

        const courtIds = selectedCourts.map((court) => court._id).join(',');
        const dateParams = selectedDates.map((date) => `dates=${date}`).join('&');

        axiosInstance.get(`/admin/bookings?${dateParams}&courts=${courtIds}`, {
            headers: {
                'User-Email': userEmail,
            },
        })
            .then((response) => {
                // Handle success
                navigate('/confirm-blocking', { state: { courts: response.data } });
            })
            .catch((error) => {
                // Handle error
                toast.error('Failed to retrieve court information');
            });
    };

    return (
        <div>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={cellStyle}>Court Name</th>
                        <th style={cellStyle}>Type</th>
                        <th style={cellStyle}>DayPrice</th>
                        <th style={cellStyle}>NightPrice</th>
                        <th style={cellStyle}>Select</th>
                    </tr>
                </thead>
                <tbody>
                    {courts.map((court) => {
                        const handleClick = () => handleCourtClick(court);
                        const handleSelection = () => handleCourtSelection(court);
                        const courtType = Array.isArray(court.type) ? court.type[0] : court.type;
                        const displayDayPrice = getPriceValue(court.dayPrice);
                        const displayNightPrice = getPriceValue(court.nightPrice);
                        const isSelected = selectedCourts.some((selectedCourt) => selectedCourt._id === court._id);
                        return (
                            <tr key={court._id} onClick={handleClick} style={getRowStyle(courtType)}>
                                <td style={cellStyle}>{court.name}</td>
                                <td style={cellStyle}>{court.type}</td>
                                <td style={cellStyle}>${displayDayPrice}</td>
                                <td style={cellStyle}>${displayNightPrice}</td>
                                <td style={cellStyle}>
                                    <input type="checkbox" checked={isSelected} onChange={handleSelection} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div>
                <label>Select Dates:</label>
                <div>
                    {courts.length > 0 && (
                        <input
                            type="date"
                            onChange={(event) => handleDateSelection(event.target.value)}
                        />
                    )}
                    {selectedDates.map((date) => (
                        <div key={date}>
                            <input
                                type="checkbox"
                                checked={selectedDates.includes(date)}
                                onChange={() => handleDateSelection(date)}
                            />
                            <span>{date}</span>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};