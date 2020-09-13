const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const htmlmin = require("gulp-htmlmin");
const jsminify = require("gulp-minify");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Image Optimization

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 2}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
}

exports.images = images;

// WebP

const makewebp = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp())
    .pipe(gulp.dest("build/img"));
}
exports.makewebp = makewebp;

// SVG sprite

const sprite = () => {
  return gulp.src("source/img/**/*.svg")
    .pipe(svgstore())
    .pipe(rename("svg-sprite.svg"))
    .pipe(gulp.dest("build/img"));
}

exports.sprite = sprite;

// Copy

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
};
exports.copy = copy;

// Minify html

const html = () => {
  return gulp.src([
    "source/*.html"
  ], {
    base: "source"
  })
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));

};
exports.html = html;

// Minify js

const js = () => {
  return gulp.src([
    "source/js/**"])
    .pipe(jsminify())
    .pipe(gulp.dest("build/js"));
};
exports.js = js;

// Delete

const clean = () => {
  return del("build");
};
exports.clean = clean;

const build = gulp.series(clean, copy, html, js, styles, images, makewebp, sprite);
exports.build = build;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", gulp.series(html));
  gulp.watch("source/*.html").on("change", sync.reload);
  gulp.watch("source/js/**/*.js", gulp.series("js"));
  gulp.watch("source/js/**/*.js").on("change", sync.reload);
}

exports.default = gulp.series(
  build, server, watcher
);
