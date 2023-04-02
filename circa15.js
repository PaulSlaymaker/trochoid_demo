"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/LYJMBYz
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
  c.width=2*CSIZE;
  c.height=2*CSIZE;
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
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var colors=[];
var hues=[];
var setColors=()=>{
  colors=[];
  let colorCount=4;
  let h=getRandomInt(180,300);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(150/colorCount)*i+getRandomInt(-10,10);
    let hue=(h+hd)%360;
    colors.push("hsl("+hue+",98%,54%)");
    hues.push(hue);
  }
}
setColors();

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmz=new DOMMatrix([-1,0,0,-1,0,0]);
//const dm1=new DOMMatrix([0,1,-1,0,0,0]);
const LEN=805.49;	// 120+120+3*TP/4*240/2
const count=10;

function Path(idx) {
  this.dk=TP*Math.random();
  this.dk2=600+600*Math.random();
  this.d=1+LEN/2*Math.pow(Math.cos(this.dk+t/this.dk2),2);
  this.dash=[this.d,LEN-this.d];
  this.width=8+232/(count-1)*idx;
  this.tk=TP*Math.random();
  this.tk2=800+800*Math.random();
  this.os=2*0.6*LEN*Math.sin(this.tk+t/this.tk2);
  this.dash=[this.d,LEN-this.d];
  this.path=new Path2D();
  this.path.moveTo(0,0);
  this.path.lineTo(120,0);	
  this.path.arc(120,120,120,3*TP/4,TP/2);
  this.path.lineTo(0,0);
  this.path.addPath(this.path,dmz);
  this.path.addPath(this.path,dmx);
  this.transit=()=>{
    this.d=1+0.6*LEN*Math.pow(Math.cos(this.dk+t/this.dk2),2);
    this.dash=[this.d,LEN-this.d];
    this.os=2*LEN*Math.sin(this.tk+t/this.tk2);
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
ctx.canvas.addEventListener("click", start, false);

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  for (let i=0; i<count; i++) {
    pa[i].transit();
  }
  if (t%60==0) {
    for (let i=0; i<colors.length; i++) {
      hues[i]=++hues[i]%360;
      colors[i]="hsl("+hues[i]+",98%,54%)";
    }
if (EM) stopped=true;
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();

var pa=new Array();
for (let i=0; i<count; i++) pa.unshift(new Path(i));

var draw=()=>{
  for (let i=0; i<count; i++) {
    ctx.setLineDash(pa[i].dash);
    ctx.lineDashOffset=pa[i].os;
    ctx.strokeStyle="#000000D0";
    ctx.lineWidth=pa[i].width+10;
    ctx.stroke(pa[i].path);
    ctx.strokeStyle=colors[i%colors.length];
    ctx.lineWidth=pa[i].width;
    ctx.stroke(pa[i].path);
  }
}

start();
