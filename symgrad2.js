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

const getRandomSum=(c,s)=>{
  let ra=[0];
  for (let i=0; i<c-1; i++) ra.push(Math.random()/2);
  ra.push(1);
  ra.sort((a,b)=>{ return a-b; });
  let ra2=new Array(c);
  for (let i=0; i<c; i++) ra2[i]=s*(ra[i+1]-ra[i]);
  return ra2;
}

const getRandomOffsets=(c)=>{
  let ro=[];
  for (let i=0; i<c; i++) ro.push(TP*Math.random());
  return ro;
}

var reset=()=>{
  for (let i=0; i<4*CSIZE*CSIZE; i++) {
    cpix.data[i*4]=0;
    cpix.data[i*4+1]=0;
    cpix.data[i*4+2]=0;
  }
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  RF=[3,2,4,3,4,5,6,7][getRandomInt(0,8,true)];
  speed=RF*6000;
  rfa1=new Array(RF).fill(0);
  rfa2=new Array(RF).fill(0);
  tx1=getRandomOffsets(RF);
  tx2=getRandomOffsets(RF);
  if (RF<3) {
    factorFunc=
      [getRandomFactor2,getRandomFactor3,getRandomFactor4,getRandomFactor5,getRandomFactor7]
      [getRandomInt(0,5)];
  } else if (RF<5) {
    factorFunc=
      [getRandomFactor1,getRandomFactor2,getRandomFactor3,getRandomFactor4,getRandomFactor5,getRandomFactor7]
      [getRandomInt(0,6)];
  } else {
    factorFunc=[getRandomFactor1,getRandomFactor2,getRandomFactor7][getRandomInt(0,3)];
  }
//factorFunc=getRandomFactor3;
setColors();
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
  if (t>1200) {
    ctx.canvas.style.opacity=(1300-t)/100;
    if (t==1300) reset();
    else if (t>1300) {
      ctx.canvas.style.opacity=(t-1300)/100;
      if (t>1400) {
        ctx.canvas.style.opacity=1;
        t=0;
      }
    }
  }
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

var getRandomFactor1=(c1,c2)=>{
  let factor=0;
  for (let i=0; i<RF; i++) {
    factor+=Math.sin(c1*rfa1[i]+c2*rfa2[i]);			// linear
    //factor+=Math.sin(c1*c1*rfa1[i]/CSIZE+c2*c2*rfa2[i]/CSIZE);	// circular-lateral
    //factor+=Math.sin(c1*rfa1[i])+Math.cos(c2*rfa2[i]);			// lateral
/*
if (i%2)
    factor+=Math.sin(c1*c1*rfa1[i]/CSIZE+c2*c2*rfa2[i]/CSIZE);	// circular-lateral
else 
    factor+=Math.sin(c1*rfa1[i]+c2*rfa2[i]);			// linear
*/
    //factor+=Math.sin(c1*rfa1[i])*Math.cos(c2*rfa2[i]);			// lateral
  }
  return factor/RF;
}

var getRandomFactor2=(c1,c2)=>{
  let factor=0;
  for (let i=0; i<RF; i++) {
    factor+=Math.sin(c1*rfa1[i])*Math.sin(c2*rfa2[i]);			// bilateral
/*
if (c2<0) {
if (c1<0)
    factor+=Math.sin(c1*rfa1[i])*Math.sin(c2*rfa2[i]);			// bilateral
else
    factor-=Math.sin(c1*rfa1[i])*Math.sin(c2*rfa2[i]);			// bilateral
} else {
if (c1<0)
    factor-=Math.sin(c1*rfa1[i])*Math.sin(c2*rfa2[i]);			// bilateral
else
    factor+=Math.sin(c1*rfa1[i])*Math.sin(c2*rfa2[i]);			// bilateral
}
*/
/*
if (i%2)
    factor+=Math.sin(c1*rfa1[i])*Math.cos(c2*rfa2[i]);			// bilateral
else 
    factor+=Math.sin(c1*c1*rfa1[i]/CSIZE+c2*c2*rfa2[i]/CSIZE);	// circular-lateral
*/
    //factor+=Math.sin(c1*rfa1[i]+c2*rfa2[i]);			// linear
    //factor+=Math.sin(c1*c1*c2*rfa1[i]/CSIZE/CSIZE+c1*c2*c2*rfa2[i]/CSIZE/CSIZE);	// circular-lateral
    //factor+=Math.sin(c1*c1*rfa1[i]/CSIZE+c2*rfa2[i]);	// circular-lateral
    //factor+=Math.sin(c1*rfa1[i]+c2*rfa2[i]);			// linear
  }
  return factor/RF;
}

var getRandomFactor3=(c1,c2)=>{
  let factor=0;
  let r=Math.pow(c1*c1+c2*c2,0.5);
  let a=Math.atan2(c1,c2);
//  factor=Math.cos(8*a)+Math.sin(r/10);
  for (let i=0; i<RF; i++) {
//let nf=i%2?8:16;
    //factor+=rfa2[i]*(Math.cos(nf*a)+Math.sin(rfa1[i]*r));
//    factor+=5*rfa1[i]*Math.cos(8*a)*Math.sin(rfa1[i]*r);
/*
if (i%2)
    factor+=rfa2[i]*Math.cos(16*a)*Math.sin(rfa1[i]*r);
    //factor+=Math.cos(32*a)+Math.sin(rfa1[i]*r);
else 
    //factor+=Math.sin(c1*rfa1[i])*Math.cos(c2*rfa2[i]);			// bilateral
    factor+=rfa2[i]*Math.cos(8*a)*Math.sin(rfa1[i]*r);
*/
    //factor+=Math.cos(16*a)+Math.sin(rfa1[i]*r);
    //factor+=Math.sin(c1*c1*rfa1[i]/CSIZE+c2*c2*rfa2[i]/CSIZE);	// circular-lateral
    //factor+=rfa1[i]*r*Math.sin(8*a)+rfa1[i]*r*Math.cos(4*a);
    factor+=Math.sin(c1*c1*rfa1[i]/CSIZE+c2*c2*rfa2[i]/CSIZE);	// circular-lateral
  }
  return factor/RF;
}

var getRandomFactor4=(c1,c2)=>{
  let factor=0;
  for (let i=0; i<RF; i++) {
    if (i%2) factor+=Math.sin(c1*rfa1[i]+c2*rfa2[i]);			// linear
    else factor+=factor+=Math.sin(c1*c1*rfa1[i]/CSIZE+c2*c2*rfa2[i]/CSIZE);	// circular-lateral
  }
  return factor/RF;
}

var getRandomFactor5=(c1,c2)=>{
  let factor=0;
  for (let i=0; i<RF; i++) {
    if (i%2) factor+=Math.sin(c1*rfa1[i])*Math.cos(c2*rfa2[i]);			// bilateral
    else factor+=Math.sin(c1*rfa1[i]+c2*rfa2[i]);			// linear
  }
  return factor/RF;
}

/*
var getRandomFactor6=(c1,c2)=>{
  let factor=0;
  for (let i=0; i<RF; i++) {
    if (i%2) factor+=Math.sin(c1*c1*rfa1[i]/CSIZE+c2*c2*rfa2[i]/CSIZE);	// circular-lateral
    else factor+=Math.sin(c1*rfa1[i])*Math.cos(c2*rfa2[i]);			// bilateral
  }
  return factor/RF;
}
*/

var getRandomFactor7=(c1,c2)=>{
  let factor=0;
  let r=Math.pow(c1*c1+c2*c2,0.5);
  let a=Math.atan2(c1,c2);
  for (let i=0; i<RF; i++) {
    if (i%2) factor+=rfa2[i]*Math.cos(16*a)*Math.sin(rfa1[i]*r);
    else factor+=rfa2[i]*Math.cos(8*a)*Math.sin(rfa1[i]*r);
  }
  return 1.5*factor;
}

var factorFunc=getRandomFactor1;
var rgb1, rgb2;
var brightness=1000;
var setColors=()=>{
brightness=600+100*RF;
  rgb1=getRandomSum(3,brightness);
  rgb1.sort((a,b)=>{ return a-b; });
  rgb2=getRandomSum(3,brightness);
  rgb2.sort((a,b)=>{ return b-a; });
}

var cpix=ctx.createImageData(2*CSIZE,2*CSIZE); 
for (let i=0; i<4*CSIZE*CSIZE; i++) cpix.data[i*4+3]=255;

var drawEM=(crc)=>{
  for (let i=-CSIZE; i<CSIZE; i++) {
    for (let j=-CSIZE; j<CSIZE; j++) {
      let loc=(i+CSIZE)*8*CSIZE+(j+CSIZE)*4;
      let q=factorFunc(i,j);
      if (q>0) {
        cpix.data[loc]=Math.round(rgb1[0]*q);
        cpix.data[loc+1]=Math.round(rgb1[1]*q);
        cpix.data[loc+2]=Math.round(rgb1[2]*q);
/*
        cpix.data[loc]=Math.round(brightness*q);
        cpix.data[loc+1]=Math.round(255*q);
        cpix.data[loc+2]=Math.round(55*q);
*/
      } else {
        cpix.data[loc]=Math.round(-rgb2[0]*q);
        cpix.data[loc+1]=Math.round(-rgb2[1]*q);
        cpix.data[loc+2]=Math.round(-rgb2[2]*q);
/*
        cpix.data[loc]=Math.round(55*q);
        cpix.data[loc+1]=Math.round(-255*q);
        cpix.data[loc+2]=Math.round(-1000*q);
*/
      }
//cpix.data[loc+1]=Math.round(Math.abs(155*q));
    }
  }
  ctx.putImageData(cpix,0,0);
  //createImageBitmap(cpix).then((ib)=>{ ctx.drawImage(ib,-CSIZE,-CSIZE); });
}

//drawEM();
start();
