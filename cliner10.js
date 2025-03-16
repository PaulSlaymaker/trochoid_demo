"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=360;
const S6=Math.sin(TP/6);
const C6=0.5;

const container=document.createElement("div");
container.style.margin="auto";
body.append(container);
for (let i=0; i<3; i++) {
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  c.ctx=c.getContext("2d");
  c.ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  c.ctx.lineWidth=0;
  c.ctx.lineCap="round";
  c.ctx.setLineDash([160,420]);
  //c.ctx.setLineDash([60,120]);
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

/*
const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}
*/

function Color() {
  const CBASE=164;
  const CT=255-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*(this.fr*Math.cos(this.RK2+t/this.RK1)+(1-this.fr)*Math.cos(t/this.RK3)));
    let grn=Math.round(CBASE+CT*(this.fg*Math.cos(this.GK2+t/this.GK1)+(1-this.fg)*Math.cos(t/this.GK3)));
    let blu=Math.round(CBASE+CT*(this.fb*Math.cos(this.BK2+t/this.BK1)+(1-this.fb)*Math.cos(t/this.BK3)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomizeF=()=>{
    this.RK3=5*Math.random();
    this.GK3=5*Math.random();
    this.BK3=5*Math.random();
    this.fr=1-Math.pow(0.9*Math.random(),4);
    this.fg=1-Math.pow(0.9*Math.random(),4);
    this.fb=1-Math.pow(0.9*Math.random(),4);
  }
  this.randomize=()=>{
    this.RK1=100+400*Math.random();
    this.GK1=100+400*Math.random();
    this.BK1=100+400*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.randomizeF();
  }
  this.randomize();
}

var color=new Color();

function Point(xp,yp) {
  this.x=xp;
  this.y=yp;
  this.randomize=()=>{
    this.K1=400+400*Math.random();
    this.K2=TP*Math.random();
    this.K3=400+400*Math.random();
    this.K4=TP*Math.random();
  }
  this.randomize();
}

var cycleCanvas=()=>{
  let canv1=container.removeChild(container.firstChild);
  canv1.ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  canv1.style.opacity=1;
  container.append(canv1);
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
//if (EM) stopped=true;
  if (ts<pauseTS) requestAnimationFrame(pause);
  else requestAnimationFrame(animate);
}

//var t=1300;
//var t=1500;
var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  draw();
if (t>1700) container.firstChild.style.opacity=Math.pow(1-(t-1700)/1000,3);
if (t>2700) {
//stopped=true;
    t=1700;
    [p1,p2,p3,p4].forEach((p)=>{ p.randomize(); });
    color.randomize();
    cycleCanvas();
    pauseTS=performance.now()+2000;
    requestAnimationFrame(pause);
} else
//if (EM && t%200==0) stopped=true
  requestAnimationFrame(animate);
}

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

const p1=new Point(0,0);	// 8 drawing points
p1.setLocation=()=>{
  //p1.x=CSIZE/3*Math.cos(p1.K2+TP*t/p1.K1);
  p1.y=CSIZE/3*Math.sin(p1.K4+TP*t/p1.K3);
}
const p2=new Point();
p2.setLocation=()=>{
  p2.x=2*CSIZE/3+CSIZE/3*Math.cos(p2.K2+TP*t/p2.K1);
  p2.y=          CSIZE/3*Math.sin(p2.K4+TP*t/p2.K3);
}
const p3=new Point();
p3.setLocation=()=>{
  p3.x=C6*2*CSIZE/3+CSIZE/3*Math.cos(p3.K2+TP*t/p3.K1);
  p3.y=S6*2*CSIZE/3+CSIZE/3*Math.sin(p3.K4+TP*t/p3.K3);
}

const p4=new Point();
p4.setLocation=()=>{
  p4.x=C6*2*CSIZE/3+CSIZE/3*Math.cos(p4.K2+TP*t/p4.K1);
  p4.y=-S6*2*CSIZE/3+CSIZE/3*Math.sin(p4.K4+TP*t/p4.K3);
//  p4.x=(CSIZE/3)*(   C6+Math.cos(p4.K2+TP*t/p4.K1));
//  p4.y=(CSIZE/3)*(-S6*2+Math.sin(p4.K4+TP*t/p4.K3));
}

const pa=[p1,p2,p3,p4];

const dmx=new DOMMatrix([-1,0,0,1,0,0]);

onresize();

var draw=()=>{
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  pa.forEach((p)=>{ p.setLocation(); });
/*
  drawPoint(p1.x,p1.y,"magenta");
  drawPoint(p2.x,p2.y,"white");
  drawPoint(p3.x,p3.y,"red");
  drawPoint(p4.x,p4.y,"blue");
*/

  let path=new Path2D();
  path.moveTo(p1.x,p1.y);
  path.lineTo(p2.x,p2.y);
  path.moveTo(p1.x,p1.y);
  path.lineTo(p3.x,p3.y);
  path.moveTo(p1.x,p1.y);
  path.lineTo(p4.x,p4.y);
//let dmt=new DOMMatrix([-1+Math.sin(t/200),0,0,1,0,0]);
  path.addPath(path,dmx);

//ctx.setLineDash([100+80*Math.cos(t/40),100]);
//ctx.lineDashOffset=-t/10;
  let ctx=container.lastChild.ctx;
  ctx.setTransform(1,0,0,1,CSIZE+1,CSIZE+1);
  ctx.lineDashOffset=t/2;
  ctx.strokeStyle="#00000010";
  ctx.lineWidth=9;
  ctx.stroke(path);

  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  ctx.strokeStyle=color.getRGB();
  ctx.lineWidth=3;
  ctx.stroke(path);
}

start();

