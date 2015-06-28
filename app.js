var express = require("express")
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var mongoose=require('mongoose')
var mongoStore=require('connect-mongodb')
var _=require('underscore')
var Movie=require('./models/movie')
var User=require('./models/user')
var settings=require('./settings')
var port = process.env.PORT || 3000
var app = express()
//连接方式
var dbUrl='mongodb://localhost:27017/moviesite';
mongoose.connect(dbUrl)
// var db = exports.Connection = mongoose.createConnection(settings.host,settings.db,{safe:false});
app.set('views', './views/pages')
app.set('view engine', 'jade')
// parse application/x-www-form-urlencoded ,false的时候无法req.body.user的值
app.use(bodyParser.urlencoded({ extended: true }))
//cookie
app.use(cookieParser())
app.use(session({
	resave: false,
	saveUninitialized: true,
	cookie: {maxAge:3600000}, 
	secret:'moviesite',
	store:new mongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}))
app.use(express.static(__dirname + '/views'));
app.use('/public', express.static(__dirname + '/public'));
app.listen(port);
app.locals.moment=require('moment')
console.log('moviesite started on port ' + port);

//index page
app.get('/', function (req, res) {
	console.log('---------------user in session-----------------');
	console.log(req.session.user);
	var _user=req.session.user;
	if(_user){
		app.locals.user=_user;//将user信息放到本地变量
	}
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index', {
			title: 'moviesite 首页',
			movies: movies
		})
	})

})
// signup
app.post('/user/signup',function(req,res){
	var _user=req.body.user;
	User.find({name:_user.name},function(err,user){
		console.log(user);
		if(err) console.log(err);
		if(user.name){
			console.log("已存在注册的用户名，则跳转首页")
			return res.redirect('/')
		}else{
			console.log("注册用户！")
			var user=new User(_user);
			user.save(function(err,user){
				if(err){
					console.log(err)
				}
				res.redirect('/admin/userlist');
			})
		}
	})

})
//userlist page
app.get('/admin/userlist', function (req, res) {
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render('userlist', {
			title: 'moviesite 用户列表页',
			users:users
		})
	})
})
///user/login
app.post('/user/login',function(req,res){
	var _user=req.body.user;
	var name=_user.name;
	var password=_user.password;

	User.findOne({name:name},function(err,user){
		if(err)  console.log(err);
		if(!user){
			return res.redirect('/');
		}
		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err);
			}
			if(isMatch){
				console.log('Password is matched')
                //将用户保存服务器
                req.session.user=user;
                return res.redirect('/')
            }else{
            	console.log('Password is not matched')
            }
        })
	});

});
///logout
app.get('/logout',function(req,res){

	delete req.session.user;//删除session
	delete app.locals.user;//删除本地变量
	res.redirect('/')
})
//detail page
app.get('/movie/:id', function (req, res) {
	var id=req.params.id
	Movie.findById(id,function(err,movie){
		res.render('detail', {
			title: 'moviesite '+movie.title,
			movie: movie
		})
	})
})
//admin page
app.get('/admin/movie', function (req, res) {
	res.render('admin', {
		title: 'moviesite 后台录入页',
		movie: {
			director: '',
			country: '',
			title: '',
			year: '',
			poster: '',
			language: '',
			flash: '',
			summary: ''
		}
	})
})
//admin post movie
app.post('/admin/movie/new',function(req, res){
	var id=req.body._id
	var movieObj={
		_id:req.body._id,
		title:req.body.title,
		director:req.body.director,
		country:req.body.country,
		language:req.body.language,
		year:req.body.year,
		poster:req.body.poster,
		summary:req.body.summary,
		flash:req.body.flash
	}
	var _movie
	console.log("../admin/movie/new")
	if(id!=='undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}

			_movie=_.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/'+movie._id)
			})
		})
	}
	else{
		_movie=new Movie({
			title:movieObj.title,
			director:movieObj.director,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash
		})
		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}
			res.redirect('/movie/'+movie._id)
		})
	}
})
//list page
app.get('/admin/list', function (req, res) {
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list', {
			title: 'moviesite 列表页',
			movies:movies
		})
	})
})
//list delete movie
app.delete('/admin/list',function(req,res){
	var id=req.query.id

	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}
		})
	}
})
//admin update movie
app.get('/admin/update/:id',function(req, res){
	var id=req.params.id
	console.log(id)

	if(id){
		Movie.findById(id,function(err,movie){
			console.log(movie.summary)
			res.render('admin',{
				title:'moviesite 后台更新页',
				movie:movie
			})
		})
	}
});
