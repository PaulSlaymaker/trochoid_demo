"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;
const CSIZE=480;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineJoin="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var Colors=function() {
  const colorCount=6;
  this.c1=new Array(colorCount).fill({"h":0,"s":50,"l":50});
  this.c2=new Array(colorCount).fill({"h":90,"s":50,"l":50});
  this.hd=new Array(colorCount);
  this.hueDiff=(n)=>{
    let hd1=(this.c1[n].h-this.c2[n].h+360)%360;
    let hd2=(this.c2[n].h-this.c1[n].h+360)%360;
    if (hd1>hd2) return hd2;
    else return -hd1;
  }
  this.transit=()=>{
    let hr=Math.round(60/colorCount);
    let hue=getRandomInt(0,360);
    for (let i=0; i<colorCount; i++) {
      this.c1[i]=this.c2[i];
      let hd=Math.round(360/colorCount)*i+getRandomInt(-hr,hr);
      let sat=60+getRandomInt(0,31);
      let lum=20+getRandomInt(0,51);
      this.c2[i]={"h":(hue+hd)%360,"s":sat,"l":lum};
    }
    this.c2.sort((a,b)=>{ return a.l-b.l; });
    if (Math.random()<0.5) {
      this.c2.push(this.c2.shift());
      this.c2.reverse();
    } else this.c2.unshift(this.c2.pop());
    for (let i=0; i<colorCount; i++) {
      this.hd[i]=this.hueDiff(i);
    }
  }
  this.getColor=(n)=>{
    let f=t/duration;
    let h=this.c1[n].h+Math.round(f*this.hd[n]);
    let s=Math.round((1-f)*this.c1[n].s+f*this.c2[n].s);
    let l=Math.round((1-f)*this.c1[n].l+f*this.c2[n].l);
    return "hsl("+h+","+s+"%,"+l+"%)"; 
  }
  this.transit();
}
var cols=new Colors();

const radius=96;
const RF=radius/Math.cos(TP/12);

const cos=[1,0.5,-0.5,-1,-0.5,0.5];
const sin=[0,0.866,0.866,0,-0.866,-0.866];

var hpm=new Map();
var xSet=new Set();
var ySet=new Set();

var Circle=function(x,y) {
  this.x=x;
  this.y=y;
  this.hpts=new Array(6);
  for (let i=0; i<6; i++) {
    let z=i*TP/6+TP/12;
    let xz=x+RF*Math.cos(z);
    let yz=y+RF*Math.sin(z);
    let xze=Math.round(xz);
    let yze=Math.round(yz);
    xSet.add(xze);
    ySet.add(yze);
    let hk=[xze,yze].toString();
    if (!hpm.has(hk)) {
      let hp={"x":xz,"y":yz,"x2":xz,"y2":yz};
      hpm.set(hk,hp);
      this.hpts[i]=hp;
    } else {
      this.hpts[i]=hpm.get(hk);
    }
  }
}

var cuFrac=(frac)=>{
    let f1=0.2;
    let f2=0.8;
    var e2=3*frac*Math.pow(1-frac,2)*f1;
    var e3=3*(1-frac)*Math.pow(frac,2)*f2;
    var e4=Math.pow(frac,3);
    return e2+e3+e4;
}

onresize();

var cm=new Map();
var pm=new Map();

var fibo=(f,n)=>{
  if (n==0) return f;
  return fibo(f+=n,n-1);
}

var generateHexes=()=>{
  let ra=radius;
  let aCount=Math.trunc(CSIZE/2/ra);
  let cCount=1+6*fibo(0, aCount-1);
  let c=new Circle(0,0,ra);
  cm.set("0,0",c);
  cm.forEach((c)=>{
    if (cm.size>=cCount) return;
    for (let a=0; a<6; a++) {
      let xt=ra*cos[a];
      let yt=ra*sin[a];
      let xc=c.x+2*xt;
      let yc=c.y+2*yt;
      let ckey=[Math.round(xc),Math.round(yc)];
      if (!cm.has(ckey.toString())) {
	let nc=new Circle(xc,yc,ra);
	cm.set(ckey.toString(),nc);
      }
    }
  });
}

generateHexes();

var duration=300;
var getHexagonsPaths2=()=>{
  let pths=[new Path2D(), new Path2D(), new Path2D()];
  let f=cuFrac(t/duration);
  //let f=Math.sin(TP/4*t/duration);
  cm.forEach((c)=>{
    let p=(c.y==0)?pths[0]:(c.x==0)?pths[1]:pths[2];
    let x=(1-f)*c.hpts[0].x+f*c.hpts[0].x2;
    let y=(1-f)*c.hpts[0].y+f*c.hpts[0].y2;
    p.moveTo(x,y);
    for (let i=1; i<6; i++) {
      x=(1-f)*c.hpts[i].x+f*c.hpts[i].x2;
      y=(1-f)*c.hpts[i].y+f*c.hpts[i].y2;
      p.lineTo(x,y);
    }
    p.closePath();
  });
  return pths;
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

var t=0;

var step=0;
var animate=()=>{
  if (stopped) return;
  t++;
  if (t==duration) {
    t=0;
    transit();
  }
  draw();
  requestAnimationFrame(animate);
}

let xpa=Array.from(xSet).sort((a,b)=>{ return a-b; });
let ypa=Array.from(ySet).sort((a,b)=>{ return a-b; });

var setRandomPoints=()=>{
  let xpr=[0];
  for (let i=0; i<(xSet.size-1)/2; i++) {
    let nx=Math.round((CSIZE-80)*Math.random());
    xpr.push(nx);
    xpr.push(-nx);
  }
  xpr.sort((a,b)=>{ return a-b; });
  let ypr=[];
  for (let i=0; i<ySet.size/2; i++) {
    let ny=Math.round((CSIZE-80)*Math.random());
    ypr.push(ny);
    ypr.push(-ny);
  }
  ypr.sort((a,b)=>{ return a-b; });
  for (let i=0; i<xpa.length; i++) {
    for (let j=0; j<ypa.length; j++) {
      let hex=hpm.get([xpa[i],ypa[j]].toString());
      if (hex) {
	hex.x2=xpr[i];
	hex.y2=ypr[j];
      }
    }
  }
}

var transit=()=>{
  hpm.forEach((p)=>{ p.x=p.x2; p.y=p.y2; });
  setRandomPoints();
  cols.transit();
}

setRandomPoints();
transit();

var draw=()=>{
  let paths=getHexagonsPaths2();
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let dm1=new DOMMatrix([-0.5,0.866,-0.866,-0.5,0,0]);
  let dm2=new DOMMatrix([-0.5,-0.866,0.866,-0.5,0,0]);
  let dp1=new Path2D();
  dp1.addPath(paths[1]);
  dp1.addPath(paths[1], dm1);
  dp1.addPath(paths[1], dm2);
  let dp2=new Path2D();
  dp2.addPath(paths[0]);
  dp2.addPath(paths[0], dm1);
  dp2.addPath(paths[0], dm2);
  let dp3=new Path2D();
  dp3.addPath(paths[2]);
  dp3.addPath(paths[2], dm1);
  dp3.addPath(paths[2], dm2);
  let dpa=new Path2D();
  dpa.addPath(dp1);
  dpa.addPath(dp2);
  dpa.addPath(dp3);
  ctx.fillStyle=cols.getColor(3);
  ctx.fill(dpa);
  ctx.fillStyle=cols.getColor(2);
  ctx.fill(dp3,"evenodd");
  ctx.fillStyle=cols.getColor(4);
  ctx.fill(dp2,"evenodd");
  ctx.fillStyle=cols.getColor(5);
  ctx.fill(dp1,"evenodd");
  ctx.lineWidth=24;
  ctx.strokeStyle=cols.getColor(0);
  ctx.stroke(dpa);
  ctx.lineWidth=8;
  ctx.strokeStyle=cols.getColor(1);
  ctx.stroke(dpa);
}

start();
