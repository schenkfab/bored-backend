/* eslint no-underscore-dangle: ["error", { "allow": ["_doc", "_id"] }] */
const express = require('express');
const router = express.Router();
const User = require('../app/models/user');
const Message = require('../app/models/message');


router.post('/mock', (req, res) => {
  const users = [
    {
      name: 'Admin',
      password: 'admin',
      admin: true,
    }, {
      name: 'John',
      password: 'john',
      admin: false,
    },
  ];

  // First get rid of all the users and messages:
  User.remove({}, (err) => {
    if (err) throw err;

    // remove all messages
    Message.remove({}, (innerError) => {
      if (innerError) throw innerError;

      User.create(users, (e, usrs) => {
        const messages = [
          {
            sender: usrs[0]._id,
            receiver: usrs[1]._id,
            sentOn: (new Date()),
            message: 'Hello John, how are you?',
            isRead: 1,
          }, {
            sender: usrs[0]._id,
            receiver: usrs[1]._id,
            sentOn: (new Date()),
            message: 'Hope to see you again soon.',
            isRead: 0,
          }, {
            sender: usrs[1]._id,
            receiver: usrs[0]._id,
            sentOn: (new Date()),
            message: 'I am good, thanks.',
            isRead: 1,
          }, {
            sender: usrs[1]._id,
            receiver: usrs[0]._id,
            sentOn: (new Date()),
            message: 'Have a nice weekend!.',
            isRead: 0,
          },
        ];

        Message.create(messages, (error, msgs) => {
          if (error) throw error;

          res.json({
            users, msgs,
          });
        });
      });
    });
  });
});

module.exports = router;
