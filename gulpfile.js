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

var bundler = watchify(browserify('./js/app.js', watchify.args));
bundler.transform(reactify);

gulp.task('js', bundle);
bundler.on('update', bundle);

function bundle() {
  var logger = new bundleLogger('browserify');
  logger.start();

  return bundler.bundle()
    .on('error', handleErrors)//gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bootstrap.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./js'))
    .on('end', logger.end);
}

gulp.task('default', ['js']);
