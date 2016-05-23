/* eslint no-underscore-dangle: ["error", { "allow": ["_doc", "_id"] }] */

const express = require('express');
const router = express.Router();
const authentication = require('../app/middleware/authentication');
const Contact = require('../app/models/contact');


router.get('/contacts', authentication.valid, (req, res) => {
  // get the current users messages
  Contact.find({ user: req.decoded._doc._id })
  .populate('user')
  .populate('contacts')
  .exec((err, contacts) => {
    if (err) {
      throw err;
    }
    res.json(contacts);
  });
});

router.post('/contact', authentication.valid, (req, res) => {
  Contact.findOneAndUpdate({
    user: req.decoded._doc._id,
  }, {
    contacts: req.body.contacts,
  }, {
    new: true,
    upsert: true,
  }, (error, contact) => {
    res.json(contact);
  });
});
