"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
c.style.outline="1px solid #444";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
//ctx.lineJoin="round";
ctx.lineWidth=4;

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

var Color=function() {
  this.hue=getRandomInt(0,360);
  this.sat;
  this.lum;
  this.randomize=()=>{
    this.hue=(this.hue+getRandomInt(0,180))%360;
    this.sat=60+35*Math.random();
    this.lum=30+40*Math.random();
  }
  this.randomize();
  this.getHSLString=()=>{
    return "hsl("+this.hue+","+this.sat+"%,"+this.lum+"%)";
  }
}
ctx.fillStyle=new Color().getHSLString(true);
//ctx.strokeStyle=new Color(true).getHSLString();

var Growth=function() {
this.time=-getRandomInt(0,12000);
  this.randomize=()=>{
    // constrain X,Y within cirlce of radius 300, offset up 100
    let a=TP*Math.random();
    //let r=300*Math.pow(Math.random(),0.5);
    let rx=300*Math.pow(Math.random(),0.5);
    let ry=250*Math.pow(Math.random(),0.5);
    this.X=Math.round(rx*Math.cos(a));
    this.Y=Math.round(-100+ry*Math.sin(a));	// up 160 for 240?
    this.Xpf=Math.random();
    this.Ypf=Math.random();
    //this.sColor=new Color().getHSLString();
    this.sColor=new Color().getHSLString();
    this.fColor=new Color().getHSLString();
    this.kinex=getRandomInt(1,6);
    this.kiney=getRandomInt(1,6);
    this.duration=20000+Math.round(Math.random()*4000);
//    this.frac=0;
  }
  this.randomize();
  this.grow=(ts,dback)=>{
    if (!this.time) this.time=ts;
    let progress=ts-this.time;
    if (progress<this.duration) {
      this.frac=progress/this.duration;
      this.draw(this.frac,dback);
    } else {
      this.draw(1,dback);
      this.time=0;
      this.randomize();
    }
  }
  this.getPoint=()=>{
// adjustable? 3, 420, TP/4, 40,
    let z=-TP*this.frac;
    if (X<0) z=TP*this.frac;
    let xc=this.X+80*Math.cos(this.kinex*z);
    let yc=this.Y+80*Math.sin(this.kiney*z);
    let f=Math.sin(this.frac*TP/2);	// 0->1->0
    let x=f*xc;
    let y=(1-f)*200+f*yc;
    return {"x":x,"y":y};
  }
  this.draw=(f,d)=>{
    let xy=this.getPoint(f);
    let x=xy.x;
    let y=xy.y;
  //  let xp=x*(1-f)+f*Xp
  //  let yp=y*(1-f)+f*Yp
    //let xpf=(0*(1-f)+f*x)*Xpf;
    let xpf=this.frac*x*Xpf;
  //let f2=Math.pow(f,3);
    let f2=Math.sin(this.frac*TP/2);
  //let ypf=(1-f2)*200+f2*(y-(y+400))*Ypf;
  //let ypf=(1-f2)*200+f2*(this.Y-(this.Y+400))*Ypf;
  //let ypf=(1-f2)*200+f2*(this.Y-(this.Y+400))*Ypf;
//if (frac>0.99) console.log(f2+" "+ypf);
  //let ypf=(1-f2)*200+f2*(y-y+400)*Ypf;
let ypf=(1-f2)*200+f2*(y-(400-this.Y)/2*this.Ypf);

let stem=new Path2D();
    stem.moveTo(0,400);
    stem.bezierCurveTo(0,200, xpf,ypf, x,y);
    ctx.strokeStyle=this.sColor;
ctx.lineWidth=4;
    ctx.stroke(stem);

/*
    ctx.beginPath();
    ctx.moveTo(0,400);
    ctx.bezierCurveTo(0,200, xpf,ypf, x,y);
    ctx.strokeStyle=this.sColor;
ctx.lineWidth=4;
    ctx.stroke();
*/

    ctx.beginPath();
let w=2+f2*12;
    ctx.moveTo(x+w,y);
    ctx.arc(x,y,w,0,TP);
ctx.strokeStyle="gray";
ctx.lineWidth=1;
ctx.stroke();
    ctx.fillStyle=this.fColor;
    ctx.fill();
  }
}

var growth=(()=>{
  let n=[];
  for (let i=0; i<16; i++) n.push(new Growth);
  return n;
})();

/*
var pts=[];
var C=12;
var setLPoints=()=>{
  pts=[];
  for (let i=0; i<C; i++) {
    let t=TP/C*i;
    let f=200;
    pts.push({"x":f*Math.cos(t),"y":f*Math.sin(t)});
  }
}
*/

var X=400-800*Math.random();
var Y=-400+400*Math.random();
var Xp=X*Math.random();
var Yp=Y-(Y+400)*Math.random();
var Xpf=Math.random();
var Ypf=Math.random();

/*
var drawPath=(frac)=>{
  ctx.beginPath();
  ctx.moveTo(0,200);	// stem height
  for (let t=0; t<420; t++) {
    let z=2*t*TP/420;
//if (X<0) z=t*TP/420+TP/4;
    //let xc=X-40+40*Math.cos(z);
    //let yc=Y+40*Math.sin(z);
    let xc=X-40+40*Math.cos(z);
    let yc=Y+40*Math.sin(z);
//    let f=t/420;
    let f=Math.sin(t/420*TP/2);
    let x=f*xc;
    let y=(1-f)*200+f*yc;
//if (t==210) { console.log(x+" "+X); console.log(y+" "+Y); }
    ctx.lineTo(x,y);
  }
  ctx.strokeStyle="red";
  ctx.stroke();
}
*/

var drawCircle=(frac)=>{
  ctx.beginPath();
  let a=TP*Math.random();
  let r=300*Math.pow(Math.random(),0.5);
  let x=r*Math.cos(a);
  let y=-100+r*Math.sin(a);
  ctx.moveTo(x+5,y);
  ctx.arc(x,y,5,0,TP);
  ctx.fill();
}

var drawStem=(f)=>{
let Y0=200;
  ctx.beginPath();
  let x=0*(1-f)+f*X;
  let y=Y0*(1-f)+f*Y;
//  let xp=x*(1-f)+f*Xp
//  let yp=y*(1-f)+f*Yp
  //let xpf=(0*(1-f)+f*x)*Xpf;
  let xpf=f/4*x*Xpf;
//let f2=Math.pow(f,3);
    let f2=Math.sin(frac*TP/4);
//let ypf=(1-f2)*200+f2*(y-(y+400))*Ypf;
//let ypf=(1-f2)*Y0+f2*(Y-(Y+400))*Ypf;
//let ypf=(1-f2)*Y0+f2*(-400+Y)*Ypf;
let ypf=(1-f2)*Y0+f2*(y-(400-Y)/2*Ypf);
//let ypf=(1-f2)*Y0+f2*(y-200*Ypf);
//if (frac>0.99) console.log(f2+" "+ypf);
  ctx.moveTo(0,400);
  ctx.bezierCurveTo(0,Y0, xpf,ypf, x,y);
  ctx.strokeStyle="blue";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x+7,y);
  ctx.arc(x,y,7,0,TP);
  ctx.fill();
}

var drawS=(frac)=>{
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.beginPath();
  ctx.moveTo(0,400);
  //ctx.bezierCurveTo(0,-400, 200,-200-200*(frac), 200,-200);
  //ctx.bezierCurveTo(0,-400, 200,-300+100*(Math.sin(TP*frac)), 200,-200);
  //ctx.bezierCurveTo(0,-400, 0,-300+100*(Math.sin(TP*frac)), 200,-200);
  //ctx.bezierCurveTo(0,-400, 100  ,-300, 200,-200);
  //ctx.bezierCurveTo(0,-400, 100+50*(Math.sin(TP*frac)),-300, 200,-200);
  ctx.bezierCurveTo(0,0, Xp,Yp, X,Y);
  ctx.strokeStyle="blue";
  ctx.stroke();
//drawPath();
}

var draw=(frac)=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  drawStem(frac);
  growth.forEach((g)=>{ g.draw(frac); });
//  drawPath();
}

var randomize=()=>{
  let a=TP*Math.random();
  let r=300*Math.pow(Math.random(),0.5);
  X=r*Math.cos(a);
  Y=-100+r*Math.sin(a);
//  X=400-800*Math.random();
//  Y=-400+200*Math.random();
//  Y=-400+400*Math.random();
  Yp=Y-(Y+400)*Math.random();
  Xp=X*Math.random();
  Xpf=Math.random();
  Ypf=Math.random();
}

var stopped=true;
var start=()=>{
  if (stopped) { 
//randomize();
    stopped=false;
    growth.forEach((g)=>{ 
      if (g.frac>0) g.time=performance.now()-g.frac*g.duration;
    });
    //if (frac>0) time=performance.now()-frac*duration;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var frac=0;
var time=0;
const duration=12000;
var animate=(ts)=>{
  if (stopped) return;
ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    for (let i=0; i<growth.length; i++) {
      growth[i].grow(ts,i<growth.length/2);
    }
    //growth.forEach((g)=>{ g.grow(ts); });
/*
  if (!time) {
    time=ts;
  }
  let progress=ts-time;
  if (progress<duration) {
    frac=progress/duration;
    draw(frac);
//  } else if (progress<7000) {
//    frac=1;
  } else {
    draw(1);
    time=0;
//stopped=true;
    //randomize();
    growth.forEach((g)=>{ g.randomize(); });
  }
*/
  requestAnimationFrame(animate);
}

onresize();

start();
