const mongoose = require('mongoose');
const uri = process.env.ATLAS_URI;

// Definition of the function that
// makes the connection to the database
const connect_db = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  }catch (e) {
    console.error('Error connecting to MongoDB: ', e.message);
    process.exit(1); 
  }
};

module.exports = connect_db;