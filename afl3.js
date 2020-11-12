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
  c.width="800";
  c.height="800";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-24; 
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

var C=100;
var W=100;   // even

var q=[];
for (let w=0; w<=W; w++) q[w]=new Array(C+1);

ctx.strokeStyle="hsl("+getRandomInt(0,360)+",70%,60%)";
var hues=[];
const COLCOUNT=100;
for (let i=0; i<COLCOUNT; i++) {
  let bh=getRandomInt(0,360);
  let sat=50+20*Math.random();
  let lum=50+20*Math.random();
  if (i%2==0) {
    hues.push("hsla("+bh+","+sat+"%,"+lum+"%,0.7)");
  } else {
    hues.push("hsla("+bh+","+sat+"%,"+lum+"%,0.9)");
  }
}

var Curve=function() {
  this.type=0;
  this.mx=[];
  this.my=[];
  this.px=0;
  this.py=0;
  this.fx=[];
  this.fy=[];
  this.cx=1;
  this.cy=1;
  this.sf=1;
  this.setSizeFactor=()=>{
    this.sf=1;
    let maxp=0;
    for (let i=0; i<C*W; i++) {
      let z=TP/C*i;
      maxp=Math.max(maxp,Math.abs(this.getX(z)));
      maxp=Math.max(maxp,Math.abs(this.getY(z)));
    }
    this.sf=1/(maxp<0.01?1:maxp);
  }
  this.randomizePoints=()=>{
    let rx=-1+2*Math.random();
    this.px=[()=>{ return rx; },Math.sin][getRandomInt(0,2)];
    let ry=-1+2*Math.random();
    this.py=[()=>{ return ry; },Math.cos][getRandomInt(0,2)];
  }
  this.randomizeFactors=()=>{
    this.mx=[];
    this.my=[];
    this.cx=getRandomInt(1,8);
    this.cy=getRandomInt(1,8);
    let multipliers=[-1,1,-2,2,-3,3,-4,4,-5,5];
    for (let i=0; i<this.cx; i++) {
      this.fx[i]=[-1,1][getRandomInt(0,2)];
      this.mx[i]=multipliers[getRandomInt(0,8,true)];
    }
    for (let i=0; i<this.cy; i++) {
      this.fy[i]=[-1,1][getRandomInt(0,2)];
      this.my[i]=multipliers[getRandomInt(0,8,true)];
    }
    this.setSizeFactor();
  }
  this.randomize=()=>{
    this.type=[0,0,0,0,1,2,3,4,5,6][getRandomInt(0,10)];
    //this.type=[0,6][getRandomInt(0,2)];
//console.log(this.type);
    //this.type=6;
    if (this.type<2) this.randomizeFactors();
    else if (this.type==6) this.randomizePoints();
  }
  this.getX=(t)=>{ 
    if (this.type==6) return this.px.call(null,t);
    if (this.type==5) return getStarX(t);
    if (this.type==4) return getSquareX(t);
    if (this.type==3) return Math.sin(t);
    if (this.type==2) return getHeartX(t)*0.95;
    let v=0;
    if (this.type==1) for (let i=0; i<this.cx; i++) v+=this.fx[i]*Math.cos(this.mx[i]*t);
    else for (let i=0; i<this.cx; i++) v+=this.fx[i]*Math.sin(this.mx[i]*t);
    return v*this.sf;
  }
  this.getY=(t)=>{ 
    if (this.type==6) return this.py.call(null,t);
    if (this.type==5) return getStarY(t);
    if (this.type==4) return getSquareY(t);
    if (this.type==3) return Math.cos(t);
    if (this.type==2) return getHeartY(t)*0.9;
    let v=0;
    if (this.type==1) for (let i=0; i<this.cy; i++) v+=this.fy[i]*Math.sin(this.my[i]*t);
    else for (let i=0; i<this.cy; i++) v+=this.fy[i]*Math.cos(this.my[i]*t);
    return v*this.sf;
  }
  this.randomizeFactors();
  this.randomizePoints();
}
var curveSet1=0;
var curveSet1b=1;
var curveSet2=0;
var curveSet2b=1;
var curve1=[new Curve(), new Curve()];
var curve2=[new Curve(), new Curve()];

const getStarX=(t)=>{ 
  return Math.pow(Math.sin(t),5); 
}
const getStarY=(t)=>{ 
  return Math.pow(Math.cos(t),5); 
}

const getSquareX=(t)=>{ 
  return (11*Math.sin(t)+1.3*Math.sin(3*t))/10; 
}
const getSquareY=(t)=>{ 
  return (11*Math.cos(t)-1.3*Math.cos(3*t))/10; 
}

const getHeartX=(t)=>{ return Math.pow(Math.sin(t),3); }
const getHeartY=(t)=>{ 
  return -0.8125*Math.cos(t)+0.3125*Math.cos(2*t)+0.125*Math.cos(3*t)+0.0625*Math.cos(4*t);
}

var getCurve1X=(t)=>{ 
  if (cFrac1==0) return curve1[curveSet1b].getX(t);
  else return (1-cFrac1)*curve1[curveSet1b].getX(t)+cFrac1*curve1[curveSet1].getX(t); 
}
var getCurve1Y=(t)=>{ 
  if (cFrac1==0) return curve1[curveSet1b].getY(t);
  return (1-cFrac1)*curve1[curveSet1b].getY(t)+cFrac1*curve1[curveSet1].getY(t); 
}
var getCurve2X=(t)=>{ 
  if (cFrac2==0) return curve2[curveSet2b].getX(t);
  return (1-cFrac2)*curve2[curveSet2b].getX(t)+cFrac2*curve2[curveSet2].getX(t); 
}
var getCurve2Y=(t)=>{ 
  if (cFrac2==0) return curve2[curveSet2b].getY(t);
  return (1-cFrac2)*curve2[curveSet2b].getY(t)+cFrac2*curve2[curveSet2].getY(t); 
}

var getPointX=(t,u)=>{ return (1-u)*getCurve1X(t)+u*getCurve2X(t); }
var getPointY=(t,u)=>{ return (1-u)*getCurve1Y(t)+u*getCurve2Y(t); }

var ZP=70;	// randomize?
var perimeter=[ZP,CSIZE];

var setPoints=()=>{
  let zp=(1-pFrac)*perimeter[perimSet]+pFrac*perimeter[(perimSet+1)%2];
  let rp=(1-pFrac)*perimeter[(perimSet+1)%2]+pFrac*perimeter[perimSet];
//let zp=0;
//let rp=CSIZE;
  q=[];
  for (let w=0; w<=W; w++) {
    q[w]=[];
    let M=zp;
    let b=false;
    let r=w*TP/W+t;
    if (Math.cos(r)<0) {
      M=(rp-zp+(rp-zp)*Math.sin(r))/2+zp;
    } else {
      b=true;
      if (Math.sin(r)<0) M=zp;
      else M=rp;
    }
    let qw=(Math.sin(r)+1)/2;
    for (let c=0; c<C+2; c++) {
      let t=TP/C*c+((w%2==0)?0:-TP/C/2);
      q[w].push({"x":M*getPointX(t,qw),"y":M*getPointY(t,qw),"b":b});
    }
  }
}

var frame=false;
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let w=0; w<W; w++) {
    //if (q[w][0].b && q[w+1][0].b && q[w2][0].b) continue;
    if (q[w][0].b && q[w+1][0].b) continue;
    //if (q[w][0].b || q[w+1][0].b) continue;
    let b=(w%2==0)?1:-1;
    let w2=(w+2)%W;
    for (let c=0; c<C; c++) {
      let a=c+((w%2==0)?0:1);
      ctx.beginPath();
      ctx.moveTo(q[w][a].x,q[w][a].y);
      ctx.lineTo(q[w+1][a].x,q[w+1][a].y);
      ctx.lineTo(q[w2][a].x,q[w2][a].y);
      ctx.lineTo(q[w+1][a+b].x,q[w+1][a+b].y);
      ctx.closePath();
//if (q[w][a].b || q[w2][a].b) ctx.stroke();
      if (frame) {
	ctx.stroke();
      } else {
	//ctx.fillStyle=hues[(w)%COLCOUNT];
	ctx.fillStyle=hues[w];
	ctx.fill();
      }
    }
  }
}

var SH=0;
var t=0;
var perimSet=0;
var pTime=0;
var pFrac=0;
var cTime=0;
var cFrac1=0;
var cFrac2=0;
var stopped=true;
var duration=8000;  // fit in time window, slower than t unit, faster than modulus
var animate=(ts)=>{
  if (stopped) return;
//  t=0.0003*ts;
  t+=0.005;
  if (SH==0) if (Math.floor(t)%3==0) { SH=getRandomInt(1,4); }
  if (SH==1) {
    if (!pTime) { pTime=ts; }
    let progress=ts-pTime;
    if (progress<duration) {
      pFrac=progress/duration;
    } else {
      perimSet=++perimSet%2;
      pFrac=0;
      pTime=0;
      SH=0;
    }
  }
  if (SH>1) {
    if (!cTime) { cTime=ts; }
    let progress=ts-cTime;
    if (progress<duration) {
      if (SH==2) cFrac1=progress/duration;
      else cFrac2=progress/duration;
    } else {
      if (SH==3) {
        curveSet2b=curveSet2;
	curveSet2=++curveSet2%2;
	curve2[curveSet2].randomize();
	cFrac2=0;
      } else {
        curveSet1b=curveSet1;
	curveSet1=++curveSet1%2;
	curve1[curveSet1].randomize();
	cFrac1=0;
      }
      cTime=0;
      SH=0;
    }
  }
  setPoints();
  draw();
  requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    stopped=false;
    if (pFrac>0) pTime=performance.now()-pFrac*duration;
    else if (cFrac1>0) cTime=performance.now()-cFrac1*duration;
    else if (cFrac2>0) cTime=performance.now()-cFrac2*duration;
    requestAnimationFrame(animate);
  } else {
    frame=!frame;
    ctx.strokeStyle="hsl("+getRandomInt(0,360)+",70%,60%)";
    stopped=true;
  }
}
body.addEventListener("click", start, false);

onresize();
setPoints();
start();
