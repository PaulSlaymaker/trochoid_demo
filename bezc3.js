"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineJoin="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const syma=(()=>{
  let ua=[];
  for (let i=0; i<12; i++) {
    let z=i*TP/12;
    ua.push(new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),0,0]));
  }
  return ua;
})();

var hue1=getRandomInt(0,31);
var hue2=120+getRandomInt(0,30);
var hue3=240+getRandomInt(0,30);

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var t=0;
const duration=2000;
var m=-1;
var animate=(ts)=>{
  if (stopped) return;
  if (Math.abs(time[0]-time[1])>2400) m*=-1;
  for (let i=0; i<pointCount; i++) {
    //time[i]+=1+Math.pow(i,0.5)/20;
    time[i]=time[i]+m*(Math.pow(i,0.3));
    let angle=TP/ds*Math.sin(time[i]*TP/duration);
    fx[i]=Math.cos(angle);
    fy[i]=Math.sin(angle);
  }
    hue1=(hue1+0.4)%360;
    hue2=(hue2-359.6)%360;
    hue3=(hue3+0.4)%360;
  draw();
  requestAnimationFrame(animate);
}

ctx.lineWidth=3;
ctx.fillStyle="#00000007";
var draw=()=>{
  let mpa=generatePath();
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let path=new Path2D();
  let path2=new Path2D();
  let path3=new Path2D();
  for (let s=0; s<syma.length; s++) {
    if (s%2) {
      path3.addPath(mpa[0],syma[s]);
    } else {
      path.addPath(mpa[0],syma[s]);
    }
    path2.addPath(mpa[1],syma[s]);
  }
  ctx.strokeStyle="hsl("+hue1+",90%,50%)";
  ctx.stroke(path);
  ctx.strokeStyle="hsl("+hue2+",90%,50%)";
  ctx.stroke(path2);
  ctx.strokeStyle="hsl("+hue3+",90%,50%)";
  ctx.stroke(path3);
}

var pointCount=100;

var rad=390/(pointCount-1);
var ds=6;	// number of arcs for TP

var fx=new Array(pointCount).fill(1);
var fy=new Array(pointCount).fill(0);
var time=new Array(pointCount).fill(0);

/*
for (let i=0; i<pointCount; i++) {
  let a=0;
  fx[i]=Math.cos(a);
  fy[i]=Math.sin(a);
}
*/

var generatePath=()=>{
  let pa=[new Path2D(),new Path2D()];
  for (let i=0; i<pointCount-1; i++) {
    let pi=(i%20)<10?0:1;
    pa[pi].moveTo(fx[i]*i*rad,fy[i]*i*rad);
    pa[pi].lineTo(fx[i+1]*(i+1)*rad,fy[i+1]*(i+1)*rad);
  }
  return pa;
}

onresize();
start();
