var gulp           = require('gulp');
var connect        = require('gulp-connect');
var jsxcs          = require('gulp-jsxcs');
var jshint         = require('gulp-jshint');
var stylish        = require('jshint-stylish');
var nodemon        = require('gulp-nodemon');
var livereload     = require('gulp-livereload');

var jscs           = require('gulp-jscs');
var stylishJscs    = require('gulp-jscs-stylish');
var jshint         = require('gulp-jshint');
var stylish        = require('jshint-stylish');

gulp.task('lint-jsx', function () {
  return gulp.src(['app/public/scripts/**/*.jsx'])
    .pipe(jshint({ linter: require('jshint-jsx').JSXHINT }))
    .pipe(jshint.reporter(stylish, { verbose: true }));
});

gulp.task('jscs-jsx', function() {
  return gulp.src(['app/public/scripts/**/*.jsx'])
    .pipe(jsxcs());
});

gulp.task('lint', function () {
  return gulp.src(['app/**/*.js', '!app/public/**/*.jsx'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish, { verbose: true }))
});

gulp.task('jscs', function() {
  return gulp.src(['app/**/*.js', '!app/public/**/*.jsx'])
    .pipe(jscs())
    .on('error', function () {})
    .pipe(stylishJscs());
});

gulp.task('serve', function(){
  return nodemon({
    script: './app/app.js',
    env:    { 'NODE_ENV': 'development' },
    tasks:  ['lint', 'jscs']
  });
});

gulp.task('client', ['jscs-jsx', 'lint-jsx'], function () {
  return gulp.src(['app/public/scripts/**/*.jsx'])
    .pipe(livereload());
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(['./app/public/scripts/**/*.*'], ['client']);
});

gulp.task('default', ['lint', 'jscs', 'jscs-jsx', 'lint-jsx', 'serve', 'watch']);
