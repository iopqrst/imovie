var mongoose = require('mongoose');
var UserSchema = require('../schemas/userSchema.js');
var User = mongoose.model('User', UserSchema);

module.exports = User;