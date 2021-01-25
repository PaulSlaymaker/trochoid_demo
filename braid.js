"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const CSIZE=600;

const ctx=(()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  c.style.cursor="pointer";
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="0 auto";
  co.append(ctx.canvas);
  body.append(co);
  return co;
})();

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.width=D+"px";
  container.style.height=D+"px";
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

var R=1.8*CSIZE;
var W=getRandomInt(2,10);
var CYC=12*getRandomInt(7+W,22);
var LW=TP*R/CYC/3;
ctx.lineWidth=LW;
var F=0.1+getRandomInt(0,10)/100;
var WID=getRandomInt(10,21+Math.round(150*F));
var z=0;

var getX=(r,t,q,f)=>{ 
  return r*(Math.cos(t)*(1+F*Math.cos(W*t+q))); 
}
var getY=(r,t,q)=>{ 
  return r*(Math.sin(t)*(1+F*Math.cos(W*t+q))); 
}
//var getZ=(t,q)=>{ return Math.cos(W*t+q); }
var getZ=(t,q)=>{ return Math.sin(2*W*t+q); }

var points1=[];
var points2=[];
var points3=[];
var colors=[];

var randomizeColors=()=>{
  colors=[];
  let hue=getRandomInt(0,360);
  for (let i=0; i<6; i++) {
    hue+=getRandomInt(100,140)%360;
    colors.push("hsl("+hue+",100%,47%)");
    colors.push("hsl("+(hue+30)+",100%,47%)");
  }
};

var setPoints=()=>{
  points1=[];
  points2=[];
  points3=[];
  for (let i=0; i<CYC; i++) {
    let t=TP*i/CYC+z;
    points1[i]={
      "x1":getX(R/3,t,0),
      "y1":getY(R/3,t,0),
      "x2":getX(R/3+WID,t,0),
      "y2":getY(R/3+WID,t,0),
      "z":getZ(t,TP/2)
    };
    points2[i]={
      "x1":getX(R/3,t,TP/3),
      "y1":getY(R/3,t,TP/3),
      "x2":getX(R/3+WID,t,TP/3),
      "y2":getY(R/3+WID,t,TP/3),
      "z":getZ(t,TP/6)
    };
    points3[i]={
      "x1":getX(R/3,t,-TP/3),
      "y1":getY(R/3,t,-TP/3),
      "x2":getX(R/3+WID,t,-TP/3),
      "y2":getY(R/3+WID,t,-TP/3),
      "z":getZ(t,5*TP/6)
    };
  }
points1.col=[colors[0],colors[1]];
points2.col=[colors[2],colors[3]];
points3.col=[colors[4],colors[5]];
/*
points1.col=["red","yellow"];
points2.col=["green","orange"];
points3.col=["silver","blue"];
*/
}

var drawLine=(pts,idx)=>{
  ctx.beginPath();
  ctx.moveTo(pts[idx].x1,pts[idx].y1);
  ctx.lineTo(pts[idx].x2,pts[idx].y2);
  ctx.strokeStyle=pts.col[idx%2];
  ctx.stroke();
}

var drawPoints=()=>{
  let pts=[points1,points2,points3];
  for (let i=0; i<points1.length; i++) {
    pts.sort((a,b)=>{ return a[i].z-b[i].z; });
    for (let j=0; j<3; j++) drawLine(pts[j],i);
  }
}

var draw=()=>{
  setPoints();
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  drawPoints();
}

var inc=0.02/W*(2*getRandomInt(0,2)-1);

var randomize=()=>{
  randomizeColors();
  W=getRandomInt(2,10);
  inc=0.02/W*(2*getRandomInt(0,2)-1);
  CYC=12*getRandomInt(7+W,22);
  ctx.lineWidth=TP*R/CYC/3;
  F=0.1+getRandomInt(0,10)/100;
  WID=getRandomInt(10,21+Math.round(150*F));
  o=0;
}

var t=0;
var stopped=true;
var start=()=>{
  if (stopped) {
    stopped=false;
    randomize();
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("dblclick", start, false);
ctx.canvas.addEventListener("click", randomize, false);

var S=0;
var o=0;
var opacity=1;
var animate=(ts)=>{
  if (stopped) return;
  o++;
  z+=inc;
  if (o==1000) {
    S=1;
  } else if (S==1) {
    opacity-=0.02;
    if (opacity<0) {
      opacity=0;
      randomize();
      S=2;
    }
    ctx.canvas.style.opacity=opacity;
  } else if (S==2) {
    opacity+=0.02;
    if (opacity>1) { opacity=1; S=0; }
    ctx.canvas.style.opacity=opacity;
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();
start();
