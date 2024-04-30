const express = require('express');
const router = express.Router();

const { create_booking, get_booking,
        get_bookings, get_available_courts, delete_booking,
        accept_game_invite } = require('../controllers/bookingcontroller');
const { get_court_price } = require('../controllers/courtcontroller.js');
const { update_user_credit } = require('../controllers/usercontroller.js');
const { send_booking_confirmation, send_booking_invites } = require('../controllers/mail.js');
const User = require('../models/users');
const bcrypt = require('bcryptjs');

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

            const court_price = await get_court_price(req.body.courtName, new Date(req.body.dateTimeIso).getHours());
            if (user.credit >= court_price) {

                const courts = await get_available_courts(req.body.dateTimeIso);
                const court_names = courts.map(court => court.name);

                if (court_names.includes(req.body.courtName)) {
                
                    const currentTime = new Date();
                    const bookingTime = new Date(req.body.dateTimeIso);
                    const timezoneOffsetHours = 2;
                    const cetCurrentTime = new Date(currentTime.getTime() + (timezoneOffsetHours * 60 * 60 * 1000));

                    if (cetCurrentTime < bookingTime) {
                        const data = {
                            start: req.body.dateTimeIso,
                            user_email: req.headers['user-email'],
                            court_name: req.body.courtName,
                            invite_responses: req.body.emails.map(email => ({
                                email: email,
                                status: {
                                    confirmed: false,
                                    accepted: false
                                }
                            }))
                        };

                        const booking = await create_booking(data);
                        const user = await update_user_credit(req.headers['user-email'], court_price, true);

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
                        
                        //const court_price = await get_court_price(data.court_name, new Date(req.body.dateTimeIso).getHours());
                        const user_price = court_price / req.body.emails.length + 1;
                        await send_booking_invites(data.user_email, data.court_name, formattedDate, formattedTime, booking._id, user_price, req.body.emails);

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

router.delete('/cancel-booking', async (req, res) => {
    try {
        const user = await User.findOne({ email_address: req.headers['user-email'] });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const valid_pwd = await bcrypt.compare(req.headers['user-password'], user.password);
        if (!valid_pwd) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const booking = await get_booking(req.body._id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const start = new Date(booking.start);
        const current = new Date();
        const timeDifference = start - current;

        // Check if the booking is more than 24 hours ahead
        if (timeDifference > 24 * 60 * 60 * 1000) {
            const book_del = await delete_booking(booking._id);
            const court_price = await get_court_price(book_del.court_name, new Date(book_del.start).getHours());
            const updated_user = await update_user_credit(req.headers['user-email'], court_price, false);

            const mailOptions = {
                from: 'manager.tennisclub@gmail.com',
                to: `${user.email_address}, manager.tennisclub@gmail.com`,
                subject: 'Booking Cancellation Confirmation',
                html: ` 
                    <h4>The following booking made by ${updated_user.email_address} has been confirmed:</h4>
                    <p>Court Name: ${booking.court_name}</p>
                    <p>Date: ${start.toDateString()}</p>
                    <p>Time: ${start.getHours()}:00 - ${start.getHours() + 1}:00</p>
                `
            };

            await send_booking_confirmation(mailOptions);
            res.status(200).json({ message: "Booking successfully canceled and credits refunded." });
        } else {
            throw new Error('A booking can only be deleted up till 24 hours before.')
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).send(error.message);
    }
});

router.post('/respond', async (req, res) => {
    try {
        const booking = await accept_game_invite(req.body);

        const response = booking.invite_responses.find(response => response.email === req.body.email_address);

        const accepted = response ? response.status.accepted : false;

        if (accepted) {
            const court_price = await get_court_price(booking.court_name, new Date(req.body.dateTimeIso).getHours());
            const price = court_price / booking.invite_responses.length + 1;
            const user = await update_user_credit(req.body.email_address, price, true);
            const booking_user = await update_user_credit(booking.user_email, price, false);
        }

        res.status(200).json({ message: "Your response to the invitation has been updated." });

    } catch (error) {
        console.error('Error accepting/rejecting invitation:', error);
        res.status(500).send(error.message);
    }
});

module.exports = router;