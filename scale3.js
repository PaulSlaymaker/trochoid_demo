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
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
//ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var hues=[];
var getHues=()=>{
  let h=[];
  let hueCount=3;
  let hue=getRandomInt(0,200);
  for (let i=0; i<hueCount; i++) {
    let hd=(hue+Math.round(150/hueCount)*i+getRandomInt(-10,10))%360;
    h.splice(getRandomInt(0,h.length+1),0,hd);
  }
  return h;
}
var hues=getHues();

var colors=[];
var setColors=()=>{
  colors[0]="hsl("+hues[0]+",90%,60%)";
  colors[1]="hsl("+hues[1]+",90%,60%)";
  colors[2]="hsl("+hues[2]+",90%,60%)";
}

function start() {
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
var t=getRandomInt(-2000,2000);
function animate(ts) {
  if (stopped) return;
  t++;
  if (t%40==0) {
    for (let i=0; i<hues.length; i++) {
      hues[i]=++hues[i]%360;
      colors[i]="hsl("+hues[i]+",90%,60%)";
    }
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();
setColors();
ctx.strokeStyle=colors[1];

var path=new Path2D();
path.arc(0,0,CSIZE,0,TP);

ctx.globalCompositeOperation="lighter";
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let dm=new DOMMatrix();
let K3=30*Math.sin(t/770);
let K4=20*Math.sin(t/700);
  for (let i=0; i<56; i++) {
let a=(t-K3*i)/730;
let f=0.92+0.05*Math.cos((t-K4*i)/190);
let dm1=new DOMMatrix([Math.cos(a),Math.sin(a),-f*Math.sin(a),f*Math.cos(a),0,0]);
    let p=new Path2D();
    dm=dm.multiply(dm1);
    p.addPath(path, dm);
let q=Math.abs(dm.a)+Math.abs(dm.b)+Math.abs(dm.c)+Math.abs(dm.d);
ctx.strokeStyle=colors[i%colors.length];
    ctx.lineWidth=0.3+7*q/4;
    ctx.stroke(p);
  }
  ctx.rotate(-1/100);
}

start();
