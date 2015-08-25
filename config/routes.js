//路由处理层
var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category')

module.exports = function(app) {
	//pre hander user持久化逻辑预处理
	app.use(function(req, res, next) {
		var _user = req.session.user;
		app.locals.user = _user; //将user信息放到本地变量
		next();

	})

	//index page
	app.get('/', Index.index);

	//User
		// signup
	app.post('/user/signup', User.signup);
		//userlist page
	app.get('/admin/user/list', User.signinRequired,User.adminRequired,User.list);
		///user/login
	app.post('/user/login', User.singin);;
	app.get('/signin',User.showSignin);
	app.get('/signup',User.showSignup);
	///logout
	app.get('/logout', User.logout);

	//Movie
		//detail page
	app.get('/movie/:id', Movie.detail);
		//admin page
	app.get('/admin/movie',User.signinRequired,User.adminRequired, Movie.new);
		//admin post movie
	app.post('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.save);
		//list page
	app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list);
		//list delete movie
	app.delete('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.del);
		//admin update movie
	app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update);

	//Comment
	
	app.post('/user/comment',User.signinRequired,Comment.save);
	//category
	app.get('/admin/category/new',User.signinRequired,User.adminRequired,Category.new);
	app.post('/admin/category',User.signinRequired,User.adminRequired,Category.save);
	app.get('/admin/category/list',User.signinRequired,User.adminRequired,Category.list);
	//delete category
	app.delete('/admin/category/list',User.signinRequired,User.adminRequired,Category.del);

}