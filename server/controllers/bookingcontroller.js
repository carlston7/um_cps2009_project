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