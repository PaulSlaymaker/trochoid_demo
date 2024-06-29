"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S6=Math.sin(Math.PI/3);
const CSIZE=360;

const container=document.createElement("div");
container.style.margin="auto";
body.append(container);
for (let i=0; i<3; i++) {
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  c.ctx=c.getContext("2d");
  c.ctx.setTransform(0,1,-1,0,CSIZE,CSIZE);
  c.ctx.lineCap="round";
  c.ctx.lineJoin="round";
  c.ctx.globalCompositeOperation="destination-over";
  container.append(c);
}

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.width=container.style.height=D+"px";
  for (let i=0; i<container.children.length; i++) {
    let canv=container.children.item(i);
    canv.style.width=canv.style.height=D+"px";
  }
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=154;
  const CT=255-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=20+80*Math.random();
    this.GK1=20+80*Math.random();
    this.BK1=20+80*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();

const EDGE=CSIZE/3+16;

var x0=EDGE/2;
var y0=EDGE/2/Math.pow(3,0.5);

function Point() {
  this.randomize=()=>{
this.K1=60+180*Math.random();
    //this.K1=100+200*Math.random();
    this.K2=TP*Math.random();
  }
  this.randomize();
  this.setAngle=()=>{
    this.a=TP/4+TP/4*(1+Math.sin(this.K2+t/this.K1))/2;
  }
  this.setLocation=(a)=>{
    const d=EDGE/2/Math.pow(3,0.5);
//if (a<0) debugger;
    //if (a>TP) a-=TP;
    if (a>TP) a%=TP;
    if (a<TP/4) {
      let dr=d/Math.cos(a-TP/12);
      this.x=x0+dr*Math.cos(a);
      this.y=y0+dr*Math.sin(a);
    } else if (a<7*TP/12) {
      let dr=d/Math.cos(a-5*TP/12);
      this.x=x0+dr*Math.cos(a);
      this.y=y0+dr*Math.sin(a);
    } else if (a<11*TP/12) {
      let dr=d/Math.cos(a-9*TP/12);
      this.x=x0+dr*Math.cos(a);
      this.y=y0+dr*Math.sin(a);
    } else if (a<=TP) {
      let dr=d/Math.cos(a-TP/12);
      this.x=x0+dr*Math.cos(a);
      this.y=y0+dr*Math.sin(a);
//    } else {
//      debugger;
    }
    
  }
}

var cycle=()=>{
  let canv1=container.removeChild(container.firstChild);
  canv1.ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  canv1.style.opacity=1;
  container.append(canv1);
  color.randomize();
  p1.randomize();
  p2.randomize();
  p3.randomize();
  KD2=TP*Math.random();
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

var DUR=800;
var t=0;
var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  c++;
  draw();
//  container.firstChild.style.opacity=1-c/DUR;
  if (t%DUR==0) {
    c=0;
    cycle();
if (EM) stopped=true
  }
  requestAnimationFrame(animate);
}

var p1=new Point();
var p2=new Point();
var p3=new Point();

var locate=()=>{
  let rot=TP*Math.pow(Math.sin(t/800),2);
  p1.setAngle();
  p1.setLocation(p1.a+rot);
  p2.setAngle();
  p2.setLocation(p1.a+p2.a+rot);
  p3.setAngle();
  p3.setLocation(p1.a+p2.a+p3.a+rot);
}

var dash1;
var dash2;
var KD2=TP*Math.random();

var draw=()=>{
  let ctx=container.lastChild.ctx;
dash1=200-200*Math.cos(TP/2*c/DUR);
dash2=440-400*Math.sin(KD2+TP*t/4000);
  ctx.setLineDash([dash1,dash2]);
//  ctx.lineDashOffset=-c/40;
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);

/*
let tri=new Path2D();
tri.moveTo(0,0);
tri.lineTo(EDGE,0);
tri.lineTo(EDGE/2,EDGE*S6);
tri.closePath();
ctx.strokeStyle="white";
ctx.lineWidth=1;
ctx.stroke(tri);
*/

  locate();
  let p=new Path2D();
  p.moveTo(p1.x,p1.y);
  p.lineTo(p2.x,p2.y);
  p.lineTo(p3.x,p3.y);
  p.closePath();

  const dm1=new DOMMatrix([-0.5,S6,S6,0.5,0,0]);	// 1st rotation
  const dm2=new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]);	// 2nd rotation
  const dm5=new DOMMatrix([1,0,0,-1,-3*EDGE/2,S6*EDGE]);	// 5th rotation
  const dm3=new DOMMatrix([-0.5,-S6,-S6,0.5,3*EDGE/2,S6*EDGE]);	// 3rd rotation

  const dma=new DOMMatrix([-0.5,-S6,S6,-0.5,3*EDGE/2,S6*EDGE]);
  const dmb=new DOMMatrix([-0.5,-S6,S6,-0.5,-3*EDGE/2,S6*EDGE]);
  const dmc=new DOMMatrix([-0.5,-S6,-S6,0.5,-3*EDGE/2,S6*EDGE]);	// 3rd rotation
  const dmd=new DOMMatrix([1,0,0,1,-6*EDGE/2,0]);	// 0 rotation
  const dme=new DOMMatrix([1,0,0,-1,3*EDGE/2,S6*EDGE]);	// 5th rotation
  const dmf=new DOMMatrix([-0.5,S6,-S6,-0.5,6*EDGE/2,0]);	// 2nd rotation

  const dmos1=new DOMMatrix([1,0,0,1,0,-S6*2*EDGE]);
  const dmos2=new DOMMatrix([1,0,0,1,0,S6*2*EDGE]);
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  let pf=new Path2D(p);
  pf.addPath(p,dm1);
  pf.addPath(p,dm2);
  pf.addPath(p,dm5);
  pf.addPath(p,dm3);

  pf.addPath(p,dma);
  pf.addPath(p,dmb);
  pf.addPath(p,dmc);
  pf.addPath(p,dmd);
  pf.addPath(p,dme);
  pf.addPath(p,dmf);

  pf.addPath(pf,dmos1)
  pf.addPath(pf,dmos2)
  pf.addPath(pf,dmy);

  ctx.strokeStyle="#00000010";
  ctx.lineWidth=9;
  ctx.stroke(pf);
  ctx.strokeStyle=color.getRGB();
  ctx.lineWidth=3;
  ctx.stroke(pf);
}

onresize();

start();
