const mongoose = require('mongoose');

const courts_schema = new mongoose.Schema({
    type: ['Hard', 'Grass', 'Clay'],
    rate: mongoose.Types.Decimal128
});

module.exports = mongoose.model('courts', courts_schema);