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
c.style.outline="1px dotted gray";
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

//const MAXR=80;
const MAXR=40;
var s=0.5;

var getAngle=(x,y,r,a,d)=>{	// not especially effective for central trend
  let angle1=a+d*Math.PI*Math.random();
  let xp=x+r*Math.cos(a);
  let yp=y+r*Math.sin(a);
  let d1=Math.pow(xp*xp+yp*yp,0.5);
  let angle2=a+d*Math.PI*Math.random();
  xp=x+r*Math.cos(a);
  yp=y+r*Math.sin(a);
  let d2=Math.pow(xp*xp+yp*yp,0.5);
  if (d2>d1) return angle1;
  else return angle2;	// return xp,yp
}

var D;

function Circle(gc,timp,d) {
  this.gc=gc;
  if (gc==0) {
    this.dir=d;
    this.a1=Math.PI*Math.random();
  }
  this.time=timp;
  this.setAR=()=>{
    this.r=8+MAXR*Math.random();
    if (gc==0) {
      this.a2=this.a1+this.dir*Math.PI*Math.random();
      this.x=80*Math.random();
      this.y=80*Math.random();
//if (this.a2<this.a1) debugger;
    } else {
      this.dir=-gc.dir;
      this.x=gc.x+(gc.r+this.r)*Math.cos(gc.a2);
      this.y=gc.y+(gc.r+this.r)*Math.sin(gc.a2);
      this.a1=(gc.a2+TP/2)%TP; 
      this.a2=this.a1+this.dir*Math.PI*Math.random();
//this.a2=getAngle(this.x,this.y,this.r,this.a1,this.dir);
    }
    this.dist=this.r*Math.abs(this.a2-this.a1);
//    this.xp1=this.x+this.r*Math.cos(this.a1);
//    this.yp1=this.y+this.r*Math.sin(this.a1);
  }
  this.setAR();
/*
  this.getCirclePath=()=>{
    let p=new Path2D();
    p.arc(this.x,this.y,this.r,0,TP);
    return p;
  }
*/
  this.setCirclePath=(p)=>{
//    let xp=this.x+this.r*Math.cos(this.a1);
//    let yp=this.y+this.r*Math.sin(this.a1);
    p.moveTo(this.xp,this.yp);
    p.arc(this.x,this.y,this.r,this.a1,this.a1+TP);
  }
  this.setPath=(p)=>{
//    if (fc) p.arc(this.x,this.y,this.r,this.a1,this.a1+TP); else 
    p.arc(this.x,this.y,this.r,this.a1,this.a2,this.dir==-1);
  }
  this.setPathT=(p)=>{
    //let d=t/DUR*(this.a2-this.a1);
    let d=(t-this.time)/(s*this.dist)*(this.a2-this.a1);
/*
    let and2=this.dir*(this.a2-this.a1);
    if (and2<0) {
      p.arc(this.x,this.y,this.r,this.a1,this.a1-d+TP,this.dir==-1);
    } else {
      p.arc(this.x,this.y,this.r,this.a1,this.a1+d,this.dir==-1);
    }
*/
    p.arc(this.x,this.y,this.r,this.a1,this.a1+d,this.dir==-1);
    if (t-this.time>s*this.dist) {
    let cir=new Circle(this,t);
    if (!cir.inbound) {
//      stopped=true;
//      report();
      state="S";
//s=4;
    }
    else curve.ca.push(cir);
    }
  }
  this.setPathE=(p)=>{
if (state=="G") D=0;
else    D=(t-this.time)/(s*this.dist)*(this.a2-this.a1);
    let xp=this.x+this.r*Math.cos(this.a1+D);
    let yp=this.y+this.r*Math.sin(this.a1+D);
//drawPoint(xp,yp,"yellow",5);
//drawPoint(this.xp,this.yp,"blue");
    p.moveTo(xp,yp);
if (state=="G") {
  p.arc(this.x,this.y,this.r,this.a1,this.a2,this.dir==-1);
  return true;
}
    if (t-this.time>s*this.dist) {
      return true;
    }
    p.arc(this.x,this.y,this.r,this.a1+D,this.a2,this.dir==-1);
    return false;
  }
  this.getCirclePath=()=>{
    let p=new Path2D();
    p.arc(this.x,this.y,this.r,0,TP);
    return p;
  }
  this.reverse=()=>{
    this.dir*=-1;
    let at=this.a1;
    this.a1=this.a2;
    this.a2=at;
    this.time=0;
  }
  this.inbound=true;
  let xp2=this.x+this.r*Math.cos(this.a2);
//  if (Math.abs(xp2)>CSIZE-MAXR) this.inbound=false;
  let yp2=this.y+this.r*Math.sin(this.a2);
//  if (Math.abs(yp2)>CSIZE-MAXR) this.inbound=false;
  let dc=Math.pow(xp2*xp2+yp2*yp2,0.5);
  if (dc>CSIZE-MAXR) this.inbound=false;
}

function Curve() {
  this.ca=[];
  this.path=new Path2D();
  this.setPath=()=>{
//    for (let i=0; i<this.ca.length; i++) this.ca[i].setAR();
    this.path=new Path2D();

    let notail=this.ca[0].setPathE(this.path);
//    let xp=this.ca[0].x+this.ca[0].r*Math.cos(this.ca[0].a1);
//    let yp=this.ca[0].y+this.ca[0].r*Math.sin(this.ca[0].a1);
//    this.path.moveTo(this.ca[0].xp,this.ca[0].yp);

    if (state=="S") {
      for (let i=1; i<this.ca.length; i++) {
	this.ca[i].setPath(this.path);
      }
    } else {
      for (let i=1; i<this.ca.length-1; i++) {
	this.ca[i].setPath(this.path);
      }
    }


    if (state=="N" || state=="G") {
      this.ca[this.ca.length-1].setPathT(this.path);
    }
    if (notail) {
      if (state=="S") {
        state="R";
//stopped=true;
//report();
      } else if (state=="G") {
        if (this.ca.length>COUNT) state="N";
	this.ca[0].time=t;
      } else {
//if (state!="N") debugger;
	this.ca.shift();
	this.ca[0].time=t;
        if (this.ca.length<COUNT) state="G";
      }
    }
  }
  this.drawEnds=()=>{
    let c1=this.ca[0];
    let xp1=c1.x+c1.r*Math.cos(c1.a1);
    let yp1=c1.y+c1.r*Math.sin(c1.a1);
    drawPoint(xp1,yp1);
    let c2=this.ca[this.ca.length-1];
    let xp2=c2.x+c2.r*Math.cos(c2.a2);
    let yp2=c2.y+c2.r*Math.sin(c2.a2);
    drawPoint(xp2,yp2);
  }
  this.reverse=()=>{
    for (let i=0; i<this.ca.length; i++) this.ca[i].reverse();
    this.ca.reverse();
    state="N";
  }
}

/*
var checkR=()=>{
  let c=curve.ca[curve.ca.length-1];
  let xp2=c.x+c.r*Math.cos(c.a2);
  if (Math.abs(xp2)>CSIZE-MAXR) stopped=true;
  let yp2=c.y+c.r*Math.sin(c.a2);
  if (Math.abs(yp2)>CSIZE-MAXR) stopped=true;
}
*/

const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);
const dm3=new DOMMatrix([0,1,1,0,0,0]);
const dm60=new DOMMatrix([0.5,S6,-S6,0.5,0,0]);
const dm120=new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]);

var drawPoint=(x,y,col,r)=>{	// diag
  ctx.beginPath();
  let rad=3;
  if (r) rad=r;
  ctx.arc(x,y,rad,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var pauseTS=1000;
var pause=(ts)=>{
  if (EM) stopped=true;
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

var state="N";
var DUR=300;
var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
//  if (t>=DUR) stopped=true;
//  if (t>curve.ca[curve.ca.length-1].r) stopped=true;
  draw();
  if (state=="R") {
    curve.reverse();
    t=0;
  }
if (curve.ca.length<3) stopped=true;
  requestAnimationFrame(animate);
}

const COUNT=10;
var curve=new Curve();
curve.ca.push(new Circle(0,0,1));
for (let i=0; i<COUNT; i++) {
  curve.ca.push(new Circle(curve.ca[i],0));
}

ctx.lineWidth=3;
ctx.strokeStyle=color.getRGB();
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  curve.setPath();
  let p=new Path2D(curve.path);
//p.addPath(p,dm1);
//p.addPath(p,dm2);
//p.addPath(p,dm3);
/*
  let p2=new Path2D(p);
  p2.addPath(p,dm60);
  p2.addPath(p,dm120);
*/
//ctx.lineWidth=3;	// temp?
  ctx.stroke(p);
//  curve.drawEnds();
}

onresize();
draw();

ctx.font="bold 11px sans-serif";
ctx.textAlign="center";
var report=()=>{
  ctx.lineWidth=1;
//  ctx.strokeStyle="yellow";
//  ctx.stroke(ca[0].getCirclePath());
  ctx.strokeStyle="silver";
  ctx.fillStyle="white";
  for (let i=0; i<curve.ca.length; i++) {
    let c=curve.ca[i];
    ctx.stroke(c.getCirclePath());
    //let rep=i+" "+ca[i].a.toFixed(1);
    ctx.fillText(i,c.x,c.y-7);
    let xp1=c.x+c.r*Math.cos(c.a1);
    let yp1=c.y+c.r*Math.sin(c.a1);
    drawPoint(xp1,yp1,"red");
    let xp2=c.x+c.r*Math.cos(c.a2);
    let yp2=c.y+c.r*Math.sin(c.a2);
    drawPoint(xp2,yp2,"yellow",4);
  }
}
