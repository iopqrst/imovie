var MovieModel = require('../models/movieModel');
var CommentModel = require('../models/commentModel');
var CategoryModel = require('../models/categoryModel');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

/**
 * 上传海报【中间件】
 */
exports.uploadPoster = function(req, res, next) {

	//	console.info('-------files---->');
	//	console.info(req.files);

	var posterData = req.files.uploadPoster
	var filePath = posterData.path;
	var originalFilename = posterData.originalFilename;

	if (originalFilename) {
		fs.readFile(filePath, function(err, data) {
			var timerstamp = Date.now();
			var type = posterData.type.split('/')[1];
			var poster = timerstamp + '.' + type;

			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);

			fs.writeFile(newPath, data, function(err) {
				req.poster = '/upload/' + poster;
				next();
			});
		});
	} else {
		next();
	}
};

exports.detail = function(req, res) {
	var id = req.params.id;

	MovieModel.findById(id, function(err, movie) {

		if (err) {
			console.error(err);
		}
		
		//访问统计
		MovieModel.update({_id:id},{$inc:{pv:1}}, function(err){
			if(err) {
				console.info(err);
			}
		});

		CommentModel
			.find({
				movie: id
			})
			.populate('from', 'name')
			.populate('reply.to reply.from', 'name')
			.exec(function(err, comments) {
				console.log(comments);

				res.render('detail', {
					movie: movie,
					title: movie.title || '电影详情页面',
					comments: comments
				});
			});

	});
};

exports.toAdd = function(req, res) {

	CategoryModel.fetch(function(err, categories) {
		if (err) {
			console.info(err);
		}

		res.render('admin', {
			title: 'imooc 后台录入页面',
			categories: categories,
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
};

exports.toModify = function(req, res) {
	var id = req.params.id;

	if (id) {
		MovieModel.findById(id, function(err, movie) {
			if (err) {
				console.info(err);
			}

			CategoryModel.fetch(function(err, categories) {
				if (err) {
					console.info(err);
				}

				res.render('admin', {
					title: movie.title || 'imooc 后台更新页面',
					movie: movie,
					categories: categories
				});
			});
		});
	}
};

// admin post movie
exports.saveOrUpdate = function(req, res) {
	var movieObj = req.body.movie;

	var id = req.body.movie._id;
	var _movie;

	if (req.poster) {
		movieObj.poster = req.poster;
	}

	if (id !== "undefined") {

		MovieModel.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			}

			var primaryCat = movie.category; // 修改之前的电影类别
			var newCat = movieObj.category; // 修改之后的电影类别

			_movie = _.extend(movie, movieObj);

			_movie.save(function(err) {
				if (err) {
					console.log(err);
				}

				//如果类别发生了变化，需要将原类别中的电影移除，并在新类别中添加电影
				if (primaryCat && newCat && primaryCat != newCat) {

					CategoryModel.findById(primaryCat, function(err, cat) {

						if (!cat) {
							res.redirect('/movie/' + _movie.id);
						}

						if (cat.movies && cat.movies.length > 0) {
							console.info("==========before===");
							console.info(cat.movies);
							console.info("p==" + id);
							console.info("==========indexof===" + cat.movies.indexOf(id));
							cat.movies.splice(cat.movies.indexOf(id), 1);
							console.info("==========after===");
							console.info(cat.movies);
						}

						cat.save(function(err) {

							CategoryModel.findById(newCat, function(err, ncat) {
								ncat.movies.push(id);

								ncat.save(function(err) {
									res.redirect('/movie/' + _movie.id);
								});
							});

						});
					});

				} else {
					res.redirect('/movie/' + _movie.id);
				}

			});
		});

	} else {

		// 这种写法有些许复杂，目的是为了说明entity形成
		// 简单写法： _movie = new MovieModel(movieObject);
		_movie = new MovieModel({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash,
			category: movieObj.category
		});

		_movie.save(function(err, movie) {
			if (err) {
				console.log(err);
			}

			CategoryModel.findById(movieObj.category, function(err, cat) {
				cat.movies.push(movie._id);

				cat.save(function(err) {
					if (err) {
						console.log(err);
					}

					res.redirect('/movie/' + _movie.id);
				});

			});
		});
	}
};

exports.queryListForAdmin = function(req, res) {
	//没有分页的
	/*
	MovieModel.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}
		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		});
	});
	*/

	var pageSize = req.query.pageSize || 5;
	var p = parseInt(req.query.p, 10) || 0;
	var index = p * pageSize;

	MovieModel
		.find()
		.exec(function(err, movies) {
			if (err) {
				console.log(err)
			}

			var results = movies.slice(index, index + pageSize);

			res.render('list', {
				title: '电影列表',
				totalPage: Math.ceil(movies.length / pageSize),
				currentPage: (p + 1),
				movies: results
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

		CategoryModel.find({
			"movies": id
		}, function(err, cats){
			
			if(cats && cats.length > 0) {
				
				for(var i = 0; i < cats.length; i++) {
					cats[i].movies.splice(id, 1);
					
					cats[i].save(function(err,cat){
						if(err) {
							console.info(err);
						}
						
						console.info("update ===" + cats.name );
						console.info(cats[i].movies);
					});
				}
				
			}
			
			res.json({
				succ: 1
			});
		});

	});
};