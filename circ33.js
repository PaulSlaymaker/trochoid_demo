"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/abRgERR
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=320;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var doms=new DOMMatrix([1,0,0,1,-CSIZE,-CSIZE]);
var t=80;
var K1=100+100*Math.random();
var K2=100+100*Math.random();
var K3=TP*Math.random();
var K4=TP*Math.random();
var animate=(ts)=>{
  if (stopped) return;
  t++;
  if (t<600) draw();
  if (t==720) {
    K1=80+100*Math.random();
    K2=80+100*Math.random();
    K3=TP*Math.random();
    K4=TP*Math.random();
    KC=getRandomInt(2,9,true);
    KC2=Math.round(20/KC);
    setPattern();
    t=0;
if (EM) stopped=true;
  }
  requestAnimationFrame(animate);
}

var sq=2*CSIZE;
let pixd=ctx.createImageData(sq,sq); 
for (let i=0; i<sq; i++) {
  for (let j=0; j<sq; j++) pixd.data[(i*4*sq)+j*4+3]=255;
}

var KC=getRandomInt(2,9,true);
var KC2=Math.round(20/KC);

var getImageData=()=>{
  let rm=KC*getRandomInt(1,KC2,true);
  let gm=KC*getRandomInt(1,KC2,true);
  let bm=KC*getRandomInt(1,KC2,true);
  let ro=TP*Math.random();
  let go=TP*Math.random();
  let bo=TP*Math.random();
  let rf=sq/getRandomInt(1,10);
  let gf=sq/getRandomInt(1,10);
  let bf=sq/getRandomInt(1,10);
  for (let i=0; i<sq; i++) {
    for (let j=0; j<sq; j++) {
      let x=j-sq/2;
      let y=i-sq/2;
      let r=Math.pow(x*x+y*y,0.5);
      let a=Math.atan2(y,x);
      pixd.data[(i*4*sq)+j*4]  =Math.round(24+231*Math.sin(TP*r/rf+ro)*Math.cos(rm*a));
      pixd.data[(i*4*sq)+j*4+1]=Math.round(24+231*Math.sin(TP*r/gf+go)*Math.cos(gm*a));
      pixd.data[(i*4*sq)+j*4+2]=Math.round(24+231*Math.sin(TP*r/bf+bo)*Math.cos(bm*a));
    }
  }
  return pixd;
}
var pattern;
var setPattern=(n)=>{
  const dmo=new DOMMatrix([1,0,0,1,-CSIZE,-CSIZE]);
  let pixd=getImageData();
  createImageBitmap(pixd).then((ib)=>{ 
    pattern=ctx.createPattern(ib,"no-repeat");
    pattern.setTransform(dmo);
    ctx.strokeStyle=pattern;
  });
}
setPattern();

var draw=()=>{
  ctx.beginPath();
  let r=(CSIZE)*Math.pow(Math.sin(TP*t/2400),2);
  ctx.arc(0,0,r,0,TP);
  ctx.strokeStyle="#00000020";
  ctx.lineWidth=10;
  ctx.stroke();
  if (r<20) return;
  ctx.beginPath();
  ctx.arc(0,0,r-20,0,TP);
  ctx.strokeStyle=pattern;
  let t2=TP*(Math.sin(t/K1+K3)/2+Math.sin(t/K2+K4)/2);
  let domr=new DOMMatrix([Math.cos(t2),Math.sin(t2),-Math.sin(t2),Math.cos(t2),CSIZE,CSIZE]);
  ctx.setTransform(domr);
  ctx.lineWidth=4;
  ctx.stroke();
}

onresize();

start();
