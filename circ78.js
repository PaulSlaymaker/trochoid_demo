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

function Color() {
  const CBASE=112;
  const CT=255-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.random());
    let grn=Math.round(CBASE+CT*Math.random());
    let blu=Math.round(CBASE+CT*Math.random());
    return "rgb("+red+","+grn+","+blu+")";
  }
}
var color=new Color();

var MAXR=20;
var s=1;

const K=24;

function Circle(curve,f) {
  if (curve.ca.length==0) {
    this.r=8+MAXR*Math.random();
    this.dir=Math.random()<0.5?1:-1;
    this.a1=Math.PI*Math.random();
    this.gc=0;
    this.x=300-600*Math.random();
    this.y=300-600*Math.random();
  } else {
    this.r=curve.dist/Math.PI+MAXR*Math.random()/f;
    this.gc=curve.ca[curve.ca.length-1];
    this.dir=-this.gc.dir;
    this.x=this.gc.x+(this.gc.r+this.r)*Math.cos(this.gc.a2);
    this.y=this.gc.y+(this.gc.r+this.r)*Math.sin(this.gc.a2);
    this.a1=(this.gc.a2+TP/2)%TP; 
  }
  this.a2=this.a1+this.dir*curve.dist/this.r;
  this.xp2=this.x+this.r*Math.cos(this.a2);
  this.yp2=this.y+this.r*Math.sin(this.a2);
  this.time=curve.t;
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
//cur.path2.arc(xp,yp,7,0,TP);
//drawPoint(this.xp2,this.yp2,"blue",5);
    cur.path.moveTo(xp,yp);
    if (cur.t-this.time>s*curve.dist) {
      return true;
    }
    cur.path.arc(this.x,this.y,this.r,this.a1+d,this.a2,this.dir==-1);
    return false;
  }
/*
  this.getCirclePath=()=>{
    let p=new Path2D();
    p.arc(this.x,this.y,this.r,0,TP);
    return p;
  }
*/
  this.reverse=()=>{
    this.dir*=-1;
    let at=this.a1;
    this.a1=this.a2;
    this.a2=at;
    this.time=0;
  }
  this.checkBounds=()=>{	// make global
    if (Math.pow(this.xp2*this.xp2+this.yp2*this.yp2,0.5)>CSIZE-8) return false;
    for (let i=0; i<cua.length; i++) {
      if (cua[i]==curve) continue;
      for (let j=0; j<cua[i].ca.length; j++) {
        let xd=this.xp2-cua[i].ca[j].xp2;
        let yd=this.yp2-cua[i].ca[j].yp2;
        let dc=Math.pow(xd*xd+yd*yd,0.5);
        if (dc<K) return false;
      }
    }
    return true;
  }
}

function Curve() {
  this.count=[5,7,3,9,11][getRandomInt(0,6,true)];
  //this.dist=8+40*Math.random();
  this.dist=8+20*Math.random();
  this.t=0;
  this.path=new Path2D();
  this.state="N";
  this.ca=[];
  this.ca.push(new Circle(this,1));
  this.setPath=()=>{
    this.path=new Path2D();
    this.ca[0].setPathE(this);
    for (let i=1; i<this.ca.length-1; i++) {
      this.ca[i].setPath(this.path);
    }
    if (this.state=="N") {
      let fc=this.ca[this.ca.length-1];
      fc.setPathT(this);
      if (this.t-fc.time>=s*this.dist) {
	let cir=new Circle(this,1);
	if (cir.checkBounds()) {
	  this.ca.push(cir);
	  this.ca.shift();
	  this.ca[0].time=this.t;
	} else {
	  let cir2=new Circle(this,3);
	  if (cir2.checkBounds()) {
	    this.ca.push(cir2);
	    this.ca.shift();
	    this.ca[0].time=this.t;
	  } else {
	    let cir3=new Circle(this,10);
	    if (cir3.checkBounds()) {
	      this.ca.push(cir3);
	      this.ca.shift();
	      this.ca[0].time=this.t;
	    } else this.state="R";
          }
	}
      }
    }
  }
  this.reverse=()=>{
    for (let i=0; i<this.ca.length; i++) this.ca[i].reverse();
    this.ca.reverse();
    this.state="N";
    this.t=0;
  }
  for (let i=0; i<this.count; i++) {
    let c=new Circle(this,1.5);
    if (c.checkBounds()) this.ca.push(c);
    else break;
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
  MAXR=10+32*(1+Math.cos(t/400));
  cua.forEach((c)=>{ 
    c.t++; 
    c.setPath(); 
    if (c.state=="R") c.reverse();
  });
  draw();
if (EM && t%100==0) stopped=true;
  requestAnimationFrame(animate);
}

let ccont=new Path2D();
ccont.arc(0,0,CSIZE,0,TP);

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<cua.length; i++) {
    let p=new Path2D(cua[i].path);
    ctx.lineWidth=9;
    ctx.strokeStyle=col1[i];
    ctx.stroke(p);
	
    ctx.setLineDash([(cua[i].count+1)*(cua[i].dist)]);
    ctx.strokeStyle="black";
    ctx.lineWidth=5;
    ctx.stroke(p);

    ctx.setLineDash([cua[i].dist]);
    ctx.strokeStyle=col2[i];
    ctx.lineWidth=2;
    ctx.stroke(p);
    ctx.setLineDash([]);
  }
  ctx.lineWidth=2;
  ctx.strokeStyle="white";
  ctx.stroke(ccont);
}

var cua=[];
for (let i=0; i<200; i++) {
  let cur=new Curve();
  if (cur.ca.length==cur.count+1) {
    cua.push(cur);
  }
}
//console.log(cua.length);
var col1=new Array(cua.length);
var col2=new Array(cua.length);
for (let i=0; i<cua.length; i++) {
  col1[i]=color.getRGB();
  col2[i]=color.getRGB();
}

onresize();
start();

/*
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
*/

