// get all packages we need
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const config = require('./app/config');

const usersRoutes = require('./routes/users');
const messagesRoutes = require('./routes/messages');
const mockRoutes = require('./routes/mock');

// Configuration
const port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// morgan
app.use(morgan('dev'));

// API routes
app.use('/api/v1/', usersRoutes);
app.use('/api/v1/', messagesRoutes);
app.use('/api/v1/', mockRoutes);

// Start server
app.listen(port);
console.log(`Server running on port: ${port}`);
