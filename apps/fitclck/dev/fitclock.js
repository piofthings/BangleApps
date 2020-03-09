(function() {
    const FITCLOCKSETTINGS = "fitclock-settings.json";
    var fln = "fitclock.log";
    var hrmPower = 0;
    var gpsPower = 0;
    var fix = null;
    var fixMissedCount = 0;
    var fixMissedTimeout = 180;
    var steps = 0;
    var lastStepDate = null;
    var previousDate = new Date();
    var buf = Graphics.createArrayBuffer(240, 240, 1, {
        msb: true
    });

    function flip() {
        g.setColor(1, 1, 1);
        g.drawImage({
            width: buf.getWidth(),
            height: buf.getHeight(),
            buffer: buf.buffer
        }, 0, 50);
    }
    // The last time that we displayed
    var lastTime = "     ";
    // If animating, this is the interval's id
    var animInterval;
    var lhr = "BPM: ";

    const DIGITS = {
        " ": n => [],
        "0": n => [
            [n, 0, 1, 0],
            [1, 0, 1, 1],
            [1, 1, 1, 2],
            [n, 2, 1, 2],
            [n, 1, n, 2],
            [n, 0, n, 1]
        ],
        "1": n => [
            [1 - n, 0, 1, 0],
            [1, 0, 1, 1],
            [1 - n, 1, 1, 1],
            [1 - n, 1, 1 - n, 2],
            [1 - n, 2, 1, 2]
        ],
        "2": n => [
            [0, 0, 1, 0],
            [1, 0, 1, 1],
            [0, 1, 1, 1],
            [0, 1 + n, 0, 2],
            [1, 2 - n, 1, 2],
            [0, 2, 1, 2]
        ],
        "3": n => [
            [0, 0, 1 - n, 0],
            [0, 0, 0, n],
            [1, 0, 1, 1],
            [0, 1, 1, 1],
            [1, 1, 1, 2],
            [n, 2, 1, 2]
        ],
        "4": n => [
            [0, 0, 0, 1],
            [1, 0, 1 - n, 0],
            [1, 0, 1, 1 - n],
            [0, 1, 1, 1],
            [1, 1, 1, 2],
            [1 - n, 2, 1, 2]
        ],
        "5": (n, maxFive) => maxFive ? [ // 5 -> 0
            [0, 0, 0, 1],
            [0, 0, 1, 0],
            [n, 1, 1, 1],
            [1, 1, 1, 2],
            [0, 2, 1, 2],
            [0, 2, 0, 2],
            [1, 1 - n, 1, 1],
            [0, 1, 0, 1 + n]
        ] : [ // 5 -> 6
            [0, 0, 0, 1],
            [0, 0, 1, 0],
            [0, 1, 1, 1],
            [1, 1, 1, 2],
            [0, 2, 1, 2],
            [0, 2 - n, 0, 2]
        ],
        "6": n => [
            [0, 0, 0, 1 - n],
            [0, 0, 1, 0],
            [n, 1, 1, 1],
            [1, 1 - n, 1, 1],
            [1, 1, 1, 2],
            [n, 2, 1, 2],
            [0, 1 - n, 0, 2 - 2 * n]
        ],
        "7": n => [
            [0, 0, 0, n],
            [0, 0, 1, 0],
            [1, 0, 1, 1],
            [1 - n, 1, 1, 1],
            [1, 1, 1, 2],
            [1 - n, 2, 1, 2],
            [1 - n, 1, 1 - n, 2]
        ],
        "8": n => [
            [0, 0, 0, 1],
            [0, 0, 1, 0],
            [1, 0, 1, 1],
            [0, 1, 1, 1],
            [1, 1, 1, 2],
            [0, 2, 1, 2],
            [0, 1, 0, 2 - n]
        ],
        "9": n => [
            [0, 0, 0, 1],
            [0, 0, 1, 0],
            [1, 0, 1, 1],
            [0, 1, 1 - n, 1],
            [0, 1, 0, 1 + n],
            [1, 1, 1, 2],
            [0, 2, 1, 2]
        ],
        ":": n => [
            [0.4, 0.4, 0.6, 0.4],
            [0.6, 0.4, 0.6, 0.6],
            [0.6, 0.6, 0.4, 0.6],
            [0.4, 0.4, 0.4, 0.6],
            [0.4, 1.4, 0.6, 1.4],
            [0.6, 1.4, 0.6, 1.6],
            [0.6, 1.6, 0.4, 1.6],
            [0.4, 1.4, 0.4, 1.6]
        ]
    };

    /* Draw a transition between lastText and thisText.
     'n' is the amount - 0..1 */
    function draw(lastText, thisText, n) {
        buf.clear();
        var x = 1; // x offset
        const p = 2; // padding around digits
        var y = p; // y offset
        const s = 34; // character size
        for (var i = 0; i < lastText.length; i++) {
            var lastCh = lastText[i];
            var thisCh = thisText[i];
            if (thisCh == ":") x -= 4;
            var ch, chn = n;
            if (lastCh !== undefined &&
                (thisCh - 1 == lastCh ||
                    (thisCh == 0 && lastCh == 5) ||
                    (thisCh == 0 && lastCh == 9))){
                ch = lastCh;
            }
            else {
                ch = thisCh;
                chn = 0;
            }
            var l = DIGITS[ch](chn, lastCh == 5 && thisCh == 0);
            l.forEach(c => {
                if (c[0] != c[2]) // horiz
                    buf.fillRect(x + c[0] * s, y + c[1] * s - p, x + c[2] * s, y + c[3] * s + p);
                else if (c[1] != c[3]) // vert
                    buf.fillRect(x + c[0] * s - p, y + c[1] * s, x + c[2] * s + p, y + c[3] * s);
            });
            if (thisCh == ":") x -= 4;
            x += s + p + 7;
        }
        y += 2 * s;
        var d = new Date();
        buf.setFont("6x8");
        buf.setFontAlign(-1, -1);
        buf.drawString(("0" + d.getSeconds()).substr(-2), x, y - 8);
        // date
        buf.setFontAlign(0, -1);
        var date = d.toString().substr(0, 15);
        buf.drawString(date, buf.getWidth() / 2, y + 8);
        // BPM
        if(hrmPower == 1){
            buf.setFont("6x8");
            buf.setFontVector(12);
            buf.setFontAlign(0, -1);
            buf.drawString(lhr, buf.getWidth() / 2, y + 24);
        }
        if(gpsPower == 1){
            buf.setFont("6x8");
            buf.setFontVector(12);
            buf.setFontAlign(0, -1);
            buf.drawString("GPS ON" , buf.getWidth() / 2, y + 40);
            if(fix != null && fix.satellites > 0){
                buf.setFont("6x8");
                buf.setFontAlign(0, -1);
                buf.drawString(fix.satellites + " satellites" , buf.getWidth() / 2, y + 64);
            }
        }
        if(steps > 0){
            buf.setFont("6x8");
            buf.setFontAlign(0, -1);
            buf.drawString("Steps " + steps, buf.getWidth() / 2, y + 80);
        }
        if(Bangle.AppLog.error){
            buf.setFont("6x8");
            buf.setFontVector(12);
            buf.setFontAlign(0, -1);
            buf.drawString("ERROR" , buf.getWidth() / 2, y + 96);
        }
        if(Bangle.AppLog.diskFull){
            buf.setFont("6x8");
            buf.setFontVector(12);
            buf.setFontAlign(0, -1);
            buf.drawString("DISK FULL" , buf.getWidth() / 2, y + 112);
        }
        flip();
    }

    function showTime() {
        if (!Bangle.isLCDOn()) return;
        if (animInterval) return;
        var t = "";
        var d = new Date();
        var t = (" " + d.getHours()).substr(-2) + ":" +
            ("0" + d.getMinutes()).substr(-2);
        var l = lastTime;
        // same - don't animate
        if (t == l) {
            draw(t, l, 0);
            return;
        }
        var n = 0;
        animInterval = setInterval(function() {
            n += 1 / 10;
            if (n >= 1) {
                n = 1;
                clearInterval(animInterval);
                animInterval = 0;
            }
            draw(l, t, n);
        }, 20);
        lastTime = t;
        Bangle.drawWidgets();
    }

    function formatTime(now) {
        var fd = now.toUTCString().split(" ");
        var time = fd[4].substr(0, 5);
        var date = [fd[0], fd[1], fd[2]].join(" ");
        return time + " - " + date;
    }
    Bangle.on('lcdPower', function(on) {
        if (on) {
            showTime();
            Bangle.drawWidgets();
            //var sentence = `"STEP","${formatTime(previousDate)}","${steps}"`;
            //log(sentence);
        }
    });

    Bangle.on('step', function(f){
        var currentDate = new Date();
        if(previousDate.getDate() == currentDate.getDate()){
            steps++;
        }
        else{
            steps = 1;
        }
        previousDate = currentDate;
        var acc = Bangle.getAccel();
        var sentence = `A,"${(new Date()).toUTCString()}",${acc.x},${acc.y},${acc.z},${acc.diff},${acc.mag}`;
        log(sentence);
    });

    Bangle.on('GPS', function(f) {
        fix = f;
        if(fix.satellites > 0 && fixMissedCount < fixMissedTimeout){
            fixMissedCount = 0;
            setTime(fix.time.getTime() / 1000);
            var sentence = `G,"${(new Date()).toUTCString()}",${fix.satellites},${fix.lat},${fix.lon},${fix.alt},${fix.speed},${fix.course},${fix.time.ms}`;
            log(sentence);
        }
        else{
            ++fixMissedCount;
            /* GPS function is pinged every second so if
            * Satellites are not found for 2 minutes
            * disable GPS
            */
            if(fixMissedCount >= fixMissedTimeout){
                fixMissedCount = 0;
                gpsPower = 0;
                Bangle.setGPSPower(gpsPower);
            }
        }
    });

    Bangle.on('HRM',function(hrm) {
       lhr = "BPM: " + hrm.bpm;
       var sentence = `H,"${(new Date()).toUTCString()}",${hrm.bpm},${hrm.confidence}`;
       log(sentence);
    });

    E.on('kill', () => {
        let d = {
          lastUpdate : previousDate.toISOString(),
          stepsToday : steps,
          logError: Bangle.AppLog.error,
          logFull: Bangle.AppLog.diskFull
        };
        require("Storage").write(FITCLOCKSETTINGS,d);
    });

    function setGPSTime(){
        gpsPower = 1;
        Bangle.setGPSPower(gpsPower);
    }

    function startHRMonitor(){
        hrmPower = 1;
        Bangle.setHRMPower(hrmPower);
    }

    function log(sentence){
        if(Bangle.AppLog.currentFile == null){
            console.log("Trying to create new file:" + fln);
            Bangle.AppLog.init(fln);
        }
        try{
            Bangle.AppLog.write(sentence + "\n");
        }
        catch(ex){
            console.log(ex);
        }
    }

    function toggleHRM(){
        hrmPower = hrmPower===0 ? 1 : 0;
        Bangle.setHRMPower(hrmPower);
    }

    function toggleGPS(){
        gpsPower = gpsPower===0?1:0;
        Bangle.setGPSPower(gpsPower);
    }

    function loadSettings(){
        let fitClockSettings = require("Storage").readJSON(FITCLOCKSETTINGS);
        if (fitClockSettings) {
            if (fitClockSettings.lastUpdate)
                previousDate = new Date(fitClockSettings.lastUpdate);
            steps = fitClockSettings.stepsToday|0;
        }
    }

    function ctor() {
        Bangle.AppLog = {
            currentFile: null,
            lock: false,
            shardCount: 0,
            currentFileName: "",
            error: false,
            diskFull: false,
            init: (filename) => {
                Bangle.AppLog.currentFileName = filename;
                try{
                    if(filename != null && filename != ''){
                        Bangle.AppLog.currentFile = require("Storage").open(filename, "a");
                        console.log("File created: " + filename);
                    }
                    else{
                        console.error("Log file name not provided");
                    }
                }
                catch(ex){
                    console.log("Failed to create file", ex);
                }
            },
            write : (sentence) => {
                if(Bangle.AppLog.lock != true &&
                    Bangle.AppLog.error != true){
                    try{
                        Bangle.AppLog.currentFile.write(sentence);   
                    }   
                    catch (ex){
                        console.log(ex);
                        Bangle.AppLog.currentFile = null;
                        Bangle.AppLog.error = true;
                    }              
                }
            },
            clearLog: () => {
                Bangle.AppLog.lock = true;
                Bangle.AppLog.currentFile = null;
                require("Storage").open(Bangle.AppLog.currentFileName, "w").erase();
                require("Storage").compact();
                Bangle.AppLog.lock = false;
                Bangle.AppLog.error = false;
                //load();
            },
            beginSync: () => {
                var f = require('Storage').open(Bangle.AppLog.currentFileName, 'r');
                var line = '';
                while (line != null && line.indexOf('\xFF') == -1){
                    line = f.readLine();
                    if(line != null){
                        print(line);
                    }
                    else{
                        break;
                    }
                }
                print("<!-- finished sync -->");
                f=null;
            }
        };
        Bangle.AppLog.error = false;

        Bangle.Helper = {
            size: (fileName) => {
                var f = require("Storage").open(fileName, 'r');
                print(f.getLength());
                f = null;
            },
            delete: (fileName) => {
                var f = require("Storage").open(fileName, 'w');
                f.erase();
                f = null;
                require("Storage").compact();
            }
        };

        g.clear();
        loadSettings();
        setInterval(showTime, 1000);
        showTime();
        setGPSTime();
        startHRMonitor();
        
        setWatch(toggleHRM, BTN1, {repeat:true});
        setWatch(toggleGPS, BTN3, {repeat:true});
        Bangle.loadWidgets();
        Bangle.drawWidgets();
    }
    ctor();

})();
