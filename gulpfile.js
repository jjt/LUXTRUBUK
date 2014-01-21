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
var lr = require('tiny-lr');
var _ = require('lodash');

var server = lr();

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


// RUN IT ALL
gulp.task('default', function () {

  gulp.run('coffeeMain');
  gulp.run('coffeeServer');
  gulp.run('coffeeClient');
  gulp.run('sass');
  gulp.run('server');
  gulp.run('react');

  server.listen(35729, function(err){
    if(err) return console.log(err);
  });


  gulp.watch('client/test/spec/*.js', function() {
    gulp.run('testClient');
  }); 

  gulp.watch('client/src/sass/**/*.scss', function() {
    gulp.run('sass')
  }); 

  gulp.watch('client/lib/*.js', function() {
    gulp.run('testClient') 
  }); 

  gulp.watch('client/src/coffee/**/*.coffee', function () {
    gulp.run('coffeeClient');
    gulp.run('browserify');
  });
  
  gulp.watch('server/src/coffee/**/*.coffee', function () {
    gulp.run('coffeeServer');
  });

  gulp.watch('client/src/jsx/**/*.jsx', function() {
    gulp.run('react');
  });  

  gulp.watch(['client/src/script/**/*.js', 'client/lib/**/*.js'], function() {
    gulp.run('browserify'); 
  }); 
});
