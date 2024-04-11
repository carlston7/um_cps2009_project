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
        const court = await Court.findOneAndUpdate({name: court_data.name},
            {dayPrice: court_data.dayPrice, nightPrice: court_data.nightPrice});
        
        if (!court) {
            throw new Error('Court not found.');
        }
        
        return court;
    } catch (e) {
        console.error(e);
        throw new Error('A problem was encountered while editing the court.');
    }
};

exports.get_courts = async () => {
    try {
        const courts = await Court.find({}).lean()

        if (!courts) {
            throw new Error('No Courts not found.');
        }

        return courts;
    } catch (e) {
        console.error(e);
        throw new Error('A problem was encountered while getting courts.');
    }
};

exports.get_court_price = async (court_name, time_booking) => {
    try{
        const court = await Court.findOne({ name: court_name });
        
        if (!court) {
            throw new Error('Court not found.');
        }

        if (time_booking >= 18)
        {
            return court.nightPrice;
        } else {
            return court.dayPrice;
        }        
    } catch (e) {
        console.error(e);
        throw new Error('A problem was encountered while getting the price of the court.');
    }
};