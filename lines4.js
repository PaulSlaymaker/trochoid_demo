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
  c.ctx=c.getContext("2d");
  c.ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  c.ctx.lineCap="round";
//  c.ctx.lineJoin="round";
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
  const CBASE=168;
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

function Line(y0,y1) {
/*
  this.x0=0;
  this.y0=y0;
  this.x1=0;
  this.y1=y1;
*/
  this.dm=new DOMMatrix();
//  this.XK=320*Math.cos(TP);
  this.randomize=()=>{
    this.MK1=((Math.random()<0.5)?1:-1)*(40+200*Math.random());
    this.MK2=((Math.random()<0.5)?1:-1)*(40+200*Math.random());
    this.MK3=((Math.random()<0.5)?1:-1)*(40+200*Math.random());
    this.MK4=((Math.random()<0.5)?1:-1)*(40+200*Math.random());
    this.x0=-(10+50*Math.random());
    this.x1= (10+50*Math.random());
    this.y0=-(10+50*Math.random());
    this.y1= (10+50*Math.random());
    this.path=new Path2D();
    if (Math.random()<0.5) {
      this.path.arc(this.x0,this.y0,this.x1+this.y1,-TP/8,TP/8);
//console.log("arc");
    } else { 
      this.path.moveTo(this.x0,this.y0);
      this.path.lineTo(this.x1,this.y1);
//console.log("line");
    }
  }
  this.randomize();
  this.locate=()=>{
    this.dm.a=s*Math.cos(t/this.MK1);
    this.dm.b=s*Math.sin(t/this.MK2);
    this.dm.c=s*Math.sin(t/this.MK3);
    this.dm.d=s*Math.cos(t/this.MK4);
    this.dm.e=320*Math.sin(t/400);
//    this.dm.f=320*Math.sin(t/800);
  }
  this.getPath=()=>{
    let p=new Path2D();
    p.addPath(this.path,this.dm);
    return p;
  }
  //this.divide=()=>{ this.y1=(this.y0+this.y1)/2; }
}

var cycle=()=>{
  let canv1=container.removeChild(container.firstChild);
  canv1.ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  canv1.style.opacity=1;
  container.append(canv1);
  color.randomize();
  dash1=20+100*Math.random();
  dash2=3+5*Math.random();	// for round linecap
//  dash2=1+3*Math.random();
  SYM=Math.random();
  line.randomize();
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var K=200;
var DUR=TP*K/2;	// half Line dm motion K
var t=0;
var s=Math.pow(Math.sin(t/K),4);
var animate=(ts)=>{
  if (stopped) return;
  t++;
  //s=Math.pow(Math.sin(t/K),1);
  s=Math.sin(t/K);
  draw();
  container.firstChild.style.opacity=1-t/DUR;
  if (t>DUR) {
    t=0;
    cycle();
    if (EM) {
      stopped=true
      parent.postMessage("lf");
    }
  }
  requestAnimationFrame(animate);
}

var dash1=20+100*Math.random();
var dash2=3+5*Math.random();	// for round linecap

var SYM=1;

var getSymmetricPath=(pth)=>{
  const S8=Math.sin(Math.PI/4);
  const C16=Math.cos(Math.PI/8);
  const S16=Math.sin(Math.PI/8);
  const dm1=new DOMMatrix([-1,0,0,1,0,0]);
  const dm2=new DOMMatrix([0,1,-1,0,0,0]);
  const dm3=new DOMMatrix([1,0,0,-1,0,0]);
  const dmr2=new DOMMatrix([S8,S8,-S8,S8,0,0]);	// 1st rotation
  const dmr3=new DOMMatrix([C16,S16,-S16,C16,0,0]);
  let p=new Path2D(pth);  // ? unnecessary?
  p.addPath(p,dm1);
  p.addPath(p,dm3);
  p.addPath(p,dm2);
  if (SYM<0.1) {
    p.addPath(p,dmr2);
    p.addPath(p,dmr3);
    return p;
  } else if (SYM<0.3) { 	// X,4
    let p2=new Path2D();
    p2.addPath(p,dmr2);
    return p2;
  } else if (SYM<0.5) { 	// +,4
    return p;
  } else if (SYM<0.7) { 	// 8,rotated 
    p.addPath(p,dmr2);
    let p2=new Path2D();
    p2.addPath(p,dmr3);
    return p2;
  } else {	// 8
    p.addPath(p,dmr2);
    return p;
  }
}

var draw=()=>{
  let ctx=container.lastChild.ctx;
  ctx.setLineDash([s*dash1,s*dash2]);
/*
let TC=Math.cos(t/800);
let TS=-Math.sin(t/600);
ctx.setTransform(TC,TS,-TS,TC,CSIZE,CSIZE);
*/
  line.locate();
  let p=getSymmetricPath(line.getPath());
  ctx.strokeStyle="#0000001C";
  ctx.lineWidth=8;
  ctx.stroke(p);
  ctx.strokeStyle=color.getRGB();
  ctx.lineWidth=3;
  ctx.stroke(p);
}

onresize();

var line=new Line();

start();
