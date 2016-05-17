'use strict';

// router used to create mockup/demo data in the backend of the application.
var express = require('express');
var router = express.Router();
var User = require('../app/models/user');
var Message = require('../app/models/message');


router.post('/mock', function(req, res) {
  const users = [
    {
      name: 'Admin',
      password: 'admin',
      admin: true
    }, {
      name: 'John',
      password: 'john',
      admin: false
    }
  ];

  // First get rid of all the users and messages:
  User.remove({}, function(err) {
    if (err) throw err;

    // remove all messages
    Message.remove({}, function(err) {
      if (err) throw err;

      User.create(users, function (err, users) {
        let messages = [
          {
            sender: users[0]._id,
            receiver: users[1]._id,
            sentOn: (new Date()),
            message: 'Hello John, how are you?',
            isRead: 1
          }, {
            sender: users[0]._id,
            receiver: users[1]._id,
            sentOn: (new Date()),
            message: 'Hope to see you again soon.',
            isRead: 0
          }, {
            sender: users[1]._id,
            receiver: users[0]._id,
            sentOn: (new Date()),
            message: 'I am good, thanks.',
            isRead: 1
          }, {
            sender: users[1]._id,
            receiver: users[0]._id,
            sentOn: (new Date()),
            message: 'Have a nice weekend!.',
            isRead: 0
          }
        ];

        Message.create(messages, function(err, messages) {
          if (err) throw err;

          res.json({
            users, messages
          });

        });
      });

    });
  });
});

module.exports = router;