"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/wvYppWj
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
  c.style.border="6px solid #444";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  //const CBASE=127;
  const CBASE=159;
  const CT=255-CBASE;
  this.RK1=20+20*Math.random();
  this.GK1=20+20*Math.random();
  this.BK1=20+20*Math.random();
  this.AK1=80+80*Math.random();
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.AK2=TP*Math.random();
  this.set=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1));
    let alp=Math.pow(Math.cos(this.AK2+c/this.AK1),2);
    this.v="rgba("+red+","+grn+","+blu+","+alp+")";
  }
  this.set();
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

var t=0;
var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  c++;
//ctx.globalAlpha=Math.pow(Math.sin(TP/4*t/400),10);
  color.set();
  color2.set();
  if ((t+300)%600==0) {
    K=400/(2*getRandomInt(1,6,true));
    KK=100+1000*Math.random();
    sq=Math.random()<0.7;
  }
  if (t==1800) {
    t=0;
  }
  draw();
  requestAnimationFrame(animate);
}

var color=new Color();
var color2=new Color();

onresize();

ctx.lineWidth=3;

var line=new Path2D();
//line.moveTo(-CSIZE,-CSIZE);
//line.lineTo(-CSIZE,CSIZE);
line.moveTo(-CSIZE,0);
line.lineTo(-CSIZE,-CSIZE);
line.moveTo(-CSIZE,0);
line.lineTo(-CSIZE,CSIZE);
//ctx.strokeStyle="white";
var K=400/(2*getRandomInt(1,6,true));
var kk=0;
var KK=2000;
var sq=Math.random()<0.7;
const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([0,1,-1,0,0,0]);

var draw=()=>{
 //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let d=400*Math.sin(TP/4*t/900);
  let p=new Path2D();
  p.addPath(line,new DOMMatrix([1,0,0,1,d,0]));
  p.addPath(line,new DOMMatrix([1,0,0,1,400-d,0]));
 //p.addPath(line,new DOMMatrix([1,0,0,1,200-d,0]));
 //p.addPath(line,new DOMMatrix([1,0,0,1,200+d,0]));
  p.addPath(p,dm1);
  p.addPath(p,dm2);
//let z=Math.pow(Math.cos(Math.PI*c/1200),2);
//ctx.setTransform(z,0,0,z,CSIZE,CSIZE);

  ctx.lineWidth=8;
  ctx.strokeStyle="#0000000C";
  ctx.setLineDash([]);
  ctx.stroke(p);

  ctx.setLineDash([K-3,K+3]);
  kk=sq?0:400*Math.sin(t/KK);
  ctx.lineDashOffset=K/2+kk;
  ctx.lineWidth=2;
  ctx.strokeStyle=color.v;
  ctx.stroke(p);
  ctx.lineDashOffset=-K/2+kk;
  ctx.strokeStyle=color2.v;
  ctx.stroke(p);
}

start();
