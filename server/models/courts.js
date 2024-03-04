const mongoose = require('mongoose');

const courts_schema = new mongoose.Schema({
    type: ['Hard', 'Grass', 'Clay']
});

module.exports = mongoose.model('courts', courts_schema);