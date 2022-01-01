"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");

const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var t=0;

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

var az;

var hue1=getRandomInt(0,360);
var hue2=hue1+getRandomInt(80,100);
var hue3=hue2+getRandomInt(80,100);
//var hue2=hue1+getRandomInt(90,150);
//var hue3=(hue2+getRandomInt(90,150))%360;

var getLine=()=>{
  let p=new Path2D();
  p.moveTo(-180,0);
  p.lineTo(180,0);
  return p;
}

var line=getLine();
/*
var line=new Path2D();
line.moveTo(-180,0);
line.lineTo(180,0);
*/
/*
line.moveTo(-180,0);
line.lineTo(0,-90);
line.lineTo(180,0);
line.lineTo(0,90);
line.closePath();
*/
//line.moveTo(186,0);
//line.arc(180,0,6,0,TP);
//line.arc(0,0,90,0,TP);
//line.ellipse(0,0,180,10,0,0,TP);
/*
line.moveTo(180,0);
line.arc(90,0,90,0,TP);
*/

//var F4=[-7,-5,-3,3,5,7][getRandomInt(0,6)];
var F4=1;
var F1=-1;
var F1b=1;
var F2=1;
var F2b=1;
var F3=F1;
var F3b=1;
var F4=F2;
var F4b=1;

var az=50;
var duration=az*4;

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  var path=new Path2D();
  let k1=Math.pow(Math.sin(TP*t/(4*duration)),1);
//  let k2=Math.pow(Math.sin(TP*t/1600),1);
  for (let a=0; a<200; a++) {
    let z=a*TP/200;
    let x=200*(k1*(Math.cos(F2*z)+Math.cos(F2b*z))/2+(1-k1)*(Math.cos(F4*z)+Math.cos(F4b*z))/2);
    let y=200*(k1*(Math.sin(F2*z)+Math.sin(F2b*z))/2+(1-k1)*(Math.sin(F4*z)+Math.sin(F4b*z))/2);
  //let x=200*(k2*Math.cos(F2*z)+(1-k2)*Math.cos(F4*z));
  //let y=200*(k2*Math.sin(F2*z)+(1-k2)*Math.sin(F4*z));
  //let x=200*Math.cos(z);
  //let y=200*Math.sin(z);
    let z2=z+TP*t/(4*duration);
//if (a<100) z2=-z2;
  //    let q1=k1*Math.cos(F1*z2)+(1-k1)*Math.cos(F3*z2);
  //    let q2=k1*Math.sin(F1*z2)+(1-k1)*Math.sin(F3*z2);
      let q1=k1*(Math.cos(F1*z2)+Math.cos(F1b*z2))/2+(1-k1)*(Math.cos(F3*z2)+Math.cos(F3b*z2))/2;
      let q2=k1*(Math.sin(F1*z2)-Math.sin(F1b*z2))/2+(1-k1)*(Math.sin(F3*z2)-Math.sin(F3b*z2))/2;
    let dm=new DOMMatrix([q1,q2,-q2,q1,x,y]);
    path.addPath(line,dm);
  }
//let lw=[7,3.7,1.2];
let lw=[14,7.4,2.4];
//let lw=[28,14.8,4.8];
  ctx.beginPath();
  //ctx.strokeStyle=colors[0];
  ctx.strokeStyle="hsl("+hue3+",80%,50%)";
  ctx.lineWidth=lw[0];
  ctx.stroke(path);
  ctx.beginPath();
  //ctx.strokeStyle=colors[1];
  ctx.strokeStyle="hsl("+hue2+",90%,70%)";
  ctx.lineWidth=lw[1];
  ctx.beginPath();
  ctx.stroke(path);
  //ctx.strokeStyle=colors[2];
  ctx.strokeStyle="hsl("+hue1+",100%,30%)";
  ctx.lineWidth=lw[2];
  ctx.stroke(path);
}

var time=0;
var animate=(ts)=>{
  if (stopped) return;
//  if (!time) time=ts;
  t++;
  if (t%20==0) { hue1=(hue1+1)%360; hue2=(hue2+1)%360; hue3=(hue3+1)%360; }
  if (t==duration) {
    F4=F2;
    F4b=F2b;
    F3=F1;
    F3b=F1b;
//az=F1*F1+F1b*F1b+F2*F2+F2b*F2b+F3*F3+F3b*F3b+F4*F4+F4b*F4b;
  } else if (t==2*duration) {
    if (Math.random()<0.6) {
      F1=[-9,-7,-5,-3,-1,1,3,5,7,9][getRandomInt(0,10)];
      if (F1==-F1b) F1=F1b;
    }
    if (Math.random()<0.6) {
      F1b=[-9,-7,-5,-3,-1,1,3,5,7,9][getRandomInt(0,10)];
      if (F1b==-F1) F1b=F1;
    }
    if (Math.random()<0.6) {
      F2=[1,-1,3,-3,5,-5][getRandomInt(0,6,true)];
      if (F2==-F2b) F2=F2b;
    }
    if (Math.random()<0.6) {
      F2b=[1,-1,3,-3,5,-5][getRandomInt(0,6,true)];
      if (F2b==-F2) F2b=F2;
    }
az=F1*F1+F1b*F1b+F2*F2+F2b*F2b+F3*F3+F3b*F3b+F4*F4+F4b*F4b;
duration=az*4;
    t=0;
if (EM) stopped=true;
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();

if (EM) draw();
else start();
