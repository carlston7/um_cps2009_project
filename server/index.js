const express = require("express");

const app = express();

const cors = require("cors");

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

//added the next two lines to test the landing page
const fs = require('fs');
const path = require('path');

app.use(cors());

app.use(express.json());

app.use(require("./routes/record"));

// Get MongoDB driver connection
const dbo = require("./db/conn");

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

app.listen(port, () => {
  // Perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});