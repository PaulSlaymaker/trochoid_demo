"use strict"; // Paul Slaymaker, paul25882@gmail.com
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
ctx.lineCap="round";
ctx.globalAlpha=0.7;

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=112;
//const CBASE=159;
  const CT=255-CBASE;
  this.RK1=100+100*Math.random();
  this.GK1=100+100*Math.random();
  this.BK1=100+100*Math.random();
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

var t=getRandomInt(0,2000);
var stopped=true;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  k=4+2*Math.sin(O1+t/K1);
  k2=4+2*Math.sin(O2+t/K2);
  k3=2+0.5*Math.cos(t/K3);
  L1=40*Math.sin(t/K4);
  L2=40*Math.sin(t/K5);

  setFactors();

//if (EM && t%350==0) stopped=true;

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

const count=4;
let ca=new Array(count);
for (let i=0; i<count; i++) { ca[i]=new Color(); }

onresize();

var O1=TP*Math.random();
var O2=TP*Math.random();

var K1a=new Array(count);
//K1a.forEach((p,i)=>{ K1a[i]=120+120*Math.random(); console.log(K1a); });
for (let i=0; i<count; i++) { 
  K1a[i]=120+120*Math.random();
}
var kxa=new Array(count);
var kya=new Array(count);

var K1=120+120*Math.random();
var K2=120+120*Math.random();
var K3=120+120*Math.random();
var K4=120+120*Math.random();
var K5=120+120*Math.random();
var K6=120+120*Math.random();
var L1=40*Math.sin(t/K4);
var L2=40*Math.sin(t/K5);

var D=100+80*Math.sin(t/K6);

var k=4+2*Math.sin(O1+t/K1);
//var kx1=4+2*Math.sin(O1+t/K1);
//var kx2=4+2*Math.sin(O1+t/K1);
var k2=4+2*Math.sin(O2+t/K2);
//var k3=2;//1.3+3*Math.random();
var k3=2+0.5*Math.cos(t/K3);

var setFactors=()=>{
  for (let i=0; i<count; i++) { 
    kxa[i]=4+2*Math.sin(O1+t/K1a[i]);
  }
  D=100+80*Math.sin(t/K6);
}

var LW=18;

var pa=new Array(count);

var setPath=(idx,x,y,l)=>{
  if (idx>count-1) return;
/*
  pa[idx].moveTo(x+l-l/20,y);
  pa[idx].arc(x+l,y,l/40,0,TP);
  pa[idx].moveTo(x-l+l/20,y);
  pa[idx].arc(x-l,y,l/40,0,TP);
*/
/*
  pa[idx].moveTo(0,0);
  pa[idx].lineTo(x,y);
*/
  pa[idx].moveTo(x,y);
  pa[idx].lineTo(x-l,y);
  pa[idx].moveTo(x,y);
  pa[idx].lineTo(x+l,y);
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
let dmt=new DOMMatrix([0,-1,1,0,0,0]);
let dp1=new DOMPoint(x,y).matrixTransform(dmt);
let dp2=new DOMPoint(x-l,y).matrixTransform(dmt);
let dp3=new DOMPoint(x+l,y).matrixTransform(dmt);
  pa[idx].moveTo(dp1.x,dp1.y);
  pa[idx].lineTo(dp2.x,dp2.y);
  pa[idx].moveTo(dp1.x,dp1.y);
  pa[idx].lineTo(dp3.x,dp3.y);

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

let kz=kxa[idx];
  setPath(idx+1,x+l/kxa[idx]+L1,y+l/k2+L2,l/k3);
  setPath(idx+1,x-l/kxa[idx]-L1,y-l/k2-L2,l/k3);
  setPath(idx+1,x-l/kz-L1,y+l/k2+L2,l/k3);
  setPath(idx+1,x+l/kz+L1,y-l/k2-L2,l/k3);
  //setPath(idx+1,dp1.x+l/k+L1,dp1.y-l/k2-L2,l/k3);
}

//ctx.fillStyle="#00000010";
var draw=()=>{
  for (let i=0; i<count; i++) pa[i]=new Path2D();
  setPath(0,0,0,300+L1);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  for (let i=0; i<pa.length; i++) {
  for (let i=pa.length-1; i>=0; i--) {

    ca[i].set();

  ctx.globalCompositeOperation="source-over";
  ctx.setLineDash([]);
//  ctx.lineWidth=8+LW-3*i;
  ctx.lineWidth=8+LW-5*(count-1-i);
  ctx.strokeStyle="black";
  ctx.stroke(pa[i]);

    //ctx.lineWidth=LW-3*i;
    ctx.lineWidth=LW-5*(count-1-i);
//console.log(ctx.lineWidth);
    ctx.strokeStyle=ca[i].v;
    ctx.stroke(pa[i]);

    ctx.globalCompositeOperation="lighter";
    ctx.setLineDash([D,3000]);
    ctx.lineWidth/=3;
    ctx.stroke(pa[i]);
  }
}

start();
