// var _ = require('underscore');
var Movie = require('../models/movie');
var Category = require('../models/category');
var _ = require('lodash');
    //admin page
exports.new = function(req, res) {
        res.render('category_admin', {
            title: '后台分类录入页',
            category: {}
        })
    }
    //admin post category
exports.save = function(req, res) {
        var _category = req.body.category
        var category = new Category(_category)
        category.save(function(err, category) {
            if (err) {
                console.log(err);
            }
            res.redirect('/admin/category/list')
        })
    }
    //list page
exports.list = function(req, res) {

        Category.fetch(function(err, categories) {
            if (err) {
                console.log(err)
            }
            console.log(categories[0].name)
            console.log(categories)
            res.render('categorylist', {
                title: '分类列表页',
                categories: categories
            })
        })
    }
    //list delete category
exports.del = function(req, res) {
    var id = req.query.id

    if (id) {
        Category.remove({
            _id: id
        }, function(err, category) {
            if (err) {
                console.log(err)
            } else {
                res.json({
                    success: 1
                })
            }
        })
    }
};
/**
 * 删除分类中的电影（只允许一部电影有一个分类）
 *奇怪的一点：此方法不能更新分类中的movies数组
 */
exports.delMovieId=function(categoryId,movieId,callback){
	if(categoryId){
		Category.findById({_id:categoryId},function(err,_category){
			if(err) console.log(err);
			var evens =_.remove(_category.movies,function(n){
				return n.toString()===movieId.toString();
			});
			//尽管执行正确，数据库不改变（需要解决的疑问）
			_category.save(function(err,category){
				if(err){
					console.log(err);
				}
				callback(null,category);
			});
		})
	}
}
