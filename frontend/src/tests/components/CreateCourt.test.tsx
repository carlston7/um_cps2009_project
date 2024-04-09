jest.mock('../../api/Courts', () => ({
    createCourt: jest.fn(),
}));

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createCourt } from '../../api/Courts';
import { CreateCourtForm } from '../../components/CreateCourt';
import { toast } from 'react-toastify';

describe('CreateCourtForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders without crashing', () => {
        render(<CreateCourtForm />);
        expect(screen.getByRole('button', { name: /Create Court/i })).toBeInTheDocument();
    });

    test('allows users to input and submit form', async () => {
        render(<CreateCourtForm />);

        // Simulate user input
        await userEvent.type(screen.getByLabelText(/Name:/i), 'Local Court');
        await userEvent.type(screen.getByLabelText(/Day Price:/i), '{selectall}100');
        await userEvent.type(screen.getByLabelText(/Night Price:/i), '{selectall}150');
        await userEvent.selectOptions(screen.getByRole('combobox', { name: /Type:/i }), 'Hard');

        // Simulate form submission
        const createCourtMock = createCourt as jest.Mock;
        createCourtMock.mockResolvedValueOnce({});

        fireEvent.click(screen.getByText(/Create Court/i));

        await waitFor(() => {
            expect(createCourtMock).toHaveBeenCalledWith({
                name: 'Local Court',
                type: 'Hard',
                dayPrice: "100",
                nightPrice: "150",
            });
        });
    });

    test('displays an error message on submission failure', async () => {
        render(<CreateCourtForm />);

        userEvent.type(screen.getByLabelText(/Name:/i), 'Local Court');
        fireEvent.click(screen.getByText(/Create Court/i));

        const createCourtMock = createCourt as jest.Mock;
        createCourtMock.mockRejectedValueOnce(new Error); // Mock a failure response
        await waitFor(() => {
            expect(toast.error);
        });
    });
});