const gulp = require('gulp');
const shell = require('gulp-shell');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const responsive = require('gulp-responsive');
const rename = require('gulp-rename');

gulp.task('minify-js', () => {
    return gulp.src([
      'node_modules/tiny-slider/dist/min/tiny-slider.js',
      'assets/js/vendor/hashTabber.js',
      'node_modules/vanilla-lazyload/dist/lazyload.min.js',
      'assets/js/vendor/js-form-validator.js'
    ])
    .pipe(uglify())
    .pipe(concat('bundle.min.js'))
    .pipe(gulp.dest('./assets/js'))
})

gulp.task('images', () => {
  return gulp.src('static/**/*.{jpg,jpeg,png}')
    .pipe(responsive({
      '**/*.{jpg,png}': [{
        width: 2000,
        quality: 75,
        compressionLevel: 7,
      }, {
        width: 2000,
        quality: 75,
        rename: {
          extname: '.webp',
        },
      }],
    }, {
      errorOnEnlargement: false,
      errorOnUnusedConfig: false
    }))
    .pipe(rename(function(opt) {
      opt.basename = opt.basename.split(' ').join('_');
      return opt;
    }))
    .pipe(gulp.dest('./static'));
});

gulp.task('hugo-build', shell.task(['hugo']))

gulp.task('minify-html', () => {
    return gulp.src('public/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true,
            useShortDoctype: true,
        }))
        .pipe(gulp.dest('./public'))
})

gulp.task('build', gulp.series('minify-js', 'images', 'hugo-build', 'minify-html'));
