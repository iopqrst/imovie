var mongoose = require('mongoose');
var CategorySchema = require('../schemas/categorySchema.js');
var Category = mongoose.model('Category', CategorySchema);

module.exports = Category;