const User = require('../models/users')

exports.create_user = async (user_data) => {
    try{
        const mappedData = {
            ...user_data,
            email_address: user_data.email,
            credit: 0,
            type: 'member'
        };
        const user = new User(mappedData);
        
        await user.save();
        return user;
    } catch (e) {
        console.error(e);
        throw new Error('A problem was encountered while creating the user.');
    }
};