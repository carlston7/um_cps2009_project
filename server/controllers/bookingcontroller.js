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

exports.delete_booking = async (booking_id) => {
    try {
        const booking = await Booking.findByIdAndDelete(booking_id);

        if (!booking) {
            throw new Error('Booking cannot be deleted.')
        }

        return booking;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

exports.get_booking = async (booking_id) => {
    try {
        const booking = await Booking.findById(booking_id);

        if (!booking) {
            throw new Error('Booking not found.')
        }

        return booking;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

exports.accept_game_invite = async (data) => {
    try {
        let booking;

        if (data.accept) {
            booking = await Booking.findOneAndUpdate(
                { _id: data._id },
                {
                  $set: {
                    "invite_responses.$[elem].confirmed": true,
                    "invite_responses.$[elem].accepted": true
                  }
                },
                {
                  arrayFilters: [{ "elem.email": data.email_address }],
                  returnOriginal: false
                }
              )
        } else {
            booking = await Booking.findOneAndUpdate(
                { _id: data._id },
                {
                  $set: {
                    "invite_responses.$[elem].confirmed": false
                  }
                },
                {
                  arrayFilters: [{ "elem.email": data.email_address }],
                  returnOriginal: false
                }
              )
        }

        if (!booking) {
            throw new Error('Match invite not updated.')
        } else {
            return booking;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}