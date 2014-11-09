var CategoryModel = require('../models/categoryModel');

exports.toAdd = function(req, res) {
	res.render('category', {
		title: '后台录入电影类别',
		category: {
			name: ''
		}
	});
};

// admin post movie
exports.save = function(req, res) {
	var _category = req.body.category;
	
	var categoryEntity = new CategoryModel(_category);
	
	console.info(_category);
	console.info(categoryEntity);
	
	categoryEntity.save(function(err){
		if(err) {
			console.info(err);
		}
		
		res.redirect('/admin/category/list');
	});
	
};

exports.list = function(req, res) {
	CategoryModel.fetch(function(err, categories) {
		if (err) {
			console.log(err);
		}
		res.render('category_list', {
			title: '电影类别列表页',
			categories: categories
		});
	});
};
