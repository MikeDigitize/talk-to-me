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

import { Server } from "karma";

let jsSource = "./src/js/talk-to-me.js";
let jsDest = "./build/js";
let webpackConfigSrc = "./webpack.config.js";

let htmlSource = "./src/*.html";
let htmlDest = "./build";

let testConfigSrc = __dirname + "/src/tests/karma.config.js";
let testSource = "./src/tests/**/*.js";

let karmaServerWatch = (configSrc, browsers, done) => new Server({
        configFile: configSrc,
        singleRun: true,
        autoWatch: false,
        browsers: browsers
    }, () => {
        done();
    }).start();

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

gulp.task("karma:browser-tests", done => {
    return karmaServer(testConfigSrc, ["Chrome", "Firefox", "IE10", "IE9"], done);
});

gulp.task("watch", function() {
    gulp.watch(htmlSource, ["html"]);
    gulp.watch(jsSource, ["js"]);
    gulp.watch(testConfigSrc, ["karma"]);
});

gulp.task("default", ["html", "js", "watch"]);