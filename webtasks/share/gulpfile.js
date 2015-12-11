var gulp = require('gulp');
var wt   = require('gulp-webtask');

gulp.task('deploy', function () {
  return gulp.src('./share.js')
    .pipe(wt.create({
      token:   process.env.WEBTASK_TOKEN,
      name:    'share',
      parse:   true,
      secrets: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN
      }
    }));
});
