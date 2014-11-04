var MovieModel = require('../models/movieModel');

module.exports = function(req, res) {
	MovieModel.fetch(function(err, movies) {
		if (err) {
			console.log(err)
		}
		res.render('index', {
			title: '影院热度播报',
			movies: movies
		});
	});

};