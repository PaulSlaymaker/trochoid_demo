"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/bGWaErg
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
body.style.display="grid";
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

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

onresize=function() { 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

var colors=[];
var setColors=()=>{
  colors=[];
  let hue=getRandomInt(0,360);
  let hd=getRandomInt(90,270);
  for (let i=0; i<W; i++) {
    let sat=80+getRandomInt(0,21);
    let lum=50+getRandomInt(0,31);
    colors.push("hsla("+((hue+i*hd)%360)+","+sat+"%,"+lum+"%,0.6)");
  }
  (()=>{
    let no=[];
    do no.push(colors.splice(getRandomInt(0,colors.length),1)[0]);
    while (colors.length>0);
    colors=no;
  })();
}

function Point(r) {
  this.r=r;
  this.r2=r;
  this.getR=()=>{
    return frac*this.r+(1-frac)*this.r2;
  }
}

var RSEG=40;
var RMIN=200;
var getW=()=>{ return [6,8,10][getRandomInt(0,3)]; }
var W=6;
var getC=()=>{ return [48,40,24,30,20,32,16,36,12,42,18,44,28][getRandomInt(0,13,true)]; }
var C=0;

var getRadii=()=>{ 
  let w=[];
  for (let j=0; j<W; j++) {
    if (j && Math.random()<0.5) w[j]=w[j-1]; 
    else w[j]=RMIN+RSEG*getRandomInt(0,(CSIZE-RMIN)/RSEG);
  }
  w.sort((a,b)=>{ return b-a; });
  return w;
}

/*
const sym={
5  12:[3,2],
6  16:[4,2],
3  18:[3],
7  20:[5,2],
9  24:[4,3,2],
2  28:[2],
8  30:[5,3],
6  32:[4,2],
5  36:[3,2],
11  40:[5,4,2],
3 42:[3],
2  44:[2],
15  48:[6,4,3,2],
3  54:[3],
}
*/

const sym={
  12:[3,2],
  16:[4,2],
  18:[3],
  20:[5,2],
  24:[4,3,2],
  28:[2],
  30:[5,3],
  32:[4,2],
  36:[3,2],
  40:[5,4,2],
  42:[3],
  44:[2],
  48:[6,4,3,2],
}

var rot={
 "12-2":3,
 "12-3":1,
 "16-2":1,
 "16-4":1,
 "18-3":4,
 "20-2":3,
 "20-5":1,
 "24-2":3,
 "24-3":1,
 "24-4":5,
 "24-6":1,
 "28-2":3,
 "30-3":4,
 "30-5":6,
 "32-2":1,
 "32-4":1,
 "36-2":3,
 "36-3":1,
 "40-2":5,
 "40-4":5,
 "40-5":1,
 "42-3":4,
 "44-2":3,
 "48-2":1,
 "48-3":1,
 "48-4":1,
 "48-6":1,
}

var ROT=0;
var S=2;
var setSymmetry=()=>{
if (sym[C]==undefined) debugger;
  S=sym[C][getRandomInt(0,sym[C].length,true)];
  ctx.rotate(-ROT);
  ROT=0;
if (rot[C+"-"+S]==undefined) debugger;
  ROT=rot[C+"-"+S]*TP/C/2;
  ctx.rotate(ROT);
//console.log(C+" "+S);
}

var pts2=[];
var setPoints=()=>{
  pts2=[];
  let pa=[];
  let z=(()=>{
    let z1=[];
    for (let i=0; i<S; i++) z1.push(getRadii());
    return z1;
  })();
  z=z.concat([...z].reverse());
  for (let i=0; i<C; i++) {
//    pa[i]=getRadii(i);
    pa[i]=z[i%z.length];
  }
  for (let j=0; j<W; j++) { 
    pts2[j]=[];
    for (let i=0; i<C; i++) {
      pts2[j][i]=new Point(pa[i][j]); 
    }
  }
}

var setPointsRing=()=>{
  pts2=[];
  for (let j=0; j<W; j++) { 
    pts2[j]=[];
    for (let i=0; i<C; i++) {
      pts2[j][i]=new Point(300); 
    }
  }
}

var transitPoints=()=>{
  let pa=[];
  let z=(()=>{
    let z1=[];
    for (let i=0; i<S; i++) z1.push(getRadii());
    return z1;
  })();
  z=z.concat([...z].reverse());
  for (let i=0; i<C; i++) pa[i]=z[i%z.length];
  //for (let i=0; i<C; i++) pa[i]=getRadii(i);
  for (let j=0; j<W; j++) { 
    for (let i=0; i<C; i++) {
      pts2[j][i].r=pa[i][j]; 
    }
  }
}

var transitRing=()=>{
  pts2.forEach((p1)=>{ p1.forEach((p2)=>{ p2.r2=p2.r; }); });
  pts2.forEach((p1)=>{ p1.forEach((p2)=>{ p2.r=300; }); });
}

var sine2=(idx,idr)=>{
  let idx1=(idx+1==C)?0:idx+1;
  let D=12;
  let DT=TP/D/4;
  let p=new Path2D();
  let radius=pts2[idr][idx].getR();
  let x=radius*Math.cos(idx*TP/C);
  let y=radius*Math.sin(idx*TP/C);
  p.moveTo(x,y);
  for (let i=0; i<D+1; i++) {
    let r=radius*Math.pow(Math.cos(i*DT),2)+pts2[idr][idx1].getR()*Math.pow(Math.sin(i/D*TP/4),2);
    x=r*Math.cos((i/D+idx)*TP/C);
    y=r*Math.sin((i/D+idx)*TP/C);
    p.lineTo(x,y);
  }
  return p;
}

/*
var sine3=(idr)=>{
if (idr==W-1) debugger;
  let D=20;
  let DT=TP/D/4;
  let p=new Path2D();
  for (let j=idr; j<idr+2; j++) {
    let x=pts2[j][0].getR()*Math.cos(0);
    let y=0; //pts2[idr][0].getR()*Math.sin(0);
    p.moveTo(x,y);
    for (let i=0; i<C; i++) {
      let idx1=(i+1==C)?0:i+1;
      let radius=pts2[j][i].getR();
      for (let q=0; q<D+1; q++) {
	let r=radius*Math.pow(Math.cos(q*DT),2)+pts2[j][idx1].getR()*Math.pow(Math.sin(q*DT),2);
	x=r*Math.cos((q/D+i)*TP/C);
	y=r*Math.sin((q/D+i)*TP/C);
	p.lineTo(x,y);
      }
    }
  }
  return p;
}
*/

var paths=[];
var setPaths=()=>{
  let pa=[];
  for (let j=0; j<W; j++) {
    let ring=[]
    for (let i=0; i<C; i++) ring[i]=sine2(i,j);
    pa[j]=ring;
  }
  return pa;
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.lineWidth=18;
  ctx.strokeStyle="gray";
  for (let j=0; j<W; j++) {
    let p=new Path2D();
    for (let i=0; i<C; i++) p.addPath(paths[j][i]);
    ctx.stroke(p);
  }
  ctx.lineWidth=13;
  ctx.strokeStyle="black";
  for (let j=0; j<W; j++) {
    let p=new Path2D();
    for (let i=0; i<C; i++) p.addPath(paths[j][i]);
    ctx.stroke(p);
  }
  ctx.lineWidth=7;
  for (let j=0; j<W; j++) {
    let p=new Path2D();
    for (let i=0; i<C; i++) p.addPath(paths[j][i]);
    ctx.strokeStyle=colors[j%colors.length];
    ctx.stroke(p);
  }
}

var transit=()=>{
  pts2.forEach((p1)=>{ p1.forEach((p2)=>{ p2.r2=p2.r; }); });
  transitPoints(); 
}

var pauseTS=0;
var pause=(ts)=>{
  if (stopped) return;
  if (pauseTS==0) pauseTS=performance.now()+2000
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    pauseTS=0;
    if (EM) stopped=true;
    requestAnimationFrame(animate);
  }
}

var mode=0;
var time=0;
var frac=0;
var stopped=true;
var duration=2000;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  frac=(ts-time)/duration;
  let af=animate;
  if (frac>1) {
    if (!mode && Math.random()<0.3) mode=1;
    if (mode==1) {
      transitRing();
      mode=2;
      af=pause;
    } else if (mode==2) {
      setColors();
      C=getC();
W=getW();
      setSymmetry();
      setPointsRing(); 
      transit();
      mode=0;
      af=animate;
    } else {
      transit();
      af=pause;
    }
    time=0;
    frac=0;
  }
  paths=setPaths(); 
  draw();
  requestAnimationFrame(af);
}

var start=()=>{
  if (stopped) {
    stopped=false;
    if (frac) time=performance.now()-frac*duration;
    pauseTS=0;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

onresize();
C=getC();
setColors();
setSymmetry();
setPoints();
paths=setPaths();
transit();

draw();
stopped=false;
if (!EM) requestAnimationFrame(pause);
//start();
