'use strict';

var gulp = require('gulp'),
	browserify = require('browserify'),
	uglify = require('gulp-uglify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	rename = require('gulp-rename'),
	gulpif = require('gulp-if'),
	sass = require('gulp-sass'),
	pug = require('gulp-pug'),
	copy = require('gulp-copy'),
	sourcemaps = require('gulp-sourcemaps'),
	header = require('gulp-header'),
	isSourcemaps = require('minimist')(process.argv.slice(2)).sourcemaps,
	appVersion = require('./package.json').version;


// LIB
gulp.task('build', function() {
	return browserify({ entries: 'standalone.js', debug: isSourcemaps }).bundle()
		.pipe(source('./granim.js'))
		.pipe(buffer())
		.pipe(gulpif(!isSourcemaps, header('/*! Granim v' + appVersion + ' - https://sarcadass.github.io/granim.js */\n')))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('buildMin', gulp.series('build', function() { 
	return gulp.src('./dist/granim.js')
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify({ preserveComments: 'license' }))
		.pipe(gulp.dest('./dist/'));
}));

gulp.task('docDist', gulp.series('buildMin', function() {
	return gulp.src('./dist/granim.min.js')
		.pipe(copy('./docs/assets/js/vendor/', { prefix: 1 }));
}));


// DOC
gulp.task('buildDoc:html', function() {
	return gulp.src('./docs/assets/pug/*.pug')
		.pipe(pug({
			pretty: false,
			locals: require('./package.json')
		}))
		.pipe(gulp.dest('./docs/'));
});

gulp.task('buildDoc:js', function() {
	return browserify({ entries: './docs/assets/js/app/index.js', debug: isSourcemaps }).bundle()
		.pipe(source('./index.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rename('script.js'))
		.pipe(gulp.dest('./docs/assets/js/'));
});

gulp.task('buildDoc:css', function() {
	return gulp.src('./docs/assets/css/scss/index.scss')
		.pipe(gulpif(isSourcemaps, sourcemaps.init({ loadMaps: true })))
		.pipe(sass({ outputStyle: 'compressed' })
			.on('error', sass.logError)
		)
		.pipe(gulpif(isSourcemaps, sourcemaps.write({ includeContent: true })))
		.pipe(rename('style.css'))
		.pipe(gulp.dest('./docs/assets/css/'));
});


// TASKS
	// lib
gulp.task('default', gulp.series('docDist'));

gulp.task('watch', gulp.series('default', function() {
	gulp.watch('./lib/**/*.js', gulp.series('default'))
}));

	// doc
gulp.task('buildDoc', gulp.series(['buildDoc:html', 'buildDoc:js', 'buildDoc:css']));

gulp.task('watchDoc', gulp.series('buildDoc', function() {
	gulp.watch('./docs/assets/pug/**/*', gulp.series('buildDoc:html'));
	gulp.watch('./docs/assets/js/app/**/*', gulp.series('buildDoc:js'));
	gulp.watch('./docs/assets/css/scss/**/*', gulp.series('buildDoc:css'));
}));
