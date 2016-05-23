/*
  A contact list object for mongoDb containing a persons
  contacts.
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Contact', new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  contacts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}));
