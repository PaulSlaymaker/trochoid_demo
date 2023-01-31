"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var colors=[];
var hues=[];
var setColors=()=>{
  colors=[];
  let colorCount=3;
  //let h=getRandomInt(180,270);
  let h=getRandomInt(0,360);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(150/colorCount)*i+getRandomInt(-10,10);
    let hue=(h+hd)%360;
    hues.splice(getRandomInt(0,hues.length+1),0,hue);
  }
  for (let i=0; i<colorCount; i++) colors[i]="hsl("+hues[i]+",98%,60%)";
}
setColors();

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
var t=0;
var pause=0;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t%6==0) {
    for (let i=0; i<hues.length; i++) {
      hues[i]=++hues[i]%360;
      colors[i]="hsl("+hues[i]+",98%,60%)";
    }
  }
  if (pause<120) {
    if (!draw()) pause++;
  } else if (pause++<200) {
    ctx.canvas.style.opacity=1-(pause-120)/80;
  } else {
    ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
    ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    ctx.canvas.style.opacity=1;
    reset();
    t=0;
    pause=0;
  }
  requestAnimationFrame(animate);
}

onresize();

ctx.lineWidth=6;
let dash=[TP*(CSIZE-20)/120,TP*(CSIZE-20)/40];
let path=new Path2D();
path.arc(0,0,CSIZE-20,0,TP);

var k1=TP*Math.random();
var f1=1+3*Math.random();
var k2=TP*Math.random();
var f2=1+3*Math.random();
var k3=TP*Math.random();
var f3=1+3*Math.random();
var k4=TP*Math.random();
var f4=1+3*Math.random();

var reset=()=>{
  k1=TP*Math.random();
  f1=1+3*Math.random();
  k2=TP*Math.random();
  f2=1+3*Math.random();
  k3=TP*Math.random();
  f3=1+3*Math.random();
  k4=TP*Math.random();
  f4=1+3*Math.random();
  setColors();
}

ctx.strokeStyle="yellow";
var draw=()=>{
  let Z=Math.pow(Math.cos(t/800),0.5);
  if (isNaN(Z)) return false;
  let s1=Z*(0.1+0.6*Math.pow(Math.cos(k1+f1*t/700),2));
  let s2=Z*(0.1+0.6*Math.pow(Math.sin(k2+f2*t/700),2));
  let s3=Z*(0.1+0.6*Math.pow(Math.sin(k3+f3*t/700),2));
  let s4=Z*(0.1+0.6*Math.pow(Math.cos(k4+f4*t/700),2));
  ctx.setTransform(s1,s2,-s3,s4,CSIZE,CSIZE);
  ctx.lineDashOffset=2*t;
  ctx.setLineDash(dash);
  ctx.strokeStyle=colors[0];
  ctx.lineWidth=10;
  ctx.stroke(path);
  ctx.lineDashOffset=-2*t;
  ctx.strokeStyle=colors[1];
  ctx.stroke(path);
  ctx.setLineDash([]);
  ctx.strokeStyle="#0000000C";
  ctx.lineWidth=30;
  ctx.stroke(path);
  return true;
}

start();
