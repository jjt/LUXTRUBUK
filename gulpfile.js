var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var coffee = require('gulp-coffee');

gulp.task('coffee', function () {
  gulp.src('./coffee/**/*.coffee')
    .pipe(coffee({bare:true}).on('error', gulpUtil.log))
    .pipe(gulp.dest('./'))
});

gulp.task('default', function () {
  gulp.run('coffee'); 

  gulp.watch('./coffee/**/*.coffee', function () {
    gulp.run('coffee');
  });
})
