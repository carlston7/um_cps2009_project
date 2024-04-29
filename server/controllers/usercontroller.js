const User = require('../models/users')
const bcrypt = require('bcryptjs')

exports.create_user = async (user_data, confirmationToken, tokenExpiration) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashed_pwd = await bcrypt.hash(user_data.password, salt);
        user_data.password = hashed_pwd;

        const mappedData = {
            ...user_data,
            email_address: user_data.email,
            credit: 0,
            type: 'member',
            confirmationToken: confirmationToken,
            tokenExpiration: tokenExpiration,
            emailVerified: false, 
            resetCode: null,          
            resetCodeExpiration: null,
        };
        const user = new User(mappedData);
        
        await user.save();
        return user;
    } catch (e) {
        console.error(e);
        throw new Error('A problem was encountered while creating the user.');
    }
};

exports.update_user_credit = async (email, price, booking_flag) => {
    try{
        let user;

        if (booking_flag) {
            user = await User.findOneAndUpdate(
                { email_address: email },
                { $inc: { credit: -price } },
                { new: true }
            );
        } else {
            user = await User.findOneAndUpdate(
                { email_address: email },
                { $inc: { credit: price } },
                { new: true }
            );
        }
        
        if (!user) {
            throw new Error('User not found.');
        }
        
        return user;
    } catch (e) {
        console.error(e);
        throw new Error('A problem was encountered while updating the user\'s credit.');
    }
};

exports.get_user_credit = async (email) => {
    try {
        const user = await User.findOne({ email_address: email });
        if (!user) {
            throw new Error(`User not found for email: ${email}`);
        }
        return user.credit;
    } catch (e) {
        console.error(`Database access error for email ${email}:`, e);
        throw new Error('A problem was encountered while getting the user\'s credit.');
    }
};

exports.edit_user = async (user_data) => {
    try{
        const updatedUser = await User.findOneAndUpdate(
            { email_address: user_data.email },
            { name: user_data.name, surname: user_data.surname },
            { new: true }  // ensure modified document is returned NOT the pre edited one
        );
        
        if (!updatedUser) {
            throw new Error('User not found.');
        }
        
        return updatedUser;
    } catch (e) {
        console.error(e);
        throw new Error('A problem was encountered while editing the user profile.');
    }
};