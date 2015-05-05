/**
 * Created by sirmonkey on 4/14/15.
 */
var changed    = require('gulp-changed');
var gulp       = require('gulp');
var config     = require('../config').vendor;

gulp.task('vendorjs', function() {
    return gulp.src(config.js.src)
        .pipe(changed(config.js.dest)) // Ignore unchanged files
        .pipe(gulp.dest(config.js.dest));
});

gulp.task('vendorcss', function() {
    return gulp.src(config.css.src)
        .pipe(changed(config.css.dest)) // Ignore unchanged files
        .pipe(gulp.dest(config.css.dest));
});