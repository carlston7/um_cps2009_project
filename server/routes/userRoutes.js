/**
 * @file This file contains the user route handlers and functions for user registration, login, profile management, email confirmation, password reset, and friend requests.
 * @module profile
 */
const express = require('express');
const router = express.Router();
const { create_user, get_user_credit, edit_user } = require('../controllers/usercontroller');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const crypto = require('crypto');
const { send_booking_confirmation } = require('../controllers/mail.js');

/**
 * Generates a confirmation token for the user, stores it in the user document, and returns the token.
 * @async
 * @function generateToken
 * @param {Object} user - The user object to generate the token for.
 * @param {string} user.confirmationToken - The confirmation token to be generated and stored.
 * @param {number} user.tokenExpiration - The expiration timestamp of the token.
 * @returns {Promise<string>} - The generated confirmation token.
 */
const generateToken = async (user) => {
    /**
     * Generate a random confirmation token.
     * @type {string}
     */
    const token = crypto.randomBytes(20).toString('hex');

    user.confirmationToken = token;
    user.tokenExpiration = Date.now() + 3600000; // 1 hour from now
    await user.save();
    return token;
};

/**
 * POST /signup
 * Creates a new user account and sends a confirmation email with a verification link.
 * @name POST/signup
 * @function
 * @memberof module:profile
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing user signup data.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.surname - The surname of the user.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response indicating the success of the signup process.
 * @throws {Error} - If there is an error during the signup process.
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


/**
 * GET /confirm-email
 * Confirms the user's email address using a token.
 * @name GET/confirm-email
 * @function
 * @memberof module:profile
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters.
 * @param {string} req.query.token - The token for email confirmation.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response indicating the success or failure of the email verification.
 * @throws {Error} - If there is a server error or if the token is invalid or expired.
 */
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

/**
 * POST /login
 * Validates user login credentials and returns user information if successful.
 * @name POST/login
 * @function
 * @memberof module:profile
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing login credentials.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response containing user information if login is successful.
 * @throws {Error} - If there is an error during the login process.
 */
router.post('/login', async (req, res) => {
    try {
        const user_data = req.body;

        // Find user by email address using Mongoose
        const user = await User.findOne({ email_address: user_data.email });
        if (!user) {
            return res.status(401).send('Invalid email address'); // Stop further processing and return
        }
        if (!user.emailVerified) {
            res.status(401).send('Email not verified');
        }
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
        } else {
            res.status(401).send('Invalid password');
        }
    } catch (error) {
        res.status(500).send('An error occurred: ' + error.message);
    }
});

/**
 * GET /credit
 * Retrieves the credit balance of the user based on the email address provided in the request headers.
 * @name GET/credit
 * @function
 * @memberof module:profile
 * @param {Object} req - The request object.
 * @param {Object} req.headers - The headers of the request containing the user's email.
 * @param {string} req.headers'user-email' - The email address of the user.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response containing the user's credit balance.
 * @throws {Error} - If there is an error retrieving the user's credit balance.
 */
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

/**
 * PATCH /profile
 * Updates the user's profile information.
 * @name PATCH/profile
 * @function
 * @memberof module:profile
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing user profile data.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.password - The current password of the user.
 * @param {string} [req.body.name] - The new name of the user.
 * @param {string} [req.body.surname] - The new surname of the user.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response indicating the success or failure of the profile update.
 * @throws {Error} - If there is an error updating the profile.
 */
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

/**
 * Generates a random 4-digit code.
 * @function generateFourDigitCode
 * @returns {string} - A string representation of the generated 4-digit code.
 */
const generateFourDigitCode = () => {
    /**
     * Generate a random number between 1000 and 9999.
     * @type {number}
     */
    const code =  Math.floor(1000 + Math.random() * 9000);  // Generate a number between 1000 and 9999

    return code.toString();
};

/**
 * POST /email-one-time-code
 * Sends a one-time code to the user's email address for password reset.
 * @name POST/email-one-time-code
 * @function
 * @memberof module:profile
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing the user's email address.
 * @param {string} req.body.email_address - The email address of the user requesting the password reset code.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response indicating the success of sending the one-time code.
 * @throws {Error} - If there is an error during the process of sending the code.
 */
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

/**
 * POST /forget-password
 * Resets the user's password using a provided reset code and updates it with a new password.
 * @name POST/forget-password
 * @function
 * @memberof module:profile
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing user data for password reset.
 * @param {string} req.body.email_address - The email address of the user.
 * @param {string} req.body.code - The reset code sent to the user's email.
 * @param {string} req.body.newPassword - The new password to set for the user.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response indicating the success of the password reset.
 * @throws {Error} - If there is an error during the password reset process.
 */
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

/**
 * GET /friends/requests
 * Retrieves pending friend requests for the user.
 * @name GET/friends/requests
 * @function
 * @memberof module:profile
 * @param {Object} req - The request object.
 * @param {Object} req.headers - The headers of the request containing the user's email.
 * @param {string} req.headers'user-email' - The email address of the user.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response containing the pending friend requests.
 * @throws {Error} - If there is an error retrieving the friend requests.
 */
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


/**
 * POST /friends/request
 * Sends a friend request from the logged-in user to another user.
 * @name POST/friends/request
 * @function
 * @memberof module:profile
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing the receiver's email address.
 * @param {string} req.body.receiverEmail - The email address of the user to whom the friend request is sent.
 * @param {Object} req.headers - The headers of the request containing the logged-in user's email address.
 * @param {string} req.headers'user-email' - The email address of the logged-in user.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response indicating the success of sending the friend request.
 * @throws {Error} - If there is an error sending the friend request.
 */
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

/**
 * POST /friends/respond
 * Responds to a friend request sent by another user.
 * @name POST/friends/respond
 * @function
 * @memberof module:respondToFriendRequest
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing the sender's email and response (accept/decline).
 * @param {string} req.body.senderEmail - The email address of the user who sent the friend request.
 * @param {boolean} req.body.accept - Indicates whether the user accepts the friend request (true) or declines it (false).
 * @param {Object} req.headers - The headers of the request containing the receiver's email address.
 * @param {string} req.headers'user-email' - The email address of the user responding to the friend request.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response indicating the success of responding to the friend request.
 * @throws {Error} - If there is an error responding to the friend request.
 */
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

/**
 * GET /friends/list
 * Retrieves the list of accepted friends for the logged-in user.
 * @name GET/friends/list
 * @function
 * @memberof module:profile
 * @param {Object} req - The request object.
 * @param {Object} req.headers - The headers of the request containing the user's email address.
 * @param {string} req.headers'user-email' - The email address of the logged-in user.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response containing the list of accepted friends.
 * @throws {Error} - If there is an error retrieving the list of accepted friends.
 */
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

/**
 * GET /friends/requests/count
 * Retrieves the count of pending friend requests for the logged-in user.
 * @name GET/friends/requests/count
 * @function
 * @memberof module:profile
 * @param {Object} req - The request object.
 * @param {Object} req.headers - The headers of the request containing the user's email address.
 * @param {string} req.headers'user-email' - The email address of the logged-in user.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response containing the count of pending friend requests.
 * @throws {Error} - If there is an error retrieving the count of pending friend requests.
 */
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

/**
 * PATCH /send/credit
 * Sends credit from one user to another.
 * @name PATCH/send/credit
 * @function
 * @memberof module:profile
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing the receiver's email and the amount of credit to send.
 * @param {string} req.body.email - The email address of the user who will receive the credit.
 * @param {number} req.body.amount - The amount of credit to send.
 * @param {Object} req.headers - The headers of the request containing the sender's email address.
 * @param {string} req.headers'user-email' - The email address of the user sending the credit.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response indicating the success of sending the credit.
 * @throws {Error} - If there is an error sending the credit.
 */
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