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
const AR=0, AL=1, ML=2, MR=3;
var state=0;
var colorSet=0;
var f1=0;
var s1=1,s2=1,s3=3,s4=1,s5=1,s6=1;
var c1=1,c2=1,c3=3,c4=1;
var s=[],s2=[],c=[],c2=[];

var VSide={
  pts:[[],[]],
/*
  getX:(t)=>{
    let v=0;
    for (let i in s) v+=Math.sin(s[i]*t);
    return v;
  },
  getY:(t)=>{
    let v=0;
    for (let i in c) v+=Math.cos(c[i]*t);
    return v;
  },
*/
  setPoints:()=>{
    if (state==AR || state==AL) {
      VSide.setPointsA();
    } else {
      VSide.setPointsB();
    }
  },
  setPointsA:()=>{
    for (let i=0; i<C; i++) {
      let t=i*TP/C;
      VSide.pts[pointSet][i]={
        "x":f1*(Math.sin(s1*t)+Math.sin(s2*t)+Math.sin(s3*t)+Math.sin(s4*t)),
        "y":20*(Math.cos(c1*t)+Math.cos(c2*t)+Math.cos(c3*t)+Math.cos(c4*t))
      };
    }
  },
  setPointsB:()=>{
    for (let i=0; i<C; i++) {
      let t=i*TP/C;
      VSide.pts[pointSet][i]={
        "y":120*(Math.cos(c1*t)*Math.sin(c2*t)),//+Math.cos(c3*t)*Math.sin(c4*t)),
        "x":40*(Math.cos(s1*t)*Math.sin(s2*t)+Math.cos(s3*t)*Math.sin(s4*t)+Math.cos(s5*t)*Math.sin(s6*t))
      };
    }
  }
}

const getX=(t)=>{
  let v=0;
  for (let i in s) v+=Math.sin(s[i]*t);
  return v;
}

const getY=(t)=>{
  let v=0;
  for (let i in c) v+=Math.cos(c[i]*t);
  return v;
}

var HSide={
  pts:[[],[]],
  setPoints:()=>{
    if (state==AR || state==AL) {
      HSide.setPointsA();
    } else {
      HSide.setPointsB();
    }
  },
  setPointsA:()=>{
    for (let i=0; i<C; i++) {
      let t=i*TP/C;
      HSide.pts[pointSet][i]={
        "x":20*(Math.cos(c1*t)+Math.cos(c2*t)+Math.cos(c3*t)+Math.cos(c4*t)),
        "y":f1*(Math.sin(s1*t)+Math.sin(s2*t)+Math.sin(s3*t)+Math.sin(s4*t))
      };
    }
  },
  setPointsB:()=>{
    for (let i=0; i<C; i++) {
      let t=i*TP/C;
      HSide.pts[pointSet][i]={
        "y":40*(Math.cos(s1*t)*Math.sin(s2*t)+Math.cos(s3*t)*Math.sin(s4*t)+Math.cos(s5*t)*Math.sin(s6*t)),
        "x":120*(Math.cos(c1*t)*Math.sin(c2*t))
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
  width[colorSet]=getRandomInt(4,16,true);
}

const transit=()=>{
  pointSet=++pointSet%2;
  if (state==AL) {
    transitMR(true);
    state=ML;
    HSide.setPoints();
    VSide.setPoints();
    pointSet=++pointSet%2;
    transitMR();
    state=MR;
    HSide.setPoints();
    VSide.setPoints();
  } else if (state==ML) {
    transitAR(true);
    state=AL;
    //HSide.setPoints();
    //VSide.setPoints();
    pointSet=++pointSet%2;
    transitAR();
    state=AR;
  } else if (state==MR) {
    if (Math.random()<0.2) {
      state=ML;
      transitMR(true);
    } else {
      transitMR();
    }
    HSide.setPoints();
    VSide.setPoints();
  }  else {
    if (Math.random()<0.2) {
      state=AL;
      transitAR(true);
    } else {
      transitAR();
    }
  }
//  HSide.setPoints();
//  VSide.setPoints();
}

const transitAR=(line)=>{
  //let fx=2+50*Math.random();
  let fx=2+80*Math.random();
  s=[];
  c=[];
  let n=getRandomInt(1,10);
  for (let i=0; i<n; i++) {
    s[i]=2*getRandomInt(-3,3)+1;
    c[i]=2*getRandomInt(-3,3)+1;
  }
  let inc=TP/C;
  for (let i=0; i<C; i++) {
    let t=i*inc;
    let x=(line?0:fx*getX(t)/n);
    //let x=fx*VSide.getX(t)/n;
    let y=80*getY(t)/n;
    VSide.pts[pointSet][i]={"x":x,"y":y};
    HSide.pts[pointSet][i]={"x":y,"y":x};
  }
}

const transitARO=(line)=>{
  if (line) {
    f1=0;
    c1=2*getRandomInt(-3,3)+1;
    c2=2*getRandomInt(-3,3)+1;
    s1=2*getRandomInt(-3,3)+1;
    s2=2*getRandomInt(-3,3)+1;
    c3=2*getRandomInt(-3,3)+1;
    c4=2*getRandomInt(-3,3)+1;
    s3=2*getRandomInt(-3,3)+1;
    s4=2*getRandomInt(-3,3)+1;
  } else {
    f1=2+50*Math.random();
    if (pointSet==0) {
      c1=2*getRandomInt(-3,3)+1;
      c2=2*getRandomInt(-3,3)+1;
      s1=2*getRandomInt(-3,3)+1;
      s2=2*getRandomInt(-3,3)+1;
    } else {
      c3=2*getRandomInt(-3,3)+1;
      c4=2*getRandomInt(-3,3)+1;
      s3=2*getRandomInt(-3,3)+1;
      s4=2*getRandomInt(-3,3)+1;
    }
  }
}

const transitMR2=(line)=>{
  s=[];
  s2=[];
  c=[];
  c2=[];
  let n=getRandomInt(1,5);
  for (let i=0; i<n; i++) {
    s[i]=getRandomInt(-3,4);
    s2[i]=s[i]+2*getRandomInt(-2,2)+1;
/*
    c[i]=2*getRandomInt(-3,3)+1;
	this.mx[i]=getRandomInt(-3,4);
	this.mx2[i]=this.mx[i]+2*getRandomInt(-2,2)+1;
	if (this.mx2[i]==0) this.mx2[i]=2;
	this.my[i]=getRandomInt(-3,4);
	//this.my[i]=this.mx[i];
	this.my2[i]=this.my[i]+2*getRandomInt(-2,3);
	if (this.my2[i]==0) this.my2[i]=2;
*/

  }
}

const transitMR=(line)=>{
  if (line) { 
    s2=s4=s6=0;
    c1=2*getRandomInt(-1,2);
    c2=c1+2*getRandomInt(-2,2)+1;
/*
    c1=getRandomInt(-3,3);
    c2=c1+2*getRandomInt(-2,1)+1;
    s1=getRandomInt(-3,3);
    s2=s1+2*getRandomInt(-1,1);
    s3=getRandomInt(-3,3);
    s4=s3+2*getRandomInt(-1,1);
    s5=getRandomInt(-3,3);
    s6=s5+2*getRandomInt(-1,1);
*/
  } else {
    if (pointSet==0) {
      c1=getRandomInt(-3,4);
      c2=c1+2*getRandomInt(-2,2)+1;
      if (c2==0) c2=2;
      s1=getRandomInt(-3,4);
      s2=s1+2*getRandomInt(-1,2);
      if (s2==0) s2=2;
    } else {
      s3=getRandomInt(-3,4);
      s4=s3+2*getRandomInt(-1,2);
      s5=getRandomInt(-3,4);
      s6=s5+2*getRandomInt(-1,2);
    }
  }
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
  let sat=cFrac*bkg[k].sat+(1-cFrac)*bkg[j].sat;
  let l=cFrac*bkg[k].lum+(1-cFrac)*bkg[j].lum;
  ctx.canvas.style.background="hsl("+h+","+sat+"%,"+l+"%)";
  h=(fill[j].hue+cFrac*(fill[k].hue-fill[j].hue+360)%360);
  sat=cFrac*fill[k].sat+(1-cFrac)*fill[j].sat;
  l=cFrac*fill[k].lum+(1-cFrac)*fill[j].lum;
  ctx.fillStyle="hsl("+h+","+sat+"%,"+l+"%)";
  h=(stroke[j].hue+cFrac*(stroke[k].hue-stroke[j].hue+360)%360);
  sat=cFrac*stroke[k].sat+(1-cFrac)*stroke[j].sat;
  l=cFrac*stroke[k].lum+(1-cFrac)*stroke[j].lum;
  ctx.strokeStyle="hsl("+h+","+sat+"%,"+l+"%)";
  ctx.lineWidth=cFrac*width[k]+(1-cFrac)*width[j];
}

var draw=()=>{
  setColors();
  let f=cuFrac();
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.beginPath();
  for (let sde of sides) sde.draw(f);
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
