"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/details/xxMVjeJ
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");

const TP=2*Math.PI;
const CSIZE=400;

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
//ctx.strokeStyle="black";
ctx.globalAlpha=0.7;

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=64;
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
    this.RK1=300+300*Math.random();
    this.GK1=300+300*Math.random();
    this.BK1=300+300*Math.random();
  }
  this.randomize();
}

var colors;
var setColors=(n)=>{
  colors=[];
  for (let i=0; i<n; i++) {
    colors.push(new Color());
  }
}

var Point=function() { this.x=0; this.y=0; }

var Distance=function(idx) {
  this.d;
  if (idx==0) {
    this.d=0;
    this.setD=()=>{ }
  } else if (idx==COUNT-1) {
    this.d=CSIZE;
    this.setD=()=>{ }
  } else {
    this.K1a=(2000+2000*Math.random())/TP;
    //this.K1a=(3200+3200*(idx%2))/TP;
    //this.K1a=320+idx*320/COUNT;
    this.K2a=TP*Math.random();
    //this.K2a=idx*TP/(COUNT-1);
    //this.K2a=TP/2*(idx%2);
    //this.setD=()=>{ this.d=CSIZE/2*(1+Math.sin(this.K2a+t/this.K1a)/2+Math.sin(this.K2a+2*t/this.K1a)/2); }
    this.setD=()=>{ this.d=CSIZE/2*(1+Math.sin(this.K2a+t/this.K1a)); }
  }
  this.setD();
}

var Rect=function(ix,iy,ix2,iy2) { 
  //this.pts=[new Point(),new Point(),new Point(),new Point()]; 
  this.getPath=()=>{
    const dmx=new DOMMatrix([-1,0,0,1,0,0]);
    const dmy=new DOMMatrix([1,0,0,-1,0,0]);
    let p=new Path2D();
    if (ix==0 && iy==0) {
      p.moveTo(-xa[ix2].d+1,-ya[iy2].d+1);
      p.lineTo(xa[ix2].d-1,-ya[iy2].d+1);
      p.lineTo(xa[ix2].d-1,ya[iy2].d-1);
      p.lineTo(-xa[ix2].d+1,ya[iy2].d-1);
      p.closePath();
    } else if (ix==0) {
      p.moveTo(-xa[ix2].d+1,ya[iy].d+1);
      p.lineTo(xa[ix2].d-1,ya[iy].d+1);
      p.lineTo(xa[ix2].d+1,ya[iy2].d-1);
      p.lineTo(-xa[ix2].d-1,ya[iy2].d-1);
      p.closePath();
      p.addPath(p,dmy);
    } else if (iy==0) {
      p.moveTo(xa[ix].d+1,-ya[iy2].d+1);
      p.lineTo(xa[ix2].d-1,-ya[iy2].d+1);
      p.lineTo(xa[ix2].d-1,ya[iy2].d-1);
      p.lineTo(xa[ix].d+1,ya[iy2].d-1);
      p.closePath();
      p.addPath(p,dmx);
    } else {
      p.moveTo(xa[ix].d+1,ya[iy].d+1);
      p.lineTo(xa[ix2].d-1,ya[iy].d+1);
      p.lineTo(xa[ix2].d-1,ya[iy2].d-1);
      p.lineTo(xa[ix].d+1,ya[iy2].d-1);
      p.closePath();
      p.addPath(p,dmy);
      p.addPath(p,dmx);
    }
    return p;
  }
}

var drawPoint=(x,y,col)=>{	// diag
ctx.beginPath();
ctx.arc(x,y,6,0,TP);
if (col) ctx.fillStyle=col;
else ctx.fillStyle="red";
ctx.fill();
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
var animate=(ts)=>{
  if (stopped) return;
  t++;
  setXYArrays();
  draw();
  if (EM && t%200==0) stopped=true;
  requestAnimationFrame(animate);
}

const COUNT=getRandomInt(7,10);

if (COUNT==7) setColors(4);
else if (COUNT==9) setColors(3);
else setColors(getRandomInt(3,5));

//console.log(" C:"+COUNT+" COL:"+colors.length);
var xa=new Array(COUNT);
var ya=new Array(COUNT);
for (let i=0; i<COUNT; i++) {
  xa[i]=new Distance(i);
  ya[i]=new Distance(i);
}

var setXYArrays=()=>{
  for (let i=1; i<COUNT-1; i++) {
    xa[i].setD();
    ya[i].setD();
  }
  xa.sort((a,b)=>{ return a.d-b.d; });
  ya.sort((a,b)=>{ return a.d-b.d; });
/*
for (let i=1; i<COUNT-2; i++) {
  if (xa[i+1].d-xa[i].d<0.001) console.log(i,xa[i]);
}
*/
}

var ra=[];
var setRectangles=()=>{
  for (let i=0; i<COUNT-1; i++) {
    for (let j=0; j<COUNT-1; j++) {
      ra.push(new Rect(i,j,i+1,j+1));
    }
  }
}
setRectangles();

var draw=()=>{
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let pa=new Array(colors.length);
  for (let i=0; i<colors.length; i++) pa[i]=new Path2D();
  for (let i=0; i<ra.length; i++) {
    pa[i%pa.length].addPath(ra[i].getPath());

//    let path=new Path2D();
//    ra[i].draw(path);
/*
    let path=ra[i].getPath();
    ctx.fillStyle=colors[i%colors.length].getRGB();
    ctx.fill(path);
    ctx.stroke(path);
*/
  }
  for (let i=0; i<colors.length; i++) {
//    ctx.fillStyle=colors[i].getRGB();
//    ctx.fill(pa[i]);
    ctx.strokeStyle=colors[i].getRGB();
    ctx.stroke(pa[i]);
  }
}

setXYArrays();

onresize();

start();
