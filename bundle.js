!function(t){var e={};function s(i){if(e[i])return e[i].exports;var n=e[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},s.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=0)}([function(t,e,s){"use strict";s.r(e);class i{constructor(t,e,s){[t.width,t.height]=[e,s],[this.width,this.height]=[e,s];const i=t.getContext("2d");i.lineWidth=2,i.font="20px OCR-A",this.ctx=i}}const n=new(window.AudioContext||window.webkitAudioContext),r=document.querySelector(".video-instance"),h=document.querySelector(".scene"),a=document.querySelector(".interface"),o=document.querySelector(".container"),c=document.querySelector(".mute-speech");window.ya.speechkit.settings.lang="ru-RU",window.ya.speechkit.settings.apikey="566387b4-7405-4692-bb73-3a7ad16d725f",new ya.speechkit.Tts({apikey:"abcd..",emotion:"good",speed:1.5,speaker:"jane"}).speak("Вы используете технологию SpeechKit",{speaker:"omazh",emotion:"neutral"});let[d,l]=[770,650];window.innerWidth<770&&([d,l]=[window.innerWidth,window.innerHeight]);const u=new class{constructor(t,e,s){const i=new s("");i.lang=t,this.msg=i,this.speechSynthesis=e}setRate(t){this.msg.rate=t}setPitch(t){this.msg.pitch=t}setText(t){this.msg.text=t}speak(){const{speechSynthesis:t,msg:e}=this;t.speak(e)}}("en-US",window.speechSynthesis,window.SpeechSynthesisUtterance);u.setRate(1),u.setPitch(.4),u.setText("Movement");const g=new class extends i{constructor(t,e,s,i,n,r,h,a){super(s,i,n),this.constraints={audio:!0,video:{width:i,height:n}},this.video=t,this.audioCtx=e,this.detected=!1,this.detectingInProcess=!1,this.speaker=r,this.containerElement=h,this.muteSpeech=!0,this.muteButton=a,this.rgb={r:0,g:0,b:0},this.oldRgb={r:0,g:0,b:0}}load(){const{audioCtx:t}=this,e=t.createAnalyser();e.minDecibels=-80,e.maxDecibels=-8,e.smoothingTimeConstant=.7,e.fftSize=2048,this.analyser=e,navigator.mediaDevices.getUserMedia(this.constraints).then(s=>{this.video.srcObject=s,t.createMediaStreamSource(s).connect(e),this.animate()})}getAnalyser(){return this.analyser}toggleMuteSpeech(){this.muteSpeech?(this.muteSpeech=!1,this.muteButton.innerHTML="TURN OFF SYNHTHSPEECH"):(this.muteSpeech=!0,this.muteButton.innerHTML="TURN ON SYNHTHSPEECH")}detectMove(){const{detectingInProcess:t,oldRgb:e,rgb:s,speaker:i}=this;t||(Math.abs(e.r-s.r)+Math.abs(e.g-s.g)+Math.abs(e.b-s.b)>7?(this.muteSpeech||i.speak(),this.containerElement.classList.add("red"),this.setDetected(!0),this.setDetectedInProcess(!0),setTimeout(()=>{this.containerElement.classList.remove("red"),this.setDetectedInProcess(!1),this.setOldRGB(s)},2500)):this.setDetected(!1))}setDetected(t){this.detected=t}getDetected(){return this.detected}setDetectedInProcess(t){this.detectingInProcess=t}setRGB(t){this.rgb=t}setOldRGB(t){this.oldRgb=t}getRGB(){return this.rgb}drawVideo(){this.ctx.drawImage(this.video,0,0,this.width,this.height)}drawNoiseAndComputeAvarageColor(){const t=this.ctx.getImageData(0,0,this.width,this.height),e={r:0,g:0,b:0},{data:s}=t,{length:i}=s;let n=0,r=0,h=0;for(;n<i;)h+=1,e.r+=s[n],e.g+=s[n+1],e.b+=s[n+2],r=.5-Math.random(),s[n]+=255*r,s[n+1]+=255*r,s[n+2]+=255*r,n+=60;this.ctx.putImageData(t,0,0),e.r=Math.round(e.r/h),e.g=Math.round(e.g/h),e.b=Math.round(e.b/h),this.setRGB(e)}animate(){this.drawVideo(),this.drawNoiseAndComputeAvarageColor(),requestAnimationFrame(this.animate.bind(this))}}(r,n,h,d,l,u,o,c);g.load(),new class extends i{constructor(t,e,s){super(t,e,s),this.bufferLength=2048}connectScene(t){return new Promise(e=>{this.scene=t;const s=t.getAnalyser();s.fftSize=2048;const i=s.fftSize,n=new Uint8Array(i);[this.analyser,this.bufferLength,this.dataArray]=[s,i,n],e(this)})}valToHex(t){const e=t.toString(16);return 1===e.length?`0${e}`:e}rgbToHex(t,e,s){return`#${this.valToHex(t)}${this.valToHex(e)}${this.valToHex(s)}`}drawDetected(){this.ctx.fillStyle="#00ffff",this.ctx.fillText("MOVEMENT_DETECTED",10,125)}clearCanvas(){this.ctx.clearRect(0,0,this.width,this.height)}setFillStyle(t){this.ctx.fillStyle=t}setStrokeStyle(t){this.ctx.strokeStyle=t}drawHistogramm(){this.setFillStyle("rgb(200, 200, 200)"),this.setStrokeStyle("rgb(204, 255, 255)"),this.analyser.getByteTimeDomainData(this.dataArray),this.ctx.beginPath();const t=320/this.bufferLength;let e=10,s=0;for(let i=0;i<this.bufferLength;i+=1){const n=this.dataArray[i]/128*60;s+=Math.abs(this.dataArray[i]-128);const r=180+n;0===i?this.ctx.moveTo(e,r):this.ctx.lineTo(e,r),e+=t}this.ctx.stroke(),this.drawAverageVolume(s)}drawAverageVolume(t){const e=t/this.bufferLength*15+20,s=Math.min(Math.round(e/5),75);for(let t=0;t<=s;t+=1)this.setFillStyle(`rgb(${Math.min(5*t,255)}, ${Math.max(255-3*t,0)}, 50)`),this.ctx.fillRect(this.width-35,this.height-5-5*t,30,-3)}drawTexts(t){this.setFillStyle("#FFFFFF"),this.ctx.fillText(`AVERAGE_COLOR: ${t}`,10,50),this.ctx.fillText(`CURR_TIME: ${(new Date).getTime()}`,10,75),this.ctx.fillText(`T_4_HUMAN: ${(new Date).toDateString()}`,10,100)}drawAvarageColorRect(t){this.ctx.fillStyle=t,this.ctx.fillRect(10,140,320,30),this.ctx.strokeStyle="#fff",this.ctx.strokeRect(10,140,320,30)}animate(){const t=this.scene.getRGB(),e=this.rgbToHex(t.r,t.g,t.b);this.clearCanvas(),this.drawHistogramm(),this.drawTexts(e),this.drawAvarageColorRect(e),this.scene.getDetected()&&this.drawDetected(),this.scene.detectMove(),requestAnimationFrame(this.animate.bind(this))}}(a,d,l).connectScene(g).then(t=>t.animate()),c.addEventListener("click",()=>{g.toggleMuteSpeech()})}]);