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
const { copyDirectory, removeDirectory } = require('cache-me-outside/lib/utils/fs');
const fs = require('fs');

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
            .pipe(gulp.dest('static/assets/images/public')).on('end', resolve);
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


gulp.task('images-prod', async (done) => {
  const cacheFolder = path.join('/opt/build/cache','storage');
  const cacheNewerFolder = path.join(cacheFolder, 'static/assets/newer'); // folder for storing newer files
  const srcImagesPath = 'static/assets/images';
  const contentsToCache = [
    {
      contents: srcImagesPath,
      handleCacheUpdate: () => {
        return new Promise((resolve, reject) => {
          gulp.src(`${cacheNewerFolder}/*.{jpg,jpeg,png}`)
            // .pipe(newer(path.join(cacheFolder, srcImagesPath)))
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
            .pipe(gulp.dest(`${srcImagesPath}/public`)).on('end', resolve);
        });
      },
      shouldCacheUpdate: async (cacheManifest, utils) => {
        if (fs.existsSync(cacheNewerFolder)) {
          await removeDirectory(cacheNewerFolder);
        }
        fs.mkdirSync(cacheNewerFolder);
        const files = await new Promise((resolve, reject) => {
          fs.readdir(srcImagesPath, function(err, files) {
            if (err) return reject(err);
            resolve(files);
          });
        });
        let filesIsChanged = false;
        for (const file of files) {
          if (file === 'public') { // don't check public folder
            continue;
          }
          const filePath = path.join(srcImagesPath, file);
          let isChanged = false;
          if (!cacheManifest.diffs || !cacheManifest.diffs[filePath]) {
            isChanged = true;
            await utils.diff(filePath);
          } else {
            isChanged = await utils.diff(filePath);
          }
          if (isChanged) {
            fs.copyFileSync(filePath, path.join(cacheNewerFolder, file));
          }
          filesIsChanged = filesIsChanged || isChanged
        }
        return filesIsChanged;
      },      
    },
  ]
  try {
    const cachePubicFolder = path.join(cacheFolder, 'static/assets/images/public');
    const assetsImagePublicPath = 'static/assets/images/public';
    if (fs.existsSync(cachePubicFolder)) {
      console.log(`0. copy cached public folder from ${cachePubicFolder} to ${assetsImagePublicPath}`);
      if (!fs.existsSync(assetsImagePublicPath)) {
        fs.mkdirSync(assetsImagePublicPath);
      }
      await copyDirectory(cachePubicFolder, assetsImagePublicPath);
    }
    await cacheMeOutside(cacheFolder, contentsToCache);
    console.log('====== Netlify cache restored! ======')
    done();
  } catch (err) {
    console.log('Error during process:', err);
    done();
  }
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

gulp.task('build', gulp.series('minify-js', 'images-prod', 'hugo-build', 'minify-html'));
gulp.task('build-local', gulp.series('minify-js', 'images', 'hugo-build', 'minify-html'));
