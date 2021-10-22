const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const fs = require("fs");

function clean(cb) {
    del.sync(['../prod'], {force: true});

    if (! fs.existsSync("../prod")) {
        fs.mkdirSync("../prod");
    }
    cb();
}

function style(cb) {
    gulp.src(`../client/**/*.scss`).pipe(sass()).pipe(gulp.dest(`../prod`)).on('error', (err) => {
        console.log(err)
    }).on('end', () => {
        cb()
    })
}

function copyAssets(cb) {
    gulp.src([`../client/**/**.*`, `!../client/**/*.scss`]).pipe(gulp.dest(`../prod`)).on('end', () => {
        cb();
    })
}

exports.default = gulp.task('default', gulp.series(clean, style, copyAssets));

exports.watch = function () {
    gulp.watch('../client/**/**.scss', gulp.series(clean, style, copyAssets));
    gulp.watch('../client/**/**.html', gulp.series(clean, style, copyAssets));
    gulp.watch('../client/**/**.js', gulp.series(clean, style, copyAssets));
    gulp.watch('../client/**/img/**.**', gulp.series(clean, style, copyAssets));
    gulp.watch('../client/**/**.json', gulp.series(clean, style, copyAssets));
}