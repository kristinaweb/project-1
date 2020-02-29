const gulp = require('gulp');
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const bSync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')
const del = require('del')
const imagemin = require('gulp-imagemin')

const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

function html () {
    return gulp.src('src/html/**.html')
    .pipe(include({
        prefix: '@@'
    }))
    .pipe(gulp.dest('dist'))
}

function scss () {
    return gulp.src ('src/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: false
    }))
    .pipe(csso())
    .pipe(gulp.dest('dist/css'))
}

function img () {
    return gulp.src('src/img/**/*')
    // .pipe(imagemin([
    //     imagemin.gifsicle({interlaced: true}),
    //     imagemin.mozjpeg({quality: 75, progressive: true}),
    //     imagemin.optipng({optimizationLevel: 5}),
    //     imagemin.svgo({
    //         plugins: [
    //             {removeViewBox: true},
    //             {cleanupIDs: false}
    //         ]
    //     })
    // ]))
    .pipe(gulp.dest('dist/images'))
}



function fonts () {
    return gulp.src('src/**/fonts/**/*')
      .pipe(gulp.dest('dist/'))
}


function js () {
    return gulp.src('src/js/custom/*.js')
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/custom/'))
}

function libs () {
    return gulp.src('src/js/libs/**/*')
    .pipe(gulp.dest('dist/js/libs/'))
}

function clear() {
    return del('dist')
}
function serve() {
    bSync.init({
        server: './dist'
    })
    gulp.watch('src/html/**/**.html', gulp.series(html)).on('change', bSync.reload)
    gulp.watch('src/scss/**/**.scss', gulp.series(scss)).on('change', bSync.reload)
    gulp.watch('src/js/**/**.js', gulp.series(js)).on('change', bSync.reload)
}


exports.build = gulp.series(clear, html, scss, js, libs, img, fonts, serve)
exports.watch = gulp.series(clear, html, scss, js, libs, img, fonts, serve)
