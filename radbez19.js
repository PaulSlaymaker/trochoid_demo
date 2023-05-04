"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/qBJPyRd
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
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
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
/*
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
    skipLevel=2*getRandomInt(0,C/4)+1;
    rotation=0;
    t=0;
ctx.clearRect(0,0,2*CSIZE,2*CSIZE);
  }
*/

  //rotation+=0.03/C;
  rotation+=0.02/C;
  for (let i=0; i<2; i++) {
    F+=0.0024/C;
    F2+=0.0031/C;
    lines[i].setLine();
    if (i%2) lines[i].rotate(rotation);
    else lines[i].rotate(-rotation);
  }
  K=120+100*Math.sin(t/60);
  K2=120+100*Math.sin(t/70);
  color.set();
  color2.set();
  color3.set();
  draw();
  requestAnimationFrame(animate);
}

ctx.lineWidth=2;
var F=TP*Math.random();
var F2=TP*Math.random();
var R=380;
var K=120;
var K2=100;

var Line=function(idx) {
  this.a=idx*TP/C+(C/4-1)*TP/C/2;
  this.dp1=new DOMPoint();
  this.dp2=new DOMPoint();
  this.rotate=(z)=>{
    let dm2=new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),this.mx,this.my]);
    let dm3=dm2.multiply(this.dm1);
    this.dp1=this.dp1.matrixTransform(dm3);
    this.dp2=this.dp2.matrixTransform(dm3);
  }
  this.setLine=()=>{
    this.dp1.x=R*Math.cos(this.a-F);
    this.dp1.y=R*Math.sin(this.a-F);
    this.dp2.x=R*Math.cos(this.a+F2);
    this.dp2.y=R*Math.sin(this.a+F2);
    this.mx=(this.dp1.x+this.dp2.x)/2;
    this.my=(this.dp1.y+this.dp2.y)/2;
    this.dm1=new DOMMatrix([1,0,0,1,-this.mx,-this.my]);
  }
}

function Color() {
  const CBASE=159
  const CT=255-CBASE;
  this.RK1=40+40*Math.random();
  this.GK1=40+40*Math.random();
  this.BK1=40+40*Math.random();
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.set=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    this.v="rgb("+red+","+grn+","+blu+")";
  }
  this.set();
}

var color=new Color();
var color2=new Color();
var color3=new Color();

var C=4;
var lines=new Array(C);
for (let i=0; i<2; i++) lines[i]=new Line(i);

//ctx.strokeStyle="white";
//ctx.fillStyle="#00000009";
var draw=()=>{
  const dmp1=new DOMMatrix([-1,0,0,-1,0,0]);
  const dmp2=new DOMMatrix([1,0,0,-1,0,0]);
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let p=new Path2D();
  let p2=new Path2D();
  p.moveTo(lines[0].mx,lines[0].my);
  p.bezierCurveTo(lines[0].dp2.x,lines[0].dp2.y,lines[1].dp1.x,lines[1].dp1.y,lines[1].mx,lines[1].my);
  p.addPath(p,dmp1);
  p.addPath(p,dmp2);
  ctx.setLineDash([])
  ctx.lineCap="round";
  ctx.lineWidth=10;
  ctx.strokeStyle="#0000000C";
  ctx.stroke(p);
  ctx.lineCap="butt";
  ctx.lineWidth=2;
  ctx.strokeStyle=color.v;
  ctx.setLineDash([K,10000])
  ctx.stroke(p);
  ctx.strokeStyle=color2.v;
  ctx.setLineDash([0,K+12,K2,10000])
  ctx.stroke(p);
  ctx.strokeStyle=color3.v;
  ctx.setLineDash([0,K+K2+24,10000])
  ctx.stroke(p);
}

onresize();

start();
