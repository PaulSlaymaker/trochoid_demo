"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;

const container=document.createElement("div");
container.style.margin="auto";
body.append(container);
for (let i=0; i<3; i++) {
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  c.ctx=c.getContext("2d");
  c.ctx.translate(CSIZE,CSIZE);
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

function Point() {
  this.randomize=()=>{
    //this.K1=80+160*Math.random();
    this.K1=100+200*Math.random();
    this.K2=TP*Math.random();
  }
  this.randomize();
  this.setAngle=()=>{
    this.a=TP*(2/9+1/9*(1+Math.sin(this.K2+t/this.K1))/2);
    //this.a=TP/4;
  }
  this.setLocation=(a)=>{
    const A1=TP/8,A2=3*TP/8,A3=5*TP/8,A4=7*TP/8;
    const K=2*Math.sin(TP/8);
//if (a<0) debugger;
    if (a>TP) a-=TP;
    if (a<A1) {
      this.x=CSIZE/2;
      this.y=CSIZE/4*(1+K*Math.sin(a));
    } else if (a<A2) {
      this.x=CSIZE/4*(1+K*Math.cos(a));
      this.y=CSIZE/2;
    } else if (a<A3) {
      this.x=0;
      this.y=CSIZE/4*(1+K*Math.sin(a));
    } else if (a<A4) {
      this.x=CSIZE/4*(1+K*Math.cos(a));
      this.y=0;
    } else {
      this.x=CSIZE/2;
      //this.y=CSIZE/4+K*CSIZE/4*Math.sin(a);
      this.y=CSIZE/4*(1+K*Math.sin(a));
    }
  }
}

var cycle=()=>{
  let canv1=container.removeChild(container.firstChild);
  canv1.ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  canv1.style.opacity=1;
  container.append(canv1);
  color.randomize();
  p1.randomize();
  p2.randomize();
  p3.randomize();
  p4.randomize();
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

var DUR=1200;
var t=0;
var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  c++;
  draw();
  container.firstChild.style.opacity=1-c/DUR;
  if (t%DUR==0) {
    c=0;
    cycle();
  }
  if (EM && t%400==0) {
    stopped=true
    parent.postMessage("lf");
  }
  requestAnimationFrame(animate);
}

var p1=new Point();
var p2=new Point();
var p3=new Point();
var p4=new Point();

var locate=()=>{
  let rot=TP*Math.pow(Math.sin(t/800),2);
  p1.setAngle();
  p1.setLocation(p1.a+rot);
  p2.setAngle();
  p2.setLocation(p1.a+p2.a+rot);
  p3.setAngle();
  p3.setLocation(p1.a+p2.a+p3.a+rot);
  p4.setAngle();
  p4.setLocation(p1.a+p2.a+p3.a+p4.a+rot);
}

var dash1;
var dash2;
var KD2=TP*Math.random();

var draw=()=>{
  const dm1=new DOMMatrix([1,0,0,1,-CSIZE,0]);
  const dm2=new DOMMatrix([-1,0,0,1,0,0]);
  const dm3=new DOMMatrix([1,0,0,1,0,-CSIZE]);
  const dm4=new DOMMatrix([1,0,0,-1,0,0]);
  let ctx=container.lastChild.ctx;
dash1=400-400*Math.cos(TP/2*c/DUR);
dash2=800-600*Math.sin(KD2+TP*t/4000);
  //ctx.setLineDash([dash1,400]);
  ctx.setLineDash([dash1,dash2]);
//  ctx.lineDashOffset=-c/40;
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  locate();
  let p=new Path2D();
  p.moveTo(p1.x,p1.y);
  p.lineTo(p2.x,p2.y);
  p.lineTo(p3.x,p3.y);
  p.lineTo(p1.x,p1.y);
  p.lineTo(p4.x,p4.y);
  p.lineTo(p3.x,p3.y);
  p.addPath(p,dm1);
  p.addPath(p,dm2);
  p.addPath(p,dm3);
  p.addPath(p,dm4);
  ctx.strokeStyle="#00000010";
  ctx.lineWidth=9;
  ctx.stroke(p);
  ctx.strokeStyle=color.getRGB();
  ctx.lineWidth=3;
  ctx.stroke(p);
}

onresize();

start();
