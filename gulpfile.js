var runSequence = require('run-sequence');
var browserify = require('gulp-browserify');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var server = require('tiny-lr')();
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');
var chalk = require('chalk');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var react = require('gulp-react');
var rename = require('gulp-rename');
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
    .pipe(gulp.dest('client/public/script'));
});


// SASS
// ----------------------------------------------------------------------------
gulp.task('sass', function() {
  gulp.src('client/src/sass/**/*.scss')
    .pipe(
      sass({includePaths: ['client/src/sass', 'client/public/bower_components']})
        .on('error', error)
    )
    .pipe(gulp.dest('client/public/style'));
});	


// SERVER
// ----------------------------------------------------------------------------
gulp.task('server', function () {
  nodemon({
    script: 'server/server.js',
    options: '-e html,js -i client,node_modules,dist'
  }).on('error', error);
});

gulp.task('lrServe', function() {
  server.listen(35729, function(err){
    if(err) return console.log(err);
  });
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
  'react',
  'lrServe'
];

gulp.task('development', devTasks, function() {
  gulp.watch('client/src/sass/**/*.scss', ['sass']);
  gulp.watch('client/src/coffee/**/*.coffee', ['coffeeClient']); 
  gulp.watch('server/src/coffee/**/*.coffee', ['coffeeServer']); 
  gulp.watch('client/src/jsx/**/*.jsx', ['react']); 
  gulp.watch(['client/src/script/**/*.js', 'client/lib/**/*.js'],
    ['browserify']); 
    
});	
gulp.task('default', ['development']);


// BUILD
// ----------------------------------------------------------------------------
gulp.task('clean', function() {
  return gulp.src('./dist', {read: false, force: true})
    .pipe(clean());
});	

gulp.task('copy', function() {
  return gulp.src(['./client/public/**/*', './server/server.js',
    './server/lib/**/*.js'])  
    .pipe(gulp.dest('./dist'));
});	

gulp.task('usemin', function() {
  return gulp.src('./client/public/index.html') 
    .pipe(usemin())
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

