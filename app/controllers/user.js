var UserModel = require('../models/userModel');
//跳转到登录页面
exports.showSignIn = function(req, res) {
	res.render('signin',{
		title : '登录页面'
	});
};
//跳转到注册页面
exports.showSignUp = function(req, res) {
	res.render('signup',{
		title : '注册页面'
	});
};

exports.signin = function(req, res) {
	var _user = req.body.user;

	UserModel.findOne({ name: _user.name }, function(err, user) {
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
			return res.redirect('/signup');
		}
	});
};
//登录
exports.logout = function(req, res) {
	delete req.session.session_of_user;
	//TODO 直接调用这个方法会在这一行出现问题 app is not defined
	delete app.locals.user; 
	res.redirect('/');
};

//注册
exports.signup = function(req, res) {
	var _user = req.body.user;

	UserModel.find({ name: _user.name }, function(err, user) {
		if (err) {
			console.info(err);
		}

		if (user) {//存在跳转到登录页面
			return res.redirect('/signin');
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
};

exports.queryUserList = function(req, res) {
	UserModel.fetch(function(err, users) {
		if (err) {
			throw err;
		}
		
		res.render('userlist', {
			title: '用户列表',
			users: users
		});
	});
};

/**
 * 验证用户是否登陆
 */
exports.validUser = function(req, res, next) {
	var _user = req.session.session_of_user;
	console.log('----------validUser');
	if(!_user) {
		res.redirect('/signin');
		return;
	}
	
	next();
};

/**
 * 验证用户
 */
exports.validUserRole = function(req, res, next) {
	var _user = req.session.session_of_user;
	console.log('----------validUserRole');
	if(_user.role && _user.role > 10) {
		next();
	} else {
		console.log('-----登录用户没有权限操作');
		return res.redirect('/signin');
	}
};
