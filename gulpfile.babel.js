import "babel-core/register";
import gulp from "gulp";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import minimise from "gulp-cssnano";
import concat from "gulp-concat";
import plumber from "gulp-plumber";
import sequence from "run-sequence";

import webpack from "webpack";
import webpackStream from "webpack-stream";

let jsSource = "./src/js/talk-to-me.js";
let jsDest = "./build/js";
let webpackConfigSrc = "./webpack.config.js";

let htmlSource = "./src/*.html";
let htmlDest = "./build";

gulp.task("js", () => {
    return gulp.src(jsSource)
        .pipe(plumber())
        .pipe(webpackStream(require(webpackConfigSrc)))
        .pipe(gulp.dest(jsDest));
});

gulp.task("html", () => {
    return gulp.src(htmlSource)
        .pipe(gulp.dest(htmlDest));
});

gulp.task("karma", done => {
    return karmaServerWatch(testConfigSrc, ["PhantomJS"], done);
});

gulp.task("watch", function() {
    gulp.watch(htmlSource, ["html"]);
    gulp.watch(jsSource, ["js"]);
});

gulp.task("default", ["html", "js", "watch"]);