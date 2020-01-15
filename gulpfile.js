var { src, dest, parallel } = require('gulp');
var terser = require("gulp-terser");

function minify() {
  return src('dev/fit-clock/fit-clock.js', { base: 'dev/fit-clock'})
        .pipe(terser())
        .pipe(dest('apps/fitclck'));
}
function assets(){
    return src(['dev/**/*.json','dev/**/*.png'], { base: 'dev/fit-clock'})
        .pipe(dest("apps/fitclck"));
}
exports.minify = minify;
exports.assets = assets;

exports.default = parallel(minify, assets);
