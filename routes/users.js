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

router.put('/users', (req, res) => {
  // Add a new user
});

router.get('/users', authentication.valid, (req, res) => {
  User.find({ name: (new RegExp(req.body.name, 'i')) }, (err, users) => {
    if (err) throw err;

    // MongoDb ObjectId of the current user
    // console.log(req.decoded._doc._id);

    res.json(users);
  });
});

router.post('/authenticate', (req, res) => {
  // find the user
  User.findOne({
    name: req.body.name,
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      if (user.password !== req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
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
