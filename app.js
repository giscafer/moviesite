var express = require("express")
var bodyParser = require('body-parser')
var mongoose=require('mongoose')
var _=require('underscore')
var Movie=require('./models/movie')
var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost:27017/imooc')

app.set('views', './views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));
app.use('/public', express.static(__dirname + '/public'));
app.listen(port);
app.locals.moment=require('moment')
console.log('imooc started on port ' + port);

//index page
app.get('/', function (req, res) {
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
        }
        res.render('index', {
            title: 'imooc 首页',
            movies: movies
        })
    })
})
//detail page
app.get('/movie/:id', function (req, res) {
    var id=req.params.id
    Movie.findById(id,function(err,movie){
        res.render('detail', {
            title: 'imooc '+movie.title,
            movie: movie
        })
    })
})
//admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: 'imooc 后台录入页',
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
    console.log("-----------"+req.body._id)
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
       title: 'imooc 列表页',
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
                title:'imooc 后台更新页',
                movie:movie
            })
        })
    }
})
//login
app.get('/login',function(req,res){
    res.render('login',{
        title:'imooc 登录页',
    })
})
//login test
app.post('/login/check',function(req,res){
   console.log("-----------"+req.body.username)
   var id=req.body.movie
   console.log("-----------"+req.body.movie)
   var movieObj=req.body.username
   res.render('login',{
    title:'imooc 登录页',
})
})