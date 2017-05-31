var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var sync = require('browser-sync');
var jshint = require('gulp-jshint');
var del = require('del');
var refresh = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();

/*
Default task.
 */
gulp.task('default', ['clean', 'scripts']);

gulp.task('scripts', function () {
	return gulp.src(['js/**/*.js', '!js/**/*.min*'])
	    .pipe(jshint())
	    .pipe(jshint.reporter())
	    .pipe(concat('app.js'))
	    .pipe(uglify())
		.pipe(gulp.dest('build'))
	    .pipe(refresh(server))
});

/*
Starts a local server for live-reloading the changes
 */
gulp.task('lr-server', function() {
    server.listen(35729, function(err) {
        if(err) return console.log(err);
    });
})

/*
Deletes the build directory
 */
gulp.task('clean', function () {
	del('build/');
})