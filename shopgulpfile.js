var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var concat = require('gulp-concat');


gulp.task('build-js', function() {
    gulp.src(['shoproute.js', './controllers/controllers/*.js'])
		.pipe(concat('shopapp.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});

gulp.task('default', function() {
	gulp.start('build-js');
});