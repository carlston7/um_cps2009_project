const mongoose = require('mongoose');

const bookings_schema = new mongoose.Schema({
    start: Date,
    end: Date,
    user_email: String,
    court_name: String
});

module.exports = mongoose.model('bookings', bookings_schema);