var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');

var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var dbUrl = 'mongodb://localhost/imooc';
mongoose.connect(dbUrl);

app.use(require('body-parser').urlencoded({
	extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.port || 3000);
app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(session({
	name: "opqrst",
	secret: "imovie",
	resave: false,
	saveUninitialized: false,
	store: new mongoStore({
		url: dbUrl,
		auto_reconnect: true, //issue 推荐解决方法
		collection: "sessions"
	})
}));
app.locals.moment = require('moment');

if ("development" === app.get("env")) {
	app.set("showStackError", true);
	app.use(logger(":method :url :status"));
	app.locals.pretty = true; //控制是否压缩生成的html页面
	mongoose.set("debug", true);
}

require('./config/router')(app);

app.listen(app.get('port'));
console.info('listening on port ' + app.get('port'));