var index = require('../app/controllers/index');
var movie = require('../app/controllers/movie');
var user = require('../app/controllers/user');
var comm = require('../app/controllers/comment');
var category = require('../app/controllers/category');

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

	app.get('/', index.index); //welcome
	app.get('/movie/:id', movie.detail); //详情页
	
	app.get('/admin/movie', [user.validUser], movie.toAdd); //跳转到添加页
	app.get('/admin/update/:id', [user.validUser], movie.toModify);// 跳转到修改页

	// admin post movie
	app.post('/admin/movie/new', [user.validUser], movie.uploadPoster, movie.saveOrUpdate);
	app.get('/admin/movie/list', [user.validUser], movie.queryListForAdmin);
	app.get('/admin/movie/del/:id', [user.validUser], movie.del);
	app.delete('/admin/movie/del2/:id', [user.validUser], movie.del2);

	// user
	app.get('/user/list', [user.validUser, user.validUserRole], user.queryUserList);
	app.post('/user/signin', user.signin); //登录
	app.get('/user/logout', function(req, res) {
		delete req.session.session_of_user;
		delete app.locals.user; 
		res.redirect('/');
	});  //登出
	app.post('/user/signup', user.signup); //注册
	
	app.post('/user/comment', comm.saveComment); //添加评论
	
	//评论
	app.get('/admin/category', user.validUser, category.toAdd);
	app.post('/admin/category/new', user.validUser, category.save);
	app.get('/admin/category/list', user.validUser, category.list);
	
	//分类分页查询
	app.get('/results', index.results);
	app.get('/search', index.search);
	
	app.get('/signin', user.showSignIn);
	app.get('/signup', user.showSignUp);
};