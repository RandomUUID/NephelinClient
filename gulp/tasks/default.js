var gulp = require('gulp');

gulp.task('default', ['markup','browserify', 'vendorjs', 'vendorcss', 'css', 'images']);