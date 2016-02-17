const gulp         = require('gulp'),
      jshint       = require('gulp-jshint'),
      concat       = require('gulp-concat'),
      uglify       = require('gulp-uglify'),
      rimraf       = require('gulp-rimraf'),
      babel        = require('gulp-babel');

const files = ['src/**/*.js'];

gulp.task('clean', () => gulp.src(['dist/'], {read: false}).pipe(rimraf()));

gulp.task('lint', () => gulp.src(files).pipe(jshint()).pipe(jshint.reporter('default')));

gulp.task('minify', ['clean', 'lint'], () => {
  return gulp.src(files)
    .pipe(concat('md-form-validator.js'))
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(concat('md-form-validator.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

// Default Task
gulp.task('default', ['minify']);
