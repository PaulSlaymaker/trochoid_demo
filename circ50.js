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
c.style.outline="1px dotted gray";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.globalCompositeOperation="destination-over";
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
   let red=Math.round(CBASE+CT*(this.fr*Math.cos(this.RK2+tt/this.RK1)+(1-this.fr)*Math.cos(tt/this.RK3)));
   let grn=Math.round(CBASE+CT*(this.fg*Math.cos(this.GK2+tt/this.GK1)+(1-this.fg)*Math.cos(tt/this.GK3)));
   let blu=Math.round(CBASE+CT*(this.fb*Math.cos(this.BK2+tt/this.BK1)+(1-this.fb)*Math.cos(tt/this.BK3)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomizeF=()=>{
    this.RK3=1+5*Math.random();
    this.GK3=1+5*Math.random();
    this.BK3=1+5*Math.random();
    this.fr=1-Math.pow(0.9*Math.random(),3);
    this.fg=1-Math.pow(0.9*Math.random(),3);
    this.fb=1-Math.pow(0.9*Math.random(),3);
  }
  this.randomize=()=>{
    this.RK1=40+40*Math.random();
    this.GK1=40+40*Math.random();
    this.BK1=40+40*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.randomizeF();
  }
  this.randomize();
}

var color=new Color();

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

//var t=0;
var tt=0;
var animate=(ts)=>{
  if (stopped) return;
  tt++;
  if (ca.length>100) {
    color.randomize();
    ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    reset();
    tt=0;
  } else {
//  t++;
  for (let i=0; i<ca.length; i++) ca[i].t++;
//if (EM && t%400==0) stopped=true;
  draw();
  for (let i=0; i<ca.length; i++) {
//  if (t>KT-50) ctx.canvas.style.opacity=(KT-t)/50;
    if (ca[i].t==ca[i].kt) {
//      t=0;
      ca[i].t=0;
      ca[i].split();
/*
  if (Math.abs(ca[i].x)>1.5*CSIZE || Math.abs(ca[i].y)>1.5*CSIZE) {
    stopped=true;
//    ctx.canvas.style.opacity=1;
  }
*/
    }
  }
  }
  requestAnimationFrame(animate);
}

const getXYPath=(spath)=>{
//  const dmxy=new DOMMatrix([0,1,-1,0,0,0]);
  const dmxy=new DOMMatrix([-1,0,0,-1,0,0]);
//  const dmy=new DOMMatrix([-1,0,0,1,0,0]);
  let p=new Path2D(spath);
  p.addPath(p,dmxy);
  return p;
}

const getHexPath=(spath)=>{
  const dm1=new DOMMatrix([0.5,0.866,-0.866,0.50,0,0]);
  const dm2=new DOMMatrix([-0.5,0.866,-0.866,-0.50,0,0]);
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  let p=new Path2D(spath);
  p.addPath(p,dmy);
  p.addPath(p,dmx);
  let hpath=new Path2D(p);
  hpath.addPath(p,dm1);
  hpath.addPath(p,dm2);
  return hpath;
}

const getDualPath=(spath)=>{
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  let p=new Path2D(spath);
  p.addPath(p,dmy);
  p.addPath(p,dmx);
  return p;
}

const getQuadPath=(spath)=>{
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  const dmz=new DOMMatrix([0,1,-1,0,0,0]);
  let p=new Path2D(spath);
  p.addPath(p,dmy);
  p.addPath(p,dmx);
  p.addPath(p,dmz);
  return p;
}

var initRadius=100*Math.random();

var Circle=function() { 
  this.dir=false;
  this.t=0;
  this.getRandomR=()=>{
    return 8+CSIZE/4*Math.random();
    //return [25,50][getRandomInt(0,2)];
  }
  this.randomize=()=>{
    this.r=this.getRandomR();
    this.a=TP*Math.random();
    this.x=this.r*Math.cos(this.a);
    this.y=this.r*Math.sin(this.a);
    //this.a2=TP/6+TP/6*Math.random();
    this.a2=TP/12+TP/3*Math.random();
    this.kt=Math.round(this.r*(TP/2-this.a2));
if (this.kt<=0) debugger;
//    this.lw=20*Math.random();
  }
  this.split=()=>{
    let r2=this.getRandomR();
    let x2=this.x+(this.r+r2)*Math.cos(this.a-this.a2);
    let y2=this.y+(this.r+r2)*Math.sin(this.a-this.a2);

let r3=this.getRandomR();
let x3=this.x+(this.r-r3)*Math.cos(this.a-this.a2);
let y3=this.y+(this.r-r3)*Math.sin(this.a-this.a2);
let c=new Circle();
c.r=r3;
//c.a=c.a+c.a2;
c.x=x3,c.y=y3;
//c.a=this.a-this.a2; //TP*Math.random();
c.a=TP/2+this.a-this.a2; //TP*Math.random();
c.dir=this.dir;
//if (c.dir) c.a2=c.a-TP/6;
//else c.a2=c.a+TP/12+TP/3*Math.random();
if (c.dir) c.a2=-TP/6;
else c.a2=TP/12+TP/3*Math.random();
ca.push(c);
if (c.dir) c.kt=Math.round(c.r/2*(TP/2-c.a2));
else {
  let an=TP/2-c.a2;
  if (an<0) an+=TP;
  c.kt=Math.round(c.r*an);
}
if (c.kt<=0) debugger;

    this.r=r2;
    this.a=this.a-this.a2;
    this.x=x2,this.y=y2;
    this.dir=!this.dir;
//a2=TP/3*Math.random()-TP;
    if (this.dir) this.a2=-TP/6;
    else this.a2=TP/12+TP/3*Math.random();
    if (this.dir) this.kt=Math.round(this.r/2*(TP/2-this.a2));
    else {
      let an=TP/2-this.a2;
      if (an<0) an+=TP;
      //if (TP/2-a2<0) 
      this.kt=Math.round(this.r*an);
    }
    if (this.kt<=0) debugger;
  }
  this.getPath=()=>{	// make setPath
    let p=new Path2D();
    p.arc(this.x,this.y,this.r,TP/2+this.a,this.a-this.a2,this.dir);
    return p;
  }
  this.drawD=()=>{
    ctx.save();
ctx.strokeStyle="white";
ctx.setLineDash([]);
ctx.lineWidth=1;
ctx.stroke(this.getPath());
    ctx.restore();
  }
}

var drawPoint=(x,y,col,rad)=>{	// diag
  ctx.beginPath();
  if (rad) ctx.arc(x,y,rad,0,TP);
  else ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

ctx.setLineDash([1,8000]);

onresize();

var ca=[];
var LW=20;
var WK=60;
var sym=getHexPath;
var reset=()=>{
  ca=[new Circle()];
  ca[0].randomize();
  LW=50*Math.random();
  WK=30+90*Math.random();
console.log("LW:",LW.toFixed(0),"WK:",WK.toFixed(0));
  sym=[getHexPath,getQuadPath,getDualPath,getXYPath][getRandomInt(0,4,true)];
}
reset();

var draw=()=>{
  //let lw=60+Math.sin(t/4);
  //let lw=120*Math.sin(t/300);
//let lw=3+10*(1-Math.cos(tt/200));
  for (let i=0; i<ca.length; i++) {
    let lw=4+LW*(1-Math.cos(tt/WK));	//ca[i].lw doesn't vary, fixme
    ctx.lineDashOffset=-ca[i].t;
    let p=sym(ca[i].getPath());
    //let p=getHexPath(ca[i].getPath());
    //let p=getXYPath(ca[i].getPath());
    //let p=ca[i].getPath();

    ctx.setTransform(1,0,0,1,CSIZE-2,CSIZE+2);
    ctx.strokeStyle="#0000000A";
    ctx.lineWidth=lw+10;
    ctx.stroke(p);

    ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
    ctx.strokeStyle=color.getRGB();
    ctx.lineWidth=lw;
    ctx.stroke(p);
  }
}

//drawPoint(0,0,"white");

start();

