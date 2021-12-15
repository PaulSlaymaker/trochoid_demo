"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;

const CSIZE=400;
const PolarType=[Math.sin,Math.cos];
const SCALE=40;

var ctx=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  let co=document.createElement("div");
  co.style.textAlign="center";
  co.append(c);
  body.append(co);
  return c.getContext("2d");
})();

ctx.translate(CSIZE,CSIZE);
ctx.fillStyle="#AAD";

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const randomOdd=()=>{ return [1,-1,3,-3,5,-5][getRandomInt(0,6)]; }
const randomEven=()=>{ return [2,-2,4,-4,6,-6][getRandomInt(0,6)]; }

var cuFrac=(frac)=>{
  let f1=.2;
  let f2=.8;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var Polar=function(pt) {
  this.pt=pt;
  this.mult=randomOdd();
  this.getValue=(t)=>{ return PolarType[this.pt](this.mult*t); }
}

var Term=function(pt,p) {
  this.polar=[];
  for (let i in p) { 
    let tt=pt?p[i]:(p[i]-1)*-1;
    this.polar.push(new Polar(tt));
  }
  this.factor=1;
  this.sign=1;
  this.randomize=()=>{ 
    if (Math.random()<0.05) {
      if (this.polar.length>1) {
	if (Math.random()<0.5) {
	  this.polar[0].mult=randomOdd();
	  this.polar[1].mult=randomEven();
	  this.polar[2].mult=randomEven();
          if (this.polar.length>3) {
	    if (Math.random()<0.5) {
	      this.polar[3].mult=randomOdd();
	      this.polar[4].mult=randomOdd();
            } else {
	      this.polar[3].mult=randomEven();
	      this.polar[4].mult=randomEven();
            }
          }
	} else {
	  for (let i in this.polar) this.polar[i].mult=randomOdd();
	}
      } else {
	this.polar[0].mult=randomOdd();
      }
    }
    if (Math.random()<0.2) {
      this.factor=[1,2,3,4][getRandomInt(0,4)]; 
    }
    if (Math.random()<0.07) this.sign*=-1;
  }
  this.getValue=(t)=>{ 
    let acc=1;
    for (let i in this.polar) acc*=this.polar[i].getValue(t);
    return this.sign*this.factor*acc;
  }
  this.eqn=()=>{
    let tv=this.factor.toString();
    for (let i in this.polar) {
      tv+=PolarType[this.polar[i].pt].name+this.polar[i].mult;
    }
    return tv;
  }
}

var curve={
  xTerms:[new Term(0,[0]),new Term(0,[0]),new Term(0,[0]),new Term(0,[0])],
  yTerms:[new Term(1,[0]),new Term(1,[0]),new Term(1,[0]),new Term(1,[0])],
  randomize:()=>{ 
    var ttx=[[0,0,0],[0,1,1],[0,0,0,0,0],[0,0,0,1,1],[0,1,1,1,1],[0]];
    let termCount=4;  // use 5?
    for (let i=0; i<termCount; i++) {
      if (Math.random()<0.1) {
        curve.xTerms[i]=new Term(0,ttx[getRandomInt(0,6)]);
      }
    }
    for (let i=0; i<termCount; i++) {
      if (Math.random()<0.1) {
        curve.yTerms[i]=new Term(1,ttx[getRandomInt(0,6)]);
      }
    }
    for (let i in curve.xTerms) { curve.xTerms[i].randomize(); }
    for (let i in curve.yTerms) { curve.yTerms[i].randomize(); }
  },
  getX:(t)=>{ 
    let sum=0;
    for (let i in curve.xTerms) sum+=curve.xTerms[i].getValue(t);
    return sum;
  },
  getY:(t)=>{ 
    let sum=0;
    for (let i in curve.yTerms) sum+=curve.yTerms[i].getValue(t);
    return sum;
  }
};

var ps=0;
var pts=[];
var setCurve=()=>{
  curve.randomize();
  pts[ps]=[];
  let maxs=0.01;
  for (let t=0; t<Math.PI*2-0.001; t+=TP/Z) {
    let x=curve.getX(t);
    let y=curve.getY(t);
    pts[ps].push({"x":x,"y":y});
    maxs=Math.max(maxs,x);
    maxs=Math.max(maxs,y);
  }
  let cs=10/maxs;
  for (let i in pts[ps]) {
    pts[ps][i].x*=cs*SCALE;
    pts[ps][i].y*=cs*SCALE;
  }
}

var points=[];
var setPoints=(frac)=>{
  points=[];
  let f=cuFrac(frac);
  let j=(ps+1)%2;
  let k=ps;
  for (let i=0; i<pts[j].length; i++) {
    if (async) {
      let q=4*i%Z;
      if (q<Z/2) f=fracs[q];
      else f=fracs[Z-q];
    }
    let x=(1-f)*pts[j][i].x+f*pts[k][i].x;
    let y=(1-f)*pts[j][i].y+f*pts[k][i].y;
    points[i]={"x":x,"y":y,"d":[]};
    points[i+pts[j].length]={"x":y,"y":x,"d":[]};
  }
  for (let j=0; j<points.length; j++) {
    for (let k=j+1; k<points.length; k++) {
      let d=Math.pow(Math.pow(points[j].x-points[k].x,2)+Math.pow(points[j].y-points[k].y,2),0.5);
      //points[j].d.push({"i":k,"m":d});
      //points[k].d.push({"i":j,"m":d});
      points[j].d.push(d);
      points[k].d.push(d);
    }
  }
  for (let i=0; i<points.length; i++) {
    //points[i].d.sort((a,b)=>{ return a.m-b.m; });
    //points[i].d.sort((a,b)=>{ return a-b; });
    let mind=CSIZE;
    for (let j in points[i].d) {
      mind=Math.min(mind,points[i].d[j]);
    }
    points[i]["mr"]=mind;
  }
}

var getR=(pt)=>{
  //let d=Math.min(pt.d[0]/2,CSIZE-Math.max(Math.abs(pt.x),Math.abs(pt.y)));
  let d=Math.min(pt.mr/2,CSIZE-Math.max(Math.abs(pt.x),Math.abs(pt.y)));
  if (d<0) d=0;
  return d;
}

var draw=(frac, fin)=>{
  setPoints(frac);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//ctx.fillStyle="hsla(0,0%,0%,0.06)";   // fade
//ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<points.length; i++) {
    let r=getR(points[i]);
    if (r==0) continue;
    ctx.beginPath();
    ctx.moveTo(points[i].x+r,points[i].y);
    ctx.arc(points[i].x,points[i].y,r,0,TP);
    ctx.closePath();
//  ctx.stroke();
//  ctx.fillStyle="hsl("+(hue+120*r/maxr)+",80%,70%)"; // fade
    ctx.fillStyle="hsl("+(hue+240*r/maxr)+",95%,55%)";
    ctx.fill();
  }
}

var transit=()=>{
  ps=++ps%2;
//ps=(ps-1)*-1;
  curve.randomize();
  setCurve();
}

var stopped=true;
var start=()=>{
  if (stopped) {
    stopped=false;
    if (async) {
      stx=performance.now()-frac*duration;
      for (let i=0, stp=(duration-durF)/fCount; i<fCount; i++) {
	stxs[i]=stx+i*stp;
      }
    } else {
      if (frac>0) stx=performance.now()-frac*duration;
    }
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var pauseTS=1400;
var pause=(ts)=>{
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    if (EM) stopped=true;
    transit();
    requestAnimationFrame(animate);
  }
}

var S=0;
var op=1;
var stx=0;
var frac=0;
var duration=6000;
var stxs=[];
var durF=5000;
var fCount;
var fracs;
var animate=(ts)=>{
  if (stopped) return;
  if (!stx) {
    stx=ts;
    if (async) {
	for (let i=0, stp=(duration-durF)/fCount; i<fCount; i++) {
	  stxs[i]=ts+i*stp;
	}
    }
  }
  if (async) {
    for (let i=0; i<fCount; i++) {
      let pgs=ts-stxs[i];
      if (pgs<0) {
	fracs[i]=0;
      } else if (pgs<durF) {
	fracs[i]=pgs/durF; 
      } else {
	fracs[i]=1;
      }
    }
  }
  let progress=ts-stx;
  if (progress<duration) {
    frac=progress/duration;
    draw(frac);
    requestAnimationFrame(animate);
  } else {
    draw(1);
    stx=0;
    frac=0;
    if (async) {
      if (EM) stopped=true;
      transit();
      requestAnimationFrame(animate);
    } else {
      pauseTS=performance.now()+4;
      //pauseTS=performance.now()+200;
      requestAnimationFrame(pause);
    }
    //transit();
    //requestAnimationFrame(animate);
  }
  if (S==0) {
    if (Math.random()<0.0002)  S=1;
  } else if (S==1) {
    op-=0.03;
    if (op<0) {
      op=0;
      reset();
      transit();
      transit();
      S=2;
    }
    ctx.canvas.style.opacity=op;
  } else if (S==2) {
    op+=0.03;
    if (op>1) { op=1; S=0; }
    ctx.canvas.style.opacity=op;
  }
}

var Z=30*getRandomInt(1,8);
var hue=getRandomInt(0,360);
var maxr=TP*CSIZE/Z;
var async=false;
var reset=()=>{
  //Z=12*getRandomInt(1,17);
  Z=4*getRandomInt(30,60);
  maxr=TP*CSIZE/Z;
  hue=getRandomInt(0,360);
  //if (Z%8!=0 && Math.random()<0.5) async=true;
  if (Z%8!=0) async=true;
  else async=false;
  if (async) {
    fCount=Z/2;
    fracs=(()=>{
      let f=[];
      for (let i=0; i<fCount; i++) f[i]=1;
      return f; 
    })();
    duration=8000
  } else {
    duration=6000
  }
}

onresize();
reset();
transit();
transit();
if (EM) draw(0);
else start();
