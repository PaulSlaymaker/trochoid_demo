"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/jOdZXXj
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
//c.style.outline="1px dotted gray";
  d.append(c);
  return c.getContext("2d");
})();
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
//ctx.setLineDash([8,8,1000]);

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
/*
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
*/
    let red=Math.round(CBASE+CT*(this.fb*Math.cos(this.RK2+t/this.RK1)+(1-this.fb)*Math.cos(t/this.RK3)));
    let grn=Math.round(CBASE+CT*(this.fg*Math.cos(this.GK2+t/this.GK1)+(1-this.fg)*Math.cos(t/this.GK3)));
    let blu=Math.round(CBASE+CT*(this.fb*Math.cos(this.BK2+t/this.BK1)+(1-this.fb)*Math.cos(t/this.BK3)));
//    let grn=Math.round(CBASE+CT*(0.8*Math.cos(this.GK2+t/this.GK1)+0.2*Math.cos(t/this.GK3)));
//    let blu=Math.round(CBASE+CT*(0.5*Math.cos(this.BK2+t/this.BK1)+0.5*Math.cos(t/this.BK3)));
    return "rgb("+red+","+grn+","+blu+")";
/*
    let alpha=1; //(1+Math.sin(t/this.KA))/2;
    return "rgba("+red+","+grn+","+blu+","+alpha+")";
*/
  }
  this.randomizeF=()=>{
    this.fr=1-Math.pow(0.9*Math.random(),8);
    this.fg=1-Math.pow(0.9*Math.random(),8);
    this.fb=1-Math.pow(0.9*Math.random(),8);
  }
  this.randomize=()=>{
    this.RK1=120+120*Math.random();
    this.GK1=120+120*Math.random();
    this.BK1=120+120*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.RK3=1+4*Math.random();
    this.GK3=1+4*Math.random();
    this.BK3=1+4*Math.random();
//this.KA=40+40*Math.random();
    this.randomizeF();
  }
  this.randomize();
}

const colors=[new Color(),new Color()];

var Brush=function() {
  this.getPath=()=>{
    let p=new Path2D();
    //let y=this.ry*Math.sin(this.k1+t/this.k2);
    //let y=this.ry*(this.yf*Math.sin(this.k1+t/this.k2)+(1-this.yf)*Math.sin(t/this.k5));
    //let r=this.sr*(1+Math.cos(this.k3+t/this.k4))*(Math.cos(Math.PI/2*t/DUR));
    //let r=this.sr*Math.pow(Math.cos(this.k3+t/this.k4),2)*(Math.cos(Math.PI/2*t/DUR));
//let rc=this.type?Math.min(this.sr,mr):this.sr;
    let r=(6+this.sr*Math.pow(this.rf*Math.cos(this.k3+t/this.k4)+(1-this.rf)*Math.cos(t/this.k6),2))
    //let r=(6+rc*Math.pow(this.rf*Math.cos(this.k3+t/this.k4)+(1-this.rf)*Math.cos(t/this.k6),2))
            *(Math.cos(Math.PI/2*t/DUR));
if (this.type) r=Math.min(r,mr);
/*
    p.moveTo(this.x,this.y+r);
    p.arc(this.x,this.y,r,TP/4,3*TP/4);
*/
//p.ellipse(x,y,3*r,r,0,TP/4,3*TP/4);
  p.moveTo(this.x-r,this.y);
  p.arc(this.x,this.y,r,TP/2,3*TP/4);
  p.moveTo(this.x-r,this.y);
  p.arc(this.x,this.y,r,TP/2,TP/4,true);
    return p;
  }
  this.randomize=()=>{
    this.k1=-TP/8+TP/4*Math.random();
    this.k2=60+100*Math.random();
    this.k3=3*TP/8+TP/4*Math.random();
    //this.k4=20+100*Math.random();
    this.k4=40+200*Math.random();
    this.ry=8+80*Math.random();
    this.sr=20+100*Math.random();
    this.yf=1-Math.pow(0.9*Math.random(),8);
    this.k5=10+40*Math.random();
    this.rf=1-Math.pow(0.9*Math.random(),8);
    this.k6=12+60*Math.random();
    this.type=Math.random()<0.7;
    this.df=3+20*Math.random();
    this.kr=20*Math.random();
    this.eos=20*Math.random();
    this.er=4+12*Math.random();
    this.ga=Math.pow(0.8*Math.random(),4);
  }
  this.randomize();
  this.move=()=>{
    this.x=t*CSIZE/DUR;
    this.y=this.ry*(this.yf*Math.sin(this.k1+t/this.k2)+(1-this.yf)*Math.sin(t/this.k5));
  }
}

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);

var transit=()=>{
  ba.forEach((b)=>{ b.randomize(); });
  colors.forEach((c)=>{ c.randomize(); });
  let g=getRandomInt(0,256);
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    if (t==0) {
      ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
      ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    }
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var pauseTS=1000;
var pause=(ts)=>{
  if (EM) stopped=true;
  if (stopped) return;
  if (ts<pauseTS) {
    if (pauseTS-ts<600) {
      ctx.canvas.style.opacity=Math.max(0,(pauseTS-ts)/600);
    }
    requestAnimationFrame(pause);
  } else {
    ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
    ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
ctx.canvas.style.opacity=1;
    requestAnimationFrame(animate);
  }
}

var t=0;
var c=0;
var DUR=400;
var animate=()=>{
  if (stopped) return;
  t++;
  c++;
  ba.forEach((b)=>{ b.move(); });
setMidRadius();
  draw();
  if (t%DUR==0) {//stopped=true;
    t=0;
    transit();
    pauseTS=performance.now()+4000;
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

const dmh1=new DOMMatrix([-0.5,-0.866,0.866,-0.5,0,0]);
const dmh2=new DOMMatrix([-0.5,0.866,-0.866,-0.5,0,0]);
const dmh3=new DOMMatrix([0.5,0.866,-0.866,0.5,0,0]);

var mr=200;
var setMidRadius=()=>{
  mr=Math.pow(Math.pow(ba[0].x-ba[1].x,2)+Math.pow(ba[0].y-ba[1].y,2),0.5)/2; 
}

var draw=()=>{
  for (let i=0; i<ba.length; i++) {
    let p=new Path2D(ba[i].getPath());
    p.addPath(p,dmx);
    let p2=new Path2D(p);
    p2.addPath(p,dmh1);
    p2.addPath(p,dmh2);
    p2.addPath(p2,dmh3);
/*
if (i%2) ctx.globalAlpha=0.2+0.8*Math.pow(Math.sin(t/8),8);
else ctx.globalAlpha=0.2+0.8*Math.pow(Math.sin(t/11),8);
*/
    ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
    ctx.lineWidth=4;
    ctx.strokeStyle=colors[i].getRGB();
    ctx.stroke(p2);

let mark=mr/ba[i].er;//*(1+Math.sin(t/ba[i].df));
//ctx.setLineDash([0,40-mark/2,mark,2000]);
ctx.setLineDash([0,ba[i].eos,mark,2000]);
ctx.strokeStyle=colors[(i+1)%2].getRGB();
//ctx.strokeStyle="#FFFFFF20";
//ctx.strokeStyle="#FFFFFF80";
//ctx.strokeStyle="black";
ctx.lineWidth=5;
ctx.globalAlpha=ba[i].ga;
ctx.stroke(p2);
ctx.setLineDash([]);
ctx.globalAlpha=1;

    ctx.setTransform(1,0,0,1,CSIZE-1,CSIZE+1);
    ctx.strokeStyle="#00000016";
    ctx.lineWidth=8;
    ctx.stroke(p2);


  }
}

let ba=[new Brush(),new Brush()];

onresize();

start();
