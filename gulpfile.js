/* Подключение компонентов */
var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob'); // Инклюдим все файлы SCSS 
var cssnano = require('gulp-cssnano'); // Минификатор CSS
var image = require('gulp-image'); // Оптимизация картинок
var htmlExtend = require('gulp-html-extend'); // Склеивание HTML блоков
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var browserSync = require('browser-sync');
var useref = require('gulp-useref').stream;
var gulpif = require('gulp-if');

/* Переменные */
var reload  = browserSync.reload;

/* Пути файлов */
var config = {
  public: {
  	css: './public/css/',
  	html: './public/',
    js: './public/js/',
    images: './public/images/**/*.*'
  },
  source: {
  	scss: './source/scss/**/*.scss',
  	mainscss: './source/scss/main.scss',
  	html: './source/**/*.html',
    js: './source/js/*.js',
    images: './source/images/**/*.*',
    plugin: './source'
  },

  clean: {
  	css: './public/css/main.css',
  	html: './public/*.html',
    js: './public/js/*.js',
    images: './public/images/**/*.*'
  }
};	



/* Таски */
/* BOWER */
gulp.task('bower', function(){
	return gulp.src()
        .pipe(useref())
        .pipe(gulp.dest(config.source.html));
})

/* BROWSER SYNC*/
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: "./public/"
    },
    port: 8080,
    open: true,
    notify: true
  });
});

/* HTML*/
gulp.task('html', ['bower'], function(){
	return gulp.src(config.source.html)
	.pipe(plumber())
	.pipe(htmlExtend())
	.pipe(gulp.dest(config.public.html))
	.pipe(plumber.stop())
	.pipe(notify('HTML OK!!!'))
	.pipe(reload({stream:true}));
})

/*  SCSS and CSS and Modify */
gulp.task('css', function(){
	return gulp.src(config.source.mainscss)
	.pipe(plumber())
	.pipe(sassGlob())
	.pipe(sass())
	.pipe(autoprefixer({
		browsers: ['last 3 versions'],
		cascade: false
	}))
	.pipe(gulp.dest(config.public.css))
	.pipe(notify('CSS OK!!!'))
	.pipe(cssnano())
	.pipe(rename('style.min.css'))
	.pipe(plumber.stop())
	.pipe(gulp.dest(config.public.css))
	.pipe(notify('Modify-CSS OK!!!'))
	.pipe(reload({stream:true}));
})


/* IMAGE */

gulp.task('image', function(){
	return gulp.src(config.source.images)
	.pipe(plumber())
	.pipe(image())
	.pipe(plumber.stop())
	.pipe(gulp.dest(config.public.images))
	//.pipe(reload({stream:true}));
})


/* WATCH */
gulp.task('watcher', ['browserSync'], function(){
	gulp.watch(config.source.scss, ['css']);
	gulp.watch(config.source.html, ['html']);

})

gulp.task('default', ['watcher'], function(){

})