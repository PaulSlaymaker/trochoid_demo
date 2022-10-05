"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/xxjENpx
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;

var createContext=()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  let context=c.getContext("2d");
  context.setTransform(1,0,0,1,CSIZE,CSIZE);
  return context;
}
const ctx=createContext();
const ctx2=createContext();
var mgradient=ctx.createRadialGradient(0,0,3/4*CSIZE,0,0,CSIZE);
mgradient.addColorStop(0,"#00000000");
mgradient.addColorStop(1,"#000000");
ctx2.fillStyle=mgradient;
ctx2.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="auto";
  co.append(ctx.canvas);
  co.append(ctx2.canvas);
  body.append(co);
  return co;
})();

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40+"px"; 
  container.style.width=container.style.height=D;
  ctx.canvas.style.width=ctx.canvas.style.height=D;
  ctx2.canvas.style.width=ctx2.canvas.style.height=D;
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var hues=[];
var colors=[];
var setHues=()=>{
//  let c=[];
  let colorCount=6;
  let hue=getRandomInt(210,300);
//console.log(hue);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(180/colorCount)*i+getRandomInt(-6,6);
let h=(hue+hd)%360;
hues.splice(getRandomInt(0,hues.length+1),0,h);
//    c.splice(getRandomInt(0,c.length+1),0,"hsl("+h+","+sat+"%,"+lum+"%)");
  }
//  return c;
}
setHues();

for (let i=0; i<hues.length; i++) colors[i]="hsl("+hues[i]+",90%,50%)";
var colorsa=[colors[0],colors[1],colors[2]];
//var colorsa=["white","green","gray"];
var colorsb=[colors[3],colors[4],colors[5]];

const rt1=TP*Math.random();
const rt2=TP*Math.random();
const rt3=TP*Math.random();
let rt4=TP*Math.random();
let rt5=TP*Math.random();
let rt6=TP*Math.random();

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
container.addEventListener("click", start, false);

var stopped=true;
var t=0;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t%20==0) for (let i=0; i<hues.length; i++) {
    hues[i]=++hues[i]%360;
    if (i<3) colorsa[i]="hsl("+hues[i]+",90%,50%)";
    else colorsb[i-3]="hsl("+hues[i]+",90%,50%)";
//    colors[i]="hsl("+hues[i]+",90%,50%)";
  }
  if (t%(dspeed/4)==0) {
    if (t%(dspeed/2)==0) {
      let savec=colorsb[2];
      colorsb[2]=colorsb[1];
      colorsb[1]=savec;
      savec=colorsa[2];
      colorsa[2]=colorsa[0];
      colorsa[0]=savec;
    } else {
      let savec=colorsa[2];
      colorsa[2]=colorsa[1];
      colorsa[1]=savec;
      savec=colorsb[2];
      colorsb[2]=colorsb[0];
      colorsb[0]=savec;
    }
//      stopped=true;
  }
if (EM && t%200==0) stopped=true;
  draw();
  requestAnimationFrame(animate);
}

const dm0=new DOMMatrix([0.5,0,0,0.5,200,200]);
const dm1=new DOMMatrix([0.5,0,0,-0.5,-200,200]);
const dm2=new DOMMatrix([-0.5,0,0,-0.5,-200,-200]);
const dm3=new DOMMatrix([-0.5,0,0,0.5,200,-200]);
var getSymPath=(p)=>{
  let sympath=new Path2D();
  sympath.addPath(p,dm0);
  sympath.addPath(p,dm1);
  sympath.addPath(p,dm2);
  sympath.addPath(p,dm3);
  return sympath;
}

//let R=240;	// for 20 
//let R=320;	// for 16 
const R=360;	// for 8, 12
//const R=400;	// for 8
ctx.lineWidth=8;
ctx.fillStyle="#00000008";
var speed=600;
var dspeed=800;
var draw=()=>{
  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let R2=R*Math.pow(Math.sin(TP*t/dspeed),2);
  let R3=R*Math.pow(Math.sin(TP*t/dspeed+TP/4),2);
  let rf1=0.9*Math.sin(t/1400+rt1);
  let rf2=0.9*Math.sin(t/1410+rt2);
  let rf3=0.9*Math.sin(t/1420+rt3);
  let rf4=0.9*Math.sin(t/1400+rt4);
  let rf5=0.9*Math.sin(t/1410+rt5);
  let rf6=0.9*Math.sin(t/1410+rt6);
  let p=new Path2D();
  let pb=new Path2D();
  let p2=new Path2D();
  let pb2=new Path2D();
  let paths=[p,p2];
  let pathsb=[pb,pb2];
  for (let i=0; i<12; i++) {
    let z=i*TP/12+t/speed;
    let x1=1.3*CSIZE*(rf1*Math.cos(z)+rf2*Math.cos(3*z)+rf3*Math.cos(5*z));
    let y1=1.3*CSIZE*(rf4*Math.sin(z)-rf5*Math.sin(3*z)+rf6*Math.sin(5*z));
    let x2=x1+R*Math.cos(z);
    let y2=y1+R*Math.sin(z);

    let r=(i%2)?R3:R2;
    let x3=x1+Math.max(0,r-40)*Math.cos(z);
    let y3=y1+Math.max(0,r-40)*Math.sin(z);
    let x4=x1+r*Math.cos(z);
    let y4=y1+r*Math.sin(z);
    paths[i%2].moveTo(x1,y1);
    paths[i%2].lineTo(x3,y3);
    pathsb[i%2].moveTo(x4,y4);
    pathsb[i%2].lineTo(x2,y2);
  }
  ctx.strokeStyle=colorsa[0];
  ctx.stroke(getSymPath(p));
  ctx.strokeStyle=colorsb[0];
  ctx.stroke(getSymPath(p2));

  ctx.strokeStyle=colorsa[1];
  ctx.stroke(getSymPath(pb));
  ctx.strokeStyle=colorsb[1];
  ctx.stroke(getSymPath(pb2));
}

onresize();

//draw();
start();
