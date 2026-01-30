"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S6=Math.sin(Math.PI/3);
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

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color(km,kv) {
  const CBASE=174;
  const CT=255-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=km+kv*Math.random();
    this.GK1=km+kv*Math.random();
    this.BK1=km+kv*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color(200,400);
var color2=new Color(40,80);

const MAXR=40;

function Circle(gc,d) {
  this.gc=gc;
  if (gc==0) {
    this.dir=d;
    this.a1=Math.PI*Math.random();
  }
  this.KA1=100+300*Math.random();
  this.KA2=TP*Math.random();
  this.KR1=100+300*Math.random();
  this.KR2=TP*Math.random();
  this.KX1=80+240*Math.random();
  this.KX2=TP*Math.random();
  this.KY1=80+240*Math.random();
  this.KY2=TP*Math.random();
  this.setAR=()=>{
    this.r=8+MAXR*(1+Math.sin(this.KR2+t/this.KR1))/2;
    if (gc==0) {
      if (d==-1) {
	this.a2=-(TP/48+TP/32+TP/32*Math.sin(this.KA2+t/this.KA1));	// FIXME
      } else { 
        this.a2=this.a1+this.dir*Math.PI*Math.sin(this.KA2+t/this.KA1)/2;
//	this.a2+=TP/2;
	this.a2=this.a2%TP;
      }
      this.x=80*Math.sin(this.KX2+t/this.KX1);
      this.y=80*Math.sin(this.KY2+t/this.KY1);
    } else {
      this.dir=-gc.dir;
      this.x=gc.x+(gc.r+this.r)*Math.cos(gc.a2);
      this.y=gc.y+(gc.r+this.r)*Math.sin(gc.a2);
      this.a1=(gc.a2+TP/2)%TP; 
//this.a2=TP/2-gc.a2+TP/32+TP/32*Math.sin(this.KA2+t/this.KA1);
      //if (this.dir==-1) this.a2=this.a1+this.dir*TP/8*(1+Math.sin(this.KA2+t/this.KA1));
      //else this.a2=this.a1+TP/8*(1+Math.sin(this.KA2+t/this.KA1));	// FIXME
      //this.a2=this.a1+this.dir*TP/af*(1+Math.sin(this.KA2+t/this.KA1));
      this.a2=this.a1+this.dir*Math.PI*(1+Math.sin(this.KA2+t/this.KA1))/2;
      if (this.a2<0) this.a2+=TP;
      //let and=this.dir*(this.a2-this.a1);
      let and=Math.abs(this.a2-this.a1);
      if (and>Math.PI) and=TP-and;
    }
  }
//  this.setAR();	// remove?
/*
  this.getCirclePath=()=>{
    let p=new Path2D();
    p.arc(this.x,this.y,this.r,0,TP);
    return p;
  }
*/
  this.setCirclePath=(p)=>{
    let xp=this.x+this.r*Math.cos(this.a1);
    let yp=this.y+this.r*Math.sin(this.a1);
    p.moveTo(xp,yp);
    p.arc(this.x,this.y,this.r,this.a1,this.a1+TP);
  }
  this.setPath=(p)=>{
    let xp=this.x+this.r*Math.cos(this.a1);
    let yp=this.y+this.r*Math.sin(this.a1);
    p.moveTo(xp,yp);
//    if (fc) p.arc(this.x,this.y,this.r,this.a1,this.a1+TP); else 
    p.arc(this.x,this.y,this.r,this.a1,this.a2,this.dir==-1);
  }
}

function Curve() {
  this.ca=[];
  this.path=new Path2D();
  this.setPath=()=>{
    for (let i=0; i<this.ca.length; i++) this.ca[i].setAR();
    this.path=new Path2D();
    for (let i=0; i<this.ca.length; i++) {
      if (i==0) this.ca[0].setCirclePath(this.path);
      else if (i==this.ca.length-1) this.ca[this.ca.length-1].setCirclePath(this.path);
      else this.ca[i].setPath(this.path);
    }
  }
  this.getIPath=()=>{
    let p=new Path2D();
    p.arc(curve.ca[0].x,curve.ca[0].y,curve.ca[0].r/2,0,TP);
    return p;
  }
}

const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);
const dm3=new DOMMatrix([0,1,1,0,0,0]);

var drawP=(p)=>{
  ctx.fillStyle=color2.getRGB();
  ctx.fill(p);
  ctx.strokeStyle="black";
  ctx.stroke(p);
}

var drawPointsX=()=>{
  let p=curve.getIPath();
  p.addPath(p,dm2);
  p.addPath(p,dm3);
  drawP(p);
}

var drawPointsY=()=>{
  let p=curve.getIPath();
  p.addPath(p,dm1);
  p.addPath(p,dm3);
  drawP(p);
}

var drawPoints=()=>{
  let p=curve.getIPath();
  p.addPath(p,dm1);
  p.addPath(p,dm2);
  drawP(p);
}

var pauseTS=1000;
var pause=(ts)=>{
  if (EM) {
    stopped=true;
    parent.postMessage("lf");
  }
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
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

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  draw();
  if (Math.abs(curve.ca[0].x)<0.1) {
    drawPointsX();
    pauseTS=performance.now()+3000;
    requestAnimationFrame(pause);
  } else if (Math.abs(curve.ca[0].y)<0.1) {
    drawPointsY();
    pauseTS=performance.now()+3000;
    requestAnimationFrame(pause);
  } else if (Math.abs(Math.abs(curve.ca[0].x)-Math.abs(curve.ca[0].y))<0.05) {
    drawPoints();
    pauseTS=performance.now()+3000;
    requestAnimationFrame(pause);
  } else requestAnimationFrame(animate);
}

var curve=new Curve();
curve.ca.push(new Circle(0,1));
for (let i=0; i<8; i++) {
  curve.ca.push(new Circle(curve.ca[i]));
}

ctx.lineWidth=3;
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  curve.setPath();
  let p=new Path2D(curve.path);
  p.addPath(p,dm1);
  p.addPath(p,dm2);
  p.addPath(p,dm3);
  ctx.strokeStyle=color.getRGB();
  ctx.stroke(p);
}

onresize();
start();
