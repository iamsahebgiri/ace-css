const browserSync = require("browser-sync").create();
const gulp = require("gulp");
const { parallel } = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const csscomb = require("gulp-csscomb");
const rename = require("gulp-rename");
const sass = require("gulp-sass");

function build() {
  return gulp
    .src("./src/*.scss")
    .pipe(
      sass({ outputStyle: "compact", precision: 10 }).on("error", sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest("./dist"))
    .pipe(cleancss())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("./dist"));
}

function docs_css() {
  return gulp
    .src(["./src/*.scss", "./docs/src/scss/*.scss"])
    .pipe(
      sass({ outputStyle: "compact", precision: 10 }).on("error", sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest("./docs/dist"))
    .pipe(cleancss())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("./docs/dist"));
}

function browserSyncReload(cb){
  browserSync.reload({
    stream: true
  });
  cb();
}

function browserSyncServe(cb){
  browserSync.init({
    server: {
      baseDir: './docs/'
    }    
  });
  cb();
}

function watch() {
  gulp.watch('./test/*.html', browserSyncReload);
  gulp.watch("./**/*.scss", parallel(build, docs_css, browserSyncReload));
}

exports.watch = watch;
exports.build = build;
exports.serve = browserSyncServe;
exports.default = build;
