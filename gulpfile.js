var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var handlebars = require('gulp-compile-handlebars');
var mergeStream = require('merge-stream');
var posts = require('./app/data.json');

// Sass compilation
gulp.task('css', function () {
    gulp.src('public/css/scss/**/*.scss')
        .pipe(sass({ outputStyle: 'compact' })) // Compile sass
        .pipe(gulp.dest('./public/css/')) // Output compiled CSS
        .pipe(rename({ suffix: '.min' })) // Create .min version
        .pipe(cssmin())
        .pipe(gulp.dest('./public/css/')); // Output minified version
});

// Minify JS
gulp.task('js-min', function () {
    gulp.src('public/js/scripts.js')
        .pipe(uglify()) // Minify JS
        .pipe(rename({ suffix: '.min' })) // Create .min version
        .pipe(gulp.dest('public/js/')); // Output
});

// Bundle JS
gulp.task('js-bundle', function () {
    gulp.src('public/js/lib/**/*.js')
        .pipe(concat('plugins.js')) // Bundle all files 
        .pipe(gulp.dest('./public/js/')) // Output dir
        .pipe(uglify()) // Minify bundled file
        .pipe(rename({ suffix: '.min' })) // Create .min version
        .pipe(gulp.dest('public/js/')); // Output
});

// HBS to static html
gulp.task('hbs', function () {
    var tasks = [];
    for (var l in posts) {
        var post = posts[l];
        var options = {
            ignorePartials: true,
            batch : ['./app/views/partials'],
            helpers : {}
        }
        tasks.push( gulp.src('app/views/'+post.template+'.hbs')
            .pipe(handlebars(post, options))
            .pipe(rename(post.slug + ".html"))
            .pipe(gulp.dest('./public/'))
        );
    }
    return mergeStream(tasks);
});

// Watch tasks
gulp.task('watch', function () {
    gulp.watch('public/css/scss/**/*.scss', ['css']);
    gulp.watch('public/js/scripts.js', ['js-min']);
    gulp.watch('public/js/lib/**/*.js', ['js-bundle']);
});

gulp.task('default', ['css', 'js-min', 'js-bundle', 'hbs']);