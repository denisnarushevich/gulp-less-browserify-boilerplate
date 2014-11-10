var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var clean = require("gulp-clean");
var merge = require("merge-stream");

function styles(){
    return gulp.src("./src/less/main.less")
        .pipe(less())
        .pipe(gulp.dest("./dist/css/"));
}

function scripts(){
    return browserify('./src/js/main.js')
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./dist/js/'));
}

function compile(){
    return merge(styles(), scripts());
}

function optimize(){
    var a = gulp.src("dist/js/**/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("dist/js/"));

    var b = gulp.src("dist/img/**/*")
        // Pass in options to the task
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('dist/img'));

    return merge(a, b);
}

gulp.task("scripts", scripts);

gulp.task("styles", styles);

gulp.task('clean', function() {
    return gulp.src("dist").pipe(clean());
});

gulp.task("dist", ["clean"], function(){
    var index = gulp.src(["src/index.html"])
        .pipe(gulp.dest("dist"));
    var img = gulp.src(["src/img/**/*"])
        .pipe(gulp.dest("dist/img"));
    return merge(index,img,css);
});

gulp.task("compile", ["dist"], compile);

gulp.task("build", ["compile"], optimize);

// Rerun the task when a file changes
gulp.task('watch', ["compile"], function() {
    gulp.watch(["src/js/**/*.js"], ['scripts']);
    gulp.watch(["src/less/**/*.less"], ['styles']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch']);