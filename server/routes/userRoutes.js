const express = require('express');
const router = express.Router();
const { create_user, get_user_credit, edit_user } = require('../controllers/usercontroller');
const bcrypt = require('bcryptjs');

router.post('/signup', async (req, res) => {
    try {

        const user_exists = await User.exists({ email_address: req.body.email });

        if (user_exists) {
            return res.status(400).json({ error: 'Email address already exists' });
        } else {
            const user = await create_user(req.body);
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

//Login validation
router.post('/login', async (req, res) => {
    try {
        const user_data = req.body;

        // Find user by email address using Mongoose
        const user = await User.findOne({ email_address: user_data.email });

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
        const user = await User.findOne({ email_address: req.body.email });
        const valid_pwd = await bcrypt.compare(req.body.password, user.password);

        if (user && valid_pwd) {
            const profile = await edit_user(req.body);
            res.status(201).json({
                message: 'Profile updated.',
                name: profile['name'],
                surname: profile['surname']
            });
        } else {
            res.status(403).json({ message: "Forbidden" });
        }
    } catch (e) {
        console.error('Error updating profile', error);
        res.status(500).send('An error occurred: ' + error.message);
    }
});

module.exports = router;