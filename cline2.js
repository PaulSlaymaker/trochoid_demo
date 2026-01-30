"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=360;

const container=document.createElement("div");
container.style.margin="auto";
body.append(container);
for (let i=0; i<3; i++) {
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
//c.style.outline="1px dotted gray";
  c.ctx=c.getContext("2d");
  c.ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  c.ctx.globalCompositeOperation="destination-over";
  c.ctx.lineWidth=0;
  c.ctx.lineCap="round";
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
  const CBASE=160;
  const CT=255-CBASE;
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(o+this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(o+this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(o+this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=40+160*Math.random();
    this.GK1=40+160*Math.random();
    this.BK1=40+160*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();

//const EDGE=CSIZE;
const x0=CSIZE/2;

function Point() {
  this.randomize=()=>{
//this.K1=80+240*Math.random();
    this.K1=-800*getRandomInt(1,3);
//this.K1=20+60*Math.random();
    //this.K1=100+200*Math.random();
    //this.K2=TP*Math.random();
    this.K2=[0,TP/4,TP/2,3*TP/4][getRandomInt(0,4)];
  }
  this.randomize();
}

function Fraction() {
  this.randomize=()=>{
//    this.K1=400+400*Math.random();
//this.K1=[400,800,1200][getRandomInt(0,3)];
this.K1=400*getRandomInt(1,3);
    //this.K2=TP*Math.random();
this.K2=[0,TP/4,TP/2,3*TP/4][getRandomInt(0,4)];
  }
  this.randomize();
  this.setLocation=()=>{
    this.f=(1+Math.sin(this.K2+t/this.K1))/2;
    //this.f=(1+Math.sin(this.K2+TP*t/this.K1))/2;
//this.f=Math.pow((1+Math.sin(this.K2+TP*t/this.K1))/2,4);
  }
}

var cycle=()=>{
  let canv1=container.removeChild(container.firstChild);
  canv1.ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  canv1.style.opacity=1;
  container.append(canv1);
  color.randomize();
  p4.randomize();
  p1.randomize();
  p2.randomize();
  p3.randomize();
  fx1.randomize();
  fx2.randomize();
  fx3.randomize();
  fy1.randomize();
  fy2.randomize();
  fy3.randomize();
}

var pauseTS=1000;
var pause=(ts)=>{
  if (stopped) return;
  if (ts<pauseTS) requestAnimationFrame(pause);
  else requestAnimationFrame(animate);
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

var DUR=1200;
var t=0;
var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  c++;
  draw();
  if (t%DUR==0) {
    c=0;
    cycle();
    pauseTS=performance.now()+2000;
    if (EM) {
      stopped=true;
      parent.postMessage("lf");
    }
    requestAnimationFrame(pause);
  } else
  requestAnimationFrame(animate);
}

var p1=new Point();
p1.y=0;
p1.setLocation=()=>{ p1.x=CSIZE*(1+Math.sin(p1.K2+TP*t/p1.K1))/2; }

var p2=new Point();
p2.x=CSIZE;
p2.setLocation=()=>{ p2.y=CSIZE*(1+Math.sin(p2.K2+TP*t/p2.K1))/2; }

var p3=new Point();
p3.y=CSIZE;
p3.setLocation=()=>{ p3.x=CSIZE*(1+Math.sin(p3.K2+TP*t/p3.K1))/2; }

var p4=new Point();
p4.x=0;
p4.setLocation=()=>{ p4.y=CSIZE*(1+Math.sin(p4.K2+TP*t/p4.K1))/2; }

var fx1=new Fraction();
var fx2=new Fraction();
var fx3=new Fraction();
var fy1=new Fraction();
var fy2=new Fraction();
var fy3=new Fraction();

var locate=()=>{
  p1.setLocation();
  p2.setLocation();
  p3.setLocation();
  p4.setLocation();
  fx1.setLocation();
  fx2.setLocation();
  fx3.setLocation();
  fy1.setLocation();
  fy2.setLocation();
  fy3.setLocation();
}

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);

var draw=()=>{
  let ctx=container.lastChild.ctx;
//  dash1=200-200*Math.cos(TP/2*c/DUR);
//dash1=CSIZE*c/DUR;
  ctx.setLineDash([CSIZE*c/DUR,2000]);
//  ctx.lineDashOffset=-c/40;
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  ctx.fillStyle="#00000020";
//  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//ctx.setLineDash([200,1000]);

  locate();
  let q1=new Path2D();
  q1.moveTo(p1.x,p1.y);
  q1.quadraticCurveTo(x0,x0,p2.x,p2.y);
  q1.moveTo(p1.x,p1.y);
  q1.quadraticCurveTo(x0,x0,p4.x,p4.y);
  q1.moveTo(p3.x,p3.y);
  q1.quadraticCurveTo(x0,x0,p2.x,p2.y);
  q1.moveTo(p3.x,p3.y);
  q1.quadraticCurveTo(x0,x0,p4.x,p4.y);

/*
  q1.quadraticCurveTo(x0,x0,p2.x,p2.y);
  q1.quadraticCurveTo(x0,x0,p3.x,p3.y);
  q1.quadraticCurveTo(x0,x0,p4.x,p4.y);
  q1.quadraticCurveTo(x0,x0,p1.x,p1.y);
*/

/*
  q1.bezierCurveTo(x0,y0,x0,y0,p1.x,p1.y);
  q1.bezierCurveTo(x0,y0,x0,y0,p2.x,p2.y);
  q1.bezierCurveTo(x0,y0,x0,y0,p4.x,p4.y);
  q1.lineTo(p1.x,p1.y);
  q1.lineTo(p2.x,p2.y);
  q1.closePath();
*/

  let xs=fx1.f+fx2.f+fx3.f;
  let fx=[fx1.f/xs,fx2.f/xs,fx3.f/xs];
  let ys=fy1.f+fy2.f+fy3.f;
  let fy=[fy1.f/ys,fy2.f/ys,fy3.f/ys];

  let path=new Path2D();
  path.addPath(q1,new DOMMatrix([fx[0],0,0,fy[0],0,0]));
  path.addPath(q1,new DOMMatrix([-fx[1],0,0,fy[0],(fx[0]+fx[1])*CSIZE,0]));
  path.addPath(q1,new DOMMatrix([fx[2],0,0,fy[0],(1-fx[2])*CSIZE,0]));
  path.addPath(q1,new DOMMatrix([fx[0],0,0,-fy[1],0,(fy[0]+fy[1])*CSIZE]));
  path.addPath(q1,new DOMMatrix([-fx[1],0,0,-fy[1],(fx[0]+fx[1])*CSIZE,(fy[0]+fy[1])*CSIZE]));
  path.addPath(q1,new DOMMatrix([fx[2],0,0,-fy[1],(1-fx[2])*CSIZE,(fy[0]+fy[1])*CSIZE]));
  path.addPath(q1,new DOMMatrix([fx[0],0,0,fy[2],0,(1-fy[2])*CSIZE]));
  path.addPath(q1,new DOMMatrix([-fx[1],0,0,fy[2],(fx[0]+fx[1])*CSIZE,(1-fy[2])*CSIZE]));
  path.addPath(q1,new DOMMatrix([fx[2],0,0,fy[2],(1-fx[2])*CSIZE,(1-fy[2])*CSIZE]));

  let pf=new Path2D(path);
  pf.addPath(path,dmx);
  pf.addPath(pf,dmy);

//ctx.globalAlpha=c/DUR; //Math.max(Math.sin(t/4));;

  ctx.lineWidth=0.001+3*c/DUR;
//ctx.lineWidth=0.01+3*Math.pow(c/DUR,2);
  ctx.strokeStyle=color.getRGB(0);
  ctx.stroke(pf);
  ctx.strokeStyle="#0000000C";
  ctx.lineWidth=6;
  ctx.stroke(pf);
}

onresize();

start();

