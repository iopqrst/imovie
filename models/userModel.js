var mongoose = require('mongoose');
var UserSchema = require('../schemas/userSchema.js');
var User = mongoose.model('user', UserSchema);

module.exports = User;