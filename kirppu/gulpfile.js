var gulp = require("gulp");
var gif = require("gulp-if");
var concat = require("gulp-concat");
var coffee = require("gulp-coffee");
var uglify = require("gulp-uglify");
var minify = require("gulp-minify-css");
var gutil = require("gulp-util");
var _ = require("lodash");


var pipeline = require("./pipeline");
var SRC = "static_src";
var DEST = "static/kirppu";

// Compression enabled, if run with arguments: --type production
var shouldCompress = gutil.env.type === "production";

/**
 * Add source (SRC) prefix for all source file names from pipeline definition.
 *
 * @param {Object} def Pipeline group definition value.
 * @returns {Array} Prefixed source files.
 */
var srcPrepend = function(def) {
    return _.map(def.source_filenames, function(n) { return SRC + "/" + n; })
};

var jsTasks = _.map(pipeline.js, function(def, name) {
    var taskName = "js:" + name;
    gulp.task(taskName, function() {
        return gulp.src(srcPrepend(def))
            .pipe(gif(/\.coffee$/, coffee(), gutil.noop()))
            .pipe(concat(def.output_filename))
            .pipe(gif(shouldCompress && def.compress, uglify()))
            .pipe(gulp.dest(DEST + "/js/"));
    });
    return taskName;
});

var cssTasks = _.map(pipeline.css, function(def, name) {
    var taskName = "css:" + name;
    gulp.task(taskName, function() {
        return gulp.src(srcPrepend(def))
            .pipe(concat(def.output_filename))
            .pipe(gif(shouldCompress, minify()))
            .pipe(gulp.dest(DEST + "/css/"));
    });
    return taskName;
});

gulp.task("pipeline", [].concat(jsTasks).concat(cssTasks), function() {

});

gulp.task("default", ["pipeline"], function() {

});

/**
 * Find name of pipeline task by source filename.
 *
 * @param haystack {Object} Pipeline group container (js or css object).
 * @param file {string} Filename to find for.
 * @returns {string|undefined|*} Pipeline group name or undefined.
 */
var findTask = function(haystack, file) {
    return _.findKey(haystack, function(def) {
        // Match if 'file' ends with any source filename.
        return _.find(def.source_filenames, function(src) {
            var pos = file.length - src.length;
            return pos >= 0 && file.indexOf(src, pos) == pos;
        });
    });
};

/**
 * Start task by --file commandline argument.
 *
 * @param group {string} Pipeline group container name to try.
 * @returns {boolean} True if task was run. Otherwise false.
 */
var startFileTask = function(group) {
    var task = findTask(_.result(pipeline, group), gutil.env.file);
    if (task != null) {
        gulp.start(group + ":" + task);
        return true;
    }
    return false;
};

// For file watcher:  build --file $FilePathRelativeToProjectRoot$
gulp.task("build", function() {
    if (gutil.env.file == null) {
        gutil.log(gutil.colors.red("Need argument: --file FILE"));
    }
    else if (!(startFileTask("css") || startFileTask("js"))) {
        gutil.log(gutil.colors.red("No target found in pipeline.js: " + gutil.env.file));
    }
});
