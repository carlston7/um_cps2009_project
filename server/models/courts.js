const mongoose = require('mongoose');

const courts_schema = new mongoose.Schema({
    name: String,
    type: ['Hard', 'Grass', 'Clay'],
    dayPrice: mongoose.Types.Decimal128,
    nightPrice: mongoose.Types.Decimal128
});

module.exports = mongoose.model('courts', courts_schema);