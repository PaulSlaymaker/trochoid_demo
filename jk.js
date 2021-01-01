"use strict"; // Paul Slaymaker, paul25882@gmail.com
//Inspired by https://codepen.io/DonKarlssonSan/pen/yLazNwQ
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;

const CSIZE=400;

var ctx=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  let co=document.createElement("div");
  co.style.textAlign="center";
  co.style.display="block";
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
  //ctx.canvas.style.width=window.innerWidth-40+"px";
  //ctx.canvas.style.height=window.innerHeight-40+"px";
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var cuFrac=(frac)=>{
  let f1=.2;
  let f2=.8;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var curve={
  ff:1,
  randomize:()=>{ 
    curve.ff=0.5+(0.25-0.5*Math.random());
  },
  getX:(t)=>{ 
    return curve.ff*Math.cos(t)+(1-curve.ff)*Math.cos(7*t);
  },
  getY:(t)=>{ 
    return curve.ff*Math.sin(t)+(1-curve.ff)*Math.sin(7*t);
  }
};

var s=0;
var ps=0;
var pts=[];
var setCurve=()=>{
  pts[ps]=[];
  curve.randomize();
  for (let t=0; t<Math.PI*2-0.001; t+=TP/Z) {
    let x=CSIZE*curve.getX(t+s);
    let y=CSIZE*curve.getY(t+s);
    pts[ps].push({"x":x,"y":y});
  }
s+=0.1;
}

var minr=20*getRandomInt(4,7); //100;
var points=[];
var tris=[];
var setPoints=(frac)=>{
  points=[];
  tris=[];
  let f=cuFrac(frac);
  let j=(ps+1)%2;
  let k=ps;
  for (let i=0; i<pts[j].length; i++) {
    let x=(1-f)*pts[j][i].x+f*pts[k][i].x;
    let y=(1-f)*pts[j][i].y+f*pts[k][i].y;
//    let r=Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5);
    points[i]={"x":x,"y":y};
  }
  for (let j=0; j<points.length; j++) {
    for (let k=j+1; k<points.length; k++) {
      for (let l=k+1; l<points.length; l++) {
/*
    for (let k=0; k<points.length; k++) {
      for (let l=0; l<points.length; l++) {
if (j==k) continue;
if (k==l) continue;
if (j==l) continue;
*/
	let r1=Math.pow(Math.pow(points[j].x,2)+Math.pow(points[j].y,2),0.5);
	let r2=Math.pow(Math.pow(points[k].x,2)+Math.pow(points[k].y,2),0.5);
	let r3=Math.pow(Math.pow(points[l].x,2)+Math.pow(points[l].y,2),0.5);
	let r=(r1+r2+r3)/3;
	if (r<minr) continue;
	let d1=Math.pow(Math.pow(points[j].x-points[k].x,2)+Math.pow(points[j].y-points[k].y,2),0.5);
	let d2=Math.pow(Math.pow(points[j].x-points[l].x,2)+Math.pow(points[j].y-points[l].y,2),0.5);
	let d3=Math.pow(Math.pow(points[k].x-points[l].x,2)+Math.pow(points[k].y-points[l].y,2),0.5);
	let d=(d1+d2+d3)/3;
	if (d>D1) continue;
	if (d<D2) continue;
	let or=Math.min(1,(r-60)/60);
	let od=1-Math.abs(d-(D1+D2)/2)/((D1-D2)/2);
	od=Math.pow(Math.min(od,or),5);
	tris.push({"i":j,"j":k,"k":l,"d":d,"od":od,"r":r});
      }
    }
  }
}

var draw=(frac)=>{
  setPoints(frac);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//let ddiff=D1-D2;
  for (let i=0; i<tris.length; i++) {
    ctx.beginPath();
    ctx.moveTo(points[tris[i].i].x,points[tris[i].i].y);
    ctx.lineTo(points[tris[i].j].x,points[tris[i].j].y);
    ctx.lineTo(points[tris[i].k].x,points[tris[i].k].y);
//let q=(ddiff/2-Math.abs(tris[i].d-(D1+D2)/2))/(ddiff/2);
    ctx.strokeStyle="hsla("+(360*(tris[i].r-minr)/CSIZE)+",100%,70%,"+tris[i].od+")";
    //ctx.strokeStyle="hsl("+(hue+360*tris[i].d/(ddiff))+",80%,70%)";
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle="hsla("+(360*(tris[i].r-minr)/CSIZE)+",100%,50%,"+tris[i].od/2+")";
    ctx.fill();
  }
}

var transit=()=>{
  ps=++ps%2;
  setCurve();
}

var stopped=true;
var start=()=>{
  if (stopped) {
    stopped=false;
    if (frac>0) stx=performance.now()-frac*duration;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var stx=0;
var frac=0;
var duration=24000;
//var duration=12000;
//var duration=6000;
var animate=(ts)=>{
  if (stopped) return;
  if (!stx) {
    stx=ts;
  }
  let progress=ts-stx;
  if (progress<duration) {
    frac=progress/duration;
    draw(frac);
  } else {
    draw(1);
    stx=0;
    frac=0;
    transit();
  }
  requestAnimationFrame(animate);
}

var D1=120;
var D2=100;
var Z=6*getRandomInt(13,18);
//var Z=48;
//var D1=100;
//var D2=80;
//var Z=60;

onresize();
transit();
transit();
//draw(1);
start();
