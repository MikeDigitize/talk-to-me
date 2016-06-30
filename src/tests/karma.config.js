import "babel-core/register";
import path from "path";

module.exports = config =>
    config.set({

        basePath: "",

        frameworks: ["mocha"],

        files: [
            "../../node_modules/babel-polyfill/browser.js",
            "./**/*.js"
        ],

        client : {
            captureConsole : true
        },

        preprocessors: {
            "./**/*.js": ["webpack"]
        },

        webpack: {
            resolve: {
                root: [
                    path.resolve("./js"),
                    path.resolve("./tests")],
                    extensions: ["", ".js", ".jsx"]
            },
            module: {
                loaders: [{
                    test: /\.js$|\.jsx$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"
                }]
            }
        },

        webpackMiddleware: {
            noInfo: true
        },

        plugins: [
            require("karma-webpack"),
            require("karma-chrome-launcher"),
            require("karma-firefox-launcher"),
            require("karma-phantomjs-launcher"),
            require("karma-ie-launcher"),
            require("karma-mocha"),
            require("karma-spec-reporter")
        ],

        reporters: ["spec"],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: false,

        browsers: ["PhantomJS", "Chrome", "Firefox", "IE10", "IE9"],

        customLaunchers: {
            IE10: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE10'
            },
            IE9: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE9'
            }
        },

        singleRun: true,

        concurrency: Infinity

    });

