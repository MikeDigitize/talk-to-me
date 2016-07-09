import "babel-core/register";
import gulp from "gulp";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import minimise from "gulp-cssnano";
import concat from "gulp-concat";
import plumber from "gulp-plumber";
import sequence from "run-sequence";
import rename from "gulp-rename";

import webpack from "webpack";
import webpackStream from "webpack-stream";

import { Server } from "karma";

let talkToMeSource = "./src/js/talk-to-me.js";
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
    let devConfig = Object.assign({}, require(webpackConfigSrc), {
        plugins : []
    });
    return gulp.src(talkToMeSource)
        .pipe(plumber())
        .pipe(webpackStream(devConfig))
        .pipe(gulp.dest(jsDest));
});

gulp.task("js:light-build", () => {
    return gulp.src(talkToMeSource)
        .pipe(plumber())
        .pipe(webpackStream(require(webpackConfigSrc)))
        .pipe(rename("talk-to-me-light.js"))
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
    gulp.watch(talkToMeSource, ["js:light-build"]);
    gulp.watch(testConfigSrc, ["karma"]);
});

gulp.task("default", ["html", "js", "watch"]);
gulp.task("light", ["js:light-build"]);