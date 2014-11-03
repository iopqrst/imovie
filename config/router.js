var MovieModel = require('../models/movieModel');
var UserModel = require('../models/userModel');
var _ = require('underscore');

module.exports = function(app) {
	app.use(function(req, res, next) {

		console.info('-----session user :');
		console.info(req.session.session_of_user);

		var _user = req.session.session_of_user;
		if (_user) {
			app.locals.user = _user;
		}
		next();
	});

	app.get('/', function(req, res) {

		MovieModel.fetch(function(err, movies) {
			if (err) {
				console.log(err)
			}
			res.render('index', {
				title: '影院热度播报',
				movies: movies
			});
		});
	});

	app.get('/movie/:id', function(req, res) {
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
	});

	app.get('/admin/movie', function(req, res) {
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
	});

	app.get('/admin/update/:id', function(req, res) {
		var id = req.params.id;

		if (id) {
			MovieModel.findById(id, function(err, movie) {
				res.render('admin', {
					title: movie.title || 'imooc 后台更新页面',
					movie: movie
				});
			});
		}
	});

	// admin post movie
	app.post('/admin/movie/new', function(req, res) {
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
	})

	app.get('/admin/movie/list', function(req, res) {
		MovieModel.fetch(function(err, movies) {
			if (err) {
				console.log(err);
			}
			res.render('list', {
				title: 'imooc 列表页',
				movies: movies
			});
		});
	});

	app.get('/admin/movie/del/:id', function(req, res) {
		var id = req.params.id;
		console.log(id);
		MovieModel.findByIdAndRemove(id, function(err) {

			if (err) {
				console.info(err);
			}

			res.redirect('/admin/movie/list');
		});
	});

	app.delete('/admin/movie/del2/:id', function(req, res) {
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
	});

	app.get('/user/list', function(req, res) {
		UserModel.fetch(function(err, users) {
			if (err) {
				throw err;
			}

			res.render('userlist', {
				title: '用户列表',
				users: users
			});
		});
	});

	//登录
	app.post('/user/signin', function(req, res) {
		var _user = req.body.user;

		console.info(_user);

		UserModel.findOne({
			name: _user.name
		}, function(err, user) {
			if (err) {
				console.log(err);
			}

			if (user) {
				user.comparePassword(_user.password, function(err, isMatch) {
					if (err) {
						console.info(err);
					}

					if (!isMatch) {
						console.info('not match');
					} else {
						console.info('matched');
						req.session.session_of_user = user;
					}

					return res.redirect('/');
				});
			} else {
				return res.redirect('/');
			}
		});
	});

	app.get('/user/logout', function(req, res) {
		delete req.session.session_of_user;
		delete app.locals.user;
		res.redirect('/');
	});

	//注册
	app.post('/user/signup', function(req, res) {
		var _user = req.body.user;

		UserModel.find({
			name: _user.name
		}, function(err, user) {
			if (err) {
				console.info(err);
			}

			if (!user) {
				return res.redirect('/');
			} else {
				var userEntity = new UserModel({
					name: _user.name,
					password: _user.password
				});

				userEntity.save(function(err) {
					if (err) {
						console.log(err);
					}

					res.redirect('/user/list');
				});
			}
		});
	});
};