var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var coffee = require('gulp-coffee');
var nodemon = require('gulp-nodemon');
var react = require('gulp-react');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

var coffeeTaskFn = function(src, dest) {
  return function() {
    gulp.src(src)
      .pipe(coffee({bare:true}).on('error', gulpUtil.log))
      .pipe(gulp.dest(dest))
  }
}

gulp.task('coffeeMain', coffeeTaskFn('src', './'));
gulp.task('coffeeClient', coffeeTaskFn('client/src/coffee/**/*.coffee', 'client'));
gulp.task('coffeeServer', coffeeTaskFn('server/src/coffee/**/*.coffee', 'server'));

gulp.task('react', function() {
  gulp.src('client/src/jsx/**/*.jsx')
    .pipe(react())
    .pipe(gulp.dest('client/src/script/components'))
});	

gulp.task('browserify', function () {
  gulp.src('client/src/script/components/index.js') 
    .pipe(browserify({debug: true}))
    .pipe(gulp.dest('client/public/script'))
});

gulp.task('server', function () {
  nodemon({script: 'server/server.js', options: '-e html,js'})
});

gulp.task('default', function () {
  gulp.run('coffeeMain');
  gulp.run('coffeeServer');
  gulp.run('coffeeClient');
  gulp.run('server');

  gulp.run('react');

  gulp.watch('client/src/coffee/**/*.coffee', function () {
    gulp.run('coffeeClient');
    gulp.run('browserify')
  });
  
  gulp.watch('server/src/coffee/**/*.coffee', function () {
    gulp.run('coffeeServer');
  });

  gulp.watch('client/src/jsx/**/*.jsx', function() {
    gulp.run('react');
    gulp.run('browserify');
  });  

  //gulp.watch(['client/src/**/*.js',
    //'lib/**/*.js',
    //'client/lib/**/*.js',
    //],
    //function() {
      //gulp.run('browserify');
    //}
  //); 
});
