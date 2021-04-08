const { series, parallel, src, dest, watch } = require('gulp')
const less = require('gulp-less')
const concat = require('gulp-concat')
const cleanCss = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const spriter = require('gulp-css-spriter')
const htmlmin = require('gulp-htmlmin')
const rename = require('gulp-rename')


function defaultTask(cb){
    console.log('default')
    cb()
}

function copyTask(){
    return src('./src/**/*')
        .pipe(dest('./build/'))
}

function watchTask(){
    watch('./src/*.html', copyTask, function(cb){
        console.log('edit')
    })
}

function lessTask(){
    return src('./src/less/*.less')
        .pipe(less())
        .pipe(dest('./src/css/'))
}

function concatTask(){
    return src(['./src/css/*.css', '!./src/css/all.css'])
        .pipe(concat('all.css'))
        .pipe(dest('./src/css/'))
}

function cleanCssTask(){
    return src(['./scr/css/*.css', '!./src/css/all.css'])
        .pipe(concat('all.css'))
        .pipe(cleanCss())
        .pipe(dest('./scr/css/'))
}

function uglifyTask(){
    return src(['./src/js/*.js', '!./src/js/all.js'])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(dest('./src/js/'))
}

function imageminTask(){
    return src('./src/img/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('./build/img/'))
}


function spriterTask(){
    return src(['./src/css/*.css', '!./src/css/all.css'])
        .pipe(concat('all.css'))    //这里做了一下css的合并操作
        .pipe(spriter({
            'spriteSheet': './build/img/spritesheet.png',   //生成的路径，这里是精灵图生成的路径 和 名称。根据自己的项目自定义
            'pathToSpriteSheetFromCSS': '../img/spritesheet.png'    //替换的路径  这里是把原来引入的背景图路径替换成这个
        }))
        .pipe(cleanCss())   //这里进行了压缩操作
        .pipe(dest('./build/css/')) //最后输出到了build下面的css文件夹里
}

function htmlminTask(){
    return src('./src/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(dest('./build/'))
}

function renameTask(){
    return src('./src/img/*.jpeg')
        .pipe(rename({extname: '.jpg'}))
        .pipe(dest('./build/img/'))
}

exports.copy = copyTask
exports.watch = watchTask
exports.less = lessTask
exports.concat = concatTask
exports.clean = cleanCssTask
exports.uglify = uglifyTask
exports.image = imageminTask
exports.spriter = spriterTask
exports.html = htmlminTask
exports.rename = renameTask
exports.default = series(defaultTask, copyTask)