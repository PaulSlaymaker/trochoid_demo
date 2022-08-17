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
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
var t=0;
var frac=0;
// 1005
function animate(ts) {
  if (stopped) return;
  t++;
  if (t>1257) { 
    facx=facx2;
    facx2=4-8*Math.random();
    facy=facy2;
    facy2=4-8*Math.random();
    t=0; 
  }
  frac=t/1257;
  if (t%10==0) hue++;
  setEllipses();
  draw();
  requestAnimationFrame(animate);
}

var COUNT=18;
var xa=new Array(COUNT);
var ya=new Array(COUNT);
// permanent edge
const EDGE=Math.round(CSIZE+CSIZE/COUNT);
console.log(EDGE);
xa[0]=-EDGE;
xa[COUNT-1]=EDGE;
ya[0]=-EDGE;
ya[COUNT-1]=EDGE;
var baseC=new Array(COUNT-2);

var factor=new Array(COUNT-2);
var facx=4-8*Math.random();
var facy=4-8*Math.random();
var facx2=4-8*Math.random();
var facy2=4-8*Math.random();
var setFactors=()=>{
  for (let i=1; i<COUNT-1; i++) {
    //factor[i-1]=Math.round(COUNT/2)-Math.abs(-Math.round(COUNT/2)+i);
    //factor[i-1]=COUNT/2-Math.abs(Math.round(COUNT/2-i));
    //factor[i-1]=Math.round(COUNT/2)-Math.abs(Math.round(COUNT/2)-i-1);
    factor[i-1]=Math.round(COUNT/2)-i-1;
    //factor[i-1]=getRandomInt(2,20);
    baseC[i-1]=-EDGE+i*2*EDGE/(COUNT-1);
  }
}
setFactors();

var setEllipses=()=>{
  for (let i=1; i<COUNT-1; i++) {
//let f=i;
//let f=COUNT-i;
//let s=16*Math.sin(TP*t/2000);
    //xa[i]=-EDGE+i*2*EDGE/(COUNT-1)+s*Math.sin(t/40+f*((1-frac)*facx+frac*facx2));
    xa[i]=baseC[i-1]+12*Math.sin(t/40+factor[i-1]*((1-frac)*facx+frac*facx2));
    //ya[i]=-CSIZE+i*2*CSIZE/(ya.length-1)+s*Math.sin(f*t/40+facy*i);
    ya[i]=baseC[i-1]+12*Math.sin(t/40+factor[i-1]*((1-frac)*facy+frac*facy2));
  }
}

ctx.lineWidth=12;
var hue=0;

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=1; i<COUNT-2; i++) {
    let x=(xa[i]+xa[i+1])/2;
    let xr=Math.abs((xa[i]-xa[i+1])/2);
    for (let j=1; j<COUNT-2; j++) {
      let y=(ya[j]+ya[j+1])/2;
      let yr=Math.abs((ya[j]-ya[j+1])/2);
      ctx.beginPath();
      ctx.moveTo(x+xr,y);
      ctx.ellipse(x,y,xr-6,yr-6,0,TP,0);
      let h=(Math.round(9*Math.pow(xr*yr,0.5))+hue)%360;
      ctx.strokeStyle="hsl("+h+",100%,50%)";
      ctx.stroke();
    }
  }
}

onresize();

setEllipses();

start();
