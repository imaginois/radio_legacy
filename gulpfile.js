var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var del = require('del');
var Server = require('karma').Server;

/*
Default task.
 */
gulp.task('default', ['test', 'clean', 'scripts']);

gulp.task('scripts', function () {
	return gulp.src(['js/**/*.js', '!js/**/*.min*'])
	    .pipe(jshint())
	    .pipe(jshint.reporter())
	    .pipe(concat('app.js'))
	    .pipe(uglify())
		.pipe(gulp.dest('build'))
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  return new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

/*
Deletes the build directory
 */
gulp.task('clean', function () {
	del('build/');
})