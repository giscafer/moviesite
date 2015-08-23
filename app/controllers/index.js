var Movie = require('../models/movie')
var Category = require('../models/category')
    //index page
exports.index = function(req, res) {
    // console.log('---------------user in session-----------------');
    // console.log(req.session.user);
    Category
        .find({})
        .populate({ //每个分类下取出5条 
            path: 'movies',
            options: {
                limit: 5
            }
        })
        .exec(function(err, categories) {
            if (err) {
                console.log(err);
            }
            res.render('index', {
                title: '电影狙击手 首页',
                categories: categories
            })
        })
}
