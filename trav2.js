"use strict"; // Paul Slaymaker, paul25882@gmail.com
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
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d", {"willReadFrequently": true});
})();
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
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
  const CBASE=160;
  const CT=255-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*(this.fb*Math.cos(this.RK2+t/this.RK1)+(1-this.fb)*Math.cos(t/this.RK3)));
    let grn=Math.round(CBASE+CT*(this.fg*Math.cos(this.GK2+t/this.GK1)+(1-this.fg)*Math.cos(t/this.GK3)));
    let blu=Math.round(CBASE+CT*(this.fb*Math.cos(this.BK2+t/this.BK1)+(1-this.fb)*Math.cos(t/this.BK3)));
    return "rgb("+red+","+grn+","+blu+")";
/*
    let alpha=(1+Math.sin(t/this.KA))/2;
    return "rgba("+red+","+grn+","+blu+","+alpha+")";
*/
  }
  this.randomizeF=()=>{
    this.fr=1-Math.pow(0.9*Math.random(),6);
    this.fg=1-Math.pow(0.9*Math.random(),6);
    this.fb=1-Math.pow(0.9*Math.random(),6);
  }
  this.randomize=()=>{
    this.RK1=120+120*Math.random();
    this.GK1=120+120*Math.random();
    this.BK1=120+120*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.RK3=1+6*Math.random();
    this.GK3=1+6*Math.random();
    this.BK3=1+6*Math.random();
//this.KA=40+40*Math.random();
    this.randomizeF();
  }
  this.randomize();
}

const colors=[new Color(),new Color()];

var Brush=function() {
  this.getPath=()=>{
    let p=new Path2D();
    //this.x=200-200*Math.cos(this.k1+t/this.k2);
    this.x=200-200*(this.xf*Math.cos(this.k1+t/this.k2)+(1-this.xf)*Math.cos(t/this.k5));
    //let r=(6+this.sr*Math.pow(this.rf*Math.cos(this.k3+t/this.k4)+(1-this.rf)*Math.cos(t/this.k6),2));
    this.r=(this.sr*Math.pow(this.rf*Math.cos(this.k3+t/this.k4)+(1-this.rf)*Math.cos(t/this.k6),2));
//if (this.type) 
//r=Math.min(r,mr);
    p.moveTo(this.x-this.r,0);
    p.lineTo(this.x+this.r,0);
/*
    p.moveTo(this.x,0);
    p.lineTo(this.x+this.r,0);
    p.moveTo(this.x,0);
    p.lineTo(this.x-this.r,0);
*/
    p.addPath(p,dmx);
    p.addPath(p,dmr);
    return p;
  }
  this.getPath2=()=>{
    let p=new Path2D();
    this.x=200-200*(this.xf*Math.cos(this.k1+t/this.k2)+(1-this.xf)*Math.cos(t/this.k5));
    this.r=(this.sr*Math.pow(this.rf*Math.cos(this.k3+t/this.k4)+(1-this.rf)*Math.cos(t/this.k6),2));
    p.moveTo(this.x-this.r,CSIZE);
    p.lineTo(this.x+this.r,CSIZE);
    p.addPath(p,dmx);
    p.addPath(p,dmy);
    p.addPath(p,dmr);
    return p;
  }

  this.randomize=()=>{
    this.k1=TP*Math.random();
    //this.k2=160+480*Math.random();
this.k2=200+400*Math.random();
    this.k3=TP*Math.random();
    this.k4=80+160*Math.random();
//    this.ry=8+80*Math.random();
    this.sr=20+40*Math.random();
    this.xf=1-Math.pow(0.9*Math.random(),10);
    this.k5=30+60*Math.random();
    this.rf=1-Math.pow(0.9*Math.random(),8);
    this.k6=12+60*Math.random();
//    this.type=Math.random()<0.7;
  }
  this.randomize();
  this.k1=1.5*Math.random();	// tend to center, initially
}

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dmr=new DOMMatrix([0,1,-1,0,0,0]);

var transit=()=>{
  ba.forEach((b)=>{ b.randomize(); });
  colors.forEach((c)=>{ c.randomize(); });
  //colors.forEach((c)=>{ c.randomizeF(); });
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

var t=0;
//var DUR=400;
var animate=()=>{
  if (stopped) return;
  t++;
  if (t%2000==0) transit();
  if (!(t%3)) {
/*
    var id1=ctx.getImageData(0,0,CSIZE,CSIZE)
    var id2=ctx.getImageData(CSIZE,0,CSIZE,CSIZE)
    var id3=ctx.getImageData(CSIZE,CSIZE,CSIZE,CSIZE)
    var id4=ctx.getImageData(0,CSIZE,CSIZE,CSIZE)
    ctx.putImageData(id1,-1,0)
    ctx.putImageData(id2,CSIZE,-1)
    ctx.putImageData(id3,CSIZE+1,CSIZE)
    ctx.putImageData(id4,0,CSIZE+1)
*/
/*
    var id=ctx.getImageData(0,0,CSIZE-1,CSIZE-1)
    ctx.putImageData(id,1,1)
    id=ctx.getImageData(CSIZE+1,0,CSIZE-1,CSIZE-1)
    ctx.putImageData(id,CSIZE,1)
    id=ctx.getImageData(CSIZE+1,CSIZE+1,CSIZE-1,CSIZE-1)
    ctx.putImageData(id,CSIZE,CSIZE)
    id=ctx.getImageData(0,CSIZE+1,CSIZE-1,CSIZE-1)
    ctx.putImageData(id,1,CSIZE)
*/

    var id=ctx.getImageData(0,0,CSIZE,CSIZE)
    ctx.putImageData(id,-1,-1)
    id=ctx.getImageData(CSIZE,0,CSIZE,CSIZE)
    ctx.putImageData(id,CSIZE+1,-1)
    id=ctx.getImageData(CSIZE,CSIZE,CSIZE,CSIZE)
    ctx.putImageData(id,CSIZE+1,CSIZE+1)
    id=ctx.getImageData(0,CSIZE,CSIZE,CSIZE)
    ctx.putImageData(id,-1,CSIZE+1)

//setMidRadius();
    draw();
  }
if (EM && t%400==0) stopped=true;
  requestAnimationFrame(animate);
}

var mr=200;
var setMidRadius=()=>{ mr=Math.abs(ba[0].x-ba[1].x)/2; }

let ba=[new Brush(),new Brush(),new Brush(),new Brush()];

onresize();

var draw=()=>{
  for (let i=0; i<ba.length; i++) {
    ctx.strokeStyle=colors[i%colors.length].getRGB();
    let p=ba[i].getPath();
    ctx.lineWidth=2;
    ctx.stroke(p);

/*
let d=ba[i].r/4*(1+Math.cos(t/20));
let o=ba[i].r/4*(1+Math.sin(t/17));
//ctx.setLineDash([0,ba[i].r-2,2]);
ctx.setLineDash([0,o,d,1000]);
//ctx.strokeStyle="red";
//ctx.strokeStyle=colors[(i+1)%colors.length].getRGB();
//ctx.strokeStyle="#44444444";
//ctx.strokeStyle="#FFFFFF88";
ctx.strokeStyle="#00000088";
ctx.stroke(p);
ctx.setLineDash([]);
*/

    ctx.setTransform(1,0,0,1,CSIZE-1,CSIZE+1);
    ctx.strokeStyle="#00000028";
    ctx.lineWidth=6;
    ctx.stroke(p);
    ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  }
}

start();
