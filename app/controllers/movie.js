var _ = require('underscore');
var Movie = require('../models/movie')
var Category = require('../models/category');
var Comment = require('../models/comment');
var Eventproxy = require('eventproxy');
var fs=require('fs');
var path=require('path');
//detail page
exports.detail = function(req, res) {
        var id = req.params.id;
        Movie.findById(id, function(err, movie) {
            //对电影访客查看统计
            Movie.update({_id:id},{$inc:{pv:1}},function(err){
                if(err){
                    console.log(err);
                }
            });
            //查询展示电影评论
            Comment
                .find({
                    'movie': id
                })
                .populate('from', 'name') //对每个评论中的from（user._id进行查询name值）
                .populate('reply.from reply.to', 'name') //对每个评论中的from（user._id进行查询name值）
                .exec(function(err, comments) {
                    res.render('detail', {
                        title: movie.title,
                        movie: movie,
                        comments: comments,
                    });
                });
        });
    }
    //admin page
exports.new = function(req, res) {
        Category.find({}, function(err, categories) {
            res.render('admin', {
                title: '后台录入页',
                categories: categories,
                movie: {}
            });
        });

    }
//admin poster upload
//保存上传海报（海报保存成功后再对电影信息保存，当上传附件过大的时候可能影响整体速度，
//最好是在电影分类保存的时候讲上传海报地址传递过去（此时可能不能使用multipart）
exports.savePoster=function(req,res,next){
    var posterData=req.files.uploadPoster;
    var filePath=posterData.path;
    var originalFilename=posterData.originalFilename;
    console.log(req.files);
    if(originalFilename){
        fs.readFile(filePath,function(err,data){
            var timestamp=Date.now();
            var type=posterData.type.split('/')[1];
            var poster=timestamp+'.'+type;
            var newPath=path.join(__dirname,'../../','/public/upload/'+poster);
            fs.writeFile(newPath,data,function(err){
                req.poster=poster;
                next();
            });
        });
    }else{//没有图片上传则进入下一步
        next();//save()
    }
}
//admin post movie
exports.save = function(req, res, next) {
        var id = req.body.movie._id;
        var movieObj = req.body.movie;
        var _movie;
        var ep = new Eventproxy();
        ep.fail(next);
        if(req.poster){
            movieObj.poster=req.poster;
        }
        if (id) { //更新
            Movie.findById(id, function(err, movieOld) {
                if (err) {
                    console.log(err);
                }
                _movie = _.extend(movieOld, movieObj);
                _movie.save(function(err, movie) {
                    if (err) {
                        console.log(err);
                    }
                    //此处应该控制，如果填写了分类，则radio选择无效，自定义优先级最高
                    var categoryId = _movie.category;
                    Category.findById(categoryId, function(err, _category) {
                        //查询不到电影分类的时候，创建分类
                        if (!_category) {
                            var category = new Category({
                                name: movieObj.categoryName || '其他',
                                movies: [movie._id]
                            });
                            category.save(function(err, category) {
                                if (err) console.log(err);
                                movie.category = category._id;
                                movie.save(function(err, moive2) {
                                    res.redirect('/movie/' + moive2._id);
                                })
                            });
                        } else {
                            //检查分类中是否有该电影，避免重复添加
                            if (!_category.movies.some(function(item) {
                                    console.log(item.toString() === movie._id.toString());
                                    return item.toString() === movie._id.toString();
                                })) {

                                _category.movies.push(movie._id);
                            }
                            _category.save(function(err, category) {
                                res.redirect('/movie/' + movie._id);
                            });
                        }
                    });
                });
            })
        } else { //新增
            _movie = new Movie(movieObj);
            var categoryId = _movie.category;
            //如果没有选择分类，则新建分类
            if (!categoryId) {
                var category = new Category({
                    name: movieObj.categoryName || '其他',
                    movies: []
                });
                category.save(function(err, category) {
                    if (err) console.log(err);
                    _movie.category = category._id;
                    //保存电影
                    _movie.save(function(err, movie) {
                        if (err) {
                            console.log(err);
                        }
                        //将新增电影插入分类
                        category.movies.push(movie._id);
                        category.save(function(err, category) {
                            res.redirect('/movie/' + movie._id);
                        });
                    });
                });
            } else {
                //分类存在则直接保存电影和插入电影ID到分类
                _movie.save(function(err, movie) {
                    if (err) {
                        console.log(err);
                    }
                    Category.findById(categoryId, function(err, category) {
                        category.movies.push(movie._id);
                        category.save(function(err, category) {
                            res.redirect('/movie/' + movie._id);
                        });
                    });

                });
            }
        }
    }
    //list page
exports.list = function(req, res) {
        Movie.fetch(function(err, movies) {
            if (err) {
                console.log(err);
            }
            res.render('list', {
                title: '电影列表页',
                movies: movies
            })
        })
    }
    //list delete movie
exports.del = function(req, res) {
        var id = req.query.id;

        if (id) {
            Movie.remove({
                _id: id
            }, function(err, movie) {
                if (err) {
                    console.log(err);
                } else {
                    res.json({
                        success: 1
                    })
                }
            })
        }
    }
    //admin update movie
exports.update = function(req, res) {
    var id = req.params.id;
    console.log(id);

    if (id) {
        Movie.findById(id, function(err, movie) {
            Category.find({}, function(err, categories) {
                res.render('admin', {
                    title: '后台更新页',
                    movie: movie,
                    categories: categories
                });
            });
        });
    }
}
