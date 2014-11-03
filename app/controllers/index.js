var MovieModel = require('../models/movieModel');

module.exports = function(req, res) {
	console.info('-----我想知道会发生什么样的结果');
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