/*
	A message object for mongoDb containing a sender, a receiver, a time and a boolean indicating
	wheter or not the message has been read.
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
	sender: { type: Schema.Types.ObjectId, ref: 'User' },
	receiver: { type: Schema.Types.ObjectId, ref: 'User' },
	sentOn: Schema.Types.Date,
	message: String,
	isRead: Boolean
}));