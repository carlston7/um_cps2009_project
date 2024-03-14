import React, { useState, ChangeEvent } from 'react';
import { createCourt } from '../api/Courts';
import { CourtCreateRequest } from '../models/Courts';
import { containerStyle } from './ui/Background';

export const CreateCourtForm: React.FC = () => {
    const [createFormData, setCreateFormData] = useState<CourtCreateRequest>({
        name: '',
        type: '',
        dayPrice: 0,
        nightPrice: 0,
    });

    const handleCreateChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setCreateFormData({
            ...createFormData,
            [e.target.name]: value
        });
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCourt(createFormData);
            alert('Court created successfully!');

        } catch (error) {
            alert('Failed to create court.');
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center' }}>Create Court</h2>
            <form onSubmit={handleCreateSubmit}>
                <div style={{ position: 'relative' }}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={createFormData.name}
                        onChange={handleCreateChange}
                        required
                        style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <label>Type:</label>
                    <select
                        name="type"
                        value={createFormData.type}
                        onChange={handleCreateChange}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'white' }}
                    >
                        <option value="" disabled>Select court type</option>
                        <option value="Hard">Hard</option>
                        <option value="Grass">Grass</option>
                        <option value="Clay">Clay</option>
                    </select>
                </div>
                <div style={{ position: 'relative' }}>
                    <label>Day Price:</label>
                    <input
                        type="number"
                        name="dayPrice"
                        value={createFormData.dayPrice}
                        onChange={handleCreateChange}
                        required
                        style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px' }}
                    />
                </div>
                <div>
                    <label>Night Price:</label>
                    <input
                        type="number"
                        name="nightPrice"
                        value={createFormData.nightPrice}
                        onChange={handleCreateChange}
                        required
                        style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px' }}
                    />
                </div>
                <button type="submit">Create Court</button>
            </form>
        </div>
    );
};
