"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;
const S6=Math.sin(TP/6);
const C6=0.5;

let OUTLINE=false;

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
//ctx.globalCompositeOperation="destination-over";
//ctx.setLineDash([2,100]);

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
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(o+this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(o+this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(o+this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=30+140*Math.random();
    this.GK1=30+140*Math.random();
    this.BK1=30+140*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();

function Point(xp,yp) {
  this.x=xp;
  this.y=yp;
  this.randomize=()=>{
    this.K1=800+800*Math.random();
    this.K2=TP*Math.random();
  }
  this.randomize();
}

function Fraction() {
  this.randomize=()=>{
    this.K1=800+800*Math.random();
    this.K2=TP*Math.random();
  }
  this.randomize();
  this.setFraction=()=>{ this.f=(1+0.8*Math.sin(this.K2+TP*t/this.K1))/2; }
}

var f1=new Fraction();
var f2=new Fraction();
var f3=new Fraction();
var f4=new Fraction();

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

//var DUR=800;
var t=0;
//var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
//  c++;
  draw();
//if (EM && t%200==0) stopped=true
//  container.firstChild.style.opacity=1-c/DUR;
/*
  if (t%DUR==0) {
    c=0;
//    cycle();
stopped=true
ctx.globalCompositeOperation="source-over";
  }
*/
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

var pt1=new Point(0,0);	// 3 moveable tiling points
var pt2=new Point(0,0);
var pt3=new Point(0,0);

const p1=new Point(0,0);	// 8 drawing points
p1.setLocation=()=>{
  p1.x=pt2.x*(1+Math.sin(p1.K2+TP*t/p1.K1))/2;
}
const p2=new Point();
p2.setLocation=()=>{
  let f=(1+Math.sin(p2.K2+TP*t/p2.K1))/2;
  p2.x=pt1.x*f;
  p2.y=pt1.y*f;
}
const p3=new Point();
p3.setLocation=()=>{
  let f=(1+Math.sin(p3.K2+TP*t/p3.K1))/2;
  p3.x=pt1.x+(pt2.x-pt1.x)*f;
  p3.y=pt1.y+(pt2.y-pt1.y)*f;
}

const p4=new Point();
p4.setLocation=()=>{
  let f=(1+Math.sin(p4.K2+TP*t/p4.K1))/2;
  p4.x=pt1.x+(pt3.x-pt1.x)*f;
  p4.y=pt1.y+(pt3.y-pt1.y)*f;
}

const p5=new Point();
p5.setLocation=()=>{
  let f=(1+Math.sin(p5.K2+TP*t/p5.K1))/2;
  p5.x=pt2.x+(pt3.x-pt2.x)*f; //(1+Math.sin(p5.K2+TP*t/p5.K1))/2;
  p5.y=pt2.y+(pt3.y-pt2.y)*f; //(1+Math.sin(p5.K2+TP*t/p5.K1))/2;
}

const p6=new Point(0,0);
p6.setLocation=()=>{
  p6.x=pt2.x+(CSIZE-pt2.x)*(1+Math.sin(p6.K2+TP*t/p6.K1))/2;
}

const p7=new Point();
p7.setLocation=()=>{
  let f=(1+Math.sin(p7.K2+TP*t/p7.K1))/2;
  p7.x=pt3.x+(CSIZE-pt3.x)*f;
  p7.y=pt3.y-pt3.y*f;
}
const p8=new Point();
p8.setLocation=()=>{
  let f=(1+Math.sin(p8.K2+TP*t/p8.K1))/2;
  p8.x=pt3.x+(x6-pt3.x)*f;
  p8.y=pt3.y+(y6-pt3.y)*f;
}

var locate=()=>{
  f1.setFraction();
  f2.setFraction();
  f3.setFraction();
  f4.setFraction();
  let fs=f1.f+f2.f+f3.f+f4.f;
  let ff1=f1.f/fs;
  let ff2=f2.f/fs;
  let ff3=f3.f/fs;
  let r1=ff1*CSIZE;
//  let [r1,r2]=[ff1*CSIZE,ff2*CSIZE];
  pt1.x=r1*S6;
  pt1.y=r1*C6;
  pt2.x=(ff1+ff2)*CSIZE;
  let r3=(ff1+ff2+ff3)*CSIZE;
  pt3.x=r3*S6;
  pt3.y=r3*C6;
  const pa=[p1,p2,p3,p4,p5,p6,p7,p8];
  pa.forEach((p)=>{ p.setLocation(); });
}

const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dmr=(()=>{
  let da=[];
  for (let i=0; i<6; i++) {
    da.push(new DOMMatrix([Math.cos(i*TP/6),Math.sin(i*TP/6),-Math.sin(i*TP/6),Math.cos(i*TP/6),0,0]));
  }
  return da;
})();

const x5=CSIZE;	// stationary points
const y5=0;
const x6=S6*CSIZE;
const y6=C6*CSIZE;

var getTriPath=(xc,yc,pp1,pp2,pp3)=>{
  let p=new Path2D();
  p.moveTo(xc,yc);
  p.lineTo(pp1.x,pp1.y);
  p.moveTo(xc,yc);
  p.lineTo(pp2.x,pp2.y);
  p.moveTo(xc,yc);
  p.lineTo(pp3.x,pp3.y);
  return p;
}

var draw=()=>{
  //ctx.setLineDash([1+200*c/DUR,2000]);
//ctx.setLineDash([dash1,dash2]);
if (OUTLINE)  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  ctx.fillStyle="#00000002";
//  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);

  locate();

  let xc1=(pt1.x+pt2.x)/3;
  let yc1=(pt1.y+pt2.y)/3;
  let ps=new Path2D(getTriPath(xc1,yc1,p1,p2,p3));

  let xc2=(pt1.x+pt2.x+pt3.x)/3;
  let yc2=(pt1.y+pt2.y+pt3.y)/3;
  ps.addPath(getTriPath(xc2,yc2,p3,p4,p5));

  let xc3=(pt2.x+pt3.x+CSIZE)/3;
  let yc3=(pt2.y+pt3.y)/3; 
  ps.addPath(getTriPath(xc3,yc3,p5,p6,p7));

  let xc4=(x6+pt3.x+CSIZE)/3;
  let yc4=(y6+pt3.y)/3;
  let path4=new Path2D();
  path4.moveTo(xc4,yc4);
  path4.lineTo(p7.x,p7.y);
  path4.moveTo(xc4,yc4);
  path4.lineTo(p8.x,p8.y);
  ps.addPath(path4);

  let pf=new Path2D(ps);
  for (let i=1; i<6; i++) pf.addPath(ps,dmr[i]);
  pf.addPath(pf,dmy);

  ctx.strokeStyle=color.getRGB(0);
  ctx.lineWidth=1;
  ctx.stroke(pf);
  ctx.strokeStyle="#00000010";
  ctx.lineWidth=4;
  ctx.stroke(pf);

if (OUTLINE) {
ctx.lineWidth=0.5;
ctx.strokeStyle="white";
let tri=new Path2D();
tri.moveTo(0,0);
tri.lineTo(pt2.x,pt2.y);
tri.lineTo(pt1.x,pt1.y);
tri.closePath();
ctx.stroke(tri);
var tri2=new Path2D();
tri2.moveTo(pt2.x,pt2.y);
tri2.lineTo(pt3.x,pt3.y);
tri2.lineTo(pt1.x,pt1.y);
tri2.closePath();
ctx.stroke(tri2);
var tri3=new Path2D();
tri3.moveTo(pt2.x,pt2.y);
tri3.lineTo(CSIZE,0);
tri3.lineTo(pt3.x,pt3.y);
tri3.closePath();
ctx.stroke(tri3);
var tri4=new Path2D();
tri4.moveTo(pt3.x,pt3.y);
tri4.lineTo(CSIZE,0);
tri4.lineTo(S6*CSIZE,C6*CSIZE);
tri4.closePath();
ctx.stroke(tri4);
drawPoint(0,0,"red");
drawPoint(pt1.x,pt1.y,"yellow");
drawPoint(pt2.x,pt2.y,"white");
drawPoint(pt3.x,pt3.y,"cyan");
drawPoint(x5,y5,"green");
drawPoint(x6,y6,"green");
drawPoint((pt1.x+pt2.x)/3,(pt1.y+pt2.y)/3,"blue");
drawPoint((pt1.x+pt2.x+pt3.x)/3,(pt1.y+pt2.y+pt3.y)/3,"blue");
drawPoint(xc2,yc2,"blue");
drawPoint(xc3,yc3,"blue");
drawPoint(xc4,yc4,"blue");
drawPoint(p1.x,p1.y,"magenta");
drawPoint(p2.x,p2.y,"magenta");
drawPoint(p3.x,p3.y,"magenta");
drawPoint(p4.x,p4.y,"magenta");
drawPoint(p5.x,p5.y,"magenta");
drawPoint(p6.x,p6.y,"magenta");
drawPoint(p7.x,p7.y,"magenta");
drawPoint(p8.x,p8.y,"magenta");
}

}

onresize();

start();

