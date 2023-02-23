"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/YzOqmvp
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
var CSIZE=16;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
ctx.lineWidth=16;

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var stopped=true;
function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var t=0;
var inc=-0.0007;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  ro=TP*Math.cos(rk+t/1500);
  go=TP*Math.cos(gk+t/1490);
  bo=TP*Math.cos(bk+t/1510);
  rexp+=inc;
  if (rexp<0) { rexp=-rexp; inc*=-1; }
  if (rexp>20) inc*=-1;
  drawEM();
if (EM && t%200==0) stopped=true;
  requestAnimationFrame(animate);
}

var rk=TP*Math.random();
var ro=0;
var gk=TP*Math.random();
var go=0;
var bk=TP*Math.random();
var bo=0;

var rexp=2;

var cpix=ctx.createImageData(2*CSIZE,2*CSIZE); 
for (let i=0; i<2*CSIZE; i++) {
  for (let j=0; j<2*CSIZE; j++) {
    let x=j-CSIZE;
    let y=i-CSIZE;
    let r=Math.pow(x*x+y*y,0.5);
    let ff=1-Math.min(1,Math.pow(r/CSIZE,4));
    cpix.data[(i*8*CSIZE)+j*4+3]=ff*255;
  }
}

var drawEM=()=>{
  for (let i=0; i<2*CSIZE; i++) {
    for (let j=0; j<2*CSIZE; j++) {
      let x=j-CSIZE;
      let y=i-CSIZE;
      let rm=Math.pow(x*x+y*y,0.5);
      let rx=Math.pow(rexp/rm,0.1);
      let r=Math.pow(x*x+y*y,rx);
      let r2=Math.pow(x*x+y*y,rx+0.001);
      let r3=Math.pow(x*x+y*y,rx+0.0005);
      cpix.data[(i*8*CSIZE)+j*4]=  Math.max(0,Math.round((250*Math.sin(TP*r+ro))));
      cpix.data[(i*8*CSIZE)+j*4+1]=Math.max(0,Math.round((250*Math.sin(TP*r2+go))));
      cpix.data[(i*8*CSIZE)+j*4+2]=Math.max(0,Math.round((250*Math.sin(TP*r3+bo))));
    }
  }
  ctx.putImageData(cpix,0,0);
}

onresize();

start();
