'use strict';
// setup env variables
require('dotenv').config()

// SILENCE ERROR IN PROD
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ silent: true });
}

// PACKAGES
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;

// SETUP ROUTES
const index = require('./routes/index');
const users = require('./routes/users');

// EXPRESS APP
const app = express();

// MIDDLEWARE
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// http request logger
switch (app.get('env')) {
  case 'production':
    app.use(morgan('combined'));
    break;
  case 'development':
    app.use(morgan('dev'));
    break;
  default:
    console.log('No logging done by morgan.');
}

// SERVE STATIC FILES
// serve static files such as images, CSS, and JavaScript
// default for this module will send “index.html”
app.use(express.static(path.join(__dirname, 'public')));

// USE ROUTES
app.use('/api', index);
app.use('/api', users);

// ERROR HANDLING
app.use(function(err, req, res, next) {
  console.error(err.message);

  // If no specified error code, set to 'Internal Server Error (500)'
  if (!err.statusCode) {
    err.statusCode = 500;
  }

  // All HTTP requests must have a response
  // Send error with status code and message
  res.status(err.statusCode).send(err.message);
});

// START SERVER!!!
app.listen(PORT, function() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Served fresh daily on PORT: ', PORT);
  }
});

module.exports = app;
