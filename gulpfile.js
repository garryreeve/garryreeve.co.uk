var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var handlebars = require('gulp-compile-handlebars');
var mergeStream = require('merge-stream');
var posts = require('./data.json');

// Sass compilation
gulp.task('css', function () {
    gulp.src('css/scss/**/*.scss')
        .pipe(sass({ outputStyle: 'compact' })) // Compile sass
        .pipe(gulp.dest('./css/')) // Output compiled CSS
        .pipe(rename({ suffix: '.min' })) // Create .min version
        .pipe(cssmin())
        .pipe(gulp.dest('./css/')); // Output minified version
});

// Minify JS
gulp.task('js-min', function () {
    gulp.src('js/scripts.js')
        .pipe(uglify()) // Minify JS
        .pipe(rename({ suffix: '.min' })) // Create .min version
        .pipe(gulp.dest('js/')); // Output
});

// Bundle JS
gulp.task('js-bundle', function () {
    gulp.src('js/lib/**/*.js')
        .pipe(concat('plugins.js')) // Bundle all files 
        .pipe(gulp.dest('./js/')) // Output dir
        .pipe(uglify()) // Minify bundled file
        .pipe(rename({ suffix: '.min' })) // Create .min version
        .pipe(gulp.dest('js/')); // Output
});

// HBS to static html
gulp.task('hbs', function () {
    var tasks = [];
    for (var l in posts) {
        var post = posts[l];
        var options = {
            ignorePartials: true,
            batch : ['./views/partials'],
            helpers : {}
        }
        tasks.push( gulp.src('views/'+post.template+'.hbs')
            .pipe(handlebars(post, options))
            .pipe(rename(post.slug + ".html"))
            .pipe(gulp.dest('./'))
        );
    }
    return mergeStream(tasks);
});

// Watch tasks
gulp.task('watch', function () {
    gulp.watch('css/scss/**/*.scss', ['css']);
    gulp.watch('js/scripts.js', ['js-min']);
    gulp.watch('js/lib/**/*.js', ['js-bundle']);
});

gulp.task('default', ['css', 'js-min', 'js-bundle', 'hbs']);