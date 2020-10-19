"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;
const CSIZE=400;

const ctx=document.querySelector("#cta").getContext("2d");
//ctx.translate(CSIZE,CSIZE-40);
ctx.translate(CSIZE,CSIZE);
//ctx.lineJoin="round";
onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
  //ctx.canvas.style.border="1px solid #444";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}
//ctx.lineJoin="round";
//ctx.lineWidth=0.7;
ctx.lineWidth=3;
ctx.strokeStyle="black";
//ctx.strokeStyle="transparent";

var C=70;
//var C=18;
//var W=24;   // even
var W=70;   // even

var q=[];
//var q=[new Array(W),new Array(W)];
for (let w=0; w<=W; w++) {
  q[w]=new Array(C+1);
  q[w]=new Array(C+1);
}

var hues=[];
const COLCOUNT=50;
for (let i=0, bh=0; i<COLCOUNT; i++) {
  bh=getRandomInt(0,360);
  bh=(bh+getRandomInt(40,80))%360;
  //bh=getRandomInt(-50,50);
let sat=40+20*Math.random();
let lum=40+20*Math.random();
  //hues.push("hsl("+bh+",70%,60%)");  // fill
  hues.push("hsl("+bh+","+sat+"%,"+lum+"%)");  // fill
  //hues.push(bh);  // fill
}

/*
var Tile=function(w,c) {
  this.color=hues[(c+w)%COLCOUNT];
  let a=c+((w%2==0)?0:1);
  let b=(w%2==0)?1:-1;
  this.draw=(v,v2)=>{
    //let f=cFrac();
    let f=1;
    ctx.beginPath();
    ctx.moveTo((1-f)*v[0].x+f*v2[0].x,(1-f)*v[0].y+f*v2[0].y);
    ctx.lineTo((1-f)*v[1].x+f*v2[1].x,(1-f)*v[1].y+f*v2[1].y);
    ctx.lineTo((1-f)*v[2].x+f*v2[2].x,(1-f)*v[2].y+f*v2[2].y);
    ctx.lineTo((1-f)*v[3].x+f*v2[3].x,(1-f)*v[3].y+f*v2[3].y);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle=this.color;
    ctx.fill();
  }
}
var tiles=[[]];
for (let w=0; w<W; w++) {
  tiles[w]=[];
  for (let c=0; c<C; c++) {
    //tiles[w].push(new Tile(hues[(c+w)%COLCOUNT]));
    tiles[w].push(new Tile(w,c));
  }
}
*/

var Curve=function() {
  this.m=[];
  this.f=[];
  this.c=1;
  this.randomize=()=>{
    this.m=[];
    this.c=getRandomInt(1,8);
    //let multipliers=[-5,-4,-3,-2,-1,1,2,3,4,5];
    let multipliers=[-1,1,-2,2,-3,3,-4,4,-5,5];
    let sc={};
    multipliers.forEach((mu)=>{ sc[mu]=0; });
    for (let i=0; i<this.c; i++) {
      this.f[i]=[-1,1][getRandomInt(0,2)];
      this.m[i]=multipliers[getRandomInt(0,8,true)];
      sc[this.m[i]]+=this.f[i];
    }
    this.c=0;
    Object.values(sc).forEach((en)=>{ if (en!=0) this.c++; });
    if (this.c==0) { this.m[0]=1; this.c=1; }
  }
  this.getX=(t)=>{ 
    let v=0;
    for (let i=0; i<this.c; i++) v+=this.f[i]*Math.sin(this.m[i]*t);
    return v/this.c;
  }
  this.getY=(t)=>{ 
    let v=0;
    for (let i=0; i<this.c; i++) v+=this.f[i]*Math.cos(this.m[i]*t);
    return v/this.c;
  }
  this.randomize();
}
var curveSet=0;
var curve1=[new Curve(), new Curve()];
var curveA=new Curve();


const getCircleX=(t)=>{ return Math.sin(t); }
const getCircleY=(t)=>{ return -Math.cos(t); }

const getHeartX=(t)=>{ return Math.pow(Math.sin(t),3); }
const getHeartY=(t)=>{ 
  return -0.8125*Math.cos(t)+0.3125*Math.cos(2*t)+0.125*Math.cos(3*t)+0.0625*Math.cos(4*t);
}

//var getCurveX=(t)=>{ return (1-pFrac)*curve1[(curveSet+1)%2].getX(t)+pFrac*curve1[curveSet].getX(t); }
//var getCurveY=(t)=>{ return (1-pFrac)*curve1[(curveSet+1)%2].getX(t)+pFrac*curve1[curveSet].getY(t); }
var getCurveX=(t)=>{ return (1-cFrac1)*curve1[(curveSet+1)%2].getX(t)+cFrac1*curve1[curveSet].getX(t); }
var getCurveY=(t)=>{ return (1-cFrac1)*curve1[(curveSet+1)%2].getY(t)+cFrac1*curve1[curveSet].getY(t); }

//var getPointX=(t,u)=>{ return (1-u)*getCircleX(t)+u*curve.getX(t); }
//var getPointY=(t,u)=>{ return (1-u)*getCircleY(t)+u*curve.getY(t); }
//var getPointX=(t,u)=>{ return (1-u)*curve1[0].getX(t)+u*getCircleX(t); }
//var getPointY=(t,u)=>{ return (1-u)*curve1[0].getY(t)+u*getCircleY(t); }

//var getPointX=(t,u)=>{ return (1-u)*getCurveX(t)+u*getCircleX(t); }
//var getPointY=(t,u)=>{ return (1-u)*getCurveY(t)+u*getCircleY(t); }
var getPointX=(t,u)=>{ return (1-u)*getCurveX(t)+u*curveA.getX(t); }
var getPointY=(t,u)=>{ return (1-u)*getCurveY(t)+u*curveA.getY(t); }

var ZP=0;	// randomize?
//var R=CSIZE-ZP;
//var ZP=CSIZE-40;
//var R=40;
var perimeter=[ZP,CSIZE-ZP];

var transit=0;
var setPoints=()=>{
  //let zp=(1-pFrac)*ZP+pFrac*(CSIZE-ZP);
  //let rp=(1-pFrac)*(CSIZE-ZP)+pFrac*(ZP);
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
    if (Math.cos(r)>0) {
      M=(rp-zp+(rp-zp)*Math.sin(r))/2+zp;
    } else {
      b=true;
      if (Math.sin(r)<0) M=zp;
      else M=rp;
    }
    let qw=(Math.sin(r)+1)/2;
    let maxp=0;
    for (let c=0; c<C+2; c++) {
      let t=TP/C*c+((w%2==0)?0:-TP/C/2);
      //q[w].push({"x":(M)*Math.cos(t),"y":(M)*Math.sin(t),"b":b});
      //q[w].push({"x":M*getHeartX(t),"y":M*getHeartY(t),"b":b});
      let x=getPointX(t,qw);
      q[w].push({"x":M*x,"y":M*getPointY(t,qw),"b":b});
    }
  }
}

/*
var drawT=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let f=1;
  let j=(pointSet+1)%2;
  let k=pointSet;
  for (let w=0; w<W; w++) {
if (q[0].b && q[w+1][0].b) continue;
    for (let c=0; c<C; c++) {
      let a=c+((w%2==0)?0:1);
      let b=(w%2==0)?1:-1;
let wz=(w+2)%W;
      tiles[w][c].draw(
        [q[j][w][a],q[j][w+1][a],q[j][wz][a],q[j][w+1][a+b]],
        [q[k][w][a],q[k][w+1][a],q[k][wz][a],q[k][w+1][a+b]]
      );
    }
  }
}
*/

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  //let j=(pointSet+1)%2;
  //let k=pointSet;
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
//      ctx.strokeStyle=hues[(w)%COLCOUNT];
//if (w==W-1) ctx.stroke();
      ctx.fillStyle=hues[(w)%COLCOUNT];
      ctx.fill();
    }
  }
}

/*
var fade={
  start:0,
  animate:function(ts) {
    if (stopped) {
      return;
    }
    if (!fade.start) {
      fade.start=ts;
    }
    if (ts-fade.start>60) {
      let z=
      ctx.fillStyle='hsla(0,0%,0%,.5)';
      ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
      fade.start=0;
    }
    requestAnimationFrame(fade.animate);
  }
}
*/

var SH=0;
var t=0;
var perimSet=0;
var pTime=0;
var pFrac=0;
var cTime=0;
var cFrac1=0;
var stopped=true;
//var duration=14000;
var duration=10000;  // fit in time window
var animate=(ts)=>{
  if (stopped) return;
//  t=0.0003*ts;
  t+=0.006;
  if (SH==0) if (Math.floor(t)%5==0) { SH=getRandomInt(1,3); }
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
      cFrac1=progress/duration;
    } else {
      curveSet=++curveSet%2;
      curve1[curveSet].randomize();
      cFrac1=0;
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
    requestAnimationFrame(animate);
    //requestAnimationFrame(fade.animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

onresize();

setPoints();

//draw();
start();
