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
ctx.lineWidth=8;
ctx.strokeStyle="black";
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

const COUNT=7;

var getLanes=()=>{
  let s=[];
  for (let i=0; i<COUNT-1; i++) {
    if (blocked) {
      //let v=Math.round(block*((CSIZE-20)*0.5*[-1,1][getRandomInt(0,2)])/block);
      let v=Math.round(block*((CSIZE-20)*[-1,1][getRandomInt(0,2)])/block);
      s.push(v);
    } else s.push(getRandomInt(-CSIZE+20,CSIZE-20));
  }
  s.sort((a,b)=>{ return a-b; });
  s.unshift(-CSIZE+20);
  s.push(CSIZE-20);
  return s;
}

var lanesx=getLanes();
var lanesy=getLanes();

var locType="eqr";
var blocked=false;
var block=1;

var getSet=(uy)=>{
  let s=[];
  let d=2*(CSIZE-20)/(COUNT-1);
  for (let i=0; i<COUNT-1; i++) {
if (locType=="lanes") {
  if (uy) s.push(Math.round(lanesy[i]+(lanesy[i+1]-lanesy[i])*Math.random()));
  else s.push(Math.round(lanesx[i]+(lanesx[i+1]-lanesx[i])*Math.random()));
} else if (locType=="blanes") {
  if (uy) s.push(Math.round(lanesy[i]+(lanesy[i+1]-lanesy[i])*0.5));
  else s.push(Math.round(lanesx[i]+(lanesx[i+1]-lanesx[i])*0.5));
} else if (locType=="even") {
  if (blocked) {
    let v=block*Math.round((-CSIZE+20+i*d+d*0.5)/block);
    s.push(Math.round(v));
  } else s.push(Math.round(-CSIZE+20+i*d+d*0.5));
  //s.push(Math.round(-CSIZE+20+i*d+d*fa));
  //let fa=[0,0.5,1][getRandomInt(0,3)];
//let fa=[1,10,20,40,80,120][getRandomInt(0,6)];
} else {
  if (blocked) {
    //let v=block*Math.round((-CSIZE+20+i*d+d*Math.random())/block);
    let v=block*Math.round((-CSIZE+20+i*d+d*Math.random())/block);
    s.push(Math.round(v));
  } else {
    s.push(Math.round(-CSIZE+20+i*d+d*Math.random()));
  }
}
  }
  s.sort((a,b)=>{ return a-b; });
  s.unshift(-CSIZE+20);
  s.push(CSIZE-20);
  return s;
}

var colors=[];
var colors2=[];
var getColors=()=>{
  let c=[];
  let colorCount=getRandomInt(2,COUNT+5,true);
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
  this.x2=0;
  this.y2=0;
}

var Quad=function() {
  this.pts=[new Point(),new Point(),new Point(),new Point()];
}
var quads=[];
for (let i=0; i<COUNT*COUNT; i++) quads.push(new Quad());

var randomizeQuads=()=>{
  let x=[];
  let y=[];
  for (let i=0; i<COUNT+1; i++) {
    x.push(getSet());
    y.push(getSet(true));
  }
  for (let i=0,c=0; i<COUNT; i++) {
    for (let j=0; j<COUNT; j++,c++) {
      quads[c].pts[0].x=x[i][j];
      quads[c].pts[1].x=x[i][j+1];
      quads[c].pts[2].x=x[i+1][j+1];
      quads[c].pts[3].x=x[i+1][j];

      quads[c].pts[0].y=y[j][i];
      quads[c].pts[1].y=y[j+1][i];
      quads[c].pts[2].y=y[j+1][i+1];
      quads[c].pts[3].y=y[j][i+1];
    }
  }
}

var drawPolyFrac=(vertArray)=>{
  ctx.beginPath();
  ctx.moveTo(
    ( 
      frac*vertArray[0].x+(1-frac)*vertArray[0].x2+   
      frac*vertArray[1].x+(1-frac)*vertArray[1].x2   
    )/2,
    (
      frac*vertArray[0].y+(1-frac)*vertArray[0].y2+   
      frac*vertArray[1].y+(1-frac)*vertArray[1].y2   
    )/2
  );
  for (let i=0; i<4; i++) {
    let a=(i+1)%4;
    let b=(i+2)%4;
    ctx.bezierCurveTo(
      frac*vertArray[a].x+(1-frac)*vertArray[a].x2,
      frac*vertArray[a].y+(1-frac)*vertArray[a].y2,
      frac*vertArray[a].x+(1-frac)*vertArray[a].x2,
      frac*vertArray[a].y+(1-frac)*vertArray[a].y2,
      ( 
	frac*vertArray[a].x+(1-frac)*vertArray[a].x2+   
	frac*vertArray[b].x+(1-frac)*vertArray[b].x2   
      )/2,
    (
      frac*vertArray[a].y+(1-frac)*vertArray[a].y2+   
      frac*vertArray[b].y+(1-frac)*vertArray[b].y2   
    )/2
    );
  }
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<COUNT*COUNT; i++) {
    drawPolyFrac(quads[i].pts);
    ctx.globalAlpha=1-frac;
    ctx.fillStyle=colors2[i%colors2.length];
    ctx.fill();
    ctx.globalAlpha=frac;
    ctx.fillStyle=colors[i%colors.length];
    ctx.fill();
    ctx.globalAlpha=1;
    ctx.stroke();
  }
}

var transit=()=>{
  quads.forEach((q)=>{ 
    q.pts.forEach((p)=>{
      p.x2=p.x;
      p.y2=p.y;
    });
  });
  if (Math.random()<0.5) {
    blocked=true;
    //block=[10,20,40,80,120,200][getRandomInt(0,6)];
    block=190/getRandomInt(1,10,true);
  } else blocked=false;
if (Math.random()<0.5) {
  if (Math.random()<0.2) {
    locType=["lanes","blanes"][getRandomInt(0,2)];
  } else if (Math.random()<0.3) {
    locType="even";
  } else locType="eqr";
}
  if (locType=="lanes" || locType=="blanes") {
    lanesx=getLanes();
    lanesy=getLanes();
  }
  randomizeQuads();
  colors2=colors;
  colors=getColors();
}

var frac=1;
var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    if (frac>0) {
      let z=Math.asin(Math.pow(frac,0.25))/(TP/4);
      time=performance.now()-z*duration;
    }
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var time=0;
const duration=4000;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  if (ts-time>duration) {
    frac=0;
    time=0;
    transit();
  } else {
    frac=Math.pow(Math.sin(TP/4*(ts-time)/duration),4);
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();
transit();
colors=getColors();
start();
