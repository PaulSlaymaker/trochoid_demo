"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const CSIZE=600;

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

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="0 auto";
  co.append(ctx.canvas);
  body.append(co);
  return co;
})();

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight+S)-40; 
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

var W=getRandomInt(30,80);
var re1=getRandomInt(20,90);
var FO=getRandomInt(1,11);
var S=5+20*Math.random();
var K=getRandomInt(2,5);
var efill1="hsl("+getRandomInt(0,360)+",100%,50%)";
var efill2="hsl("+getRandomInt(0,360)+",100%,50%)";
var r=[];

var setRadii=(re)=>{
  r=[];
  for (let k=0; k<40; k++) {
    let radius=re+k*1.5*re;
    if (radius<R-re) r.push(radius);
    else { K=k; break; }
  }
}
var setRadii2=(re)=>{
  r=[];
  for (let k=0; k<K; k++) { r.push(re+k*1.5*re); }
}

var draw=()=>{
  //ctx.fillStyle="hsla(0,0%,0%,0.04)";
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let re1f=re1*frac;
  setRadii2(re1f);
  for (let k=0; k<K; k++) {
    let re2=TP*r[k]/W/2;
    //let re2=Math.abs(TP*r[k]/W/2*Math.cos(100*t));
    let path1=new Path2D();
    let path2=new Path2D();
    let os=k*TP/FO/4;
    for (let i=0; i<W; i++) {
      let z=i*TP/W+t+os;
      let x=r[k]*Math.cos(z);
      let y=r[k]*Math.sin(z);
      //let rm=re1*Math.cos(FO*TP*i/W+S*t);
      //let rm=re1*Math.cos(FO*TP*i/W+S*t)*Math.cos(4*t);
      let rm=re1f*Math.cos(FO*TP*i/W+S*t);
      let xm=rm*Math.cos(z);
      let ym=rm*Math.sin(z);
      if (rm>0) {
	path1.moveTo(x+xm,y+ym);
	path1.ellipse(x,y,rm,re2,z,0,TP);
      } else {
	path2.moveTo(x+xm,y+ym);
	path2.ellipse(x,y,-rm,re2,z,0,TP);
      }
    }
    ctx.fillStyle=efill1;
    ctx.fill(path1);
    ctx.fillStyle=efill2;
    ctx.fill(path2);
  }
}

var randomizeColors=()=>{
  let hue=getRandomInt(0,360);
  efill1="hsl("+hue+",100%,50%)";
  let hue2=(hue+getRandomInt(120,240))%360;
  efill2="hsl("+hue2+",100%,50%)";
  
}

var transit=()=>{
  W=getRandomInt(30,80);
  FO=getRandomInt(1,10,true);
  S=[-1,1][getRandomInt(0,2)]*(5+20*Math.random());
  re1=getRandomInt(20,90);
  setRadii(re1);
  randomizeColors();
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
var duration=12000;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) { time=ts; }
  let progress=ts-time;
  if (progress<duration) {
    if (state==0) frac=1;
    else if (state==1) frac=1-progress/duration;
    else if (state==2) frac=progress/duration;
  } else {
    time=0;
    if (state==0) { 
      duration=800;
      state=1; 
      frac=1; 
    } else if (state==1) { 
      state=2; 
      frac=0; 
      transit();
    } else if (state==2) { 
      duration=12000;
      state=0; 
      frac=1; 
    }
  }
  t+=0.002;
  draw();
  requestAnimationFrame(animate);
}

onresize();
//draw();
transit();
start();
