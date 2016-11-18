/*globals require*/

var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var Server = require('karma').Server;

var path = {
    build: {
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/'
    },
    src: {
        js: [
            '!components/**/js/*.test.js',
            'components/global/js/libs/*.js',
            'components/global/js/global.js',
            'components/**/js/*.js'
        ],
        style: [
            'components/global/scss/_reset.scss',
            'components/global/scss/_vars.scss',
            'components/global/scss/app.scss',
            'components/**/scss/*.scss'
        ]
    },
    watch: {
        js: [
            '!components/**/js/*.test.js',
            'components/global/js/libs/*.js',
            'components/global/js/global.js',
            'components/**/js/*.js'
        ],
        style: [
            'components/global/scss/_reset.scss',
            'components/global/scss/_vars.scss',
            'components/global/scss/app.scss',
            'components/**/scss/*.scss'
        ]
    },
    clean: './build'
};

gulp.task('style:build', function() {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(concat('app.scss'))
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css));
});


gulp.task('scripts:build', function() {
    return gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js));
});

gulp.task('webserver:run', function() {
    browserSync({
        server: {
            baseDir: './'
        },
        tunnel: "tunnel12345"
    });
});

gulp.task('karma:test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('watch', function() {
    watch(path.watch.style, function() {
        gulp.start('style:build');
    });

    watch(path.watch.js, function() {
        gulp.start('scripts:build');
    });
});

gulp.task('default', ['style:build', 'scripts:build',  'watch']);
