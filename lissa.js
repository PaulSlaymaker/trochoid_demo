"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const polar=[Math.sin,Math.cos];
const CSIZE=400;
const scale=380;

var canvas=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  let co=document.createElement("div");
  co.style.textAlign="center";
  co.append(c);
  body.append(co);
  return c;
})();

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

var ps=0;
var colorSet=0;
var type=0;

var Curve=function() {
  this.pc=0;	// polar count
  this.xf=[], this.yf=[];
  this.mx=[], this.my=[]; // first dimension is factor, 2nd is addition term
  this.cent=false;	// curve center
  this.line=false;
  this.randomize=(s)=>{
    this.xf=[], this.yf=[];
    if (s) this.pc=1;
    else this.pc=getRandomInt(1,5);
    this.xf[0]=1, this.xf[1]=0;
    this.yf[0]=1, this.yf[1]=0;
    for (let i=2; i<this.pc; i++) {
      this.xf[i]=1;
      this.yf[i]=getRandomInt(0,2);
    }
    this.cent=Math.random()<0.2;
  }
  this.setPoints=()=>{
    if (this.pc==1) this.setPointsS();
    else this.setPointsM();
  }
  this.setPointsS=()=>{
    let mx=[];
    let my=[];
    let c=getRandomInt(1,10);
    for (let i=0; i<c; i++) {
      mx[i]=randomOdd();
      if (ps%3==0) {  	// variety
	my[i]=randomOdd();
      } else {		// beauty
	my[i]=mx[i];
      }
    }
    const getX=(t)=>{ 
      let v=0;
      for (let i=0; i<c; i++) v+=Math.cos(mx[i]*t);
      return v;
    }
    const getY=(t)=>{ 
      let v=0;
      for (let i=0; i<c; i++) v+=Math.sin(my[i]*t);
      return v;
    }
    let pointSet=ps%2;
    points[pointSet].pts=[];
    points[pointSet].cs=1;
    for (let i=0, t=0; i<Z; i+=1, t=i*I) {
      points[pointSet].pts[i]={x:getX(t)/c,y:this.line?0:getY(t)/c};
    }
  }
  this.setPointsM=()=>{
    let mx=[], my=[];
    let sineAccumulator=0;
    for (let p=0; p<this.pc; p++) {
      mx[p]=[];
      my[p]=[];
      sineAccumulator+=this.xf[p]==0?1:0;
      sineAccumulator+=this.yf[p]==0?1:0;
    }
    let sa=sineAccumulator%2==0;
    // true: reverse type,  e/o or o/e,  x/y multipliers even/odd or odd/even
    // false: sum y multiplier always odd type
    let c=this.line?1:getRandomInt(1,10,true);
//let c=1;
    for (let i=0; i<c; i++) { 
      let xa=0, ya=0;
      for (let p=0; p<this.pc; p++) {
	if (this.line) {
	  mx[p][i]=this.xf[p]?randomAny():0;
	} else {
	  mx[p][i]=this.xf[p]?randomAny():randomAnyNZ();
	}
	my[p][i]=this.yf[p]?randomAny():randomAnyNZ();
	xa+=mx[p][i];
	ya+=my[p][i];
      }
      if (sa) {
	if (type==0) {
	  if (xa%2!=0) mx[0][i]++; // first term in product always cosine, ++ going to 0 is OK
	  if (ya%2==0) my[0][i]++;
	} else {
	  if (xa%2==0) mx[0][i]++;
	  if (ya%2!=0) my[0][i]++;
	}
      } else {
	if (type==0) {
	  if (xa%2!=0) mx[0][i]++;
	} else {
	  if (xa%2==0) mx[0][i]++;
	}
	if (ya%2==0) my[0][i]++;
      }
    }
    let pointSet=ps%2;
    points[pointSet].pts=[];
    points[pointSet].cs=1;
    let maxs=0;
    for (let i=0, t=0; i<Z; i+=1, t=i*I) {
      let x=0, y=0;
      for (let i=0; i<c; i++) {
	let xfa=polar[this.xf[0]].call(null,mx[0][i]*t);
	let yfa=polar[this.yf[0]].call(null,my[0][i]*t);
	for (let p=1; p<this.pc; p++) {
	  xfa*=polar[this.xf[p]].call(null,mx[p][i]*t);
	  yfa*=polar[this.yf[p]].call(null,my[p][i]*t);
	}
        if (this.cent) { 
	  x+=Math.pow(xfa,3);
	  y+=Math.pow(yfa,3);
        } else {
	  x+=xfa;
	  y+=yfa;
        }
      }
      maxs=Math.max(maxs,x);
      maxs=Math.max(maxs,y);
      points[pointSet].pts.push({"x":x,"y":y});
    }
    points[pointSet].cs=1/(maxs<0.01?1:maxs);
  }
}

var Points=function() {
  this.pts=[];
  this.cs=1;	// curve scale
  this.X=(idx)=>{ return scale*this.cs*this.pts[idx].x; }
  this.Y=(idx)=>{ return scale*this.cs*this.pts[idx].y; }
  this.X=(idx)=>{ return scale*this.cs*this.pts[idx].x; }
  this.Y=(idx)=>{ return scale*this.cs*this.pts[idx].y; }
}

const randomAny=()=>{ return [0,1,-1,2,-2,3,-3,4,-4,5,-5,6,-6][getRandomInt(0,13,true)]; }
const randomAnyNZ=()=>{ return [1,-1,2,-2,3,-3,4,-4,5,-5,6,-6][getRandomInt(0,12,true)]; }
const randomOdd=()=>{ return [-1,1,-3,3,-5,5][getRandomInt(0,6,true)]; }
const randomEven=()=>{ return [0,2,-2,4,-4][getRandomInt(0,5,true)]; }
const randomEvenNZ=()=>{ return [2,-2,4,-4,6,-6][getRandomInt(0,6,true)]; }

var points=[new Points(),new Points()];

var ctx=canvas.getContext("2d");
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=3;
ctx.lineJoin="round";

var hue=[getRandomInt(0,360),getRandomInt(0,360)];
var hue2=[getRandomInt(0,360),getRandomInt(0,360)];

const gradient=()=>{
  let grad=ctx.createRadialGradient(0,0,0,0,0,CSIZE);
  let h=((1-colorFrac)*hue[(colorSet+1)%2]+colorFrac*hue[colorSet])%360;
  grad.addColorStop(1,"hsl("+h+",50%,50%)"); 
  grad.addColorStop(0.2,"black");
  return grad;
}

const Z=400;
const I=TP/Z;

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.beginPath();
  let c1=points[ps%2];
  let c2=points[(ps+1)%2];
  let j=0;
  let f=fracs[0];
  let x=(1-f)*c2.X(0)+f*c1.X(0);
  let y=(1-f)*c2.Y(0)+f*c1.Y(0);
  ctx.moveTo(x,y);
  for (let i=1; i<Z; i+=1) {
    //let j=(i+100)%Z/2;
    j=(fracFactor*i)%Z;
    //let j=i;
    if (j<Z/2) f=fracs[j];
    else f=fracs[Z-1-j];
    x=(1-f)*c2.X(i)+f*c1.X(i);
    y=(1-f)*c2.Y(i)+f*c1.Y(i);
    ctx.lineTo(x,y);
  }
  x=(1-f)*c2.X(0)+f*c1.X(0);
  y=(1-f)*c2.Y(0)+f*c1.Y(0);
  ctx.lineTo(x,y);
  ctx.lineWidth=18;
  ctx.strokeStyle=gradient();
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  j=0;
  f=fracs[j];
  y=(1-f)*c2.X(0)+f*c1.X(0);
  x=(1-f)*c2.Y(0)+f*c1.Y(0);
  ctx.moveTo(x,y);
  for (let i=1; i<Z; i+=1) {
    j=(fracFactor*i)%Z;
    if (j<Z/2) f=fracs[j];
    else f=fracs[Z-1-j];
    ctx.lineTo((1-f)*c2.Y(i)+f*c1.Y(i),(1-f)*c2.X(i)+f*c1.X(i));
  }
  y=(1-f)*c2.X(0)+f*c1.X(0);
  x=(1-f)*c2.Y(0)+f*c1.Y(0);
  ctx.lineTo(x,y);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  j=0;
  f=fracs[j];
  x=(1-f)*c2.X(0)+f*c1.X(0);
  y=(1-f)*c2.Y(0)+f*c1.Y(0);
  ctx.moveTo(x,y);
  for (let i=1; i<Z; i+=1) {
    j=(fracFactor*i)%Z;
    if (j<Z/2) f=fracs[j];
    else f=fracs[Z-1-j];
    x=(1-f)*c2.X(i)+f*c1.X(i);
    y=(1-f)*c2.Y(i)+f*c1.Y(i);
    ctx.lineTo(x,y);
  }
  x=(1-f)*c2.X(0)+f*c1.X(0);
  y=(1-f)*c2.Y(0)+f*c1.Y(0);
  ctx.lineTo(x,y);
  j=0;
  f=fracs[j];
  y=(1-f)*c2.X(0)+f*c1.X(0);
  x=(1-f)*c2.Y(0)+f*c1.Y(0);
  ctx.moveTo(x,y);
  for (let i=1; i<Z; i+=1) {
    j=(fracFactor*i)%Z;
    if (j<Z/2) f=fracs[j];
    else f=fracs[Z-1-j];
    ctx.lineTo((1-f)*c2.Y(i)+f*c1.Y(i),(1-f)*c2.X(i)+f*c1.X(i));
  }
  ctx.closePath();
  ctx.lineWidth=4;
  let h=((1-colorFrac)*hue2[(colorSet+1)%2]+colorFrac*hue2[colorSet])%360;
  ctx.strokeStyle="hsl("+h+",70%,50%)";
  ctx.stroke();
}

const transit=()=>{
  ps++;
  if (curve.line) {
    type=[0,1][getRandomInt(0,2)];
    curve.randomize();
    curve.setPoints();
    curve.line=false;
    ps++;
  } else {
    if (Math.random()<0.2) {
      curve.line=true;
    }
  }
  curve.setPoints();
}

const resetTimes=()=>{
//  if (frac>0) {
    stx=performance.now()-frac*duration;
    for (let i=0, stp=(duration-durF)/fCount; i<fCount; i++) {
      stxs[i]=stx+i*stp;
    }
//  }
//  else { stx=0; }
  if (colorFrac>0) colorTime=performance.now()-colorFrac*colorDuration;
  else colorTime=0;
}

var stopped=false;
var start=()=>{
  if (stopped) { 
    stopped=false;
    resetTimes();
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
    fracFactor=[2,4][getRandomInt(0,2)];
    requestAnimationFrame(animate);
  }
}

var fracFactor=2;
var stx=0;
var frac=0;
var stxs=[];
//var duration=4000;
var duration=6000;
//var durF=1600;
var durF=2000;
var fCount=200;
var fracs=(()=>{
  let f=[];
  for (let i=0; i<fCount; i++) f[i]=1;
  return f; 
})();
var colorDuration=24000;
var colorFrac=0;
var colorTime=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!stx) {
    stx=ts;
    for (let i=0, stp=(duration-durF)/fCount; i<fCount; i++) {
      stxs[i]=ts+i*stp;
    }
  }
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
  let af=animate;
  let progress=ts-stx;
  if (progress<duration) {
    frac=progress/duration;
//    requestAnimationFrame(animate);
  } else {
    stx=0;
    frac=0;
    pauseTS=performance.now()+(Math.random()<0.05)?60:0;
    af=pause;
    //requestAnimationFrame(pause);
    //if (EM) stopped=true;
  }
  if (!colorTime) colorTime=ts;
  progress=ts-colorTime;
  if (progress<colorDuration) {
    colorFrac=progress/colorDuration;
  } else {
    colorSet=++colorSet%2;
    hue[colorSet]=getRandomInt(0,360);
    hue2[colorSet]=getRandomInt(0,360);
    colorTime=0;
    colorFrac=0;
  }
  draw();
  requestAnimationFrame(af);
}

var curve=new Curve();

onresize();
curve.randomize(true);
transit();
transit();

if (EM) draw();
else requestAnimationFrame(animate);
