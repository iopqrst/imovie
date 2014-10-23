var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var MovieModel = require('./models/movieModel');
var _ = require('underscore');

mongoose.connect('mongodb://localhost/imooc');

app.use(require('body-parser').urlencoded({
	extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.port || 3000);
app.set('views', './views/pages');
app.set('view engine', 'jade');

app.locals.moment = require('moment');

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
		
		/**
		 * 这部分需要改为save
		 */
		
		
		MovieModel.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);
//			delete _movie._id; //删除id
//			MovieModel.update({_id: id}, _movie, function(err, cb){
//				if (err) {
//					console.log(err);
//				}
//
//				res.redirect('/movie/' + id);				
//			});

			_movie.save(function(err){
				if(err) {
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
	MovieModel.findByIdAndRemove(id, function(err){
		
		if(err) {
			console.info(err);
		}
		
		res.redirect('/admin/movie/list');
	});
});

app.delete('/admin/movie/del2/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	MovieModel.remove({_id : id}, function(err){
		
		if(err) {
			console.info(err);
		}
		
		res.json({succ:1});
	});
});

app.listen(app.get('port'));
console.info('listening on port ' + app.get('port'));
