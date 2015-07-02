//路由处理层
var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')

module.exports = function(app) {
	//pre hander user持久化逻辑预处理
	app.use(function(req, res, next) {
		var _user = req.session.user;
		app.locals.user = _user; //将user信息放到本地变量
		next();

	})

	//index page
	app.get('/', Index.index)

	//User
		// signup
	app.post('/user/signup', User.signup)
		//userlist page
	app.get('/admin/userlist', User.list)
		///user/login
	app.post('/user/login', User.singin);
	app.get('/signin',User.showSignin);
	app.get('/signup',User.showSignup);
	///logout
	app.get('/logout', User.logout)

	//Movie
		//detail page
	app.get('/movie/:id', Movie.detail)
		//admin page
	app.get('/admin/movie', Movie.new)
		//admin post movie
	app.post('/admin/new', Movie.save)
		//list page
	app.get('/admin/list', Movie.list)
		//list delete movie
	app.delete('/admin/list', Movie.list)
		//admin update movie
	app.get('/admin/update/:id', Movie.update);

}