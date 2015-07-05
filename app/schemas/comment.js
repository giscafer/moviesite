var mongoose=require('mongoose')
var Schema=mongoose.Schema
var ObjectId=Schema.Types.ObjectId

var CommentSchema=new Schema({
	movie:{type:ObjectId,ref:'Movie'},
	from:{type:ObjectId,ref:'User'},
	reply:[{
		content:String,
		from:{type:ObjectId,ref:'User'},
		to:{type:ObjectId,ref:'User'}
	}],
	to:{type:ObjectId,ref:'User'},
	content:String,
	meta:{//更新数据的时候的时间记录
		createAt:{//创建时间
			type:Date,
			default:Date.now()
		},
		updateAt:{//更新时间
			type:Date,
			default:Date.now()
		}
	}
})

CommentSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now()
	}else{
		this.meta.updateAt=Date.now()
	}
	next()
})

CommentSchema.statics={
	fetch:function(cb){
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb)
	},
	findById:function(id,cb){
		return this
		.findOne({_id:id})
		.exec(cb)
	}
}
module.exports=CommentSchema