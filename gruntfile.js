module.exports=function(grunt){

	grunt.initConfig({
		watch:{
			jade:{
				files:['views/**'],
				option:{
					livereload:true
				}
			},
			js:{
				files:['public/js/**','models/**/*.js','schemas/**/*.js'],
				// tasks:['jshint'],
				options:{
					livereload:true
				}
			}
		},
		nodemon:{
			dev:{
				options:{
					file:'app.js',
					args:[],
					ignoredFiles:['README.md','node_modules/**','.DS_Store'],
					watchedExtensions:['js'],
					watchedFolders:['./'],
					// watchedFolders:['app','config'],
					debug:true,
					delayTime:1,
					env:{
						PORT:3000
					},
					cwd:__dirname
				}
			}
		},
		mochaTest:{
			options:{
				reporter:'spec'
			},
			src:['test/**/*.js']
		},
		concurrent:{
			tasks:['nodemon','watch'],
			options:{
				logConcurrentOutput:true
			}
		}
	})

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');//文件改变后，会自动启动服务 
	grunt.loadNpmTasks('grunt-concurrent');// Run grunt tasks concurrently 并发执行任务
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.option('force',true);//避免编译的时候出现错误而中断服务
	grunt.registerTask('default',['concurrent']);//注册default任务
	grunt.registerTask('test',['mochaTest']);//注册default任务
}