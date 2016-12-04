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

gulp.task('hbs', function() {

  let data = {

  }

  let options = {
    ignorePartials: true,
    batch: ['./src/partials'],
    helpers: {

    }
  }

  return gulp.src('src/contents/*.hbs')
    .pipe(handlebars(data, options))
    .pipe(ext('.html'))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());

})

gulp.task('modernizer', function() {

  return gulp.src('./vendor/modernizr/modernizr.min.js')
    .pipe(gulp.dest('./dist/js'))

})

gulp.task('scripts', function() {

  return gulp.src([
    './vendor/jquery/jquery.min.js',
    './vendor/jquery.appear/jquery.appear.min.js',
    './vendor/jquery.easing/jquery.easing.min.js',
    './vendor/jquery-cookie/jquery-cookie.min.js',
    './vendor/bootstrap/js/bootstrap.min.js',
    './vendor/common/common.min.js',
    // './vendor/jquery.validation/jquery.validation.min.js',
    // './vendor/jquery.easy-pie-chart/jquery.easy-pie-chart.min.js',
    // './vendor/jquery.gmap/jquery.gmap.min.js',
    './vendor/jquery.lazyload/jquery.lazyload.min.js',
    './vendor/isotope/jquery.isotope.min.js',
    './vendor/owl.carousel/owl.carousel.min.js',
    './vendor/magnific-popup/jquery.magnific-popup.min.js',
    './vendor/vide/vide.min.js',
    './js/theme.js',
    './vendor/rs-plugin/js/jquery.themepunch.tools.min.js',
    './vendor/rs-plugin/js/jquery.themepunch.revolution.min.js',
    './js/theme.init.js',
  ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))

})

gulp.task('less', function() {

  return gulp.src('styles/app.less')
    .pipe(less())
    .pipe(cssnano())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());

})

gulp.task('fonts', function() {

  return gulp.src('./fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'))

})

gulp.task('img', function() {

  return gulp.src('./img/**/*')
    .pipe(gulp.dest('./dist/img'))

})

gulp.task('dev', ['hbs', 'less', 'modernizer', 'scripts', 'fonts', 'img'], function() {

  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  gulp.watch('src/contents/*.hbs', ['hbs'])
  gulp.watch('styles/app.less', ['less'])

})