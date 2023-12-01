"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/mdvKWxr
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
  const CBASE=160;
  const CT=255-CBASE;
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=80+80*Math.random();
    this.GK1=80+80*Math.random();
    this.BK1=80+80*Math.random();
  }
  this.randomize();
}

var colors=[new Color(),new Color()];

var Line=function(type,dx,dy) { 
  this.type=type;
  if (type) {
    this.x1=dx*del;
    this.x2=dx*del;
    this.y1=dy*del;
    this.y2=(dy+1)*del;
  } else {
    this.x1=dx*del;
    this.x2=(dx+1)*del;
    this.y1=dy*del;
    this.y2=dy*del;
  }
  this.getPath=()=>{
    let p=new Path2D();
    if (type) {
      let x=(1-f)*this.x1+f*this.x2;
      p.moveTo(x,this.y1);
      p.lineTo(x,this.y2);
    } else {
      let y=(1-f)*this.y1+f*this.y2;
      p.moveTo(this.x1,y);
      p.lineTo(this.x2,y);
    }
    p.addPath(p,DMX);
    p.addPath(p,DMY);
    return p;
  }
  this.randomize=()=>{
    let d=[-2*del,-del,del,2*del][getRandomInt(0,4)];  // fix range
    //let d=[-3*del,-2*del,-del,del,2*del,3*del][getRandomInt(0,6)];  // fix range
    if (type) {
      this.x1=this.x2;
      if (this.x2+d<0 || this.x2+d>CSIZE) this.x2-=d;
      else this.x2+=d;
    } else {
      this.y1=this.y2;
      if (this.y2+d<0 || this.y2+d>CSIZE) this.y2-=d;
      else this.y2+=d;
    }
  }
  this.randomize();
}

const DMX=new DOMMatrix([-1,0,0,1,0,0]);
const DMY=new DOMMatrix([1,0,0,-1,0,0]);

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

var pauseTS=600;
var pause=(ts)=>{
  if (EM) stopped=true;
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var t=0;
var f=0;
var f2=0;
var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  c++;
  f=(1-Math.cos(TP*t/800))/2;
  //f2=Math.pow(Math.sin(TP*t/800),2);
  //if (EM && t%200==0) stopped=true;
  draw();
  if (t>=400) {
//    stopped=true;
    t=0;
    la.forEach((l)=>{ l.randomize(); });
    flourish.forEach((fl)=>{ fl.randomize(); });
    if (c%8000==0) colors.forEach((c)=>{ c.randomize(); });
    pauseTS=performance.now()+3200;
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var count=3;
var del=CSIZE/count;

var la=[];
var grid=new Path2D();

for (let i=0; i<count+1; i++) {
  for (let j=0; j<count+1; j++) {
    if (Math.random()<0.5) {
    la.push(new Line(0,i,j));
    la.push(new Line(1,i,j));
    } else {
    la.push(new Line(1,i,j));
    la.push(new Line(0,i,j));
    }
//    la.push(new Line(1,i,j));
//    la.push(new Line(0,i,j));
  }
}

for (let i=1; i<2*count; i++) {
  grid.moveTo(-CSIZE,-CSIZE+i*del);
  grid.lineTo(CSIZE,-CSIZE+i*del);
  grid.moveTo(-CSIZE+i*del,-CSIZE);
  grid.lineTo(-CSIZE+i*del,CSIZE);
}

//var flourish=[del,del];
function Flourish() {
  this.randomize=()=>{
    this.use=Math.random()<0.3;
    this.d=del*Math.random();
    //this.k=100*Math.pow(2,getRandomInt(0,4));
    //this.k=[200,400,800][getRandomInt(0,3)];
this.k=200+600*Math.random();
    this.c=true; //Math.random()<0.5;
  }
  this.randomize();
}
var flourish=[new Flourish(),new Flourish()];

var draw=()=>{
  let pa=[new Path2D(),new Path2D];
  for (let i=0; i<la.length; i++) {
    pa[i%2].addPath(la[i].getPath());
  }
  for (let i=0; i<2; i++) {

    ctx.lineWidth=7;
    ctx.strokeStyle="#0000001A";
    ctx.stroke(pa[i]);
 
    ctx.lineWidth=3;
    ctx.strokeStyle=colors[i%colors.length].getRGB();
    ctx.stroke(pa[i]);
    if (flourish[i].use) {
      //f2=Math.pow(Math.sin(TP*t/flourish[i].k),2);  // 800 is once
      f2=(1+Math.sin(TP*t/flourish[i].k))/2;
      ctx.setLineDash([f2*flourish[i].d,10000]);
      if (flourish[i].c) ctx.lineDashOffset=-(del-f2*flourish[i].d)/2;
      //if (flourish[i].c) ctx.lineDashOffset=-f2*(del-flourish[i].d)/2;
      ctx.strokeStyle=colors[(i+1)%colors.length].getRGB();
      ctx.lineWidth=4;
      ctx.stroke(pa[i]);
      ctx.setLineDash([]);
    }
  }
  ctx.strokeStyle="#00000004";
  ctx.lineWidth=2;
  ctx.stroke(grid);
}

onresize();

//draw();
//stopped=false;
//requestAnimationFrame(pause);
start();
