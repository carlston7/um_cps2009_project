/**
 * @file This file contains the route handlers for booking related requests.
 * @module bookings
 */
const express = require('express');
const router = express.Router();

const { create_booking, get_booking,
        get_bookings, get_available_courts, delete_booking,
        accept_game_invite } = require('../controllers/bookingcontroller');
const { get_court_price } = require('../controllers/courtcontroller.js');
const { update_user_credit, is_friend } = require('../controllers/usercontroller.js');
const { send_booking_confirmation, send_booking_invites } = require('../controllers/mail.js');
const User = require('../models/users');
const bcrypt = require('bcryptjs');

/**
 * GET /courts
 * Retrieves all courts avaialble for a specific date and time
 * @name GET/courts
 * @function
 * @memberof module:bookings
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters.
 * @param {string|string[]} req.query.dateTime - The date and time to filter the courts.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response containing the courts.
 * @throws {Error} - If there is an error retrieving the courts for that date and time.
 */
router.get('/courts', async (req, res) => {
    try {
        const courts = await get_available_courts(req.query.dateTime);

        res.status(201).json(courts);
    } catch (e) {
        console.error('Error getting courts', error);
        res.status(500).send('An error occurred: ' + error.message);
    }
});

/**
 * POST /book-court
 * Creates a booking for a specific court and time if the user has sufficient credit and the court is available.
 * @name POST/book-court
 * @function
 * @memberof module:bookings
 * @param {Object} req - The request object.
 * @param {Object} req.headers - User email and password for authentication
 * @param {Object} req.body - The body of the request containing booking details.
 * @param {string} req.body.courtName - Name of the court to book.
 * @param {string} req.body.dateTimeIso - ISO string of the date and time for the booking.
 * @param {string[]} req.body.emails - Emails of friends invited to the booking.
 * @returns {Object} - JSON response indicating success or failure of the booking process.
 * @throws {Error} - If there is an error during the booking creation process.
 */
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
                    // Check if booking is within a week
                    const oneWeekFromNow = new Date(currentTime.getTime() + (7 * 24 * 60 * 60 * 1000));
                    if (bookingTime <= oneWeekFromNow) {
                    let friend = true;
                    for (const friend_email of req.body.emails) {
                        friend = await is_friend(user.email_address, friend_email);
                        if (!friend) {
                            break;
                        }
                    }
                    if (friend) {
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
                        const user_price = court_price / (req.body.emails.length + 1);
                        await send_booking_invites(data.user_email, data.court_name, formattedDate, formattedTime, booking._id, user_price, req.body.emails);
                        res.status(201).json({ message: 'Success' });
                    } else {
                        res.status(400).json({ message: 'Game invitations can only be sent to friends. Send them a friend request first.' });
                    }
                } else {
                        res.status(400).json({ message: 'Bookings can only be made for an upcoming date/time within a week.' });
                    }
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

/**
 * GET /user-bookings
 * Retrieves all bookings associated with a user's email address.
 * @name GET/user-bookings
 * @function
 * @memberof module:bookings
 * @param {Object} req - The request object.
 * @param {Object} req.headers - User's email to fetch bookings.
 * @returns {Object} - JSON response containing an array of bookings.
 * @throws {Error} - If there is an error retrieving the user's bookings.
 */
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

/**
 * DELETE /cancel-booking
 * Cancels a specific booking and refunds credits if the cancellation is made at least 24 hours before the booking time.
 * @name DELETE/cancel-booking
 * @function
 * @memberof module:bookings
 * @param {Object} req - The request object.
 * @param {Object} req.headers - User's email and password for authentication.
 * @param {Object} req.body - The body of the request containing the booking ID.
 * @param {string} req.body._id - ID of the booking to cancel.
 * @returns {Object} - JSON response indicating success or failure of the booking cancellation.
 * @throws {Error} - If there is an error during the booking cancellation process.
 */
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
            await delete_booking(booking._id);
            const court_price = await get_court_price(booking.court_name, start.getHours());
            const confirmedAndAcceptedResponses = booking.invite_responses.filter(response => response.status.confirmed && response.status.accepted);
            const numParticipants = confirmedAndAcceptedResponses.length + 1;
            const eachRefund = court_price / numParticipants;
            
            const updated_user = await update_user_credit(user.email_address, eachRefund, false);

            for (const response of booking.invite_responses) {
                if (response.status.confirmed && response.status.accepted) {
                    await update_user_credit(response.email, eachRefund, false);
                }
            }

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

/**
 * POST /respond
 * Allows a user to accept or reject an invitation to a game, updating the booking accordingly.
 * @name POST/respond
 * @function
 * @memberof module:bookings
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing response details.
 * @param {string} req.body.email_address - Email of the user responding to the invite.
 * @param {boolean} req.body.accept - Whether the invite is accepted or not.
 * @returns {Object} - JSON response indicating the updated status of the booking.
 * @throws {Error} - If there is an error while updating the invitation response.
 */
router.post('/respond', async (req, res) => {
    try {
        const booking = await accept_game_invite(req.body);

        const response = booking.invite_responses.find(response => response.email === req.body.email_address);

        const accepted = response ? response.status.accepted : false;

        if (accepted) {
            const court_price = await get_court_price(booking.court_name, new Date(booking.start).getHours());
            const price = court_price / (booking.invite_responses.length + 1);
            console.log("Price: ", price, "Court price: ", court_price);
            await update_user_credit(req.body.email_address, price, true);
            await update_user_credit(booking.user_email, price, false);
        }

        res.status(200).json({ message: "Your response to the invitation has been updated." });

    } catch (error) {
        console.error('Error accepting/rejecting invitation:', error);
        res.status(500).send(error.message);
    }
});

module.exports = router;