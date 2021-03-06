'use strict'

const gulp = require('gulp')
const handlebars = require('gulp-compile-handlebars')
const ext = require('gulp-ext-replace')
const htmlmin = require('gulp-htmlmin')
const less = require('gulp-less')
const cssnano = require('gulp-cssnano')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const browserSync = require('browser-sync').create()
const sequence = require('gulp-sequence')

let compileTo = 'dev'
let loginURL = 'http://localhost:3000/auth/facebook'
let apiURL = 'http://localhost:3000/'

gulp.task('hbs', function() {
  let data = {}
  let options = {
    ignorePartials: true,
    batch: ['./src/partials'],
    helpers: {
      appurl: function() {
        return loginURL
      },
      apiurl: function () {
        return apiURL
      },
      currentYear: function() {
        let dt = new Date()
        return dt.getFullYear()
      }
    }
  }
  return gulp.src('src/contents/*.hbs')
    .pipe(handlebars(data, options))
    .pipe(ext('.html'))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./' + compileTo))
    .pipe(browserSync.stream());
})

gulp.task('modernizer', function() {
  return gulp.src('./vendor/modernizr/modernizr.min.js')
    .pipe(gulp.dest('./'+compileTo+'/js'));
})

gulp.task('firebase', function() {
  return gulp.src('./src/firebase.js')
    .pipe(gulp.dest('./' + compileTo + '/js'));
})

gulp.task('scripts', function() {
  return gulp.src([
    './vendor/jquery/jquery.min.js',
    './vendor/jquery.appear/jquery.appear.min.js',
    './vendor/jquery.easing/jquery.easing.min.js',
    './vendor/bootstrap/js/bootstrap.min.js',
    './vendor/common/common.min.js',
    './vendor/jquery.lazyload/jquery.lazyload.min.js',
    './vendor/isotope/jquery.isotope.min.js',
    './vendor/owl.carousel/owl.carousel.min.js',
    './js/theme.js',
    './vendor/rs-plugin/js/jquery.themepunch.tools.min.js',
    './vendor/rs-plugin/js/jquery.themepunch.revolution.min.js',
    './js/theme.init.js',
    './js/apps.js'
  ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'+compileTo+'/js'))
    .pipe(browserSync.stream());
})

gulp.task('prospekscript', function () {
  return gulp.src('./js/prospects.js')
    .pipe(concat('sheet.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'+compileTo+'/js'))
    .pipe(browserSync.stream());
})

gulp.task('less', function() {
  return gulp.src('styles/app.less')
    .pipe(less())
    .pipe(cssnano())
    .pipe(gulp.dest('./'+compileTo+'/css'))
    .pipe(browserSync.stream());
})

gulp.task('fonts', function() {
  return gulp.src('./fonts/**/*')
    .pipe(gulp.dest('./'+compileTo+'/fonts'))
})

gulp.task('img', function() {
  return gulp.src('./img/**/*')
    .pipe(gulp.dest('./'+compileTo+'/img'))
})

gulp.task('indexpage', function () {
  return gulp.src('./js/index.js')
    .pipe(concat('index.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'+compileTo+'/js'))
})

gulp.task('dev', ['hbs', 'less', 'modernizer', 'scripts', 'prospekscript', 'fonts', 'img', 'firebase', 'indexpage'], function() {
  browserSync.init({
    server: { baseDir: './' + compileTo },
    ui: { port: 3031 },
    port: 3030
  });

  gulp.watch('src/**/*.hbs', ['hbs'])
  gulp.watch('styles/app.less', ['less'])
  gulp.watch('js/apps.js', ['scripts'])
  gulp.watch('js/prospects.js', ['prospekscript'])
  gulp.watch('js/index.js', ['indexpage'])
})

gulp.task('staging', function(cb) {
  compileTo = 'dev'
  loginURL = 'https://devapi.bizsaya.com/auth/facebook'
  return sequence(['hbs', 'less', 'modernizer', 'firebase', 'scripts', 'prospekscript', 'fonts', 'img', 'indexpage'], cb)
})

gulp.task('build', function(cb) {
  compileTo = 'dist'
  loginURL = 'https://api.bizsaya.com/auth/facebook'
  apiURL = 'https://api.bizsaya.com/'
  return sequence(['hbs', 'less', 'modernizer', 'scripts', 'prospekscript', 'firebase', 'fonts', 'img', 'indexpage'], cb)
})