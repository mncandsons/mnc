const gulp = require('gulp');
const shell = require('gulp-shell');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const responsive = require('gulp-responsive');
const rename = require('gulp-rename');
const newer = require('gulp-newer');
const path = require('path');
const cacheMeOutside = require('cache-me-outside');

gulp.task('minify-js', () => {
    return gulp.src([
      'assets/js/vendor/tiny-slider.js',
      'assets/js/vendor/hashTabber.js',
      'node_modules/vanilla-lazyload/dist/lazyload.min.js',
      'assets/js/vendor/js-form-validator.js'
    ])
    .pipe(uglify())
    .pipe(concat('bundle.min.js'))
    .pipe(gulp.dest('./assets/js'))
})

gulp.task('images', () => {
  return gulp.src('static/assets/images/*.{jpg,jpeg,png}')
    .pipe(newer('./static/assets/images/public/'))
    .pipe(responsive({
      '**/*.{jpg,png,jpeg}': [{
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
    .pipe(gulp.dest('./static/assets/images/public/'));
});

const cacheFolder = path.join('/opt/build/cache', 'storage');

const contentsToCache = [
  {
    contents: path.join(__dirname, 'assets/images'),
    handleCacheUpdate: '',
    shouldCacheUpdate: async (cacheManifest, utils) => {
      const updateCache = false // always restore cache
      return updateCache // Boolean
    },
  }
]

gulp.task('images-prod', () => cacheMeOutside(cacheFolder, contentsToCache).then(cacheInfo => {
  console.log('====== Netlify cache restored! ======')
  cacheInfo.forEach(info => {
    console.log(info.cacheDir)
  })
  return gulp.src(cacheFolder + '/assets/images/*.{jpg,jpeg,png}')
    .pipe(responsive({
      '**/*.{jpg,png,jpeg}': [{
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
    .pipe(gulp.dest(cacheFolder + '/assets/images/public/'));
}))

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

gulp.task('build', gulp.series('minify-js', 'images-prod', 'hugo-build', 'minify-html'));
gulp.task('build-local', gulp.series('minify-js', 'images', 'hugo-build', 'minify-html'));
