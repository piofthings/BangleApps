!function(){var e=require("Storage");var t=0,n=0,a=null,r=0,l=0,o=new Date,i=Graphics.createArrayBuffer(240,240,1,{msb:!0});var s,c="     ",u="BPM: ";const p={" ":e=>[],0:e=>[[e,0,1,0],[1,0,1,1],[1,1,1,2],[e,2,1,2],[e,1,e,2],[e,0,e,1]],1:e=>[[1-e,0,1,0],[1,0,1,1],[1-e,1,1,1],[1-e,1,1-e,2],[1-e,2,1,2]],2:e=>[[0,0,1,0],[1,0,1,1],[0,1,1,1],[0,1+e,0,2],[1,2-e,1,2],[0,2,1,2]],3:e=>[[0,0,1-e,0],[0,0,0,e],[1,0,1,1],[0,1,1,1],[1,1,1,2],[e,2,1,2]],4:e=>[[0,0,0,1],[1,0,1-e,0],[1,0,1,1-e],[0,1,1,1],[1,1,1,2],[1-e,2,1,2]],5:(e,t)=>t?[[0,0,0,1],[0,0,1,0],[e,1,1,1],[1,1,1,2],[0,2,1,2],[0,2,0,2],[1,1-e,1,1],[0,1,0,1+e]]:[[0,0,0,1],[0,0,1,0],[0,1,1,1],[1,1,1,2],[0,2,1,2],[0,2-e,0,2]],6:e=>[[0,0,0,1-e],[0,0,1,0],[e,1,1,1],[1,1-e,1,1],[1,1,1,2],[e,2,1,2],[0,1-e,0,2-2*e]],7:e=>[[0,0,0,e],[0,0,1,0],[1,0,1,1],[1-e,1,1,1],[1,1,1,2],[1-e,2,1,2],[1-e,1,1-e,2]],8:e=>[[0,0,0,1],[0,0,1,0],[1,0,1,1],[0,1,1,1],[1,1,1,2],[0,2,1,2],[0,1,0,2-e]],9:e=>[[0,0,0,1],[0,0,1,0],[1,0,1,1],[0,1,1-e,1],[0,1,0,1+e],[1,1,1,2],[0,2,1,2]],":":e=>[[.4,.4,.6,.4],[.6,.4,.6,.6],[.6,.6,.4,.6],[.4,.4,.4,.6],[.4,1.4,.6,1.4],[.6,1.4,.6,1.6],[.6,1.6,.4,1.6],[.4,1.4,.4,1.6]]};function f(e,r,o){i.clear();var s=1;var c=2;const f=34;for(var d=0;d<e.length;d++){var w=e[d],B=r[d];":"==B&&(s-=4);var S,A=o;void 0!==w&&(B-1==w||0==B&&5==w||0==B&&9==w)?S=w:(S=B,A=0),p[S](A,5==w&&0==B).forEach(e=>{e[0]!=e[2]?i.fillRect(s+e[0]*f,c+e[1]*f-2,s+e[2]*f,c+e[3]*f+2):e[1]!=e[3]&&i.fillRect(s+e[0]*f-2,c+e[1]*f,s+e[2]*f+2,c+e[3]*f)}),":"==B&&(s-=4),s+=43}c+=68;var v=new Date;i.setFont("6x8"),i.setFontAlign(-1,-1),i.drawString(("0"+v.getSeconds()).substr(-2),s,c-8),i.setFontAlign(0,-1);var F=v.toString().substr(0,15);i.drawString(F,i.getWidth()/2,c+8),1==t&&(i.setFont("6x8"),i.setFontVector(12),i.setFontAlign(0,-1),i.drawString(u,i.getWidth()/2,c+24)),1==n&&(i.setFont("6x8"),i.setFontVector(12),i.setFontAlign(0,-1),i.drawString("GPS ON",i.getWidth()/2,c+40),null!=a&&a.satellites>0&&(i.setFont("6x8"),i.setFontAlign(0,-1),i.drawString(a.satellites+" satellites",i.getWidth()/2,c+56))),l>0&&(i.setFont("6x8"),i.setFontAlign(0,-1),i.drawString("Steps "+l,i.getWidth()/2,c+64)),g.setColor(1,1,1),g.drawImage({width:i.getWidth(),height:i.getHeight(),buffer:i.buffer},0,50)}function d(){if(Bangle.isLCDOn()&&!s){var e=new Date,t=(" "+e.getHours()).substr(-2)+":"+("0"+e.getMinutes()).substr(-2),n=c;if(t!=n){var a=0;s=setInterval((function(){(a+=.1)>=1&&(a=1,clearInterval(s),s=0),f(n,t,a)}),20),c=t}else f(t,n,0)}}function w(e){var t=e.toUTCString().split(" ");return t[4].substr(0,5)+" - "+[t[0],t[1],t[2]].join(" ")}function B(e){null==Bangle.AppLog.currentFile&&(console.log("Trying to create new fileftclog"),Bangle.AppLog.init());try{Bangle.AppLog.write(e)}catch(e){e.message.startWith("Unable to find or create")&&Bangle.AppLog.init("ftclog")}}function S(){t=0===t?1:0,Bangle.setHRMPower(t)}function A(){n=0===n?1:0,Bangle.setGPSPower(n)}Bangle.on("lcdPower",(function(e){e&&(d(),Bangle.drawWidgets())})),Bangle.on("step",(function(e){var t=new Date;o.getDate()==t.getDate()?l++:l=1,o=t;var n=Bangle.getAccel();B(`"ACCL","${w(new Date)}","${n.x}","${n.y}","${n.z}","${n.diff}","${n.mag}"`)})),Bangle.on("GPS",(function(e){(a=e).satellites>0&&r<180?(r=0,setTime(a.time.getTime()/1e3),B(`"GPS","${w(new Date)}","${a.satellites}","${a.lat}","${a.lon}","${a.alt}","${a.speed}","${a.course}","${a.time.ms}"`)):++r>=180&&(r=0,n=0,Bangle.setGPSPower(n))})),Bangle.on("HRM",(function(e){u="BPM: "+e.bpm,B(`"HRM","${w(new Date)}","${e.bpm}","${e.confidence}"`)})),E.on("kill",()=>{let e={lastUpdate:o.toISOString(),stepsToday:l};require("Storage").write("@fitclck",e)}),Bangle.AppLog={currentFile:null,lock:!1,init:t=>{try{Bangle.AppLog.currentFile=e.open(t,"a")}catch(e){console.log("Failed to create file",e)}},write:e=>{1!=Bangle.AppLog.lock&&Bangle.AppLog.currentFile.write(e+"\n")},clearLog:()=>{Bangle.AppLog.lock=!0,Bangle.AppLog.currentFile=null,require("Storage").open("ftclog","w").erase(),Bangle.AppLog.lock=!1,load()}},g.clear(),function(){let e=require("Storage").readJSON("@fitclck");e&&(e.lastUpdate&&(o=new Date(e.lastUpdate)),l=0|e.stepsToday)}(),setInterval(d,1e3),d(),n=1,Bangle.setGPSPower(n),t=1,Bangle.setHRMPower(t),setWatch(S,BTN1,{repeat:!0}),setWatch(A,BTN3,{repeat:!0}),Bangle.loadWidgets(),Bangle.drawWidgets()}();