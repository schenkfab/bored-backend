/*
	A user object for mongoDb containing a name, password and a boolean indicating
	wheter or not the user is an administrator.
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
	name: String,
	password: String,
	admin: Boolean
}));