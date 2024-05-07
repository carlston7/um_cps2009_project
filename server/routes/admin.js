const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Booking = require('../models/bookings');
const Court = require('../models/courts');
const bcrypt = require('bcryptjs');

const { create_booking} = require('../controllers/bookingcontroller');

router.get('/admin/bookings', async (req, res) => {
    try {
        let { dates, courts } = req.query;
        if (typeof dates === 'string') {
            dates = [dates];
        }
        if (typeof courts === 'string') {
            courts = [courts];
        }

        const user = await User.findOne({ email_address: req.headers['user-email'] });
        const valid_pwd = await bcrypt.compare(req.headers['user-password'], user.password);
        if (!user || !user.type.includes('admin') || !valid_pwd) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Convert dates to cover the whole day from 00:00:00 to 23:59:59
        const dateQueries = dates.map(date => ({
            start: {
                $gte: new Date(new Date(date).setUTCHours(0, 0, 0, 0)),
                $lt: new Date(new Date(date).setUTCHours(23, 59, 59, 999))
            }
        }));

        const bookings = await Booking.find({
            $and: [
                { $or: dateQueries }, // Apply date ranges
                { court_name: { $in: courts } }
            ]
        });
        console.log("found bookings", bookings);
        res.status(200).json(bookings);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error retrieving bookings.');
    }
});

router.post('/admin/block-courts', async (req, res) => {
    try {
        const { dates, courts } = req.body; // Include userEmail in body for admin check
        const user = await User.findOne({ email_address: req.headers['user-email'] });//need to add password check

        if (!dates || !courts || dates.length === 0 || courts.length === 0) {
            return res.status(400).json({ message: 'Missing or empty dates or courts in the request.' });
        }
        const valid_pwd = await bcrypt.compare(req.headers['user-password'], user.password);
        if (!user || !user.type.includes('admin') || !valid_pwd) {
            console.log('Access Denied Logic Triggered'); // Log when access is denied
            return res.status(403).json({ message: 'Access denied' });
        }

        console.log("Received dates: ", dates);
        console.log("Received courts: ", courts);

        // Prepare date ranges for the query
        const dateRanges = dates.map(date => ({
            start: {
                $gte: new Date(date + "T00:00:00.000Z"),
                $lt: new Date(date + "T23:59:59.999Z")
            }
        }));

        // Query to find sessions within the given date ranges and court ids
        const sessionsToBlock = await Booking.find({
            $and: [
                { $or: dateRanges },  // This applies the date ranges
                { court_name: { $in: courts } } // This checks if court_name is in the list of courts
            ]
        });
        console.log("Blocking sessions", sessionsToBlock);
        if (!sessionsToBlock) {
            console.log("No sessions found to block, proceeding to create new bookings.");
        } else {
            console.log("Processing refunds and deletions for existing bookings.");
        }
        console.log("Preparing to create bookings for each court and date");
        for (const date of dates) {
            for (const courtName of courts) {
                console.log(`Creating bookings for court: ${courtName} on date: ${date}`);
                // Create bookings for each hour within the operational hours
                for (let hour = 9; hour < 24; hour++) {
                    const startDateTime = new Date(date + `T${hour.toString().padStart(2, '0')}:00:00.000Z`);

                    const bookingData = {
                        court_name: courtName,
                        start: startDateTime,
                        user_email: user.email_address, // Admin's email as a placeholder
                        invite_responses: []
                    };
                    await create_booking(bookingData);
                }
            }
        }
        const refundProcessing = sessionsToBlock.map(async (session) => {
            const court = await Court.findOne({ name: session.court_name });
            if (!court) {
                console.error("No court found with the name:", session.court_name);
                return; // Skip processing this session if the court is not found
            }
            console.log("Sessions start:" , session.start.getHours());
            const price = session.start.getHours() >= 18 ? court.nightPrice : court.dayPrice; // Price based on time
            const totalPriceRefund = Number(price.toString()); // Convert Decimal128 to Number
            const totalInvitees = session.invite_responses.length;
            const eachRefund = totalPriceRefund / (totalInvitees + 1); // Split between booker and invitees

            // Refund to the person who booked
            await User.findOneAndUpdate(
                { email_address: session.user_email },
                { $inc: { credit: eachRefund } }
            );
            console.log("Refunded: ", session.user_email, eachRefund);
            // Refund to each invitee
            session.invite_responses.forEach(async invite => {
                if (invite.status.confirmed && invite.status.accepted) {
                    await User.findOneAndUpdate(
                        { email_address: invite.email },
                        { $inc: { credit: eachRefund } }
                    );
                    console.log("Refunded: ", invite.email, eachRefund);
                }
            });

            const mailOptions = {
                from: 'manager.tennisclub@gmail.com',
                to: `${session.user_email}, ${invite.email},manager.tennisclub@gmail.com`,
                subject: 'Booking Cancellation Confirmation',
                html: ` 
                    <h4>The following booking made by ${session.user_email} has been cancelled due to the court booked needing to be used on that date:</h4>
                    <p>Court Name: ${court.court_name}</p>
                    <p>Date: ${session.start.getDate()}</p>
                    <p>Time: ${session.start.getHours()}:00 - ${session.start.getHours() + 1}:00</p>
                    <p>Refunded amount: ${eachRefund}</p>
                `
            };
            await send_booking_confirmation(mailOptions);

            // Finally, delete the session (or mark as blocked)
            await Booking.findByIdAndDelete(session._id);
        });

        await Promise.all(refundProcessing);
        res.status(200).send('Courts blocked and credits refunded.');
    } catch (e) {
        console.error(e);
        res.status(500).send('Failed to block courts and process refunds.');
    }
});

module.exports = router;