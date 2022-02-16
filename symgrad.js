"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.margin="0 auto";
  d.style.position="relative";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top=c.style.left="0px";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

const ctx2=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top=c.style.left="0px";
  ctx.canvas.parentElement.insertBefore(c,ctx.canvas);
  return c.getContext("2d");
})();
ctx2.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.parentElement.style.width=D+"px";
  ctx.canvas.parentElement.style.height=D+"px";
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
  ctx2.canvas.style.width=ctx2.canvas.style.height=D+"px";
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
var duration=200;
function animate(ts) {
  if (stopped) return;
    t++;
    let q=t%duration;
    if (q<duration/2) {
      ctx.canvas.style.opacity=1-q/(duration/2);	// apply cubic smoothing
    } else {
      ctx.canvas.style.opacity=(q-duration/2)/(duration/2);
    }

//    ctx.canvas.style.opacity=(1+Math.cos(TP*t/duration))/2;
    //ctx.canvas.style.opacity=Math.pow(Math.sin(TP*t/40),2);
//  }
  if (t%200==0) {
    randomize();
    if (t%100==0) {
      drawEM(ctx2);
    } else {
      drawEM(ctx);
    }
  }
  requestAnimationFrame(animate);
}

onresize();

var rm=4;
var gm=4;
var bm=4;

var rf=1000;
var gf=1000;
var bf=1000;

var ro=0;
var go=0;
var bo=0;

var randomize=()=>{
  rm=Math.pow(2,getRandomInt(3,10,true));
  gm=Math.pow(2,getRandomInt(3,10,true));
  bm=Math.pow(2,getRandomInt(3,10,true));

/*
  rm=Math.pow(2,getRandomInt(2,5,true));
  gm=Math.pow(2,getRandomInt(2,5,true));
  bm=Math.pow(2,getRandomInt(2,5,true));
*/

  rf=80+400*Math.random();
  gf=80+400*Math.random();
  bf=80+400*Math.random();
  ro=TP*Math.random();
  go=TP*Math.random();
  bo=TP*Math.random();
console.log(rm+" "+gm+" "+bm);
}


var F=3;
var cpix1=ctx.createImageData(2*CSIZE,2*CSIZE); 
var cpix2=ctx2.createImageData(2*CSIZE,2*CSIZE); 
var drawEM=(crc)=>{
  let cpix=crc==ctx?cpix1:cpix2;
  for (let i=0; i<800; i++) {
    for (let j=0; j<800; j++) {
let x=j-400;
let y=i-400;
let r=Math.pow(x*x+y*y,0.5);
let a=Math.atan2(y,x);
let ff=1-Math.min(1,Math.pow(r/400,3));
      //cpix.data[(i*3200)+j*4]=Math.round(127+128*Math.sin(i*TP/100));
      //cpix.data[(i*3200)+j*4+1]=Math.round(127+128*Math.sin(j*TP/100));
      //cpix.data[(i*3200)+j*4]=Math.round(127+128*Math.sin(a));
      ///cpix.data[(i*3200)+j*4+1]=Math.round(127+128*Math.cos(a));
      //cpix.data[(i*3200)+j*4+2]=Math.round(Math.min(255,256*r/400));
/*
      cpix.data[(i*3200)+j*4]=Math.round(128+127*(Math.cos(TP*r/rf+ro)+Math.cos(rm*a))/2);
      cpix.data[(i*3200)+j*4+1]=Math.round(128+127*(Math.cos(TP*r/gf+go)+Math.cos(gm*a))/2);
      cpix.data[(i*3200)+j*4+2]=Math.round(128+127*(Math.cos(TP*r/bf+bo)+Math.cos(bm*a))/2);
*/
/*
      cpix.data[(i*3200)+j*4]=  Math.round(128+127*Math.sin(TP*r/rf+ro)*(Math.cos(rm*a)+Math.cos(F*rm*a))/2);
      cpix.data[(i*3200)+j*4+1]=Math.round(128+127*Math.sin(TP*r/gf+go)*(Math.cos(gm*a)+Math.cos(F*gm*a))/2);
      cpix.data[(i*3200)+j*4+2]=Math.round(128+127*Math.sin(TP*r/bf+bo)*(Math.cos(bm*a)+Math.cos(F*bm*a))/3);
*/
      cpix.data[(i*3200)+j*4]=  Math.round(ff*(144+111*Math.sin(TP*r/rf+ro)*Math.cos(rm*a)));
      cpix.data[(i*3200)+j*4+1]=Math.round(ff*(144+111*Math.sin(TP*r/gf+go)*Math.cos(gm*a)));
      cpix.data[(i*3200)+j*4+2]=Math.round(ff*(144+111*Math.sin(TP*r/bf+bo)*Math.cos(bm*a)));
/*
      cpix.data[(i*3200)+j*4]=  Math.round(128+127*(Math.sin(TP*r/rf+ro)+Math.sin(3*TP*r/rf))/2*Math.cos(rm*a));
      cpix.data[(i*3200)+j*4+1]=Math.round(128+127*(Math.sin(TP*r/gf+go)+Math.sin(3*TP*r/gf))/2*Math.cos(gm*a));
      cpix.data[(i*3200)+j*4+2]=Math.round(128+127*(Math.sin(TP*r/bf+bo)+Math.sin(3*TP*r/bf))/2*Math.cos(gm*a));
*/
      //cpix.data[(i*3200)+j*4+3]=Math.round(Math.min(255,255*(1-r/500)));
      cpix.data[(i*3200)+j*4+3]=255;
    }
  }
  crc.putImageData(cpix,0,0);
}

randomize();
drawEM(ctx);
randomize();
drawEM(ctx2);
start();
