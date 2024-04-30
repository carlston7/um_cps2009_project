const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Booking = require('../models/bookings');
const Court = require('../models/courts');

router.get('/admin/bookings', async (req, res) => {
    try {
        const { dates, courts } = req.body; //need to add password check
        const user = await User.findOne({ email_address: req.headers['user-email'] });

        if (!user || user.type !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const bookings = await Booking.find({
            start: { $in: dates.map(date => new Date(date)) },
            court_name: { $in: courts }
        });
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

        if (!user || user.type !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const sessionsToBlock = await Booking.find({
            start: { $in: dates.map(date => new Date(date)) },
            court_name: { $in: courts }
        });

        const refundProcessing = sessionsToBlock.map(async (session) => {
            const court = await Court.findOne({ name: session.court_name });
            const price = session.start.getHours() >= 18 ? court.nightPrice : court.dayPrice; // Price based on time
            const totalPriceRefund = Number(price.toString()); // Convert Decimal128 to Number
            const totalInvitees = session.invite_responses.length;
            const eachRefund = totalPriceRefund / (totalInvitees + 1); // Split between booker and invitees

            // Refund to the person who booked
            await User.findOneAndUpdate(
                { email_address: session.user_email },
                { $inc: { credit: eachRefund } }
            );

            // Refund to each invitee
            session.invite_responses.forEach(async invite => {
                await User.findOneAndUpdate(
                    { email_address: invite.email },
                    { $inc: { credit: eachRefund } }
                );
            });

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