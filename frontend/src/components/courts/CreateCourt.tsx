import React, { useState, ChangeEvent } from 'react';
import { createCourt } from '../../api/Courts';
import { CourtCreateRequest } from '../../models/Courts';
import { containerStyle } from '../ui/Background';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const CreateCourtForm: React.FC = () => {
    const navigate = useNavigate();
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
            toast.success('Court created successfully!');
            setCreateFormData({
                name: '',
                type: '',
                dayPrice: 0,
                nightPrice: 0,
            });
            navigate('/view-all-courts');
        } catch (error) {
            toast.error('Failed to create court.');
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center' }}>Create a Court</h2>
            <form onSubmit={handleCreateSubmit}>
                <div style={{ position: 'relative' }}>
                    <label htmlFor="nameInput">Name:</label>
                    <input
                        id="nameInput"
                        type="text"
                        name="name"
                        value={createFormData.name}
                        onChange={handleCreateChange}
                        required
                        style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <label htmlFor="typeInput">Type:</label>
                    <select
                        id="typeInput"
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
                    <label htmlFor="dayPriceInput">Day Price:</label>
                    <input
                        id="dayPriceInput"
                        type="number"
                        name="dayPrice"
                        value={createFormData.dayPrice}
                        onChange={handleCreateChange}
                        required
                        style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px' }}
                    />
                </div>
                <div>
                    <label htmlFor="nightPriceInput">Night Price:</label>
                    <input
                        id="nightPriceInput"
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
