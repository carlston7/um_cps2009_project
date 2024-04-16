const express = require('express');
const router = express.Router();

const { create_booking, get_bookings, get_available_courts } = require('../controllers/bookingcontroller');
const { get_court_price } = require('../controllers/courtcontroller.js');
const { update_user_credit } = require('../controllers/usercontroller.js');
const { send_booking_confirmation } = require('../controllers/mail.js');

router.get('/courts', async (req, res) => {
    try {
        const courts = await get_available_courts(req.query.dateTime);

        res.status(201).json(courts);
    } catch (e) {
        console.error('Error getting courts', error);
        res.status(500).send('An error occurred: ' + error.message);
    }
});

router.post('/book-court', async (req, res) => {
    try {
        const user = await User.findOne({ email_address: req.headers['user-email'] });
        const valid_pwd = await bcrypt.compare(req.headers['user-password'], user.password);

        if (user && valid_pwd) {

            const court_price = await get_court_price(req.body.courtName, new Date(req.body.dateTimeISO).getHours());
            if (user.credit >= court_price) {

                const courts = await get_available_courts(req.body.dateTimeISO);
            const court_names = courts.map(court => court.name);

            if (court_names.includes(req.body.courtName)) {

                if (new Date() < new Date(req.body.dateTimeISO)) {
                    const data = {
                        start: req.body.dateTimeIso,
                        user_email: req.headers['user-email'],
                        court_name: req.body.courtName
                    };

                    const booking = await create_booking(data);
                    const user = await update_user_credit(req.headers['user-email'], court_price);

                    const dateTimeParts = req.body.dateTimeIso.split('T');
                    const datePart = dateTimeParts[0];
                    const timePart = dateTimeParts[1];

                    const formattedDate = new Date(datePart).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    const formattedTime = new Date(`1970-01-01T${timePart}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                    const mailOptions = {
                        from: 'manager.tennisclub@gmail.com',
                        to: `${data.user_email}, manager.tennisclub@gmail.com`,
                        subject: 'Booking Confirmation',
                        html: ` 
                  <h4>The following booking made by ${data.user_email} has been confirmed:</h4>
                  <p>Court Name: ${data.court_name}</p>
                  <p>Date: ${formattedDate}</p>
                  <p>Time: ${formattedTime}</p>
                `
                    };

                    await send_booking_confirmation(mailOptions);

                    res.status(201).json({ message: 'Success' });
              } else {
                  res.status(400).json({ message: 'Bookings can only be made for an upcoming date/time.' });
              }


          } else {
              res.status(404).json({ message: 'Court not available at this hour.' });
                }

            } else {
                res.status(402).json({ message: 'Insufficient funds' });
            }
        } else {
            res.status(403).json({ message: "Forbidden" });
        }

    } catch (e) {
        console.error('Error creating booking', e);
        res.status(500).send('An error occurred: ' + e.message);
    }
});

router.get('/user-bookings', async (req, res) => {
    try {
        const email = req.headers['email'];
        if (!email) {
            return res.status(400).send('Email address is required');
        }
        const bookings = await get_bookings(email);
        res.json(bookings);
    } catch (error) {
        console.error('Error getting bookings:', error);
        res.status(500).send(error.message);
    }
});

module.exports = router;