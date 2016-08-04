/* eslint no-underscore-dangle: ["error", { "allow": ["_doc", "_id"] }] */
const express = require('express');
const router = express.Router();
const User = require('../app/models/user');
const jwt = require('jsonwebtoken');
const config = require('../app/config');

const authentication = require('../app/middleware/authentication');

router.get('/users/setup', (req, res) => {
  const admin = new User({
    name: 'Admin',
    password: 'admin',
    admin: true,
  });

  admin.save((err) => {
    if (err) throw err;

    res.json({ success: true });
  });
});

router.get('/users', authentication.valid, (req, res) => {
  User.find({ name: (new RegExp(req.query.name, 'i')) }, (err, users) => {
    if (err) throw err;
    // MongoDb ObjectId of the current user
    // console.log(req.decoded._doc._id);

    res.json(users);
  });
});

router.post('/register', (req, res) => {
  // Add a new user
  const user = new User({
    name: req.body.name,
    password: req.body.password,
    admin: false,
  });

  user.save((err, usr) => {
    if (err) throw err;

    res.json(usr);
  });
});

router.put('/endpoint/:userId', authentication.valid, (req, res) => {
  // Add an endpoint to the object.
  User.findById(req.params.userId, (err, usr) => {
    if (err) throw err;

    const currentUser = usr;

    currentUser.endpoint = req.body.endpoint;
    currentUser.save((error) => {
      if (error) throw error;

      res.send(usr);
    });
  });
});

router.post('/validate', authentication.valid, (req, res) => {
  res.json({
    success: true,
    message: 'token is valid',
  });
});

router.post('/authenticate', (req, res) => {
  // find the user
  User.findOne({
    name: req.body.name,
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      if (user.password !== req.body.password) {
        res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a token
        const token = jwt.sign(user, config.secret, {
          expiresIn: '24h', // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token,
        });
      }
    }
  });
});

module.exports = router;
