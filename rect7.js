"use strict"; // Paul Slaymaker, paul25882@gmail.com
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
//ctx.globalAlpha=1; //0.5;

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=160;
  const CT=255-CBASE;
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=200+200*Math.random();
    this.GK1=200+200*Math.random();
    this.BK1=200+200*Math.random();
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

var Point=function() { 
//  this.x=0; 
//  this.y=0; 
  this.u=false;
}

const DMX=new DOMMatrix([-1,0,0,1,0,0]);
const DMY=new DOMMatrix([1,0,0,-1,0,0]);
var Rect2=function(x,y,xd,yd) { 
  this.x=x;
  this.y=y;
  this.xd=xd;
  this.yd=yd;
  this.x2=0;
  this.y2=0;
  this.xd2=0;
  this.yd2=0;
  this.setZero=()=>{ this.x2=0; this.y2=0; this.xd2=0; this.yd2=0; }
  this.transit=()=>{ this.x=this.x2; this.y=this.y2; this.yd=this.yd2; this.xd=this.xd2; }
  //this.setValues=(x,y,xd,yd)=>{ this.x2=x; this.y2=y; this.xd2=xd; this.yd2=yd; }
  this.setValues=(xp,yp,xdp,ydp)=>{ this.x2=xp; this.y2=yp; this.xd2=xdp; this.yd2=ydp; }
  this.getPath2=(test)=>{
    let p=new Path2D();
    if (this.xd==0 || this.yd==0) return p;	// all 4 zero
    let x=(1-f)*this.x+f*this.x2;
    let y=(1-f)*this.y+f*this.y2;
    let xd=(1-f)*this.xd+f*this.xd2;
    let yd=(1-f)*this.yd+f*this.yd2;
//let xdz=xd*(1-0.7*f2);
//let ydz=yd*(1-0.7*f2);
    p.rect(del*(x-xd),del*(y-yd),del*2*xd,del*2*yd);
    //p.rect(del*(x-xdz),del*(y-ydz),del*2*xdz,del*2*ydz);
/*
    p.moveTo(del*(x-xd),del*(y-yd));
    p.lineTo(del*(x+xd),del*(y-yd));
    p.lineTo(del*(x+xd),del*(y+yd));
    p.lineTo(del*(x-xd),del*(y+yd));
    p.closePath();
*/
    if (x && y) {
      p.addPath(p,DMX);
      p.addPath(p,DMY);
    } else if (x) {
      p.addPath(p,DMX);
    } else if (y) {
      p.addPath(p,DMY);
    }
    return p;
  }
  this.label=()=>{
  }
/*
  this.getPath=()=>{
debugger;
    let p=new Path2D();
    p.moveTo(del*(x-xd),del*(y-yd));
    p.lineTo(del*(x+xd),del*(y-yd));
    p.lineTo(del*(x+xd),del*(y+yd));
    p.lineTo(del*(x-xd),del*(y+yd));
    p.closePath();
    if (x && y) {
      p.addPath(p,DMY);
      p.addPath(p,DMX);
    } else if (x) {
      p.addPath(p,DMX);
    } else if (y) {
      p.addPath(p,DMY);
    }
    return p;
  }
*/
}

var drawPoint=(x,y,col,rad)=>{	// diag
  ctx.beginPath();
  if (rad) ctx.arc(x,y,rad,0,TP);
  else ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

const transit=()=>{
  for (let i=0; i<ra.length; i++) {
    ra[i].transit();
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

var pauseTS=1000;
var pause=(ts)=>{
  if (EM) stopped=true;
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var t=0;
var f=0;
var f2=0;
var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  c++;
  //f=t/500;
  f=(1-Math.cos(TP*t/1000))/2;
  //f2=Math.pow(Math.sin(TP*t/1000),2);
  //f2=Math.sin(TP*t/1000);
  draw();
  //if (EM && t%200==0) stopped=true;
//if (t>=250) {
  if (t>=500) {
  //  stopped=true;
    transit();
    setRectangles();
    t=0;
    pauseTS=performance.now()+4000;//3200;
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

setColors(3);

var count=8;
var del=CSIZE/count;

var pts=new Array(count+1);

for (let i=0; i<count+1; i++) {
  pts[i]=new Array(count+1);
  for (let j=0; j<count+1; j++) {
    pts[i][j]=new Point(del*i,del*j);
  }
}

const getNextPoint=()=>{
  let sx=getRandomInt(0,count);
  let sy=getRandomInt(0,count);
  if (pts[sx][sy].u) {
    let rx=getRandomInt(0,count);
    let ry=getRandomInt(0,count);
    for (let i=rx; i<rx+count; i++) {
      for (let j=ry; j<ry+count; j++) {
        if (!pts[i%count][j%count].u) {
          return [i%count,j%count];
        }
      }
    }
    return [-1,-1];
  }
  return [sx,sy];
}

const checkPoints=(x,y,xd,yd)=>{
  for (let i=1; i<=xd; i++) {
    for (let j=1; j<=yd; j++) {
      if (pts[x+i][y+j].u) return [i,j];
      if (x) if (pts[x-i][y+j].u) return [i,j];
      if (y) if (pts[x+i][y-j].u) return [i,j];
      if (x && y) if (pts[x-i][y-j].u) return [i,j];
    }
  }
  return [xd,yd];
}

var setRectangles=()=>{
  for (let i=0; i<count+1; i++) {
    for (let j=0; j<count+1; j++) {
      pts[i][j].u=false;
    }
  }
  for (let idx=0; idx<ra.length; idx++) {
    let [x,y]=getNextPoint();
    if (x==-1) {
      ra[idx].setZero();
      continue;
    }
    if (x==0 && y==0) {
      let xd=getRandomInt(1,count/4);
      let yd=getRandomInt(1,count/4);
      [xd,yd]=checkPoints(x,y,xd,yd);
      for (let i=0; i<=xd; i++) {
	for (let j=0; j<=yd; j++) {
	  pts[i][j].u=true;
	}
      }
      ra[idx].setValues(x,y,xd,yd);
    } else if (x==0) {
      let xd=getRandomInt(1,count/4);
      let maxyd=Math.min(y,count-y);
      let yd=Math.min(count/4,maxyd);
      [xd,yd]=checkPoints(x,y,xd,yd);
      for (let i=0; i<=xd; i++) {
	for (let j=0; j<=2*yd; j++) {
	  pts[i][y-yd+j].u=true;
	}
      }
      ra[idx].setValues(x,y,xd,yd);
    } else if (y==0) {
      let maxxd=Math.min(x,count-x);
      let xd=Math.min(count/4,maxxd);
      let yd=getRandomInt(1,count/4);
      [xd,yd]=checkPoints(x,y,xd,yd);
      for (let i=0; i<=2*xd; i++) {
	for (let j=0; j<=yd; j++) {
	  pts[x-xd+i][j].u=true;
	}
      }
      ra[idx].setValues(x,y,xd,yd);
    } else {
      let maxxd=Math.min(x,count-x);
      let xd=Math.min(count/4,maxxd);
      let maxyd=Math.min(y,count-y);
      let yd=Math.min(count/4,maxyd);
      [xd,yd]=checkPoints(x,y,xd,yd);
//  ctx.strokeRect(del*(x-xd),del*(y-yd),2*del*xd,2*del*yd);
      for (let i=0; i<=2*xd; i++) {
	for (let j=0; j<=2*yd; j++) {
	  pts[x-xd+i][y-yd+j].u=true;
	}
      }
      ra[idx].setValues(x,y,xd,yd);
    }
  }
}

const RCOUNT=8;

var ra=[];
/*
for (let i=0; i<RCOUNT; i++) {
  let rect=getNextRect();
  if (rect) ra.push(rect);
  else break;
}
if (ra.length<RCOUNT) debugger;
*/

for (let i=0; i<RCOUNT; i++) {
  ra[i]=new Rect2();
}

var draw=()=>{
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<ra.length; i++) {
    let p=ra[i].getPath2();
/*
    ctx.fillStyle=colors[i%colors.length].getRGB();
    ctx.fill(p);
*/
//ctx.globalAlpha=1-0.95*f2;
//ctx.globalAlpha=1-f2;
//ctx.setLineDash([]);
    ctx.lineWidth=9;
    ctx.strokeStyle="#00000020";
    ctx.stroke(p);
    ctx.lineWidth=6;
    ctx.strokeStyle=colors[i%colors.length].getRGB();
    ctx.stroke(p);
/*
ctx.lineWidth=9;
ctx.setLineDash([1,5*del-1]);
ctx.lineDashOffset=-del;
ctx.lineCap="round";
ctx.stroke(p);
*/
  }
}

var showPoints=()=>{
  for (let i=0; i<count+1; i++) {
    for (let j=0; j<count+1; j++) {
      if (pts[i][j].u) drawPoint(i*del,j*del,"white");
      else drawPoint(i*del,j*del);
    }
  }
}

var drawRect=(rct)=>{
  ctx.fillStyle="red";
  ctx.fill(rct.getPath());
}

onresize();

setRectangles();
transit();
setRectangles();

start();

ctx.font="20px sans-serif";
ctx.textAlign="center";
var drawText=(two,col)=>{	// diag
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="black";
  for (let i=0; i<ra.length; i++) {
    if (two) ctx.fillText(i,del*ra[i].x2,del*ra[i].y2);
    else ctx.fillText(i,del*ra[i].x,del*ra[i].y);
  }
}
