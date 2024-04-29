const mongoose = require('mongoose');

const users_schema = new mongoose.Schema({
    name: String,
    surname: String,
    email_address: String,
    password: String,
    credit: Number,
    type: ['member', 'owner', 'admin'],
    confirmationToken: String,
    tokenExpiration: Date,
    emailVerified: { type: Boolean, default: false },
    resetCode: { type: String, default: null },        
    resetCodeExpiration: { type: Date, default: null },
    friends: [{ email: String, accepted: { type: Boolean, default: false } }],
    friendRequests: [String]
});

module.exports = mongoose.model('users', users_schema);