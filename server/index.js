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

app.post("/topup", async (req, res) => {
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
      success_url: `https://cps2009project.azurewebsites.net/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://cps2009project.azurewebsites.net/topup`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session", error);
    res.status(500).send("Error creating checkout session");
  }
  // update db later
});

app.post('/webhook', express.json(), async (request, response) => {
  const event = request.body;

  // Handle the event
  if (event.type === 'charge.succeeded') {
    const amountPaid = event.data.object.amount/100;
    const email = event.data.object.email; // Get email from the event data

    try {
      const user = await User.findOne({ email_address: email });
      if (!user) {
        return response.status(404).send('User not found');
      }

      if (isNaN(amountPaid)) {
        return response.status(400).send("Invalid amount received");
      }

      // Update user's credit in the database
      console.log(amountPaid);
      User.credit += amountPaid;
      await User.save();
      console.log("Successfully topped up credit in db");

      response.status(200).send('User credit updated successfully');
    } catch (error) {
      console.error('Error updating user credit:', error);
      response.status(500).send('An error occurred while updating user credit');
    }
  } else {
    response.status(200).send('Unhandled event type');
  }
});



// const { requireAdmin } = require('./middleware/admin_authorization.js'); 
const { create_court } = require('./controllers/courtcontroller.js');

// app.post('/court', requireAdmin, async (req, res) => {
app.post('/court', async (req, res) => {
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
      const court = await create_court(req.body);
      res.status(201).json({ message: 'Success' });
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

const { edit_court } = require('./controllers/courtcontroller.js');

app.patch('/court', async (req, res) => {
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

const { get_available_courts } = require('./controllers/bookingcontroller.js');

app.get('/courts', async (req, res) => {
  try {
    const courts = await get_available_courts(req.query.dateTime);

    res.status(201).json(courts);
  } catch (e) {
    console.error('Error getting courts', error);
    res.status(500).send('An error occurred: ' + error.message);
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
