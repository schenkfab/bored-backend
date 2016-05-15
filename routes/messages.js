var express = require('express');
var router = express.Router();
var authentication = require('../app/middleware/authentication');

router.get('/messages', authentication.valid, function(req, res) {
	// get the current users messages
});

router.put('/messages', authentication.valid, function(req, res) {
	// send a message
});

router.delete('/messages/:messageId', authentication.valid, function(req, res) {
	// delete the message
});

module.exports = router;