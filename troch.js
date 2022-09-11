"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const CSIZE=400;

var createContext=()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
c.style.outline="1px dotted gray";
  let context=c.getContext("2d");
  context.translate(CSIZE,CSIZE);
  return context;
}
const ctx=createContext();
const ctx2=createContext();
var mgradient=ctx.createRadialGradient(0,0,300,0,0,400);
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
  let colorCount=4;
  let hue=getRandomInt(180,270);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(120/colorCount)*i+getRandomInt(-10,10);
//    let sat=70+getRandomInt(0,31);
//    let lum=50+getRandomInt(0,11);
let h=(hue+hd)%360;
hues.splice(getRandomInt(0,hues.length+1),0,h);
//    c.splice(getRandomInt(0,c.length+1),0,"hsl("+h+","+sat+"%,"+lum+"%)");
  }
//  return c;
}
setHues();
for (let i=0; i<hues.length; i++) colors[i]="hsl("+hues[i]+",86%,50%)";

/*
var R1=CSIZE/4;
ctx.moveTo(CSIZE-R1+R1,CSIZE-R1);
ctx.arc(CSIZE-R1,CSIZE-R1,R1,0,TP/4);
ctx.arc(3*CSIZE/4,0,CSIZE,TP/4,3*TP/4);
ctx.arc(3*CSIZE/4,-3*CSIZE/4,CSIZE/4,3*TP/4,0);
ctx.arc(0,-3*CSIZE/4,CSIZE,0,TP/2);
ctx.arc(-CSIZE+R1,-CSIZE+R1,R1,TP/2,3*TP/4);
ctx.arc(-CSIZE+R1,0,CSIZE,3*TP/4,TP/4);
ctx.arc(-CSIZE+R1,CSIZE-R1,R1,TP/4,TP/2);
ctx.arc(0,CSIZE-R1,CSIZE,TP/2,0);
ctx.stroke();
*/

let radii=[12,13,14,15,16];
let counts=[160,144,128,120,112];
let ri=getRandomInt(0,5);
let R=radii[ri];
let COUNT=counts[ri];
//var R=12;
//var COUNT=144;
let rt1=TP*Math.random();
let rt2=TP*Math.random();
let rt3=TP*Math.random();
let rt4=TP*Math.random();

var draw=()=>{
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//ctx.stroke(path);
//rf=0.35+0.4*Math.sin(t/200);
//rf=(1+Math.sin(t/100))/2;
//rf=0.5+0.35*Math.sin(t/100);
//let rf1=0.5+0.35*Math.sin(t/(100+rt1));
//let rf2=0.5+0.35*Math.sin(t/(100+rt2));
//let rf3=0.5+0.35*Math.sin(t/(100+rt3));
let rf1=0.8*Math.sin(t/140+rt1);
let rf2=0.8*Math.sin(t/150+rt2);
let rf3=0.8*Math.sin(t/160+rt3);
let rf4=0.8*Math.sin(t/170+rt4);
  let pathb=new Path2D();
  let path1=new Path2D();
  let path2=new Path2D();
  let path3=new Path2D();
  let path4=new Path2D();
  for (let i=0; i<COUNT; i++) {
    let z=i*TP/COUNT;//+t/1000;
    //let z=i*TP/32; if (i%2) z+=t/200; else z-=t/200;
if (i%2) z=-i*TP/COUNT;
    let x=0.5*CSIZE*(rf1*Math.cos(z)+(rf2)*Math.cos(3*z)+(rf3)*Math.cos(5*z)+(rf4)*Math.cos(7*z));
    let y=0.5*CSIZE*(rf1*Math.sin(z)-(rf2)*Math.sin(3*z)+(rf3)*Math.sin(5*z)-(rf4)*Math.sin(7*z));
    //let x=0.6*CSIZE*(rf*Math.cos(z)+(1-rf)*Math.cos(5*z));
    //let y=0.6*CSIZE*(-rf*Math.sin(z)+(1-rf)*Math.sin(5*z));
    if (i%8==0) {
      path1.moveTo(x+R,y);
      path1.arc(x,y,R,0,TP);
    } else if (i%8==2) {
      path2.moveTo(x+R,y);
      path2.arc(x,y,R,0,TP);
    } else if (i%8==4) {
      path3.moveTo(x+R,y);
      path3.arc(x,y,R,0,TP);
    } else if (i%8==6) {
      path4.moveTo(x+R,y);
      path4.arc(x,y,R,0,TP);
    } else {
      pathb.moveTo(x+1.2*R,y);
      pathb.arc(x,y,1.2*R,0,TP);
    }
  }
  //ctx.fillStyle="black";
  ctx.fillStyle=colors[0];
  ctx.fill(path1);
  ctx.fillStyle=colors[1];
  ctx.fill(path2);
  ctx.fillStyle=colors[2];
  ctx.fill(path3);
  ctx.fillStyle=colors[3];
  ctx.fill(path4);
  ctx.fillStyle="#00000024";
  ctx.fill(pathb);
}

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
//ctx.canvas.addEventListener("click", start, false);
container.addEventListener("click", start, false);

var stopped=true;
var t=0;
//var duration=1600;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t%10==0) for (let i=0; i<hues.length; i++) {
    hues[i]=++hues[i]%360;
    colors[i]="hsl("+hues[i]+",86%,50%)";
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();

//draw();
start();
