"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/eYxEMbd
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");

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
ctx.translate(CSIZE,CSIZE);
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
  const CBASE=160;
  const CT=255-CBASE;
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=160+160*Math.random();
    this.GK1=160+160*Math.random();
    this.BK1=160+160*Math.random();
  }
  this.randomize();
}

var colors=[new Color(),new Color()];

const getHexPath=(spath)=>{
  const dm1=new DOMMatrix([0.5,0.866,-0.866,0.50,0,0]);
  const dm2=new DOMMatrix([-0.5,0.866,-0.866,-0.50,0,0]);
  const dm3=new DOMMatrix([-1,0,0,1,0,0]);
  let hpath=new Path2D(spath);
  hpath.addPath(spath,dm1);
  hpath.addPath(spath,dm2);
  hpath.addPath(hpath,dm3);
  hpath.addPath(hpath,new DOMMatrix([1,0,0,-1,0,0]));
  return hpath;
}

const EDGE=CSIZE-84;

var Line=function() { 
this.t=0;
this.dur=200+getRandomInt(0,200);
  this.FK1=TP*Math.random();
  this.FK2=100+100*Math.random();
  this.x1=EDGE-2*EDGE*Math.random();
  this.y1=EDGE-2*EDGE*Math.random();
  let R=40+200*Math.random();
  let a=TP*Math.random();
  this.x2=this.x1+R*Math.cos(a);
  if (this.x2<-EDGE || this.x2>EDGE) this.x2=this.x1-R*Math.cos(a);
  this.y2=this.y1+R*Math.sin(a);
  if (this.y2<-EDGE || this.y2>EDGE) this.y2=this.y1-R*Math.sin(a);
  a=TP*Math.random();
  this.xb1=this.x1+R*Math.cos(a);
  if (this.xb1<-EDGE || this.xb1>EDGE) this.xb1=this.x1-R*Math.cos(a);
  this.yb1=Math.abs(this.y1+R*Math.sin(a));
  if (this.yb1<-EDGE || this.yb1>EDGE) this.yb1=this.y1-R*Math.sin(a);
  a=TP*Math.random();
  this.xb2=this.xb1+R*Math.cos(a);
  if (this.xb2<-EDGE || this.xb2>EDGE) this.xb2=this.xb1-R*Math.cos(a);
  this.yb2=this.yb1+R*Math.sin(a);
  if (this.yb2<-EDGE || this.yb2>EDGE) this.yb2=this.yb1-R*Math.sin(a);
  this.transit=()=>{
    this.x1=this.xb1;
    this.y1=this.yb1;
    this.x2=this.xb2;
    this.y2=this.yb2;
    let R=40+200*Math.random();
    let a=TP*Math.random();
//let a=Math.atan2(this.y1-this.y2,this.x1-this.x2);
    this.xb1=this.x1+R*Math.cos(a);
    if (this.xb1<-EDGE || this.xb1>EDGE) this.xb1=this.x1-R*Math.cos(a);
    this.yb1=this.y1+R*Math.sin(a);
    if (this.yb1<-EDGE || this.yb1>EDGE) this.yb1=this.y1-R*Math.sin(a);
    a=TP*Math.random();
//a=Math.atan2(this.yb1-this.yb2,this.xb1-this.xb2);
    this.xb2=this.xb1+R*Math.cos(a);
    if (this.xb2<-EDGE || this.xb2>EDGE) this.xb2=this.xb1-R*Math.cos(a);
    this.yb2=this.yb1+R*Math.sin(a);
    if (this.yb2<-EDGE || this.yb2>EDGE) this.yb2=this.yb1-R*Math.sin(a);
  }
  this.getPath=()=>{
    let p=new Path2D();
    let f=(1-Math.cos(TP*this.t/(2*this.dur)))/2;
    p.moveTo((1-f)*this.x1+f*this.xb1,(1-f)*this.y1+f*this.yb1);
    p.lineTo((1-f)*this.x2+f*this.xb2,(1-f)*this.y2+f*this.yb2);
    return getHexPath(p);
  }
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
body.addEventListener("click", start, false);

//var t=0;
//var f=0;
//var f2=0;
var c=0;
var DUR=400;
var animate=(ts)=>{
  if (stopped) return;
//  t++;
  c++;
  //f=t/DUR;
  //f=(1-Math.cos(TP*t/(2*DUR)))/2;
  //f2=Math.pow(Math.sin(TP*t/DUR),4);
  //f2=Math.pow(Math.sin(TP*t/(2*DUR)),2);
  draw();
  //if (EM && t%200==0) stopped=true;	// DUR/4
  //if (t>=DUR/2) {
/*
  if (t>=DUR) {
    for (let i=0; i<la.length; i++) la[i].transit();
    t=0;
  }
*/
  for (let i=0; i<la.length; i++) {
    la[i].t++;
    if (la[i].t>=la[i].dur) {
      la[i].transit(); 
      la[i].t=0;
    }
  }
  requestAnimationFrame(animate);
}

onresize();

var line=new Line();
var la=[line,new Line(),new Line(),new Line()];

var draw=()=>{
  for (let i=0; i<la.length; i++) {
    let p=la[i].getPath();
    ctx.globalAlpha=1;
    ctx.lineWidth=6;
    ctx.strokeStyle="#00000020";
    ctx.stroke(p);
//let ff=Math.pow(Math.sin(la[i].FK1+c/la[i].FK2),2);
    let ff=(1+Math.sin(la[i].FK1+c/la[i].FK2))/2;
    ctx.globalAlpha=1-ff;
    ctx.lineWidth=4;
    ctx.strokeStyle=colors[i%colors.length].getRGB();
    ctx.stroke(p);
  }
}

start();
