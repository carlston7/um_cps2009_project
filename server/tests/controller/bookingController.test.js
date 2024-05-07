const { get_bookings, get_booking } = require('../../controllers/bookingcontroller'); // Assuming this is the correct import path

// Mocking the Booking model
jest.mock('../../models/bookings', () => ({
    find: jest.fn().mockImplementation(({ user_email }) => {
        if (user_email === 'test@example.com') {
            return [
                { user_email: 'test@example.com', booking_date: '2024-05-07' },
                { user_email: 'test@example.com', booking_date: '2024-05-08' }
            ];
        } else {
            return []; // Simulating no bookings found
        }
    }),
    findById: jest.fn().mockImplementation((booking_id) => {
        if (booking_id === 'existing_booking_id') {
            return { 
                _id: 'existing_booking_id',
                user_email: 'test@example.com',
                booking_date: '2024-05-07'
            };
        } else {
            return null; // Simulating booking not found
        }
    })
}));

describe('get_bookings', () => {
    it('should return bookings for a user when bookings exist', async () => {
        const bookings = await get_bookings('test@example.com');
        expect(bookings).toHaveLength(2); // Assuming we have two bookings for the test user
        // Additional assertions can be added to check the content of the bookings array
    });

    it('should return an empty array when no bookings exist for the user', async () => {
        const bookings = await get_bookings('non_existing@example.com');
        expect(bookings).toHaveLength(0);
    });
});

describe('get_booking', () => {
    it('should return booking when booking exists', async () => {
        const booking = await get_booking('existing_booking_id');
        expect(booking).toBeDefined();
        expect(booking._id).toBe('existing_booking_id');
        // Additional assertions can be added to check the content of the booking object
    });

    it('should throw an error when booking does not exist', async () => {
        await expect(get_booking('non_existing_booking_id')).rejects.toThrow('Booking not found.');
    });
});
