var MovieModel = require('../models/movieModel');
var CategoryModel = require('../models/categoryModel');

exports.index = function(req, res) {
	CategoryModel
		.find({})
		.populate({
			path: 'movies',
			options: {
				limit: 5
			}
		})
		.exec(function(err, categories) {
			if (err) {
				console.log(err)
			}
			res.render('index', {
				title: '影院热度播报',
				categories: categories
			});
		});
};

/**
 * 按照类别查询
 */
exports.results = function(req, res) {
	var pageSize = req.query.pageSize || 2;
	var p = parseInt(req.query.p, 10) || 0;
	var cat = req.query.cat;
	var index = p * pageSize;

	CategoryModel
		.find({
			_id: cat
		})
		.populate({
			path: 'movies',
			select: 'title poster'
		})
		.exec(function(err, categories) {
			if (err) {
				console.log(err)
			}

			var category = categories[0] || {};
			var movies = category.movies || [];
			var results = movies.slice(index, index + pageSize);

			res.render('results', {
				title: '结果列表页',
				keyword: category.name,
				totalPage: Math.ceil(movies.length / pageSize),
				currentPage: (p + 1),
				query: 'cat=' + cat,
				movies: results
			});
		});
};

/**
 * 搜索框搜索
 */
exports.search = function(req, res) {
	var pageSize = req.query.pageSize || 2;
	var p = parseInt(req.query.p, 10) || 0;
	var index = p * pageSize;
	var keyword = req.query.keyword;

	MovieModel
		.find({
			title: new RegExp(keyword + '.*', 'i')
		})
		.exec(function(err, movies) {
			if (err) {
				console.log(err)
			}

			var results = movies.slice(index, index + pageSize);
			
			res.render('results', {
				title: '搜索结果',
				keyword: keyword,
				totalPage: Math.ceil(movies.length / pageSize),
				currentPage: (p + 1),
				query: 'keyword=' + keyword,
				movies: results
			});
		});
};