const User = require('../models/users')
const bcrypt = require('bcryptjs')

exports.create_user = async (user_data) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashed_pwd = await bcrypt.hash(user_data.password, salt);
        user_data.password = hashed_pwd;

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