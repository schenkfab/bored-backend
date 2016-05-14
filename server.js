"use strict";
// get all packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var config = require('./app/config');

var usersRoutes = require('./routes/users');

// Configuration
var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// morgan
app.use(morgan('dev'));

// API routes
app.use('/api/v1/', usersRoutes);

// Start server
app.listen(port);
console.log('Server running on port:' + port);