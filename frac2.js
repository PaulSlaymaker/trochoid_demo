"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/qBLzOKa
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
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
//ctx.globalAlpha=0.7;

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=159;
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

var t=0;//getRandomInt(0,2000);
var stopped=true;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  setFactors();
if (EM && t%350==0) stopped=true;
  draw();
//if (t%50==0) stopped=true;
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
let ca=new Array(count);
let ca2=new Array(count);
for (let i=0; i<count; i++) { 
  ca[i]=new Color(); 
  ca2[i]=new Color(); 
}

onresize();

var Ka=new Array(count);
var Kl=new Array(count);
for (let i=0; i<count; i++) { 
  Ka[i]=800+800*Math.random();
}

var K1=160+160*Math.random();
var K2=80+80*Math.random();
var K3=120+120*Math.random();
var K6=80+80*Math.random();

var D=80+60*Math.sin(t/K6);

var k=0.8*Math.sin(t/K1);
var k2=2-1.1*Math.cos(t/K2);
//var k3=2;//1.3+3*Math.random();
var k3=2+0.5*Math.cos(t/K3);

var setFactors=()=>{
  for (let i=0; i<count; i++) { Kl[i]=2-1.1*Math.sin(t/K2); }
  k2=2-1.1*Math.cos(t/K2);
  D=100+80*Math.sin(t/K6);
}
setFactors();

var LW=18;

var pa=new Array(count);
var pa2=new Array(count);

var setPath=(idx,x,y,l,a)=>{
  if (idx>count-1) return;

//  pa[idx].lineTo(x-l,y);
  pa[idx].moveTo(x,y);
//  pa[idx].moveTo(x+l/8,y);
//  pa[idx].arc(x,y,l/8,0,TP);
//pa2[idx].arc(x,y,l/8,0,TP);

//let dp1=new DOMPoint(x+l/2,y+l/2).matrixTransform(new DOMMatrix([0,-1,1,0,0,0]));
//let dp1=new DOMPoint(x+l/2,y+l/2).matrixTransform(new DOMMatrix([1,0,0,1,0,0]));
//let dp1=new DOMPoint(x+l/2,y).matrixTransform(new DOMMatrix([1,0,0,1,0,0]));
//let dp1=new DOMPoint(x+l/2,y).matrixTransform(new DOMMatrix([Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0]));
  let x2=x+l*Math.cos(a);
  let y2=y+l*Math.sin(a);
//  let x2=x+l/2*(Math.cos(a)+Math.cos(2*a));
//  let y2=y+l/2*(Math.sin(a)-Math.sin(2*a));
  pa[idx].lineTo(x2,y2);
  //setPath(idx+1,x2,y2,l/Kl[idx],a+TP*t/Ka[idx]);
  //setPath(idx+1,x2,y2,l/Kl[idx],a-TP*t/Ka[idx]);
  setPath(idx+1,x2,y2,l/k2,a+TP*t/Ka[idx]);
  setPath(idx+1,x2,y2,l/k2,a-TP*t/Ka[idx]);

  //setPath(idx+1,x2,y2,l/k2,a+TP*t/(1200+400*idx));
  //setPath(idx+1,x2,y2,l/k2,a-TP*t/(1200+400*idx));
//  setPath(idx+1,x2,y2,l/1.5,a-TP*t/1800);
//  setPath(idx+1,x2,y2,l/1.5,a+TP*t/1800);
//  setPath(idx+1,x2,y2,l/0.7,a-t/100);
//  setPath(idx+1,x2,y2,l/0.7,a-t/110);

/*
  pa[idx].lineTo(dp1.x,dp1.y);
  setPath(idx+1,dp1.x,dp1.y,l/1.4,a+k);
  setPath(idx+1,dp1.x,dp1.y,l/1.4,a-k);
*/

/*
  pa[idx].moveTo(x,y);
  pa[idx].lineTo(x,y-l);
  pa[idx].moveTo(x,y);
  pa[idx].lineTo(x,y+l);
*/

//let dp1=new DOMPoint(x,y).matrixTransform(new DOMMatrix([0,-1,1,0,0,0]));
//let dp2=new DOMPoint(x-l,y).matrixTransform(new DOMMatrix([0,-1,1,0,0,0]));
//let dp3=new DOMPoint(x+l,y).matrixTransform(new DOMMatrix([0,-1,1,0,0,0]));
//let dmt=new DOMMatrix([0.866,0.5,-0.5,0.866,0,0]);
//let dmt=new DOMMatrix([0.5,0.866,-0.866,0.5,0,0]);
/*
let dmt=new DOMMatrix([0,-1,1,0,0,0]);
let dp1=new DOMPoint(x,y).matrixTransform(dmt);
let dp2=new DOMPoint(x-l,y).matrixTransform(dmt);
let dp3=new DOMPoint(x+l,y).matrixTransform(dmt);
  pa[idx].moveTo(dp1.x,dp1.y);
  pa[idx].lineTo(dp2.x,dp2.y);
  pa[idx].moveTo(dp1.x,dp1.y);
  pa[idx].lineTo(dp3.x,dp3.y);
*/

/*
dmt=new DOMMatrix([-0.5,0.866,-0.866,-0.5,0,0]);
dp1=new DOMPoint(x,y).matrixTransform(dmt);
dp2=new DOMPoint(x-l,y).matrixTransform(dmt);
dp3=new DOMPoint(x+l,y).matrixTransform(dmt);
  pa[idx].moveTo(dp1.x,dp1.y);
  pa[idx].lineTo(dp2.x,dp2.y);
  pa[idx].moveTo(dp1.x,dp1.y);
  pa[idx].lineTo(dp3.x,dp3.y);
*/

//pa[idx].moveTo(dp1.x+l/16,dp1.y);
//pa[idx].arc(dp1.x,dp1.y,l/16,0,TP);
//let  kt=idx%2?10:k;

//  let dp1=new DOMPoint(x,y).matrixTransform(new DOMMatrix([0,-1,1,0,0,0]));
//  setPath(idx+1,dp1.x,dp1.y,l/2,a+k);
/*
  setPath(idx+1,x-l/k,y-l/k2,l/k3);
  setPath(idx+1,x-l/k,y+l/k2,l/k3);
  setPath(idx+1,x+l/k,y-l/k2,l/k3);
*/
  //setPath(idx+1,dp1.x+l/k,dp1.y-l/k2,l/k3);
}

ctx.fillStyle="#000000A0";
var draw=()=>{
  for (let i=0; i<count; i++) pa[i]=new Path2D();
  for (let i=0; i<6; i++) setPath(0,0,0,100/k2,i*TP/6);
/*
  setPath(0,0,0,120/k2,Math.PI/2);
  setPath(0,0,0,120/k2,Math.PI);
  setPath(0,0,0,120/k2,3*Math.PI/2);
*/
//  setPath(0,0,0,110,0);
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  for (let i=0; i<pa.length; i++) {
  for (let i=pa.length-1; i>=0; i--) {

    ca[i].set();
    ca2[i].set();

//  ctx.globalCompositeOperation="source-over";
  ctx.setLineDash([]);
//  ctx.lineWidth=8+LW-3*i;
  //ctx.lineWidth=8+LW-5*(count-1-i);
ctx.lineWidth=6;
  //ctx.strokeStyle="black";
  ctx.strokeStyle="#00000030";
  ctx.stroke(pa[i]);

    //ctx.lineWidth=LW-3*i;
    //ctx.lineWidth=LW-5*(count-1-i);
ctx.lineWidth=2;
    ctx.strokeStyle=ca[i].v;
ctx.lineDashOffset=0;
    ctx.setLineDash([D,D+4]);
    ctx.stroke(pa[i]);

    //ctx.globalCompositeOperation="lighter";
ctx.lineDashOffset=D+2;
    ctx.strokeStyle=ca2[i].v;
    //ctx.lineWidth/=3;
//ctx.lineWidth/=2;
    ctx.stroke(pa[i]);
  }
}

start();
