"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.margin=0;
const TP=Math.PI*2;

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

//onresize=function() { // could implement }

let bhue=getRandomInt(0,360);
var bg0=[bhue,0];
var bg1=[bhue=(bhue+getRandomInt(90,150))%360,0];
var bg2=[bhue=(bhue+getRandomInt(90,150))%360,0];

var poly={
  m:[1,13],
  c:2,
  getX:(t)=>{ 
    let v=0;
    for (let i=0; i<poly.c; i++) v+=Math.cos(poly.m[i]*t);
    return v/poly.c;
  },
  getY:(t)=>{ 
    let v=0;
    for (let i=0; i<poly.c; i++) v+=Math.sin(poly.m[i]*t);
    return v/poly.c;
  },
  randomize:()=>{ 
//  poly.c=1;
  //poly.m[0]=poly.m[1]=2*backP-1;
//  poly.m[0]=1;
    poly.m=[];
    poly.c=getRandomInt(2,12); 
    for (let i=0; i<poly.c; i++) {
      let f=[-4,4][getRandomInt(0,2)];
      poly.m[i]=f*getRandomInt(1,20)+1;
    }
  }
}

var Layer=function(p,cn,bkg,fill) {
  this.P=p;
  this.cn=cn;
  this.cp=[[],[]];
  this.setPoints=()=>{
    for (let i=0; i<this.P; i++) {
      let z=i*TP/this.P;
      this.cp[pointSet][i]={
       "x":50+inset[pointSet]*poly.getX(z),
       "y":50+inset[pointSet]*poly.getY(z)
      };
    }
  }
  this.getStyle=()=>{
    let f=frac;
    let j=(pointSet+1)%2;
    let k=pointSet;
    let style="."+cn+"{clip-path:";
    style+="polygon("+fill+",";
    for (let i=0; i<this.P; i++) {  // could make 2-curve average, transitioning through 3
      let x=(1-f)*this.cp[j][i].x+f*this.cp[k][i].x;
      let y=(1-f)*this.cp[j][i].y+f*this.cp[k][i].y;
      style+=x+"% "+y+"%";
      if (i<this.P-1) style+=",";
    }
    style+=");";
    j=(colorSet+1)%2;
    k=colorSet;
    let h=(bkg[j]+cFrac*(bkg[k]-bkg[j]+360))%360;
    style+=";background:hsl("+h+",80%,60%);}";
    return style;
  }
}

var Div=function(cn,col,row) {
  this.el=document.createElement("div");
  this.el.className=cn;
  this.el.style.gridColumn=col+1;
  this.el.style.gridRow=row+1;
  body.append(this.el);
}

var pointSet=0;
var colorSet=0;
var state=0;

var backP=[8,12,16,20,24][getRandomInt(0,5)];
var layers=[new Layer(backP,"bg1",bg1,"nonzero"), new Layer(2*backP,"bg2",bg2,"evenodd")];

let cols=Math.floor(window.innerWidth/140);
if (cols%2==0) cols++;
let rows=Math.floor(window.innerHeight/140);
let h=window.innerHeight/rows;

body.style.display="grid";
body.style.gridTemplateColumns="repeat("+cols+",1fr)";
body.style.gridTemplateRows="repeat("+rows+","+h+"px)";

for (let i=0; i<cols; i++) {
  for (let j=0; j<rows; j++) {
    new Div("bg1",i,j);
    new Div("bg2",i,j);
  }
}

var inset=[50*Math.random(),50*Math.random()];

const setBodyBackground=()=>{
  let j=(colorSet+1)%2;
  let k=colorSet;
  let h=(bg0[j]+cFrac*(bg0[k]-bg0[j]+360))%360;
  body.style.background="hsl("+h+",60%,30%)";
}

const transitColor=()=>{
  colorSet=++colorSet%2;
  let bhue=getRandomInt(0,360);
  bg0[colorSet]=bhue;
  bg1[colorSet]=bhue=(bhue+getRandomInt(90,150))%360;
  bg2[colorSet]=bhue=(bhue+getRandomInt(90,150))%360;
}

const transitDivs=()=>{
  pointSet=++pointSet%2;
  poly.randomize();
  if (state==1) {
    duration=1000;
    if (inset[pointSet]==0) {
      //let backP=[8,12,16,20,24][getRandomInt(0,5)];
      let backP=4*getRandomInt(2,7);
      layers[0].P=backP;
      layers[1].P=2*backP;
      layers[0].setPoints();
      layers[1].setPoints();
      pointSet=++pointSet%2;
      state=0;
      inset[pointSet]=50+100*Math.random();
    } else {
      inset[pointSet]=0;
    }
  } else {
    duration=8000;
    inset[pointSet]=50+100*Math.random();
    if (Math.random()<0.1) state=1;
  }
  layers[0].setPoints();
  layers[1].setPoints();
}

var time=0;
var frac=0;
var stopped=true;
var duration=8000;
var cTime=0;
var cDuration=40000;
var cFrac=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) { time=ts; }
  let progress=ts-time;
  if (progress<duration) {
    frac=progress/duration;
  } else {
    frac=0;
    time=0;
    transitDivs();
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
 
  document.styleSheets[0].deleteRule(0);
  document.styleSheets[0].deleteRule(0);
//  style+="; background:hsl("+bg1+",80%,70%);}";
  //document.styleSheets[0].insertRule(".bg { clip-path:"+getClip()+";}");  // add bkg color
  document.styleSheets[0].insertRule(layers[0].getStyle());
  document.styleSheets[0].insertRule(layers[1].getStyle());
  //document.styleSheets[0].insertRule(".bg2 {}");
setBodyBackground();
  requestAnimationFrame(animate);
}

const resetTimes=()=>{
  if (frac>0) time=performance.now()-frac*duration;
  else time=0;
  if (cFrac>0) cTime=performance.now()-cFrac*cDuration;
  else cTime=0;
}

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

transitColor();
transitColor();
transitDivs();
transitDivs();

start();
