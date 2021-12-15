"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;
//const CYCLE=360;  // must be divisible by number of segments time t increment times 2 and by 12
const CYCLE=240;
//const CYCLE=144;

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

var Circle=function(xp,yp,rp,rd,cycDisp) {  // x center, y center, radius, rotation direction, unit x displacement in cycle units
  this.x=xp;
  this.y=yp;
  this.r=rp;
  this.drawTrack=(width,color)=>{
    trackCtx.lineWidth=width;
    trackCtx.strokeStyle=color;
    trackCtx.beginPath();
    trackCtx.moveTo(this.x+rp,this.y);
    trackCtx.arc(this.x,this.y,rp,0,TP);
    trackCtx.closePath();
    trackCtx.stroke();
  }
  this.drawSegment=(o)=>{
    let t2=(t+o)%CYCLE;
    ctx.beginPath();
    let a=rd*TP*(cycDisp+t2)/CYCLE;
    let x=xp+rp*Math.cos(a);
    let y=yp+rp*Math.sin(a);
    ctx.moveTo(x,y);
    ctx.arc(xp,yp,rp,a,a-rd*trail,rd==1);
    ctx.stroke();
  }
  this.drawEntry=(o,junc)=>{
    let t2=(t+o)%CYCLE;
    ctx.beginPath();
    let a=rd*TP*(cycDisp+t2)/CYCLE;
    let x=xp+rp*Math.cos(a);
    let y=yp+rp*Math.sin(a);
    ctx.moveTo(x,y);
    ctx.arc(xp,yp,rp,a,rd*TP*(cycDisp+junc.entryAngle)/CYCLE,rd==1);
    ctx.stroke();
  }
  this.drawExit=(o,junc)=>{
    let t2=(t+o)%CYCLE;
    ctx.beginPath();
    let a=rd*TP*(cycDisp+t2)/CYCLE;
    ctx.moveTo(junc.x,junc.y);  // junc specific, non-changing
    ctx.arc(xp,yp,rp,rd*TP*(cycDisp+junc.entryAngle)/CYCLE,a-rd*trail,rd==1);
    ctx.stroke();
  }
}

// 30 degree tail inset, 24 degree an option
var TI=CYCLE/12;
var trail=TP/4-TP/12;	// quarter segments

var Junction=function(p1,p2,angle) {  // angle p1-based, p2 angle=CYCLE-angle
  this.x=p1.x+p1.r*Math.cos(angle/CYCLE*TP);
  this.y=p1.y+p1.r*Math.sin(angle/CYCLE*TP);
  this.cycAngle=angle;	// cycle units
  this.entryAngle=angle;
  this.exitAngle=(CYCLE/4-TI+angle)%CYCLE;	// 1/4 cycle: 4 segments
  this.checkEntry=(seg)=>{
    let t2=(t+seg.o)%CYCLE;
    if (p1==seg.p1) {
      if (t2==this.entryAngle) {
        if (seg.ts) {
          seg.p1=p2;
          seg.p2=p1;
          return this;
        }
      }
    } else if (p2==seg.p1) {
      if (t2==this.entryAngle) {
        if (seg.ts) {
          seg.p1=p1;
          seg.p2=p2;
          return this;
        }
      }
    }
    return false;
  }
  this.checkExit=(seg)=>{
    if (p1==seg.p1) {
      let t2=(t+seg.o)%CYCLE;
      if (t2==this.exitAngle) return true;
    } else if (p2==seg.p1) {
      let t2=(t+seg.o)%CYCLE;
      if (t2==this.exitAngle) return true;
    }
    return false;
  }
}

var R=CSIZE/2.2;
var path=[
  new Circle(-R,-R,R,1,0), 
  new Circle(R,-R,R,-1,CYCLE/2), 
  new Circle(R,R,R,1,CYCLE/2),
  new Circle(-R,R,R,-1,0)
];

var junctions=[
  new Junction(path[0],path[1],0), 
  new Junction(path[0],path[3],CYCLE/4),
  new Junction(path[3],path[2],0),
  new Junction(path[1],path[2],CYCLE/4)
];

var Segment=function(offset,color,p) {
  this.o=offset*CYCLE;
  this.color=color;
  this.p1=p;
  this.p2=path[1];
  this.junc=false;
  this.ts=false;
  this.select=()=>{
    if (this.junc) {
      if (this.junc.checkExit(this)) {
        this.junc=false;
      }
    } else {
      for (let i in junctions) {
        // order not random?
        this.junc=junctions[i].checkEntry(this);
        if (this.junc) break;
      }
    }
  }
  this.draw=()=>{
    let t2=(t+this.o)%CYCLE;
    ctx.strokeStyle=this.color;
    if (this.junc) {
      this.p1.drawEntry(this.o, this.junc);
      this.p2.drawExit(this.o, this.junc);
    } else {
      this.p1.drawSegment(this.o);
    }
  }
}

var disorder=(()=>{
  let order=[0,1,2,3,0,1,2,3];
  let no=[];
  do {
    no.push(order.splice(getRandomInt(0,order.length),1)[0]);
  } while (order.length>0);
  return no;
})();

var segments=[
  new Segment(0,"red",path[0]), 
  new Segment(1/4,"blue",path[1]), 
  new Segment(1/2,"green",path[2]), 
  new Segment(3/4,"yellow",path[3]),
  new Segment(0,"red",path[2]), 
  new Segment(1/4,"blue",path[3]), 
  new Segment(1/2,"green",path[0]), 
  new Segment(3/4,"yellow",path[1]),
];

for (let i=0; i<segments.length; i++) {
  segments[i].color=["red","blue","green","yellow"][disorder[i]];
}

var t=0;

var W=72;
ctx.lineWidth=W-10;

path.forEach((p)=>{ p.drawTrack(W,"#DDD") });
path.forEach((p)=>{ p.drawTrack(W-10,"black") });

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
  segments.forEach((s)=>{ s.select(); });
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  segments.forEach((s)=>{ s.draw(); });
}

var animate=(ts)=>{
  if (stopped) return;
  //t=++t%CYCLE;
  //t++;
  t+=1;
  if (t%CYCLE/4==0) {  // minimum cycle angle
    for (let i=0; i<4; i++) { 
      let sel=Math.random()<0.5;
      // requires initial segment placement
      segments[i].ts=sel;
      segments[i+4].ts=sel;
    }
  }
  drawX2();
  if (EM && t%300==0) stopped=true;
  requestAnimationFrame(animate);
}

onresize();
if (EM) drawX2();
else start();
