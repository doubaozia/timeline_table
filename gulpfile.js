/**
 * timeline_table
 *
 * doudou
 *
 * Copyright (c) 2017
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var css = require('gulp-mini-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var cssMap = [{
  src: [ './src/*.css', '!./src/*.min.css' ],
  dest: './dist/css/'
}];

var jsMap = [{
  src: [ './src/*.js', '!./src/*.min.js' ],
  dest: './dist/js/'
}];

gulp.task('css', function() {
  for (var i = 0; i < cssMap.length; i++) {
  (function (p) {
    gulp.src(p.src)
      .pipe(autoprefixer({
        browsers: [ '> 1%' ],
        cascade: false
      }))
      .pipe(css({
        ext: '.min.css'
      }))
      .pipe(gulp.dest(p.dest));
  })(cssMap[i]);
}
});

gulp.task('js', function() {
  for (var i = 0; i < jsMap.length; i++) {
  (function (p) {
    gulp.src(p.src)
      .pipe(uglify())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest(p.dest));
  })(jsMap[i]);
}
});

gulp.task('default', [ 'css', 'js' ]);