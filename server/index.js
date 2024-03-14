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
//stripe.setApiKey('pk_live_51Ot7JOJ6A0BJ3zLkdnlqc78i8dmfxVLBrGT2wwX7iQ2iGlmpriFXMVZwYYyy6UKf42Y6jCrZCsuWOpAOpt2cEQwa00PAbI230Y', process.env.SECRET_KEY);

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
      res.status(201).json({
        message: 'Sign up successful',
        email: user.email_address,
        type: user.type,
        password: req.body.password,
      });
    }    
  }catch(e){
    console.error(e);
    res.status(500).send('Server Error');
  }
});

// Creating an admin object
// const admin_object = {
//     name: 'admin',
//     surname: 'admin',
//     email: 'admin@admin.com',
//     password: 'admin',
// };

// Saving admin in db (commented so that it only runs once)
// const salt = bcrypt.genSalt(10);
// const hashed_pwd = bcrypt.hash(admin_object.password, salt);
// admin_object.password = hashed_pwd;

// const mappedData = {
//   ...admin_object,
//   email_address: admin_object.email,
//   credit: 9999999,
//   type: 'admin'
// };
// const admin = new User(mappedData);
// admin.save();

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
        res.status(200).json({
          message: 'Login successful',
          email: user.email_address,
          type: user.type,
          password: req.body.password,
        });
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
    const { token, email } = req.body;

    // Retrieve the user from the database
    const user = await User.findOne({ email_address: email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Confirm payment with Stripe and create a charge
    const charge = await stripe.charges.create({
      amount: 100,
      currency: 'eur',
      source: token,
      description: 'Buying 1 token',
    });

    //Update user's credit balance in the database
    user.credit += 1; // Add 20 to the user's credit (adjust as needed)
    await user.save();

    // Send response indicating successful payment and credit update
    res.status(200).send('Payment successful, credit added to user');
  } catch (error) {
    console.error('Error processing payment:', error);

    // Print more detailed error information
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    res.status(500).send('An error occurred while processing the payment');
  }
});

const { requireAdmin } = require('./middleware/admin_authorization.js'); 

app.post('/courts', requireAdmin, async (req, res) => {
  try {
    const court = await create_court(req.body);
    res.status(201).json({ message: 'Sign up successful' });
  } catch (error) {
    if (error.statusCode === 403) {
      return res.status(403).json({ message: "Forbidden" });
    } else {
      console.error('Error creating court', error); // Log the specific error
      res.status(500).send('An error occurred: ' + error.message);
    }
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