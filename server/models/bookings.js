const mongoose = require('mongoose');

const bookings_schema = new mongoose.Schema({
    start: Date,
    user_email: String,
    court_name: String,
    invite_responses: [{
        email: String,
        status: {
            confirmed: Boolean,
            accepted: Boolean
        }
    }]
});

module.exports = mongoose.model('bookings', bookings_schema);