/**
 * @file This file contains the route handlers for payment related requests.
 * @module payments
 */

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.SECRET_KEY);
const User = require('../models/users');
const { getStripeSessionsBySessionID, saveStripeSession } = require('../controllers/stripe');
const body_parser = require('body-parser')
router.use(body_parser.json());

/**
 * POST /topup
 * Creates a Stripe checkout session for topping up the user's balance.
 * @name POST/topup
 * @function
 * @memberof module:payments
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing the top-up details.
 * @param {string} req.body.email - The email address of the user.
 * @param {number} req.body.amount - The amount to top up, in euros.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response containing the URL for the Stripe checkout session.
 * @throws {Error} - If there is an error creating the Stripe checkout session.
 */
router.post("/topup", async (req, res) => {
    try {
        const { email, amount } = req.body;

        if (!email || !amount) {
            return res.status(400).send("Email and amount are required.");
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [{
                price_data: {
                    currency: "eur",
                    product_data: { name: "Balance Top-Up" },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            }],
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `https://cps2009project.azurewebsites.net/topup?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://cps2009project.azurewebsites.net/topup?session_id={CHECKOUT_SESSION_ID}`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session", error);
        res.status(500).send("Error creating checkout session");
    }
});


/**
 * POST /success
 * Handles the successful payment notification from Stripe and updates the user's credit balance.
 * @name POST/success
 * @function
 * @memberof module:payments
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing payment details.
 * @param {string} req.body.session_id - The ID of the Stripe checkout session.
 * @param {string} req.body.email - The email address of the user.
 * @param {Object} res - The response object.
 * @returns {Object} - The response indicating the success or failure of the operation.
 * @throws {Error} - If there is an error handling the successful payment.
 */
router.post("/success", async (req, res) => {
    try {
        const session_id = req.body.session_id;
        console.log("Req.Body:", req.body);
        console.log("Session_id:", session_id);
        const session = await stripe.checkout.sessions.retrieve(session_id);
        console.log("Session:", session);
        const user = await User.findOne({ email_address: req.body.email });
        console.log("UserFound:", user);
        console.log("Email: ", req.body.email);
        const amountPaid = session.amount_total / 100
        console.log("amountPaid:", amountPaid);

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (isNaN(amountPaid)) {
            return res.status(400).send("Invalid amount received");
        }
        // ------------------ Query to see if session exists in database
        result_session = await getStripeSessionsBySessionID(session_id);
        console.log("result_sesion:", result_session);
        // ------------------ Check if payment is successful && session is not duplicated
        if (session.payment_status === "paid" && (!result_session || !result_session.result || result_session.result.length === 0)) {
            console.log("Successfull Payment");

            // ------------------ Add new Session
            await saveStripeSession(session_id, req.body.email, session.amount_total / 100);
            console.log("Stripe session saved to db");

            // ------------------ Update Balance
            console.log("Updating one");
            await User.updateOne({ _id: user._id }, { $inc: { credit: amountPaid } });
            console.log("Successfully topped up credit in db");

            res.status(200).send('User credit updated successfully');
        } else {
            console.error("Failed Payment");
            return res.status(409).json({ success: false });
        }
    } catch (error) {
        console.error("Error handling successful payment", error);
        return res
            .status(500)
            .json({ error: "Failed to handle successful payment" });
    }
}
);

module.exports = router;
