"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const DIV_COUNT=100;

var blockwidth=400;
var blockheight=400;
var centerx=200;
var centery=200;

onresize=function() { 
  blockwidth=0.9*window.innerWidth-40; 
  blockheight=0.9*window.innerHeight-40; 
//  block=0.8*Math.min(window.innerWidth,window.innerHeight)-40; 
  centerx=(window.innerWidth-20)/2; 
  centery=(window.innerHeight-20)/2; 
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var Color=function() {
  this.hue=getRandomInt(0,360);
  this.sat;
  this.lum;
  this.randomize=()=>{
    this.hue=(this.hue+getRandomInt(0,180))%360;
    this.sat=55+30*Math.random();
    this.lum=55+30*Math.random();
  }
  this.getHSLString=()=>{
    return "hsla("+this.hue+","+this.sat+"%,"+this.lum+"%,0.9)";
  }
  this.copy=(color)=>{
    this.hue=color.hue;
    this.sat=color.sat;
    this.lum=color.lum;
  }
  this.randomize();
}

const COLOR_COUNT=4;
const colors=(()=>{
  let c=[[],[]];
  for (let i=0; i<COLOR_COUNT; i++) c[0][i]=new Color();
  for (let i=0; i<COLOR_COUNT; i++) c[1][i]=new Color();
  return c;
})();

const divs=(()=>{
  let d=[];
  for (let i=0; i<DIV_COUNT; i++) {
    let co=document.createElement("div");
    co.textContent=i+1;
    body.append(co);
    d.push(co);
  }
  return d;
})();

var pts=[[],[]];
var width=[];
var height=[];
var hstack=[10,5,4,20,25][getRandomInt(0,5,true)];
var vstack=DIV_COUNT/hstack;

const setPoints=()=>{
  let skx=Math.random()<0.5?0:25*Math.random();
  let sky=Math.random()<0.5?0:25*Math.random();
  width[pointSet]=blockwidth/hstack;
  height[pointSet]=blockheight/vstack;
  let yos=centery-blockheight/2;
  let xos=centerx-blockwidth/2;
  for (let i=0; i<vstack; i++) {
    for (let j=0; j<hstack; j++) {
      pts[pointSet][i*hstack+j]={
        x:j*(width[pointSet]+1)+xos,
        y:i*(height[pointSet]+1)+yos,
        skx:i%2==0?skx:-skx,
        sky:j%2==0?sky:-sky,
      };
    }
  }
}

function cFrac(fp) {
  let f1=.1;
  let f2=.9;
  var e2=3*fp*Math.pow(1-fp,2)*f1;
  var e3=3*(1-fp)*Math.pow(fp,2)*f2;
  var e4=Math.pow(fp,3);
  return e2+e3+e4;
}

const getColor=(c1,c2,f)=>{
  let h=(c1.hue+f*(c2.hue-c1.hue+360))%360;
  let s=f*c2.sat+(1-f)*c1.sat;
  let l=f*c2.lum+(1-f)*c1.lum;
  //return "hsla("+h+","+s+"%,"+l+"%,0.95)";
  return "hsl("+h+","+s+"%,"+l+"%)";
}

const setDivs=()=>{
  //let f=cFrac(frac);
  let f=fracs[0];
  let j=(pointSet+1)%2;
  let k=pointSet;
  let cj=(colorPointSet+1)%2;
  let ck=colorPointSet;
  let col=[];
  for (let c=0; c<COLOR_COUNT; c++) col[c]=getColor(colors[cj][c],colors[ck][c],colorFrac);
  for (let i=0; i<DIV_COUNT; i++) {
    let q=i%100;
    if (q<100/2) {
      f=cFrac(fracs[q]);
    } else {
      f=cFrac(fracs[100-q]);
    }
    //let SI=2/3*(0.5+Math.abs(Math.cos(f*Math.PI)));
   let skew="skew("+((1-f)*pts[j][i].skx+f*pts[k][i].skx)+"deg,"+((1-f)*pts[j][i].sky+f*pts[k][i].sky)+"deg)";
    divs[i].style.transform=skew;
    //divs[i].style.width=SI*((1-f)*width[j]+f*width[k])+"px";
    //divs[i].style.height=SI*((1-f)*height[j]+f*height[k])+"px";
    divs[i].style.width=(1-f)*width[j]+f*width[k]+"px";
    divs[i].style.height=(1-f)*height[j]+f*height[k]+"px";
    divs[i].style.top=(1-f)*pts[j][i].y+f*pts[k][i].y+"px";
    divs[i].style.left=(1-f)*pts[j][i].x+f*pts[k][i].x+"px";
    divs[i].style.backgroundColor=col[i%COLOR_COUNT];
  }
}

var shift=()=>{
  let st=[];
  let h=getRandomInt(1,100);
  //let h=7*getRandomInt(1,15);
  //let h=[4,5,10,20,25,50][getRandomInt(0,6)];
  for (let i=0; i<DIV_COUNT; i++) {
    st.push(pts[pointSet][(i+h)%DIV_COUNT]);
  }
  for (let i=0; i<DIV_COUNT; i++) { pts[pointSet][i]=st[i]; }
}

var pointSet=0;
const transit=()=>{
  pointSet=++pointSet%2;
  hstack=[10,5,20,4,25][getRandomInt(0,5,true)];
  vstack=DIV_COUNT/hstack;
  setPoints();
  if (Math.random()<0.7) shift();
  if (Math.random()<0.7) { pts[pointSet].reverse(); }
}

var colorPointSet=0;
const colorTransit=()=>{
  colorPointSet=++colorPointSet%2;
//let dual=Math.random()<0.5;
  for (let i=0; i<COLOR_COUNT; i++) {
    colors[colorPointSet][i].randomize();
/*
    if (dual) {
if (i%2==1) {
  colors[colorPointSet][i].copy(colors[colorPointSet][i-1]);
} else {
    colors[colorPointSet][i].randomize();
}
    } else {
    colors[colorPointSet][i].randomize();
    }
*/
  }
}

var pauseTS=1400;
var pause=(ts)=>{
  if (stopped==true) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
//    transit();
//    time=0;
//    frac=0;
    colorTime=performance.now()-colorFrac*colorDuration;
    requestAnimationFrame(animate);
  }
}

var stopped=true;
var time=0;
var duration=6000;

var stx=0;
var stxs=[];
var durF=2400;
var fCount=100;
var fracs=(()=>{
  let f=[];
  for (let i=0; i<fCount; i++) f[i]=1;
  return f; 
})();
var frac=0;
var time=0;
var colorDuration=24000;
var colorFrac=0;
var colorTime
var animate=(ts)=>{
  if (stopped) return;
  if (!stx) {
    stx=ts;
    for (let i=0; i<fCount; i++) {
      stxs[i]=ts+i*40;
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

//  if (!time) time=ts;
//  let progress=ts-time;
  let progress=ts-stx;
  if (progress<duration) {
setDivs();
    frac=progress/duration;
    requestAnimationFrame(animate);
  } else {
setDivs();
//stopped=true;
    transit();
    time=0;
stx=0;
    frac=0;
    pauseTS=performance.now()+60;
    requestAnimationFrame(pause);
  }
  if (!colorTime) colorTime=ts;
  progress=ts-colorTime;
  if (progress<colorDuration) {
    colorFrac=progress/colorDuration;
  } else {
    colorTransit();
    colorTime=0;
    colorFrac=0;
  }
  //setDivs();
}

function start() {
  if (stopped) {
    stopped=false;
    if (frac>0) {
      time=performance.now()-frac*duration;
      stx=performance.now()-frac*duration;
      for (let i=0; i<fCount; i++) {
	stxs[i]=stx+i*40;
      }
    }
    else { time=0; stx=0; }
    if (colorFrac>0) colorTime=performance.now()-colorFrac*colorDuration;
    else colorTime=0;
    requestAnimationFrame(pause);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

onresize();
transit();
transit();
//setDivs();
stopped=false;
requestAnimationFrame(animate);
//start();
