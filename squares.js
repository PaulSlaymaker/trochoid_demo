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
  cancelAnimationFrame(AF);
  stopped=true;
  start();
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var pts=[];
var R=100;
var K=80;
var O=0;
var S=2;
var D=1;

var setPoints=()=>{
let ctr=0;
  do {
  R=80+80*Math.random();
  pts=[];
  for (let x=-2*R; x<canvas.width+3*R; x+=R) {
    for (let y=-2*R; y<canvas.height+3*R; y+=R) { pts.push([x,y]); }
  }
  } while (pts.length%2==0);
}

var draw=()=>{
  ctx.beginPath();
  for (let i=0; i<pts.length; i++) {
    let x=pts[i][0];
    let y=pts[i][1];
    let q=(i%2==0)?-1:1;
    for (let k=0; k<2; k++) {
      let rp=(k%2==0)?D:1;
      ctx.moveTo(x+rp*K*Math.sin(0+q*O),y+rp*K*Math.cos(0+q*O));
      for (let j=0; j<=4; j++) {
	ctx.lineTo(
	  x+rp*K*Math.sin(j*Math.PI/2+q*O),
	  y+rp*K*Math.cos(j*Math.PI/2+q*O)
	);
      }
    }
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill("evenodd");
}

var time=0;
var stopped=true;
var frac=1;
var AF=0;
var animate=(ts)=>{
  if (stopped) return;
    O+=0.002;
    //K=R-R/1.5*Math.cos(O);
    K=R-S*R*Math.cos(O);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw(frac,0);
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
  AF=requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    ctx.fillStyle="hsl("+getRandomInt(0,360)+",70%,30%)";
    O=0;
    setPoints();
    D=0.5+0.4*Math.random();
    S=0.5+Math.random()/4;
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
canvas.addEventListener("click", start, false);

onresize();
