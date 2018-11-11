'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var copy = require('gulp-copy');
var eslint = require('gulp-eslint');
var sourcemaps = require('gulp-sourcemaps');
var header = require('gulp-header');
var isSourcemaps = require('minimist')(process.argv.slice(2)).sourcemaps;
var appVersion = require('./package.json').version;


// LIB
gulp.task('lint', function() {
	return gulp.src('./lib/*.js').pipe(eslint())
		.pipe(eslint.format())
		// Brick on failure to be super strict
		.pipe(eslint.failOnError());
});

gulp.task('build', gulp.series('lint',function() {
	return browserify({ entries: 'standalone.js', debug: isSourcemaps }).bundle()
		.pipe(source('./granim.js'))
		.pipe(buffer())
		.pipe(gulpif(!isSourcemaps, header('/*! Granim v' + appVersion + ' - https://sarcadass.github.io/granim.js */\n')))
		.pipe(gulp.dest('./dist/'));
}));

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
//// lib
gulp.task('default', gulp.series('docDist'));

gulp.task('watch', gulp.series('default', function() {
	gulp.watch('./lib/**/*.js', gulp.series('default'))
}));

//// doc
gulp.task('buildDoc', gulp.series(['buildDoc:html', 'buildDoc:js', 'buildDoc:css']));

gulp.task('watchDoc', gulp.series('buildDoc', function() {
	gulp.watch('./docs/assets/pug/**/*', gulp.series('buildDoc:html'));
	gulp.watch('./docs/assets/js/app/**/*', gulp.series('buildDoc:js'));
	gulp.watch('./docs/assets/css/scss/**/*', gulp.series('buildDoc:css'));
}));
