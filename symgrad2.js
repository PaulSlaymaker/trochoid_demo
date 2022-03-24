"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const CSIZE=160;

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
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

/*
const getRandomSumN=(c)=>{
  let ra=[0];
  for (let i=0; i<c-1; i++) {
    ra.push(Math.random());
  }
  ra.push(1);
  ra.sort((a,b)=>{ return a-b; });
  let ra2=new Array(c);
  for (let i=0; i<c; i++) {
    ra2[i]=ra[i+1]-ra[i];
  }
//ra2.sort((a,b)=>{ return a-b; });
  return ra2;
}
*/

const getRandomOffsets=(c)=>{
  let ro=[];
  for (let i=0; i<c; i++) {
    //ro.push(TP*(1-2*Math.random()));
    ro.push(TP*Math.random());
  }
  return ro;
}

var reset=()=>{
  RF=[3,4,5,6,7][getRandomInt(0,5,true)];
  speed=RF*6000;
  rfa1=new Array(RF).fill(0);
  rfa2=new Array(RF).fill(0);
  tx1=getRandomOffsets(RF);
  tx2=getRandomOffsets(RF);
}

function start() {
  if (stopped) {
    reset();
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var RF=[3,4,5,6,7][getRandomInt(0,5,true)];
var speed=RF*7000;
var stopped=true;
var t=0;
var tx1=getRandomOffsets(RF);
var tx2=getRandomOffsets(RF);

function animate(ts) {
  if (stopped) return;
  t++;
  for (let i=0; i<RF; i++) {
    rfa1[i]=0.36*Math.sin(tx1[i]+ts/(speed-2000*i));
    rfa2[i]=-0.36*Math.sin(tx2[i]+ts/(speed-1000-2000*i));
/*
if (i%2) {
    rfa1[i]=0.16*Math.sin(tx1[i]+ts/(speed-2000*i));
    rfa2[i]=0.16*Math.sin(tx2[i]+ts/(speed-1000-2000*i));
} else {
    rfa1[i]=0.16*Math.cos(tx1[i]+ts/(speed-2000*i));
    rfa2[i]=0.16*Math.cos(tx2[i]+ts/(speed-1000-2000*i));
}
*/
  }
  drawEM();
//cpix1.data[Math.round(50000*Math.random())]=255;
//ctx.putImageData(cpix1,0,0);
//}
  requestAnimationFrame(animate);
}

onresize();

let rfa1=new Array(RF).fill(0);
let rfa2=new Array(RF).fill(0);

let sa=[];
for (let i=-1280; i<=1280; i++) sa.push(Math.sin(i/10));	// +/- 0.16*800

var getRandomFactor=(c1,c2)=>{
  let factor=0;
  for (let i=0; i<RF; i++) {
    //factor+=(rma1[i]*Math.cos(c1*rfa1[i])+rma2[i]*Math.cos(c2*rfa2[i]))/2;
    factor+=Math.sin(c1*rfa1[i]+c2*rfa2[i]);
  }
  return factor/RF;
}

var getRandomFactor2=(c1,c2)=>{
  let factor=0;
  for (let i=0; i<RF; i++) {
//console.log(c1*rfa1[i]+c2*rfa2[i]);
let z=1280+Math.round((c1*rfa1[i]+c2*rfa2[i])*10);
if (Math.random()<0.0000001) console.log(z);
//console.log(z);
//console.log(sa[z]);
//console.log(Math.sin(c1*rfa1[i]+c2*rfa2[i]));
    //factor+=Math.sin(c1*rfa1[i]+c2*rfa2[i]);
    factor+=sa[300];
  }
  return factor/RF;
}

var cpix=ctx.createImageData(2*CSIZE,2*CSIZE); 
for (let i=0; i<4*CSIZE*CSIZE; i++) cpix.data[i*4+3]=255;
var drawEM=(crc)=>{
  for (let i=-CSIZE; i<CSIZE; i++) {
    for (let j=-CSIZE; j<CSIZE; j++) {
      let loc=(i+CSIZE)*8*CSIZE+(j+CSIZE)*4;
      //let q=(Math.cos(j*rf)+Math.cos(j*rf2)+Math.cos(j*rf3)+Math.cos(j*rf4))/3;
      //let q=getRandomFactor(i,j);
      let q=getRandomFactor(i,j);
      //let q=(getRandomFactor(j)+getRandomFactor(i))/2;
      //cpix.data[(i*3200)+j*4]=  Math.round(127+128*q);
//cpix.data[(i*3200)+j*4]=  q<0.01?0:q*800;
//cpix.data[((i+CSIZE)*8*CSIZE)+(j+CSIZE)*4]=  Math.round(1355*q);
//cpix.data[((i+CSIZE)*8*CSIZE)+(j+CSIZE)*4]=  Math.round(1355*q)/4;
//cpix.data[((i+CSIZE)*8*CSIZE)+(j+CSIZE)*4+1]=Math.round(cf1*1355*q);
//cpix.data[((i+CSIZE)*8*CSIZE)+(j+CSIZE)*4+1]=Math.round(Math.abs(128*q)+Math.abs(-128*q));
cpix.data[loc+1]=Math.round(Math.abs(128*q)+Math.abs(-128*q));
cpix.data[loc+2]=Math.round(1200*q);
//cpix.data[((i+CSIZE)*8*CSIZE)+(j+CSIZE)*4]=  Math.round(1355*q)/10;
//cpix.data[((i+CSIZE)*8*CSIZE)+(j+CSIZE)*4]=  Math.round(1355*q)/10;
//cpix.data[((i+CSIZE)*8*CSIZE)+(j+CSIZE)*4]=  Math.round(-1200*q);
cpix.data[loc]=Math.round(-1200*q);
/*
cpix.data[((i+CSIZE)*8*CSIZE)+(j+CSIZE)*4]=  (1-rf)*Math.round(1355*q)+rf*Math.round(Math.abs(112*q)+Math.abs(-112*q));
cpix.data[((i+CSIZE)*8*CSIZE)+(j+CSIZE)*4+1]=(1-gf)*Math.round(1355*q)+gf*Math.round(Math.abs(112*q)+Math.abs(-112*q));
//cpix.data[((i+CSIZE)*8*CSIZE)+(j+CSIZE)*4+1]=Math.round(Math.abs(112*q)+Math.abs(-112*q));
cpix.data[((i+CSIZE)*8*CSIZE)+(j+CSIZE)*4+2]=(1-bf)*Math.round(-1355*q)+bf*Math.round(Math.abs(112*q)+Math.abs(-112*q));
*/
//cpix.data[((i+CSIZE)*8*CSIZE)+(j+CSIZE)*4+2]=Math.round(-1355*q);
//      cpix.data[(i*3200)+j*4]=  Math.round(r1+r2*Math.sin(j/24));
//      cpix.data[(i*3200)+j*4+1]=Math.round(g1+g2*Math.sin((2*i-j)/48));
//      cpix.data[(i*3200)+j*4+1]=Math.round(g1+g2*Math.sin((2*i-j)/48));
//      cpix.data[(i*3200)+j*4+2]=Math.round(b1+b2*Math.cos((2*i+j)/48));
//      cpix.data[((i+CSIZE)*8*CSIZE)+j*4+3]=255;
    }
  }
  ctx.putImageData(cpix,0,0);
  //createImageBitmap(cpix).then((ib)=>{ ctx.drawImage(ib,-CSIZE,-CSIZE); });
}

//drawEM();
start();
