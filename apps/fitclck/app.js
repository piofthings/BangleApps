!function(){var e=require("Storage");var t=0,n=0,r=null,l=0,o=0,a=new Date,i=Graphics.createArrayBuffer(240,240,1,{msb:!0});var s,c="     ",p="BPM: ";const u={" ":e=>[],0:e=>[[e,0,1,0],[1,0,1,1],[1,1,1,2],[e,2,1,2],[e,1,e,2],[e,0,e,1]],1:e=>[[1-e,0,1,0],[1,0,1,1],[1-e,1,1,1],[1-e,1,1-e,2],[1-e,2,1,2]],2:e=>[[0,0,1,0],[1,0,1,1],[0,1,1,1],[0,1+e,0,2],[1,2-e,1,2],[0,2,1,2]],3:e=>[[0,0,1-e,0],[0,0,0,e],[1,0,1,1],[0,1,1,1],[1,1,1,2],[e,2,1,2]],4:e=>[[0,0,0,1],[1,0,1-e,0],[1,0,1,1-e],[0,1,1,1],[1,1,1,2],[1-e,2,1,2]],5:(e,t)=>t?[[0,0,0,1],[0,0,1,0],[e,1,1,1],[1,1,1,2],[0,2,1,2],[0,2,0,2],[1,1-e,1,1],[0,1,0,1+e]]:[[0,0,0,1],[0,0,1,0],[0,1,1,1],[1,1,1,2],[0,2,1,2],[0,2-e,0,2]],6:e=>[[0,0,0,1-e],[0,0,1,0],[e,1,1,1],[1,1-e,1,1],[1,1,1,2],[e,2,1,2],[0,1-e,0,2-2*e]],7:e=>[[0,0,0,e],[0,0,1,0],[1,0,1,1],[1-e,1,1,1],[1,1,1,2],[1-e,2,1,2],[1-e,1,1-e,2]],8:e=>[[0,0,0,1],[0,0,1,0],[1,0,1,1],[0,1,1,1],[1,1,1,2],[0,2,1,2],[0,1,0,2-e]],9:e=>[[0,0,0,1],[0,0,1,0],[1,0,1,1],[0,1,1-e,1],[0,1,0,1+e],[1,1,1,2],[0,2,1,2]],":":e=>[[.4,.4,.6,.4],[.6,.4,.6,.6],[.6,.6,.4,.6],[.4,.4,.4,.6],[.4,1.4,.6,1.4],[.6,1.4,.6,1.6],[.6,1.6,.4,1.6],[.4,1.4,.4,1.6]]};function d(e,l,a){i.clear();var s=1;var c=2;const d=34;for(var B=0;B<e.length;B++){var f=e[B],F=l[B];":"==F&&(s-=4);var A,w=a;void 0!==f&&(F-1==f||0==F&&5==f||0==F&&9==f)?A=f:(A=F,w=0),u[A](w,5==f&&0==F).forEach(e=>{e[0]!=e[2]?i.fillRect(s+e[0]*d,c+e[1]*d-2,s+e[2]*d,c+e[3]*d+2):e[1]!=e[3]&&i.fillRect(s+e[0]*d-2,c+e[1]*d,s+e[2]*d+2,c+e[3]*d)}),":"==F&&(s-=4),s+=43}c+=68;var L=new Date;i.setFont("6x8"),i.setFontAlign(-1,-1),i.drawString(("0"+L.getSeconds()).substr(-2),s,c-8),i.setFontAlign(0,-1);var S=L.toString().substr(0,15);i.drawString(S,i.getWidth()/2,c+8),1==t&&(i.setFont("6x8"),i.setFontVector(12),i.setFontAlign(0,-1),i.drawString(p,i.getWidth()/2,c+24)),1==n&&(i.setFont("6x8"),i.setFontVector(12),i.setFontAlign(0,-1),i.drawString("GPS ON",i.getWidth()/2,c+40),null!=r&&r.satellites>0&&(i.setFont("6x8"),i.setFontAlign(0,-1),i.drawString(r.satellites+" satellites",i.getWidth()/2,c+64))),o>0&&(i.setFont("6x8"),i.setFontAlign(0,-1),i.drawString("Steps "+o,i.getWidth()/2,c+80)),Bangle.AppLog.error&&(i.setFont("6x8"),i.setFontVector(12),i.setFontAlign(0,-1),i.drawString("ERROR",i.getWidth()/2,c+96)),Bangle.AppLog.diskFull&&(i.setFont("6x8"),i.setFontVector(12),i.setFontAlign(0,-1),i.drawString("DISK FULL",i.getWidth()/2,c+112)),g.setColor(1,1,1),g.drawImage({width:i.getWidth(),height:i.getHeight(),buffer:i.buffer},0,50)}function B(){if(Bangle.isLCDOn()&&!s){var e=new Date,t=(" "+e.getHours()).substr(-2)+":"+("0"+e.getMinutes()).substr(-2),n=c;if(t!=n){var r=0;s=setInterval((function(){(r+=.1)>=1&&(r=1,clearInterval(s),s=0),d(n,t,r)}),20),c=t}else d(t,n,0)}}function f(e){null==Bangle.AppLog.currentFile&&(console.log("Trying to create new file:ftclog"),Bangle.AppLog.init("ftclog"));try{Bangle.AppLog.write(e+"\n")}catch(e){console.log(e)}}function F(){t=0===t?1:0,Bangle.setHRMPower(t)}function A(){n=0===n?1:0,Bangle.setGPSPower(n)}Bangle.on("lcdPower",(function(e){e&&(B(),Bangle.drawWidgets())})),Bangle.on("step",(function(e){var t=new Date;a.getDate()==t.getDate()?o++:o=1,a=t;var n=Bangle.getAccel();f(`A,"${(new Date).toUTCString()}",${n.x},${n.y},${n.z},${n.diff},${n.mag}`)})),Bangle.on("GPS",(function(e){(r=e).satellites>0&&l<180?(l=0,setTime(r.time.getTime()/1e3),f(`G,"${(new Date).toUTCString()}",${r.satellites},${r.lat},${r.lon},${r.alt},${r.speed},${r.course},${r.time.ms}`)):++l>=180&&(l=0,n=0,Bangle.setGPSPower(n))})),Bangle.on("HRM",(function(e){p="BPM: "+e.bpm,f(`H,"${(new Date).toUTCString()}",${e.bpm},${e.confidence}`)})),E.on("kill",()=>{let e={lastUpdate:a.toISOString(),stepsToday:o,logError:Bangle.AppLog.error,logFull:Bangle.AppLog.diskFull};require("Storage").write("@fitclck",e)}),Bangle.AppLog={currentFile:null,lock:!1,shardCount:0,currentFileName:"",error:!1,diskFull:!1,init:t=>{Bangle.AppLog.currentFileName=t;try{null!=t&&""!=t?Bangle.AppLog.currentFile=e.open(t,"a"):console.error("Log file name not provided")}catch(e){console.log("Failed to create file",e)}},write:e=>{if(1!=Bangle.AppLog.lock&&1!=Bangle.AppLog.error)try{require("Storage").getFree()>(e+="\n").length?Bangle.AppLog.currentFile.write(e):Bangle.AppLog.diskFull=!0}catch(e){console.log(e),Bangle.AppLog.currentFile=null,Bangle.AppLog.error=!0}},clearLog:()=>{Bangle.AppLog.lock=!0,Bangle.AppLog.currentFile=null,require("Storage").open(Bangle.AppLog.currentFileName,"w").erase(),Bangle.AppLog.lock=!1,Bangle.AppLog.error=!1,load()},beginSync:()=>{for(var e=require("Storage").open(Bangle.AppLog.currentFile,"r"),t="";null!=t&&null!=t&&-1==t.indexOf("ÿ");)t=e.readLine(),print(t);print("\x3c!-- finished sync --\x3e")}},Bangle.AppLog.error=!1,Bangle.Helper={size:()=>{var e=require("Storage").open(Bangle.AppLog.currentFile,"r");print(e.getLength())}},g.clear(),function(){let e=require("Storage").readJSON("@fitclck");e&&(e.lastUpdate&&(a=new Date(e.lastUpdate)),o=0|e.stepsToday)}(),setInterval(B,1e3),B(),n=1,Bangle.setGPSPower(n),t=1,Bangle.setHRMPower(t),setWatch(F,BTN1,{repeat:!0}),setWatch(A,BTN3,{repeat:!0}),Bangle.loadWidgets(),Bangle.drawWidgets()}();