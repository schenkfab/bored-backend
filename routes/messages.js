'use strict';

var express = require('express');
var router = express.Router();
var authentication = require('../app/middleware/authentication');
var Message = require('../app/models/message');

router.get('/messages', authentication.valid, function(req, res) {
	// get the current users messages
	let currentUser = req.decoded._doc._id;
	Message.find({receiver: currentUser}, function (err, messages) {
		if (err) {
			throw err;
		}
		res.json(messages);
	});
});

router.put('/messages/:messageId', authentication.valid, function(req, res) {
	// update the message with ObjectId: messageId
	console.log(req.params.messageId);
	Message.findById(req.params.messageId, function (err, message) {
		if (err) throw err;
		message.isRead = req.body.isRead;
		message.save(function (err) {
			if (err) throw err;
			res.send(message);
		});
	});
});

router.post('/messages', authentication.valid, function(req, res) {
	// send a message
	var message = new Message({
		sender: req.decoded._doc._id,
		receiver: req.body.receiver,
		sentOn: (new Date()),
		message: req.body.message,
		isRead: req.body.receiver
	});

	message.save(function(err) {
		if (err) throw err;
		res.json({ success: true });
	});
});

router.delete('/messages/:messageId', authentication.valid, function(req, res) {
	// delete the message
});

module.exports = router;