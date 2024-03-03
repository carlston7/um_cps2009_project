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

// Route handler for the root URL (TEST)
app.get('/', (req, res) => {
  // Read the contents of index.html file
  fs.readFile(path.join(__dirname, 'views', 'index.html'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Send the contents of index.html as the response
    res.send(data);
    console.log("This is working!")
  });
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