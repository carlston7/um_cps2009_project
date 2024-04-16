const express = require('express');
const router = express.Router();
const { create_court, get_courts, edit_court } = require('../controllers/courtcontroller');

router.get('/courts-all', async (req, res) => {
    try {
        const courts = await get_courts();

        res.status(201).json(courts);
    } catch (e) {
        console.error('Error getting courts', error);
        res.status(500).send('An error occurred: ' + error.message);
    }
});

// app.post('/court', requireAdmin, async (req, res) => {
router.post('/court', async (req, res) => {
    try {
        const user = await User.findOne({ email_address: req.headers['user-email'] });
        const valid_pwd = await bcrypt.compare(req.headers['user-password'], user.password);
        // const court = await create_court(req.body);
        // res.status(201).json({ message: 'Success' });
        if (req.headers['user-type'] !== 'admin' ||
            req.headers['user-email'] !== 'admin@admin.admin' ||
            !valid_pwd) {
            res.status(403).json({ message: "Forbidden" });
        } else {
            const courts = await get_courts();
            const courtNames = courts.map(court => court.name);

            if (courtNames && courtNames.includes(req.body.name)) {
                res.status(409).json({ message: 'Court already exists.' });
            } else {
                const court = await create_court(req.body);
                res.status(201).json({ message: 'Success' });
            }
        }
    } catch (error) {
        console.error('Error creating court', error); // Log the specific error
        res.status(500).send('An error occurred: ' + error.message);
        // if(error.statusCode === 403) {
        //   return res.status(403).json({ message: "Forbidden" });
        // } else {
        //   console.error('Error creating court', error); // Log the specific error
        //   res.status(500).send('An error occurred: ' + error.message);
        // }
    }
});

router.patch('/court', async (req, res) => {
    try {
        const user = await User.findOne({ email_address: req.headers['user-email'] });
        const valid_pwd = await bcrypt.compare(req.headers['user-password'], user.password);

        if (req.headers['user-type'] !== 'admin' ||
            req.headers['user-email'] !== 'admin@admin.admin' ||
            !valid_pwd) {
            res.status(403).json({ message: "Forbidden" });
        } else {

            const court = await edit_court(req.body);
            res.status(201).json({ message: 'Court updated.' });

        }
    } catch (e) {
        console.error('Error updating court', error);
        res.status(500).send('An error occurred: ' + error.message);
    }
});

module.exports = router;
