var { fs }  = require("fs");
var { src, dest, parallel, series } = require('gulp');
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
function revision(){
  var settings = require("apps.json");
  for(var i=0;i<settings.length;i++){
    if(settings[i].id == "fitclk"){
      var version = settings[i].version.split('.');
      var verMajor = version[0];
      var verMinor = parseInt(version[1]);
      verMinor ++;
      settings[i].version = verMajor + '.' + verMinor;
      fs.writeFile("apps.json",JSON.stringify(settings, null, ' '));
    }
  }
}
exports.minify = minify;
exports.assets = assets;
exports.version = version;
exports.default = series(parallel(minify, assets),version);
