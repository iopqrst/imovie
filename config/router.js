var index = require('../app/controllers/index');
var movie = require('../app/controllers/movie');
var user = require('../app/controllers/user');

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

	app.get('/', index); //welcome

	app.get('/movie/:id', movie.detail); //详情页
	app.get('/admin/movie', movie.toAdd); //跳转到添加页
	app.get('/admin/update/:id', movie.toModify);// 跳转到修改页

	// admin post movie
	app.post('/admin/movie/new', movie.saveOrUpdate);
	app.get('/admin/movie/list', movie.queryListForAdmin);
	app.get('/admin/movie/del/:id', movie.del);
	app.delete('/admin/movie/del2/:id', movie.del2);

	// user
	app.get('/user/list', user.queryUserList);
	app.post('/user/signin', user.signin); //登录
	app.get('/user/logout', function(req, res) {
		delete req.session.session_of_user;
		delete app.locals.user; 
		res.redirect('/');
	});  //登出
	app.post('/user/signup', user.signup); //注册
	
	app.get('/signin', user.showSignIn);
	app.get('/signup', user.showSignUp);
};