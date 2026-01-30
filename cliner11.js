"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;

const DUR=800;

const ellipse=new Path2D();
ellipse.ellipse(0,0,4,2,0,0,TP);
const drawEllipse=(ctx)=>{
  ctx.strokeStyle="#777";
  ctx.lineWidth=2;
  ctx.stroke(ellipse);
} 

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
  c.ctx.globalCompositeOperation="destination-over";
  drawEllipse(c.ctx);
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
    this.RK1=400+400*Math.random();
    this.GK1=400+400*Math.random();
    this.BK1=400+400*Math.random();
    this.RK2=1+TP*Math.random()/2;
    this.GK2=1+TP*Math.random()/2;
    this.BK2=1+TP*Math.random()/2;
    if (Math.random()<0.5) this.RK1*=-1;
    if (Math.random()<0.5) this.GK1*=-1;
    if (Math.random()<0.5) this.BK1*=-1;
  }
  this.randomize();
  this.advance=()=>{
    this.RK2+=Math.random()/2;
    this.GK2+=Math.random()/2;
    this.BK2+=Math.random()/2;
  }
}

var color=new Color();

function Point(xfi,yfi) { this.setLocation=()=>{ this.x=fa[xfi]*CSIZE; this.y=fb[yfi]*CSIZE; } }

function PointO() {
  this.randomize=()=>{
    this.K2=(Math.random()<0.5?1:-1)*(800+800*Math.random());
    this.K4=(Math.random()<0.5?1:-1)*(800+800*Math.random());
  }
  this.randomize();
}

var KF=0.9; //0.008; //(1+Math.sin(TP*t/1000))/2; 

function Fraction(idx) {
  this.f=0;
  this.zero=false;
  this.randomize=()=>{
    //this.K1=800+800*Math.random();
    this.K1=400+400*Math.random();
    if (Math.random()<0.5) this.K1=-this.K1;
    this.K2=TP*Math.random();
  }
  this.randomize();
  this.setFraction=()=>{ 
    //let f=(1+KF*Math.sin(this.K2+TP*t/this.K1))/2; 
    this.f=(1-KF)+KF*Math.pow(Math.sin(this.K2+TP*t/this.K1),2); 
  }
  //this.advance=()=>{ debugger; this.K2+=0.03; }
}

function FractionSet(n) {
  this.fa=(()=>{
    let a=[];
    for (let i=0; i<n; i++) a.push(new Fraction(i));
    return a;
  })();
  this.getArray=()=>{
    let fs=0;
    for (let i=0; i<n; i++) {
      this.fa[i].setFraction();
      fs+=this.fa[i].f;
    }
    let ffa=[0];
    for (let i=0, acc=0; i<n; i++) {
      acc+=this.fa[i].f/fs;
      ffa.push(acc);
    }
    return ffa;
  }
  this.randomize=()=>{ for (let i=0; i<n; i++) { this.fa[i].randomize(); } }
/* this.advance=()=>{ for (let i=0; i<n; i++) { this.fa[i].advance(); } } */
}

var f1=new Fraction();
var f2=new Fraction();

function Line(pp1,pp2) {
  this.getPath=()=>{
    let p=new Path2D();
    let mx=(pp2.x+pp1.x)/2;
    let my=(pp2.y+pp1.y)/2;
    p.moveTo(mx,my);
    p.lineTo(pp1.x,pp1.y);
    p.moveTo(mx,my);
    p.lineTo(pp2.x,pp2.y);
    return p;
  }
  this.getSizeProx=()=>{
    return Math.pow(Math.pow(pp2.x-pp1.x,2)+Math.pow(pp2.y-pp1.y,2),0.5);  // ?what power fct
  }
}

var cycleCanvas=()=>{
  let canv1=container.removeChild(container.firstChild);
  canv1.ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  canv1.style.opacity=1;
  container.append(canv1);
  drawEllipse(canv1.ctx);
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

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  draw();
  if (EM && t%200==0) {
    stopped=true
    parent.postMessage("lf");
  } 
  container.firstChild.style.opacity=Math.pow(1-t/DUR,3);
  if (t>DUR) {
    t=0;
    color.advance();
    cycleCanvas();
  //  color.randomize();
    fs1.randomize();
    fs2.randomize();
  }
  requestAnimationFrame(animate);
}

var pt1=new Point(1,0);
var pt2=new Point(2,0);
var pt3=new Point(0,1);
var pt4=new Point(0,2);
var pt5=new Point(1,3);
var pt6=new Point(2,3);
var pt7=new Point(3,1);
var pt8=new Point(3,2);
var pt9=new Point(4,0);
var pt10=new Point(5,0);
var pt11=new Point(0,4);
var pt12=new Point(0,5);
var pt13=new Point(4,3);
var pt14=new Point(5,3);
var pt15=new Point(3,4);
const pa=[pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8,pt9, pt10, pt11, pt12, pt13, pt14, pt15];

var pto=new PointO(pt1,pt2,pt3,pt4);

const fs1=new FractionSet(5);
const fs2=new FractionSet(5);
var fa=fs1.getArray();
var fb=fs1.getArray();

var locate=()=>{
  fa=fs1.getArray();
  fb=fs2.getArray();
  pa.forEach((p)=>{ p.setLocation(); });
  pto.x=pt1.x+(pt2.x-pt1.x)*(1+Math.sin(t/pto.K2))/2;
  pto.y=pt3.y+(pt4.y-pt3.y)*(1+Math.sin(t/pto.K4))/2;
}

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);

const ta=[
  new Line(pto,pt1),
  new Line(pto,pt2),
  new Line(pto,pt3),
  new Line(pto,pt4),
  new Line(pto,pt5),
  new Line(pto,pt6),
  new Line(pto,pt7),
  new Line(pto,pt8),

  new Line(pt1,pt3),
  new Line(pt2,pt7),
  new Line(pt4,pt5),
  new Line(pt6,pt8),

  new Line(pt5,pt11),
  new Line(pt6,pt15),
  new Line(pt7,pt9),
  new Line(pt8,pt13),
  new Line(pt13,pt15),
]

var drawPoint=(x,y,col)=>{	// diag
  let ctx=container.lastChild.ctx;
  ctx.beginPath();
  ctx.arc(x,y,2,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var draw=()=>{
//ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  locate();
  for (let i=0; i<ta.length; i++) {
    let pth=ta[i].getPath();
  pth.addPath(pth,dmx);
  pth.addPath(pth,dmy);
//    ctx.fill(pth);
//ctx.setLineDash([t/5,20,t/5,1000]);
//ctx.setLineDash([Math.pow(t/5,2),1000]);
    let ctx=container.lastChild.ctx;
    ctx.setLineDash([t/6,1000]);
    ctx.strokeStyle="#0000000C";
    ctx.lineWidth=9;
    ctx.stroke(pth);
    ctx.strokeStyle=color.getRGB(ta[i].getSizeProx()/25);  // move to quick linear ramp
    ctx.lineWidth=5;
    ctx.stroke(pth);
  }
}

onresize();

start();
