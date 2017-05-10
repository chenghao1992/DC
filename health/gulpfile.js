var gulp = require('gulp'),
    jsmin = require('gulp-uglify'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    livereload = require('gulp-livereload'),
    htmlmin = require('gulp-html-minifier'),
    cssmin = require('gulp-cssmin'),
    replace = require('gulp-replace'),
    delete_file = require('gulp-delete-file'),
    rev = require('gulp-rev-append');

// 项目配置
var option = {
        _distUrl: 'dist',
        _devUrl: 'src'
    },
    jsUrl = [
        option._devUrl + '/config.js',
        option._devUrl + '/config.router.js'
    ],
    cssUrl = [
        option._devUrl + '/assets/css/**/*.css',
        option._devUrl + '/**/*.css'
    ],
    imgUrl = [
        option._devUrl + '/**/*.png',
        option._devUrl + '/**/*.gif',
        option._devUrl + '/**/*.jpg',
        option._devUrl + '/**/*.svg'
    ];

// 通过路径获取文件信息
var funGetFileInfo = function(_url) {
    var _distUrl = _url.replace(option._devUrl, option._distUrl),
        _pathArry = _distUrl.split('/'),
        _pathName = _pathArry[_pathArry.length - 1],
        _distPath = _distUrl.replace(_pathName, ''),
        _file = {
            _url: _url,
            _name: _pathName,
            _distPath: _distPath,
            _distUrl: _distUrl
        }
    return _file;
};

// JS压缩并负责到发布文件夹(项目配置文件)
gulp.task('funConfigJsDist', function(_filePath) {
    var _jsmin_option = {
        mangle: false // 是否替换变量
    }
    return gulp.src(_filePath)
        .pipe(concat('app.min.js'))
        .pipe(jsmin(_jsmin_option).on('error', errorHandler))
        .pipe(gulp.dest(option._distUrl))
})

// JS压缩并负责到发布文件夹(各模块文件)
gulp.task('funProjecJsDist', function() {
    var _jsmin_option = {
        mangle: false // 是否替换变量
    }
    return gulp.src(option._devUrl + '/**/*.js')
        .pipe(jsmin(_jsmin_option).on('error', errorHandler))
        .pipe(gulp.dest(option._distUrl))
})

// HTML压缩并负责到发布文件夹
gulp.task('funHtmlDist', function() {
    var _htmlmin_option = {
        collapseWhitespace: true, // 是否压缩
    };
    gulp.src(option._devUrl + '/**/*.html')
        .pipe(htmlmin(_htmlmin_option).on('error', errorHandler))
        .pipe(gulp.dest(option._distUrl))
})

// CSS压缩并负责到发布文件夹
gulp.task('funCssDist', function() {
    gulp.src(option._devUrl + '/**/*.css')
        .pipe(cssmin().on('error', errorHandler))
        .pipe(gulp.dest(option._distUrl))
})

// 删除文件
gulp.task('funCleanFile', function() {
    gulp.src(option._distUrl + '/**/*.*')
        .pipe(delete_file().on('error', errorHandler))
})

// 监控文件
gulp.task('watch', function() {

    funReplaceUrl(option._distUrl, option._devUrl);

    livereload.listen();

    // 监听发布文件夹文件变化并刷新页面
    gulp.watch(['**/*.*'], function(file) {
        gulp.src(file.path)
            .pipe(livereload());
    });

    return;

});

// 修改js css 文件引用地址
var funReplaceUrl = function(link, relink) {

    var _date = new Date().getTime();

    gulp.src(['index.html'])
        .pipe(rev().on('error', errorHandler)) // 添加版本号
        .pipe(replace('"' + link + '/', '"' + relink + '/').on('error', errorHandler))
        .pipe(gulp.dest('.'))


    gulp.src([option._devUrl + '/config.router.js'])
        .pipe(rev().on('error', errorHandler))
        .pipe(replace("var rootUrl = '" + link + "'", "var rootUrl = '" + relink + "'").on('error', errorHandler))
        .pipe(gulp.dest(option._devUrl));

};


// 复制图片
gulp.task('img', function() {

    gulp.src(imgUrl)
        .pipe(gulp.dest(option._distUrl));
})

// 切换成发布环境
gulp.task('dist', function() {
    funReplaceUrl(option._devUrl, option._distUrl);
});

// 切换成开发环境
gulp.task('dev', function() {
    funReplaceUrl(option._distUrl, option._devUrl);
});

// 构建发布项目，并切换成发布环境
gulp.task('build', ['dist', 'funCleanFile', 'funProjecJsDist', 'funHtmlDist', 'funCssDist', 'img']);

// 打印错误信息
function errorHandler(error) {
    console.log(error.toString());
    this.emit('end');
};
