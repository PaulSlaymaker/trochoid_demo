"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=200;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
/*TRANS*/
//ctx.translate(CSIZE,CSIZE);

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

/*
var colors=[];
var hues=[];
var getHues=()=>{
  let h=[];
  let hueCount=4;
  let hr=Math.round(90/hueCount);
  let hue=getRandomInt(0,90,true)+30;
  for (let i=0; i<hueCount; i++) {
    let hd=Math.round(240/hueCount)*i+getRandomInt(-hr,hr);
    h.splice(getRandomInt(0,h.length+1),0,(hue+hd)%360);
  }
  return h;
}
hues=getHues();
*/

var sq=2*CSIZE;

var getImageData=()=>{
  let pixd=ctx.createImageData(sq,sq); 
  let rm=Math.pow(2,getRandomInt(2,6,true));
  let gm=Math.pow(2,getRandomInt(2,6,true));
  let bm=Math.pow(2,getRandomInt(2,6,true));
//  let ro=TP/16*getRandomInt(0,2);
//  let go=TP/16*getRandomInt(0,2);
//  let bo=TP/16*getRandomInt(0,2);
let ro=TP/4*getRandomInt(0,4);
let go=TP/4*getRandomInt(0,4);
let bo=TP/4*getRandomInt(0,4);
  let rf=sq/getRandomInt(1,5);
  let gf=sq/getRandomInt(1,5);
  let bf=sq/getRandomInt(1,5);
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
//  ctx2.putImageData(pixd,0,0);
}

var C=16;
var patterns=new Array(C); //.fill("red");
const dm3=new DOMMatrix([1,0,0,1,-200,-200]);
var setPattern=(n)=>{
  let pixd=getImageData();
  createImageBitmap(pixd).then((ib)=>{ 
    patterns[n]=ctx.createPattern(ib,"no-repeat");
//    patterns[n].setTransform(dm3);
//ctx.fillRect(0,0,2*CSIZE,2*CSIZE);
//ctx.strokeStyle=pattern;
  });
}
//setPattern(0);

//const b=createImageBitmap(pixd, {ColorSpaceConversion:"none"})
//const b=createImageBitmap(pixd, {"premultiplyAlpha":"none"})
/*
var pixd=getImageData();
createImageBitmap(pixd).then((ib)=>{ 
  pattern=ctx.createPattern(ib,"repeat");
});
*/

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else stopped=true;
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
//var extent=Math.round(CSIZE*Math.pow(2,0.5));
var extent=CSIZE;
//var t=0;
function animate(ts) {
  if (stopped) return;
//t++;
//patterns[0].setTransform(new DOMMatrix([1,0,0,1,-200,-200]));
//patterns[0].setTransform(new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),0,0]));
//let dm1=new DOMMatrix([1,0,0,1,200,200]);
//patterns[0].setTransform(dm1);
//patterns[0].setTransform(dm1.multiply(dm2));
//patterns[0].setTransform(dm1);
  for (let i=0; i<r.length; i++) {
    r[i]+=0.3;
/*
let z=TP*Math.cos(t/50)/32;
if (i%2==0) z=TP*Math.sin(t/50)/32;
let dm2=new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),0,0]);
patterns[i].setTransform(dm2.multiply(dm3));
*/
    if (r[i]>extent) {
      r[i]=0;
      //if (i==0) ctx.strokeStyle="#00000010";
      //if (i==0) ctx.strokeStyle="black";
      setPattern(i);
if (EM) stopped=true;
    }
  }
/*
  r++;
  if (r>560) {
    r=0;
//    getImageData();
//    pattern=ctx.createPattern(ctx2.canvas,"no-repeat");
//    ctx.strokeStyle=pattern;
    setPattern();
  }
*/
  draw();
  requestAnimationFrame(animate);
}

//ctx.setLineDash([5,10]);	// need each bez on own path
//ctx.lineDashOffset=100;
//ctx.globalCompositeOperation="destination-over";

var r=[];
for (let i=0; i<C; i++) {
  setPattern(i);
  r.push(i*extent/C);
}

ctx.fillStyle="#00000007";
//ctx.strokeStyle="white";
//ctx.strokeStyle=pattern;
//ctx.lineWidth=20;
ctx.lineWidth=3;
var draw=()=>{
  //ctx.fillRect(0,0,2*CSIZE,2*CSIZE);
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.fillRect(0,0,2*CSIZE,2*CSIZE);
  //ctx.clearRect(0,0,2*CSIZE,2*CSIZE);
  for (let i=0; i<r.length; i++) {
    ctx.beginPath();
    ctx.arc(CSIZE,CSIZE,r[i],0,TP);
//    ctx.arc(0,0,r[i],0,TP);
    ctx.strokeStyle=patterns[i];
//ctx.strokeStyle=patterns[0];
    ctx.stroke();
  }
}

onresize();

start();
