"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const CSIZE=400;
//const CYCLE=360;  // must be divisible by number of segments time t increment times 2 and by 12
const CYCLE=240;

var trackCtx=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
trackCtx.translate(CSIZE,CSIZE);

var ctx=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=32;
ctx.lineCap="round";

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="0 auto";
  co.append(trackCtx.canvas);
  co.append(ctx.canvas);
  body.append(co);
  return co;
})();

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.width=D+"px";
  container.style.height=D+"px";
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
  trackCtx.canvas.style.width=D+"px";
  trackCtx.canvas.style.height=D+"px";
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var Circle=function(xp,yp,rp,d) {
  this.x=xp; // need any members?, (never modified) x,y clash with calced x,y
  this.y=yp;
  this.r=rp;
  this.pts=[];
  this.drawTrack=(width,color)=>{
    trackCtx.lineWidth=width;
    trackCtx.strokeStyle=color;
    trackCtx.beginPath();
    trackCtx.moveTo(this.x+this.r,this.y);
    trackCtx.arc(this.x,this.y,this.r,0,TP);
    trackCtx.closePath();
    trackCtx.stroke();
  }
  this.getX=(t)=>{ return this.x+this.r*Math.cos(TP*t/CYCLE); }
  this.getY=(t)=>{ return this.r*Math.sin(TP*t/CYCLE); }
  this.getA=(t)=>{ 
    let d=o>0?-1:1;
    //let a=TP*t/CYCLE;      // offset=0, d=1
    //let a=TP/2-TP*t/CYCLE;  offset-d*TP*t/CYCLE
  }
  this.drawSegment=(offset)=>{
    let t2=(t+offset)%CYCLE;
    ctx.beginPath();
    let dof=d==-1?TP/2:0;  // reverse:normal flow
    let a=dof+d*TP*t2/CYCLE;
    let x=xp+rp*Math.cos(a);
    let y=rp*Math.sin(a);	// this.y always 0 for now
    ctx.moveTo(x,y);
    ctx.arc(xp,0,this.r,a,a-d*trail,d==1);
    ctx.stroke();
  }
  this.drawEntry=(offset)=>{
    let t2=(t+offset)%CYCLE;
    ctx.beginPath();
    let dof=d==-1?TP/2:0;  // reverse:normal flow
    let a=dof+d*TP*t2/CYCLE;
    let x=xp+rp*Math.cos(a);
    let y=rp*Math.sin(a);
    ctx.moveTo(x,y);
    ctx.arc(xp,0,rp,a,dof,d==1);
    ctx.stroke();
  }
  this.drawExit=(offset)=>{
    let t2=(t+offset)%CYCLE;
    ctx.beginPath();
    let dof=d==-1?TP/2:0;  // reverse:normal flow
    let a=dof+d*TP*t2/CYCLE;
    ctx.moveTo(0,0);  // junc specific
    ctx.arc(xp,0,rp,dof,a-d*trail,d==1);
    ctx.stroke();
  }
}

var state=0;

var Segment=function(offset,color) {
  this.o=offset*CYCLE;
  this.color=color;
  this.sw=0;  // 0:path 0, 1:path 0/1, 2:path 1, 3:path1/0
  this.junction=()=>{  // should be standalone?
    let t2=(t+this.o)%CYCLE;
    if (t2%CYCLE==0) {
      if (this.sw==0) {
        if (Math.random()<0.5) this.sw=1;
      } else if (this.sw==2) {
        if (Math.random()<0.5) this.sw=3;
      }
    //} else if (t2%CYCLE==CYCLE/2-TI) {
    //} else if (t2%CYCLE==CYCLE/3-TI) {
    } else if (t2%CYCLE==CYCLE/4-TI) {
      if (this.sw==1) this.sw=2;
      if (this.sw==3) this.sw=0;
    }
  }
  this.draw=()=>{
    let t2=(t+this.o)%CYCLE;
    ctx.strokeStyle=this.color;
    if (this.sw==0) {
      p[0].drawSegment(this.o);
    } else if (this.sw==1) { 
      p[0].drawExit(this.o);
      p[1].drawEntry(this.o);
    } else if (this.sw==2) {
      p[1].drawSegment(this.o);
   } else if (this.sw==3) {
      p[1].drawExit(this.o);
      p[0].drawEntry(this.o);
    }
  }
}

var segments=[new Segment(0,"red"), new Segment(1/4,"blue"), new Segment(1/2,"green"), new Segment(3/4,"yellow")];
//var segments=[new Segment(0,"red"), new Segment(1/3,"blue"), new Segment(2/3,"yellow")];
//var segments=[new Segment(0,"red"), new Segment(1/2,"blue")];
//var segments=[new Segment(0,"red")];

// 30 degree tail inset, 24 degree an option
var TI=CYCLE/12;
var trail=TP/segments.length-TP/12;  // junction checks also depend on segments.length
//var trail=TP/3-TP/12;

var R=CSIZE/2.2;

var t=0;
var p=[new Circle(-R,0,R,1), new Circle(R,0,R,-1)];
//var p=[new Circle(-R,0,R,1), new Circle(0.5*R,0,0.5*R,-1)];
//var p=[new Circle(-R,0,R,1), new Circle(-0.6*R,0,0.6*R,1)];

p[0].drawTrack(40,"white");
p[1].drawTrack(40,"white");
p[0].drawTrack(32,"black");
p[1].drawTrack(32,"black");

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

var drawX2=()=>{
  segments.forEach((s)=>{ s.junction(); });
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  segments.forEach((s)=>{ s.draw(); });
}

var animate=(ts)=>{
  if (stopped) return;
  //t=++t%CYCLE;
  //t++;
  t+=2;
  drawX2();
  requestAnimationFrame(animate);
}

onresize();
start();
