var { src, dest, parallel } = require('gulp');
var terser = require("gulp-terser");

function minify() {
  return src('dev/fit-clock/fit-clock.js', { base: 'dev/fit-clock'})
        .pipe(terser())
        .pipe(dest('apps/fitclck'));
}
function js(){
    return src(['dev/**/*.json','dev/**/*.png'], { base: 'dev'})
        .pipe(dest("apps"));
}
exports.minify = minify;
exports.js = js;

exports.default = parallel(minify);
