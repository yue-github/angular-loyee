var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var concat = require('gulp-concat');

gulp.task('build-less', function(){
	gulp.src('styles/*.less')
		.pipe(rename({suffix: '.min'}))
		.pipe(less({ compress: true }))
		.on('error', function(e){console.log(e);} )
		.pipe(gulp.dest('css/'));
});

gulp.task('build-js', function() {
    gulp.src(['route.js', './controllers/*.js'])
		.pipe(concat('app.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});

gulp.task('default', function() {
	gulp.start('build-less', 'build-js');
});