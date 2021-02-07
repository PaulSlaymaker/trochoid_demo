"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const CSIZE=600;

const ctx=(()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

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
  container.style.width=D+"px";
  container.style.height=D+"px";
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

var cuFrac=()=>{
  let f1=.2;
  let f2=.8;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var R=CSIZE;
var RCOUNT=getRandomInt(3,24);
var SCOUNT=getRandomInt(4,27);
var AROT=TP/(4*SCOUNT);	// symmetry
var ROFF=TP/(2*SCOUNT);	// animation
ctx.lineWidth=CSIZE/RCOUNT;

var Circle=function(l) {
  this.radius1=l;
  this.radius2=this.radius1;
  this.rotation1=[-1,0,1][getRandomInt(0,3)];
  this.rotation2=0;
  this.color="hsl("+getRandomInt(0,360)+",100%,45%)";
  this.draw2=()=>{
    ctx.strokeStyle=this.color;
    let f=cuFrac();
    for (let i=0; i<SCOUNT; i++) {
    ctx.beginPath();
      let rot=i*TP/SCOUNT+AROT+(1-f)*rf*this.rotation1*ROFF+f*rf*this.rotation2*ROFF;
//      ctx.moveTo(this.radius*Math.cos(rot),this.radius*Math.sin(rot));
      let rad=R/(2*RCOUNT)+((1-f)*this.radius1+f*this.radius2)*R/RCOUNT;
      ctx.arc(0,0,rad,rot,rot+TP/(2*SCOUNT));
    ctx.stroke();
    }
  }
}

var Ring=function() {
  this.rotation=0;
  this.offc=false;
  this.norc=false;
}
var rings=[];

var resetRings=()=>{
  rings.forEach((r)=>{ r.offc=false; r.norc=false; r.rotation=0;});
  circ.forEach((c)=>{ 
    if (c.rotation1==0) rings[c.radius1].norc=c;
    else rings[c.radius1].offc=c;
  });
}

var circ=[];

var setCirclesAndRings=()=>{
  circ=[];
  rings=[];
  for (let i=0; i<RCOUNT; i++) {
    circ.push(new Circle(i));
    rings[i]=new Ring();
  }
}

setCirclesAndRings();

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  circ.forEach((c)=>{ c.draw2(); });
}

var randomizeRotation=()=>{
  for (let i=0; i<RCOUNT; i++) {
    if (rings[i].norc && rings[i].offc) {
      if (rings[i].offc.rotation1<0) {
        rings[i].offc.rotation2=[-1,0][getRandomInt(0,2)];
        rings[i].norc.rotation2=rings[i].offc.rotation2+1;
        if (rings[i].offc.rotation2==0) {
          rings[i].rotation=1;
          let savrot=rings[i].offc;
          rings[i].offc=rings[i].norc;
          rings[i].norc=savrot;
        }
      } else if (rings[i].offc.rotation1>0) {
        rings[i].offc.rotation2=[0,1][getRandomInt(0,2)];
        rings[i].norc.rotation2=rings[i].offc.rotation2-1;
        if (rings[i].offc.rotation2==0) {
          rings[i].rotation=-1;
          let savrot=rings[i].offc;
          rings[i].offc=rings[i].norc;
          rings[i].norc=savrot;
        }
      }
    } else if (rings[i].norc) {
      rings[i].norc.rotation2=[-1,1][getRandomInt(0,2)];
      rings[i].offc=rings[i].norc;
      rings[i].norc=false;
      rings[i].rotation=rings[i].offc.rotation2;
    } else if (rings[i].offc) {
      if (rings[i].offc.rotation1<0) {
        rings[i].offc.rotation2=[-1,0][getRandomInt(0,2)];
        if (rings[i].offc.rotation2==0) {
          rings[i].norc=rings[i].offc;
          rings[i].offc=false;
          rings[i].rotation=1;
        }
      } else {
        rings[i].offc.rotation2=[0,1][getRandomInt(0,2)];
        if (rings[i].offc.rotation2==0) {
          rings[i].norc=rings[i].offc;
          rings[i].offc=false;
          rings[i].rotation=-1;
        }
      }
    }
  }
}

var randomizeRadiiOut=()=>{
  for (let i=0; i<RCOUNT-1; i++) {
    if (!rings[i].norc && !rings[i].offc) continue;
    if (!rings[i+1].norc && !rings[i+1].offc) {
      if (Math.random()<0.9 && rings[i].norc) {
        rings[i].norc.radius2=i+1;
      }
      if (Math.random()<0.9 && rings[i].offc) {
        rings[i].offc.radius2=i+1;
      }
    } else {
      if (rings[i].rotation==rings[i+1].rotation) {
        if (rings[i].norc && !rings[i+1].norc) {
          if (Math.random()<0.9) {
            rings[i].norc.radius2=i+1;
          }
        }
        if (rings[i].offc && !rings[i+1].offc) {
          if (Math.random()<0.9) {
            rings[i].offc.radius2=i+1;
          }
        }
      }
    }
  }
}

var randomizeRadiiIn=()=>{
  for (let i=RCOUNT-1; i>0; i--) {
    if (!rings[i].norc && !rings[i].offc) continue;
    if (!rings[i-1].norc && !rings[i-1].offc) {
      if (Math.random()<0.9 && rings[i].norc) rings[i].norc.radius2=i-1;
      if (Math.random()<0.9 && rings[i].offc) rings[i].offc.radius2=i-1;
    } else {
      if (rings[i].rotation==rings[i-1].rotation) {
        if (rings[i].norc && !rings[i-1].norc) {
          if (Math.random()<0.9) rings[i].norc.radius2=i-1;
        }
        if (rings[i].offc && !rings[i-1].offc) {
          if (Math.random()<0.9) rings[i].offc.radius2=i-1;
        }
      }
    }
  }
}

var rf=1;
var transit=()=>{
  circ.forEach((c)=>{ 
    c.rotation1=c.rotation2; 
    c.radius1=c.radius2; 
  });
  resetRings();
  randomizeRotation();
  [randomizeRadiiOut,randomizeRadiiIn][getRandomInt(0,2)]();
  rf=[1,3,5,7,9,11,13][getRandomInt(0,7)];
}

var reset=()=>{
  RCOUNT=getRandomInt(3,24);
  SCOUNT=getRandomInt(4,27);
  AROT=TP/(4*SCOUNT);
  ROFF=TP/(2*SCOUNT);
  ctx.lineWidth=CSIZE/RCOUNT;
  setCirclesAndRings();
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
ctx.canvas.addEventListener("click", start, false);

var S=0;
var op=1;
var time=0;
var frac=0;
var duration=4000;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  let progress=ts-time;
  if (progress<duration) {
    frac=progress/duration;
  } else {
    frac=0;
    time=0;
    transit();
  }
  if (S==0) {
    if (Math.random()<0.0003)  S=1;
  } else if (S==1) {
    op-=0.03;
    if (op<0) {
      op=0;
      reset();
      S=2;
    }
    ctx.canvas.style.opacity=op;
  } else if (S==2) {
    op+=0.03;
    if (op>1) { op=1; S=0; }
    ctx.canvas.style.opacity=op;
  }

  draw();
  requestAnimationFrame(animate);
}

onresize();
start();
