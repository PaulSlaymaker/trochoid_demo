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
ctx1.rotate(TP/8);
ctx1.lineWidth=2;
ctx1.strokeStyle="#333";

var ctx2=(()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
ctx2.translate(CSIZE,CSIZE);
ctx2.rotate(TP/8);
ctx2.lineWidth=2;
ctx2.strokeStyle="#333";

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
  co.append(ctx2.canvas);
  body.append(co);
  return co;
})();

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.height=D+"px";
  container.style.width=D+"px";
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
  ctx1.canvas.style.width=D+"px";
  ctx1.canvas.style.height=D+"px";
  ctx2.canvas.style.width=D+"px";
  ctx2.canvas.style.height=D+"px";
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var getX=(t)=>{ return R/2*(Math.cos(t)+Math.cos(13*t)); }
var getY=(t)=>{ return R/2*(Math.sin(t)+Math.sin(13*t)); }

const R=CSIZE-20;
const RES=168;

var drawFrame=(width,c)=>{
  ctx.beginPath();
  ctx.moveTo(getX(0),getY(0));
  for (let i=1; i<RES*5; i++) {
    let t=TP/(5*RES)*i;
    ctx.lineTo(getX(t),getY(t));
  }
  ctx.closePath();
  ctx.strokeStyle=c;
  ctx.lineWidth=width;
  ctx.stroke();
}

var BC=100;

var color=(()=>{
  let c=[];
  //for (let i=0; i<BC; i++) c.push("hsla("+getRandomInt(0,360)+",100%,50%,0.3)");
  for (let i=0; i<BC; i++) c.push("hsl("+getRandomInt(0,360)+",100%,50%)");
  return c;
})();

var draw3=()=>{
  ctx1.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx2.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<BC; i++) {
    let q=t+i/BC;
    let ct=((Math.floor(q*RES))%2==0)?ctx2:ctx1;
    let z=TP*q;
    let x=getX(z);
    let y=getY(z);
    let d=Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5)-40;
    let r=Math.max(0,60*Math.sin(TP*(d/R/2))-20);
    ct.beginPath();
    ct.moveTo(x+r,y);
    ct.arc(x,y,r,0,TP);
    ct.fillStyle=color[i];
    ct.fill();
    ct.stroke();
  }
}

var t=0;
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
var animate=(ts)=>{
  if (stopped) return;
  t+=0.0001;
  draw3();
  requestAnimationFrame(animate);
}

onresize();
drawFrame(28,"#66C");
drawFrame(16,"#CC6");
start();
