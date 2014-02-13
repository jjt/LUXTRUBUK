var runSequence = require('run-sequence');
var browserify = require('gulp-browserify');
var livereload = require('gulp-livereload');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var nodemon = require('gulp-nodemon');
var coffee = require('gulp-coffee');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');
var chalk = require('chalk');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var react = require('gulp-react');
var watch = require('gulp-watch');
var gulp = require('gulp');
var sass = require('gulp-sass');
var _ = require('lodash');


// UTILITY FUNCTIONS
// ----------------------------------------------------------------------------
var error = function(err) {
  gutil.log(chalk.red.bold(err));
  return this;
}


// COFFEE
// ----------------------------------------------------------------------------
var coffeeTaskFn = function(src, dest) {
  return function() {
    return gulp.src(src)
      .pipe(coffee({bare:true}).on('error', error))
      .pipe(gulp.dest(dest));
  }
}
gulp.task('coffeeMain', coffeeTaskFn('src', './'));
gulp.task('coffeeClient', coffeeTaskFn('client/src/coffee/**/*.coffee',
  'client'));
gulp.task('coffeeServer', coffeeTaskFn('server/src/coffee/**/*.coffee',
  'server'));


// REACT JSX COMPILATION
// ----------------------------------------------------------------------------
gulp.task('react', function() {
  return gulp.src('client/src/jsx/**/*.jsx')
    .pipe(react().on('error', error))
    .pipe(gulp.dest('client/src/script/components'));
});	


// BROWSERIFY
// ----------------------------------------------------------------------------
gulp.task('browserify', function () {
  return gulp.src('client/src/script/components/index.js') 
    .pipe(browserify({debug: true}).on('error', error))
    .pipe(rename('luxtrubuk.js'))
    .pipe(gulp.dest('client/public/script'))
    .pipe(livereload());
});


// SASS
// ----------------------------------------------------------------------------
gulp.task('sass', function() {
  gulp.src('client/src/sass/**/*.scss')
    .pipe(
      sass({includePaths: ['client/src/sass', 'client/public/bower_components']})
        .on('error', error)
    )
    .pipe(gulp.dest('client/public/style'))
    .pipe(livereload());
});	


// SERVER
// ----------------------------------------------------------------------------
gulp.task('server', function () {
  nodemon({
    script: 'server/server.js',
    options: '-e html,js -i \'client/**/*,node_modules/**/*,dist/**/*\''
  }).on('error', error);
});


// TESTING
// ----------------------------------------------------------------------------
gulp.task('testClient', function() {
  gulp.src('client/test/spec/*.js')
    .pipe(mocha({reporter: 'dot'}).on('error', error));
});	


// DEVELOPMENT (default task)
// ----------------------------------------------------------------------------
var devTasks = [
  'coffeeMain',
  'coffeeServer',
  'coffeeClient',
  'sass',
  'server',
  'react'
];

gulp.task('development', devTasks, function() {
  var server = livereload();
  gulp.watch('client/src/sass/**/*.scss', ['sass']);
  gulp.watch('client/src/coffee/**/*.coffee', ['coffeeClient']); 
  gulp.watch('server/src/coffee/**/*.coffee', ['coffeeServer']); 
  gulp.watch('client/src/jsx/**/*.jsx', ['react']); 
  gulp.watch(['client/src/script/**/*.js', 'client/lib/**/*.js'],
    ['browserify']); 
  gulp.watch(['client/public/index.html', 'client/public/style/**/*.css',
    'client/public/script/**/*.js'], function (evt) {
    server.changed(evt.path);
  }); 
  return server;    
});	
gulp.task('default', ['development']);


// BUILD
// ----------------------------------------------------------------------------
gulp.task('clean', function() {
  return gulp.src('./dist/*', {read: false, force: true})
    .pipe(clean());
});	

gulp.task('copy', function() {
  return gulp.src(['./client/public/**/*', './server/**/*.js', './Procfile',
    './package.json'])  
    .pipe(gulp.dest('./dist'));
});	

gulp.task('usemin', function() {
  return gulp.src('./client/public/index.html') 
    .pipe(usemin({
      rev: true,
      cssmin: minifyCss(),
      htmlmin: minifyHtml(),
      jsmin: uglify()
    }))
    .pipe(gulp.dest('./dist'));
});	

gulp.task('build', function(cb) {
  runSequence(
    ['coffeeServer', 'coffeeClient', 'coffeeMain', 'sass', 'react'],
    'browserify',
    'clean',
    'copy',
    'usemin',
    cb
  );  
});
