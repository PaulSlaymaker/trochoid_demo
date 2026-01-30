"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S8=Math.sin(TP/8);
const C8=Math.cos(TP/8);
const S16=Math.sin(TP/16);
const C16=Math.cos(TP/16);
const CSIZE=360;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

/*
const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}
*/

function Color() {
  const CBASE=144;
  const CT=256-CBASE;
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(o+this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(o+this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(o+this.BK2+c/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=500+500*Math.random();
    this.GK1=500+500*Math.random();
    this.BK1=500+500*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}
const color=new Color();
const cola=[color,new Color()];

var drawPoint=(x,y,col,r)=>{	// diag
  ctx.beginPath();
  let rad=r?r:3;
  ctx.arc(x,y,rad,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);

function Radius(idx) {
  //this.K=20+8*idx;
  this.K=20+idx/4; //+20*Math.random();
  //this.K=20+idx/20;
  //this.K2=Math.PI+2*idx; //TP*Math.random();
  this.K2=0; //TP*Math.random();
  this.getFraction=()=>{
    return (1.2+0.8*Math.sin(this.K2+t/this.K))/2;
  }
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var pauseTS=1000;
var pause=(ts)=>{
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var t=300;
var c=0;

var animate=(ts)=>{
  if (stopped) return;
  t++,c++;
  setRadiusArray();
  setPaths();
  cf=14-10*Math.pow(Math.sin(TP*t/24000),2);
//  if (t>DUR) { //    t=0; stopped=true; }
  if (EM && t%100==0) {
    stopped=true;
    parent.postMessage("lf"); 
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();

ctx.strokeStyle="#00000080";
ctx.lineWidth=4;
var cf=8;
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE)
  for (let i=0; i<pa.length; i++) {
//ctx.fillStyle=color.getRGB(pa[i].s/16);	// f(l)
    ctx.fillStyle=color.getRGB(pa[i].s/cf);
    //ctx.fillStyle=cola[i%2].getRGB(pa[i].s/cf);
    ctx.fill(pa[i]);
    ctx.stroke(pa[i]);
  }
}

var l=20;

var raa=[];
for (let i=0; i<l; i++) raa.push(new Radius(i));

var ra=[];
var ra1=[],ra2=[];
var setRadiusArray=()=>{
  let d=CSIZE/l;
  ra[0]=raa[0].getFraction()*d;
  for (let i=1; i<raa.length; i++) {
    ra[i]=ra[i-1]+raa[i].getFraction()*d;
    d=(CSIZE-ra[i])/(l-i);
  }
  for (let i=0; i<l/2; i++) {
    ra1[i]=ra[2*i];
    ra2[i]=ra[2*i+1];
  }
  ra1[0]=0;
//ra2[ra2.length-1]=CSIZE;
}

//for (let i=0; i<l; i++) ra[i]=CSIZE*Math.random();
//ra.sort((a,b)=>{ return a-b; });
setRadiusArray();

/*
for (let i=0; i<l/2; i++) {
  ra1[i]=ra[2*i];
  ra2[i]=ra[2*i+1];
}
ra1[0]=0;
*/

const xf=Math.cos(TP/32);
let xfd=C16;
const yf=Math.sin(TP/32);
let yfd=S16;
const dm1=new DOMMatrix([-1,0,0,-1,0,0]);
const dm2=new DOMMatrix([0,1,-1,0,0,0]);
const dm3=new DOMMatrix([C8,S8,-S8,C8,0,0]);
const dm4=new DOMMatrix([C16,S16,-S16,C16,0,0]);

var pa=[];
var setPaths=()=>{
  pa=[];
  for (let i=0; i<l-2; i++) {
    let p=new Path2D();
    if (i%2) {
      let idx=(i-1)/2;
      let x1=(ra1[idx+1]+xf*ra2[idx])/2;
      let y1=yf*ra2[idx]/2;
      p.moveTo(x1,y1);
      let x2=(ra1[idx+1]+xf*ra2[idx+1])/2;
      let y2=yf*ra2[idx+1]/2;
      p.quadraticCurveTo(ra1[idx+1],0,x2,y2);
      x2=(xfd*ra1[idx+1]+xf*ra2[idx+1])/2;
      y2=(yfd*ra1[idx+1]+yf*ra2[idx+1])/2;
      p.quadraticCurveTo(xf*ra2[idx+1],yf*ra2[idx+1],x2,y2);
      x2=(xfd*ra1[idx+1]+xf*ra2[idx])/2;
      y2=(yfd*ra1[idx+1]+yf*ra2[idx])/2;
      p.quadraticCurveTo(xfd*ra1[idx+1],yfd*ra1[idx+1],x2,y2);
      p.quadraticCurveTo(xf*ra2[idx],yf*ra2[idx],x1,y1);
      p.s=ra2[idx+1]-ra2[idx];
    } else {
      let x1=(ra1[i/2]+xf*ra2[i/2])/2;
      let y1=-yf*ra2[i/2]/2;
      p.moveTo(x1,y1);
      let x2=(ra1[i/2+1]+xf*ra2[i/2])/2;
      let y2=-yf*ra2[i/2]/2;
      p.quadraticCurveTo(xf*ra2[i/2],-yf*ra2[i/2],x2,y2);
      p.quadraticCurveTo(ra1[i/2+1],0,x2,-y2);
      p.quadraticCurveTo(xf*ra2[i/2],yf*ra2[i/2],x1,-y1);
      p.quadraticCurveTo(ra1[i/2],0,x1,y1);
      p.s=ra1[i/2+1]-ra1[i/2];
    }
    p.addPath(p,dm1);
    p.addPath(p,dm2);
    p.addPath(p,dm3);
    p.addPath(p,dm4);
    pa.push(p);
  }
}

setPaths();

start();
