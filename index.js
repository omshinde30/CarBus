const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./route/user');

const app = express();

mongoose.connect('mongodb://localhost:27017/car-rental');

app.use(express.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'super-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(authRoutes);

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});

// Dummy protected dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.userId) return res.redirect('/');
  res.send(`<h1>Welcome to your dashboard!</h1><a href="/logout">Logout</a>`);
});

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Running on http://localhost:3000')
});