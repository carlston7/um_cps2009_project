const Booking = require('../models/bookings')
const Court = require('../models/courts')

exports.get_available_courts = async (time) => {
    try{
        const courts = await Court.find({}).lean();
        const booked = await Booking.find({ start: time }, 'court_name').lean();
        
        const booked_names = booked.map(booking => booking.court_name);

        const available = courts.filter(court => {
            return !booked_names.includes(court.name);
        });

        return available;
    } catch (e) {
        console.error(e);
        throw new Error('A problem was encountered while getting available courts.');
    }
};

exports.create_booking = async (booking_data) => {
    try{
        const booking = new Booking(booking_data);
        
        await booking.save();
        return booking;
    } catch (e) {
        console.error(e);
        throw new Error('A problem was encountered while creating the booking.');
    }
};

exports.get_bookings = async (email) => {
    try {
        const bookings = await Booking.find({ user_email: email });
        return bookings;
    } catch (e) {
        console.error(e);
        throw new Error('Could not get bookings for user');
    }
};