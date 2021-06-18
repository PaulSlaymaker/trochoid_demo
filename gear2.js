"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=600;

var createContext=()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  let context=c.getContext("2d");
  context.translate(CSIZE,CSIZE);
  return context;
}
const ctx=createContext();

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
  let canvs=document.getElementsByTagName("canvas");
  for (let i=0; i<canvs.length; i++) {
    canvs.item(i).style.width=D+"px";
    canvs.item(i).style.height=D+"px";
  }
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const RATE=20;

var hub=(()=>{
  let p2d=new Path2D();
  p2d.arc(0,0,5,0,TP);
  return p2d;
})();

function Gear(n,direction) {	// input x,y
  this.n=n;
  this.rf=R/Math.sin(TP/(2*n1));
  this.x=0;
  this.y=0;
  this.rf=R/Math.sin(TP/(2*n));
  this.color="silver";
  this.path=(()=>{
    let p2d=new Path2D();
    let garc=TP/n;
    let td=TP/n-TP/2;
    let s1=3*TP/4-TP/(2*n);
    for (let i=0; i<n; i+=2) {
      let x=this.rf*Math.cos(i*garc);
      let y=this.rf*Math.sin(i*garc);
      let sl=s1+i*garc;
      p2d.arc(x,y,R,sl,sl+td,true);	// slot
      x=this.rf*Math.cos((i+1)*garc);
      y=this.rf*Math.sin((i+1)*garc);
      let a=TP/(2*n)-TP/4+i*garc;
      p2d.arc(x,y,R,a,a+td);		// tooth
    }
    return p2d;
  })();
  this.t=0;
  this.increment=()=>{ this.t=++this.t%(n*RATE); }
  this.getRadial=()=>{ return direction*this.t/(n*RATE)*TP; }
  this.dm=new DOMMatrix([1,0,0,1,this.x,this.y]);
  this.draw=()=>{
    let dp=new Path2D();
    let z=this.getRadial();
    this.dm.a=Math.cos(z),this.dm.b=Math.sin(z),this.dm.c=-Math.sin(z),this.dm.d=Math.cos(z);
    dp.addPath(this.path,this.dm);
    ctx.fillStyle=this.color;
    ctx.fill(dp);
    let dph=new Path2D();
    dph.addPath(hub,this.dm);
    ctx.fillStyle="black";
    ctx.fill(dph);
  }
}

var colors1=[];
var colors2=[];
var setColors=()=>{
  let c=[];
  let hue=getRandomInt(0,360);
  let hd=getRandomInt(90,270);
  let n=getRandomInt(2,7);
  for (let i=0; i<n; i++) {
    //colors.push("hsl("+(hue+i*360/n)+",60%,40%)");
    c.push("hsl("+((hue+i*hd)%360)+",70%,40%)");
  }
  return c;
}
colors1=setColors();
colors2=setColors();

const R=16;

var testOver=()=>{
  const maxd={8:8,10:14,12:16,14:22,16:28,18:30};
  if (Math.min(n1,n2)<20) {
    if (Math.max(n1,n2)>maxd[Math.min(n1,n2)]) return true;
  }
  return false;
}

/*
var n1=2*getRandomInt(4,18);
var n2;
let maxp=9;
if (n1<20) maxp=maxo[n1];
if (n1%4==0) n2=4*getRandomInt(2,maxp);
else n2=2*(2*getRandomInt(2,maxp)+1);
//var n2=2*getRandomInt(6,20);
//n1=18;
//n2=30;
var rf1=R/Math.sin(TP/(2*n1));
var rf2=R/Math.sin(TP/(2*n2));
//var RF=R/Math.sin(TP/(2*n1));
//var RF=2*R/(Math.sin(TP/(2*n1))+Math.sin(TP/(2*n2)));
var RF=(rf1+rf2)/2;
var count=Math.floor((CSIZE-2*R)/RF);
console.log(n1+" "+n2);
*/

var n1,n2,rf1,rf2,RF,count;

var setSpur=()=>{
  let setN=()=>{
    n1=2*getRandomInt(4,18,true);
    if (n1%4==0) n2=4*getRandomInt(2,9);
    else n2=2*(2*getRandomInt(2,9)+1);
  }
  setN();
  while (testOver()) setN();
//console.log(n1+" "+n2);
  rf1=R/Math.sin(TP/(2*n1));
  rf2=R/Math.sin(TP/(2*n2));
  RF=(rf1+rf2)/2;
  count=Math.floor((CSIZE-4*R)/RF);
}
setSpur();

var gears=[];

var setGears=()=>{
  gears=[];
  let os=-(count-1)*RF;
  for (let i=0,c=0; i<count; i++) {
    for (let j=0; j<count; j++,c++) {
      let dir=((i+j)%2==0)?-1:1;
      let ng=[n1,n2][(i+j)%2];
      let g=new Gear(ng,dir);
      g.dm.e=os+i*(rf1+rf2);
      g.dm.f=os+j*(rf1+rf2);
      if (g.n%4==0) {
	if (i%2==1) g.t=RATE;
        if (j%2==1 && Math.abs(n1-n2)%8==0) g.t+=RATE;
      } else {
        if (j%2==1 && Math.abs(n1-n2)%8==0) g.t=RATE;
      }
      if (ng==n1) g.color=colors1[c%colors1.length];
      else g.color=colors2[c%colors2.length];
      gears.push(g); 
    }
  }
}
setGears();

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  gears.forEach((g)=>{ g.increment(); g.draw(); });
}

var reset=()=>{
  colors1=setColors();
  colors2=setColors();
  setSpur();
  setGears();
}

var gtransform=[
  (r)=>{ return "rotateY("+r+"deg)" }, 
  (r)=>{ return "rotateX("+r+"deg)" }, 
  (r)=>{ let d=1-r/300; return "rotateX("+r+"deg) rotateY("+r+"deg) scale("+d+")" }, 
  (r)=>{ let d=1-r/300; return "rotateX(-"+r+"deg) rotateY("+r+"deg) scale("+d+")" }, 
];

var t=0;
var S=0;
var rot=0;
var GT=0;
var animate=(ts)=>{
  if (stopped) return;
  draw();
  if (S==0) {
    if (Math.random()<0.0015) {
    //if (Math.random()<0.003)  {
      S=1;
      GT=getRandomInt(0,4);
    }
  } else if (S==1) {
    rot+=0.4;
    if (rot>90) {
      rot=90;
      reset();
      S=2;
      if (GT==2) GT=3;
      else if (GT==3) GT=2;
    }
    ctx.canvas.style.transform=gtransform[GT](rot);
  } else if (S==2) {
    rot-=0.4;
    if (rot<0) { rot=0; S=0; }
    ctx.canvas.style.transform=gtransform[GT](rot);
  }
  if (EM && ++t%300==0) stopped=true;
  requestAnimationFrame(animate);
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

onresize();
if (EM) draw();
else start();
