Puck.debug=3;

// FIXME: use UART lib so that we handle errors properly
var Comms = {
reset : () => new Promise((resolve,reject) => {
  Puck.write("\x03\x10reset();\n", (result) => {
    if (result===null) return reject("");
    setTimeout(resolve,500);
  });
}),
uploadApp : (app,skipReset) => {
  return AppInfo.getFiles(app, httpGet).then(fileContents => {
    return new Promise((resolve,reject) => {
      fileContents = fileContents.map(storageFile=>storageFile.cmd).join("\n")+"\n";
      console.log("uploadApp",fileContents);
      function doUpload() {
        Puck.write(`\x10E.showMessage('Uploading\\n${app.id}...')\n${fileContents}\x10E.showMessage('Hold BTN3\\nto reload')\n`,(result) => {
          if (result===null) return reject("");
          resolve(appJSON);
        });
      }
      if (skipReset) {
        doUpload();
      } else {
        // reset to ensure we have enough memory to upload what we need to
        Comms.reset().then(doUpload)
      }
    });
  });
},
getInstalledApps : () => {
  return new Promise((resolve,reject) => {
    Puck.write("\x03",(result) => {
      if (result===null) return reject("");
      Puck.eval('require("Storage").list(/\.info$/).map(f=>{var j=require("Storage").readJSON(f,1)||{};j.id=f.slice(0,-5);return j})', (appList,err) => {
        if (appList===null) return reject(err || "");
        console.log("getInstalledApps", appList);
        resolve(appList);
      });
    });
  });
},
removeApp : app => { // expects an app structure
  var cmds = app.storage.map(file=>{
    return `\x10require("Storage").erase(${toJS(file.name)});\n`;
  }).join("");
  console.log("removeApp", cmds);
  return Comms.reset().then(new Promise((resolve,reject) => {
    Puck.write(`\x03\x10E.showMessage('Erasing\\n${app.id}...')${cmds}\x10E.showMessage('Hold BTN3\\nto reload')\n`,(result) => {
      if (result===null) return reject("");
      resolve();
    });
  }));
},
removeAllApps : () => {
  return Comms.reset().then(() => new Promise((resolve,reject) => {
    // Use write with newline here so we wait for it to finish
    Puck.write('\x10E.showMessage("Erasing...");require("Storage").eraseAll();Bluetooth.println("OK")\n', (result,err) => {
      if (!result || result.trim()!="OK") return reject(err || "");
      resolve();
    }, true /* wait for newline */);
  }));
},
setTime : () => {
  return new Promise((resolve,reject) => {
    var d = new Date();
    var tz = d.getTimezoneOffset()/-60
    var cmd = '\x03\x10setTime('+(d.getTime()/1000)+');';
    // in 1v93 we have timezones too
    cmd += 'E.setTimeZone('+tz+');';
    cmd += "(s=>{s&&(s.timezone="+tz+")&&require('Storage').write('setting.json',s);})(require('Storage').readJSON('setting.json',1))\n";
    Puck.write(cmd, (result) => {
      if (result===null) return reject("");
      resolve();
    });
  });
},
disconnectDevice: () => {
  var connection = Puck.getConnection();

  if (!connection) return;

  connection.close();
},
watchConnectionChange : cb => {
  var connected = Puck.isConnected();

  //TODO Switch to an event listener when Puck will support it
  var interval = setInterval(() => {
    if (connected === Puck.isConnected()) return;

    connected = Puck.isConnected();
    cb(connected);
  }, 1000);

  //stop watching
  return () => {
    clearInterval(interval);
  };
},
listFiles : () => {
  return new Promise((resolve,reject) => {
    Puck.write("\x03",(result) => {
      if (result===null) return reject("");
      //use encodeURIComponent to serialize octal sequence of append files
      Puck.eval('require("Storage").list().map(encodeURIComponent)', (files,err) => {
        if (files===null) return reject(err || "");
        files = files.map(decodeURIComponent);
        console.log("listFiles", files);
        resolve(files);
      });
    });
  });
},
readFile : (file) => {
  return new Promise((resolve,reject) => {
    //encode name to avoid serialization issue due to octal sequence
    const name = encodeURIComponent(file);
    Puck.write("\x03",(result) => {
      if (result===null) return reject("");
      //TODO: big files will not fit in RAM.
      //we should loop and read chunks one by one.
      //Use btoa for binary content
      Puck.eval(`btoa(require("Storage").read(decodeURIComponent("${name}"))))`, (content,err) => {
        if (content===null) return reject(err || "");
        resolve(atob(content));
      });
    });
  });
}
};
