var mongoose=require('mongoose')
var bcrypt=require('bcrypt')
var SALT_WORK_FACTOR=10;
var UserSchema=new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:String,
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

UserSchema.pre('save',function(next){
	var user=this;
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now()
	}else{
		this.meta.updateAt=Date.now()
	}
	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		console.log('-----------------------')
		if(err) return next(err);
		bcrypt.hash(user.password,salt,function(err,hash){
			if(err) return next(err);
			user.password=hash
			console.log('-----------------------',user.password)
			next()
		})
	})
})

UserSchema.statics={
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
module.exports=UserSchema