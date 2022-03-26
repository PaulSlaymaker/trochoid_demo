"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const CSIZE=420;

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

var getRandomMultiplier=()=>{
  //return [8,4,16,32][getRandomInt(0,4,true)];
  return [4,8,2,16,12,0,20,24][getRandomInt(0,8,true)];
}

var stopped=true;
var tr=getRandomInt(0,2000);
var tg=getRandomInt(0,2000);
var tb=getRandomInt(0,2000);
var ttr=getRandomInt(0,2000);
var ttg=getRandomInt(0,2000);
var ttb=getRandomInt(0,2000);
var S=0;
function animate(ts) {
  if (stopped) return;
  tr++; tg++; tb++;
  ttr++; ttg++; ttb++;
  rot+=0.007;
  rf=Math.sin(tr/400)/50;
  gf=Math.sin(tg/420)/50;
  bf=Math.sin(tb/380)/50;
  let ttrs=ttr%400;
  if (ttrs==300) rm1=getRandomMultiplier();
  else if (ttrs==100) rm2=getRandomMultiplier();
  ffr=(1+Math.sin(TP*ttr/400))/2;
  let ttgs=ttg%400;
  if (ttgs==300) gm1=getRandomMultiplier();
  else if (ttgs==100) gm2=getRandomMultiplier();
  ffg=(1+Math.sin(TP*ttg/400))/2;
  let ttbs=ttb%400;
  if (ttbs==300) bm1=getRandomMultiplier();
  else if (ttbs==100) bm2=getRandomMultiplier();
  ffb=(1+Math.sin(TP*ttb/400))/2;
  drawEM();
  requestAnimationFrame(animate);
}

onresize();

var rf=0;
var gf=0;
var bf=0;

var rm1=getRandomMultiplier();
var rm2=getRandomMultiplier();
var gm1=getRandomMultiplier();
var gm2=getRandomMultiplier();
var bm1=getRandomMultiplier();
var bm2=getRandomMultiplier();
/*
var rm2=[8,4,16,32][getRandomInt(0,4,true)];
var gm1=[8,4,16,32][getRandomInt(0,4,true)];
var gm2=[8,4,16,32][getRandomInt(0,4,true)];
var bm1=[8,4,16,32][getRandomInt(0,4,true)];
var bm2=[8,4,16,32][getRandomInt(0,4,true)];
*/

var rot=0;
var sq=CSIZE/3;
var ffr=0;
var ffg=0;
var ffb=0;
var cpix1=ctx.createImageData(sq,sq); 
for (let i=0; i<sq*sq; i++) cpix1.data[i*4+3]=255;
var cpix2=ctx.createImageData(sq,sq); 
for (let i=0; i<sq*sq; i++) cpix2.data[i*4+3]=255;

var drawEM=(crc)=>{
  for (let i=0; i<sq; i++) {
    for (let j=0; j<sq; j++) {
      let x=i-sq/2;
      let y=j-sq/2;
      let r=Math.pow(x*x+y*y,0.5);
      let a1=Math.atan2(y,x)+rot;
      let a2=Math.atan2(y,x)-rot;
      //let r=Math.pow(Math.abs(x)+Math.abs(y),exp);	// diamond
      ////let r=Math.pow(Math.abs(x*y*y),exp);
      //let r=Math.pow(x*x*y*y,exp);	// more quads
      //let r=Math.pow(Math.abs(x*y),exp);	// quadrants
      //let r=Math.pow(Math.abs(x*x/y)+Math.abs(y*y/x),exp);	// quadrants, needs cm 2-20?
      //let r=Math.pow(Math.abs(x*x*y)+Math.abs(y*y*x),exp);	// diamond
      //let qr1=Math.round(255*(Math.sin(TP*r/rf)+Math.pow(Math.cos(rm*a1),3))/2);
      //let qr2=Math.round(255*(Math.sin(TP*r/rf)+Math.pow(Math.cos(rm*a2),3))/2);
      //let qr1=Math.round(255*(Math.sin(TP*r/rf)+Math.pow(Math.abs(Math.cos(rm*a1)),5))/2);
      //let qr2=Math.round(255*(Math.sin(TP*r/rf)+Math.pow(Math.abs(Math.cos(rm*a2)),5))/2);
      let qr1=Math.round(111+112*(Math.cos(TP*r*rf)+ffr*Math.cos(rm1*a1)+(1-ffr)*Math.cos(rm2*a1))/2);
      let qr2=Math.round(111+112*(Math.cos(TP*r*rf)+ffr*Math.cos(rm1*a2)+(1-ffr)*Math.cos(rm2*a2))/2);
      let qg1=Math.round(111+112*(Math.cos(TP*r*gf)+ffg*Math.cos(gm1*a1)+(1-ffg)*Math.cos(gm2*a1))/2);
      let qg2=Math.round(111+112*(Math.cos(TP*r*gf)+ffg*Math.cos(gm1*a2)+(1-ffg)*Math.cos(gm2*a2))/2);
      let qb1=Math.round(111+112*(Math.cos(TP*r*bf)+ffb*Math.cos(bm1*a1)+(1-ffb)*Math.cos(bm2*a1))/2);
      let qb2=Math.round(111+112*(Math.cos(TP*r*bf)+ffb*Math.cos(bm1*a2)+(1-ffb)*Math.cos(bm2*a2))/2);
//      let qr1=Math.round(112+111*(Math.cos(TP*r*rf)+Math.cos(rm*a1))/2);
//      let qr2=Math.round(112+111*(Math.cos(TP*r*rf)+Math.cos(rm*a2))/2);
//      let qg1=Math.round(127+128*(Math.cos(TP*r*gf)+Math.cos(gm*a1))/2);
//      let qg2=Math.round(127+128*(Math.cos(TP*r*gf)+Math.cos(gm*a2))/2);
//      let qb1=Math.round(127+128*(Math.cos(TP*r*bf)+Math.cos(bm*a1))/2);
//      let qb2=Math.round(127+128*(Math.cos(TP*r*bf)+Math.cos(bm*a2))/2);
      cpix1.data[(i*4*sq)+j*4]=  qr1;
      cpix2.data[(i*4*sq)+j*4]=  qr2;
      cpix1.data[(i*4*sq)+j*4+1]=qg1;
      cpix2.data[(i*4*sq)+j*4+1]=qg2;
      cpix1.data[(i*4*sq)+j*4+2]=qb1;
      cpix2.data[(i*4*sq)+j*4+2]=qb2;
//      cpix1.data[(i*4*sq)+j*4+3]=255;
//      cpix2.data[(i*4*sq)+j*4+3]=255;
    }
  }
  for (let i=0; i<8; i++) {
    for (let j=0; j<8; j++) {
      if ((i+j)%2) ctx.putImageData(cpix1,sq*i,sq*j);
      else ctx.putImageData(cpix2,sq*i,sq*j);
    }
  }
}

start();
