'use strict';

// router used to create mockup/demo data in the backend of the application.
var express = require('express');
var router = express.Router();
var User = require('../app/models/user');


router.post('/mock', function(req, res) {
	var users = [
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

		User.create(users, function (err, users) {
			res.json(users);
		});

	});
	
});

module.exports = router;