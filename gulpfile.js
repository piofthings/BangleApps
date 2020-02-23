var fs = require("fs");
var { src, dest, parallel, series } = require('gulp');
var terser = require("gulp-terser");

function minify() {
  return src('apps/fitclck/dev/fit-clock.js', { base: 'apps/fitclck/dev' })
    .pipe(terser())
    .pipe(dest('apps/fitclck'));
};

function assets() {
  return src(['apps/fitclk/dev/**/*.json', 'apps/fitclck/dev/**/*.png'], { base: 'apps/fitclck/dev/fit-clock' })
    .pipe(dest("apps/fitclck"));
};

function revision(done) {
  fs.readFile('apps.json', 'utf8',function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      var settings = JSON.parse(data);
      for (var i = 0; i < settings.length; i++) {
        if (settings[i].id == "fitclck") {
          var version = settings[i].version.split('.');
          var verMajor = version[0];
          var verMinor = parseInt(version[1]);
          verMinor++;
          settings[i].version = verMajor + '.' + verMinor;
          console.log("version: " + settings[i].version);
          fs.writeFile("apps.json", JSON.stringify(settings, null, ' '), 'utf8', function(error){
            if(error){
              done(error);
              console.err(error);
            }
            else{              
              done();
            }
          })          
        }        
      }
    }
  });
};

exports.minify = minify;
exports.assets = assets;
exports.revision = revision;
exports.default = parallel(minify, assets, revision);
