"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const CSIZE=600;

var ctx2=(()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
ctx2.translate(CSIZE,CSIZE);

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="0 auto";
  co.append(ctx2.canvas);
  body.append(co);
  return co;
})();

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.height=D+"px";
  container.style.width=D+"px";
  ctx2.canvas.style.width=D+"px";
  ctx2.canvas.style.height=D+"px";
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const F1=5;
const F2=9;
const ARAD=40;
const R=CSIZE-ARAD;
const RES=56;	// (F2-F1)*(F2+F1)

var getX=(t)=>{ return R/2*(Math.cos(F1*t)+Math.cos(F2*t)); }
var getY=(t)=>{ return R/2*(Math.sin(F1*t)+Math.sin(F2*t)); }

var Train=function(op,cp) {
  this.offset=op;
  this.sw=false;
  this.t=[];
  this.hue=cp
//  this.color=cp;
}
var train=(()=>{
  let tr=[];
  let tc=32;
  for (let i=0; i<tc; i++) {
    //tr.push(new Train(i,"hsla("+i*360/tc+",100%,50%,0.6)"));
let h=90*getRandomInt(0,4);
    //tr.push(new Train(i,"hsla("+h+",100%,50%,0.6)"));
    tr.push(new Train(i,h));
  }
  return tr;
})();

var RATE=120;
//var RATE=24;
//var COUNT=12;
var COUNT=4;
var K=0;

var draw2=()=>{
  ctx2.fillStyle="hsla(0,0%,0%,0.1)";
  ctx2.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  //ctx2.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let a in train) {
    for (let i=0; i<COUNT; i++) {
      if (train[a].sw && train[a].t[i]%RATE==0) {
	let j=train[a].t[i]/RATE;
	if (j%14!=0) {	// 24=F1+F2
	  train[a].t[i]=train[a].t[i]+j*12*RATE;	// 12=F1+F2-2
	}
      }
      ctx2.beginPath();
      let z=TP*train[a].t[i]/RATE/RES;
      let x=getX(z);
      let y=getY(z);
      let r=ARAD*Math.sqrt(Math.hypot(x,y)/R);
      ctx2.moveTo(x+r,y);
      ctx2.arc(x,y,r,0,TP);
      //ctx2.fillStyle=train[a].color;
      ctx2.fillStyle="hsla("+train[a].hue+",100%,50%,0.4)";
      ctx2.fill();
    }
  }
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

train.forEach((tr)=>{ for (let i=0; i<COUNT; i++) tr.t.push(i*RATE/COUNT+tr.offset*RATE); });

var time=0;
var duration=100;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) { time=ts; }
  if (ts-time>duration) {
    train.forEach((tr)=>{
      tr.hue=++tr.hue%360;
    });
    time=ts;
  }
  train.forEach((tr)=>{
    for (let i=0; i<COUNT; i++) {
      tr.t[i]++;
      if (tr.t[i]>RATE*RES) tr.t[i]=tr.t[i]%(RATE*RES);
    }
    if (tr.t[COUNT-1]%RATE==0) {
      tr.sw=Math.random()<0.5;
      tr.sw2=Math.random()<0.5;
    }
  });
  draw2();
  requestAnimationFrame(animate);
}

onresize();
start();
