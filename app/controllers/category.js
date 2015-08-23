var _ = require('underscore')
var Movie = require('../models/movie')
var Category = require('../models/category')
	//admin page
exports.new = function(req, res) {
		res.render('category_admin', {
			title: '电影狙击手 后台分类录入页',
			category:{}
		}) 
	}
	//admin post movie
exports.save = function(req, res) {
		var _category = req.body.category
		var category=new Category(_category)
		category.save(function(err,category){
			if(err){
				console.log(err)
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
            console.log("----------------")
            console.log(categories[0].name)
            console.log(categories)
            res.render('categorylist', {
                title: 'moviesite 分类列表页',
                categories:categories
            })
        })
    }
	//list delete movie
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
	}
