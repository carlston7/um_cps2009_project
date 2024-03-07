const User = require('../models/users')

exports.create_user = async (user_data) => {
    try{
        const mappedData = {
            ...user_data,
            email_address: user_data.email
        };
        var user = new User(mappedData);
        user.credit = 0;
        user.type = 'member';
        await user.save();
        return user;
    } catch (e) {
        console.error(e);
        throw new Error('A problem was encountered while creating the user.');
    }
};