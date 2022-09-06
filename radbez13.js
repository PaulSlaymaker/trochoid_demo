"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/NWYWgBv
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

var hues=[];
var colors=new Array(4);
var getHues=()=>{
  let h=[];
  let hueCount=4;
  let hr=Math.round(90/hueCount);
  //let hue=getRandomInt(-10,10);
  let hue=getRandomInt(0,360);
  for (let i=0; i<hueCount; i++) {
    let hd=(hue+Math.round(240/hueCount)*i+getRandomInt(-hr,hr))%360;
    h.splice(getRandomInt(0,h.length+1),0,hd);
  }
  return h;
}

var setColors=()=>{
  hues=getHues();
  colors[0]="hsl("+hues[0]+",100%,40%)";
  colors[1]="hsl("+hues[1]+",100%,50%)";
  colors[2]="hsl("+hues[2]+",100%,50%)";
  colors[3]="hsl("+hues[3]+",100%,50%)";
}

/*
var drawPoint2=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,6,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}
var drawPath=(p)=>{	// diag
  ctx.beginPath();
  ctx.strokeStyle="white";
  ctx.stroke(p);
}
var drawLine=(l,col)=>{	// diag
  ctx.beginPath();
  ctx.moveTo(l.dp1.x,l.dp1.y);
  ctx.lineTo(l.dp2.x,l.dp2.y);
  if (col) ctx.strokeStyle=col;
  else ctx.strokeStyle="yellow";
  ctx.lineWidth=1;
  ctx.stroke();
}
*/

const C=8;

var Line=function(idx,rdx) {
  this.a=idx*TP/C;
  this.rdx=rdx;
  let f=2/C;
  this.f1x=Math.cos(this.a-f);
  this.f1y=Math.sin(this.a-f);
  this.f2x=Math.cos(this.a+f);
  this.f2y=Math.sin(this.a+f);
  this.dp1=new DOMPoint();
  this.dp2=new DOMPoint();
  this.setLine=()=>{
    let r=radii[this.rdx];
    this.dp1.x=Math.round(r*this.f1x);
    this.dp1.y=Math.round(r*this.f1y);
    this.dp2.x=Math.round(r*this.f2x);
    this.dp2.y=Math.round(r*this.f2y);
  }
  this.setLine();
}

var SW=true;

var getNextTraveler=(index)=>{
  for (let i=index+1; i<index+1+ta.length; i++) {
    let ix=i%ta.length;
    if (ta[ix].arcCounter==ta[index].arcCounter) return ta[ix];
  }
  return false;
}

var setPass=()=>{
  let ridx=getRandomInt(0,ta.length);
  for (let i=0; i<ta.length; i++) {
    let tindx=(i+ridx)%ta.length;
    let ptrav=ta[tindx];
    if (ptrav.t!=0) continue;
    if (ptrav.type.length>0) continue;
    let trav2=getNextTraveler(tindx);
    if (!trav2) return;
    if (trav2.type.length>0) continue;
  //if (trav2.t==0) debugger;	// getNextTraveler prevents this
    let r0=lset[ptrav.pathIndex][ptrav.arcCounter].rdx;
    let r1=lset[trav2.pathIndex][trav2.arcCounter].rdx;
    //let r1=lset[ta[1].pathIndex][ta[1].arcCounter].rdx;
    if (Math.abs(r0-r1)>1) {
      let rr0=lset[ptrav.pathIndex][(ptrav.arcCounter+1)%C].rdx;
      let rr1=lset[trav2.pathIndex][(trav2.arcCounter+1)%C].rdx;
      if (rr0==rr1) continue;
      ptrav.type="p";
      trav2.type="h";
//console.log("inj "+r0+" "+r1);
//console.log("ac "+ptrav.arcCounter+" "+trav2.arcCounter);
//console.log("indx "+ptrav.idx+" "+trav2.idx);
    }
  }
}

var Trav=function(idx) {
  this.pathIndex=0;	//getRandomInt(0,lset.length);
  this.arcCounter=Math.trunc(idx/TPA);	// trav per arc, TCOUNT=TPA*8
  this.t=0;
  //this.tf=ls2[lset[this.pathIndex][arc].rdx+"-"+lset[this.pathIndex][(arc+1)%C].rdx];
  this.tf=speed*ls2[lset[this.pathIndex][this.arcCounter].rdx+"-"+lset[this.pathIndex][(this.arcCounter+1)%C].rdx];
  //let q=getRandomInt(0,3);
  let q=SW?Math.trunc(idx/6):getRandomInt(0,3);
  this.rad=[22,38,54][q];
  this.col=colors[q+1];
  this.type="";
  this.stepArc=()=>{
    this.arcCounter=++this.arcCounter%C;
    if (nodes[this.arcCounter][iset[this.arcCounter][this.pathIndex]].length>1) {
//console.log("switch "+nodes[this.arcCounter][iset[this.arcCounter][this.pathIndex]]);
       let ca=nodes[this.arcCounter][iset[this.arcCounter][this.pathIndex]];
       this.pathIndex=ca[getRandomInt(0,ca.length)];
    }

    let a2=(this.arcCounter+1)%C;
    this.tf=speed*ls2[lset[this.pathIndex][this.arcCounter].rdx+"-"+lset[this.pathIndex][a2].rdx];
//console.log(nodes[this.arcCounter][lset[this.pathIndex].rdx]);
//console.log(iset[this.arcCounter][this.pathIndex]);
  }
  this.step=()=>{
    this.t++;
    if (this.type=="p") {
	if (this.t==STOP/2) {
	  this.stepArc();
	  this.t=0;
	  this.type="";
	}
    } else if (this.type=="h") {
       if (this.t==STOP) {
	 this.type="h2";
	 this.t=0;
       }
    } else if (this.type=="h2") {
      if (this.t==STOP/2) {
	this.stepArc();
	this.t=0;
	this.type="";
      }
    } else {
      if (this.t==STOP) {
	this.stepArc();
	this.t=0;
      }
    }
  }
  this.getDashOffset=()=>{
    if (this.type=="h") {
      //return -this.tf*STOP/2-this.tf*(this.t-STOP/2)/2;
      return -this.tf*(STOP/4+this.t/2);
    } else if (this.type=="h2") {
      //return -this.tf*STOP-this.tf*(this.t-STOP/2)/2;
      return -this.tf*(3*STOP/4+this.t/2);
    } else if (this.type[0]=="p") {
      return -2*this.tf*this.t;
    } else {
      return -this.tf*this.t;
    }
  }
  this.draw=()=>{
    //ctx.lineDashOffset=-this.tf*this.t;
    ctx.lineDashOffset=this.getDashOffset();
    ctx.setLineDash([1,4000]);
    ctx.lineWidth=this.rad;
    ctx.strokeStyle=this.col;
//if (this.type.startsWith("p")) ctx.strokeStyle="silver";
//else if (this.type.startsWith("h")) ctx.strokeStyle="gray";
    ctx.stroke(pa[this.pathIndex][this.arcCounter]);
  }
}

var radii=[150,220,290,360];
var iset=new Array(C);
var lset=[new Array(C),new Array(C),new Array(C),new Array(C), new Array(C)];
var nodes=new Array(C);

var setRadii=()=>{
  for (let i=0; i<C; i++) {
    let is=new Array(lset.length);
    for (let i=0; i<lset.length; i++) {
      is[i]=getRandomInt(0,radii.length);
    }
    is.sort();
    iset[i]=is;
  }
}

var setLinesAndNodes=()=>{
  for (let i=0; i<C; i++) {
    nodes[i]=[];
    for (let j=0; j<lset.length; j++) {
      lset[j][i]=new Line(i,iset[i][j]);
      if (nodes[i][iset[i][j]]) {
	nodes[i][iset[i][j]].push(j);
      } else {
	nodes[i][iset[i][j]]=[j];
      }
    }
  }
}

var pa=new Array(lset.length);
var dpath;
var setPaths=()=>{
  dpath=new Path2D();
  for (let l=0; l<lset.length; l++) {
    let lp=lset[l];
    let a2=new Array(C);
    for (let i=0; i<C; i++) {
      let p=new Path2D();
      let i0=i;
      let i1=(i+1)%C;
    let x=(lp[i0].dp1.x+lp[i0].dp2.x)/2;
    let y=(lp[i0].dp1.y+lp[i0].dp2.y)/2;
//pointsPath.moveTo(x+6,y);
//pointsPath.arc(x,y,10,0,TP);
      p.moveTo(x,y);
      x=Math.round((lp[i1].dp1.x+lp[i1].dp2.x)/2);
      y=Math.round((lp[i1].dp1.y+lp[i1].dp2.y)/2);
      p.bezierCurveTo(lp[i0].dp2.x,lp[i0].dp2.y,lp[i1].dp1.x,lp[i1].dp1.y,x,y);
      dpath.addPath(p);
      a2[i]=p;
    }
    pa[l]=a2;
  }
}

//var pointsPath=new Path2D();
//ctx.fillStyle="white";

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//ctx.fill(pointsPath);
  ctx.setLineDash([]);
  ctx.lineWidth=3;
  ctx.strokeStyle=colors[0];
  ctx.stroke(dpath);
  for (let i=0; i<ta.length; i++) ta[i].draw();
}

function start() {
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
var s=0;
var rotationRate=-0.005;
function animate(ts) {
  if (stopped) return;
  if (s++>1800) {
    if (s==1840) reset();
    if (s-1800<40) {
      ctx.globalAlpha=(1840-s)/40;
    } else {
      ctx.globalAlpha=(s-1840)/40;
    }
    if (s==1880) { ctx.globalAlpha=1; s=0; }
  }
  for (let i=0; i<ta.length; i++) ta[i].step();
  if (SW) setPass();
if (EM && s%100==0) stopped=true;
  draw();
  ctx.rotate(rotationRate);
  requestAnimationFrame(animate);
}

var ls2={
  "0-0":0.113,		//
  "0-1":0.157,		//
  "1-0":0.157,		//
  "0-2":0.217,		//
  "2-0":0.217,		//
  "0-3":0.283,		//
  "3-0":0.283,		//
  "1-1":0.167,		//
  "1-2":0.206,		//
  "2-1":0.206,		//
  "1-3":0.261,		//
  "3-1":0.261,		//
  "2-2":0.220,		//
  "2-3":0.256,		//
  "3-2":0.256,		//
  "3-3":0.273,		//
};


var speed=20;		// 5,10,20,25,50
var STOP=1000/speed;		// speed 100
var setSpeed=()=>{
speed=Math.random()<0.5?10:20;
STOP=1000/speed;		// speed 100
/*
for (let key in ls2) { 
  ls2[key]=ls2[key]*speed; 	// speed 10
}
*/
}
//setSpeed();

const TPA=2;	// trav per arc
const TCOUNT=TPA*C;
var ta=new Array(TCOUNT);
var setTravelers=()=>{
  for (let i=0; i<TCOUNT; i++) {
    ta[i]=new Trav(i);
    ta[i].t=STOP/TPA*(i%TPA);	// 20 - 5 integral separation of trav, for Trav radius (linewidth),  5*20=STOP, speed 50 inverse?, TPA*50=STOP
  }
}

var reset=()=>{
  setRadii();
  setLinesAndNodes();
  setPaths();
  setColors();
setSpeed();
  SW=Math.random()<0.5;
  setTravelers();
  ctx.transform([1,-1][getRandomInt(0,2)],0,0,1,0,0);
  //rotationRate=SW?-0.005:-0.003;
  rotationRate=-0.003-0.008*Math.random();
}

onresize();

reset();
start();
