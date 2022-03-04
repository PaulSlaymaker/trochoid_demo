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

var sq=2*CSIZE;

var getImageData=()=>{
  let pixd=ctx.createImageData(sq,sq); 
  let rm=Math.pow(2,getRandomInt(2,6,true));
  let gm=Math.pow(2,getRandomInt(2,6,true));
  let bm=Math.pow(2,getRandomInt(2,6,true));
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
}

//var pattern;
//var patterns=new Array(2);
//  const dmr=new DOMMatrix([1,0,0,1,-CSIZE,-CSIZE]);
var setPattern=(n)=>{
  let pixd=getImageData();
  createImageBitmap(pixd).then((ib)=>{ 
    //patterns[n]=ctx.createPattern(ib,"no-repeat");
//    patterns[n].setTransform(dmr);
    ctx.strokeStyle=ctx.createPattern(ib,"no-repeat");
/*
ctx.fillStyle=patterns[n];
//ctx.translate(CSIZE,CSIZE);
ctx.translate(-CSIZE,-CSIZE);
ctx.fillRect(0,0,2*CSIZE,2*CSIZE);
//ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
draw();
*/
  });
}

var drawPoint=(pt,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(pt.x,pt.y,4,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var drawPoint2=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,4,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
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

var rotation=0;
var stopped=true;
var t=0;
var duration=1600;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t%duration==0) { 
    C=[16,8,32][getRandomInt(0,3,true)];
    R=220+160*Math.random();
    R2=220+160*Math.random();
    F=TP*Math.random();
    F2=TP*Math.random();
    for (let i=0; i<C; i++) {
      lines[i].a=i*TP/C+(C/4-1)*TP/C/2;
      lines[i].setLine();
    }
    setPattern(); 
    skipLevel=2*getRandomInt(0,C/4)+1;
    rotation=0;
    t=0;
ctx.clearRect(0,0,2*CSIZE,2*CSIZE);
  }

//rotation+=TP/2000;
rotation+=0.06/C;
for (let i=0; i<C; i++) {
  //F=TP*Math.sin(t/1000);
  //F+=0.0002;
  //F2+=0.0002;
  F+=0.002/C;
  F2+=0.002/C;
  lines[i].setLine();
  if (i%2) lines[i].rotate(rotation);
  else lines[i].rotate(-rotation);
}

/*
  for (let i=0; i<C; i++) {
    if (i%2) lines[i].rotate(TP/1500);
    //if (i%4<2) lines[i].rotate(TP/1500);	// no sym at any C?
    else lines[i].rotate(-TP/1500);
  }
*/

  //ctx.lineWidth=3*(1-Math.cos(TP*t/duration));
  ctx.lineWidth=3*(1-Math.pow(Math.cos(TP*t/duration),5));
  draw();
  requestAnimationFrame(animate);
}

onresize();
ctx.lineWidth=0;
var C=[16,8,32][getRandomInt(0,3,true)];
C=16;
var F=(TP+10*Math.random())/12;
var F2=(TP+10*Math.random())/12;
//const RR={8:220,16:220,32:220};
//var R=RR[C]+200*Math.random();	// 360 for C16, ?300 for C32
var R=220+200*Math.random();	
var R2=220+200*Math.random();
//var k=2.29/4;

var Line=function(idx) {
  this.a=idx*TP/C+(C/4-1)*TP/C/2;	// could use binary unequal a, with C split/merge, but not compatible with pattern stroke
  this.dp1=new DOMPoint();
  this.dp2=new DOMPoint();
  this.rotate=(z)=>{
    //let dm1=new DOMMatrix([1,0,0,1,-this.mx,-this.my]);
    //let dm2=new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),0,0]);
    let dm2=new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),this.mx,this.my]);
    let dm3=dm2.multiply(this.dm1);
    this.dp1=this.dp1.matrixTransform(dm3);
    this.dp2=this.dp2.matrixTransform(dm3);
  }
  this.setLine=()=>{
    let f=C>8?(idx%4<2)?F:F2:F;
    let r=C>8?(idx%4<2)?R:R2:R;
    this.dp1.x=r*Math.cos(this.a-f)+CSIZE;
    this.dp1.y=r*Math.sin(this.a-f)+CSIZE;
    this.dp2.x=r*Math.cos(this.a+f)+CSIZE;
    this.dp2.y=r*Math.sin(this.a+f)+CSIZE;
    this.mx=(this.dp1.x+this.dp2.x)/2;
    this.my=(this.dp1.y+this.dp2.y)/2;
    this.dm1=new DOMMatrix([1,0,0,1,-this.mx,-this.my]);
  }
}

// lines.length (always 32) vs C
var lines=new Array(32);
for (let i=0; i<32; i++) lines[i]=new Line(i);

var skipLevel=2*getRandomInt(0,C/4)+1;

ctx.fillStyle="#00000009";
var draw=()=>{
  ctx.fillRect(0,0,2*CSIZE,2*CSIZE);
  let p=new Path2D();
//  let p2=new Path2D();
  p.moveTo(lines[0].mx,lines[0].my);
//  p2.moveTo(lines[0].mx,lines[0].my);
//  for (let i=0; i<lines.length; i++) {
//    let i1=(i+1)%lines.length;
  for (let i=0; i<skipLevel*C; i+=skipLevel) {
    let i0=(i)%C;
    let i1=(i+skipLevel)%C;
    p.bezierCurveTo(lines[i0].dp2.x,lines[i0].dp2.y,lines[i1].dp1.x,lines[i1].dp1.y,lines[i1].mx,lines[i1].my);
//    p2.bezierCurveTo(lines[i0].dp1.x,lines[i0].dp1.y,lines[i1].dp2.x,lines[i1].dp2.y,lines[i1].mx,lines[i1].my);
//drawPoint2(lines[i0].mx,lines[i0].my,"white");
//drawPoint(lines[i].dp2,"blue");
  }
//ctx.strokeStyle=patterns[0];
  ctx.stroke(p);
//ctx.lineWidth=1;
//ctx.strokeStyle="silver";
//ctx.stroke(p);

//ctx.strokeStyle=patterns[1];
//  ctx.stroke(p2);
}

setPattern();
start();
