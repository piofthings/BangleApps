var { fs }  = require("fs");
var { src, dest, parallel } = require('gulp');
var terser = require("gulp-terser");

function minify() {
  return src('apps/fitclck/dev/fit-clock.js', { base: 'apps/fitclck/dev'})
        .pipe(terser())
        .pipe(dest('apps/fitclck'));
}
function assets(){
    return src(['apps/fitclk/dev/**/*.json','apps/fitclck/dev/**/*.png'], { base: 'apps/fitclck/dev/fit-clock'})
        .pipe(dest("apps/fitclck"));
}
exports.minify = minify;
exports.assets = assets;

exports.default = parallel(minify, assets);
