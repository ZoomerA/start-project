/* Подключение компонентов */
var gulp = require('gulp');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob'); // Инклюдим все файлы SCSS 
var cssnano = require('gulp-cssnano'); // Минификатор CSS
var uncss = require('gulp-uncss'); // Удаляет все неиспользуемые CSS классы 
var image = require('gulp-image'); // Оптимизация картинок
var htmlExtend = require('gulp-html-extend'); // Склеивание HTML блоков
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var notify = require('gulp-notify'); // отлов ошибок
var jshint = require('gulp-jshint'); // Проверка JS на ошибки
var jshintStylish = require('jshint-stylish'); // Визуализация ошибок для плагина  gulp-jshint
var browserSync = require('browser-sync');
var useref = require('gulp-useref'); // Разобраться и применить плагин для PRODACTION
var gulpif = require('gulp-if');
var wiredep = require('wiredep').stream; // Дописывает пути плагинов из BOWER в html
var uglify = require('gulp-uglify'); // Минификация JS
var concat = require('gulp-concat'); // Склейка файлов
var mainBowerFiles = require('gulp-main-bower-files'); // Вытаскивает пути к библиотекам Bower
var filter = require('gulp-filter'); // Фильт расширений
var gutil = require('gulp-util'); // Вспомогательный плагин 
var chalk = require('chalk'); // Плагин для красивого вывода в консоль
var plumber = require('gulp-plumber');

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
    js: './source/js/**/*.js',
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

/* DELATE */
gulp.task('delBowerLib', function(){ 
	return gulp.src(config.public.bowerlib)
	.pipe(clean())	// Очищаем папку с подключенными библиотеками
	.pipe(notify('BOWER LIBS DELATE OK!!!'));
})

/* BOWER */
gulp.task('bowerLib', ['delBowerLib'], function(){ 
	var jsFilter = filter('**/*.+(js|css) ', {restore: true}) // Отфильтровываем JS CSS
	return gulp.src('bower.json') // Читаем подключенные модули в BOWER
	 .pipe(mainBowerFiles()) // Вытаскиваем пути файлов
	 .pipe(jsFilter) // Фильтруем 
	 .pipe(notify('BOWER LIBS COPY OK!!!'))	 
     .pipe(gulp.dest(config.public.bowerlib)); // Записываем в паблик библиотеки из BOWER
})

gulp.task('bower', ['bowerLib'], function(){
	return gulp.src(config.source.html)
	.pipe(plumber())
	.pipe(wiredep({				// Читаем пути библиотек BOWER
    	directory: "./plugin"	
    }))
	.pipe(notify('BOWER INJECT OK!!!'))
    .pipe(gulp.dest("./source/")); // Записываем пути BOWER в файл HTML
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
	.pipe(htmlExtend())
	.pipe(gulp.dest(config.public.html))
	.pipe(notify(chalk.bgGreen.green.bold('HTML OK!!!')))
	.pipe(reload({stream:true}));
})

/*  SCSS and CSS and Modify */
gulp.task('css', function(){
	return gulp.src(config.source.mainscss)
	.pipe(sassGlob())
	.pipe(sass()
		.on('error', notify.onError(function(error){
			return "Message to the notifier: " + error.message;
		}))
	)
	.pipe(autoprefixer({
		browsers: ['last 3 versions'],
		cascade: false
	}))
	.pipe(gulp.dest(config.public.css))
	.pipe(notify(chalk.bgGreen.white.bold('CSS OK!!!')))
	.pipe(cssnano()) // жимаем CSS
	.pipe(rename('style.min.css'))
	.pipe(gulp.dest(config.public.css))
	.pipe(notify(chalk.bgGreen.white.bold('Modify-CSS OK!!!')))
	.pipe(reload({stream:true}));
})
/* JS */
gulp.task('js', function(){
	return gulp.src(config.source.js)
	.pipe(plumber())  // Проверяем на ошибки
	.pipe(jshint())   // Проверяем на ощибки
	.pipe(jshint.reporter('jshint-stylish')) // Визуализация ошибок
	.pipe(concat('main.js')) // Соединяем файлы в один
	.pipe(gulp.dest(config.public.js))
    .pipe(uglify({  		// Сжимаем файл
    	comments : false
    }))			 // Минификация
    .pipe(rename('main.min.js')) // Переименовываем
    .pipe(gulp.dest(config.public.js))
	.pipe(notify(chalk.bgGreen.green.bold('Modify JScript OK!!!')))
	.pipe(reload({stream:true}));
})

/* IMAGE */

gulp.task('image', function(){
	return gulp.src(config.source.images)
	.pipe(image())
	.pipe(gulp.dest(config.public.images))
	.pipe(reload({stream:true}));
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

var alarm = chalk.bgRed.white.bold('ALARM!!!');


gulp.task('color', function(){
	/*var i = 1
	 for(var i in gutil)
    console.log('gutil[' + i + '] = ' + gutil[i])*/
	
	gutil.file = 'one.js'

	//return gulp.src(config.source.js)
	//gutil.template('<%= file.path %');


	
})