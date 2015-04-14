/**
 * Created by sirmonkey on 4/14/15.
 */
var changed    = require('gulp-changed');
var gulp       = require('gulp');
var config     = require('../config').vendor;

gulp.task('vendor', function() {
    return gulp.src(config.src)
        .pipe(changed(config.dest)) // Ignore unchanged files
        .pipe(gulp.dest(config.dest));
});