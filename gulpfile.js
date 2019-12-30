const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create()

// HTML task - simply copy to public folder for now.
function htmlTask(next) {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('public'))

    next()    
}

// CSS/SASS Tasks
function cssTask(next) {
    gulp.src('src/scss/app.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream())

    next()
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
    gulp.watch('src/scss/**/*.scss', cssTask).on('change', browserSync.reload)
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
exports.dev = gulp.series(htmlTask, cssTask)
exports.watch = watch
exports.default = gulp.series(htmlTask, cssTask, liveReload, watch)