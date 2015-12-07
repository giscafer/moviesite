# moviesite V1.0.0
>nodejs开发一个关于电影的小站点

>1、NodeJS+Express

>2、MongoDB

>3、模板引擎Jade + BootStrap

nodejs v0.12.2、npm v2.7.4、mongodb v3.0

其他依赖详细见：package.json文件

### 功能

>1、用户登录和注册

>2、对电影的增删改查（后台，需要用户权限）

>3、电影的分类管理和评论等

###使用方法

>1、安装必备环境后，使用npm install 安装项目中的所有依赖模块

>2、使用node app或grunt启动项目

###问题

1、安装bcrypt报错node-gyp rebuild解决方法
	http://blog.csdn.net/allgis/article/details/46574493

###更新日志

>2015年8月23日23:00:52 修改更新电影时重复添加电影到分类问题;

>2015年8月25日00:22:08 添加JSONP采集豆瓣电影信息功能;

>2015年8月25日23:17:25 修改网站导航条，调整样式布局，添加分类删除功能

>2015年8月27日00:34:51 添加电影分类查询和分页功能

>2015年8月29日11:46:44 添加全局关键字搜索功能

>2015年8月31日00:13:38 添加统计电影查看PV和海报上传功能

>2015年8月31日23:46:00 增加单元测试

### 界面展示

**网站界面**

![网站界面][1]

**电影详情**

![电影详情][2]

**电影管理**

![电影管理][3]

**电影新增**

![电影新增界面][4]


[1]: https://github.com/giscafer/moviesite/blob/master/public/upload/intro.png
[2]: https://github.com/giscafer/moviesite/blob/master/public/upload/intro_movie_detail.png
[3]: https://github.com/giscafer/moviesite/blob/master/public/upload/intro_movie_admin.png
[4]: https://github.com/giscafer/moviesite/blob/master/public/upload/intro_movie_add.png
