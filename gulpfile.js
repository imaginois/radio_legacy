var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gulpDocumentation = require('gulp-documentation');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var del = require('del');
var Server = require('karma').Server;
var browserSync = require('browser-sync').create();
var shell = require('gulp-shell')


/*
Default task.
 */
gulp.task('default', ['test', 'clean', 'scripts', 'docs']);
gulp.task('docs', ['docs-md', 'docs-html']);
gulp.task('watch', ['tdd', 'browser-sync']);

gulp.task('fakeApi', shell.task([
  'json-server api/vstb.json --port=6002',
  'echo world'
]))

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
Watch for file changes and reload the browser
 */
gulp.task('browser-sync', function() {
    browserSync.init({
        // host: "radio.local",
        proxy: "radio.local",
        open: false,
        files: [
          '*.html', 
          'css/**/*.css', 
          'js/**/*.js'
        ]
    });
    // gulp.watch("js/**/*.js").on('change', browserSync.reload);
});

/*
Generating docs
 */
gulp.task('docs-html', function () {
  // Generating README documentation
  return gulp.src(['js/**/*.js', '!js/lib/*.js'])
    .pipe(gulpDocumentation('html'))
    .pipe(gulp.dest('docs'));
});

gulp.task('docs-md', function () {
  // Generating README documentation
  return gulp.src(['js/**/*.js', '!js/lib/*.js'])
    .pipe(gulpDocumentation('md'))
    .pipe(gulp.dest('.'));
});

/*
Deletes the build directory
 */
gulp.task('clean', function () {
	del('build/');
})