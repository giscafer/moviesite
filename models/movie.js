var mongoose=require('mongoose')
var MovieSchema=require('../schemas/movies')
var Movie=mongoose.model('Movie',MovieSchema)

module.exports=Movie