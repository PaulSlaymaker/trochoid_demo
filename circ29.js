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

const DUR=240;
const TSEG=DUR/6;

const R=120;
let Y=2*R*Math.sin(TP/6)-R
const pa=[
  {"x":0,"y":-R,"j":[1,2],"c":[1,2],"j2":[4,5]},
  {"x":R,"y":Y,"j":[3,4],"c":[2,0],"j2":[0,1]},
  {"x":-R,"y":Y,"j":[0,5],"c":[1,0],"j2":[3,2]}
];

function Circle(idx) {
  this.pt=pa[0];//pa[getRandomInt(0,3)];
  this.t=3*DUR/4;//TSEG*getRandomInt(0,6);
  this.dir=-1; //[-1,1][getRandomInt(0,2)];
  this.rad=6+10*idx;
  this.checkJunctions=()=>{
    let tidx=(DUR+this.dir*this.t)%DUR;
    let jidx=this.pt.j.indexOf(tidx/TSEG);
    if (jidx>-1) {
      if (Math.random()<0.5) {
        let jidx2=this.pt.j2[jidx];
        this.dir*=-1;
        this.t=(DUR+this.dir*jidx2*TSEG)%DUR;
        this.pt=pa[this.pt.c[jidx]];
      }
    }
  }
  this.draw=()=>{
    let q=0.2+1.1*Math.pow(Math.cos(c/800),2);
    let rd=2+8*Math.pow(Math.cos(TP*((c%DUR+DUR/4)/DUR/2)),2);
    let z=this.dir*TP*this.t/DUR;
    let x=this.pt.x+R*Math.cos(z);
    let y=this.pt.y+R*Math.sin(z);
    ctx.beginPath();
    //ctx.arc(x,y,this.rad,0,TP);
    ctx.ellipse(x,y,q*this.rad,this.rad,z,0,TP);
    ctx.ellipse(x,y,q*(this.rad+rd),this.rad+rd,z,0,TP);
    ctx.fillStyle=colors[idx%colors.length].v;
    ctx.fill("evenodd");
//    ctx.strokeStyle=colors[idx%colors.length].v;
//    ctx.stroke();
  }
}

function Color() {
  const CBASE=127;
  const CT=255-CBASE;
  this.RK1=400+200*Math.random();
  this.GK1=400+200*Math.random();
  this.BK1=400+200*Math.random();
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.set=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1));
    this.v="rgb("+red+","+grn+","+blu+")";
  }
  this.set();
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

var pauseTS=0;
var pause=(ts)=>{
  if (stopped) return;
  if (pauseTS==0) pauseTS=performance.now()+1600
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    pauseTS=0;
    requestAnimationFrame(animate);
  }
}

var c=DUR/4;
var animate=(ts)=>{
  if (stopped) return;
  for (let i=0; i<ba.length; i++) {
    ba[i].t++;
    if (ba[i].t==DUR) ba[i].t=0;
  }
  for (let i=0; i<ba.length; i++) {
    if (ba[i].t%TSEG==0) ba[i].checkJunctions();
  }
  for (let i=0; i<colors.length; i++) colors[i].set();
  draw();
  if ((++c+DUR/4)%DUR==0) requestAnimationFrame(pause);
  else requestAnimationFrame(animate);
}

/*
var circles=new Path2D();
for (let i=0; i<pa.length; i++) {
  circles.moveTo(pa[i].x+R,pa[i].y);
  circles.arc(pa[i].x,pa[i].y,R,0,TP);
}
*/

var colors=new Array(4);
for (let i=0; i<colors.length; i++) colors[i]=new Color();

var ba=new Array();
for (let i=0; i<12; i++) ba.push(new Circle(i));

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  ctx.fillStyle="#00000030";
//  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
/*
  ctx.strokeStyle="#222";
  ctx.lineWidth=2;
  ctx.stroke(circles);
*/
  //let lw=1+9*Math.pow(Math.cos(TP*((c+DUR/4)%DUR)/DUR/2),2);
//  let lw=1+9*Math.pow(Math.cos(TP*((c%DUR+DUR/4)/DUR/2)),2);
//  ctx.lineWidth=lw;//10;
  for (let i=0; i<ba.length; i++) ba[i].draw();
}

onresize();

start();
