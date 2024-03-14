import React, { useState, ChangeEvent } from 'react';
import { updateCourt } from '../api/Courts';
import { CourtUpdateRequest } from '../models/Courts';
import { containerStyle } from './ui/Background';

export const EditCourtForm: React.FC = () => {

    // Using Partial<CourtUpdateRequest> to allow for partial updates
    const [updateFormData, setUpdateFormData] = useState<Partial<CourtUpdateRequest>>({});

    const handleUpdateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUpdateFormData({
            ...updateFormData,
            [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value,
        });
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Assuming you have logic to identify the court to be updated from the updateFormData
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
