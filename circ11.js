"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/ExEqRqP
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
ctx.lineCap="round";
ctx.fillStyle="#00000030";

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
var colors=[];
var setHues=()=>{
  let colorCount=3;
  let hue=getRandomInt(180,270);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(270/colorCount)*i+getRandomInt(-10,10);
    let h=(hue+hd)%360;
    hues.splice(getRandomInt(0,hues.length+1),0,h);
  }
}
colors[0]="hsl("+hues[0]+",90%,50%)";
colors[1]="hsl("+hues[1]+",90%,50%)";
colors[2]="hsl("+hues[2]+",90%,50%)";

var CirclePath=function(cp) {
  this.r=MINR+Math.random()*(MAXR-MINR);
  this.dir=cp?cp.dir*-1:1;
  this.a1=cp?cp.a2+TP/2:TP*Math.random();
  //this.a2=cp?cp.a2+1.2-2.4*Math.random():TP/2+1-2*Math.random()+this.a1;//a2;
  //this.a2=cp?cp.a2+0.4+0.3*Math.random():TP/2+1-2*Math.random()+this.a1;//a2;
  this.a2=cp?cp.a2+0.2+0.7*Math.random():TP/2+1-2*Math.random()+this.a1;//a2;
  this.pnx=cp?cp.x+(cp.r+2*this.r)*Math.cos(cp.a2):0;
  this.pny=cp?cp.y+(cp.r+2*this.r)*Math.sin(cp.a2):0;
  let d=Math.pow(this.pnx*this.pnx+this.pny*this.pny,0.5);
  if (d>CSIZE-2*MINR) { /*console.log(this.pny);*/ this.r=MINR; }
  this.x=cp?cp.x+(cp.r+this.r)*Math.cos(cp.a2):0;
  this.y=cp?cp.y+(cp.r+this.r)*Math.sin(cp.a2):0;
  this.path=new Path2D();
  this.path.arc(this.x,this.y,this.r,this.a1,this.a2,this.dir==1);
/*
  this.path2=new Path2D();
  this.path2.arc(this.x,this.y,this.r,0,TP);
  this.path3=new Path2D();
  this.path3.arc(this.px,this.py,5,0,TP);
  this.path4=new Path2D();
  this.path4.arc(this.pnx,this.pny,5,0,TP);
  this.path5=new Path2D();
  this.nx=this.x+this.r*Math.cos(this.a2);
  this.ny=this.y+this.r*Math.sin(this.a2);
  this.path5.arc(this.nx,this.ny,5,0,TP);
*/

  if (this.dir==-1) this.len=Math.abs(TP+(this.a2-this.a1))%TP*this.r;
  else this.len=Math.abs(TP-(this.a2-this.a1))%TP*this.r;
}

var MAXR=100;
var MINR=10;

var cpa=[new CirclePath()];
for (let i=1; i<11; i++) cpa.push(new CirclePath(cpa[i-1]));

const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);
const dm3=new DOMMatrix([0,1,-1,0,0,0]);

var draw=()=>{
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let p=new Path2D();
  for (let i=0; i<cpa.length; i++) {
    //ctx.stroke(cpa[i].path2);
    //ctx.fill(cpa[i].path3);
    //ctx.fill(cpa[i].path4);
    //ctx.fill(cpa[i].path5);
    let cp=cpa[i];
    p.arc(cp.x,cp.y,cp.r,cp.a1,cp.a2,cp.dir==1);
//ctx.fill(cpa[i].path);
  }
p.addPath(p,dm1);
p.addPath(p,dm2);
p.addPath(p,dm3);

  ctx.setLineDash([320,20000]);
  ctx.lineDashOffset=-240-speed*t;
  ctx.lineWidth=20;
  ctx.strokeStyle=colors[0];
  ctx.stroke(p);

  ctx.setLineDash([560,20000]);
  ctx.lineDashOffset=-120-speed*t;
  ctx.lineWidth=12;
  ctx.strokeStyle=colors[1];
  ctx.stroke(p);

  ctx.setLineDash([800,20000]);
  ctx.lineDashOffset=-speed*t;
  ctx.lineWidth=4;
  ctx.strokeStyle=colors[2];
  ctx.stroke(p);
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

var stopped=true;
var t=0, c=0;
var speed=3;
function animate(ts) {
  if (stopped) return;
  t++,c++;
  if (c%20==0) for (let i=0; i<hues.length; i++) {
    hues[i]=++hues[i]%360;
    colors[i]="hsl("+hues[i]+",90%,50%)";
  }
  if (speed*t>cpa[0].len) { 
    cpa.shift();
    cpa.push(new CirclePath(cpa[cpa.length-1]));
    t=0; 
  }
  else draw();
  requestAnimationFrame(animate);
}

onresize();

setHues();

//for (let i=0; i<cpa.length; i++) { ctx.stroke(cpa[i].path2); }

start();
