"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
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
ctx.transform(1,0,0,1,CSIZE,CSIZE);
ctx.lineWidth=6;
ctx.lineJoin="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

const DM1=new DOMMatrix([-1,0,0,-1,0,0]);
const DM2=new DOMMatrix([1,0,0,-1,0,0]);
const DM3=new DOMMatrix([0,1,1,0,0,0]);

function Line() {
  this.a=0;
  this.b=0;
  this.len=8;
//  this.t=0;
  this.Kx=4;
  this.Ky=4;
  this.Cx=30;
  this.Cy=30;
  this.xpol=[Math.cos,Math.sin][getRandomInt(0,2)];
  this.ypol=[Math.cos,Math.sin][getRandomInt(0,2)];
/*
  if (this.xpol==Math.sin) {
    this.ypol=Math.sin;
  } else {
    this.ypol=[Math.cos,Math.sin][getRandomInt(0,2)];
  }
*/
//console.log(this.xpol.name+" "+this.ypol.name);
  this.generatePath=()=>{
    this.path=new Path2D();
    let c=0;
//    this.pathLength=0;
    this.path.moveTo(0,0);
    let x=0;
    let y=0;
    do {
//this.a=this.Kx*Math.sin(c/this.Cx);
//this.b=this.Ky*Math.sin(c/this.Cy);
      this.a=this.Kx*Math.pow(Math.sin(c/this.Cx),2);
      this.b=this.Ky*Math.pow(Math.sin(c/this.Cy),2);
      let lx=this.len*this.xpol(this.a);
      let ly=this.len*this.ypol(this.b);
      x+=lx;
      y+=ly;
//      this.pathLength+=Math.pow(lx*lx+ly*ly,0.5);
      this.path.lineTo(x,y);
      this.x0=x;
      this.y0=y;
      if (Math.abs(x)>CSIZE+80 || Math.abs(y)>CSIZE+80) {
//console.log("size "+c+" "+this.pathLength.toFixed(0));
        break;
      }
/*
      if (c>360) {
//console.log("count"+c+" "+this.pathLength.toFixed(0));
        break;
      }
      c++;
*/
    } while(c++<360);
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

var t=0;
const k1=getRandomInt(-200,200);
const k2=getRandomInt(-200,200);
const k3=getRandomInt(-200,200);
const k4=getRandomInt(-200,200);
var stopped=true;
function animate(ts) {
  if (stopped) return;
  t++;
  line.Kx=2+10*Math.pow(Math.sin(k1+t/1130),2);
  line.Ky=2+10*Math.pow(Math.sin(k2+t/1090),2);
  line.Cx=30+10*Math.sin(k3+t/430);
  line.Cy=30+10*Math.sin(k4+t/470);
  line.generatePath();
  draw();
  if (t%90==0) { hue1=++hue1%360; colors1="hsla("+hue1+",100%,50%,0.3)"; }
  if (t%110==0) { hue2=++hue2%360; colors2="hsla("+(360-hue2)+",100%,50%,0.3)"; }
  requestAnimationFrame(animate);
if (EM && t%200==0) stopped=true;
}

onresize();
var hue1=0;
var hue2=120;
var black
var colors1="#FF000050";
var colors2="#0000FF50";
var black="#00000050";

var line=new Line();
line.generatePath();

ctx.setLineDash([100,400]);
var draw=()=>{
  let p=new Path2D(line.path);
  p.addPath(p, DM1);
  p.addPath(p, DM2);
  p.addPath(p, DM3);
  ctx.lineDashOffset=-t;
  ctx.strokeStyle=colors1;
  ctx.stroke(p);
  ctx.lineDashOffset=-t+100;
  ctx.strokeStyle=black;
  ctx.stroke(p);
  ctx.lineDashOffset=-t+200;
  ctx.strokeStyle=colors2;
  ctx.stroke(p);
  ctx.lineDashOffset=-t+300;
  ctx.strokeStyle=black;
  ctx.stroke(p);
}

start();
