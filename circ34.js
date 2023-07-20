"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;
const CSO=100;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.border="6px solid #555";
  d.append(c);
  return c.getContext("2d");
})();

const ctxo=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSO;
  return c.getContext("2d");
})();
ctxo.setTransform(1,0,0,1,CSO,CSO);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=80;
  const CT=255-CBASE;
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.set=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    this.v="rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=40+160*Math.random();
    this.GK1=40+160*Math.random();
    this.BK1=40+160*Math.random();
  }
  this.randomize();
  this.set();
}

const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);

var drawTile=()=>{
  let a=TP*t/1200;
  let x=1.42*CSO*Math.cos(a);
  let y=1.42*CSO*Math.sin(a);
  let path=new Path2D();
  path.moveTo(0,0);
  path.lineTo(x,y);
  let p=new Path2D(path);
  p.addPath(p,dm1);
  p.addPath(p,dm2);
  let d1=Math.max(40,40+80*Math.cos(t/K3));
  let d2=Math.max(10,60+60*Math.cos(t/K5));
  ctxo.setLineDash([d1,d2]);
  ctxo.lineDashOffset=0;
  ctxo.strokeStyle=color.v;
  ctxo.stroke(p);
  ctxo.setLineDash([d2,d1]);
  ctxo.lineDashOffset=d2;
  ctxo.strokeStyle=color2.v;
  ctxo.stroke(p);
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var pauseTS=1000;
var pause=(ts)=>{
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  color.set();
  color2.set();
  draw();
  if (t%300==0) {
    reset();
    pauseTS=performance.now()+2000;
    requestAnimationFrame(pause);
if (EM) stopped=true;
  } else requestAnimationFrame(animate);
}

ctx.lineWidth=3;
var K2=TP*Math.random();
var K3=100+200*Math.random();
var K4=TP*Math.random();
var K5=100+200*Math.random();
var color=new Color();
var color2=new Color();

var reset=()=>{
  K3=40+200*Math.random();
  K5=40+200*Math.random();
  if (Math.random()<0.1) color.randomize();
  if (Math.random()<0.1) color2.randomize();
}

const x1=160;
const x2=320;

var draw=()=>{
  drawTile();
  let d=-60*Math.sin(t/220);
  let d2=-60*Math.sin(t/230);
  let q=(x1+d)/(2*CSO);
  let q2=(x2+d2-x1-d)/(2*CSO);
  let q3=(2*CSIZE-2*(x2+d2))/(2*CSO);
  let qa=[q,q2,q3,q2,q];
  let da=[0,d,d2,-d2,-d];
  for (let i=0; i<5; i++) {
    for (let j=0; j<5; j++) {
      ctx.setTransform(qa[j],0,0,qa[i],j*160+da[j],i*160+da[i]);
      ctx.drawImage(ctxo.canvas,0,0);
    }
  }
/*
  for (let i=0; i<5; i++) {
    for (let j=0; j<5; j++) {
      ctx.drawImage(ctxo.canvas,-CSIZE+i*2*CSO,-CSIZE+j*2*CSO);
    }
  }
*/
}

onresize();
start();
