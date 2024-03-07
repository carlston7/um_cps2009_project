const express = require("express");

const app = express();

const cors = require("cors");

require('dotenv').config();
const port = process.env.PORT || 5000;

// Added the next two lines to test the landing page
const fs = require('fs');
const path = require('path');

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

app.post('/signup', async (req, res) => {
  try{
    const user_data = req.body;
    const user = await create_user(user_data);
    res.status (201).json(user);
    console.log(user_data);
  }catch(e){
    console.error(e);
    res.status(500).send('Server Error');
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