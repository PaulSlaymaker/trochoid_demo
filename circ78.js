"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S6=Math.sin(Math.PI/3);
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
c.style.outline="1px dotted gray";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

const CCOUNT=400;

function Color(km,kv) {
  const CBASE=112;
  const CT=255-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.random());
    let grn=Math.round(CBASE+CT*Math.random());
    let blu=Math.round(CBASE+CT*Math.random());
    //let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    //let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    //let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
/*
  this.randomize=()=>{
    this.RK1=km+kv*Math.random();
    this.GK1=km+kv*Math.random();
    this.BK1=km+kv*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
*/
}

var color=new Color();
var col=[];
for (let i=0; i<CCOUNT; i++) {
  col.push(color.getRGB());
}

//const MAXR=80;
var MAXR=24;
//var s=0.5;
var s=1;

var getAngle=(x,y,r,a,d)=>{	// not especially effective for central trend
  let angle1=a+d*Math.PI*Math.random();
  let xp=x+r*Math.cos(a);
  let yp=y+r*Math.sin(a);
  let d1=Math.pow(xp*xp+yp*yp,0.5);
  let angle2=a+d*Math.PI*Math.random();
  xp=x+r*Math.cos(a);
  yp=y+r*Math.sin(a);
  let d2=Math.pow(xp*xp+yp*yp,0.5);
  if (d2>d1) return angle1;
  else return angle2;	// return xp,yp
}

var K=20;

function Circle(curve,timp,d) {
  // r as random fct of distance from 0,0
  if (curve.ca.length==0) {
    this.r=8+MAXR*Math.random();	// assure r or dist large enough to keep a2-a1 <PI?, but enable PI angles
    this.dir=d;
    this.a1=Math.PI*Math.random();
    this.gc=0;
      //this.x=80*Math.random();
      //this.y=80*Math.random();
    this.x=200-400*Math.random();
    this.y=200-400*Math.random();
  } else {
    //let minr=curve.dist/Math.PI;
    this.r=curve.dist/Math.PI+MAXR*Math.random();
//this.r=curve.dist/Math.PI+MAXR*Math.pow(Math.random(),2);
    this.gc=curve.ca[curve.ca.length-1];
    this.dir=-this.gc.dir;
    this.x=this.gc.x+(this.gc.r+this.r)*Math.cos(this.gc.a2);
    this.y=this.gc.y+(this.gc.r+this.r)*Math.sin(this.gc.a2);
    this.a1=(this.gc.a2+TP/2)%TP; 
  }
  this.a2=this.a1+this.dir*curve.dist/this.r;
  this.xp2=this.x+this.r*Math.cos(this.a2);
  this.yp2=this.y+this.r*Math.sin(this.a2);
  this.time=timp;
  this.getCirclePath=()=>{	// diag
    let p=new Path2D();
    p.arc(this.x,this.y,this.r,0,TP);
    return p;
  }
  this.setPath=(p)=>{
    p.arc(this.x,this.y,this.r,this.a1,this.a2,this.dir==-1);
  }
  this.setPathT=(cur)=>{
    let d=(cur.t-this.time)/(s*curve.dist)*(this.a2-this.a1);
    cur.path.arc(this.x,this.y,this.r,this.a1,this.a1+d,this.dir==-1);
  }
  this.setPathE=(cur)=>{
    let d=(cur.t-this.time)/(s*curve.dist)*(this.a2-this.a1);
    let xp=this.x+this.r*Math.cos(this.a1+d);
    let yp=this.y+this.r*Math.sin(this.a1+d);
//drawPoint(xp,yp,"yellow",10);
//drawPoint(this.xp2,this.yp2,"blue",5);
    cur.path.moveTo(xp,yp);
    if (cur.t-this.time>s*curve.dist) {
      return true;
    }
    cur.path.arc(this.x,this.y,this.r,this.a1+d,this.a2,this.dir==-1);
    return false;
  }
  this.getCirclePath=()=>{
    let p=new Path2D();
    p.arc(this.x,this.y,this.r,0,TP);
    return p;
  }
  this.reverse=()=>{
    this.dir*=-1;
    let at=this.a1;
    this.a1=this.a2;
    this.a2=at;
//if (this.dir*(this.a2-this.a1)<0) debugger;
    this.time=0;
  }
  this.checkBounds=()=>{
    if (Math.pow(this.xp2*this.xp2+this.yp2*this.yp2,0.5)>CSIZE-6) return false;
    for (let i=0; i<cua.length; i++) {
if (cua[i]==curve) continue;	// separate check?, pip
      for (let j=0; j<cua[i].ca.length; j++) {
        let xd=this.xp2-cua[i].ca[j].xp2;
        let yd=this.yp2-cua[i].ca[j].yp2;
        let dc=Math.pow(xd*xd+yd*yd,0.5);
        if (dc<K) return false;
      }
    }
    return true;
  }
  this.checkBoundsO=()=>{ // make global
    if (Math.pow(this.xp2*this.xp2+this.yp2*this.yp2,0.5)>CSIZE) return false;
//    let xp2=this.x+this.r*Math.cos(this.a2);
//    let yp2=this.y+this.r*Math.sin(this.a2);
    for (let i=-1; i<2; i++) {
      let xpt=this.xp2+3*i;
      for (let j=-2; j<3; j++) {
        let ypt=this.yp2+2*j;
	let dc=Math.pow(xpt*xpt+ypt*ypt,0.5);
	if (dc>CSIZE) return false;
	for (let k=0; k<cua.length; k++) {
	  if (ctx.isPointInPath(cua[k].path,xpt+CSIZE,ypt+CSIZE)) return false;
	}
      }
    }
    return true;
  }
}

function Curve() {
  //this.count=5; //[6,8,4,10,12][getRandomInt(0,6,true)];
  this.count=[5,7,3,9,11][getRandomInt(0,6,true)];
  //this.dist=8+40*Math.random();
  this.dist=8+20*Math.random();
  this.t=0;
  this.path=new Path2D();
  this.state="N";
  this.ca=[];
  this.ca.push(new Circle(this,0,1));
  this.setPath=()=>{
    this.path=new Path2D();
    let notail=this.ca[0].setPathE(this);
//    let xp=this.ca[0].x+this.ca[0].r*Math.cos(this.ca[0].a1);
//    let yp=this.ca[0].y+this.ca[0].r*Math.sin(this.ca[0].a1);
//    this.path.moveTo(this.ca[0].xp,this.ca[0].yp);
      for (let i=1; i<this.ca.length-1; i++) {
	this.ca[i].setPath(this.path);
      }
//    }
    if (this.state=="N") {
      let fc=this.ca[this.ca.length-1];
      fc.setPathT(this);
      if (this.t-fc.time>=s*this.dist) {
	let cir=new Circle(this,this.t);
	if (cir.checkBounds()) {
	  this.ca.push(cir);
	  this.ca.shift();
	  this.ca[0].time=this.t;
	} else {
if (notail) this.state="R";
if (notail) return;
	}
      }
    }
  }
  this.drawEnds=()=>{
    let c1=this.ca[0];
    let xp1=c1.x+c1.r*Math.cos(c1.a1);
    let yp1=c1.y+c1.r*Math.sin(c1.a1);
    drawPoint(xp1,yp1);
    let c2=this.ca[this.ca.length-1];
    let xp2=c2.x+c2.r*Math.cos(c2.a2);
    let yp2=c2.y+c2.r*Math.sin(c2.a2);
    drawPoint(xp2,yp2);
  }
  this.reverse=()=>{
    for (let i=0; i<this.ca.length; i++) this.ca[i].reverse();
    this.ca.reverse();
//this.ca[this.ca.length-1].time=s*this.ca[this.ca.length-1].dist;
    this.state="N";
    this.t=0;
  }
  for (let i=0; i<this.count; i++) {
    let c=new Circle(this,0);
    if (c.checkBounds()) this.ca.push(c);
    else break;
  }
  this.setPath();
}

const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);
const dm3=new DOMMatrix([0,1,1,0,0,0]);
const dm60=new DOMMatrix([0.5,S6,-S6,0.5,0,0]);
const dm120=new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]);

var drawPoint=(x,y,col,r)=>{	// diag
  ctx.beginPath();
  let rad=3;
  if (r) rad=r;
  ctx.arc(x,y,rad,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

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
  MAXR=10+40*(1+Math.sin(t/400));
  cua.forEach((c)=>{ c.t++; c.setPath(); });
  cua.forEach((c)=>{ 
    if (c.state=="R") c.reverse();
//if (c.ca.length<3) stopped=true;
  });
  draw();
  requestAnimationFrame(animate);
}

let ccont=new Path2D();
ccont.arc(0,0,CSIZE,0,TP);

ctx.lineWidth=6;
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<cua.length; i++) {
    let p=new Path2D(cua[i].path);
//p.addPath(p,dm1);
//p.addPath(p,dm2);
//p.addPath(p,dm3);
//  let p2=new Path2D(p);
//  p2.addPath(p,dm60);
  //p2.addPath(p,dm120);
    ctx.lineWidth=9;	// temp?
    ctx.strokeStyle=col[i];
    ctx.stroke(p);
    
ctx.setLineDash([(cua[i].count+1)*(cua[i].dist)]);
//ctx.lineDashOffset=-t;
ctx.strokeStyle="black";
ctx.lineWidth=5;
ctx.stroke(p);

//ctx.setLineDash([(cua[i].count+1)*cua[i].dist/cua[i].count+1]);
ctx.setLineDash([cua[i].dist]);
ctx.strokeStyle=col[i+1];	// FIXME
ctx.lineWidth=2;
ctx.stroke(p);
ctx.setLineDash([]);

  }
ctx.lineWidth=2;
ctx.strokeStyle="white";
ctx.stroke(ccont);
}

var cua=[];
for (let i=0; i<CCOUNT; i++) {
  let cur=new Curve();
  if (cur.ca.length==cur.count+1) {
    cua.push(cur);
  }
}
console.log(cua.length);

onresize();
start();

ctx.font="bold 11px sans-serif";
ctx.textAlign="center";
var report=()=>{
  ctx.lineWidth=1;
//  ctx.strokeStyle="yellow";
//  ctx.stroke(ca[0].getCirclePath());
  ctx.strokeStyle="silver";
  ctx.fillStyle="white";
let curve=cua[0];
  for (let i=0; i<curve.ca.length; i++) {
    let c=curve.ca[i];
    ctx.stroke(c.getCirclePath());
    //let rep=i+" "+ca[i].a.toFixed(1);
    ctx.fillText(i,c.x,c.y-7);
    let xp1=c.x+c.r*Math.cos(c.a1);
    let yp1=c.y+c.r*Math.sin(c.a1);
    drawPoint(xp1,yp1,"red");
    let xp2=c.x+c.r*Math.cos(c.a2);
    let yp2=c.y+c.r*Math.sin(c.a2);
    drawPoint(xp2,yp2,"yellow",4);
  }
}
var report2=()=>{
  for (let i=0; i<cua.length; i++) {
//    ctx.fillStyle="#88880088";
//    ctx.fill(cua[i].path);
    ctx.fillStyle="white";
ctx.fillText(i,cua[i].ca[0].xp2+5,cua[i].ca[0].yp2-5);
ctx.fillText(cua[i].dist.toFixed(),cua[i].ca[0].xp2+5,cua[i].ca[0].yp2+2);
console.log(i,cua[i].ca.length,cua[i].dist.toFixed(),(cua[i].dist/8).toFixed(1));
  }
}

// no G or S states
// dist defines r range
// prevent crossings via half-angle, or via xp distance (not pip)
// flashing end, shouldn't happen with lineCap!
// core/sheath
