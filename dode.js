"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
body.style.display="grid";
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
  ctx.strokeStyle="black";
}
ctx.translate(CSIZE,CSIZE);
ctx.lineJoin="round";

var colors=[];
var setColors=()=>{
  colors=[];
  let hue=getRandomInt(0,360);
  let hd=getRandomInt(90,270);
  for (let i=0; i<W; i++) {
    let sat=80+getRandomInt(0,21);
    let lum=50+getRandomInt(0,31);
    colors.push("hsl("+((hue+i*hd)%360)+","+sat+"%,"+lum+"%)");
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
  this.getR=()=>{ return frac*this.r+(1-frac)*this.r2; }
}

const W=30;
const RSEG=130;
const C=12;

var getRadii=()=>{ 
  let w=[];
  for (let j=0; j<W; j++) {
    w[j]=RSEG*getRandomInt(0,Math.round(CSIZE/RSEG)+1);
    if (j && Math.random()<0.4) w[j]=w[j-1]; 
  }
  w.sort((a,b)=>{ return b-a; });
/*
  w.push(0);
  w.push(0);
  w.unshift(RSEG*Math.round(CSIZE/RSEG));
  w.unshift(RSEG*Math.round(CSIZE/RSEG));
  w.unshift(RSEG*Math.round(CSIZE/RSEG));
*/
  return w;
}

var S=2;
var setSymmetry=()=>{ S=[3,2][Math.round(Math.random()*Math.random())]; }

var pts2=[];
var setPoints=()=>{
  pts2=[];
  let pa=[];
  let z=(()=>{
    let z1=[];
    for (let i=0; i<S; i++) z1.push(getRadii());
    return z1;
  })();
  for (let i=0; i<C; i++) pa[i]=z[i%z.length];
  for (let j=0; j<W; j++) { 
    pts2[j]=[];
    for (let i=0; i<C; i++) {
      pts2[j][i]=new Point(pa[i][j]); 
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
  for (let i=0; i<C; i++) pa[i]=z[i%z.length];
  for (let j=0; j<W; j++) { 
    for (let i=0; i<C; i++) {
      pts2[j][i].r=pa[i][j]; 
    }
  }
}

var getPath=(idr)=>{
  let D=1;
  let DT=TP/D/4;
  let p=new Path2D();
  for (let j=idr; j<idr+2; j++) {
    if (j==W-1) {
      return p;
    }
    let x=pts2[j][0].getR();
    let y=0;
    p.moveTo(x,y);
    for (let i=0; i<C; i++) {
      let r=pts2[j][i].getR();
      x=r*Math.cos(i*TP/C);
      y=r*Math.sin(i*TP/C);
      p.lineTo(x,y);
    }
    p.closePath();
  }
  return p;
}

var paths2=[];
var setPaths2=()=>{
  let pa=[];
  for (let j=0; j<W; j++) {
    pa[j]=getPath(j);
  }
  return pa;
}

ctx.lineWidth=3;
var draw2=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let j=0; j<W-1; j++) {
    ctx.fillStyle=colors[j%colors.length];
    ctx.fill(paths2[j],"evenodd");
    ctx.stroke(paths2[j]);
  }
}

var transitLevels=()=>{
  pts2[0].forEach((p)=>{ p.r2=0; p.r=0; });
  pts2.push(pts2.shift());
  colors.push(colors.shift());
  paths2.push(paths2.shift());
}

var transit=()=>{

if (mode==1) debugger;

if (!mode) {
let Rmax=RSEG*Math.round(CSIZE/RSEG);
  let coll=true;
  for (let i=0; i<C; i++) {
    if (pts2[1][i].r!=Rmax) {
      coll=false;
      break;
    }
  } 
if (coll) transitLevels();	// not needed for mode==2?
console.log(coll);
  coll=true;
  for (let i=0; i<C; i++) {
    //if (pts2[1][i].r!=CSIZE-RSEG) {
    if (pts2[1][i].r!=Rmax) {
      coll=false;
      break;
    }
  } 
if (coll) transitLevels();	// not needed for mode==2?
console.log("2- "+coll+" "+mode);
}


  pts2.forEach((p1)=>{ p1.forEach((p2)=>{ p2.r2=p2.r; }); });
setSymmetry();
  transitPoints(); 
}

var pauseTS=0;
//var pauseDuration=[30,120][getRandomInt(0,2)];
var pauseDuration=3000;
var pause=(ts)=>{
  if (stopped) return;
  if (pauseTS==0) pauseTS=performance.now()+pauseDuration;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    pauseTS=0;
    requestAnimationFrame(animate);
  }
}

var mode=0;
var time=0;
var frac=0;
var stopped=true;
var duration=3000;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  frac=(ts-time)/duration;
  let af=animate;
  if (frac>1) {
    transit();
    af=pause;
    time=0;
    frac=0;
  }
  paths2=setPaths2(); 
  draw2();
  requestAnimationFrame(af);
}

var start=()=>{
  if (stopped) {
    stopped=false;
    if (frac) time=performance.now()-frac*duration;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

onresize();
setColors();
setSymmetry();
setPoints();
paths2=setPaths2();
transit();

start();
