/**
 * config配置文件
 */
var path = require("path");

var config = {
    debug: false,
    //是否允许注册
    allow_sign_up: true,
    // 站点名字
    name: '电影狙击手',
    // mongodb 配置
    db: 'mongodb://127.0.0.1/moviesite_dev',
    // moviesite的域名
    host: 'localhost',
    // 程序运行的端口
    hostname: '127.0.0.1',
    port: 3000,
    // 邮箱配置
    mail_opts: {
        host: 'smtp.126.com',
        port: 25,
        auth: {
            user: 'abc@126.com',
            pass: 'giscafer'
        }
    },
    session_secret: 'moviesite_secret', // session密匙
    session_collection: 'moviesite_secret', // 存放session的collection
    cookie_secret: 'moviesite_secret', // session密匙
    auth_cookie_name: 'moviesite_cookie', //cookie名称
    
    admins: {
        // user_login_name: true // admin 可删除话题，编辑标签，设某人为达人
    },
};
module.exports = config;