"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;

const CSIZE=400;
const PolarType=[Math.sin,Math.cos];
const SCALE=40;

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
ctx.fillStyle="#AAD";
ctx.strokeStyle="white";
ctx.lineJoin="round";

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

var Curve=function(rn) {
  //this.r=CSIZE*Math.random();
  this.r=CSIZE*rn/8;
  this.n=4*getRandomInt(1,12);
  this.m=1;
  //this.f1=[1,5,9,13][getRandomInt(1,4)];
  //this.f2=[1,5,9,13][getRandomInt(1,4)];
  this.f1=1;
  this.f2=1;
  this.f3=1;
  this.v=6;
  this.points=[];
  this.randomize=()=>{ 
    if (this.v==4) this.n=4*getRandomInt(2,12);
    else if (this.v==6) this.n=6*getRandomInt(2,8);
    else if (this.v==8) this.n=8*getRandomInt(2,6);
    else this.n=12*getRandomInt(2,4);
    //this.n=10*getRandomInt(1,6);
    //this.n=6*getRandomInt(4,8);
//    this.m=0.6+(0.4-0.8*Math.random());
    //this.m=0.8+(0.5-Math.random());	// fade
    let mult={
      4:[1,5,9,13,17,21,25,29,33,37,41,45,49,53],
      6:[1,7,13,19,25,31,37,43,49],
      7:[1,8,15,22,29,36,43],
      8:[1,9,17,25,33,41,49],
      9:[1,10,19,28,37,46],
      12:[1,13,25,37,49],
      14:[1,15,29,43],
      16:[1,17,33,49],
      18:[1,19,37]
    }
    this.f1=mult[this.v][getRandomInt(0,mult[this.v].length)];
    this.f2=mult[this.v][getRandomInt(0,mult[this.v].length)];
    this.f3=mult[this.v][getRandomInt(0,mult[this.v].length)];
  }
  this.randomize();
  this.getX=(t)=>{ 
    let q=Math.pow(this.r/CSIZE,4);
    return this.r*(q*Math.cos(t)
           +(1-q)/3*(Math.cos(this.f1*t)+Math.cos(this.f2*t)+Math.cos(this.f3*t)));
  }
  this.getY=(t)=>{ 
    let q=Math.pow(this.r/CSIZE,4);
    return this.r*(q*Math.sin(t)
           +(1-q)/3*(Math.sin(this.f1*t)+Math.sin(this.f2*t)+Math.sin(this.f3*t)));
  }
  this.setPoints=()=>{
    this.points=[];
    for (let t=0; t<Math.PI*2-0.001; t+=TP/this.n) {
      this.points.push({"x":this.getX(t),"y":this.getY(t)});
    }
  }
}

var curves=[
  //new Curve(9),
  new Curve(8),new Curve(7),
  new Curve(6),new Curve(5),new Curve(4),
  new Curve(3),new Curve(2),new Curve(1),
];

var setPoints=()=>{
  for (let i=0; i<curves.length; i++) {
    curves[i].setPoints();
  }
}

var huex=0;

var draw=()=>{
  curves.forEach((c)=>{ c.setPoints(); });
  //setPoints();
  curves.sort((a,b)=>{ return b.r-a.r; });
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<curves.length; i++) {
    ctx.beginPath();
  //ctx.fillStyle="hsla(0,0%,0%,0.05)";   // fade
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    ctx.moveTo(curves[i].points[0].x,curves[i].points[0].y);
    for (let j=0; j<curves[i].points.length; j++) {
      ctx.lineTo(curves[i].points[j].x,curves[i].points[j].y);
    }
    ctx.closePath();
    let lw=2+40*Math.pow(curves[i].r/CSIZE,6);
    ctx.lineWidth=lw;
    let op=Math.pow(1-curves[i].r/CSIZE,0.5);
    let hue=huex+270*Math.pow(curves[i].r/CSIZE,2)%360;
    ctx.strokeStyle="hsla("+hue+",100%,60%,"+op+")";
    ctx.stroke();
  }
}

var stopped=true;
var start=()=>{
  if (stopped) {
    stopped=false;
    stx=0;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var stx=0;
var frac=0;
var duration=6000;
var animate=(ts)=>{
  if (stopped) return;
  if (!stx) stx=ts;
  let progress=ts-stx;
  if (progress<duration) {
  } else {
    stx=0;
    huex=++huex%360;
    if (EM) stopped=true;
  }
  draw();
  for (let i=0; i<curves.length; i++) {
    curves[i].r+=0.3;
    if (curves[i].r>CSIZE) {
      curves[i].r=0;
      curves[i].randomize();
    }
  }
  //if (Math.random()<0.001) {
  if (Math.random()<0.003) {
    let v=6;
    if (curves[0].v==6) v=[12,18][getRandomInt(0,2)];
    else if (curves[0].v==8) v=[4,16][getRandomInt(0,2)];
    else if (curves[0].v==4) v=[8,12,16][getRandomInt(0,3)];
    else if (curves[0].v==16) v=[4,8][getRandomInt(0,2)];
    else if (curves[0].v==18) v=[6,9][getRandomInt(0,2)];
    else if (curves[0].v==9) v=18;
    else v=[4,6][getRandomInt(0,2)];
    for (let i=0; i<curves.length; i++) {
      curves[i].v=v;
    }
  }
  requestAnimationFrame(animate);
}

onresize();
if (EM) draw();
else start();
//start();
