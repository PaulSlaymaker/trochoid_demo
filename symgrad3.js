"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const CSIZE=300;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.margin="0 auto";
  d.style.position="relative";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.parentElement.style.width=D+"px";
  ctx.canvas.parentElement.style.height=D+"px";
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
var S=0;
function animate(ts) {
  if (stopped) return;
  t++;
  rm+=inc;
  gm+=inc+0.0001;
  bm+=inc+0.0002;
//  SS+=inc2;
//  gm+=inc+0.000001;
//  bm+=inc+0.000002;
if (S==0) {
  if (t%400==0) {
    S=1;
  }
} else if (S==1) {
  if (t%30==0) {
    randomize();
    S=2;
  } else opf=1-(t%30)/30;
} else {
  if (t%30==0) {
    S=0;
    opf=1;
  }
  else opf=(t%30)/30;
}
  drawEM();
  requestAnimationFrame(animate);
}

onresize();

let fF=Math.random();
var exp=0.4+0.2*fF;
let low=20-16*fF;
let high=80-60*fF;
let cm=low+high*Math.random();
var inc=-0.003+fF*0.0028;
//var inc2=0.0001;
var rm=cm+0.1;
var gm=cm;
var bm=cm-0.1;

var randomize=()=>{
  let fF=Math.random();
  exp=0.36+0.2*fF;
  let low=16-12*fF;
  //let high=80-60*fF;
let high=60-50*fF;
  let cm=low+high*Math.random();
  rm=cm+0.1;
  gm=cm;
  bm=cm-0.1;
  inc=-0.004+fF*0.0037;	// varies with canvas w/h

R=getRandomInt(191,256);
G=getRandomInt(191,256);
B=getRandomInt(191,256);
}

//inc=-0.0001;
//rm=gm=bm=0.1;

var R=getRandomInt(191,256);
var G=getRandomInt(191,256);
var B=getRandomInt(191,256);

var opf=1;
var cpix1=ctx.createImageData(2*CSIZE,2*CSIZE); 
var drawEM=(crc)=>{
  let cpix=cpix1;
  for (let i=0; i<2*CSIZE; i++) {
    for (let j=0; j<2*CSIZE; j++) {
      let x=i-CSIZE;
      let y=j-CSIZE;
      let r=Math.pow(x*x+y*y,exp);
      //let r=Math.pow(Math.abs(x)+Math.abs(y),exp);	// diamond
      //let r=Math.pow(Math.abs(x*y*y),exp);
      //let r=Math.pow(x*x*y*y,exp);	// more quads
      //let r=Math.pow(Math.abs(x*y),exp);	// quadrants
      //let r=Math.pow(Math.abs(x*x/y)+Math.abs(y*y/x),exp);	// quadrants, needs cm 2-20?
      //let r=Math.pow(SS*x*x+SS*y*y,exp);	
      //let r=Math.pow(Math.abs(x*x*y)+Math.abs(y*y*x),exp);	// diamond
/*
      cpix.data[(i*8*CSIZE)+j*4]=  Math.round(255*Math.pow(Math.sin(rm*r),2));
      cpix.data[(i*8*CSIZE)+j*4+1]=  Math.round(255*Math.pow(Math.sin(gm*r),2));
      cpix.data[(i*8*CSIZE)+j*4+2]=  Math.round(255*Math.pow(Math.sin(bm*r),2));
*/
      cpix.data[(i*8*CSIZE)+j*4]=  Math.round(R*Math.cos(rm*r));
      cpix.data[(i*8*CSIZE)+j*4+1]=Math.round(G*Math.cos(gm*r));
      cpix.data[(i*8*CSIZE)+j*4+2]=Math.round(B*Math.cos(bm*r));
      cpix.data[(i*8*CSIZE)+j*4+3]=255*opf;
    }
  }
  ctx.putImageData(cpix,0,0);
}

drawEM(ctx);
start();
