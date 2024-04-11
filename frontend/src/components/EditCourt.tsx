import React, { useState, ChangeEvent } from 'react';
import { updateCourt } from '../api/Courts';
import { Court, CourtUpdateRequest } from '../models/Courts';
import { containerStyle } from './ui/Background';
import { useLocation } from 'react-router-dom';

function isDecimal(value: any): value is { $numberDecimal: string } {
    return value && typeof value === 'object' && '$numberDecimal' in value;
}

export const EditCourtForm: React.FC = () => {
    const location = useLocation(); // Use useLocation to access the current location object
    const court: Court = location.state?.court; // Access the court object passed via state

    const [updateFormData, setUpdateFormData] = useState<Partial<CourtUpdateRequest>>({
        name: court?.name,
        dayPrice: isDecimal(court?.dayPrice) ? parseFloat(court.dayPrice.$numberDecimal) : court?.dayPrice,
        nightPrice: isDecimal(court?.nightPrice) ? parseFloat(court.nightPrice.$numberDecimal) : court?.nightPrice,
    });

    // Since you're directly using the court object from the navigation state,
    // ensure to handle cases where the court data might not be available (e.g., user navigates directly to the edit page)

    const handleUpdateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUpdateFormData({
            ...updateFormData,
            [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value,
        });
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateCourt(updateFormData as CourtUpdateRequest);
            alert('Court updated successfully!');
        } catch (error) {
            alert('Failed to update court.');
        }
    };


    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center' }}>Update Court</h2>
            <form onSubmit={handleUpdateSubmit}>
                <div style={{ position: 'relative' }}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={updateFormData.name || ''}
                        onChange={handleUpdateChange}
                        style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <label>Day Price:</label>
                    <input
                        type="number"
                        name="dayPrice"
                        value={updateFormData.dayPrice || ''}
                        onChange={handleUpdateChange}
                        style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <label>Night Price:</label>
                    <input
                        type="number"
                        name="nightPrice"
                        value={updateFormData.nightPrice || ''}
                        onChange={handleUpdateChange}
                        style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px' }}
                    />
                </div>
                <button type="submit">Update Court</button>
            </form>
        </div>
    );
};
