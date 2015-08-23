var _ = require('underscore');
var lodash = require('lodash');
var Movie = require('../models/movie')
var Category = require("../models/category");
var CategoryController = require("./category");
var Comment = require('../models/comment');
var Eventproxy = require('eventproxy');
//detail page
exports.detail = function(req, res) {
        var id = req.params.id
        Movie.findById(id, function(err, movie) {
            Comment
                .find({
                    'movie': id
                })
                .populate('from', 'name') //对每个评论中的from（user._id进行查询name值）
                .populate('reply.from reply.to', 'name') //对每个评论中的from（user._id进行查询name值）
                .exec(function(err, comments) {
                    res.render('detail', {
                        title: 'moviesite ' + movie.title,
                        movie: movie,
                        comments: comments,
                    })
                })
        })
    }
    //admin page
exports.new = function(req, res) {
        Category.find({}, function(err, categories) {
            res.render('admin', {
                title: 'moviesite 后台录入页',
                categories: categories,
                movie: {}
            });
        });

    }
    //admin post movie
exports.save = function(req, res, next) {
        var id = req.body.movie._id;
        var movieObj = req.body.movie;
        var _movie;
        var ep = new Eventproxy();
        ep.fail(next);
        if (id) { //更新
            Movie.findById(id, function(err, movieOld) {
                if (err) {
                    console.log(err)
                }
                _movie = _.extend(movieOld, movieObj);
                _movie.save(function(err, movie) {
                    if (err) {
                        console.log(err)
                    }
                    //此处应该控制，如果填写了分类，则radio选择无效，自定义优先级最高
                    var categoryId = _movie.category;
                    Category.findById(categoryId, function(err, _category) {
                        //查询不到电影分类的时候，创建分类
                        if (!_category) {
                            var category = new Category({
                                name: movieObj.categoryName || '未分类',
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
                            if (_category.movies.some(function(item) {
                                    console.log(item.toString() === movie._id.toString());
                                    return item.toString() === movie._id.toString();
                                })) {} else {
                                _category.movies.push(movie._id);
                            }
                            _category.save(function(err, category) {
                                console.log('category+++3' + category)
                                res.redirect('/movie/' + movie._id);
                            });
                        }
                    });
                });
            })
        } else { //新增
            _movie = new Movie(movieObj)
            var categoryId = _movie.category;
            console.log('categoryID---' + categoryId);
            //如果没有选择分类，则新建分类
            if (!categoryId) {
                var category = new Category({
                    name: movieObj.categoryName || '未分类',
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
                console.log(err)
            }
            res.render('list', {
                title: 'moviesite 列表页',
                movies: movies
            })
        })
    }
    //list delete movie
exports.del = function(req, res) {
        var id = req.query.id

        if (id) {
            Movie.remove({
                _id: id
            }, function(err, movie) {
                if (err) {
                    console.log(err)
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
    var id = req.params.id
    console.log(id)

    if (id) {
        Movie.findById(id, function(err, movie) {
            Category.find({}, function(err, categories) {
                res.render('admin', {
                    title: 'moviesite 后台更新页',
                    movie: movie,
                    categories: categories
                });
            });
        });
    }
}
