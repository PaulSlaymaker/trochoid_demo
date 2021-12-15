"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=600;
const WIDTH=60;

var ctx=(()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.strokeStyle="white";

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="0 auto";
  co.append(ctx.canvas);
  body.append(co);
  return co;
})();

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.height=D+"px";
  container.style.width=D+"px";
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var R=CSIZE-100;

var checkSwitch=(b)=>{
  for (let c of circles) {
    if (c==b.c) continue;
    let dx=b.x-c.x;
    if (Math.abs(Math.pow(Math.pow(dx,2)+Math.pow(b.y-c.y,2),0.5)-c.r)<0.4) {
      b.c=c;
      b.o=Math.atan((b.y-c.y)/dx);
      b.dir=[-1,1][getRandomInt(0,2)];
      if (dx<0) b.o+=TP/2;
      break;
    }
  }
}

var Ball=function(circ) {
  this.o=TP*Math.random();
  this.dir=[-1,1][getRandomInt(0,2)];
  this.c=circ;
  this.s=1.8+(0.3-0.6*Math.random());
  this.x=circ.x+circ.r*Math.cos(this.o);
  this.y=circ.y+circ.r*Math.sin(this.o);
  this.color="hsla("+getRandomInt(0,360)+",100%,50%,0.7)";
  this.move=()=>{
    this.o+=this.dir*this.s/this.c.r;
    this.x=this.c.x+this.c.r*Math.cos(this.o);
    this.y=this.c.y+this.c.r*Math.sin(this.o);
    checkSwitch(this);
  }
  this.draw=()=>{
    ctx.beginPath();
    ctx.arc(this.x,this.y,(WIDTH-12)/2,0,TP);
    ctx.fillStyle=this.color;
    ctx.fill();
  }
}

var Circle=function() {
  let mc=CSIZE-2*WIDTH;
  this.x1=mc*(1-2*Math.random());
  this.x2=mc*(1-2*Math.random());
  this.y1=mc*(1-2*Math.random());
  this.y2=mc*(1-2*Math.random());
  this.setDimensions=()=>{
    this.x=(1-frac)*this.x1+frac*this.x2;
    this.y=(1-frac)*this.y1+frac*this.y2;
    this.r=Math.min(Math.max(WIDTH,Math.min(mc-Math.abs(this.x))),
		    Math.max(WIDTH,Math.min(mc-Math.abs(this.y)))
		   );
  }
}

const CCOUNT=6;
var circles=(()=>{
  let c=[];
  for (let i=0; i<CCOUNT; i++) {
    c.push(new Circle());
  }
  return c;
})();
var balls=(()=>{
  let b=[];
  for (let i=0; i<7*CCOUNT; i++) b.push(new Ball(circles[i%CCOUNT]));
  return b;
})();

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.beginPath();
  circles.forEach((c)=>{
    ctx.moveTo(c.x+c.r,c.y);
    ctx.arc(c.x,c.y,c.r,0,TP);
  });
  ctx.lineWidth=WIDTH;
  ctx.strokeStyle="#DDD";
  ctx.stroke();

  ctx.beginPath();
  circles.forEach((c)=>{
    ctx.moveTo(c.x+c.r,c.y);
    ctx.arc(c.x,c.y,c.r,0,TP);
  });
  ctx.strokeStyle="black";
  ctx.lineWidth=WIDTH-12;
  ctx.stroke();
  balls.forEach((b)=>{ b.draw(); });
}

var transit=()=>{
  circles.forEach((c)=>{
    let mc=CSIZE-2*WIDTH;
    c.x1=c.x2;
    c.x2=mc*(1-2*Math.random());
    c.y1=c.y2;
    c.y2=mc*(1-2*Math.random());
    c.setDimensions();
  });
}

var t=0;
var stopped=true;
var start=()=>{
  if (stopped) {
    stopped=false;
    if (frac>0) time=performance.now()-frac*duration;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var state=0;
var time=0;
var frac=0;
var duration=50000;
var t=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) { time=ts; }
  let progress=ts-time;
  if (progress<duration) {
    frac=progress/duration;
  } else {
    time=0;
    frac=0; 
    transit();
  }
  circles.forEach((c)=>{ c.setDimensions(); });
  balls.forEach((b)=>{ b.move(); });
  draw();
  if (EM && ++t%300==0) stopped=true;
  requestAnimationFrame(animate);
}

onresize();
transit();
if (EM) {
  balls.forEach((b)=>{ b.move(); });
  draw();
} else start();
