const gulp = require('gulp'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    cssnano = require('gulp-cssnano')
    browserSync = require('browser-sync').create()

// HTML task - simply copy to public folder for now.
function htmlTask(next) {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('public'))

    next()    
}

// CSS/SASS Task
function cssTask(next) {
    gulp.src('src/scss/app.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream())

    next()
}

function cssTaskProd(next) {
    gulp.src('src/scss/app.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(gulp.dest('public/css'))

    next()
}

// Images Task (Assets)
function imagesTask(next) {
    gulp.src('src/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('public/images'))
    next();
}

// Experimenting Live-reload HOC (Didn't work)
function doLiveReload(callback = () => {}) {
    return (next) => {
        callback()
        browserSync.reload().then(next)

        //next()
    }
}

// File watcher task.
function watch(next) {
    gulp.watch('src/scss/**/*.scss', {delay: 2500}, cssTask).on('change', browserSync.reload)
    gulp.watch('src/**/*.html', htmlTask).on('change', browserSync.reload)

    next()
}

// HMR Task.
function liveReload(next) {
    browserSync.init({
        server: {
            baseDir: 'public'
        }
    })
    next()
}

// send out our public tasks.
exports.dev = gulp.series(htmlTask, cssTask, imagesTask)
exports.build = gulp.series(htmlTask, cssTaskProd, imagesTask)
exports.default = gulp.series(htmlTask, cssTask, imagesTask, liveReload, watch)
exports.watch = watch
