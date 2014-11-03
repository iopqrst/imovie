var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movieSchema.js');
var Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;