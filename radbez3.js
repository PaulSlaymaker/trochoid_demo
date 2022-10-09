"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/XWzPoaa
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=360;

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
ctx.lineCap="round";

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

let hue=getRandomInt(0,360);

var SQC=3;
var sq=2*CSIZE/SQC;

var getImageData=()=>{
  let pixd=ctx.createImageData(sq,sq); 
  let rm=Math.pow(2,getRandomInt(2,5,true));
  let gm=Math.pow(2,getRandomInt(2,5,true));
  let bm=Math.pow(2,getRandomInt(2,5,true));
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

var pattern;
//const dm3=new DOMMatrix([1,0,0,1,-CSIZE/SQC,-CSIZE/SQC]);
var setPattern=(n)=>{
  let pixd=getImageData();
  createImageBitmap(pixd).then((ib)=>{ 
    pattern=ctx.createPattern(ib,"no-repeat");
///TRANS
//    pattern.setTransform(dm3);
//ctx.fillRect(0,0,2*CSIZE,2*CSIZE);
//ctx.strokeStyle=pattern;
  });
}
setPattern();

var drawPoint=(pt,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(pt.x,pt.y,10,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var C=8;

var pts=[];
var ca=[];
var cb=[];
var r=CSIZE/SQC;
var r2=CSIZE/SQC*Math.random();
var cr=CSIZE+1.5*CSIZE*Math.random();
var cr2=566+600*Math.random();

var initPoints=()=>{
  for (let i=0; i<C; i++) {
    let rx=(i%2)?r2:r;
    let crx=(i%2)?cr2:cr;
    let aoc=Math.acos(rx/crx);
    let z=i*TP/C+TP/C;
    let za=z-aoc;
    let zb=z+aoc;
    pts.push({"x":rx*Math.sin(z),"y":rx*Math.cos(z)});
    ca.push({"x":crx*Math.sin(za),"y":crx*Math.cos(za)});
    cb.push({"x":crx*Math.sin(zb),"y":crx*Math.cos(zb)});	
  }
}
initPoints();

const R2R=Math.round(CSIZE/SQC*Math.pow(2,0.5)/2);

var setPoints2=()=>{
  //r=240+160*Math.cos(TP*t/1800);
  r2=R2R+R2R*Math.sin(TP*t/1700);
  cr=3*CSIZE/SQC/2+CSIZE/SQC/2*Math.sin(TP*t/1500);
  cr2=3*R2R+CSIZE/SQC/2*Math.cos(TP*t/1300);
//  r=2*mp;
//  let cr=r*(Math.pow(Math.cos(TP*t/3200),2));
  //r=2*mp*(Math.pow(Math.cos(TP*t/3200),2));	// 282=CSIZE/4*sqrt(2)
//let mr=189;
//r=mr*(1+Math.cos(t/100+TP/2));	// 282=100*sqrt(2)
//  let aoc=Math.acos(r/cr);
  for (let i=0; i<8; i++) {
    let rn=(i%2)?r2:r;
    let crn=(i%2)?cr2:cr;
    let aoc=Math.acos(rn/crn);
    let z=i*TP/8;
    let za=z-aoc;
    let zb=z+aoc;
/*
    pts[i].x=rn*Math.sin(z);
    pts[i].y=rn*Math.cos(z);
    ca[i].x=crn*Math.sin(za);
    ca[i].y=crn*Math.cos(za);
    cb[i].x=crn*Math.sin(zb);
    cb[i].y=crn*Math.cos(zb);
*/
////TRANS
    pts[i].x=rn*Math.sin(z)+CSIZE/3;
    pts[i].y=rn*Math.cos(z)+CSIZE/3;
    ca[i].x=crn*Math.sin(za)+CSIZE/3;
    ca[i].y=crn*Math.cos(za)+CSIZE/3;
    cb[i].x=crn*Math.sin(zb)+CSIZE/3;
    cb[i].y=crn*Math.cos(zb)+CSIZE/3;
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
function animate(ts) {
  if (stopped) return;
  t++;
if (t%1200==300) {
//  console.log(t+" "+42+22*Math.sin(TP*t/400));
   setPattern();
if (EM) stopped=true;
}
  setPoints2();
//ctx.strokeStyle="hsl("+Math.round((t/20)%360)+",100%,50%)";
//ctx.lineDashOffset=t;
  draw();
//stopped=true;
  requestAnimationFrame(animate);
}

let k=CSIZE/3;
var symSet=[
  new DOMMatrix([1,0,0,1,0,0]),
  new DOMMatrix([1,0,0,-1,0,2*k]),
  new DOMMatrix([-1,0,0,-1,2*k,2*k]),
  new DOMMatrix([-1,0,0,1,2*k,0]),
  new DOMMatrix([0,1,-1,0,2*k,0]),
  new DOMMatrix([0,-1,-1,0,2*k,2*k]),
  new DOMMatrix([0,-1,1,0,0,2*k]),
  new DOMMatrix([0,1,1,0,0,0])
];

ctx.fillStyle="#00000005";
//ctx.globalCompositeOperation="destination-over";
var bezWidth=42;

var draw=()=>{
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  //ctx.fillRect(-CSIZE+sq,-CSIZE+sq,sq,sq);
////TRANS
  ctx.fillRect(0,0,sq,sq);
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let bPath=new Path2D();
//  ctx.beginPath();
  bPath.moveTo(pts[0].x,pts[0].y);
  //for (let i=0; i<ca.length; i++) {
  for (let i=0; i<C; i++) {
    let i1=(i+1)%ca.length;
    bPath.bezierCurveTo(ca[i].x,ca[i].y,cb[i1].x,cb[i1].y,pts[i1].x,pts[i1].y);
    //ctx.bezierCurveTo(ca[i1].x,ca[i1].y,cb[i].x,cb[i].y,pts[i].x,pts[i].y);
  }
  ctx.setLineDash([]);
  ctx.strokeStyle=pattern;
  //ctx.lineWidth=bezWidth;
  ctx.lineWidth=42+22*Math.sin(TP*t/400);
  ctx.stroke(bPath);
  ctx.strokeStyle="#303030";
  ctx.lineWidth=20;
  ctx.stroke(bPath);
  ctx.strokeStyle="white";
  ctx.lineWidth=1;
  ctx.stroke(bPath);

  let pz=new Path2D();
  for (let i=0; i<symSet.length; i++) pz.addPath(bPath,symSet[i]);
  //ctx.setLineDash([300,100000]);
  ctx.setLineDash([60,50000]);
  //ctx.lineDashOffset=-2500+2000*Math.cos(t/1200);
  ctx.lineDashOffset=-1000+800*Math.sin(t/700);
  ctx.strokeStyle="black";
  ctx.lineWidth=20;
  ctx.stroke(pz);
  ctx.strokeStyle="hsl("+Math.round((hue+t/10)%360)+",100%,60%)";
  ctx.lineWidth=14;
  ctx.stroke(pz);

  for (let i=0; i<SQC; i++) {
    for (let j=0; j<SQC; j++) {
//    if (i==1 && j==1) continue;	// (C-1)/2
///TRANS
    if (i==0 && j==0) continue;	// (C-1)/2
//      ctx.clearRect(-CSIZE+i*sq,-CSIZE+j*sq,sq,sq);
//	// img source parms not transformed, 4 is (C-1)?
//      ctx.drawImage(ctx.canvas,2*CSIZE/SQC,2*CSIZE/SQC,sq,sq,-CSIZE+i*sq,-CSIZE+j*sq,sq,sq);	
///TRANS
      ctx.clearRect(i*sq,j*sq,sq,sq);
      ctx.drawImage(ctx.canvas,0,0,sq,sq,i*sq,j*sq,sq,sq);	
    }
  }
}

onresize();

start();
