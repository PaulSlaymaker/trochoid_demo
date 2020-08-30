"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;
const CSIZE=300;
const EM=location.href.endsWith("em");

const ctx=document.querySelector("#cta").getContext("2d");
ctx.translate(CSIZE,CSIZE);
ctx.lineJoin="round";
onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
  ctx.canvas.style.border="6px solid #444";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}
ctx.lineWidth=getRandomInt(4,40);

var Color=function(dark) {
  this.hue=getRandomInt(0,360);
  this.sat;
  this.lum;
  this.randomize=()=>{
    this.hue=(this.hue+getRandomInt(0,180))%360;
    this.sat=60+35*Math.random();
    this.lum=dark?20:60+30*Math.random();
  }
  this.getHSLString=()=>{
    return "hsl("+this.hue+","+this.sat+"%,"+this.lum+"%)";
  }
  this.randomize();
}
ctx.canvas.style.background=new Color().getHSLString();
ctx.fillStyle=new Color().getHSLString();
ctx.strokeStyle=new Color(true).getHSLString();

//var C=200;
var C=72;
var pointSet=0;
var colorSet=0;
var f1=0;
var s1=1,s2=1,s3=3;
var c1=1,c2=1,c3=3;

var VSide={
  pts:[[],[]],
  setPoints:()=>{
    for (let i=0; i<C; i++) {
      let t=i*TP/C;
      VSide.pts[pointSet][i]={
        "x":f1*(Math.sin(s1*t)+Math.sin(s2*t)+Math.sin(s3*t)),
        "y":25*(Math.cos(c1*t)+Math.cos(c2*t)+Math.cos(c3*t))
      };
    }
  }
}

var HSide={
  pts:[[],[]],
  setPoints:()=>{
    for (let i=0; i<C; i++) {
      let t=i*TP/C;
      HSide.pts[pointSet][i]={
        "x":25*(Math.cos(c1*t)+Math.cos(c2*t)+Math.cos(c3*t)),
        "y":f1*(Math.sin(s1*t)+Math.sin(s2*t)+Math.sin(s3*t))
      };
    }
  }
}

var bkg=[new Color(), new Color()];
var fill=[new Color(), new Color()];
var stroke=[new Color(true), new Color(true)];
var width=[8,8];
const transitColor=()=>{
  colorSet=++colorSet%2;
  bkg[colorSet].randomize();
  fill[colorSet].randomize();
  stroke[colorSet].randomize();
  width[colorSet]=getRandomInt(4,32);
}

const transit=()=>{
  pointSet=++pointSet%2;
  f1=2+80*Math.random();
  s1=2*getRandomInt(0,4,true)+1;
  s2=2*getRandomInt(0,4,true)+1;
  s3=2*getRandomInt(0,4,true)+1;
  c1=2*getRandomInt(0,4,true)+1;
  c2=2*getRandomInt(0,4,true)+1;
  c3=2*getRandomInt(0,4,true)+1;
  HSide.setPoints();
  VSide.setPoints();
}

var Side=function(sp) {
  this.sp=sp;
  this.side=sp.s;
  this.draw=(f)=>{
//let f=fracs[0];
    let j=(pointSet+1)%2;
    let k=pointSet;
    ctx.moveTo(
      (1-f)*this.side.pts[j][0].x+f*this.side.pts[k][0].x+this.sp.x,
      (1-f)*this.side.pts[j][0].y+f*this.side.pts[k][0].y+this.sp.y
    );
    for (let i=1; i<C; i++) {

/*
let o=(2*i)%32;
//let o=i%32;
if (o<32/2) {
  f=fracs[o];
} else {
  f=fracs[32-1-o];
}
*/
 
      ctx.lineTo(
        (1-f)*this.side.pts[j][i].x+f*this.side.pts[k][i].x+this.sp.x,
        (1-f)*this.side.pts[j][i].y+f*this.side.pts[k][i].y+this.sp.y
      );
    }
    ctx.lineTo(
      (1-f)*this.side.pts[j][0].x+f*this.side.pts[k][0].x+this.sp.x,
      (1-f)*this.side.pts[j][0].y+f*this.side.pts[k][0].y+this.sp.y
    );
  }
}

var sides=[];
/*
for (let yi of [-400,-200,0,200,400]) {
  for (let xi of [-300,-100,100,300]) {
    sides.push(new Side({"x":xi,"y":yi,"s":HSide}));
  }
}
*/

for (let yi of [-300,-150,0,150,300]) {
  for (let xi of [-225,-75,75,225]) {
    sides.push(new Side({"x":xi,"y":yi,"s":HSide}));
  }
}

for (let yi of [-225,-75,75,225]) {
  for (let xi of [-300,-150,0,150,300]) {
    sides.push(new Side({"x":xi,"y":yi,"s":VSide}));
  }
}

var cuFrac=()=>{
    let f1=.1;
    let f2=.9;
    var e2=3*frac*Math.pow(1-frac,2)*f1;
    var e3=3*(1-frac)*Math.pow(frac,2)*f2;
    var e4=Math.pow(frac,3);
    return e2+e3+e4;
}

var setColors=()=>{
  let j=(colorSet+1)%2;
  let k=colorSet;
  let h=(bkg[j].hue+cFrac*(bkg[k].hue-bkg[j].hue+360))%360;
  let s=cFrac*bkg[k].sat+(1-cFrac)*bkg[j].sat;
  let l=cFrac*bkg[k].lum+(1-cFrac)*bkg[j].lum;
  ctx.canvas.style.background="hsl("+h+","+s+"%,"+l+"%)";
  h=(fill[j].hue+cFrac*(fill[k].hue-fill[j].hue+360)%360);
  s=cFrac*fill[k].sat+(1-cFrac)*fill[j].sat;
  l=cFrac*fill[k].lum+(1-cFrac)*fill[j].lum;
  ctx.fillStyle="hsl("+h+","+s+"%,"+l+"%)";
  h=(stroke[j].hue+cFrac*(stroke[k].hue-stroke[j].hue+360)%360);
  s=cFrac*stroke[k].sat+(1-cFrac)*stroke[j].sat;
  l=cFrac*stroke[k].lum+(1-cFrac)*stroke[j].lum;
  ctx.strokeStyle="hsl("+h+","+s+"%,"+l+"%)";
  ctx.lineWidth=cFrac*width[k]+(1-cFrac)*width[j];
}

var draw=()=>{
  setColors();
  let f=cuFrac();
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.beginPath();
  for (let s of sides) s.draw(f);
  ctx.closePath();
  ctx.stroke();
  ctx.fill("evenodd");
}

var stopped=true;
var time=0;
var duration=8000;
var frac=0;
/*
var stx=0;
var stxs=[];
var durF=4800;
var fCount=32;
var fracs=(()=>{
  let f=[];
  for (let i=0; i<fCount; i++) f[i]=1;
  return f; 
})();
*/
var cTime=0;
var cDuration=40000;
var cFrac=0;
var animate=(ts)=>{
  if (stopped) return;

/*
  if (!stx) {
    stx=ts;
    for (let i=0; i<fCount; i++) {
      stxs[i]=ts+i*100;  // (duration-durF)/fCount
      //stxs[i]=ts+i;  // (duration-durF)/fCount
    }
  } 
else {
  for (let i=0; i<fCount; i++) {
    let pgs=ts-stxs[i];
    if (pgs<0) {
      fracs[i]=0;
    } else if (pgs<durF) {
      fracs[i]=pgs/durF; 
//    } else if (pgs<duration) {
//      fracs[i]=pgs/duration; 
    } else {
      fracs[i]=1;
    }
  }
}
*/

  if (!time) time=ts;
  let progress=ts-time;
  if (progress<duration) {
    frac=progress/duration;
  } else {
    transit();
    time=0;
    frac=0;
//    for (let i=0; i<fCount; i++) fracs[i]=0;
//    stx=0;
    if (EM) stopped=true;
  }
  if (!cTime) cTime=ts;
  progress=ts-cTime;
  if (progress<cDuration) {
    cFrac=progress/cDuration;
  } else {
    transitColor();
    cTime=0;
    cFrac=0;
  }
  draw();
  requestAnimationFrame(animate);
}

const resetTimes=()=>{
  if (frac>0) time=performance.now()-frac*duration;
  else time=0;
  if (cFrac>0) cTime=performance.now()-cFrac*cDuration;
  else cTime=0;
}

function start() {
  if (stopped) {
    stopped=false;
    resetTimes();
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

onresize();
transit();
transit();
start();
