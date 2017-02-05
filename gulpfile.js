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
var useref = require('gulp-useref'); // Разобраться и применить плагин для PRODACTION
var gulpif = require('gulp-if');
var wiredep = require('wiredep').stream; // Дописывает пути плагинов из BOWER в html
var uglify = require('gulp-uglify'); // Минификация JS
var concat = require('gulp-concat'); // Склейка файлов
var mainBowerFiles = require('gulp-main-bower-files'); // Вытаскивает пути к библиотекам Bower
var filter = require('gulp-filter'); // Фильт расширений
/* Переменные */
var reload  = browserSync.reload;

/* Пути файлов */
var config = {
  public: {
  	css: './public/css/',
  	html: './public/',
    js: './public/js/',
    bowerlib: './public/plugin/',
    images: './public/images/**/*.*'
  },
  source: {
  	scss: './source/scss/**/*.scss',
  	mainscss: './source/scss/main.scss',
  	html: './source/**/*.html',
    js: './source/js/*.js',
    images: './source/images/**/*.*',
   },

  clean: {
  	css: './public/css/main.css',
  	html: './public/*.html',
    js: './public/js/*.js',
    images: './public/images/**/*.*'
  }
};	

/*  BUILD  */




/* Таски */
/* BOWER */
gulp.task('bowerLib', function(){
	var jsFilter = filter('**/*.+(js|css) ', {restore: true})
		return gulp.src('bower.json')
	 .pipe(mainBowerFiles())
	 .pipe(jsFilter)
	 .pipe(notify('BOWER LIBS COPY OK!!!'))	 
     .pipe(gulp.dest(config.public.bowerlib));
})

gulp.task('bower', ['bowerLib'], function(){
	return gulp.src(config.source.html)
	.pipe(plumber())
	.pipe(wiredep({
    	directory: "./plugin"	
    }))
	.pipe(notify('BOWER INJECT OK!!!'))
    .pipe(gulp.dest("./source/"));
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
gulp.task('html', function(){
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
/* JS */
gulp.task('js', function(){
	return gulp.src(config.source.js)
		.pipe(plumber())
		.pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.public.js))
		.pipe(notify('Modify JS OK!!!'))
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
	gulp.watch(config.source.scss, ['css'])
	gulp.watch(config.source.html, ['html'])
	gulp.watch(config.source.js, ['js'])
	gulp.watch(config.source.images, ['image'])
	gulp.watch("bower.json", ['bower']);

})

gulp.task('default', ['watcher'], function(){

})