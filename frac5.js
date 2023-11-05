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

var pauseTS=1000;
var pause=(ts)=>{
//  if (EM) stopped=true;
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var t=0;
var stopped=true;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  setNormalizedFactors();
  for (let i=0; i<ca.length; i++) { ca[i].set(); }
  draw();
  if (t%400==0) {
    if (t%1600==0) setK1a();
    pauseTS=performance.now()+3200;
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
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

const count=5; //getRandomInt(4,7);
let ca=new Array(count);
for (let i=0; i<count; i++) { ca[i]=new Color(); }

onresize();

//var K1a=new Array(count+1);
var K1a=new Array(count);
var setK1a=()=>{
//K1a.forEach((p,i)=>{ K1a[i]=120+120*Math.random(); console.log(K1a); });
  let sum=0;
  for (let i=0; i<K1a.length; i++) { 
    //K1a[i]=1000+1000*Math.random();
    //K1a[i]=800+(i%2)*800; //*Math.random();
    //K1a[i]=800+(i%2)*800; //*Math.random();
    if (Math.random()<0.5) K1a[i]=800;
    else K1a[i]=1600;
    sum+=K1a[i];
  //  K1a[i]=800+(Math.random()<0.5)?800:0;
  }
  if (sum==count*1600 || sum==count*800) K1a=[1600, 800, 1600, 800, 1600];
//  K1a=[1600, 1600, 1600, 1600, 1600];
//  K1a=[800, 800, 800, 800, 800];
//    K1a=[1600, 3200, 1600, 800, 800];
//console.log(K1a);
}
setK1a();

var kxa=new Array(count);

const setNormalizedFactors=()=>{
  let sum=0;
  for (let i=0; i<count; i++) {
    kxa[i]=(1+Math.cos(TP*t/K1a[i]))/2;
    sum+=kxa[i];
  }
  for (let i=0; i<count; i++) kxa[i]=kxa[i]/sum;
}
setNormalizedFactors();

var pa=new Array(count);

var setPath=(idx,x,y,a,dir)=>{
  if (idx>count-1) return;
  pa[idx].moveTo(x,y);
  let l2=kxa[idx]*CSIZE;
  let x2=x+l2*Math.cos(a);
  let y2=y+l2*Math.sin(a);
//  let x2=x+l/2*(Math.cos(a)+Math.cos(2*a));
//  let y2=y+l/2*(Math.sin(a)-Math.sin(2*a));
  if (dir) {
    pa[idx].arc(x2,y2,l2,a-TP/2,a+TP/4,dir);
  } else {
    pa[idx].arc(x2,y2,l2,a+TP/2,a+3*TP/4,dir);
  }
  let x3=x2+l2*Math.cos(a+3*TP/4);
  let y3=y2+l2*Math.sin(a+3*TP/4);
  let x4=x2+l2*Math.cos(a+TP/4);
  let y4=y2+l2*Math.sin(a+TP/4);
  if (dir) {
    setPath(idx+1,x4,y4,a+TP/4,false);
    setPath(idx+1,x4,y4,a-TP/4,true);
  } else {
    setPath(idx+1,x3,y3,a+TP/4,false);
    setPath(idx+1,x3,y3,a-TP/4,true);
  }
}

var draw=()=>{
  for (let i=0; i<count; i++) pa[i]=new Path2D();
  for (let i=0; i<4; i++) {
    setPath(0,0,0,i*TP/4,i%2);
    setPath(0,0,0,i*TP/4,!(i%2));
  }
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=pa.length-1; i>=0; i--) {
    ctx.lineWidth=6;
    ctx.strokeStyle="#00000020";
    ctx.stroke(pa[i]);
    ctx.lineWidth=4;
    ctx.strokeStyle=ca[i].v;
    ctx.stroke(pa[i]);
  }
}

start();
