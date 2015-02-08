var browserify   = require('browserify');
var watchify     = require('watchify');
var gulp         = require('gulp');
var source       = require('vinyl-source-stream');
var reactify     = require('reactify');
var buffer       = require('vinyl-buffer');
var gutil        = require('gulp-util');
var prettyHrtime = require('pretty-hrtime');
var notify       = require('gulp-notify');

var handleErrors = function() {
  var args = Array.prototype.slice.call(arguments);

  notify.onError({
    title: 'Compile Error',
    message: "<%= error.message %>"
  }).apply(this, args);

  this.emit('end');
};

var startTime;
var taskName;

var bundleLogger = function(task) {
  var taskName = task;

  return {
    start: function() {
      startTime = process.hrtime();
      gutil.log('Running', gutil.colors.green("'" + taskName + "'") + '...');
    },

    end: function() {
      var taskTime = process.hrtime(startTime);
      var prettyTime = prettyHrtime(taskTime);
      gutil.log('Finished', gutil.colors.green("'" + taskName + "'"), 'in', gutil.colors.magenta(prettyTime));
    }
  };
};

var bundler = browserify({
  // Required watchify args
  cache: {}, packageCache: {}, fullPaths: true,
  // Specify the entry point of your app
  entries: ['./js/app.js'],
});

var bundle = function() {
  // Log when bundling starts
  var logger = new bundleLogger('browserify');
  logger.start();

  return bundler
    .transform(reactify)
    .bundle()
    // Report compile errors
    .on('error', handleErrors)
    // Use vinyl-source-stream to make the
    // stream gulp compatible. Specifiy the
    // desired output filename here.
    .pipe(source('bootstrap.js'))
    // uglify if compress is set
    .pipe(buffer())
    // Specify the output destination
    .pipe(gulp.dest('./js'))
    // Log when bundling completes!
    .on('end', logger.end);
};

gulp.task('dev', function() {
  bundler = watchify(bundler);
    // Rebundle with watchify on changes.
  bundler.on('update', bundle);

  return bundle();
});

gulp.task('default', ["dev"]);
