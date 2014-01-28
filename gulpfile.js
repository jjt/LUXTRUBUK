var livereload = require('gulp-livereload');
var browserify = require('gulp-browserify');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var coffee = require('gulp-coffee');
var react = require('gulp-react');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var chalk = require('chalk');
var sass = require('gulp-sass');
var gulp = require('gulp');
var _ = require('lodash');

var server = require('tiny-lr')();

// UTILITY FUNCTIONS
var error = function(err) {
  gutil.log(chalk.red.bold(err));
  return this;
}

// COFFEE
var coffeeTaskFn = function(src, dest) {
  return function() {
    gulp.src(src)
      .pipe(coffee({bare:true}).on('error', error))
      .pipe(gulp.dest(dest))
      .pipe(livereload(server));
  }
}
gulp.task('coffeeMain', coffeeTaskFn('src', './'));
gulp.task('coffeeClient', coffeeTaskFn('client/src/coffee/**/*.coffee', 'client'));
gulp.task('coffeeServer', coffeeTaskFn('server/src/coffee/**/*.coffee', 'server'));


// REACT JSX COMPILATION
gulp.task('react', function() {
  gulp.src('client/src/jsx/**/*.jsx')
    .pipe(react().on('error', error))
    .pipe(gulp.dest('client/src/script/components'))
    .pipe(livereload(server));
});	

// BROWSERIFY
gulp.task('browserify', function () {
  gulp.src('client/src/script/components/index.js') 
    .pipe(browserify({debug: true}).on('error', error))
    .pipe(gulp.dest('client/public/script'))
    .pipe(livereload(server));
});

// SASS COMPILATION
gulp.task('sass', function() {
  gulp.src('client/src/sass/**/*.scss')
    .pipe(
      sass({includePaths: ['client/src/sass', 'client/public/bower_components']})
        .on('error', error)
    )
    .pipe(gulp.dest('client/public/style'))
    .pipe(livereload(server));
});	

// BACKEND SERVER
gulp.task('server', function () {
  nodemon({script: 'server/server.js', options: '-e html,js -i client'})
    .on('error', error);
});

gulp.task('testClient', function() {
  gulp.src('client/test/spec/*.js')
    .pipe(mocha({reporter: 'dot'}).on('error', error));
});	

gulp.task('lrServe', function() {
  server.listen(35729, function(err){
    if(err) return console.log(err);
  });
});	

// Shortcut for
// gulp.watch(src, function() {
//   gulp.run(task);
//   gulp.run(task)
//   ...
// });
var gulpWatchRun = function(src, tasks) {
  if(!_.isArray(tasks))
    tasks = Array(tasks);
  return gulp.watch(src, function() {
    tasks.forEach(function(el){gulp.run(el)}); 
  }); 
}

// RUN IT ALL
gulp.task('default', function () {

  gulp.run('coffeeMain');
  gulp.run('coffeeServer');
  gulp.run('coffeeClient');
  gulp.run('sass');
  gulp.run('server');
  gulp.run('react');
  gulp.run('lrServe');

  gulpWatchRun('client/test/spec/*.js',
    'testClient'); 
  gulpWatchRun('client/src/sass/**/*.scss',
    'sass');
  gulpWatchRun('client/lib/*.js',
    'testClient');
  gulpWatchRun('client/src/coffee/**/*.coffee',
    ['coffeeClient', 'browserify']);
  gulpWatchRun('server/src/coffee/**/*.coffee',
    'coffeeServer');
  gulpWatchRun('client/src/jsx/**/*.jsx',
    'react');
  gulpWatchRun(['client/src/script/**/*.js', 'client/lib/**/*.js'],
    'browserify'); 
});
