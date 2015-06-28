var express = require("express")
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var mongoose=require('mongoose')
var mongoStore=require('connect-mongodb')
var morgan = require('morgan');
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
//本地开发环境信息日记输出
if('development'===app.get('env')){
	app.set('showStackError',true);
	app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
	app.locals.pretty=true;
	mongoose.set('debug',true);
}
//路由处理
require('./config/routes')(app)
app.listen(port);
app.locals.moment=require('moment')
console.log('moviesite started on port ' + port);
