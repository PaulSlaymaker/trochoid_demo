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
ctx.lineCap="round";

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

const MAXR=168;

function Circle(gc,d) {
  this.gc=gc;
  if (gc==0) {
    this.dir=d;
    this.a1=d==-1?0:TP/2;
    this.cl=0;
  } else {
    this.cl=gc.cl+1;
  }
let st=80-6*Math.random()*this.cl;//75+10*Math.random();
let lt=320-6*Math.random()*this.cl; //300+40*Math.random();
  let akf=this.cl/NCOUNT;
  this.KA1=akf*st+(1-akf)*lt;
  //this.KA1=80+240*Math.random();
  this.KA2=TP*Math.random();
  //this.KR1=80+240*Math.random();
  this.KR1=akf*st+(1-akf)*lt;
  this.KR2=TP*Math.random();
  this.setAR=()=>{
    //this.r=MAXR+MAXR/2+MAXR/2*Math.sin(this.KR2+t/this.KR1);
//this.r=MAXR+MAXR*Math.sin(this.KR2+t/this.KR1);
this.r=10+(MAXR+MAXR*Math.sin(this.KR2+t/this.KR1))/Math.pow(rd,this.cl);
    if (gc==0) {
      if (d==-1) {
	this.a2=-(TP/48+TP/32+TP/32*Math.sin(this.KA2+t/this.KA1));	// FIXME
      } else { 
	this.a2=TP/48+TP/32+TP/32*Math.sin(this.KA2+t/this.KA1);	// FIXME
	this.a2+=TP/2;
	this.a2=this.a2%TP;
      }
      this.x=d*this.r;	
      this.y=0;
      this.dist=this.r*(this.dir*(this.a2-this.a1));
    } else {
      this.dir=-gc.dir;
      //this.x=gc.x-this.dir*(gc.r+this.r)*Math.cos(gc.a2);
      this.x=gc.x+(gc.r+this.r)*Math.cos(gc.a2);
      this.y=gc.y+(gc.r+this.r)*Math.sin(gc.a2);
      this.a1=(gc.a2+TP/2)%TP; 
      let aff=Math.pow((this.cl-1)/NCOUNT,0.2);
      let af=(1-aff)*32+aff*3;
//console.log(af);
//this.a2=TP/2-gc.a2+TP/32+TP/32*Math.sin(this.KA2+t/this.KA1);
      //if (this.dir==-1) this.a2=this.a1+this.dir*TP/8*(1+Math.sin(this.KA2+t/this.KA1));
      //else this.a2=this.a1+TP/8*(1+Math.sin(this.KA2+t/this.KA1));	// FIXME
      this.a2=this.a1+this.dir*TP/af*(1+Math.sin(this.KA2+t/this.KA1));
      if (this.a2<0) this.a2+=TP;
      //let and=this.dir*(this.a2-this.a1);
      let and=Math.abs(this.a2-this.a1);
      if (and>Math.PI) and=TP-and;
      //this.dist=this.r*(this.dir*(this.a2-this.a1));
      this.dist=this.r*and+gc.dist;
if (this.dist<0) debugger;
    }
  }
//  this.setAR();	// remove?
  this.getCirclePath=()=>{
    let p=new Path2D();
    p.arc(this.x,this.y,this.r,0,TP);
    return p;
  }
/*
  var getPath=()=>{
    let p=new Path2D();
    let xp1=this.x+this.r*Math.cos(this.a1);	// calc in setAR?
    return p;
  } 
*/
  this.report=()=>{
    ctx.strokeStyle="white";
    ctx.lineWidth=0.5;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,TP);
    ctx.stroke();
    let xp1=this.x+this.r*Math.cos(this.a1);
    let yp1=this.y+this.r*Math.sin(this.a1);
    //console.log("xp1 "+xp1.toFixed(0),yp1.toFixed(0));
    console.log("a1 "+this.a1.toFixed(2));
    drawPoint(xp1,yp1,"blue",3);
    let xp2=this.x+this.r*Math.cos(this.a2);
    //let yp2=this.y-this.r*Math.sin(this.a2);
//let yp2=this.y+this.dir*this.r*Math.sin(this.a2);
let yp2=this.y+this.r*Math.sin(this.a2);
    //console.log("xp2 "+xp2.toFixed(0),yp2.toFixed(0));
    console.log("a2 "+this.a2.toFixed(2));
    drawPoint(xp2,yp2);
    console.log(this.cl+" "+this.dist.toFixed(0));
  }
  this.showPath=()=>{
    ctx.strokeStyle="red";
    ctx.lineWidth=1;
    ctx.beginPath();
    if (this.cl==0) ctx.moveTo(0,0);
    if (this.dir==1) ctx.arc(this.x,this.y,this.r,this.a1,this.a2);
    else ctx.arc(this.x,this.y,this.r,this.a1,this.a2,true);
    ctx.stroke();
  }
  this.setPath=(p)=>{
    p.arc(this.x,this.y,this.r,this.a1,this.a2,this.dir==-1);
/*
    if (this.dir==1) {
      p.arc(this.x,this.y,this.r,this.a1,this.a2,this.dir==-1);
    } else {
      p.arc(this.x,this.y,this.r,this.a1,this.a2,,this.dir==-1);
    }
*/
  }
}

function Curve() {
  this.ca=[];
  this.path=new Path2D();
//  this.dist=0;
  this.setPath=()=>{
    for (let i=0; i<this.ca.length; i++) this.ca[i].setAR();
    this.path=new Path2D();
    let xp1=this.ca[0].x+this.ca[0].r*Math.cos(this.ca[0].a1);
    let yp1=this.ca[0].y+this.ca[0].r*Math.sin(this.ca[0].a1);
    this.path.moveTo(xp1,yp1);
    for (let i=0; i<this.ca.length; i++) {
      this.ca[i].setPath(this.path);
//      this.dist+=this.ca[i].dist;
    }
  }
  this.getDistance=(tidx)=>{
    let dist=0;
    for (let i=0; i<this.ca.length; i++) {
      dist+=this.ca[i].dist;
      if (i==tidx) break;
    }
    return dist;
  }
}

/*
var f=1;
//ctx.setLineDash([1,2000]);
var drawO=()=>{	// ? states: moving, growing, shrinking
  //f=1-t/800;
  ctx.strokeStyle=color.getRGB(0);
  for (let i=0; i<cua.length; i++) {
    if (cua[i].dist>t) continue;
    //ctx.lineDashOffset=cua[i].dist-t;	// dist for each curve
    //let lw=40-40*Math.pow(t/1000,0.7);
    ctx.lineWidth=3;
    ctx.stroke(cua[i].path);
  }
//    if (cua[i].oc) ctx.strokeStyle="white";
//    else ctx.strokeStyle=color.getRGB(0);
}
*/

const getHex=(path)=>{
  const dm60=new DOMMatrix([0.5,S6,-S6,0.5,0,0]);
  const dm120=new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]);
  let hex=new Path2D(path);
  hex.addPath(path,dm60);
  hex.addPath(path,dm120);
  return hex;
}

//ctx.fillStyle="#00000008";
const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);
const dm3=new DOMMatrix([0,1,1,0,0,0]);

ctx.lineWidth=3;
//ctx.setLineDash([-100,200000]);
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let path=new Path2D();
  for (let i=0; i<cua.length; i++) {
    cua[i].setPath();
    let p=new Path2D(cua[i].path);
    p.addPath(p,dm1);
    p.addPath(p,dm2);
    //p.addPath(p,dm3);
let p2=getHex(p);
    path.addPath(p2);

ctx.lineWidth=12;
let dash=120+100*Math.sin(t/100);
ctx.setLineDash([dash,20000]);
if (cua[i].ca[0].cl==0) ctx.lineDashOffset=0;
else ctx.lineDashOffset=cua[i].ca[0].gc.dist;

ctx.strokeStyle=color2.getRGB(0);
ctx.stroke(p2);

/*
ctx.lineWidth=6;
ctx.strokeStyle="black";
ctx.stroke(p);
*/

/*
ctx.lineWidth=3;
ctx.setLineDash([]);
//ctx.setLineDash([t,20000]);
//if (cua[i].ca[0].cl==0) ctx.lineDashOffset=0;
//else ctx.lineDashOffset=cua[i].ca[0].gc.dist;
    ctx.strokeStyle=color.getRGB(0);
//ctx.globalAlpha=1;
    ctx.stroke(p);
*/
/*
ctx.lineWidth=1;
ctx.setLineDash([40,200]);
if (cua[i].ca[0].cl==0) ctx.lineDashOffset=-pt;
else ctx.lineDashOffset=-pt+cua[i].ca[0].gc.dist;
    ctx.strokeStyle=color.getRGB(2);
//ctx.globalAlpha=0.5;
    ctx.stroke(p);

if (cua[i].ca[0].cl==0) ctx.lineDashOffset=-pt2;
else ctx.lineDashOffset=-pt2+cua[i].ca[0].gc.dist;
    ctx.strokeStyle=color.getRGB(1);
//ctx.globalAlpha=0.5;
    ctx.stroke(p);
*/

  }
  ctx.setLineDash([]);
  ctx.lineWidth=6;
  ctx.strokeStyle="black";
  ctx.stroke(path);
  ctx.lineWidth=2;
  ctx.strokeStyle=color.getRGB();
  ctx.stroke(path);
}

var stopped=true;
const DUR=1000;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var pt=0;
var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  pt=-10+160*(1+Math.sin(t/400));
  //pt=-10+cua[0].ca[NCOUNT].dist/3*(1+Math.sin(t/200));
  if (EM && t%200==0) {
    stopped=true;
    parent.postMessage("lf");
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();

const NCOUNT=12;
//const NCOUNT=6;
//let rd=1.8;	// ? curve specific, varying about some value, larger rd, shorter r
//let rd=1.8;	// ? curve specific, varying about some value, larger rd, shorter r
let rd=1.6;

var createBranch=()=>{
  let sc=getRandomInt(0,cua.length,true);
  let start=getRandomInt(0,cua[sc].ca.length-1,true);
//if (cua[sc].ca[start] == undefined) debugger;
  let end=NCOUNT-cua[sc].ca[start].cl;
if (end==0) return false;
  let curve=new Curve();
  for (let i=0; i<end; i++) { 	// FIXME, not start but cua[sc].ca[start].cl
    //let d=i==0?Math.random()<0.5?-1:1:-curve.ca[i-1].dir;
    if (i==0) curve.ca.push(new Circle(cua[sc].ca[start]));
    else curve.ca.push(new Circle(curve.ca[i-1]));
  }
  return curve;
}

var createCurve=(d,n)=>{
  let curve=new Curve();
  curve.ca.push(new Circle(0,d));
  for (let i=0; i<NCOUNT; i++) curve.ca.push(new Circle(curve.ca[i],d));
  return curve;
}

var getCurveArray=()=>{
  let arr=[];
  let i=0;
  for (let i=0; i<1; i++) {
    let cur=createCurve(Math.pow(-1,i));
    arr.push(cur);
  }
  return arr;
}

var cua=getCurveArray();
for (let i=0; i<4; i++) {
  let cb=createBranch();
  if (cb instanceof Curve) cua.push(cb);
}

start();
