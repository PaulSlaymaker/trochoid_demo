"use strict"; // Paul Slaymaker, paul25882@gmail.com
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
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=176;
  const CT=256-CBASE;
  this.getRGB=(cf)=>{
    let red=Math.round(cf*(CBASE+CT*Math.cos(this.RK2+c/this.RK1)));
    let grn=Math.round(cf*(CBASE+CT*Math.cos(this.GK2+c/this.GK1)));
    let blu=Math.round(cf*(CBASE+CT*Math.cos(this.BK2+c/this.BK1)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=10+40*Math.random();
    this.GK1=10+40*Math.random();
    this.BK1=10+40*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}
const color=new Color();

//const ka=[2,3,4,5,6,8,10,12,15,20,60];
const ka=[2,3,4,5,6,10,12,15,20,30,60];

var K1=ka[getRandomInt(0,ka.length)];
var K2=ka[getRandomInt(0,ka.length)];
var K3=ka[getRandomInt(0,ka.length)];
function Point(i) {
  this.set=()=>{
    this.m=true;
    let z=i*TP/RES;
    let f=1;
    if (i%K1) f=frac;
    else this.m=false;
    let f2=(i%K2)?frac2:1;
    let f3=(i%K3)?frac3:1;
    if (f2==1 && f3==1) this.m=false;
    this.x=f*CSIZE/2*(f2*Math.cos(z)+f2*Math.cos(11*z))+(1-f)*CSIZE/2*(f3*Math.cos(z)+f3*Math.cos(11*z));
    this.y=f*CSIZE/2*(f2*Math.sin(z)+f2*Math.sin(11*z))+(1-f)*CSIZE/2*(f3*Math.sin(z)+f3*Math.sin(11*z));
  }
}

function Line(p1,p2) {
  this.p1=p1;
  this.p2=p2;
  this.p=false;	// to segregate permanently non-drawn lines
  this.getPath=()=>{
    let p=new Path2D();
    p.moveTo((p1.x+p2.x)/2,(p1.y+p2.y)/2);
    p.lineTo(p1.x,p1.y);
    p.moveTo((p1.x+p2.x)/2,(p1.y+p2.y)/2);
    p.lineTo(p2.x,p2.y);
/*
    p.moveTo(p1.x,p1.y);
    p.lineTo(p2.x,p2.y);
*/
    return p;
  }
}

/*
function Node(x,y) {
  this.x=x;
  this.y=y;
  this.d="";  	// h,t,o
  this.type="";	// c - circle, l - link
  this.pt=[];	// positive direction paths
  this.nt=[];	// negative direction paths
  this.p=0;
}
var na=new Array(5);
let frame=new Path2D();
frame.moveTo(0,0);
frame.lineTo(CSIZE,0);
//frame.lineTo(CSIZE,CSIZE);
frame.lineTo(0,CSIZE);
frame.closePath();
*/


var drawPoint=(x,y,col,r)=>{	// diag
  ctx.beginPath();
  let rad=r?r:3;
  ctx.arc(x,y,rad,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var pauseTS=1000;
var pauseCount=0;
var pause=(ts)=>{
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
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
body.addEventListener("click", start, false);

var DUR=400;
var t=0;
var t2=0;
var c=0;
var frac=1;
var frac2=1;
var frac3=1;
var fracm=1;
var fracd=true;
var ffa=[
  ()=>{ return Math.pow(Math.cos(Math.PI*t/DUR),2); },
  ()=>{ return (1+2*Math.pow(Math.cos(Math.PI*t/DUR),2))/3; },
  ()=>{ return (1+Math.pow(Math.cos(Math.PI*t/DUR),2))/2; },
  ()=>{ return (2+Math.pow(Math.cos(Math.PI*t/DUR),2))/3; },
  ()=>{ return (3+Math.pow(Math.cos(Math.PI*t/DUR),2))/4; }
];
var ff1=ffa[0]; //getRandomInt(0,3)];
//var ff2=ffa[0]; //getRandomInt(0,3)];
//var ff3=ffa[0]; //getRandomInt(0,3)];
var ff2=ffa[getRandomInt(0,5,true)];
var ff3=ffa[getRandomInt(0,5,true)];

var animate=(ts)=>{
  if (stopped) return;
  t++,c++,t2++;
  frac=ff1(); //Math.pow(Math.cos(Math.PI*t/DUR),2);
  frac2=ff2(); //(1+Math.pow(Math.cos(Math.PI*t/DUR),2))/2;
  frac3=ff3(); //(3+Math.pow(Math.cos(Math.PI*t/DUR),2))/4;
  fracm=Math.pow(Math.cos(Math.PI*2*t2/DUR),2);
  if (t>=DUR) {	
    t=0,t2=0;
    ff1=ffa[getRandomInt(0,5,true)];
    ff2=ffa[getRandomInt(0,5,true)];
    ff3=ffa[getRandomInt(0,5,true)];
    K1=ka[getRandomInt(0,ka.length,true)];
    K2=ka[getRandomInt(0,ka.length,true)];
    K3=ka[getRandomInt(0,ka.length,true)];
    useDash=Math.random()<0.7;
    if (useDash) dash=10*getRandomInt(1,12);
    else ctx.setLineDash([]);
    pauseTS=performance.now()+2000;
    requestAnimationFrame(pause);
    if (EM) {
      stopped=true;
      parent.postMessage("lf");
    }
    return;
  } else if (t==DUR/2) {	
    t2=0;
    useDash=Math.random()<0.7;
    if (useDash) dash=10*getRandomInt(1,12);
    else ctx.setLineDash([]);
    fracd=Math.random()<0.8;
    pauseTS=performance.now()+1000;
    requestAnimationFrame(pause);
    return;
  } else draw();
  requestAnimationFrame(animate);
}

//ctx.globalCompositeOperation="destination-over";
var dash=10*getRandomInt(1,12);
var useDash=false;

var draw=()=>{
if (fracm>0.95) return;
  setPoints();
  let p=new Path2D();
  for (let i=0; i<la.length; i++) {
    if (la[i].p) continue;
    if (la[i].p1.m || la[i].p2.m) {
      p.addPath(la[i].getPath());
    }
  }
  ctx.globalAlpha=1-fracm;
  if (useDash) {
    if (fracd) ctx.setLineDash([(1-fracm)*dash,1000]);
    else ctx.setLineDash([(1-frac)*dash,1000]);
  }
  ctx.lineWidth=8;
  ctx.strokeStyle="#00000010";
  ctx.stroke(p);
//  ctx.lineWidth=2;
  ctx.lineWidth=0.6+2*(1-Math.pow(ffa[0](),8));
  ctx.strokeStyle=color.getRGB(1-Math.pow(fracm,2));
  //ctx.strokeStyle=color.getRGB(1);
  ctx.stroke(p);
}

onresize();

// cl code
// 2-color dash

// 5-24, 7-48, 9-80, 11-120, 13-168, 15-228
var RES=120;

var pa=(()=>{
  let a=new Array(RES);
  for (let i=0; i<RES; i++) a[i]=new Point(i);
  return a;
})();

var setPoints=()=>{
  for (let i=0; i<pa.length; i++) pa[i].set();
}
setPoints();

var la=(()=>{
  let a=new Array(RES);
  for (let i=0; i<RES-1; i++) {
    a[i]=new Line(pa[i],pa[i+1]);
    if (Math.abs(pa[i].x)<0.1   && Math.abs(pa[i].y)<0.1 
     || Math.abs(pa[i+1].x)<0.1 && Math.abs(pa[i+1].y)<0.1) a[i].p=true;
  }
  a[RES-1]=new Line(pa[RES-1],pa[0]);
  return a;
})();

var drawT=()=>{
  ctx.font="18px sans-serif";
  ctx.textAlign="center";
  ctx.strokeStyle="yellow";
  ctx.fillStyle="white";
  let p=new Path2D();
  p.moveTo(CSIZE,0);
  for (let i=1; i<RES; i++) {
    let z=i*TP/RES;
let f=CSIZE; //(i%2)?CSIZE:CSIZE;
    let x=f/2*(Math.cos(z)+Math.cos(11*z));
    let y=f/2*(Math.sin(z)+Math.sin(11*z));
    p.lineTo(x,y);
  //  ctx.fillText(i,x,y-6-i/20);
  //  if (i<17) ctx.fillText(i,x,y-6);
  //  if (i>72) ctx.fillText(i,x,y-6);
  }
  p.closePath();
  ctx.stroke(p);
}
//drawT();

/*
let p=new Path2D();
for (let i=0; i<la.length; i++) {
  p.addPath(la[i].getPath());
}
ctx.strokeStyle=color.getRGB();
ctx.stroke(p);
*/

var drawPoints=()=>{
  ctx.save();
  ctx.globalCompositeOperation="source-over";
  ctx.globalAlpha=1;
  for (let i=0; i<pa.length; i++) {
    if (pa[i].m) drawPoint(pa[i].x,pa[i].y);
  }
  ctx.restore();
}

start();
