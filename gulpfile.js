var gulp        = require('gulp');
var connect     = require('gulp-connect');
var jsxcs       = require('gulp-jsxcs');
var jshint      = require('gulp-jshint');
var stylish     = require('jshint-stylish');

gulp.task('lint', function () {
  return gulp.src(['app/**/*.jsx'])
    .pipe(jshint({ linter: require('jshint-jsx').JSXHINT }))
    .pipe(jshint.reporter(stylish, { verbose: true }))
});

gulp.task('jscs', function() {
  return gulp.src(['app/**/*.jsx'])
    .pipe(jsxcs());
});

gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true
  });
});

gulp.task('src', function () {
  gulp.src('./app/**/*.*')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/**/*.*'], ['src', 'jscs', 'lint']);
});

gulp.task('default', ['jscs', 'lint', 'connect', 'watch']);
