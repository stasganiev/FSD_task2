"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var pug = require('gulp-pug');
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");

gulp.task("css", ()=>{
  return gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    // .pipe(csso())
    .pipe(rename("style_min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("src/css"))
    .pipe(server.stream());
});

gulp.task("cssnorm", ()=>{
  return gulp.src("src/sass/normalize.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    // .pipe(csso())
    .pipe(rename("normalize_min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("src/css"))
    .pipe(server.stream());
});

gulp.task("server", ()=>{
  server.init({
    server: "src/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/sass/**/*.scss", gulp.series("css"));
  gulp.watch("src/*.html").on("change", server.reload);
});

gulp.task("build", gulp.series("css", "cssnorm"));
gulp.task("start", gulp.series("build", "server"));



gulp.task("pug-compile", ()=>{
  return gulp.src(['app/pug/**/*.pug', '!app/pug/includes/**/*.pug'])
    .pipe(pug({pretty:true}))
    .pipe(gulp.dest('app/html'))
});

gulp.task('watch',()=>{
  gulp.watch('app/pug/**/*.pug', gulp.series('pug-compile'))
});
