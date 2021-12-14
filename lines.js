"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const EM=location.href.endsWith("em");
const CSIZE=400;

var ctx=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  let co=document.createElement("div");
  co.style.textAlign="center";
  co.append(c);
  body.append(co);
  return c.getContext("2d");
})();

ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=5;

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var cuFrac=(frac)=>{
  let f1=.2;
  let f2=.8;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var curve={
  f:[1,1,1,1,1,1],
  randomize:()=>{ 
    let mult=[,,,,
      [5,1,9,13,17,21,25],,
      [7,1,13,19,25],
      [8,1,15,22,29],
      [9,1,17,25],
      [10,1,19,28],
      [11,1,21,31],
      [12,1,23],
      [13,1,25],
      [14,1,27],
      [15,1,29],
      [16,1,31],
//      [17,1,33],
//      [1,18]
    ];
    for (let i=0; i<6; i++) curve.f[i]=mult[V][getRandomInt(0,mult[V].length,true)];
  },
  getX:(t)=>{ 
    let x=0;
    for (let i=0; i<5; i++) x+=Math.sin(curve.f[i]*t);
    return x/5;
  },
  getY:(t)=>{ 
    let y=0;
    for (let i=0; i<5; i++) y+=Math.cos(curve.f[i]*t);
    return y/5;
  }
};

var ps=0;
var pts=[];
var setCurve=()=>{
  curve.randomize();
  pts[ps]=[];
  for (let t=0; t<=Math.PI*2; t+=TP/Z) {
    let x=CSIZE*curve.getX(t);
    let y=CSIZE*curve.getY(t);
    pts[ps].push({"x":x,"y":y});
  }
}

var points=[];
var lines=[];
var setPoints=(frac)=>{
  points=[];
  lines=[];
  let f=cuFrac(frac);
  let j=(ps+1)%2;
  let k=ps;
  for (let i=0; i<pts[j].length; i++) {
    let x=(1-f)*pts[j][i].x+f*pts[k][i].x;
    let y=(1-f)*pts[j][i].y+f*pts[k][i].y;
//    let r=Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5);
    points[i]={"x":x,"y":y};
  }
  for (let j=0; j<points.length; j++) {
    for (let k=j+1; k<points.length; k++) {
      let d=Math.pow(Math.pow(points[j].x-points[k].x,2)+Math.pow(points[j].y-points[k].y,2),0.5);
      if (d<D2) continue;
      if (d>D1) continue;
      lines.push({"i":j,"j":k,"d":d});
    }
  }
}

var draw=(frac)=>{
  setPoints(frac);
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
ctx.fillStyle="hsla(0,0%,0%,0.05)";   // fade
ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
let ddiff=D1-D2;
  for (let i=0; i<lines.length; i++) {
    let p=lines[i].i;
    ctx.beginPath();
    ctx.moveTo(points[p].x,points[p].y);
    ctx.lineTo(points[lines[i].j].x,points[lines[i].j].y);
    ctx.closePath();
let q=(ddiff/2-Math.abs(lines[i].d-(D1+D2)/2))/ddiff/2;
    ctx.strokeStyle="hsla("+(hue+360*lines[i].d/(ddiff))+",90%,70%,"+q+")";
    ctx.stroke();
  }
}

/*
var drawLine=(frac, fin)=>{
  setPoints(frac);
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.beginPath();
  ctx.moveTo(points[0].x,points[0].y);
  for (let i=1; i<points.length; i++) {
    ctx.lineTo(points[i].x,points[i].y);
  }
  ctx.closePath();
  ctx.strokeStyle="white";
  ctx.stroke();
}
*/

var transit=()=>{
  ps=++ps%2;
//ps=(ps-1)*-1;
  curve.randomize();
  setCurve();
  //setMon();
}

var stopped=true;
var start=()=>{
  if (stopped) {
    stopped=false;
    if (frac>0) stx=performance.now()-frac*duration;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var pauseTS=1400;
var pause=(ts)=>{
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    if (EM) stopped=true;
    transit();
    requestAnimationFrame(animate);
  }
}

var S=0;
var op=1;
var stx=0;
var frac=0;
var duration=12000;
var animate=(ts)=>{
  if (stopped) return;
  if (!stx) {
    stx=ts;
  }
  let progress=ts-stx;
  if (progress<duration) {
    frac=progress/duration;
    draw(frac);
    requestAnimationFrame(animate);
  } else {
    draw(1);
    stx=0;
    frac=0;
    pauseTS=performance.now()+4;
    requestAnimationFrame(pause);
    //transit();
    //requestAnimationFrame(animate);
  }
  if (S==0) {
    if (Math.random()<0.0005)  S=1;
  } else if (S==1) {
    op-=0.03;
    if (op<0) {
      op=0;
      reset();
      transit();
      transit();
      S=2;
    }
    ctx.canvas.style.opacity=op;
  } else if (S==2) {
    op+=0.03;
    if (op>1) { op=1; S=0; }
    ctx.canvas.style.opacity=op;
  }
}

/*
var mon="";
var setMon=()=>{
  mon="";
  for (let i=0; i<5; i++) mon+=" f"+i+":"+curve.f[i];
  mon+=" Z:"+Z+" V:"+V;
}
*/

var D1=40;
var D2=20;
var V=6;
var Z=8;
var hue=getRandomInt(0,360);
var maxr=TP*CSIZE/Z;
var reset=()=>{
  //V=[4,6,7,8,9,10,11,12,13,14,15,16,17][getRandomInt(0,13)];
  V=[8,7,9,6,10,4,11,12,13,14,15,16][getRandomInt(0,13,true)];
  if (V==4) Z=4*getRandomInt(30,70);
  else if (V==6) Z=6*getRandomInt(20,40);
  else if (V==7) Z=7*getRandomInt(20,30);
  else if (V==8) Z=8*getRandomInt(15,30);
  else if (V==9) Z=9*getRandomInt(15,20);
  else if (V==10) Z=10*getRandomInt(10,20);
  else if (V==11) Z=11*getRandomInt(10,20);
  else if (V==12) Z=12*getRandomInt(10,20);
  else if (V==13) Z=13*getRandomInt(10,20);
  else if (V==14) Z=14*getRandomInt(10,20);
//  else if (V==15) Z=15*getRandomInt(10,15);
//  else if (V==16) Z=16*getRandomInt(10,15);
  else Z=15*getRandomInt(10,20);
  maxr=TP*CSIZE/Z;
  hue=getRandomInt(0,360);
  D2=getRandomInt(20,60);
  D1=D2+getRandomInt(20,40);
  //setMon();
}

onresize();
reset();
transit();
transit();
//setMon();

if (EM) {
  for (let i=0; i<8; i++) draw(0);
} else {
  start();
}
