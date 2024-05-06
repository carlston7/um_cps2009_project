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

/**
 * Sends a POST request to the server allowing a user to register on the platform triggering a confirmation email to be sent to the email address provided.
 *
 * @param {Object} req - The request object containing user registration data.
 * @param {Object} req.body - The request body containing user registration data.
 * @param {string} req.body.email - The email address of the user being registered.
 * @param {string} req.body.password - The password of the user being registered.
 * @param {string} req.body.name - The name of the user being registered.
 * @param {string} req.body.surname - The surname of the user being registered.
 * @param {Object} res - The response object used to send responses to the client.
 * @returns {Promise<any>} - A promise that resolves after the user registration process is completed.
 * @throws {Error} - If there is an error during the user registration process.
 */
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

// GET /friends/requests - Fetch all friend requests for the logged-in user
router.get('/friends/requests', async (req, res) => {
    const userEmail = req.headers['user-email'];

    if (!userEmail) {
        return res.status(400).json({ error: 'User email is required.' });
    }

    try {
        const user = await User.findOne({ email_address: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const requests = await User.find({
            email_address: { $in: user.friendRequests }
        }).select('email_address'); 

        res.status(200).json(requests.map(req => ({ senderEmail: req.email_address })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// POST /api/friends/request
router.post('/friends/request', async (req, res) => {
    const { receiverEmail } = req.body;
    const senderEmail = req.headers['user-email'];

    if (senderEmail === receiverEmail) {
        return res.status(400).json({ message: "You cannot send a friend request to yourself." });
    }

    try {
        const sender = await User.findOne({ email_address: senderEmail });
        const receiver = await User.findOne({ email_address: receiverEmail });

        if (!receiver) {
            return res.status(404).json({ message: "User not found." });
        }

        if (receiver.friendRequests.includes(sender.email_address)) {
            return res.status(400).json({ message: "Friend request already sent." });
        }

        // Add sender's email to receiver's friendRequests array
        receiver.friendRequests.push(sender.email_address);
        await receiver.save();

        res.status(200).json({ message: "Friend request sent successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /friends/respond
router.post('/friends/respond', async (req, res) => {
    const { senderEmail, accept } = req.body;
    const receiverEmail = req.headers['user-email'];

    try {
        const receiver = await User.findOne({ email_address: receiverEmail });
        const sender = await User.findOne({ email_address: senderEmail });

        if (!sender) {
            return res.status(404).json({ message: "Sender not found." });
        }

        // Remove the request regardless of accept or decline
        receiver.friendRequests = receiver.friendRequests.filter(email => email !== senderEmail);

        if (accept) {
            receiver.friends.push({ email: senderEmail, accepted: true });
            sender.friends.push({ email: receiverEmail, accepted: true });
            await sender.save();
        }

        await receiver.save();
        res.status(200).json({ message: `Friend request ${accept ? 'accepted' : 'declined'}.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET /friends/list
router.get('/friends/list', async (req, res) => {
    const userEmail = req.headers['user-email'];

    try {
        const user = await User.findOne({ email_address: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user.friends.filter(friend => friend.accepted));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET /api/friends/requests/count - Get the count of friend requests
router.get('/friends/requests/count', async (req, res) => {
    const userEmail = req.headers['user-email'];
    try {
        const user = await User.findOne({ email_address: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const count = user.friendRequests.length; // Assuming friendRequests is an array of requests
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.patch('/send/credit', async (req, res) => {
    try {
        const { email, amount } = req.body;
        const sender = await User.findOne({ email_address: req.headers['user-email'] });
        const receiver = await User.findOne({ email_address: email });

        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than 0." });
        }

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found." });
        }

        if (sender.credit < amount) {
            return res.status(400).json({ message: "Insufficient credit." });
        }

        // Check if receiver is sender's friend and friendship is accepted
        const isFriend = sender.friends.some(friend => friend.email === email && friend.accepted);
        if (!isFriend) {
            return res.status(403).json({ message: "Receiver is not your friend." });
        }

        sender.credit -= amount;
        receiver.credit += amount;

        await sender.save();
        await receiver.save();

        res.status(200).json({ message: "Credit sent successfully.", senderCredit: sender.credit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;