var User = require('../models/user')

//signup
exports.showSignup = function(req, res) {
        res.render('signup', {
            title: '注册页面'
        })
    }
    //signin
exports.showSignin = function(req, res) {
        res.render('signin', {
            title: '登录页面'
        })
    }
    //userlist page
exports.list = function(req, res) {

        User.fetch(function(err, users) {
            if (err) {
                console.log(err)
            }
            res.render('userlist', {
                title: 'moviesite 用户列表页',
                users: users
            })
        })
    }
    // app.get('/admin/userlist', )
    ///user/login
exports.singin = function(req, res) {
        var _user = req.body.user;
        var name = _user.name;
        var password = _user.password;

        User.findOne({
            name: name
        }, function(err, user) {
            if (err) console.log(err);
            if (!user) {
                return res.redirect('/signup');
            }
            user.comparePassword(password, function(err, isMatch) {
                if (err) {
                    console.log(err);
                }
                if (isMatch) {
                    //将用户保存服务器
                    req.session.user = user;
                    return res.redirect('/')
                } else {
                    return res.redirect('../signin')
                }
            })
        });
    }
    // app.post('/user/login',);
    ///logout
exports.logout = function(req, res) {

        delete req.session.user; //删除session
        // delete app.locals.user;//删除本地变量
        res.redirect('/')
    }
    // signup
exports.signup = function(req, res) {
    var _user = req.body.user;
    User.findOne({
        name: _user.name
    }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (user) { //
            console.log("已存在注册的用户名，则跳转登录页面！")
            return res.redirect('/signin')
        } else {
            console.log("注册用户！")
            var user = new User(_user);
            user.save(function(err, user) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/'); //admin/userlist
            })
        }
    })

}
exports.signinRequired = function(req, res,next) {
    var user=req.session.user;
    if (!user) {
        return res.redirect('/signin')
    }
    next()
}
exports.adminRequired = function(req, res,next) {
    var user=req.session.user;
    if (user.role<=10) {
        return res.redirect('/signin')
    }
    next()
}
