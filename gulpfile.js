var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var handlebars = require('gulp-compile-handlebars');

/* Sass compilation */ 
gulp.task('css', function () {
  return gulp.src('css/scss/styles.scss')
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(gulp.dest('css/'));
});

/* JS Library concat */ 
gulp.task('js-lib', function() {
  return gulp.src('js/lib/*.js')
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('js/'));
});

/* HBS to static html */ 
gulp.task('hbs', function () {
    var templateData = {},
    options = {
        ignorePartials: true,
        batch : ['./views/partials'],
        helpers : {}
    }
    return gulp.src('views/*.hbs')
        .pipe(handlebars(templateData, options))
        .pipe(rename(function (path) { path.extname = ".html" }))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['css', 'js-lib', 'hbs']);