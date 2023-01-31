"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/eYjrBae
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
var setColors=()=>{
  colors=[];
  let colorCount=2;
  let h=getRandomInt(180,300);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(90/colorCount)*i+getRandomInt(-10,10);
    let hue=(h+hd)%360;
    colors.push("hsl("+hue+",98%,60%)");
  }
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
var S=2;
var s=0;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t<dur) draw();
  if (t==dur && ++s<S) {
    reset();
    t=0;
  }
  if (t>dur+200) {
    ctx.canvas.style.opacity=1-(t-dur-200)/60;
  } 
  if (t>dur+200+60) {
    reset();
    t=0;
    s=0;
    S=getRandomInt(1,5);
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,2*CSIZE,2*CSIZE);
    ctx.canvas.style.opacity=1;
  }
  requestAnimationFrame(animate);
}

onresize();

var F1=4*Math.random();
var F2=4*Math.random();
var F3=4*Math.random();
var F4=4*Math.random();
var P1=1-2*Math.random();
var P2=(1-Math.abs(P1))*[-1,1][getRandomInt(0,2)];
var P3=1-2*Math.random();
var P4=(1-Math.abs(P3))*[-1,1][getRandomInt(0,2)];
var dash1=[];
var dash2=[];
var reset=()=>{
  F1=4*Math.random();
  F2=4*Math.random();
  F3=4*Math.random();
  F4=4*Math.random();
  P3=1-2*Math.random();
  P4=(1-Math.abs(P3))*[-1,1][getRandomInt(0,2)];
/*
  K1=TP*Math.random();
*/
  //K1=getRandomInt(1,10)*[-1,1][getRandomInt(0,2)];
  //K2=getRandomInt(1,10)*[-1,1][getRandomInt(0,2)];
  K1=10-20*Math.random();
  K2=10-20*Math.random();
//if (Math.random()<0.4) ctx.setLineDash([dim*Math.random(),dim*Math.random()]);
//else ctx.setLineDash([]);
if (Math.random()<0.4) dash1=([dim*Math.random(),dim*Math.random()]);
else dash1=[];
if (Math.random()<0.4) dash2=([dim*Math.random(),dim*Math.random()]);
else dash2=[];
  setColors();
}

const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);
const dm3=new DOMMatrix([0,1,-1,0,0,0]);

var dur=600;
var dim=60;
var R=70;
ctx.fillStyle="#00000008";
var K1=getRandomInt(1,10);
var K2=getRandomInt(1,10);
ctx.lineWidth=10;
var draw=()=>{
  let z=TP/4*t/dur;
  let x=340*(P1*Math.cos(F1*z)+P2*Math.cos(F2*z));
  let y=340*(P3*Math.sin(F3*z)+P4*Math.sin(F4*z));
  let pd=new Path2D();
  pd.arc(x,y,R,0,TP);
  pd.addPath(pd,dm1);
  pd.addPath(pd,dm2);
  pd.addPath(pd,dm3);
  ctx.fill(pd);
  let s=Math.pow(Math.sin(TP/2*t/dur),2);
  ctx.setTransform(s,0,0,s,CSIZE,CSIZE);
  let dx=dim*Math.cos(K1*z);
  let dy=dim*Math.sin(K1*z);
  let p0=new Path2D();
  p0.moveTo(x-dx,y-dy);
  p0.lineTo(x+dx,y+dy);
  p0.addPath(p0,dm1);
  p0.addPath(p0,dm2);
  p0.addPath(p0,dm3);
  ctx.strokeStyle=colors[0];
  ctx.setLineDash(dash1);
  ctx.stroke(p0);
  dx=dim*Math.cos(-K2*z);
  dy=dim*Math.sin(-K2*z);
  let p1=new Path2D();
  p1.moveTo(x-dx,y-dy);
  p1.lineTo(x+dx,y+dy);
  p1.addPath(p1,dm1);
  p1.addPath(p1,dm2);
  p1.addPath(p1,dm3);
  ctx.strokeStyle=colors[1];
  ctx.setLineDash(dash2);
  ctx.stroke(p1);
}

start();
