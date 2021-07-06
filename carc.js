"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const CSIZE=400;

var ctx=(()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  let co=document.createElement("div");
  co.style.textAlign="center";
  co.append(c);
  body.append(co);
  return c.getContext("2d");
})();

ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
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

function Arc(i) {
  this.r1=0;
  this.r2=0;
  this.lw1=0;
  this.lw2=0;
  this.arc=(3-getRandomInt(1,3,true))/3;
  this.t=Math.random();
  this.inc=(1+Math.random())*[-1,1][getRandomInt(0,2)]/6;
  this.cIdx=i%hues.length;
}

var hues=(()=>{
  let h=[];
  let hue=getRandomInt(0,360);
  for (let i=0; i<5; i++) {
    let hd=getRandomInt(60,120);
    h.push((hue+i*hd)%360);
  }
  return h;
})();

var shuffle=()=>{
  let no=[];
  do { no.push(arcs.splice(getRandomInt(0,arcs.length),1)[0]); } 
  while (arcs.length>0);
  arcs=no;
}

var setArcs=()=>{
  shuffle();
  let rs=[];
  let count=getRandomInt(4,arcs.length+1);
  //for (let i=0; i<arcs.length+1; i++) rs.push(getRandomInt(32,CSIZE));
  for (let i=0; i<count+1; i++) rs.push(getRandomInt(60,CSIZE,getRandomInt(0,1)));
  rs.sort((a,b)=>{ return a-b; });
  for (let i=0; i<arcs.length; i++) {
    arcs[i].r2=(rs[i+1]+rs[i])/2;
    //arcs[i].lw2=Math.max(3,(rs[i+1]-rs[i])-1);
    arcs[i].lw2=Math.min(60,Math.max(3,(rs[i+1]-rs[i])-1));
    if (i>rs.length-2) {
      //arcs[i].r2=[CSIZE,1][getRandomInt(0,2)];  // perimeter location not used
      arcs[i].r2=1;
      arcs[i].lw2=0.1;
    }
  }
}

var arcs=(()=>{
  let a=[];
  for (let i=0; i<32; i++) a.push(new Arc(i));
  return a;
})();

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  arcs.forEach((a)=>{
    let r=(1-frac)*a.r1+frac*a.r2;
    a.t+=a.inc/r;
    ctx.beginPath();
    ctx.arc(0,0,r,a.t*TP,(a.t+a.arc)*TP);
    let ZZ=(1-frac)*a.lw1+frac*a.lw2;
    //ctx.lineWidth=(1-frac)*a.lw1+frac*a.lw2;
    ctx.lineWidth=ZZ;
    ctx.strokeStyle="hsla("+hues[a.cIdx]+",100%,50%,0.8)";
    ctx.setLineDash([2*ZZ,1.6*ZZ,ZZ/TP,1.6*ZZ]);
    ctx.stroke();
  });
}

var transit=()=>{
  arcs.forEach((a)=>{
    a.r1=a.r2;
    a.lw1=a.lw2;
    if (a.r1==1) a.t=Math.random();
  });
}

var stopped=true;
var start=()=>{
  if (stopped) {
    stopped=false;
    if (S==1) time=performance.now()-frac*duration;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var S=0;
var c=0;
var time=0;
var duration=6000;
var frac=0;
var animate=(ts)=>{
  if (stopped) return;
  if (c%40==0) for (let i=0; i<hues.length; i++) hues[i]=++hues[i]%360;
  if (++c>600) S=1;
  if (S==1) {
    if (!time) time=ts;
    let progress=ts-time;
    if (progress<duration) {
      frac=progress/duration;
    } else {
      transit();
      setArcs();
      time=0;
      frac=0;
      S=0;
      c=0;
    }
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();

setArcs();
transit();
setArcs();
start();
