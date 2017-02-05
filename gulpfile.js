var gulp = require("gulp");
var transform = require('gulp-transform');
var rename = require('gulp-rename');
var merge = require('gulp-merge');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var uglify = require('gulp-uglify');

gulp.task("default", function() {
    var sources = gulp.src([ "./src/*.ts", "./lib/*.ts" ]);
    var resources = gulp.src([ "./src/*.gif", "./src/*.wav" ])
        .pipe(transform(function(contents, file) { return "window['" + file.relative + "'] = '" + contents.toString("base64") + "';"; }))
        .pipe(rename(function(path) { path.extname += ".ts"; }));
    return [
        merge(sources, resources)
            .pipe(sourcemaps.init())
            .pipe(typescript({ target: "ES5", out: "digger.js" }))
            .pipe(uglify())
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("./dist")),
        gulp.src([ "./src/index.html" ])
            .pipe(gulp.dest("./dist"))
    ];
});