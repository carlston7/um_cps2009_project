const express = require('express');
const router = express.Router();
const { create_user, get_user_credit, edit_user } = require('../controllers/usercontroller');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const crypto = require('crypto');
const { send_booking_confirmation } = require('../controllers/mail.js');

// Function to generate and store a token
const generateToken = async (user) => {
    const token = crypto.randomBytes(20).toString('hex');
    user.confirmationToken = token;
    user.tokenExpiration = Date.now() + 3600000; // 1 hour from now
    await user.save();
    return token;
};

router.post('/signup', async (req, res) => {
    try {

        const user_exists = await User.exists({ email_address: req.body.email });

        if (user_exists) {
            return res.status(400).json({ error: 'Email address already exists' });
        } else {
            const confirmationToken = crypto.randomBytes(20).toString('hex');
            const tokenExpiration = Date.now() + 10800000; // 1 hour from now (db saves it 2 hours backwards so 3 hours accounts for this)
            const user = await create_user(req.body,confirmationToken,tokenExpiration);
            const token = await generateToken(user);

            const mailOptions = {
                from: 'manager.tennisclub@gmail.com',
                to: user.email_address,
                subject: 'Confirm your Email',
                text: `Please confirm your email by clicking on the following link: https://cps2009project.azurewebsites.net/confirm-email?token=${token}`
            };
            console.log("Mail options: ", mailOptions);
            await send_booking_confirmation(mailOptions); // rename to send email later

            res.status(201).json({
                message: 'Sign up successful',
                email: user.email_address,
                type: user.type,
                password: req.body.password,
                credit: user.credit,
                name: user.name,
                surname: user.surname,
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Server Error');
    }
});

router.get('/confirm-email', async (req, res) => {
    try {
        console.log("Confirming email");
        const { token } = req.query;
        const user = await User.findOne({ confirmationToken: token, tokenExpiration: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        user.confirmationToken = undefined;
        user.tokenExpiration = undefined;
        user.emailVerified = true;
        await user.save();

        res.json({ message: 'Email verification successful' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server Error' });
    }
});

//Login validation
router.post('/login', async (req, res) => {
    try {
        const user_data = req.body;

        // Find user by email address using Mongoose
        const user = await User.findOne({ email_address: user_data.email });
        if (!user.emailVerified) {
            res.status(401).send('Email not verified');
        }
        // Check if user exists and compare passwords (make sure to hash passwords in production)
        if (user) {
            const valid_pwd = await bcrypt.compare(user_data.password, user.password);

            if (valid_pwd) {
                res.status(200).json({
                    message: 'Login successful',
                    email: user.email_address,
                    type: user.type,
                    password: req.body.password,
                    credit: user.credit,
                    name: user.name,
                    surname: user.surname,
                });
            }
            else {
                res.status(401).send('Invalid password');
            }
        } else {
            res.status(401).send('Invalid email address');
        }
    } catch (error) {
        console.error('Error logging in:', error); // Log the specific error
        res.status(500).send('An error occurred: ' + error.message);
    }
});

router.get("/credit", async (req, res) => {
    const email = req.headers['user-email'];
    if (!email) {
        return res.status(400).send({ error: 'Email header is required.' });
    }

    try {
        const credit = await get_user_credit(email);
        res.send({ credit });
    } catch (e) {
        console.error(e);
        // Check if headers have been sent before trying to send a response
        if (!res.headersSent) {
            res.status(500).send({ error: e.message });
        }
    }
});

router.patch('/profile', async (req, res) => {
    try {
        res.set('Cache-Control', 'no-store');

        const user = await User.findOne({ email_address: req.body.email });
        const valid_pwd = await bcrypt.compare(req.body.password, user.password);

        if (user && valid_pwd) {
            const profile = await edit_user(req.body);
            console.log("Profile: ", profile);
            res.status(201).json({
                message: 'Profile updated.',
                name: profile.name,
                surname: profile.surname
            });
        } else {
            res.status(403).json({ message: "Forbidden" });
        }
    } catch (e) {
        console.error('Error updating profile', error);
        res.status(500).send('An error occurred: ' + error.message);
    }
});

// Helper function to generate a 4-digit code
const generateFourDigitCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();  // Generate a number between 1000 and 9999
};

// Route to initiate the password reset process
router.post('/email-one-time-code', async (req, res) => {
    const { email_address } = req.body;

    try {
        const user = await User.findOne({ email_address });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate and store the 4-digit code
        const resetCode = generateFourDigitCode();
        user.resetCode = resetCode;
        user.resetCodeExpiration = new Date(Date.now() + 3600000);   // Code valid for 1 hour
        await user.save();

        const mailOptions = {
            from: 'manager.tennisclub@gmail.com',
            to: user.email_address,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${resetCode}`
        };

        await send_booking_confirmation(mailOptions);
        res.json({ message: 'A one-time code has been sent to your email.' });
    } catch (error) {
        console.error('Forget password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to reset the password using the 4-digit code
router.post('/forget-password', async (req, res) => {
    const { email_address, code, newPassword } = req.body;

    try {
        const user = await User.findOne({ email_address, resetCode: code, resetCodeExpiration: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset code' });
        }

        // Update the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.resetCode = null;  // Set to null if you want to keep the field
        user.resetCodeExpiration = null;  // Set to null if you want to keep the field
        await user.save();

        res.status(201).json({
                message: 'Password reset successful',
                email: user.email_address,
                password: newPassword,
            });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;