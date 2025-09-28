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
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

const CCOUNT=1;

function Color(km,kv) {
  const CBASE=160;
  const CT=255-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.random());
    let grn=Math.round(CBASE+CT*Math.random());
    let blu=Math.round(CBASE+CT*Math.random());
    //let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    //let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    //let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
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

var color=new Color();
var col=[];
for (let i=0; i<CCOUNT; i++) {
  col.push(color.getRGB());
}

const MAXR=80;
//const MAXR=40;
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
//  this.curve=curve;
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
  this.getCirclePath=()=>{
    let p=new Path2D();
    p.arc(this.x,this.y,this.r,0,TP);
    return p;
  }
/*
  this.setCirclePath=(p)=>{
    p.moveTo(this.xp,this.yp);
    p.arc(this.x,this.y,this.r,this.a1,this.a1+TP);
  }
*/
  this.setPath=(p)=>{
    p.arc(this.x,this.y,this.r,this.a1,this.a2,this.dir==-1);
  }
  this.setPathT=(cur)=>{
    let d=(cur.t-this.time)/(s*this.dist)*(this.a2-this.a1);
    cur.path.arc(this.x,this.y,this.r,this.a1,this.a1+d,this.dir==-1);
/*
    if (t-this.time>s*this.dist) {
      let cir=new Circle(this,t);
      if (!cir.inbound) {
	curve.state="S";
      } else {
        curve.ca.push(cir);
      }
    }
*/
  }
  this.setPathE=(cur)=>{
    if (cur.state=="G") D=0;
    else D=(cur.t-this.time)/(s*this.dist)*(this.a2-this.a1);
    let xp=this.x+this.r*Math.cos(this.a1+D);
    let yp=this.y+this.r*Math.sin(this.a1+D);
//drawPoint(xp,yp,"yellow",5);
//drawPoint(this.xp,this.yp,"blue");
    cur.path.moveTo(xp,yp);
    if (cur.state=="G") {
      cur.path.arc(this.x,this.y,this.r,this.a1,this.a2,this.dir==-1);
      return true;
    }
    if (cur.t-this.time>s*this.dist) {
      return true;
    }
    cur.path.arc(this.x,this.y,this.r,this.a1+D,this.a2,this.dir==-1);
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
//if (this.dir*(this.a2-this.a1)<0) debugger;
    this.time=0;
  }
  this.checkBounds=()=>{ // make global
    //this.inbound=true;
    let xp2=this.x+this.r*Math.cos(this.a2);
  //  if (Math.abs(xp2)>CSIZE-MAXR) this.inbound=false;
    let yp2=this.y+this.r*Math.sin(this.a2);
  //  if (Math.abs(yp2)>CSIZE-MAXR) this.inbound=false;
    for (let i=-1; i<2; i++) {
      let xpt=xp2+3*i;
      for (let j=-1; j<2; j++) {
        let ypt=yp2+3*j;
	let dc=Math.pow(xpt*xpt+ypt*ypt,0.5);
	//if (dc>CSIZE-MAXR) this.inbound=false;
	if (dc>CSIZE) return false;
      // use circles instead of path, or in addition?, at least 5 indexes away?
	for (let k=0; k<cua.length; k++) {
	  if (ctx.isPointInPath(cua[k].path,xpt+CSIZE,ypt+CSIZE)) return false;
	}
      }
    }
    return true;
  }
}

function Curve(count) {
//  this.count=count;
  this.t=0;
  this.path=new Path2D();
  this.state="N";
  this.ca=[];
  this.ca.push(new Circle(0,0,1));
  this.setPath=()=>{
    this.path=new Path2D();
    let notail=this.ca[0].setPathE(this);
//    let xp=this.ca[0].x+this.ca[0].r*Math.cos(this.ca[0].a1);
//    let yp=this.ca[0].y+this.ca[0].r*Math.sin(this.ca[0].a1);
//    this.path.moveTo(this.ca[0].xp,this.ca[0].yp);

    if (this.state=="S") {
      for (let i=1; i<this.ca.length; i++) {
	this.ca[i].setPath(this.path);
      }
    } else {
      for (let i=1; i<this.ca.length-1; i++) {
	this.ca[i].setPath(this.path);
      }
    }
    if (this.state=="N" || this.state=="G") {
      let fc=this.ca[this.ca.length-1];
      fc.setPathT(this);
      if (this.t-fc.time>=s*fc.dist) {
	let cir=new Circle(fc,this.t);
	if (cir.checkBounds()) {
	  this.ca.push(cir);
	} else {
if (notail) console.log(this);
if (notail) this.state="R";
//if (notail) report();
//if (notail) debugger;
//if (notail) stopped=true;
if (notail) return;
	}
      }
    }
    if (notail) {
      if (this.state=="S") {
        this.state="R";
//stopped=true;
//report();
      } else if (this.state=="G") {
//        if (this.ca.length>count) this.state="N";
if (this.ca.length>=count) this.state="N";
	this.ca[0].time=this.t;
      } else {
//if (this.state=="R") debugger;
	this.ca.shift();
	this.ca[0].time=this.t;
        if (this.ca.length<count) this.state="G";
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
//this.ca[this.ca.length-1].time=s*this.ca[this.ca.length-1].dist;
    this.state="N";
    this.t=0;
  }
for (let i=0; i<count; i++) {
  let c=new Circle(this.ca[i],0);
  if (c.checkBounds()) this.ca.push(c);
  else break;
}
  this.setPath();
}

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

var animate=(ts)=>{
  if (stopped) return;
  cua.forEach((c)=>{ c.t++; c.setPath(); });
  cua.forEach((c)=>{ 
    if (c.state=="R") {
//      c.t=0;
      c.reverse();
    }
if (c.ca.length<3) stopped=true;
  });
  draw();
  requestAnimationFrame(animate);
}

var cua=[];
//var curve=new Curve(10);
//cua.push(curve);
for (let i=0; i<CCOUNT; i++) {
  let cur=new Curve(4);
  if (cur.ca.length>3) {
    cua.push(cur);
  }
}
/*
for (let i=0; i<curve.count; i++) {
  let c=new Circle(curve.ca[i],0);
  if (c.checkBounds()) curve.ca.push(c);
  else break;
}
*/

ctx.lineWidth=6;
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<cua.length; i++) {
//  cua[i].setPath();
  let p=new Path2D(cua[i].path);
//p.addPath(p,dm1);
//p.addPath(p,dm2);
//p.addPath(p,dm3);
//  let p2=new Path2D(p);
//  p2.addPath(p,dm60);
  //p2.addPath(p,dm120);
ctx.lineWidth=6;	// temp?
ctx.strokeStyle=col[i];
  ctx.stroke(p);
  }
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
let curve=cua[0];
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
var report2=()=>{
  for (let i=0; i<cua.length; i++) {
    ctx.fillStyle="#88880088";
    ctx.fill(cua[i].path);
  }
}

// normal arc test on state change
