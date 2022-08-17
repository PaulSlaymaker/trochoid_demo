"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/vYReQrp
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var hues=[];
var getHues=()=>{
  let h=[];
  let hueCount=3;
  let hue=getRandomInt(0,200);
  for (let i=0; i<hueCount; i++) {
    let hd=(hue+Math.round(240/hueCount)*i+getRandomInt(-10,10))%360;
    h.splice(getRandomInt(0,h.length+1),0,hd);
  }
  return h;
}
var hues=getHues();

var colors=[];
var setColors=()=>{
  colors[0]="hsl("+hues[0]+",80%,60%)";
  colors[1]="hsl("+hues[1]+",80%,40%)";
  colors[2]="hsl("+hues[2]+",100%,70%)";
}

var Point=function(x,y,w,z) {
  this.x=x;
  this.y=y;
  this.w=w;
  this.z=z;
}

var pm=new Map();
pm.set("0,0", new Point(0,0,0,0));

//const nodeCount=getRandomInt(3,8);
const nodeCount=6;
const axisCount=Math.pow(2,nodeCount);
const span=TP/axisCount;

var Axis=function(idx) {
  this.idx=idx;
  this.pk=new Array(nodeCount);
  this.setPoints=()=>{
    this.pk[0]="0,0";
    for (let i=1; i<nodeCount; i++) {
      let r=i*CSIZE/(nodeCount-1);
      //let r=i*CSIZE/(nodeCount-1)*(1-Math.pow(Math.cos(idx/axisCount*TP),2)/2);
      let q=axisCount/Math.pow(2,i+1);
      let z=-q*(span/2+Math.trunc(idx/q)*span);
      let x=Math.round(r*Math.cos(z));
      let y=Math.round(r*Math.sin(z));
let pk=x+","+y;
if (!pm.has(pk)) {
//  ps.add(x+","+y);
//  points.push(new Point(x,y));
  pm.set(pk,new Point(x,y,i,z));
}
      //this.pts[i]={"x":x,"y":y};
      this.pk[i]=pk;
    }
  }
this.setPoints();
  this.setPath=()=>{
    this.path=new Path2D();
    let pt=pm.get(this.pk[0]);
    this.path.moveTo(pt.x,pt.y);
    this.ppth=new Path2D();
    this.ppth.moveTo(pt.x+3,pt.y);
    this.ppth.arc(pt.x,pt.y,3,0,TP);
//let q=getRandomInt(0,this.pts.length+1);
    for (let i=1; i<this.pk.length; i++) {
      pt=pm.get(this.pk[i]);
      this.path.lineTo(pt.x,pt.y);
this.ppth.moveTo(pt.x+3,pt.y);
this.ppth.arc(pt.x,pt.y,3,0,TP);
    }
  }
}

var axes=new Array(axisCount);

for (let i=0; i<axes.length; i++) {
  axes[i]=new Axis(i);
  axes[i].setPath();
}

ctx.fillStyle="red";
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
let pointPath=new Path2D();
let perimPath=new Path2D();
ctx.globalAlpha=0.6;
ctx.lineWidth=5;
  for (let i=0; i<axes.length; i++) {
pointPath.addPath(axes[i].ppth);
    ctx.stroke(axes[i].path);
ctx.fillStyle=colors[0];
ctx.fill(axes[i].path);
//    ctx.fill(axes[i].ppth);
//let pt1=pm.get(axes[i].pk[axes[i].pk.length-1]);
//let i1=(i+1)%axes.length;
//let pt2=pm.get(axes[i1].pk[axes[i1].pk.length-1]);
//perimPath.moveTo(pt1.x,pt1.y);
//perimPath.lineTo(pt2.x,pt2.y);
//ctx.stroke();
  }
//  ctx.stroke(perimPath);
  ctx.lineWidth=4;
  ctx.stroke(pointPath);
  ctx.globalAlpha=1;
  ctx.fillStyle=colors[2];
  ctx.fill(pointPath);
}

var m1=getRandomInt(1,9);
var m2=getRandomInt(1,9);
var k1=[-1,1][getRandomInt(0,2)];
var k2=[-1,1][getRandomInt(0,2)];

var transit=()=>{
  m1=m2;
  m2=getRandomInt(1,9);
  k1=k2;
  k2=[-1,1][getRandomInt(0,2)];
}

var setPoints=()=>{
  pm.forEach((pt)=>{
    //let f=(1-Math.pow(Math.sin(1*pt.z+t/600*TP),2)/2);
    //let f=1-Math.pow(Math.sin(pt.z*(1+t/100),2)/3);
    //let f2=(1-Math.pow(Math.sin(2*pt.z+t/600*TP),8)/3);
    let f=(2+Math.sin(m1*pt.z+k1*t/300*TP))/3;
    let f2=(2+Math.sin(m2*pt.z+k2*t/300*TP))/3;
    //let f2=(1-Math.pow(Math.cos(pt.z-t/600*TP)*Math.sin(1*pt.z-t/400*TP),2)/2);
    //let r=pt.w*CSIZE/(nodeCount-1)*f*f2;
    let r=pt.w*CSIZE/(nodeCount-1)*((1-frac)*f+frac*f2);
    //let r=pt.w*CSIZE/(nodeCount-1);
    pt.x=Math.round(r*Math.cos(pt.z));
    pt.y=Math.round(r*Math.sin(pt.z));
  });
  for (let i=0; i<axes.length; i++) {
    axes[i].setPath();
  }
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

var stopped=true;
var t=0;
var dt=0;
var frac=0;
function animate(ts) {
  if (stopped) return;
  t++;
  dt++;
  if (dt>1000) {
    transit();
    dt=0; 
  }
  frac=dt/1000;
  setPoints();
  if (t%30==0) {
    hues[0]=++hues[0]%360;
    hues[1]=++hues[1]%360;
    hues[2]=++hues[2]%360;
    setColors();
  }
 
  draw();
  requestAnimationFrame(animate);
}

onresize();

setColors();
ctx.strokeStyle=colors[1];
setPoints();

start();
