"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S6=Math.sin(TP/6);
const S8=Math.sin(TP/8);
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
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
ctx.globalCompositeOperation="destination-over";
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  this.getRGB=()=>{
    let red=Math.round(this.RB+(256-this.RB)*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(this.GB+(256-this.GB)*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(this.BB+(256-this.BB)*Math.cos(this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RB=getRandomInt(112,224);
    this.GB=getRandomInt(112,224);
    this.BB=getRandomInt(112,224);
    this.RK1=1+60*Math.random()*([-1,1][getRandomInt(0,2)]);
    this.GK1=1+60*Math.random()*([-1,1][getRandomInt(0,2)]);
    this.BK1=1+60*Math.random()*([-1,1][getRandomInt(0,2)]);
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}
const color=new Color();

function Ellipse(idx) {
  this.randomize=()=>{
//this.time=60*getRandomInt(0,3);
this.time=getRandomInt(0,120,true);
    this.KX=80+800*Math.random();
    this.KY=80+800*Math.random();
    this.KR1=20+800*Math.random();
    this.KR2=20+800*Math.random();
    this.x=CSIZE*Math.pow(Math.random(),2);
    this.y=CSIZE*Math.pow(Math.random(),2);
  //this.x=-CSIZE+2*CSIZE*Math.random();
//  this.y=-CSIZE+2*CSIZE*Math.random();
//this.x=CSIZE*Math.pow((2*Math.random()-1),3);
//this.y=CSIZE*Math.pow((2*Math.random()-1),3);

  //this.r1=40+CSIZE/2*Math.random();
  //this.r2=40+CSIZE/2*Math.random();

// move to varying radius ratio and maxr
    this.r1=40+CSIZE/3*Math.random();
    this.r2=40+CSIZE/3*Math.random();
this.rdiff=this.r2-this.r1;
    this.a=TP*Math.random();
    //this.KA=TP/4-TP/2*Math.random();
this.KA=TP/2-TP*Math.random();
  }
  this.randomize();
  this.getPath=()=>{
    let p=new Path2D();
if (t-this.time<0) return p;
    let x=this.x+40*Math.sin(t/this.KX);
    let y=this.y+40*Math.sin(t/this.KY);
    let r1= Math.pow(Math.sin(t/this.KR1),2)*this.rdiff+this.r1;
    let r2=-Math.pow(Math.sin(t/this.KR2),2)*this.rdiff+this.r2;
    //p.ellipse(this.x,this.y,f*this.r1,f*this.r2,this.a+f*this.KA,0,TP);
//p.ellipse(x,y,f*this.r1,f*this.r2,this.a+f*this.KA,0,TP);
// split time
let ft=(t-this.time)/DUR;
if (t-this.time>DUR) return p;
//p.ellipse(x,y,f*r1,f*r2,this.a+f*this.KA,0,TP);
p.ellipse(x,y,ft*r1,ft*r2,this.a+ft*this.KA,0,TP);
    return p;
  }
  this.getEPath=()=>{
    let p=new Path2D();
    p.ellipse(this.x,this.y,4*f*this.r1,4*f*this.r2,this.a+4*f*this.KA,0,TP);
    return p;
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
//  if (EM) { parent.postMessage("lf"); return; }
  if (stopped) return;
  if (ts<pauseTS) requestAnimationFrame(pause);
  else requestAnimationFrame(animate);
}

var DUR=200;	
var DURE=320;	
var f=0;
var t=0;
var S=1;
var sym=getRandomInt(0,4);
var count=10+[2,0,4,6][sym];

var animate=(ts)=>{
  if (stopped) return;
  t++;
  f=t/DUR;
  if (S) {
    draw();
    if (t>DURE) {
      S=++S%2;
      t=0;
      pauseTS=performance.now()+3000;
      requestAnimationFrame(pause);
      ctx.strokeStyle="#000000A0";
      ctx.globalCompositeOperation="source-over";
      ctx.setLineDash([]);
      ctx.lineWidth=5;
      return;
    }
  } else {
    erase();
    if (t>DURE/4) {
      S=++S%2;
      t=0;
      ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
      ella.forEach((e)=>{ e.randomize(); });
      color.randomize();
      ctx.globalCompositeOperation="destination-over";
      sym=getRandomInt(0,4,true);
      dash=8+800*Math.random();
      count=[16,14,12,10][Math.round(dash/250)]+[2,0,4,6][sym];
    }
  }
  requestAnimationFrame(animate);
}

const getHexPath=(spath)=>{
  const dm1=new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]);
  const dm2=new DOMMatrix([-0.5,-S6,S6,-0.5,0,0]);
  const dm3=new DOMMatrix([0.5,S6,-S6,0.5,0,0]);
  let hpath=new Path2D(spath);
  hpath.addPath(spath,dm1);
  hpath.addPath(spath,dm2);
  hpath.addPath(hpath,new DOMMatrix([0.5,S6,-S6,0.5,0,0]));
//  hpath.addPath(hpath,dmxy);
//hpath.addPath(hpath,new DOMMatrix([0,1,-1,0,0,0]));
  hpath.addPath(hpath,new DOMMatrix([1,0,0,-1,0,0]));
  return hpath;
}

var getBiPath=(pth)=>{
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  let p=new Path2D(pth);
  p.addPath(p,dmx);
  p.addPath(p,dmy);
  return p;
}

const dm8=new DOMMatrix([S8,S8,-S8,S8,0,0]);
const dmxy=new DOMMatrix([0,1,-1,0,0,0]);
var transformPath=(pth)=>{
  if (sym==3) return getBiPath(pth);
  else if (sym==2) {
    let path=getBiPath(pth);
    path.addPath(path,dmxy);
    return path;
  } else if (sym==1) {
    let path=getBiPath(pth);
    path.addPath(path,dmxy);
    path.addPath(path,dm8);
    return path;
  } else return getHexPath(pth);
}

var dash=8+800*Math.random();

var draw=()=>{
  let p=transformPath(ella[0].getPath());
  //for (let i=1; i<ella.length; i++) { p.addPath(transformPath(ella[i].getPath())); }
  for (let i=1; i<count; i++) { p.addPath(transformPath(ella[i].getPath())); }
  //ctx.lineWidth=9;
  ctx.setLineDash([1+f*dash,1000]);
  ctx.setTransform(1,0,0,1,CSIZE-1,CSIZE+2);
  ctx.lineWidth=8;
  //ctx.strokeStyle="#0000000C";
  ctx.strokeStyle="#0000000D";
  ctx.stroke(p);
  //ctx.lineWidth=2;
  ctx.lineWidth=3;
  ctx.strokeStyle=color.getRGB();
  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  ctx.stroke(p);
}

var erase=()=>{
  let p=transformPath(ella[0].getEPath());
  //for (let i=1; i<ella.length; i++) { p.addPath(transformPath(ella[i].getEPath())); }
  for (let i=1; i<count; i++) { p.addPath(transformPath(ella[i].getEPath())); }
  //ctx.lineWidth=3;
  ctx.stroke(p);
}

onresize();

var ella=[];
for (let i=0; i<22; i++) ella.push(new Ellipse(i));
start();

// non-random x/y
// cl code
// variable r1,r2
// extreme tests
