var gulp = require('gulp'),
inject = require('gulp-inject'),
server = require('browser-sync').create(),
htmlclean = require('gulp-htmlclean'),
cleanCSS = require('gulp-clean-css'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify');

var paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/**/*.css',
    srcJS: 'src/**/*.js',

    tmp: 'tmp',
    tmpIndex: 'tmp/index.html',
    tmpCSS: 'tmp/**/*.css',
    tmpJS: 'tmp/**/*.js',

    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js'
};

gulp.task('html', function() {
    return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});

gulp.task('css', function() {
    return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
});

gulp.task('js', function() {
    return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});

gulp.task('php', function() {
    return gulp.src('src/**/*.php').pipe(gulp.dest(paths.tmp));
});

gulp.task('assets', function() {
    return gulp.src([
      'src/images/**/*',
      'src/fonts/**/*'], {
        base: 'src'
      }).pipe(gulp.dest(paths.tmp));
});

gulp.task('copy', ['html', 'css', 'js', 'php', 'assets']);

gulp.task('inject', ['copy'], function() {
  var css = gulp.src(paths.tmpCSS);
  var js = gulp.src(paths.tmpJS);
  return gulp.src(paths.tmpIndex)
     .pipe(inject(css, {ignorePath:paths.tmp}))
     .pipe(inject(js, {ignorePath:paths.tmp}))
     .pipe(gulp.dest(paths.tmp));
});

gulp.task('browser-sync', ['inject'] ,function() {
  server.init({
    proxy: "glycantest"
  });
});

gulp.task('reload', ['inject'], function() {
  server.reload();
  done();
});

gulp.task('serve', ['browser-sync']);

gulp.task('watch', ['serve'], function() {
    gulp.watch(paths.src, ['reload']);
});

gulp.task('html:dist', function () {
  return gulp.src(paths.srcHTML)
    .pipe(htmlclean())
    .pipe(gulp.dest(paths.dist));
});
gulp.task('css:dist', function () {
  return gulp.src(paths.srcCSS)
    .pipe(concat('main.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist));
});
gulp.task('js:dist', function () {
  return gulp.src(paths.srcJS)
    .pipe(concat('products.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});
gulp.task('assets:dist', function() {
   return gulp.src([
      'src/images/**/*',
      'src/fonts/**/*'], {
        base: 'src'
      }).pipe(gulp.dest(paths.dist));
});
gulp.task('php:dist', function() {
    return gulp.src('src/**/*.php')
    .pipe(gulp.dest(paths.dist));
})

gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist', 'assets:dist', 'php:dist']);

gulp.task('inject:dist', ['copy:dist'], function() {
    var css = gulp.src(paths.distCSS);
    var js = gulp.src(paths.distJS);
    return gulp.src(paths.distIndex)
      .pipe(inject(css, {ignorePath:paths.dist}))
      .pipe(inject(js, {ignorePath:paths.dist}))
      .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['inject:dist']);

gulp.task('default', ['watch']);