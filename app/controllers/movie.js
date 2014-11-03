var MovieModel = require('../models/movieModel');
var _ = require('underscore');

exports.detail = function(req, res) {
	var id = req.params.id;

	MovieModel.findById(id, function(err, movie) {

		if (err) {
			console.error(err);
		}

		res.render('detail', {
			movie: movie,
			title: movie.title || '电影详情页面'
		});

	});
};

exports.toAdd = function(req, res) {
	res.render('admin', {
		title: 'imooc 后台录入页面',
		movie: {
			doctor: '',
			country: '',
			title: '',
			year: '',
			poster: '',
			language: '',
			flash: '',
			summary: ''
		}
	});
};

exports.toModify = function(req, res) {
	var id = req.params.id;

	if (id) {
		MovieModel.findById(id, function(err, movie) {
			res.render('admin', {
				title: movie.title || 'imooc 后台更新页面',
				movie: movie
			});
		});
	}
};

// admin post movie
exports.saveOrUpdate = function(req, res) {
	var movieObj = req.body.movie;

	var id = req.body.movie._id;
	var _movie;

	if (id !== 'undefined') {

		MovieModel.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);

			_movie.save(function(err) {
				if (err) {
					console.log(err);
				}

				res.redirect('/movie/' + _movie.id);
			});
		});

	} else {
		_movie = new MovieModel({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});

		_movie.save(function(err, movie) {
			if (err) {
				console.log(err);
			}

			res.redirect('/movie/' + _movie.id);
		});
	}
};

exports.queryListForAdmin = function(req, res) {
	MovieModel.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}
		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		});
	});
};

exports.del = function(req, res) {
	var id = req.params.id;
	console.log(id);
	MovieModel.findByIdAndRemove(id, function(err) {

		if (err) {
			console.info(err);
		}

		res.redirect('/admin/movie/list');
	});
};

exports.del2 = function(req, res) {
	var id = req.params.id;
	console.log(id);
	MovieModel.remove({
		_id: id
	}, function(err) {

		if (err) {
			console.info(err);
		}

		res.json({
			succ: 1
		});
	});
};