"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/wvrdmVQ
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");

const TP=2*Math.PI;
const CSIZE=320;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=2;

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  //const CBASE=112;
const CBASE=176;
  const CT=255-CBASE;
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=180+180*Math.random();
    this.GK1=180+180*Math.random();
    this.BK1=180+180*Math.random();
  }
  this.randomize();
}

const colors=[new Color(),new Color(),new Color()];
if (Math.random()<0.5) colors.push(new Color);

const radius=32;

const cos=[1,0.5,-0.5,-1,-0.5,0.5];
const sin=[0,0.866,0.866,0,-0.866,-0.866];
const RF=radius/Math.cos(TP/12);

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
      //let hp={"x":xz,"y":yz,"x2":xz,"y2":yz};
      let hp={"x":xz,"y":yz};
      hpm.set(hk,hp);
      this.hpts[i]=hp;
    } else {
      this.hpts[i]=hpm.get(hk);
    }
  }
  this.getHexPath=()=>{
    let p=new Path2D();
    p.moveTo((this.hpts[0].x+this.hpts[1].x)/2,(this.hpts[0].y+this.hpts[1].y)/2);
    for (let i=0; i<6; i++) {
      let a=(i+1)%6;
      let b=(i+2)%6;
      let cx=this.hpts[a].x;
      let cy=this.hpts[a].y;
      p.bezierCurveTo(cx,cy,cx,cy,(cx+this.hpts[b].x)/2,(cy+this.hpts[b].y)/2);
    }
    return p;
  }
}

var cm=new Map();

var fibo=(f,n)=>{
  if (n==0) return f;
  return fibo(f+=n,n-1);
}

var generateHexes=()=>{
  let ra=radius;
  let aCount=Math.trunc(CSIZE/2/ra);
  let cCount=1+6*fibo(0, aCount-1);
  let c=new Circle(0,0);
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
	cm.set(ckey.toString(),new Circle(xc,yc));
      }
    }
  });
  cm.forEach((c)=>{
    if (c.x<0 || c.y<0) {
      cm.delete(c.key);
    }
  });
}

generateHexes();

var drawPoint=(x,y,col)=>{	// diag
ctx.beginPath();
ctx.arc(x,y,6,0,TP);
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

ctx.shadowColor="#00000040";
const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dmxy=new DOMMatrix([-1,0,0,-1,0,0]);

var draw=()=>{
  setPoints();
  let counter=0;
  cm.forEach((c)=>{
    if (c.x>=0 && c.y>=0) {	// remove from cm at creation
      let p=c.getHexPath();
      let dpath=new Path2D(p);
      if (c.x==0 && c.y==0) {
      } else if (c.x==0) {
        dpath.addPath(p,dmy);
      } else if (c.y==0) {
        dpath.addPath(p,dmx);
      } else {
        dpath.addPath(p,dmy);
        dpath.addPath(p,dmx);
        dpath.addPath(p,dmxy);
      }
      ctx.fillStyle=colors[counter++%colors.length].getRGB();
      ctx.shadowBlur=0;
      ctx.globalAlpha=0.1;
      ctx.fill(dpath);
      ctx.shadowBlur=12;
      ctx.globalAlpha=1;
      ctx.stroke(dpath);
    }
  });
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
var animate=()=>{
  if (stopped) return;
  t++;
  draw();
  if (EM && t%200==0) stopped=true;
  requestAnimationFrame(animate);
}

let xpa=Array.from(xSet).sort((a,b)=>{ return a-b; });
let ypa=Array.from(ySet).sort((a,b)=>{ return a-b; });

var Kxa=new Array((xSet.size-1)/2);
var Kxb=new Array((xSet.size-1)/2);
for (let i=0; i<Kxa.length; i++) {
  Kxa[i]=300+300*Math.random();
  Kxb[i]=TP*Math.random();
}

var Kya=new Array(ySet.size/2);
var Kyb=new Array(ySet.size/2);
for (let i=0; i<Kya.length; i++) {
  Kya[i]=300+300*Math.random();
  Kyb[i]=TP*Math.random();
}

var setPoints=()=>{
  let xpr=[0];
  for (let i=0; i<(xSet.size-1)/2; i++) {
    let rand=CSIZE/2*(1+Math.sin(Kxb[i]+t/Kxa[i]));
    xpr.push(rand);
    xpr.push(-rand);
  }
  xpr.sort((a,b)=>{ return a-b; });
  let ypr=[];
  for (let i=0; i<ySet.size/2; i++) {
    let rand=CSIZE/2*(1+Math.sin(Kyb[i]+t/Kya[i]));
    ypr.push(rand);
    ypr.push(-rand);
  }
  ypr.sort((a,b)=>{ return a-b; });
  for (let i=0; i<xpa.length; i++) {
    for (let j=0; j<ypa.length; j++) {
      let hex=hpm.get([xpa[i],ypa[j]].toString());
      if (hex) {
	hex.x=xpr[i];
	hex.y=ypr[j];
      }
    }
  }
/* cm.forEach((c)=>{ // generate mean x,y } */
}

onresize();

//if (EM) draw();
//else start();
start();
