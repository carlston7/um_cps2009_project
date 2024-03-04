const User = require('../models/users')

exports.create_user = async (user_data) => {
    try{
        const user = new User(user_data);
        await user.save();
        return user;
    }catch (e){
        throw new Error('A problem was encountered while creating the user.');
    }
};