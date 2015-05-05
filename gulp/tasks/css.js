/**
 * Created by loeb on 21.04.2015.
 */
var config     = require('../config').css;
var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');

gulp.task('css', function() {
    return gulp.src(config.src)
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(config.dest));
});
