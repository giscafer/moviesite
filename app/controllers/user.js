var User=require('../models/user')

//userlist page
exports.list=function (req, res) {
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render('userlist', {
			title: 'moviesite 用户列表页',
			users:users
		})
	})
}
// app.get('/admin/userlist', )
///user/login
exports.login=function(req,res){
	var _user=req.body.user;
	var name=_user.name;
	var password=_user.password;

	User.findOne({name:name},function(err,user){
		if(err)  console.log(err);
		if(!user){
			return res.redirect('/');
		}
		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err);
			}
			if(isMatch){
				console.log('Password is matched')
                //将用户保存服务器
                req.session.user=user;
                return res.redirect('/')
            }else{
            	console.log('Password is not matched')
            }
        })
	});
}
// app.post('/user/login',);
///logout
exports.logout=function(req,res){

	// delete req.session.user;//删除session
	// delete app.locals.user;//删除本地变量
	res.redirect('/')
}
// app.get('/logout',)
// signup
exports.signup=function(req,res){
	var _user=req.body.user;
	User.find({name:_user.name},function(err,user){
		console.log(user);
		if(err) console.log(err);
		if(user.name){
			console.log("已存在注册的用户名，则跳转首页")
			return res.redirect('/')
		}else{
			console.log("注册用户！")
			var user=new User(_user);
			user.save(function(err,user){
				if(err){
					console.log(err)
				}
				res.redirect('/admin/userlist');
			})
		}
	})

}
// app.post('/user/signup',)