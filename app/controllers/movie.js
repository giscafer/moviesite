var _ = require('underscore')
var Movie = require('../models/movie')
var Category = require("../models/category")
var Comment = require('../models/comment')
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
exports.save = function(req, res) {
        var id = req.body.movie._id;
        var movieObj = req.body.movie;
        var _movie;
        if (id) {
            Movie.findById(id, function(err, movie) {
                if (err) {
                    console.log(err)
                }

                _movie = _.extend(movie, movieObj);
                _movie.save(function(err, movie) {
                    if (err) {
                        console.log(err)
                    }
                    //此处应该控制，如果选择了电影分类，填写的分类无效
                    var categoryId = _movie.category;
                    Category.findById(categoryId, function(err, category) {
                    	if(!category){//查询不到电影分类的时候，创建分类
                    		var category = new Category({
                    		    name: movieObj.categoryName || '未分类',
                    		    movies: [movie._id]
                    		});
                    		category.save(function(err, category) {
                    			if(err) console.log(err);
                    			movie.category=category._id;
                    			movie.save(function(err,moive2){
                    				res.redirect('/movie/' + moive2._id);
                    			})
                    		});
                    	}else{
                    		category.movies.push(movie._id);
                    		category.save(function(err, category) {
                    		    res.redirect('/movie/' + movie._id);
                    		});
                    	}
                    });
                });
            })
        } else {
            _movie = new Movie(movieObj)
            var categoryId = _movie.category;
            console.log('categoryID---' + categoryId);
            if (!categoryId) {
                var category = new Category({
                    name: movieObj.categoryName,
                    movies: []
                });
                category.save(function(err, category) {
                    console.log(err);
                    _movie.save(function(err, movie) {
                        if (err) {
                            console.log(err);
                        }
                       categoryId=category._id;
                        Category.findById(categoryId, function(err, category) {
                            category.movies.push(movie._id);
                            category.save(function(err, category) {
                                res.redirect('/movie/' + movie._id);
                            });
                        });

                    });
                });
            }else{
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
