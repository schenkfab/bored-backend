/* eslint no-underscore-dangle: ["error", { "allow": ["_doc", "_id"] }] */

const express = require('express');
const router = express.Router();
const authentication = require('../app/middleware/authentication');
const Message = require('../app/models/message');

router.get('/messages', authentication.valid, (req, res) => {
  // get the current users messages
  Message.find({ receiver: req.decoded._doc._id })
  .populate('sender')
  .populate('receiver')
  .exec((err, messages) => {
    if (err) {
      throw err;
    }
    res.json(messages);
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

      res.json({ success: true });
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

  message.save((err) => {
    if (err) throw err;
    res.json({ success: true });
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
