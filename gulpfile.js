var gulp        = require('gulp');
var connect     = require('gulp-connect');
var jsxcs       = require('gulp-jsxcs');
var jshint      = require('gulp-jshint');
var stylish     = require('jshint-stylish');
var exec        = require('gulp-exec');

gulp.task('lintx', function () {
  return gulp.src(['app/**/*.js'])
    .pipe(jshint({ linter: require('jshint-jsx').JSXHINT }))
    .pipe(jshint.reporter(stylish, { verbose: true }))
});

gulp.task('jscsx', function() {
  return gulp.src(['app/**/*.js'])
    .pipe(jsxcs());
});

gulp.task('watchify', function () {
  var options = {
    continueOnError: false,
    pipeStdout: false
  };
  var reportOptions = {
    err:    true,
    stderr: true,
    stdout: true
  };

  gulp.src('./public/**/*.*')
    .pipe(exec('npm start'))
    .pipe(exec.reporter(reportOptions));
});

gulp.task('connect', function() {
  connect.server({
    root: 'public',
    livereload: true,
    port: 3000
  });
});

gulp.task('src', function () {
  gulp.src('./public/**/*.*')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./public/**/*.*'], ['lintx', 'jscsx', 'src']);
});

gulp.task('default', ['watchify', 'connect', 'watch']);
