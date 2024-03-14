const express = require("express");

const app = express();

const cors = require("cors");

require('dotenv').config();
const port = process.env.PORT || 3000;

// Added the next two lines to test the landing page
const fs = require('fs');
const path = require('path');

//Initialize the Stripe client with secret key
const stripe = require('stripe')(process.env.SECRET_KEY);

app.use(cors());

app.use(express.json());

app.use(require("./routes/record"));

//Get MongoDB driver connection
const connect_db = require("./db/conn");

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const User = require('./models/users')
const Court = require('./models/courts')
const Booking = require('./models/bookings')

// Creating an admin object
const admin = new User({
    name: 'admin',
    surname: 'admin',
    email_address: 'admin@admin.com',
    password: 'admin',
    credit: 99999999
});
// Saving admin in db (commented so that it only runs once)
// admin.save();

//Testing signup
const { create_user } = require('./controllers/usercontroller.js');
const body_parser = require('body-parser')
app.use(body_parser.json());
const bcrypt = require('bcryptjs')

app.post('/signup', async (req, res) => {
  try{

    const user_exists = await User.exists({ email_address: req.body.email });

    if (user_exists)
    {
      return res.status(400).json({ error: 'Email address already exists' });
    }else{
      const user = await create_user(req.body);
      res.status (201).json(user);
    }    
  }catch(e){
    console.error(e);
    res.status(500).send('Server Error');
  }
});

//Login validation
app.post('/login', async (req, res) => {
  try {
    const user_data = req.body;
  
    // Find user by email address using Mongoose
    const user = await User.findOne({ email_address: user_data.email });

    // Check if user exists and compare passwords (make sure to hash passwords in production)
    if (user) {
      const valid_pwd = await bcrypt.compare(user_data.password, user.password);

      if(valid_pwd) {
        res.status(200).json(user);
      } res.status(401).send('Invalid password');
    } else {
      res.status(401).send('Invalid email address');
    }
  } catch (error) {
    console.error('Error logging in:', error); // Log the specific error
    res.status(500).send('An error occurred: ' + error.message);
  }
});

//Stripe Payment
app.post('/payment', async (req, res) => {
  try {
    const { token, userId } = req.body;

    // Retrieve the user from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Confirm payment with Stripe and create a charge
    const charge = await stripe.charges.create({
      amount: 100, // Amount in cents
      currency: 'eur',
      source: token,
      description: 'Buying 1 token',
});

    // Update user's credit balance in the database
    user.credit += 1; // Add 20 to the user's credit (adjust as needed)
    await user.save();

    // Send response indicating successful payment and credit update
    res.status(200).send('Payment successful, credit added to user');
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).send('An error occurred while processing the payment');
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const start = async() => {
  try{
    // Makes a database connection
    await connect_db();

    // Starts the server
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  }catch(e){
    console.error(e.message);
  }
}

// Calling the function which makes a database
// connection and starts the server
start();