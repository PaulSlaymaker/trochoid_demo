"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/WNzzBVw
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
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
function animate(ts) {
  if (stopped) return;
  t++;
  if (t>503) { 
    facx=facx2;
    facx2=4-8*Math.random();
    facy=facy2;
    facy2=4-8*Math.random();
    t=0; 
  }
  frac=t/503;
  if (t%10==0) hue++;
  setSquares();
if (EM && t%200==0) stopped=true;
  draw();
  requestAnimationFrame(animate);
}

var COUNT=12;
var xa=new Array(COUNT);
var ya=new Array(COUNT);
const EDGE=CSIZE-(CSIZE/COUNT);
//xa[0]=-EDGE;
//xa[COUNT-1]=EDGE;

//var factor=new Array(COUNT-2);
var facx=4-8*Math.random();
var facy=4-8*Math.random();
var facx2=4-8*Math.random();
var facy2=4-8*Math.random();
/*
var setFactors=()=>{
  for (let i=1; i<COUNT-1; i++) {
    //factor[i-1]=Math.round(COUNT/2)-Math.abs(-Math.round(COUNT/2)+i);
    //factor[i-1]=COUNT/2-Math.abs(Math.round(COUNT/2-i));
    //factor[i-1]=Math.round(COUNT/2)-Math.abs(Math.round(COUNT/2)-i-1);
    //factor[i-1]=Math.round(COUNT/2)-i-1;
    //factor[i-1]=getRandomInt(2,20);
    //factor[i-1]=getRandomInt(2,8);
    factor[i-1]=Math.random()*TP/4;
  }
}
setFactors();
*/

const seg=Math.round(EDGE/(COUNT-1));
var setSquares=()=>{
  let s=8;
  xa[0]=-seg/2-s/2*Math.sin(((1-frac)*facx+frac*facx2));
  ya[0]=-seg/2-s/2*Math.sin(((1-frac)*facy+frac*facy2));
  //xa[1]=seg/2;//+s/2*Math.cos(t/40);
  xa[1]=seg/2+s/2*Math.sin(((1-frac)*facx+frac*facx2));
  ya[1]=seg/2+s/2*Math.sin(((1-frac)*facy+frac*facy2));
  for (let i=2; i<COUNT; i++) {
    //xa[i]=xa[i-1]+EDGE/(COUNT-1);
    //ya[i]=ya[i-1]+EDGE/COUNT;
//    let ss=(i==0)?seg/2:seg;
    //xa[i]=xa[i-1]+seg+8*Math.cos(t/40+factor[i-1]*((1-frac)*facy+frac*facy2));
    //ya[i]=ya[i-1]+seg+8*Math.sin(t/40+factor[i-1]*((1-frac)*facy+frac*facy2));
    xa[i]=xa[i-1]+seg+s*Math.sin(+i*((1-frac)*facx+frac*facx2));
    ya[i]=ya[i-1]+seg+s*Math.sin(+i*((1-frac)*facy+frac*facy2));
  }
}

ctx.lineWidth=3;
var hue=getRandomInt(0,360);

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<COUNT-1; i++) {
    let x=(xa[i]+xa[i+1])/2;
    let xr=Math.abs((xa[i]-xa[i+1])/2);
    for (let j=0; j<COUNT-1; j++) {
      let p=new Path2D();
      let y=(ya[j]+ya[j+1])/2;
      let yr=Math.abs((ya[j]-ya[j+1])/2);
      ctx.beginPath();
      p.rect(x-xr,y-yr,2*xr,2*yr);
      if (i==0) {
        if (j!=0) {
          p.addPath(p,new DOMMatrix([1,0,0,-1,0,0]));
        }
      } else {
        if (j>0) {
          p.addPath(p,new DOMMatrix([1,0,0,-1,0,0]));
          p.addPath(p,new DOMMatrix([-1,0,0,1,0,0]));
        } else {
          p.addPath(p,new DOMMatrix([-1,0,0,1,0,0]));
        }
      }
      let h=(Math.round(20*Math.pow(xr*yr,0.5))+hue)%360;
      ctx.fillStyle="hsl("+h+",100%,50%)";
      ctx.fill(p);
      ctx.stroke(p);
    }
  }
}

onresize();

setSquares();

start();
