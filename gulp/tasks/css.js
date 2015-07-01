"use strict";
/**
 * Created by loeb on 21.04.2015.
 */
var config     = require('../config').css;
var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-ruby-sass');

gulp.task('css', function() {
    return sass(config.src + '/nephelin.scss')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(config.dest));
});
