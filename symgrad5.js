"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/abqjdNW
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const CSIZE=100;

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

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.parentElement.style.width=D+"px";
  ctx.canvas.parentElement.style.height=D+"px";
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

const getRandomSum=(c,s)=>{
  let ra=[0];
  for (let i=0; i<c-1; i++) ra.push(Math.random());
  ra.push(1);
  ra.sort((a,b)=>{ return a-b; });
  let ra2=new Array(c);
  for (let i=0; i<c; i++) ra2[i]=s*(ra[i+1]-ra[i]);
  return ra2;
}

function start() {
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

//var RF=[3,4,5,6,7][getRandomInt(0,5,true)];
var RF=5;
var sp1=new Array(RF);
var sp2=new Array(RF);
const RATE=6000;
for (let i=0; i<RF; i++) {
  sp1[i]=RATE+RATE*Math.random();
  sp2[i]=RATE+RATE*Math.random();
}
var stopped=true;
var time=0;
var duration=20000;
var frac=0;

function animate(ts) {
  if (stopped) return;
  if (!time) time=ts;
  if (ts-time<duration) {
    frac=(ts-time)/duration;
  } else {
    setColors();
    time=0;
    frac=0;
  }
  for (let i=0; i<RF; i++) {
    rfa1[i]=0.24*Math.sin(ts/(sp1[i]));
    rfa2[i]=Math.cos(ts/(sp2[i]));
    if (Math.abs(rfa2[i])<0.0003) {
      ac[i]=4*getRandomInt(1,11);
//console.log("AAA "+ac);
      sp1[i]*=0.95;
    }

if (Math.abs(rfa1[i])<0.0001) {
  sp2[i]*=0.98;
//console.log("BBB "+sp2[i].toFixed(0));
}

  }
  drawEM();
  requestAnimationFrame(animate);
}

let rfa1=new Array(RF).fill(0);
let rfa2=new Array(RF).fill(0);
var ac=new Array(RF);
for (let i=0; i<RF; i++) {
  ac[i]=8+8*i;
//  ac[i]=2;
}

onresize();

var getRandomFactor7=(c1,c2)=>{
  let a=Math.atan2(c1,c2);
  let factor=0;
  let r=Math.pow(c1*c1+c2*c2,0.5);
  for (let i=0; i<RF; i++) {
//    factor+=rfa2[i]*Math.cos(4*a)*Math.sin(rfa1[i]*r);
    //factor+=rfa2[i]*Math.cos(ac[i]*a)*Math.sin(rfa1[i]*r);
//let zz=8+F1*i;
//let zz=2+2*i;
     factor+=rfa2[i]*Math.cos(ac[i]*a)*Math.sin(rfa1[i]*r);
     //factor+=rfa2[i]*Math.cos(ac[i]*a)*Math.pow(Math.sin(rfa1[i]*r),3);

/*
     let o=ac[i]*a;
     let oo=rfa1[i]*r;
factor+=rfa2[i]*     Math.pow(Math.cos(o),3)*
      (-0.8125*Math.cos(oo)+0.3125*Math.cos(2*oo)+0.125*Math.cos(3*oo)+0.0625*Math.cos(4*oo));
*/
  }
  //return 1.5*factor;
  return factor;
}

var brightness=500;
var rgb1=getRandomSum(3,brightness);
var rgb2=getRandomSum(3,brightness);
var rgbo1=new Array(3);
var rgbo2=new Array(3);
var setColors=()=>{
  for (let i=0; i<3; i++) {
    rgbo1[i]=rgb1[i];
    rgbo2[i]=rgb2[i];
  }
  //brightness=1200+80*RF;
//brightness=60+80*RF;
  rgb1=getRandomSum(3,brightness);
  rgb1.sort((a,b)=>{ return a-b; });
  rgb2=getRandomSum(3,brightness);
  rgb2.sort((a,b)=>{ return b-a; });
}
setColors();

var cpix=ctx.createImageData(2*CSIZE,2*CSIZE); 
for (let i=-CSIZE; i<CSIZE; i++) {
  for (let j=-CSIZE; j<CSIZE; j++) {
    let loc=(i+CSIZE)*8*CSIZE+(j+CSIZE)*4;
    let r=Math.pow(i*i+j*j,0.5);
    if (r>0.7*CSIZE) {
      //let z=TP/4*(14*CSIZE-10*r)/(7*CSIZE);
      //cpix.data[loc+3]=Math.round(255*(1-Math.cos(z)));
      cpix.data[loc+3]=Math.round(255*(14*CSIZE-10*r)/(7*CSIZE));
    }
    else cpix.data[loc+3]=255;
  }
}

//for (let i=0; i<4*CSIZE*CSIZE; i++) { cpix.data[i*4+3]=255; }

var drawEM=(crc)=>{
  let red1=frac*rgb1[0]+(1-frac)*rgbo1[0];
  let green1=frac*rgb1[1]+(1-frac)*rgbo1[1];
  let blue1=frac*rgb1[2]+(1-frac)*rgbo1[2];
  let red2=frac*rgb2[0]+(1-frac)*rgbo2[0];
  let green2=frac*rgb2[1]+(1-frac)*rgbo2[1];
  let blue2=frac*rgb2[2]+(1-frac)*rgbo2[2];
  for (let i=-CSIZE; i<CSIZE; i++) {
    for (let j=-CSIZE; j<CSIZE; j++) {
      let loc=(i+CSIZE)*8*CSIZE+(j+CSIZE)*4;
      let q=getRandomFactor7(i,j);
      if (q>0.01) {
        cpix.data[loc]=Math.round(red1*q);
        cpix.data[loc+1]=Math.round(green1*q);
        cpix.data[loc+2]=Math.round(blue1*q);
      //} else {
      } else if (q<-0.01) {
        cpix.data[loc]=Math.round(-red2*q);
        cpix.data[loc+1]=Math.round(-green2*q);
        cpix.data[loc+2]=Math.round(-blue2*q);
      } else {
        cpix.data[loc]=0;
        cpix.data[loc+1]=0;
        cpix.data[loc+2]=0;
      }
    }
  }
  ctx.putImageData(cpix,0,0);
  //createImageBitmap(cpix).then((ib)=>{ ctx.drawImage(ib,-CSIZE,-CSIZE); });
}

//drawEM();
setColors();
start();
