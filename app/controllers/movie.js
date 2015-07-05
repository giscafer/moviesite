var _ = require('underscore')
var Movie = require('../models/movie')
var Comment = require('../models/comment')
	//detail page
exports.detail = function(req, res) {
		var id = req.params.id
		Movie.findById(id, function(err, movie) {
			Comment
				.find({'movie':id})
				.populate('from','name')//对每个评论中的from（user._id进行查询name值）
				.populate('reply.from reply.to','name')//对每个评论中的from（user._id进行查询name值）
				.exec(function(err,comments){
					res.render('detail',{
						title: 'moviesite ' + movie.title,
						movie: movie,
						comments: comments,
					})
				})
		})
	}
	//admin page
exports.new = function(req, res) {
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
	}
	//admin post movie
exports.save = function(req, res) {
		var id = req.body._id
		var movieObj = {
			_id: req.body._id,
			title: req.body.title,
			director: req.body.director,
			country: req.body.country,
			language: req.body.language,
			year: req.body.year,
			poster: req.body.poster,
			summary: req.body.summary,
			flash: req.body.flash
		}
		var _movie
		console.log("../admin/movie/new")
		if (id !== 'undefined') {
			Movie.findById(id, function(err, movie) {
				if (err) {
					console.log(err)
				}

				_movie = _.extend(movie, movieObj)
				_movie.save(function(err, movie) {
					if (err) {
						console.log(err)
					}
					res.redirect('/movie/' + movie._id)
				})
			})
		} else {
			_movie = new Movie({
				title: movieObj.title,
				director: movieObj.director,
				country: movieObj.country,
				language: movieObj.language,
				year: movieObj.year,
				poster: movieObj.poster,
				summary: movieObj.summary,
				flash: movieObj.flash
			})
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err)
				}
				res.redirect('/movie/' + movie._id)
			})
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
			console.log(movie.summary)
			res.render('admin', {
				title: 'moviesite 后台更新页',
				movie: movie
			})
		})
	}
}