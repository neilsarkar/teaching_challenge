var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    fs = require('fs'),
    del = require('del'),
    isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development',
    paths = readPaths();

// build: regenerate dist folder
gulp.task('build', ['html'])

// html: clean assets folder, regenerate assets and wire them up to html
gulp.task('html', ['clean', 'rev'], function() {
  var manifest = JSON.parse(fs.readFileSync('dist/rev-manifest.json', 'utf8'));

  return gulp.src(paths.html, {base: 'app/'}).
    pipe(plugins.htmlReplace({
      css: manifest['application.css'],
      js: {
        src: manifest['application.js'],
        tpl: '<script src="%s" async="async"></script>'
      }
    })).
    pipe(gulp.dest('dist'));
})

// clean: clean dist folder
gulp.task('clean', function(cb) {
  del('dist/**/*.*')
  setTimeout(function() {
    gulp.src(['bower_components/fontawesome/fonts/*', 'bower_components/bootstrap/fonts/*'])
        .pipe(gulp.dest('dist/fonts'))
  }, 500);
  cb()
})

// rev: fingerprint generated assets
gulp.task('rev', ['js', 'css', 'img'], function() {
  return gulp.src(['dist/**/*.css', 'dist/**/*.js'])
    .pipe(plugins.rev())
    .pipe(gulp.dest('dist'))
    .pipe(plugins.rev.manifest())
    .pipe(gulp.dest('dist'));
})

// js: generate optionally minified application.js from js
gulp.task('js', function() {
  var stream = gulp.src(paths.js).
    pipe(plugins.concat('application.js'));

  if( !isDevelopment ) {
    stream = stream.pipe(plugins.uglify())
  }

  return stream.pipe(gulp.dest('dist/'));
});

// css: generate optionally minified application.css from scss
gulp.task('css', function() {
  var stream = gulp.src(paths.css).
    pipe(plugins.sass({outputStyle: isDevelopment ? 'nested' : 'compressed'})).
    on('error', function(err) { console.error("SCSS compile error:" + err.message); this.emit('end'); }).
    pipe(plugins.concat('application.css')).
    pipe(gulp.dest('dist/'));

  return isDevelopment ?
    stream.pipe(browserSync.reload({stream: true})) :
    stream;
})

// img: generate images folder
gulp.task('img', function() {
  return gulp.src(paths.img, {base: 'app/img/'}).
    pipe(gulp.dest('dist/images/'));
})

// in development, watch files for changes and reload server+browser automatically
if( isDevelopment ) {
  var browserSync = require('browser-sync');

  // watch: Watches asset paths and reloads browser on changes
  gulp.task('watch', function() {
    setWatchers()

    // Restart process when gulpfile is changed
    gulp.watch('gulpfile.js', function() {
      console.log("Gulpfile changed, you should restart")
      process.exit(0)
    })

    // Reset paths and watchers when assets.json is changed
    gulp.watch('assets.json', function() {
      readPaths()
      setWatchers()
      gulp.run('build')
    })

    // Trigger manual rebuild when user hits enter
    process.stdin.on('data', function(line) {
      if( line.toString() === "\n" ) {
        gulp.run('build')
      }
    })

    // (Re)sets watchers
    function setWatchers() {
      gulp.watch(paths.js, ['html', browserSync.reload])
      gulp.watch(paths.css, ['html']) // browserSync automatically reloads
      gulp.watch(paths.html, ['html', browserSync.reload])
      gulp.watch(paths.img, ['img', browserSync.reload])
    }
  })

  // Start streaming server and browsersync
  gulp.task('server', function() {
    var started = false;
    plugins.nodemon({ script: 'index.js', watch: ['index.js']})
      .on('start', function() {
        if( !started ) {
          started = true
          browserSync({
            proxy: 'localhost:3000',
            port: 5000
          })
        }
      })
      .on('restart', function() {
        setTimeout(function() {
          browserSync.reload({stream: false})
        }, 500)
      })
  })
  gulp.task('default', ['build', 'server', 'watch'])
}

function readPaths() {
  return paths = JSON.parse(fs.readFileSync('./assets.json', 'utf8'))
}
