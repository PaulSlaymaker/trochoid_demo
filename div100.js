"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const DIV_COUNT=100;

var block=400;
var centerx=200;
var centery=200;

onresize=function() { 
  block=0.8*Math.min(window.innerWidth,window.innerHeight)-40; 
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

onresize();

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
  this.randomize();
}

const COLOR_COUNT=4;
var colors=(()=>{
  let c=[[],[]];
  for (let i=0; i<COLOR_COUNT; i++) c[0][i]=new Color();
  for (let i=0; i<COLOR_COUNT; i++) c[1][i]=new Color();
  return c;
})();

var divs=(()=>{
//let col=new Color().getHSLString();
  let d=[];
  for (let i=0; i<DIV_COUNT; i++) {
    let co=document.createElement("div");
    body.append(co);
//    co.pts=[];
    d.push(co);
  }
  return d;
})();

divs.forEach((d,i)=>{ d.textContent=i+1; });

var pts=[[],[]];
/*
var cols=[[],[]];
for (let i=0; i<DIV_COUNT; i++) {
  cols[0][i]=colors[0][i%COLOR_COUNT];
  cols[1][i]=colors[1][i%COLOR_COUNT];
}
*/
var width=[];
var height=[];
var hstack=[10,5,4,20,25][getRandomInt(0,5,true)];
var vstack=DIV_COUNT/hstack;

const setPoints2=()=>{
  width[pointSet]=block/hstack;
  height[pointSet]=block/vstack;
  let yos=centery-block/2;
  let xos=centerx-block/2;
  for (let i=0; i<vstack; i++) {
    for (let j=0; j<hstack; j++) {
      divs[i*hstack+j].pts[pointSet]={x:j*(width[pointSet]+1)+xos,y:i*(height[pointSet]+1)+yos};
    }
  }
}

const setPoints=()=>{
  width[pointSet]=block/hstack;
  height[pointSet]=block/vstack;
  let yos=centery-block/2;
  let xos=centerx-block/2;
  for (let i=0; i<vstack; i++) {
    for (let j=0; j<hstack; j++) {
      pts[pointSet][i*hstack+j]={x:j*(width[pointSet]+1)+xos,y:i*(height[pointSet]+1)+yos};
    }
  }
}

//const setDivs2=()=>{ let j=(pointSet+1)%2; let k=pointSet; }

function cFrac() {
  let f1=.1;
  let f2=.9;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

const getColor=(c1,c2,f)=>{
  let h=(c1.hue+f*(c2.hue-c1.hue+360))%360;
  let s=f*c2.sat+(1-f)*c1.sat;
  let l=f*c2.lum+(1-f)*c1.lum;
  //return "hsla("+h+","+s+"%,"+l+"%,0.95)";
  return "hsl("+h+","+s+"%,"+l+"%)";
}
 
/*
const setDivs2=()=>{
  let f=cFrac();
  let j=(pointSet+1)%2;
  let k=pointSet;
  let col=[];
  for (let c=0; c<COLOR_COUNT; c++) col[c]=getColor(colors[j][c],colors[k][c],f);
  for (let i=0; i<DIV_COUNT; i++) {
    divs[i].style.width=(1-f)*width[j]+f*width[k]+"px";
    divs[i].style.height=(1-f)*height[j]+f*height[k]+"px";
    divs[i].style.top=(1-f)*divs[i].pts[j].y+f*divs[i].pts[k].y+"px";
    divs[i].style.left=(1-f)*divs[i].pts[j].x+f*divs[i].pts[k].x+"px";
    divs[i].style.backgroundColor=col[i%COLOR_COUNT];
  }
}
*/

const setDivs=()=>{
  let f=cFrac();
  let j=(pointSet+1)%2;
  let k=pointSet;
  let cj=(colorPointSet+1)%2;
  let ck=colorPointSet;
  //let col=[colors[j][0].getHSLString(),colors[j][1].getHSLString(),colors[j][2].getHSLString()];
  let col=[];
  for (let c=0; c<COLOR_COUNT; c++) col[c]=getColor(colors[cj][c],colors[ck][c],colorFrac);
  //let col=[getColor(colors[j][0],colors[k][0],f),getColor(colors[j][1],colors[k][1],f),getColor(colors[j][2],colors[k][2],f)];
//let sk=10;
  for (let i=0; i<DIV_COUNT; i++) {
    //let SI=2/3*(0.5+Math.abs(Math.cos(f*Math.PI)));
//if (i%hstack==0) sk*=-1;
//divs[i].style.transform="skew("+sk+"deg)";
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
  hstack=[10,5,4,20,25][getRandomInt(0,5,true)];
  vstack=DIV_COUNT/hstack;
  setPoints();
  if (Math.random()<0.7) shift();
  if (Math.random()<0.7) { pts[pointSet].reverse(); }
}


var colorPointSet=0;
const colorTransit=()=>{
  colorPointSet=++colorPointSet%2;
  for (let i=0; i<COLOR_COUNT; i++) colors[colorPointSet][i].randomize();
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
var duration=5000;
var frac=0;
var time=0;
var colorDuration=10000;
var colorFrac=0;
var colorTime
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  let progress=ts-time;
  if (progress<duration) {
    frac=progress/duration;
    requestAnimationFrame(animate);
  } else {
//stopped=true;
    transit();
    time=0;
    frac=0;
    pauseTS=performance.now()+600;
    requestAnimationFrame(pause);
//    requestAnimationFrame(animate);
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
  setDivs();
}

function start() {
  if (stopped) {
    stopped=false;
    requestAnimationFrame(pause);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

transit();
transit();
setDivs();
start();
