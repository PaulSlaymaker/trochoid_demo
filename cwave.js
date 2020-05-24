"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);

const canvas=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  body.append(c);
  return c;
})();

var ctx=canvas.getContext('2d');

onresize=function() { 
  canvas.width=window.innerWidth; 
  canvas.height=window.innerHeight; 
  ctx.fillStyle="#4444AA";
  setPoints();
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var pts=[];
var R=40;
var O=0;
var P=300;
var F=4;
var Q=5;

var setPoints=()=>{
  pts=[];
  for (let x=-2*R; x<canvas.width+3*R; x+=R) {
    for (let y=-2*R; y<canvas.height+3*R; y+=R) { pts.push([x,y]); }
  }
}

var draw=()=>{
  ctx.beginPath();
  for (let i=0; i<pts.length; i++) {
    let x=pts[i][0];
    let y=pts[i][1];
/*
  if (i%2==0) {
      // Q
      let q=R+R/Q*Math.sin((F*y)/P)+R/Q*Math.sin((F*x-O)/P);
      ctx.moveTo(x+q,y);
      ctx.arc(x,y,q,0,2*Math.PI);
} else {
*/
      //let q=2*R+R*Math.sin((2*y+O)/3000)+R*Math.cos((2*x+O)/3000);
      let q=R+R/Q*Math.sin((F*y)/P)+R/Q*Math.sin((F*x-O)/P);
      ctx.moveTo(x+q,y);
      ctx.arc(x,y,q,0,2*Math.PI);
//}
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill("evenodd");
}

var time=0;
var stopped=true;
var frac=1;
var animate=(ts)=>{
  if (stopped) return;
    O+=7;
    R=36-12*Math.cos(O/800);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw();
/*
  if (!time) { time=ts; }
  let progress=ts-time;
  if (progress<10) {
    frac=progress/duration;
  } else {
    O+=12;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw(frac,0);
    time=0;
    frac=0;
  }
*/
  requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    ctx.fillStyle="hsl("+getRandomInt(0,360)+",70%,30%)";
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
canvas.addEventListener("click", start, false);

onresize();
start();
