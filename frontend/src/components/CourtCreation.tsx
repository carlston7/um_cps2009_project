import React, { useState, ChangeEvent } from 'react';
import { createCourt, updateCourt } from '../api/Courts';
import { CourtCreateRequest, CourtUpdateRequest } from '../models/Courts';

export const CourtForm: React.FC = () => {
    const [createFormData, setCreateFormData] = useState<CourtCreateRequest>({
        name: '',
        type: '',
        dayPrice: 0,
        nightPrice: 0,
    });

    // Using Partial<CourtUpdateRequest> to allow for partial updates
    const [updateFormData, setUpdateFormData] = useState<Partial<CourtUpdateRequest>>({});

    const handleCreateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCreateFormData({
            ...createFormData,
            [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value,
        });
    };

    const handleUpdateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUpdateFormData({
            ...updateFormData,
            [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value,
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
        <div>
            <h2>Create Court</h2>
            <form onSubmit={handleCreateSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={createFormData.name}
                        onChange={handleCreateChange}
                        required
                    />
                </div>
                <div>
                    <label>Type:</label>
                    <input
                        type="text"
                        name="type"
                        value={createFormData.type}
                        onChange={handleCreateChange}
                        required
                    />
                </div>
                <div>
                    <label>Day Price:</label>
                    <input
                        type="number"
                        name="dayPrice"
                        value={createFormData.dayPrice}
                        onChange={handleCreateChange}
                        required
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
                    />
                </div>
                <button type="submit">Create Court</button>
            </form>

            <h2>Update Court</h2>
            <form onSubmit={handleUpdateSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={updateFormData.name || ''}
                        onChange={handleUpdateChange}
                    />
                </div>
                <div>
                    <label>Day Price:</label>
                    <input
                        type="number"
                        name="dayPrice"
                        value={updateFormData.dayPrice || ''}
                        onChange={handleUpdateChange}
                    />
                </div>
                <div>
                    <label>Night Price:</label>
                    <input
                        type="number"
                        name="nightPrice"
                        value={updateFormData.nightPrice || ''}
                        onChange={handleUpdateChange}
                    />
                </div>
                <button type="submit">Update Court</button>
            </form>
        </div>
    );
};
