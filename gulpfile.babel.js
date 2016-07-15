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
let matcherSource = "./src/js/result-matcher.js";
let jsDest = "./build/js";
let webpackConfigSrc = "./webpack.config.js";
let webpackConfigMatcherSrc = "./webpack.config.matcher.js";

let htmlSource = "./src/*.html";
let htmlDest = "./build";

let testConfigSrc = __dirname + "/src/tests/karma.config.js";
let testSource = "./src/tests/**/*.js";

let jsNames = { light : "talk-to-me-light.js", matcher : "talk-to-me-matcher.js" }; 

let karmaServer = (configSrc, browsers, done) => new Server({
        configFile: configSrc,
        singleRun: true,
        autoWatch: false,
        browsers: browsers
    }, () => {
        done();
    }).start();

gulp.task("js:dev", () => {
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
        .pipe(rename(jsNames.light))
        .pipe(gulp.dest(jsDest));
});

gulp.task("js:matcher", () => {
    return gulp.src(matcherSource)
        .pipe(plumber())
        .pipe(webpackStream(require(webpackConfigMatcherSrc)))
        .pipe(rename(jsNames.matcher))
        .pipe(gulp.dest(jsDest));
});

gulp.task("html", () => {
    return gulp.src(htmlSource)
        .pipe(gulp.dest(htmlDest));
});

gulp.task("karma:browser-tests", done => {
    return karmaServer(testConfigSrc, ["Chrome"], done);
});

gulp.task("watch", function() {
    gulp.watch(htmlSource, ["html"]);
    gulp.watch(talkToMeSource, ["js:light-build", "js:dev"]);
    gulp.watch(testConfigSrc, ["karma:browser-tests"]);
});

gulp.task("default", ["html", "js:dev", "js:light-build", "watch"]);
gulp.task("light", ["html", "js:light-build"]);
gulp.task("matcher", ["html", "js:matcher"]);
gulp.task("dev", ["html", "js:dev"]);