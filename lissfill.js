"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const canvas=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  body.append(c);
  return c;
})();

const ctx=canvas.getContext('2d');

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var CX=canvas.width/2;
var CY=canvas.height/2;
var RX=Math.min(0.8*canvas.width/2,800);
var RY=Math.min(0.8*canvas.height/2,800);

var setPoints=()=>{
  CX=canvas.width/2;
  CY=canvas.height/2;
  RX=Math.min(0.8*canvas.width/2,800);
  RY=Math.min(0.8*canvas.height/2,800);
}

var Z=1000;
var FX=2*getRandomInt(1,10)+1;
var FXS=7;
var FY=2*getRandomInt(1,10)+1;
var FYS=9;

var FX2,FY2;

var draw=(frac)=>{
  ctx.beginPath();
  ctx.moveTo(CX+RX*Math.sin(0),CY+RY*Math.cos(0));
  let inc=2*Math.PI/Z;
  for (let i=1; i<=Z+1; i++) {
    let z=2*i*Math.PI/Z;
    ctx.lineTo(
      CX+RX*(frac*Math.sin(FX*i*inc)+(1-frac)*Math.sin(FXS*i*inc)),
      CY+RY*(frac*Math.cos(FY*i*inc)+(1-frac)*Math.cos(FYS*i*inc))
    );
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill("evenodd");
}

var drawP=(frac)=>{
  ctx.beginPath();
  ctx.moveTo(
    CX+RX*Math.sin(0),
    CY+RY*Math.cos(0)
  );
  let inc=2*Math.PI/Z;
  for (let i=1; i<=Z+1; i++) {
    let z=2*i*Math.PI/Z;
    ctx.lineTo(
      CX+RX*(frac*Math.sin(FX*i*inc)+(1-frac)*Math.sin(FXS*i*inc)),
      CY+RY*(frac*Math.cos(FY*i*inc)+(1-frac)*Math.cos(FYS*i*inc))
    );
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill("evenodd");
}

onresize=function() { 
  canvas.width=window.innerWidth; 
  canvas.height=window.innerHeight; 
//  ctx.globalCompositeOperation="xor";
  ctx.fillStyle="hsl("+getRandomInt(0,360)+",80%,70%)";
  ctx.strokeStyle="hsl("+getRandomInt(0,360)+",90%,20%)";
  ctx.lineWidth="4";
  cancelAnimationFrame(AF);
  setPoints();
  stopped=true;
  start();
//  draw(1);
}

var XY=true;
var polar=false;
var dir=-1;
var time=0;
var stopped=true;
var frac=1;
var AF=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) { time=ts; }
  let progress=ts-time;
  if (progress<10000) {
    frac=progress/10000;
    ctx.clearRect(0,0,canvas.width,canvas.height);
if (polar) {
    drawP(frac);
} else {
    draw(frac);
}
  } else {
    FXS=FX;
    FYS=FY;
if (polar) {
FX2=FY;
FY2=FX;
} else {
    if (XY) {
      FX+=dir*16;
      if (Math.abs(FX)>30) {
	dir*=-1;
      } else {
	XY=false;
      }
    } else {
      FY+=dir*16;
      if (Math.abs(FY)>30) {
	dir*=-1;
      } else {
	XY=true;
      }
    } 
}
//    FX=(FX==7)?15:7;
//    FY=(FY==11)?17:11;
//    FY=9;
//    FX=2*getRandomInt(1,10)+1;
//    FY=2*getRandomInt(1,10)+1;
//console.log(FXS+" "+FX+" "+FYS+" "+FY);
    time=0;
    frac=0;
  }
  AF=requestAnimationFrame(animate);
}

var stopped=true;
var start=()=>{
  if (stopped) {
    ctx.fillStyle="hsl("+getRandomInt(0,360)+",80%,70%)";
    ctx.strokeStyle="hsl("+getRandomInt(0,360)+",90%,20%)";
    FX=21;
    FXS=5;
    FY=13;
    FYS=13;
    XY=true;
    dir=-1;
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
canvas.addEventListener("click", start, false);

onresize();
