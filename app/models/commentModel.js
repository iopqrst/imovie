var mongoose = require('mongoose');
var CommentSchema = require('../schemas/commentSchema.js');
var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;