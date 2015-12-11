var gulp = require('gulp');
var wt   = require('gulp-webtask');

gulp.task('deploy', function () {
  return gulp.src('./sync.js')
    .pipe(wt.create({
      token:   process.env.WEBTASK_TOKEN,
      name:    'sync',
      parse:   true,
      secrets: {
        S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
        S3_SECRET:     process.env.S3_SECRET,
        S3_BUCKET:     process.env.S3_BUCKET,
        S3_REGION:     process.env.S3_REGION,
      },
      params:  {
        user: 'jcenturion',
        repo: 'hawkeye-recipes',
        path: 'recipes'
      }
    }));
});
