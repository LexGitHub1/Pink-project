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
const posthtml = require("gulp-posthtml");
const include = require('posthtml-include');
const terser = require('gulp-terser');

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

//Images

const images = () => {
  return gulp.src("build/img/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
    ]))
    .pipe(gulp.dest("build/img"))
}

exports.images = images;

const createWebp = () => {
  return gulp.src("build/img/*.{jpg,png}")
    .pipe(webp({quality: 75}))
    .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

const optimize = gulp.series(
  images,
  createWebp,
)

exports.optimize = optimize;

//Copy

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
}

exports.copy = copy;

//Clean

const clean = () => {
  return del("build");
}

exports.clean = clean;

//Htmlmin

const html = () => {
  return gulp.src("source/*.html")
    .pipe(posthtml([include()]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
    .pipe(sync.stream());
}

exports.html = html;

// Scripts

const scripts = () => {
  return gulp.src("source/js/*.js")
    .pipe(terser())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Build

const build = gulp.series(
  clean,
  copy,
  styles,
  html,
  scripts
)

exports.build = build;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("html")).on("change", sync.reload);
  gulp.watch("source/js/*.js", gulp.series("scripts")).on("change", sync.reload);
}

exports.default = gulp.series(
  build, server, watcher
);
