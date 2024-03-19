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

exports.edit_court = async (court_data) => {
    try{
        const court = await Court.findOneAndReplace({_name: court_data.name},
            {dayPrice: court_data.dayPrice, nightPrice: court_data.nightPrice},
            {new: true});
        return court;
    } catch (e) {
        console.error(e);
        throw new Error('A problem was encountered while editing the court.');
    }
};