"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/XWqExRB
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
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
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var colors=[];
var setColors=()=>{
  colors=[];
  let colorCount=4;
  let hue=getRandomInt(180,270);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(180/colorCount)*i+getRandomInt(-10,10);
    let h=(hue+hd)%360;
    colors.splice(getRandomInt(0,colors.length+1),0,"hsl("+h+",98%,50%)");
  }
}

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,5,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

//var COUNT=2*getRandomInt(24,32);
var COUNT=getRandomInt(48,64);
var edge=CSIZE-24;	// f(lw)
var R=CSIZE/COUNT;
ctx.lineWidth=Math.round(2*R-4);

function RPath(initPoint, idx, iidx) {
  initPoint.d=true;	// TODO, check if already true
  this.pa=[initPoint];
  this.la=new Array();
  this.ka=new Array();
  //this.rt=getRandomInt(40,400);
  this.rt=getRandomInt(200,2000);
  for (let ij of [[1,0],[0,1],[-1,0],[0,-1]]) this.ka.splice(getRandomInt(0,this.ka.length+1),0,ij);
  this.grow=()=>{
//this.ka.unshift(this.ka.pop());
    //let rnd=Math.round(this.pa.length/2);
//    for (let c=this.pa.length-1; c>=0; c--) {
    //for (let c=0; c<this.pa.length; c++) {
      let idx=this.pa.length-1;
      //let idx=(rnd+c)%pa.length;
      for (let ij of this.ka) {
	if (this.pa[idx].i+ij[0]<0) continue;
	if (this.pa[idx].i+ij[0]>COUNT-1) continue;
	if (this.pa[idx].j+ij[1]<0) continue;
	if (this.pa[idx].j+ij[1]>COUNT-1) continue;
	let pt=pts[this.pa[idx].i+ij[0]][this.pa[idx].j+ij[1]];
	if (pt.d) continue;
	pt.d=true;
	this.pa.push(pt);
	let p=new Path2D();
	p.moveTo(this.pa[idx].x,this.pa[idx].y);
	p.lineTo(pt.x,pt.y);
	this.la.push(p);
	return true; 
      }
//    }
    return false;
  }
  this.shrink=()=>{
    if (this.pa.length<3) return;
    this.pa[0].d=false;
    this.pa.shift();
    this.la.shift();
    return;
  }

/*
  this.getEndPath=()=>{
    //if (this.gr==0) return this.la[1];
    let p=new Path2D();
    p.moveTo((1-frac)*this.pa[0].x+frac*this.pa[1].x,(1-frac)*this.pa[0].y+frac*this.pa[1].y);
    p.lineTo(this.pa[1].x,this.pa[1].y);
    return p;
  }
  this.getFrontPath=()=>{
    if (this.gr==0) return this.la[this.la.length-1];
    if (this.gr==1) {
    let p=new Path2D();
    let p1=this.pa[this.pa.length-2];
    let p2=this.pa[this.pa.length-1];
    p.moveTo(p1.x,p1.y);
    p.lineTo((1-frac)*p1.x+frac*p2.x,(1-frac)*p1.y+frac*p2.y);
    return p;
    }
    if (this.gr==2) {
    let p=new Path2D();
    let p1=this.pa[this.pa.length-3];
    let p2=this.pa[this.pa.length-1];
    p.moveTo(p1.x,p1.y);
    p.lineTo((1-frac)*p1.x+frac*p2.x,(1-frac)*p1.y+frac*p2.y);
    return p;
    }
  }
*/

}

var pts=[];
var setPoints=()=>{
  for (let i=0; i<COUNT; i++) {
    pts[i]=[];
    for (let j=0; j<COUNT; j++) {
      pts[i][j]={"x":-edge+i*2*R,"y":-edge+j*2*R,"i":i,"j":j};
//if (Math.abs(i-16)+Math.abs(j-16)>20) pts[i][j].d=true;
if (Math.pow(pts[i][j].x*pts[i][j].x+pts[i][j].y*pts[i][j].y,0.5)>edge) pts[i][j].d=true;
    }
  }
}

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
var t=1;
var frac=0;
function animate(ts) {
  if (stopped) return;
  t++;
  for (let i=0; i<rpa.length; i++) { if (t%rpa[i].rt==0) rpa[i].ka.unshift(rpa[i].ka.pop()); }
  if (t%3==0) {
    for (let i=0; i<rpa.length; i++) {
      rpa[i].grow();
      if (rpa[i].pa.length<len) rpa[i].grow();
      if (rpa[i].pa.length<len) rpa[i].grow();
      rpa[i].shrink();
    }
  draw();
  }
  requestAnimationFrame(animate);
}

onresize();

setPoints();

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);	// TODO, remove, black on shrink
  let pa=[new Path2D(),new Path2D(),new Path2D(),new Path2D()];
  for (let i=0; i<rpa.length; i++) {
    for (let j=0; j<rpa[i].la.length; j++) {
      //p2.addPath(rpa[i].la[j]);
      pa[i%4].addPath(rpa[i].la[j]);
    }
//    ctx.strokeStyle=colors[i%colors.length];
//    ctx.stroke(p2);
/*
    if (rpa[i].gr==0) {
      for (let j=1; j<rpa[i].la.length-1; j++) {
        p2.addPath(rpa[i].la[j]);
      }
    } else if (rpa[i].gr==1) {
      p2.addPath(rpa[i].getEndPath());
      for (let j=1; j<rpa[i].la.length-1; j++) {
        p2.addPath(rpa[i].la[j]);
      }
      p2.addPath(rpa[i].getFrontPath());
    } else if (rpa[i].gr==2) {
      p2.addPath(rpa[i].getEndPath());
      for (let j=1; j<rpa[i].la.length-2; j++) {
        p2.addPath(rpa[i].la[j]);
      }
      p2.addPath(rpa[i].getFrontPath());
    } else debugger;
*/
  }
  for (let i=0; i<4; i++) {
    ctx.strokeStyle=colors[i%colors.length];
    ctx.stroke(pa[i]);
  }
  ctx.beginPath();
  ctx.arc(0,0,edge+12,0,TP);
ctx.strokeStyle="gray";
  ctx.stroke();
}

var rpa=new Array();

for (let i=0; i<20; i++) {
  let p=pts[getRandomInt(0,COUNT)][getRandomInt(0,COUNT)];
  while (p.d) {
    p=pts[getRandomInt(0,COUNT)][getRandomInt(0,COUNT)];
  }
  p.d=true;
  rpa.push(new RPath(p,i));
}

var len=Math.round(COUNT*COUNT/(rpa.length/4));
for (let i=0; i<len; i++) { 
  for (let j=0; j<rpa.length; j++) {
    rpa[j].grow();
//    rpa[j].gr=0;
  }
}

setColors();

start();
