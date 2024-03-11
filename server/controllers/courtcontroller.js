const Court = require('../models/courts')

exports.create_court = async (court_data) => {
    try{
        const court = new Court(court_data);
        
        await court.save();
        return court;
    } catch (e) {
        console.error(e);
        throw new Error('A problem was encountered while creating the court.');
    }
};