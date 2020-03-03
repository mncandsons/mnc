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

gulp.task('images', (done) => {
  const cacheFolder = path.join('./cache');
  const contentsToCache = [
    {
      contents: path.join('static/assets/images'),
      handleCacheUpdate: () => {
        return new Promise((resolve, reject) => {
          gulp.src('static/assets/images/*.{jpg,jpeg,png}')
            .pipe(newer(path.join(cacheFolder, 'static/assets/images')))
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
            .pipe(gulp.dest('static/assets/public-images')).on('end', resolve);
        });
      }
    },
  ]
  cacheMeOutside(cacheFolder, contentsToCache).then(cacheInfo => {
    console.log('====== Netlify cache restored! ======')
    cacheInfo.forEach(info => {
      console.log(info.cacheDir)
    })
  })
});


gulp.task('images-prod', (done) => {
  const cacheFolder = path.join('/opt/build/cache','storage');
  const contentsToCache = [
    {
      contents: path.join('static/assets/images'),
      shouldCacheUpdate: async (cacheManifest, utils) => {
        const imagesBefore = path.join('static/assets/images')
        const imagesAfter = await utils.diff(imagesBefore)
        console.log(imagesAfter);
      },
      handleCacheUpdate: () => {
        return new Promise((resolve, reject) => {
          gulp.src('static/assets/images/*.{jpg,jpeg,png}')
            .pipe(newer(path.join(cacheFolder, 'static/assets/images')))
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
            .pipe(gulp.dest('static/assets/public-images')).on('end', resolve);
        });
      }
    },
  ]
  cacheMeOutside(cacheFolder, contentsToCache).then(cacheInfo => {
    console.log('====== Netlify cache restored! ======')
    cacheInfo.forEach(info => {
      console.log(info.cacheDir)
    })
    done();
  })
});

gulp.task('images-prodcopy', (done) => {
  const cacheFolder = path.join('/opt/build/cache','storage');
  return new Promise((resolve, reject) => {
    gulp.src(path.join(cacheFolder, 'static/assets/public-images'), { allowEmpty: true })
    .pipe(gulp.dest('static/assets/public-images')).on('end', resolve);
  });
  done();
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

gulp.task('build', gulp.series('minify-js', 'images-prod', 'images-prodcopy', 'hugo-build', 'minify-html'));
gulp.task('build-local', gulp.series('minify-js', 'images', 'hugo-build', 'minify-html'));
