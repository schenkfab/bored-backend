/* eslint no-underscore-dangle: ["error", { "allow": ["_doc", "_id"] }] */

const express = require('express');
const router = express.Router();
const authentication = require('../app/middleware/authentication');
const Message = require('../app/models/message');
const User = require('../app/models/user');
const request = require('request');
const config = require('../app/config');

router.get('/messages', authentication.valid, (req, res) => {
  // get the current users messages
  Message.find({ receiver: req.decoded._doc._id })
  .sort('sentOn')
  .populate('sender')
  .populate('receiver')
  .exec((err, messages) => {
    if (err) {
      throw err;
    }
    res.json(messages);
  });
});

router.get('/messages/:userId', authentication.valid, (req, res) => {
  // get the current users messages
  Message.find({ $or: [
    { receiver: req.decoded._doc._id, sender: req.params.userId },
    { sender: req.decoded._doc._id, receiver: req.params.userId },
  ] })
  .sort('sentOn')
  .populate('sender')
  .populate('receiver')
  .exec((err, messages) => {
    if (err) {
      throw err;
    }
    res.json(messages);
  });
});

const sendPush = (userId) => {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, usr) => {
      if (err) throw err;

      const registrationId = usr.endpoint.split('/')[usr.endpoint.split('/').length - 1];

      const options = {
        uri: 'https://android.googleapis.com/gcm/send',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'key=' + config.gcm_key,
        },
        json: {
          registration_ids: [registrationId],
        },
      };

      request.post(options, (error, response, body) => {
        if (body.success > 0) {
          resolve({ success: true });
        } else {
          reject({ success: false, error: body.results });
        }
      });
    });
  });
};

router.get('/push/:userId', (req, res) => {
  sendPush(req.params.userId)
    .then((result) => {
      res.json(result);
    })
    .catch((e) => {
      res.json(e);
    });
});

router.put('/messages/:messageId', authentication.valid, (req, res) => {
  // update the message with ObjectId: messageId
  Message.findById(req.params.messageId, (err, message) => {
    if (err) throw err;

    const currentMessage = message;
    currentMessage.isRead = req.body.isRead;
    currentMessage.save((error) => {
      if (error) throw error;
      res.send(message);
    });

    /* message.isRead = req.body.isRead;
    message.save((error) => {
      if (error) throw error;
      res.send(message);
    });*/
  });
});

router.put('/messages/:messageId/isread', authentication.valid, (req, res) => {
  // Set the object to isRead
  Message.findById(req.params.messageId, (err, message) => {
    if (err) throw err;

    const currentMessage = message;
    currentMessage.isRead = true;
    currentMessage.save((error, msg) => {
      if (error) throw error;
      res.send(msg);
    });
  });
});

router.post('/messages/:messageId/reply', authentication.valid, (req, res) => {
  Message.findById(req.params.messageId, (err, message) => {
    if (err) throw err;

    const reply = new Message({
      sender: req.decoded._doc._id,
      receiver: message.sender,
      sentOn: (new Date()),
      message: req.body.message,
      isRead: false,
    });
    reply.save((error) => {
      if (error) throw error;

      sendPush(message.sender._id)
        .then((result) => {
          res.json({ success: true });
        })
        .catch((e) => {
          res.json(e);
        });
    });
  });
});

router.post('/messages', authentication.valid, (req, res) => {
  // send a message
  const message = new Message({
    sender: req.decoded._doc._id,
    receiver: req.body.receiver,
    sentOn: (new Date()),
    message: req.body.message,
    isRead: false,
  });

  message.save((err, messages) => {
    if (err) throw err;

    sendPush(req.body.receiver._id)
      .then((result) => {
        res.json(messages);
      })
      .catch((e) => {
        res.json(e);
      });
  });
});

router.delete('/messages/:messageId', authentication.valid, (req, res) => {
  // delete the message
  Message.remove({ _id: req.params.messageId }, (err) => {
    if (err) throw err;

    res.json({ success: true });
  });
});

module.exports = router;
