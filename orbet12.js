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
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
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
var S=2;
var s=0;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t<dur) draw();
  if (t==dur && ++s<S) {
    reset();
    t=0;
//if (EM) stopped=true;
  }
/*
  if (t>dur+240) {
    ctx.canvas.style.opacity=1-(t-dur-240)/60;
  } 
  if (t>dur+300) {
*/
  if (t>dur+440) {
    ctx.canvas.style.opacity=1-(t-dur-440)/60;
  } 
  if (t>dur+500) {
    reset();
    t=0;
    s=0;
    S=getRandomInt(1,5);
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,2*CSIZE,2*CSIZE);
    ctx.canvas.style.opacity=1;
  }
  requestAnimationFrame(animate);
}

onresize();

var dim=50;
var F1=4*Math.random();
var F2=4*Math.random();
var F3=4*Math.random();
var F4=4*Math.random();
var P1=1-2*Math.random();
var P2=(1-Math.abs(P1))*[-1,1][getRandomInt(0,2)];
var P3=1-2*Math.random();
var P4=(1-Math.abs(P3))*[-1,1][getRandomInt(0,2)];
var dash1=[];
var dash2=[];
var reset=()=>{
  F1=4*Math.random();
  F2=4*Math.random();
  F3=4*Math.random();
  F4=4*Math.random();
  P1=1-2*Math.random();
  P2=(1-Math.abs(P1))*[-1,1][getRandomInt(0,2)];
  P3=1-2*Math.random();
  P4=(1-Math.abs(P3))*[-1,1][getRandomInt(0,2)];
  K1=10-20*Math.random();
  K2=10-20*Math.random();
  if (Math.random()<0.5) dash1=([dim*Math.random(),dim*Math.random()]);
  else dash1=[];
  if (Math.random()<0.5) dash2=([dim*Math.random(),dim*Math.random()]);
  else dash2=[];
  setPattern();
}

var sq=2*CSIZE;
var getImageData=()=>{
  let pixd=ctx.createImageData(sq,sq); 
  let rm=6*getRandomInt(1,4,true);
  let gm=6*getRandomInt(1,4,true);
  let bm=6*getRandomInt(1,4,true);
//console.log(rm,gm,bm);
  let ro=TP/4*getRandomInt(0,4);
  let go=TP/4*getRandomInt(0,4);
  let bo=TP/4*getRandomInt(0,4);
  let rf=sq/getRandomInt(1,4);
  let gf=sq/getRandomInt(1,4);
  let bf=sq/getRandomInt(1,4);
  for (let i=0; i<sq; i++) {
    for (let j=0; j<sq; j++) {
      let x=j-sq/2;
      let y=i-sq/2;
      let r=Math.pow(x*x+y*y,0.5);
      let a=Math.atan2(y,x);
      pixd.data[(i*4*sq)+j*4]  =Math.round(96+159*Math.sin(TP*r/rf+ro)*Math.cos(rm*a));
      pixd.data[(i*4*sq)+j*4+1]=Math.round(96+159*Math.sin(TP*r/gf+go)*Math.cos(gm*a));
      pixd.data[(i*4*sq)+j*4+2]=Math.round(96+159*Math.sin(TP*r/bf+bo)*Math.cos(bm*a));
      pixd.data[(i*4*sq)+j*4+3]=255;
    }
  }
  return pixd;
}
var pattern;
var pattern2;
var setPattern=(n)=>{
  const dmo=new DOMMatrix([1,0,0,1,-CSIZE,-CSIZE]);
  let pixd=getImageData();
  createImageBitmap(pixd).then((ib)=>{ 
    pattern=ctx.createPattern(ib,"no-repeat");
    pattern.setTransform(dmo);
  });
  let pixd2=getImageData();
  createImageBitmap(pixd2).then((ib)=>{ 
    pattern2=ctx.createPattern(ib,"no-repeat");
    pattern2.setTransform(dmo);
  });
}
setPattern();

const DM1=new DOMMatrix([-1,0,0,1,0,0]);
const DM2=new DOMMatrix([1,0,0,-1,0,0]);
const DM3=new DOMMatrix([0.5,-0.866,0.866,0.5,0,0]);
const DM4=new DOMMatrix([0.5,0.866,-0.866,0.5,0,0]);

var hexise=(path)=>{
  path.addPath(path,DM1);
  path.addPath(path,DM2);
  path.addPath(path,DM3);
  path.addPath(path,DM4);
}

var dur=600;
var R=dim-10;
ctx.fillStyle="#00000008";
var K1=getRandomInt(1,10);
var K2=getRandomInt(1,10);
ctx.lineWidth=10;
var draw=()=>{
  let z=TP/4*t/dur;
  let x=340*(P1*Math.cos(F1*z)+P2*Math.cos(F2*z));
  let y=340*(P3*Math.sin(F3*z)+P4*Math.sin(F4*z));
  let pd=new Path2D();
  pd.arc(x,y,R,0,TP);
  hexise(pd);
  ctx.fill(pd);
  let s=Math.pow(Math.sin(TP/2*t/dur),2);
  ctx.setTransform(s,0,0,s,CSIZE,CSIZE);
  let dx=dim*Math.cos(K1*z);
  let dy=dim*Math.sin(K1*z);
  let p0=new Path2D();
  p0.moveTo(x-dx,y-dy);
  p0.lineTo(x+dx,y+dy);
  hexise(p0);
  ctx.strokeStyle=pattern;
  ctx.setLineDash(dash1);
  ctx.stroke(p0);
  dx=dim*Math.cos(-K2*z);
  dy=dim*Math.sin(-K2*z);
  let p1=new Path2D();
  p1.moveTo(x-dx,y-dy);
  p1.lineTo(x+dx,y+dy);
  hexise(p1);
  ctx.strokeStyle=pattern2;
  ctx.setLineDash(dash2);
  ctx.stroke(p1);
}

start();

var test=(ptn)=>{
  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.fillStyle=ptn;
  ctx.fill();
  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  console.log(F1,F2,F3,F4);
}
