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
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=7;
ctx.strokeStyle="black";

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

var getRadii=()=>{
//  if (Math.random()<0.3) return getBlockedRadii();
  let s=[];
  //let d=EDGE/W;
  for (let i=0; i<W; i++) {
    //s.push(Math.round(i*d+d*Math.random()));
    s.push(Math.round(EDGE*Math.random()));
  }
  s.sort((a,b)=>{ return a-b; });
  s.unshift(0);
  s.push(EDGE);
  return s;
}

var getBlockedRadii=()=>{
  let s=[];
  let block=EDGE/getRandomInt(2,W);
  let d=EDGE/W; 	// could be random array
  for (let i=0; i<W; i++) {
    let v=block*Math.round((i*d+d*Math.random())/block);
    s.push(Math.round(v));
  }
  s.unshift(0);
  s.push(EDGE);
  return s;
}

var getAngles=()=>{
if (Math.random()<0.1) {
return getAngles2();
}
  let s=[];
  let d=TP/C;
  let inactive=Math.random()<0.7;
  for (let i=0; i<W; i++) {
//if (Math.random()<0.9) s.push(0);
if (inactive) s.push(0);
else
    s.push((3-6*Math.random())/C);  // ca. +/-TP/C/2
  }
  s.unshift(0);
  s.push(0);
  return s;
}

var getAngles2=()=>{
  let s=[];
  let p=W/C*[-1,1][getRandomInt(0,1)]*Math.random();
  for (let i=0; i<W+1; i++) {
    let az=i*TP/(W+1);
    s.push(p*Math.sin(az));
  }
  s.push(0);
  return s;
}

var colors=[];
var colors2=[];
var getColors=()=>{
  let c=[];
  let cset={
     "2":[2,4],"4":[2,4,8],"6":[2,3,6],"8":[2,4,8],
     "10":[2,5],
     "12":[2,3,4,6],
     "14":[2,7]
  };
  let colorCount=cset[C][getRandomInt(0,cset[C].length)];
  let hue=getRandomInt(0,90,true)+30;
  let colorSeg=Math.round(360/colorCount);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-40,40);
    let sat=70+getRandomInt(0,31);
    let lum=48+getRandomInt(0,31);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}

var Point=function() {
  this.x=0;
  this.y=0;
}

var Quad=function() {
  this.pts=[new Point(),new Point(),new Point(),new Point()];
  this.pts2=[new Point(),new Point(),new Point(),new Point()];
}

var drawQuad=(q)=>{
  ctx.beginPath();
  ctx.moveTo(
    ( 
      frac*q.pts[0].x+(1-frac)*q.pts2[0].x+   
      frac*q.pts[1].x+(1-frac)*q.pts2[1].x   
    )/2,
    (
      frac*q.pts[0].y+(1-frac)*q.pts2[0].y+   
      frac*q.pts[1].y+(1-frac)*q.pts2[1].y   
    )/2
  );
  for (let i=0; i<4; i++) {
    let a=(i+1)%4;
    let b=(i+2)%4;
    let cx=frac*q.pts[a].x+(1-frac)*q.pts2[a].x;
    let cy=frac*q.pts[a].y+(1-frac)*q.pts2[a].y;
    ctx.bezierCurveTo(cx,cy,cx,cy,
      (cx+frac*q.pts[b].x+(1-frac)*q.pts2[b].x)/2,
      (cy+frac*q.pts[b].y+(1-frac)*q.pts2[b].y)/2
    );
  }
}

const EDGE=CSIZE-20;

var C=2*getRandomInt(3,8);
var W=getRandomInt(3,9);

var quads2=[];
for (let j=0; j<W; j++) {
  quads2[j]=[];
  for (let i=0; i<C; i++) {
    quads2[j][i]=new Quad();
  }
}

var pts=[];
var setPoints=()=>{
  pts=[];
  let radii=getRadii();
  let angles=getAngles();
  for (let i=0; i<C+2; i++) {
    pts[i]=[];
    for (let j=0; j<W+2; j++) {
      let r=radii[j];
      let z=i*TP/C+j*(TP/C/2)+angles[j];
      pts[i][j]=new Point();
      pts[i][j].x=Math.round(r*Math.cos(z));
      pts[i][j].y=Math.round(r*Math.sin(z));
    }
  }
}

var pts=[];
var setRingPoints=()=>{
  pts=[];
  let r=Math.round(EDGE*Math.random()/2);
  for (let i=0; i<C+2; i++) {
    pts[i]=[];
    for (let j=0; j<W+2; j++) {
      let z=i*TP/C+j*(TP/C/2);
      pts[i][j]=new Point();
      pts[i][j].x=Math.round(r*Math.cos(z));
      pts[i][j].y=Math.round(r*Math.sin(z));
    }
  }
}

var reset=()=>{
  C=2*getRandomInt(3,8);
  W=getRandomInt(3,9);
  quads2=[];
  for (let j=0; j<W; j++) {
    quads2[j]=[];
    for (let i=0; i<C; i++) {
      quads2[j][i]=new Quad();
    }
  }
  setRingPoints();
  setQuads2();
RING=false;
}

var setQuads2=()=>{
  for (let j=0; j<W; j++) {
    for (let i=0; i<C; i++) {
      quads2[j][i].pts[0].x=pts[i+1][j].x;
      quads2[j][i].pts[0].y=pts[i+1][j].y;
      quads2[j][i].pts[1].x=pts[i][j+1].x;
      quads2[j][i].pts[1].y=pts[i][j+1].y;
      quads2[j][i].pts[2].x=pts[i][j+2].x;
      quads2[j][i].pts[2].y=pts[i][j+2].y;
      quads2[j][i].pts[3].x=pts[i+1][j+1].x;
      quads2[j][i].pts[3].y=pts[i+1][j+1].y;
    }
  }
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<C; i++) {
    for (let j=0; j<W; j++) {
      drawQuad(quads2[j][i]);
      ctx.globalAlpha=1-frac;
      ctx.fillStyle=colors2[(j+2*i)%colors2.length];
      ctx.fill();
      ctx.globalAlpha=frac;
      ctx.fillStyle=colors[(j+2*i)%colors.length];
      ctx.fill();
      ctx.globalAlpha=1;
      ctx.stroke();
    }
  }
}

var RING=false;
var transit=()=>{
  for (let i=0; i<C; i++) {
    for (let j=0; j<W; j++) {
      for (let q=0; q<4; q++) {
        quads2[j][i].pts2[q].x=quads2[j][i].pts[q].x;
        quads2[j][i].pts2[q].y=quads2[j][i].pts[q].y;
      }
    }
  }
if (!RING && Math.random()<0.1) {
  setRingPoints(); 
  RING=true;
} else {
  setPoints();
}
  setQuads2();
  colors2=colors;
  if (Math.random()<0.8) {
    colors=getColors();
  }
}

var frac=1;
var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    if (frac>0) {
      let z=Math.asin(Math.pow(frac,0.5))/(TP/4);
      time=performance.now()-z*duration;
    }
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var time=0;
//const duration=2400;
const duration=4000;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  if (ts-time>duration) {
    frac=0;
    time=0;
    if (RING) reset();
    transit();
  } else {
    frac=Math.pow(Math.sin(TP/4*(ts-time)/duration),2);
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();
colors=getColors();
setPoints();
setQuads2();
start();
