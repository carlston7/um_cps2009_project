const mongoose = require('mongoose');

const users_schema = new mongoose.Schema({
    name: String,
    surname: String,
    email_address: String,
    password: String,
    credit: Integer
});

module.exports = mongoose.model('users', users_schema);