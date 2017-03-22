// set up Gulp to require plugins and define them
'use strict'

const browserSync  = require('browser-sync').create();
const reload       = browserSync.reload;
const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel        = require('gulp-babel');
const cleanCSS     = require('gulp-clean-css');
const concat       = require('gulp-concat');
const imageMin     = require('gulp-imagemin');
const notify       = require('gulp-notify');
const plumber      = require('gulp-plumber');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const uglify       = require('gulp-uglify');

// set up Browser Sync task
gulp.task('browser-sync', () => {
	browserSync.init({
		// create local server and work in root of project folder
		server: {
			baseDir: '.'
		}
	})
});

// set up CSS / Sass task
gulp.task('styles', () => {
	return gulp.src('dev/styles/**/*.scss')
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
		.pipe(cleanCSS())
		.pipe(concat('style.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/styles'))
		.pipe(reload({
			stream: true
		}));
});

// set up JS task
gulp.task('scripts', () => {
	return gulp.src('dev/scripts/main.js')
		.pipe(plumber({
		  errorHandler: notify.onError("Error: <%= error.message %>")
		}))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(gulp.dest('public/scripts'))
		.pipe(reload({
			stream: true
		}));
});

// set up Minify Images task
gulp.task('images', () => {
	return gulp.src('dev/images/**/*')
		.pipe(imageMin())
		.pipe(gulp.dest('public/images'));
});

// set up our Watch task
gulp.task('watch', () => {
	gulp.watch('dev/styles/**/*.scss', ['styles']);
	gulp.watch('dev/scripts/**/*.js', ['scripts']);
	gulp.watch('dev/images/**/*', ['images']);
	gulp.watch('**/*.html', reload);
});

gulp.task('default', ['browser-sync', 'styles', 'scripts', 'images', 'watch']);