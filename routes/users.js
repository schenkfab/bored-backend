var express = require('express');
var router = express.Router();
var User = require('../app/models/user');
var jwt = require('jsonwebtoken');
var config = require('../app/config');

var authentication = require('../app/middleware/authentication');

router.get('/setup', function(req, res) {
	var admin = new User({
		name: 'Admin',
		password: 'admin',
		admin: true
	});

	admin.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	})
});

router.put('/users', function(req, res) {
	// Add a new user
});

router.get('/users', authentication.valid, function(req, res) {
	User.find({}, function(err, users) {
		if (err) throw err;

		// MongoDb ObjectId of the current user
		console.log(req.decoded._doc._id);

		res.json(users);
	});
});

router.post('/authenticate', function(req, res) {
	// find the user
	User.findOne({
		name: req.body.name
	}, function(err, user) {
		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

		  // check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {
				// if user is found and password is right
				// create a token
				console.log(router);
				var token = jwt.sign(user, config.secret, {
					expiresIn: '24h' // expires in 24 hours
				});

				// return the information including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token!',
				 	token: token
				});
			}	   
		}
  	});
});

module.exports = router;
