var UserModel = require('../models/userModel');

exports.signin = function(req, res) {
	var _user = req.body.user;

	console.info(_user);

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
			return res.redirect('/');
		}
	});
};
//登录
exports.logout = function(req, res) {
	delete req.session.session_of_user;
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
