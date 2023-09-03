"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/WNYQvOq
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;
const S6=Math.sin(TP/6);

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

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=96;
  const CT=255-CBASE;
  this.RK1=80+80*Math.random();
  this.GK1=80+80*Math.random();
  this.BK1=80+80*Math.random();
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.set=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    this.v="rgb("+red+","+grn+","+blu+")";
  }
  this.set();
}

var t=80;
var stopped=true;
var animate=(ts)=>{
  if (stopped) return;
  t++;

  if (t<80) {
    ctx.globalAlpha=t/80;
  } else if (t==80) {
    ctx.globalAlpha=1;
    ctx.canvas.style.opacity=1;
  } else if (t>3080) {
    reset();
    t=0;
  } else if (t>3000) {
    ctx.globalAlpha=1-(t-3000)/80;
  }
if (EM && t%350==0) stopped=true;
  draw();
  requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

const count=3;

function Radius() {
  this.k1=TP*Math.random();
  this.k2=400+400*Math.random();
//  this.k2*=[-1,1][getRandomInt(0,2)];
  this.set=()=>{ 
    this.r=CSIZE*Math.pow(Math.sin(t/this.k2+this.k1),2);  
  }
}

let rae=new Array(count);
let rac=new Array(count);
let ca=new Array(count);
let dk1=new Array(count);
let dk2=new Array(count);
let dk3=new Array(count);
let dk4=new Array(count);
for (let i=0; i<count; i++) {
  rae[i]=new Radius();
  rac[i]=new Radius();
  ca[i]=new Color();
}

var reset=()=>{
  for (let i=0; i<count; i++) {
    rae[i]=new Radius();
    rac[i]=new Radius();
    ca[i]=new Color();
    dk1[i]=300+300*Math.random();
    dk2[i]=TP*Math.random();
    dk3[i]=20+70*Math.random();
    dk4[i]=4+12*Math.random();
  }
  dk3.sort((a,b)=>{ return a-b; });
//console.log( dk3[0].toFixed(0), dk3[1].toFixed(0), dk3[2].toFixed(0));
}
reset();

var setRadii=()=>{
  for (let i=0; i<count; i++) {
    rae[i].set();
    rac[i].set();
  }
  rae.sort((a,b)=>{ return a.r-b.r; });
  rac.sort((a,b)=>{ return a.r-b.r; });
}

const dm1=new DOMMatrix([1,0,0,-1,0,0]);
const dm2=new DOMMatrix([-1,0,0,1,0,0]);
const dm3=new DOMMatrix([0.5,S6,-S6,0.5,0,0]);
const dm4=new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]);

var draw=()=>{
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  setRadii();
  for (let i=0; i<count; i++) {
    let p=new Path2D();
    p.moveTo(rac[i].r,0);
    //let cpx1=rac[i].r;//*Math.cos(TP/24);
    let cpy1=rac[i].r*Math.sin(TP/24);
    //let cpx2=rae[i].r//*Math.cos(TP/24);
    let cpy2=rae[i].r*Math.sin(TP/24);
    //ctx.lineTo(rae[i].r*Math.cos(TP/12),rae[i].r*Math.sin(TP/12));
    p.bezierCurveTo(rac[i].r,cpy1,rae[i].r,cpy2,rae[i].r*Math.cos(TP/12),rae[i].r*Math.sin(TP/12));
    p.addPath(p,dm1);
    p.addPath(p,dm2);
    let p2=new Path2D(p);
    p2.addPath(p,dm3);
    p2.addPath(p,dm4);
    let dd=dk3[i]+dk3[i]*Math.pow(Math.sin(dk2[i]+t/dk1[i]),2);
    ctx.setLineDash([dd]);
    ctx.lineDashOffset=t/dk4[i];
    ctx.lineCap="round";
    ctx.lineWidth=6;
    ctx.strokeStyle="#00000018";
    ctx.stroke(p2);
    ctx.lineCap="butt";
    ctx.lineWidth=3;
    ca[i].set();
    ctx.strokeStyle=ca[i].v;
    ctx.stroke(p2);
  }
}

onresize();

start();
