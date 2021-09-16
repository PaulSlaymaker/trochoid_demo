"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const CSIZE=600;

var ctx1=(()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
ctx1.translate(CSIZE,CSIZE);

var ctx=(()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="0 auto";
  co.append(ctx1.canvas);
  co.append(ctx.canvas);
  body.append(co);
  return co;
})();

var Dx=CSIZE;
var Dy=CSIZE;
onresize=function() {
  Dx=window.innerWidth-20;
  Dy=window.innerHeight-20;
  container.style.width=Dx+"px";
  container.style.height=Dy+"px";
  ctx.canvas.width=Dx;
  ctx.canvas.height=Dy;
  ctx1.canvas.width=Dx;
  ctx1.canvas.height=Dy;
  ctx.translate(Dx/2,Dy/2);
  ctx1.translate(Dx/2,Dy/2);
  R=Math.min(Dx,Dy)/8;
  setPoints();
  WO=16*R/75;
  WI=11*WO/16;
  ER1=R/25;
  ER2=4*ER1;
  OVLAP=R/4000;
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

ctx.lineWidth=20;
ctx.strokeStyle="white";
ctx1.lineWidth=20;
ctx1.strokeStyle="white";
ctx.fillStyle="#111";
ctx1.fillStyle="#111";

var R=CSIZE/4;
var CYC=60;
var WO=32;
var WI=22;
var ER1=6;
var ER2=24;
var OVLAP=0.02;

var getX=(t)=>{ return R*Math.cos(t); }
var getY=(t)=>{ return R*Math.sin(t); }

var points=[];
var colors=[];
var colors2=[];
var fillColors=[];
var cycz=[];
var setPoints=()=>{
  points=[];
  colors=[];
  colors2=[];
  fillColors=[];
  cycz=[];
  let countx=Math.floor(Dx/R/2)-1;
  let county=Math.floor(Dy/R/2)-1;

  for (let y=-(county-0.3)*R, hue=getRandomInt(0,360); y<county*R; y+=7/4*R) {
    for (let x=-(countx-0.3)*R; x<countx*R; x+=7/4*R, hue+=50) {
      points.push({"x":x,"y":y});
      let h=(hue+=getRandomInt(60,120))%360;
      colors.push("hsl("+h+",100%,55%)");
      colors2.push("hsl("+h+",80%,30%)");
      fillColors.push("hsl("+h+",100%,15%)");
      cycz.push(getRandomInt(0,CYC));
    }
  }
}

var ctxs=[ctx,ctx1];

var draw=(ci)=>{
  let x=points[ci].x;
  let y=points[ci].y;
  let z=(cycz[ci]+t)%CYC;
  ctx.fillStyle=fillColors[ci];
  ctx1.fillStyle=fillColors[ci];
  for (let i=0; i<4; i++) {
    let t=i*TP/4-OVLAP;
    let ct=(i%2==0)?ctx:ctx1;
    let s=i%2;
    ctx.strokeStyle=colors2[ci];
    ctx1.strokeStyle=colors2[ci];
    ctx.lineWidth=WO;
    ctx1.lineWidth=WO;
    ctxs[s].beginPath();
    ctxs[s].moveTo(x+getX(t),y+getY(t));
    ctxs[s].arc(x,y,R,t,t+TP/4+OVLAP);
    ctxs[s].stroke();
    ctx.strokeStyle=colors[ci];
    ctx1.strokeStyle=colors[ci];
    ctx.lineWidth=WI;
    ctx1.lineWidth=WI;
    ctxs[s].beginPath();
    ctxs[s].moveTo(x+getX(t),y+getY(t));
    ctxs[s].arc(x,y,R,t,t+TP/4+OVLAP);
    ctxs[s].stroke();
    ctxs[s].beginPath();
    for (let j=0; j<4; j++) {
      let a=(z/CYC+4*i+j)/16*TP;
      let xx=x+getX(a);
      let yy=y+getY(a);
      ctxs[s].moveTo(xx+3,y+yy);
//      ctxs[s].arc(xx,yy,Math.abs(6*Math.sin(2*a)),0,TP);
      let r1=Math.abs(ER1*Math.sin(2*a))+2;
      let r2=Math.abs(ER2*Math.sin(2*a));
      ctxs[s].ellipse(xx,yy,r1,r2,a,0,TP);
    }
    ct.fill();
  }
}

var t=0;
var stopped=true;
var start=()=>{
  if (stopped) {
    stopped=false;
    setPoints();
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var animate=(ts)=>{
  if (stopped) return;
  t++;
  for (let i=0; i<points.length; i++) draw(i);
  requestAnimationFrame(animate);
}

onresize();
start();
