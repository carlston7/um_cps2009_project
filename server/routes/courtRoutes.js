/**
 * @file This file contains the route handlers for court related requests.
 * @module courts
 */

const express = require('express');
const router = express.Router();
const { create_court, get_courts, edit_court } = require('../controllers/courtcontroller');
const bcrypt = require('bcryptjs');
const User = require('../models/users');

/**
 * GET /courts-all
 * Retrieves all courts
 * @name GET/courts-all
 * @function
 * @memberof module:courts
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response containing the courts.
 * @throws {Error} - If there is an error retrieving the courts.
 */
router.get('/courts-all', async (req, res) => {
    try {
        const courts = await get_courts();

        res.status(201).json(courts);
    } catch (e) {
        console.error('Error getting courts', error);
        res.status(500).send('An error occurred: ' + error.message);
    }
});

/**
 * POST /court
 * Creates a new court resource and stores it in the database.
 * @name POST/court
 * @function
 * @memberof module:courts
 * @param {Object} req - The request object.
 * @param {Object} req.headers - The request headers.
 * @param {string} req.headers'user-email' - The email address of the user.
 * @param {string} req.headers'user-password' - The password of the user.
 * @param {string} req.headers'user-type' - The type of the user (must be 'admin').
 * @param {Object} req.body - The body of the request containing the court data.
 * @param {string} req.body.name - The name of the court to be created.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response containing a message indicating the outcome.
 * @throws {Error} - If there is an error creating the court.
 * @throws {Error} - If the user is not authorized or if the court already exists.
 */
// app.post('/court', requireAdmin, async (req, res) => {
router.post('/court', async (req, res) => {
    try {
        const user = await User.findOne({ email_address: req.headers['user-email'] });
        const valid_pwd = await bcrypt.compare(req.headers['user-password'], user.password);
        // const court = await create_court(req.body);
        // res.status(201).json({ message: 'Success' });
        if (req.headers['user-type'] !== 'admin' ||
            req.headers['user-email'] !== 'manager.tennisclub@gmail.com' ||
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

/**
 * PATCH /court
 * Updates an existing court resource in the database.
 * @name PATCH/court
 * @function
 * @memberof module:courts
 * @param {Object} req - The request object.
 * @param {Object} req.headers - The request headers.
 * @param {string} req.headers'user-email' - The email address of the user.
 * @param {string} req.headers'user-password' - The password of the user.
 * @param {string} req.headers'user-type' - The type of the user (must be 'admin').
 * @param {Object} req.body - The body of the request containing the court data to be updated.
 * @param {string} req.body.name - The name of the court to be updated.
 * @param {Object} res - The response object.
 * @returns {Object} - The JSON response containing a message indicating the outcome.
 * @throws {Error} - If there is an error updating the court.
 * @throws {Error} - If the user is not authorized.
 */
router.patch('/court', async (req, res) => {
    try {
        const user = await User.findOne({ email_address: req.headers['user-email'] });
        const valid_pwd = await bcrypt.compare(req.headers['user-password'], user.password);

        if (req.headers['user-type'] !== 'admin' ||
            req.headers['user-email'] !== 'manager.tennisclub@gmail.com' ||
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
