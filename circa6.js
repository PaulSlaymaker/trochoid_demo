"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");

const TP=2*Math.PI;
const CSIZE=480;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
//c.style.outline="1px dotted red";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

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

var colors=[];
var colors2=[];
var getColors=()=>{
  let c=[];
  let colorCount=getRandomInt(3,9);
  let hue=getRandomInt(0,90,true)+30;
  let colorSeg=Math.round(360/colorCount);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-40,40);
    let sat=60+getRandomInt(0,31);
    let lum=40+getRandomInt(0,21);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}

//var radius=[12,16,20,24,30,32][getRandomInt(0,6)];	// no 15?
//var radius=[16,20,24,30,32,40][getRandomInt(0,6)];	// no 15?
//var radius=[8,12,16,20,24,30,32][getRandomInt(0,7)];	// no 15?
const radius=40;

const cos=[1,0.5,-0.5,-1,-0.5,0.5];
const sin=[0,0.866,0.866,0,-0.866,-0.866];
const RF=radius/Math.cos(TP/12);

var hpm=new Map();
var xSet=new Set();
var ySet=new Set();

var Circle=function(x,y) {
  this.x=x;
  this.y=y;
//  this.pts=new Array(6);
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
//    this.hpts[i]={"x":xz,"y":yz};
  }
}

onresize();

var cm=new Map();

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
	cm.set(ckey.toString(),new Circle(xc,yc,ra));
      }
    }
  });
}

generateHexes();

var drawPoint=(p,col)=>{	// diag
ctx.beginPath();
ctx.arc(p.x,p.y,6,0,TP);
if (col) ctx.fillStyle=col;
else ctx.fillStyle="red";
ctx.fill();
}

var drawCircles=()=>{ // diag
  let p=new Path2D();
  cm.forEach((c)=>{
    p.moveTo(c.x+radius,c.y);
    p.arc(c.x,c.y,radius,0,TP);
  });
  ctx.lineWidth=1;
  ctx.strokeStyle="yellow";
  ctx.stroke(p);
}

var drawHexes=()=>{  // diag
  let p=new Path2D();
  cm.forEach((c)=>{
    p.moveTo(c.hpts[0].x,c.hpts[0].y);
    for (let i=1; i<6; i++) {
      p.lineTo(c.hpts[i].x,c.hpts[i].y);
    }
    p.closePath();
  });
  ctx.lineWidth=3;
  ctx.strokeStyle="black";
  ctx.stroke(p);
}

var cuFrac=(frac)=>{
    let f1=.1;
    let f2=.9;
    var e2=3*frac*Math.pow(1-frac,2)*f1;
    var e3=3*(1-frac)*Math.pow(frac,2)*f2;
    var e4=Math.pow(frac,3);
    return e2+e3+e4;
}

var getHexPath=(q)=>{
  let p=new Path2D();
  p.moveTo((q[0].x+q[1].x)/2,(q[0].y+q[1].y)/2);
  for (let i=0; i<6; i++) {
    let a=(i+1)%6;
    let b=(i+2)%6;
    let cx=q[a].x;
    let cy=q[a].y;
    p.bezierCurveTo(cx,cy,cx,cy,(cx+q[b].x)/2,(cy+q[b].y)/2);
  }
  return p;
}

//ctx.shadowColor="black";
ctx.shadowColor="hsla(0,0%,0%,0.6)";

var fillHexT=()=>{
  const dm0=new DOMMatrix([1,0,0,1,0,0]);
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  const dmxy=new DOMMatrix([-1,0,0,-1,0,0]);
  let counter=0;
  ctx.strokeStyle="black";
  let f=cuFrac(f1);
  cm.forEach((c)=>{
    if (c.x>=0 && c.y>=0) {
      let pa=[];
      for (let i=0; i<6; i++) {
        pa.push({"x":(1-f)*c.hpts[i].x+f*c.hpts[i].x2,"y":(1-f)*c.hpts[i].y+f*c.hpts[i].y2});
      }
      let p=getHexPath(pa);
/*
      let p=new Path2D();
      p.moveTo((1-f)*c.hpts[0].x+f*c.hpts[0].x2,(1-f)*c.hpts[0].y+f*c.hpts[0].y2);
      for (let i=1; i<6; i++) {
        p.lineTo((1-f)*c.hpts[i].x+f*c.hpts[i].x2,(1-f)*c.hpts[i].y+f*c.hpts[i].y2);
      }
      p.closePath();
*/
      let dpath=new Path2D();
      dpath.addPath(p,dm0);
      if (c.x==0 && c.y==0) {
      } else if (c.x==0) {
        dpath.addPath(p,dmy);
      } else if (c.y==0) {
        dpath.addPath(p,dmx);
      } else {
        //dpath.addPath(p,new DOMMatrix([1,0,0,-1,0,0]));
        //dpath.addPath(p,new DOMMatrix([-1,0,0,1,0,0]));
        dpath.addPath(p,dmy);
        dpath.addPath(p,dmx);
        dpath.addPath(p,dmxy);
      }
ctx.shadowBlur=0;
      if (step==2) {
        ctx.globalAlpha=1-f2;
        ctx.fillStyle=colors[counter%colors.length];
        ctx.fill(dpath);
        ctx.globalAlpha=f2;
        ctx.fillStyle=colors2[counter%colors2.length];
        ctx.fill(dpath);
        ctx.globalAlpha=1;
        counter++;
      } else {
        ctx.fillStyle=colors[counter++%colors.length];
        ctx.fill(dpath);
      }
ctx.shadowBlur=12;
      ctx.stroke(dpath);
    }
  });
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  fillHexT();
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
var duration=100;
var cduration=60;
var f1=0;
var f2=0;
var animate=()=>{
  if (stopped) return;
  t++;
  if (step==0) {
    if (t==duration) {
      t=0;
      transit();
      step=1;
    }
    f1=t/duration;
    draw();
  } else if (step==1) {
    if (t==100) {
      t=0;
      step=2;
      if (EM) stopped=true;
    }
  } else if (step==2) {
    if (t==cduration) {
      t=0;
      step=3;
      colors=colors2.slice();
      colors2=getColors();
    }
    f2=t/cduration;
    draw();
  } else {
    if (t==100) {
      t=0;
      step=0;
    }
  }
  requestAnimationFrame(animate);
}

let xpa=Array.from(xSet).sort((a,b)=>{ return a-b; });
let ypa=Array.from(ySet).sort((a,b)=>{ return a-b; });

var setRandomPoints=()=>{
  let xpr=[0];
  for (let i=0; i<(xSet.size-1)/2; i++) {
    let rand=Math.round(CSIZE*Math.random());
    xpr.push(rand);
    xpr.push(-rand);
  }
  xpr.sort((a,b)=>{ return a-b; });
  let ypr=[];
  for (let i=0; i<ySet.size/2; i++) {
    let rand=Math.round(CSIZE*Math.random());
    ypr.push(rand);
    ypr.push(-rand);
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
}

ctx.lineWidth=4;

colors=getColors();
colors2=getColors();
transit();
transit();
//fillHexes();

if (EM) draw();
else start();
