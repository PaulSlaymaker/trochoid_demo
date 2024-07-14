"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S6=Math.sin(Math.PI/3);
const S4=Math.sin(Math.PI/4);
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

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=160;
  const CT=255-CBASE;
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(o+this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(o+this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(o+this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=20+80*Math.random();
    this.GK1=20+80*Math.random();
    this.BK1=20+80*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();

const EDGE=75; //CSIZE/2;
//const x0=0.577*S4*EDGE/2;
const x0=S4*EDGE/2/Math.pow(3,0.5);
const y0=x0;

function Point() {
  this.randomize=()=>{
    this.K1=400+400*Math.random();
    this.K2=TP*Math.random();
  }
  this.randomize();
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

//var DUR=200;
var t=0;
//var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
//  c++;
  draw();
if (EM && t%200==0) stopped=true
//  container.firstChild.style.opacity=1-c/DUR;
/*
  if (t%DUR==0) {
    c=0;
//    cycle();
//stopped=true
  }
*/
  requestAnimationFrame(animate);
}

var drawPoint=(x,y,col)=>{	// diag
  let ctx=container.lastChild.ctx;
  ctx.beginPath();
  ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

const p1=new Point();
p1.x=0;
p1.setLocation=()=>{
  p1.y=S4*EDGE*(1+0.95*Math.sin(p1.K2+TP*t/p1.K1))/2;	// 0.95 to avoid bezier artefacts
}
const p2=new Point();
p2.y=0;
p2.setLocation=()=>{
  p2.x=S4*EDGE*(1+0.95*Math.sin(p2.K2+TP*t/p2.K1))/2;
}
const p3=new Point();
p3.setLocation=()=>{
  p3.x=S4*EDGE*(1+0.95*Math.sin(p3.K2+TP*t/p3.K1))/2;
  p3.y=S4*EDGE-p3.x;
}

var locate=()=>{
  p1.setLocation();
  p2.setLocation();
  p3.setLocation();
}

/*
var dash1;
var dash2;
var KD2=TP*Math.random();
*/

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);

/*
var tri=new Path2D();
tri.moveTo(0,0);
tri.lineTo(S4*EDGE,0);
tri.lineTo(0,S4*EDGE);
tri.closePath();
*/

//const S8=Math.sin(TP/16);

const dmsy2=new DOMMatrix([1,0,0,2*S4+1,0,0]);

const dmr1=new DOMMatrix([Math.cos(1*TP/8),Math.sin(1*TP/8),-Math.sin(1*TP/8),Math.cos(1*TP/8),0,0]);
const dmr2=new DOMMatrix([Math.cos(2*TP/8),Math.sin(2*TP/8),-Math.sin(2*TP/8),Math.cos(2*TP/8),0,0]);
const dmr3=new DOMMatrix([Math.cos(3*TP/8),Math.sin(3*TP/8),-Math.sin(3*TP/8),Math.cos(3*TP/8),0,0]);
const dmr4=new DOMMatrix([Math.cos(4*TP/8),Math.sin(4*TP/8),-Math.sin(4*TP/8),Math.cos(4*TP/8),0,0]);
const dmr5=new DOMMatrix([Math.cos(5*TP/8),Math.sin(5*TP/8),-Math.sin(5*TP/8),Math.cos(5*TP/8),0,0]);
const dmr6=new DOMMatrix([Math.cos(6*TP/8),Math.sin(6*TP/8),-Math.sin(6*TP/8),Math.cos(6*TP/8),0,0]);
const dmr7=new DOMMatrix([Math.cos(7*TP/8),Math.sin(7*TP/8),-Math.sin(7*TP/8),Math.cos(7*TP/8),0,0]);

var draw=()=>{
//  let ctx=container.lastChild.ctx;
//  dash1=200-200*Math.cos(TP/2*c/DUR);
//  dash2=480-400*Math.sin(KD2+TP*t/4000);
//  ctx.setLineDash([1+CSIZE*c/DUR,2000]);
 // ctx.setLineDash([dash1,dash2]);
//  ctx.lineDashOffset=-t/40;
//  ctx.lineDashOffset=-c/40;
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  ctx.fillStyle="#00000020";
//  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);

  locate();
  let p=new Path2D();
  p.moveTo(p1.x,p1.y);
  p.bezierCurveTo(x0,y0,x0,y0,p2.x,p2.y);
  //p.quadraticCurveTo(x0,y0,p2.x,p2.y);
//  p.moveTo(p2.x,p2.y);
  p.bezierCurveTo(x0,y0,x0,y0,p3.x,p3.y);
  //p.quadraticCurveTo(x0,y0,p3.x,p3.y);
//  p.moveTo(p3.x,p3.y);
  p.bezierCurveTo(x0,y0,x0,y0,p1.x,p1.y);
  //p.quadraticCurveTo(x0,y0,p1.x,p1.y);
/*
  p.lineTo(p2.x,p2.y);
  p.lineTo(p3.x,p3.y);
  p.closePath();
*/

  const os=EDGE/2/Math.tan(TP/16);
  const dmos=new DOMMatrix([1,0,0,1,os,os]);

  const dma=dmsy2.multiply(dmy.multiply(dmr1));	// vertical form octogon
  const dmb=dmx.multiply(dma);			// flipped x

  const dmt0=dmos.multiply(dmb);
  const dmt1=dmos.multiply(dmr1.multiply(dma));
  const dmt2=dmos.multiply(dmr2.multiply(dmb));
  const dmt3=dmos.multiply(dmr3.multiply(dma));
  const dmt4=dmos.multiply(dmr4.multiply(dmb));
  const dmt5=dmos.multiply(dmr5.multiply(dma));
  const dmt6=dmos.multiply(dmr6.multiply(dmb));
  const dmt7=dmos.multiply(dmr7.multiply(dma));

/*
let dmt5=dmos.multiply(dmr4.multiply(dmb));
let dmt2=dmos.multiply(dmr6.multiply(dmb));
let dmt3=dmos.multiply(dmr5.multiply(dma));
let dmtz=dmos.multiply(dmr2.multiply(dmb));
*/


//let dmr=new DOMMatrix([Math.cos(-3*TP/8),Math.sin(-3*TP/8),-Math.sin(-3*TP/8),Math.cos(-3*TP/8),0,0]);

//console.log(dmt2);

  let path2=new Path2D();
  path2.addPath(p,dmt0);
  path2.addPath(p,dmt1);
  path2.addPath(p,dmt2);
  path2.addPath(p,dmt3);
  path2.addPath(p,dmt4);
  path2.addPath(p,dmt5);
  path2.addPath(p,dmt6);
  path2.addPath(p,dmt7);

  
  const os2=(2*S4+1)*EDGE;
  let paths=new Path2D();
  paths.addPath(p);
  paths.addPath(p,new DOMMatrix([1,0,0,1,os2,0]).multiply(dmr2));
  paths.addPath(p,new DOMMatrix([1,0,0,1,os2,os2]).multiply(dmr4));
  paths.addPath(p,new DOMMatrix([1,0,0,1,0,os2]).multiply(dmr6));

path2.addPath(paths);

path2.addPath(path2,new DOMMatrix([1,0,0,1,4*S4*EDGE+2*EDGE,0]).multiply(dmx));
path2.addPath(path2,new DOMMatrix([1,0,0,1,0,4*S4*EDGE+2*EDGE]).multiply(dmy));

  let pf=new Path2D(path2);	// full quadrant

  pf.addPath(pf,dmx);
  pf.addPath(pf,dmy);

  ctx.strokeStyle=color.getRGB(0);
  ctx.lineWidth=1; //0.01+3*c/DUR;
  ctx.stroke(pf);

  ctx.strokeStyle="#00000010";
  ctx.lineWidth=6;
  ctx.stroke(pf);

/*
let tripath=new Path2D(tri);
//tripath.addPath(tri,new DOMMatrix([0,-1,-1,0,S4*EDGE,S4*EDGE]));
//tripath.addPath(tri,new DOMMatrix([S4,-S4,-S4,-S4,0,0]));
tripath.addPath(tri,dmt0);
*/

}

onresize();

start();

