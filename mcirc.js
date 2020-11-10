"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
body.style.margin="0";

const TP=2*Math.PI;
const CSIZE=500;
var XD=100;
var YD=100;

const ctx=(()=>{
  let c=document.createElement("canvas");
  c.width="1000";
  c.height="1000";
  c.style.display="block";
  body.append(c);
  return c.getContext("2d");
})();

onresize=()=>{ 
//  let D=Math.min(window.innerWidth,window.innerHeight); 
//  ctx.canvas.style.width=D+"px";
//  ctx.canvas.style.height=D+"px";
  ctx.canvas.width=window.innerWidth;
  ctx.canvas.height=window.innerHeight;
  XD=window.innerWidth/2;
  YD=window.innerHeight/2;
  ctx.translate(XD,YD);
  ctx.lineWidth=2;
}
onresize();

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var coprime=(a,b)=>{
  if (a==b) return a;
  //const primes=[2,3,5,7,9,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107]; 
  const primes=[2,3,5,7,9,11,13,17,19,23,29,31];
  if (a==1 || b==1) return 0;
  let mm=Math.max(a,b)/2;
  for (var h=0; primes[h]<mm; h++) {
    if (a%primes[h]==0 && b%primes[h]==0) {
      return primes[h];
    }
  }
  return 0;
}

var PC=getRandomInt(10,250);
//console.log(PC);

var Curve=function() {
  this.ax=1;
  this.ay=1;
  this.getX=(z)=>{ return Math.cos(this.ax*z); }
  this.getY=(z)=>{ return Math.sin(this.ay*z); }
  this.randomize=()=>{
    this.ax=[-1,1][getRandomInt(0,2)]*2*getRandomInt(0,16)+1;
    this.ay=[-1,1][getRandomInt(0,2)]*2*getRandomInt(0,16)+1;
    let cop=coprime(Math.abs(this.ax),Math.abs(this.ay));
    if (cop>0 && PC%cop==0) {
      this.ay=this.ax+2;
    }
//console.log(this.ax+" "+this.ay);
  }
  this.randomize();
}

var curves=[new Curve(),new Curve()];
var curveSet=0;

const getX=(z)=>{ 
  let c2=(curveSet+1)%2;
  return (1-frac)*curves[curveSet].getX(z)+frac*curves[c2].getX(z);
}
const getY=(z)=>{ 
  let c2=(curveSet+1)%2;
  return (1-frac)*curves[curveSet].getY(z)+frac*curves[c2].getY(z); 
}

var PT=function(a,rp) {
  this.a=a;
  this.fx=()=>{ return (XD-100)*getX(this.a); }
  this.fy=()=>{ return (YD-100)*getY(this.a); }
  this.x=this.fx();
  this.y=this.fy();
  this.lines=[];
  this.maxr=90;
  this.r=90;
  //this.motion=0.001*(1-2*Math.random())*(CSIZE/rp);
//  this.motion=0.0005*([-1,1][getRandomInt(0,2)])*(CSIZE/rp);
  //this.motion=0.0005;
  this.motion=0.0002;
  this.move=()=>{
    this.a+=this.motion;
    this.x=this.fx();
    this.y=this.fy();
  }
}

const LN=function(pt1,pt2) {
  this.pt1=pt1;
  this.pt2=pt2;
  this.setd=()=>{
    this.d=Math.pow(Math.pow(pt1.x-pt2.x,2)+Math.pow(pt1.y-pt2.y,2),0.5);
  }
  this.setd();
}

var Color=function(op) {
  this.hx=getRandomInt(0,360);
  this.hue=this.hx;
  if (op) {
    this.sat=30+20*Math.random();
    this.lum=30+20*Math.random();
  } else {
    this.sat=50+20*Math.random();
    this.lum=50+20*Math.random();
  }
  this.getHSL=()=>{ return this.hsl; }
  this.getHSLA=(op)=>{ 
    return"hsla("+Math.floor(this.hue)%360+","+this.sat+"%,"+this.lum+"%,"+op+")";
  }
  this.getHSLDark=()=>{ 
    return"hsl("+Math.floor(this.hue)%360+","+this.sat+20+"%,"+this.lum+10+"%)";
  }
/*
  this.ff=1+(1-2*Math.random())/5;
  this.transit=()=>{
    //let t=performance.now()/40;
    let t=performance.now()/4;
    this.hue=this.hx+this.ff*t;
    this.hsl="hsl("+Math.floor(this.hue)%360+","+this.sat+"%,"+this.lum+"%)";
  }
*/
}

var getBlack=(op)=>{ return"hsla(0,0%,20%,"+op+")"; }

var hues=[];
for (let i=0; i<getRandomInt(3,16); i++) { 
  hues.push(new Color()); 
}

var draw=()=>{
  ctx.fillStyle="hsla(0,0%,0%,0.03)";
  ctx.fillRect(-XD,-YD,2*XD,2*YD);
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<points.length; i++) {
    ctx.beginPath();
    ctx.arc(points[i].x,points[i].y,points[i].r,0,TP);
    ctx.closePath();
    ctx.strokeStyle=hues[i%hues.length].getHSLA(0.5);
    ctx.stroke();
//      ctx.fillStyle=hues[i%hues.length].getHSLA(1);
//      ctx.fill();

    ctx.beginPath();
    ctx.arc(points[i].x,points[i].y,points[i].r/4,0,TP);
    ctx.closePath();
    ctx.fillStyle=hues[i%hues.length].getHSLDark();
    ctx.fill();
  }
}

var reset=()=>{
  PC=getRandomInt(10,250);
  points=[];
  lines=[];
  for (let i=0; i<PC; i++) addPoint(i);
  hues=[];
  for (let i=0; i<getRandomInt(3,16); i++) hues.push(new Color()); 
  curves[0].randomize();
  curves[1].randomize();
}

var S=0;
var op=1;
var t=0;
var stopped=true;
var pause=0;
var pauseCount=0;
var frac=0;
var animate=(ts)=>{
  if (stopped) return;
  if (S==0) {
    //if (Math.random()<0.001)  S=1;
    if (pauseCount%5==4) {  S=1; pauseCount=0; }
  } else if (S==1) {
    op-=0.02;
    if (op<0) { op=0; reset(); ctx.clearRect(-XD,-YD,2*XD,2*YD); S=2; }
    ctx.canvas.style.opacity=op;
  } else if (S==2) {
    op+=0.02;
    if (op>1) { op=1; S=0; }
    ctx.canvas.style.opacity=op;
  }
  t+=0.004;
  if (pause<2) {
    pause+=0.002;
  } else {
    frac+=0.002;  // make ratio of 1, ie: 1,2,5 
    if (frac>1) { 
      curves[curveSet].randomize();
      curveSet=++curveSet%2;
      frac=0; // calc 2
      pause=0;
      pauseCount++;
      //S=0; 
    }
  }
  move();
  draw();
  requestAnimationFrame(animate);
}

const radius=20;
var points=[];
var lines=[];
var addPoint=(idx)=>{
  let pt=new PT(TP*idx/PC);
  for (let j=0; j<points.length; j++) {
    let ln=new LN(pt,points[j]);
    lines.push(ln);
    pt.lines.push(ln);
    points[j].lines.push(ln);
    if (points[j].r>ln.d/2) { points[j].r=ln.d/2; }  // adjust for radii
    if (pt.r>ln.d/2) { pt.r=ln.d/2; }
  }
  points.push(pt);
}
for (let i=0; i<PC; i++) addPoint(i);

var move=()=>{
  for (let i=0; i<points.length; i++) points[i].move();
  for (let i=0; i<lines.length; i++) lines[i].setd();
  for (let i=0; i<points.length; i++) {
    points[i].lines.sort((a,b)=>{ return a.d-b.d; })
    points[i].r=Math.min(points[i].maxr,points[i].lines[0].d/2);
  }
}

var start=()=>{
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

start();
