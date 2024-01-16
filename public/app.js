const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3008;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/register', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Mongoose schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve registration.html when accessing http://localhost:3000/registration
app.get('/registration', (req, res) => {
  res.sendFile(path.join(__dirname, 'registration.html'));
});

// Serve registration.css with the correct MIME type
app.get('/registration.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'registration.css'), {
    headers: {
      'Content-Type': 'text/css',
    },
  });
});

// Handle registration form submission
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.send('Username already exists. Please choose a different one.');
  }

  // Create a new user
  const newUser = new User({
    username,
    password,
  });

  // Save the user to the database
  try {
    await newUser.save();
    res.send('Registration successful!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
