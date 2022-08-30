"use strict"; // Paul Slaymaker, paul25882@gmail.com
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
c.style.outline="1px dotted gray";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

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
//  let c=[];
  let colorCount=4;
  let hue=getRandomInt(180,270);
//console.log("hue "+hue);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(200/colorCount)*i+getRandomInt(-10,10);
    let sat=70+getRandomInt(0,31);
    let lum=50+getRandomInt(0,11);
let h=(hue+hd)%360;
//hues.push(h);
hues.splice(getRandomInt(0,hues.length+1),0,h);
    //c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
//  return c;
}

var lw=8;

var CirclePath=function(cp) {
  this.r=MINR+Math.random()*(MAXR-MINR);
  this.dir=cp?cp.dir*-1:1;
  this.a1=cp?cp.a2+TP/2:TP*Math.random();
  //this.a2=cp?cp.a2+1.2-2.4*Math.random():TP/2+1-2*Math.random()+this.a1;//a2;
  this.a2=cp?cp.a2+0.4+0.3*Math.random():TP/2+1-2*Math.random()+this.a1;//a2;
this.pnx=cp?cp.x+(cp.r+2*this.r)*Math.cos(cp.a2):0;
this.pny=cp?cp.y+(cp.r+2*this.r)*Math.sin(cp.a2):0;

this.d=Math.pow(this.pnx*this.pnx+this.pny*this.pny,0.5);
if (this.d>CSIZE-2*MINR) { /*console.log(this.pny);*/ this.r=MINR; }

//if (Math.abs(this.pnx)>CSIZE-2*MINR) { console.log(this.pnx); this.r=MINR; }
//if (Math.abs(this.pny)>CSIZE-2*MINR) { console.log(this.pny); this.r=MINR; }
this.px=cp?cp.x+(cp.r+this.r)*Math.cos(cp.a2):0;
this.py=cp?cp.y+(cp.r+this.r)*Math.sin(cp.a2):0;
  this.x=this.px;
  this.y=this.py;
  this.path=new Path2D();
  this.path.arc(this.x,this.y,this.r,this.a1,this.a2,this.dir==1);
  this.path2=new Path2D();
  this.path2.arc(this.x,this.y,this.r,0,TP);
  this.path3=new Path2D();
  this.path3.arc(this.px,this.py,5,0,TP);
//  this.path4=new Path2D();
//  this.path4.arc(this.pnx,this.pny,5,0,TP);
  this.path5=new Path2D();
  this.nx=this.x+this.r*Math.cos(this.a2);
  this.ny=this.y+this.r*Math.sin(this.a2);
  this.path5.arc(this.nx,this.ny,5,0,TP);
  this.len=Math.abs(TP-(this.a2-this.a1))%TP*this.r;
if (this.dir==-1) this.len=Math.abs(TP+(this.a2-this.a1))%TP*this.r;
  //this.len=(this.a2-this.a1)*this.r;
//console.log(this.r+" "+this.len);
}

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var MAXR=64;
var MINR=24;
var MAXA=TP/2;
var MINA=TP/8;

onresize();

ctx.strokeStyle="red";
ctx.fillStyle="red";
ctx.lineWidth=3;

var cpa=[new CirclePath()];
for (let i=1; i<8; i++) {
  cpa.push(new CirclePath(cpa[i-1]));
}

colors=["red","yellow","green","blue"];
ctx.strokeStyle="yellow";
ctx.lineWidth=6;

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let p=new Path2D();
ctx.setLineDash([]);
ctx.lineWidth=1;
  for (let i=0; i<cpa.length; i++) {
    //ctx.lineWidth=1;
    //ctx.strokeStyle=colors[i%colors.length];
    //ctx.fillStyle=colors[i%colors.length];
ctx.stroke(cpa[i].path2);
    //ctx.fill(cpa[i].path3);
    //ctx.fill(cpa[i].path4);
    //ctx.fill(cpa[i].path5);
    let cp=cpa[i];
    p.arc(cp.x,cp.y,cp.r,cp.a1,cp.a2,cp.dir==1);
//ctx.fill(cpa[i].path);
//    p.addPath(cpa[i].path);
  }
ctx.setLineDash([700,20000]);
  ctx.lineWidth=6;
  ctx.stroke(p);
}

var transit=()=>{
  cpa.shift();
  cpa.push(new CirclePath(cpa[cpa.length-1]));
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
var t=0;
function animate(ts) {
  if (stopped) return;
  t++;
  ctx.lineDashOffset=-5*t;
  if (5*t>cpa[0].len) { t=0; transit(); }
  //if (t%100==0) { stopped=true; }
  else draw();
  requestAnimationFrame(animate);
}

draw();
