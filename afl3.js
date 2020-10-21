"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;
const HR2=Math.pow(2,0.5)/2;
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

var C=70;
var W=70;   // even

var q=[];
for (let w=0; w<=W; w++) q[w]=new Array(C+1);

ctx.strokeStyle="hsl("+getRandomInt(0,360)+",70%,60%)";
//ctx.strokeStyle="silver";
var hues=[];
const COLCOUNT=50;
for (let i=0; i<COLCOUNT; i++) {
  let bh=getRandomInt(0,360);
  //bh=(bh+getRandomInt(60,120))%360;
  //bh=(bh++)%360;
  //bh=getRandomInt(-50,50);
  let sat=50+20*Math.random();
  let lum=50+20*Math.random();
  //hues.push("hsl("+bh+",70%,60%)");  // fill
  //hues.push("hsl("+bh+","+sat+"%,"+lum+"%)");  // fill
  hues.push("hsla("+bh+","+sat+"%,"+lum+"%,0.9)");  // fill
  //hues.push(bh);  // fill
}

var Curve=function() {
  this.type=0;
  this.mx=[];
  this.my=[];
  this.p=[];
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
  this.randomizeFactors=()=>{
    this.mx=[];
    this.my=[];
    this.cx=getRandomInt(1,8);
    this.cy=getRandomInt(1,8);
    let multipliers=[-1,1,-2,2,-3,3,-4,4,-5,5];
    let sc={};
    multipliers.forEach((mu)=>{ sc[mu]=0; });
    for (let i=0; i<this.cx; i++) {
      this.fx[i]=[-1,1][getRandomInt(0,2)];
      this.mx[i]=multipliers[getRandomInt(0,8,true)];
 //     sc[this.mx[i]]+=this.fx[i];
//if (Math.random()<0.1) this.p[i]=true;
//else this.p[i]=false;
    }
    for (let i=0; i<this.cy; i++) {
      this.fy[i]=[-1,1][getRandomInt(0,2)];
      this.my[i]=multipliers[getRandomInt(0,8,true)];
      sc[this.my[i]]+=this.fy[i];
    }
    this.setSizeFactor();
  }
  this.randomize=()=>{
    this.type=[0,0,0,2,2,1,3,4,5][getRandomInt(0,9)];
    //this.type=[0,5][getRandomInt(0,2)];
    //this.type=4;
    if (this.type<2) this.randomizeFactors();;
  }
  this.getX=(t)=>{ 
    let v=0;
    for (let i=0; i<this.cx; i++) {
      //if (this.p[i]) v+=this.fx[i]*Math.cos(this.mx[i]*t);
      if (this.type==5) return getStarX(t);
      if (this.type==4) return getSquareX(t);
      if (this.type==3) return Math.sin(t);
      if (this.type==2) return getHeartX(t)*0.95;
      if (this.type==1) v+=this.fx[i]*Math.cos(this.mx[i]*t);
      else v+=this.fx[i]*Math.sin(this.mx[i]*t);
    }
    //return v/this.cx;
    return v*this.sf;
  }
  this.getY=(t)=>{ 
    let v=0;
    for (let i=0; i<this.cy; i++) {
      if (this.type==5) return getStarY(t);
      if (this.type==4) return getSquareY(t);
      if (this.type==3) return Math.cos(t);
      if (this.type==2) return getHeartY(t)*0.9;
      if (this.type==1) v+=this.fy[i]*Math.sin(this.my[i]*t);
      else v+=this.fy[i]*Math.cos(this.my[i]*t);
    }
    return v*this.sf;
  }
  this.randomize();
}
var curveSet1=0;
var curveSet1b=1;
var curveSet2=0;
var curveSet2b=1;
var curve1=[new Curve(), new Curve()];
var curve2=[new Curve(), new Curve()];

/*
const getSquareX2=(tparm)=>{ 
  let t=tparm;
  if (t%TP<TP/8) {
    return 1;
  } else if (t%TP<TP/4) {
    return -Math.cos(2*t);
  } else if (t%TP<3*TP/4) {
    return -1;
  } else {
    return Math.cos(2*t);
  }
}
const getSquareY2=(tparm)=>{ 
  let t=tparm;
  if (t%TP<TP/4) {
    return Math.cos(2*t);
  } else if (t%TP<TP/2) {
    return -1;
  } else if (t%TP<3*TP/4) {
    return -Math.cos(2*t);
  } else {
    return 1;
  }
}
const getSquareXX=(tparm)=>{ 
  let t=tparm;
  if (t%TP<TP/4) {
    return 1;
  } else if (t%TP<TP/2) {
    return -Math.cos(2*t);
  } else if (t%TP<3*TP/4) {
    return -1;
  } else {
    return Math.cos(2*t);
  }
}
const getSquareYY=(tparm)=>{ 
  let t=tparm;
  if (t%TP<TP/4) {
    return Math.cos(2*t);
  } else if (t%TP<TP/2) {
    return -1;
  } else if (t%TP<3*TP/4) {
    return -Math.cos(2*t);
  } else {
    return 1;
  }
}
*/

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

var ZP=80;	// randomize?
//var perimeter=[ZP,CSIZE-ZP];
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
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
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
	ctx.fillStyle=hues[(w)%COLCOUNT];
	ctx.fill();
      }
    }
  }
  for (let c=0; c<C; c++) {
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
