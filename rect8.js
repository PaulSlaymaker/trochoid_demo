"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
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
//ctx.lineCap="round"; // for dash

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
    this.RK1=160+160*Math.random();
    this.GK1=160+160*Math.random();
    this.BK1=160+160*Math.random();
  }
  this.randomize();
}

var colors=[new Color(),new Color(),new Color()];

/*
var setColors=(n)=>{
  colors=[];
  for (let i=0; i<n; i++) {
    colors.push(new Color());
  }
}
*/

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
//this.setZero=()=>{ this.xd2=0; this.yd2=0; }
  this.transit=()=>{ this.x=this.x2; this.y=this.y2; this.yd=this.yd2; this.xd=this.xd2; }
  this.setValues=(xp,yp,xdp,ydp)=>{ this.x2=xp; this.y2=yp; this.xd2=xdp; this.yd2=ydp; }
  this.getPath=()=>{
    let p=new Path2D();
    if (hv==1) {
      if (this.xd2==0) return p;
      let x=this.x2;
      let xd=this.xd2;
      let y=(1-f)*this.y+f*this.y2;
      let yd=(1-f)*this.yd+f*this.yd2;
      if (yd==0) return p;
      p.rect(del*(x-xd),del*(y-yd),del*2*xd,del*2*yd);
    } else if (hv==0) {
      if (this.yd==0) return p;
      let x=(1-f)*this.x+f*this.x2;
      let xd=(1-f)*this.xd+f*this.xd2;
      if (xd==0) return p;
      let y=this.y;
      let yd=this.yd;
      p.rect(del*(x-xd),del*(y-yd),del*2*xd,del*2*yd);
    } else if (hv==2) {
      if (this.xd==0) return p;
      let x=this.x;
      let xd=this.xd;
      let y=(1-f)*this.y+f*this.y2;
      let yd=(1-f)*this.yd+f*this.yd2;
      if (yd==0) return p;
      p.rect(del*(x-xd),del*(y-yd),del*2*xd,del*2*yd);
    } else if (hv==3) {
      if (this.yd2==0) return p;
      let x=(1-f)*this.x+f*this.x2;
      let xd=(1-f)*this.xd+f*this.xd2;
      if (xd==0) return p;
      let y=this.y2;
      let yd=this.yd2;
      p.rect(del*(x-xd),del*(y-yd),del*2*xd,del*2*yd);
    } else {
      debugger;
    }
    p.addPath(p,DMX);	// no 0-centered
    p.addPath(p,DMY);
    return p;
  }
}

/*
var drawPoint=(x,y,col,rad)=>{	// diag
  ctx.beginPath();
  if (rad) ctx.arc(x,y,rad,0,TP);
  else ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}
*/

const transit=()=>{ for (let i=0; i<ra.length; i++) ra[i].transit(); }

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
//  if (EM) stopped=true;
  if (stopped) return;
  if (ts<pauseTS) requestAnimationFrame(pause);
  else requestAnimationFrame(animate);
}

var hv=0;
var t=0;
var f=0;
var c=0;
const DUR=360;	// must be even
var animate=(ts)=>{
  if (stopped) return;
  t++;
  c++;
  f=(1-Math.cos(TP*t/DUR))/2;
  draw();
  //if (EM && t%200==0) stopped=true;
  if (t>=DUR/2) {
    t=0;
    hv=(++hv)%4;
//randomizeDash();
  //  stopped=true;
    if (c%DUR==0) {
      transit();
      setPoints();
      setRectangles();
      pauseTS=performance.now()+4000;
    } else {
      pauseTS=performance.now()+100;
    }
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

const count=8;
var del=CSIZE/count;

var pts=new Array(count+1);
var setPoints=()=>{
//  count=[4,8,12,16,20,24,32][getRandomInt(0,6)];
  pts=new Array(count+1);
  for (let i=0; i<count+1; i++) {
    pts[i]=new Array(count+1);
    for (let j=0; j<count+1; j++) pts[i][j]=false;
//      pts[i][j]=new Point();
  }
}

const getNextPoint=()=>{
  let sx=getRandomInt(0,count);
  let sy=getRandomInt(0,count);
  if (pts[sx][sy]) {
    let rx=getRandomInt(0,count);
    let ry=getRandomInt(0,count);
    for (let i=rx; i<rx+count; i++) {
      for (let j=ry; j<ry+count; j++) {
        if (!pts[i%count][j%count]) return [i%count,j%count];
      }
    }
    return [-1,-1];
  }
  return [sx,sy];
}

const checkPoints=(x,y,xd,yd)=>{
  for (let i=1; i<=xd; i++) {
    for (let j=1; j<=yd; j++) {
      if (pts[x+i][y+j]) return [i,j];
      if (pts[x-i][y+j]) return [i,j];
      if (pts[x+i][y-j]) return [i,j];
      if (pts[x-i][y-j]) return [i,j];
    }
  }
  return [xd,yd];
}

const setRectangles=()=>{
  for (let i=0; i<count+1; i++) {
    for (let j=0; j<count+1; j++) {
      if (i==0 || j==0) pts[i][j]=true;
      else pts[i][j]=false;
//if (i==0 || j==0) pts[i][j]=true;
//else pts[i][j]=false;
    }
  }
//let testa=[];
  for (let idx=0; idx<ra.length; idx++) {
    let [x,y]=getNextPoint();
    if (x==-1) {
      ra[idx].setZero();
//testa.push(idx);
      continue;
    }
    let maxxd=Math.min(x,count-x);
    let xd=Math.min(count/2,maxxd);
    let maxyd=Math.min(y,count-y);
    let yd=Math.min(count/2,maxyd);
    [xd,yd]=checkPoints(x,y,xd,yd);
    for (let i=0; i<=2*xd; i++) {
      for (let j=0; j<=2*yd; j++) {
	pts[x-xd+i][y-yd+j]=true;
      }
    }
    ra[idx].setValues(x,y,xd,yd);
  }
//console.log("lost "+testa.length);
}

const RCOUNT=12;  // close for count==8
//const RCOUNT=24;  // close for count==12
//console.log(RCOUNT);

var ra=[];

for (let i=0; i<RCOUNT; i++) ra[i]=new Rect2();

/*
var da1=del*getRandomInt(1,12);
var da2=del*getRandomInt(1,12);
var db1=2*del*getRandomInt(1,9,true);
var db2=del*getRandomInt(1,12);
var do1=0;
var do2=0;
var dk1=0;
var dk2=del*getRandomInt(0,3);
var dash=[];
var randomizeDash=()=>{
da1=db1;
da2=db2;
db1=2*del*getRandomInt(1,9,true);
db2=2*del*getRandomInt(1,9,true);
  dash=[da1,da2];
console.log(dash);
  do2=2*del*getRandomInt(0,5);
  dk1=dk2;
  dk2=del*getRandomInt(0,3);
}
*/

var draw=()=>{
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
 
//let dasht=[(1-f)*da1+f*db1,(1-f)*da2+f*db2];
//let dasht=[(1-f)*da1+f*db1,(1-f)*da2+f*db2];
//ctx.setLineDash(dasht);
//ctx.lineDashOffset=t;
  let tile=new Path2D();
  for (let i=0; i<ra.length; i++) {
    let p=ra[i].getPath();
/*
    ctx.fillStyle=colors[i%colors.length].getRGB();
    ctx.fill(p);
*/
    ctx.lineWidth=4;
    ctx.strokeStyle=colors[i%colors.length].getRGB();
    ctx.stroke(p);
/*
ctx.lineWidth=9;
ctx.setLineDash([1,5*del-1]);
ctx.lineDashOffset=-del;
ctx.lineCap="round";
ctx.stroke(p);
*/
    tile.addPath(p); 	// need 2 tiles, for each color, 2 dashes?
  }
//ctx.setLineDash([]);
  ctx.lineWidth=9;
  ctx.strokeStyle="#0000001A";
  ctx.stroke(tile);
}

onresize();

setPoints();
setRectangles();
transit();
setPoints();
setRectangles();

start();

