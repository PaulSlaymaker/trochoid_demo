"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const S60=Math.sin(Math.PI/3);
const CSIZE=400;

const ctx=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

const ctxm=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  let context=c.getContext("2d");
  context.translate(CSIZE,CSIZE);
  let rg=context.createRadialGradient(0,0,0,0,0,CSIZE);
  rg.addColorStop(0,"#00000000");
  rg.addColorStop(0.8,"#00000010");
  rg.addColorStop(1,"black");
  context.fillStyle=rg;
  context.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  return context;
})();

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="0 auto";
  co.append(ctx.canvas);
  co.append(ctxm.canvas);
  body.append(co);
  return co;
})();

const ctxo=(()=>{
  let c=document.createElement("canvas");
  c.width=CSIZE;
  c.height=CSIZE;
  return c.getContext("2d");
})();
const Y=ctxo.canvas.height/2;
ctxo.translate(0,Y);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.width=container.style.height=D+"px";
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
  ctxm.canvas.style.width=ctxm.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

const dm=new DOMMatrix([1,0,0,-1,0,0]);

var drawPointo=(x,y,col,r)=>{	// diag
  ctxo.beginPath();
  if (r) ctxo.arc(x,y,r,0,TP);
  else ctxo.arc(x,y,3,0,TP);
  ctxo.closePath();
  if (col) ctxo.fillStyle=col;
  else ctxo.fillStyle="red";
  ctxo.fill();
}

function Brush() {
  this.F1=0.6+0.8*Math.random();
  this.F2=0.6+0.8*Math.random();
  this.R1=TP*Math.random();
  this.R2=TP*Math.random();
  this.R3=TP*Math.random();
  //const CBASE=159;
const CBASE=143;
//const CBASE=127;
  const CT=255-CBASE;
  this.RK1=20+20*Math.random();
  this.GK1=20+20*Math.random();
  this.BK1=20+20*Math.random();
  this.RK2=160+40*Math.random();
  this.GK2=160+40*Math.random();
  this.BK2=160+40*Math.random();
//  this.RK3=TP*Math.random();
//  this.GK3=TP*Math.random();
//  this.BK3=TP*Math.random();
  this.KD1=TP*Math.random();
  this.KD2=120+20*Math.random();
  this.move=()=>{
    this.path=new Path2D();
    let RX=CSIZE/2-40;
    let x1=RX+RX*Math.sin(t/200+this.R1);
    this.path.moveTo(x1,0);
    let x2=CSIZE*Math.cos(this.F1*t/300+this.R2);
    let y2=CSIZE*Math.sin(this.F2*t/270+this.R3);
    this.path.lineTo(x2,y2);
    this.path.addPath(this.path,dm);
    let red=Math.round(CBASE+CT*Math.cos(t/this.RK1+6*Math.sin(t/this.RK2)));
    let grn=Math.round(CBASE+CT*Math.cos(t/this.GK1+6*Math.sin(t/this.GK2)));
    let blu=Math.round(CBASE+CT*Math.cos(t/this.BK1+6*Math.cos(t/this.BK2)));
    this.color="rgb("+red+","+grn+","+blu+")";
    let ld1=100+100*Math.sin(t/this.KD2+this.KD1);
    let ld2=400-ld1;
    this.dash=[ld1,ld2];
  }
  this.draw=()=>{
    ctxo.setLineDash(this.dash);
    ctxo.lineCap="round";
    ctxo.lineWidth=10;
    ctxo.strokeStyle="#0000000C";
    ctxo.stroke(this.path);
    ctxo.lineCap="butt";
    ctxo.lineWidth=2;
    ctxo.strokeStyle=this.color;
    ctxo.stroke(this.path);
  }
  this.move();
}

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
container.addEventListener("click", start, false);

//var brush2=new Brush();
//var brush3=new Brush();

var t=getRandomInt(0,100);
var stopped=true;
function animate(ts) {
  if (stopped) return;
  t++;
  draw();
  requestAnimationFrame(animate);
}

var aclip=new Path2D();
aclip.moveTo(0,0);
aclip.lineTo(CSIZE*Math.cos(-TP/12),CSIZE*Math.sin(-TP/12));
aclip.arc(0,0,CSIZE,-TP/12,TP/12);
aclip.closePath();
ctxo.clip(aclip);

var drawPath=(d)=>{
  ctxo.setLineDash(d.dash);
  ctxo.lineCap="round";
  ctxo.lineWidth=10;
  ctxo.strokeStyle="#0000000C";
  ctxo.stroke(d.path);
  ctxo.lineCap="butt";
  ctxo.lineWidth=2;
  ctxo.strokeStyle=d.color;
  ctxo.stroke(d.path);
}

const brushes=[new Brush(),new Brush(),new Brush()];

var draw=()=>{
  brushes.forEach((b)=>{ b.move(); b.draw(); });
  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  ctx.drawImage(ctxo.canvas,0,-Y);
  ctx.setTransform(0.5,S60,-S60,0.5,CSIZE,CSIZE);
  ctx.drawImage(ctxo.canvas,0,-Y);
  ctx.setTransform(-0.5,S60,-S60,-0.5,CSIZE,CSIZE);
  ctx.drawImage(ctxo.canvas,0,-Y);
  ctx.setTransform(-1,0,0,1,CSIZE,CSIZE);
  ctx.drawImage(ctxo.canvas,0,-Y);
  ctx.setTransform(-0.5,-S60,S60,-0.5,CSIZE,CSIZE);
  ctx.drawImage(ctxo.canvas,0,-Y);
  ctx.setTransform(0.5,-S60,S60,0.5,CSIZE,CSIZE);
  ctx.drawImage(ctxo.canvas,0,-Y);
}

onresize();

start();
