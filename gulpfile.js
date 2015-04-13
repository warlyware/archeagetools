// [Load gulp plugins]
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	browserify = require('gulp-browserify'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify')
	minifyJSON = require('gulp-jsonminify'),
	minifyHTML = require('gulp-minify-html'),
	minifyCSS = require('gulp-minify-css'),
	less = require('gulp-less'), 
	path = require('path'); //gulp-less dependency

//Declare variables
var env,
	jsSrc,
	dataSrc,
	htmlSrc,
	viewsSrc,
	lessSrc,
	cssSrc,
	imgSrc,
	outputDir;

//Create environment variable
env = process.env.NODE_ENV || 'dev';

if (env === 'dev') { //If env = def, we are in dev mode
	outputDir = 'builds/dev/'
} else { // Otherwise, we are in production mode
	outputDir = 'builds/production/'
}

// [Define sources]
jsSrc = ['components/scripts/*.js', 'components/scripts/**/*.js'];
dataSrc = ['components/data/*.json'];
indexSrc = ['components/*.html'];
viewsSrc = ['components/views/*.html'];
lessSrc = ['components/less/bootstrap.less'];
cssSrc = ['components/css/*.css'];
imgSrc = ['components/img/*.*'];

// [Gulp tasks]

//Process HTML
gulp.task('html', function() {
	gulp.src(indexSrc)
		.pipe(gulpif(env === 'production', minifyHTML()))  //If in production, minify...
		.pipe(gulp.dest(outputDir))  //Place in output dir
		.pipe(connect.reload())  //Reload page to reflect changes
});

//Process views
gulp.task('views', function() {
	gulp.src(viewsSrc)
//		.pipe(gulpif(env === 'production', minifyHTML()))  //If in production, minify...
		.pipe(gulp.dest(outputDir + '/views'))  //Place in production folder
		.pipe(connect.reload())  //Reload page to reflect changes
});

//Process JSON data
gulp.task('json', function() {
	gulp.src(dataSrc)
		.pipe(gulpif(env === 'production', minifyJSON()))  //If in production, minify
		.pipe(gulp.dest(outputDir + '/js/data'))  //Place in output dir
		.pipe(connect.reload())
});

//Process JavaScript
gulp.task('js', function() {
	gulp.src(jsSrc)
		.pipe(concat('script.js'))  //Combine all scripts into script.js
		.pipe(browserify())  //Inject required technologies
		.pipe(gulpif(env === 'production', uglify()))  //Minify JavaScript
		.pipe(gulp.dest(outputDir + '/js'))  //Place in ouput dir
		.pipe(connect.reload())  //Reload page to reflect changes
});
 
gulp.task('less', function () {
	gulp.src(lessSrc)
	    .pipe(less({
		    paths: [ path.join('build/dev/less', 'less', 'includes') ]
	    }))
		.pipe(gulp.dest(outputDir + '/css'))
		.pipe(connect.reload());
});

gulp.task('css', function() {
	gulp.src(cssSrc)
		.pipe(gulpif(env === 'production', minifyCSS()))  //If in production, minify...		
		.pipe(gulp.dest(outputDir + '/css'))  //Place in output dir
		.pipe(connect.reload())  //Reload page to reflect changes
});

gulp.task('img', function() {
	gulp.src(imgSrc)
		.pipe(gulp.dest(outputDir + '/img'))  //Place in output dir
		.pipe(connect.reload())  //Reload page to reflect changes
});

//Watch for any changes, update when dedected
gulp.task('watch', function() {
	gulp.watch(jsSrc, ['js']);
	gulp.watch(htmlSrc, ['html']);
	gulp.watch(dataSrc, ['json']);
	gulp.watch(viewsSrc, ['views']);
	gulp.watch(lessSrc, ['less']);
	gulp.watch(cssSrc, ['css']);
	gulp.watch(cssSrc, ['img']);	
});

//Connect task for livereload server
gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		host: '0.0.0.0',
// 		host: 'localhost',
		livereload: {
			enabled: true,
			port: '4002'			
		}
	});
});

//Declare default task
gulp.task('default', ['html', 'views', 'less', 'css', 'json', 'js', 'img', 'connect', 'watch']);