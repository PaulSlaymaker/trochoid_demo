"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=360;

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
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var colors=[];
var hues=[];
var setColors=()=>{
  colors=[];
  let colorCount=3;
  let h=getRandomInt(180,270);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(180/colorCount)*i+getRandomInt(-10,10);
    let hue=(h+hd)%360;
    hues.splice(getRandomInt(0,hues.length+1),0,hue);
  }
  for (let i=0; i<colorCount; i++) colors[i]="hsl("+hues[i]+",98%,40%)";
}

var drawPt=(pt,col,rp)=>{	// diag
  let r=rp?rp:5;
  ctx.beginPath();
  ctx.arc(pt.x,pt.y,r,0,TP);
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

const df=[
  (point)=>{ return pts[point.i+1][point.j]; },
  (point)=>{ return pts[point.i][point.j+1]; },
  (point)=>{ return pts[point.i-1][point.j]; },
  (point)=>{ return pts[point.i][point.j-1]; }
];

const iptX=[[2,3,1,0],[3,2,0,1]];

var getFalsePoint=()=>{
  let pt=pts[getRandomInt(1,CT-1,true)][getRandomInt(1,CT-1,true)];
  while (pt.d) {
    pt=pts[getRandomInt(1,CT-1,true)][getRandomInt(1,CT-1,true)];
  } 
  return pt;
}

function SPath(idx) {
  let initPoint=getFalsePoint();
  initPoint.d=true;
  initPoint.ppt=pts[0][0];
  this.pa=[initPoint];
  this.path;
  this.term;
  this.ipt=iptX[0];
  this.grow=()=>{
    for (let ci=this.pa.length-1; ci>=0; ci--) {
      let pt=this.pa[ci];
if (pt==undefined) debugger;
      if (pt==this.growPoint) continue;
      for (let ic=0; ic<4; ic++) {
        let dfunc=df[this.ipt[ic]];
	let cpt=dfunc(pt);
if (cpt==undefined) debugger;
	if (cpt.d) continue;
    if (cpt==this.shrinkPoint) continue;
if (cpt==this.growPoint) debugger;
	cpt.d=true;
	pt.cpa.push(cpt);
	cpt.ppt=pt;
	this.pa.push(cpt);
	if (this.growPoint) this.growPoint2=cpt;
	else this.growPoint=cpt;
	return true;
      }
    }
    return false;
  }
  this.setShrink=()=>{
    this.shrinkPoint=false;
    if (this.pa.length<3) return;
    let pt=this.pa[0];
    if (pt.cpa.length<2) {
      this.shrinkPoint=pt;
      return;
    }
    for (let i=1; i<this.pa.length-1; i++) {
      // always shrink from oldest end, if possible
      let pt=this.pa[i];
      if (pt==this.growPoint) continue;
if (pt==this.growPoint2) debugger;
      if (pt.cpa.length==0) {
        this.shrinkPoint=pt;
        return;
      }
    }
this.shrinkPoint=false;
  }
  this.shrink2=()=>{
    if (!this.shrinkPoint) return;
    let pt=this.shrinkPoint;
if (pt.ppt.cpa==undefined) debugger;
    if (this.pa[0]==pt) {
      if (!pt.ppt.d) pt.ppt=false;
    } else {
      //if (pt.ppt.cpa.length && this.pa[0]!=pt) {
      if (pt.ppt.cpa.length) {
      let idx=pt.ppt.cpa.indexOf(pt);
if (idx==-1) debugger;
        pt.ppt.cpa.splice(idx,1);
      } 
    }
    pt.cpa=[];
//pt.ppt=false;
    let idx2=this.pa.indexOf(pt);
if (idx2==-1) debugger;
    this.pa.splice(idx2,1);
    pt.d=false;
  }
  this.setPath=()=>{
    this.path=new Path2D(); 
    if (this.pa.length==1) {
      this.path.moveTo(this.pa[0].x,this.pa[0].y);
      this.path.lineTo(this.pa[0].x,this.pa[0].y);
      return;
    }
    for (let i=1; i<this.pa.length; i++) {
      let pt=this.pa[i];
      if (pt.ppt==this.shrinkPoint) {
	let pt2=this.pa[0];
	this.path.moveTo((1-frac)*pt.ppt.x+frac*pt2.cpa[0].x,(1-frac)*pt.ppt.y+frac*pt2.cpa[0].y);
	this.path.lineTo(pt2.cpa[0].x,pt2.cpa[0].y);
      } else {
	if (pt==this.shrinkPoint) {
	  this.path.moveTo((1-frac)*pt.x+frac*pt.ppt.x,(1-frac)*pt.y+frac*pt.ppt.y);
	} else if (pt==this.growPoint || pt==this.growPoint2) {
	  this.path.moveTo((1-frac)*pt.ppt.x+frac*pt.x,(1-frac)*pt.ppt.y+frac*pt.y);
	} else this.path.moveTo(pt.x,pt.y);
	this.path.lineTo(pt.ppt.x,pt.ppt.y);
      }
    }
  }
  this.morph=()=>{ this.ipt=iptX[getRandomInt(0,2)]; }
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
var n=0;
var frac=0;
var dur=16;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t==dur) {
    for (let i=0; i<hues.length; i++) {
      hues[i]=++hues[i]%360;
      colors[i]="hsl("+hues[i]+",98%,40%)";
    }
    for (let i=0; i<sp.length; i++) {
      sp[i].shrink2();
      sp[i].growPoint=false;
      sp[i].growPoint2=false;
      if (sp[i].pa.length<GC) {
	if (sp[i].grow()) {
	  if (sp[i].pa.length<GC) sp[i].grow();
	} 
      }
      sp[i].setShrink();
    }
    if (++n>32) {
      GC=[8,9,7,10,6,11,5,12,4,13,3,14,15][getRandomInt(0,12,true)];
      for (let i=0; i<sp.length; i++) sp[i].morph();
      n=0;
if (EM) stopped=true;
    }
    t=0;
  }
  frac=t/dur;
  draw();
  requestAnimationFrame(animate);
}

onresize();

ctx.font="bold 11px sans-serif";	// diag
ctx.textAlign="center";
var showIndexes=(pth)=>{	
  for (let i=0; i<pth.pa.length; i++) {
    let pt=pth.pa[i];
    drawPt(pt,"white",12);
    ctx.fillStyle="black";
    ctx.fillText(i,pt.x,pt.y+3);
  }
}

const CT=14;
var GC=10;//getRandomInt(7,11);

var showChilds=()=>{	// diag
  for (let i=0; i<CT; i++) {
    for (let j=0; j<CT; j++) {
      if (pts[i][j].cpa.length) drawPt(pts[i][j],"green",16);
    }
  }
}
var showParents=()=>{	// diag
  for (let i=0; i<CT; i++) {
    for (let j=0; j<CT; j++) {
      if (pts[i][j].ppt) drawPt(pts[i][j],"yellow");
    }
  }
}
var showShrink=(pth)=>{	// diag
  drawPt(pth.shrinkPoint,"#FF000080",8);
}
var showGrow=(pth)=>{	// diag
  drawPt(pth.growPoint,"#00FF0080",8);
  drawPt(pth.growPoint2,"#00FF0080",8);
}

const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<sp.length; i++) {
    sp[i].setPath();
    let p=new Path2D(sp[i].path);
    p.addPath(p,dm1);
    p.addPath(p,dm2);
    ctx.globalAlpha=1;
    ctx.lineWidth=Math.round(270/CT);
    ctx.strokeStyle=colors[i%colors.length];
    ctx.stroke(p);
    ctx.globalAlpha=0.4;
    ctx.lineWidth=Math.round(90/CT);
    ctx.strokeStyle="white";
    ctx.stroke(p);
  }
/*
ctx.globalAlpha=1;
showChilds(sp[0]);
showIndexes(sp[0]);
showShrink(sp[0]);
showGrow(sp[0]);
*/
}

const pts=new Array();

const inc=CSIZE/(CT-2);

for (let i=0; i<CT; i++) {
  pts.push(new Array());
  for (let j=0; j<CT; j++) {
    pts[i].push(new Array());
    pts[i][j]={"x":-inc+i*inc,"y":-inc+j*inc,"i":i,"j":j,"cpa":[]};
    if (i==0 || i==CT-1 || j==0 || j==CT-1) pts[i][j].d=true;
  }
}

var sp=new Array(9);

/*
var reset=()=>{
  for (let i=0; i<CT; i++) {
    for (let j=0; j<CT; j++) {
      pts[i][j].cpa=[];
      pts[i][j].ppt=false;
      //if (i==CT-1 || j==CT-1) pts[i][j].d=true;
      if (i==0 || i==CT-1 || j==0 || j==CT-1) pts[i][j].d=true;
      else pts[i][j].d=false;
    }
  }
  DK=0;//getRandomInt(0,6);
  for (let i=0; i<sp.length; i++) {
    sp[i]=new SPath(i);
//    if (Math.random()<0.5) sp[i].ipt.reverse();
    //if (!sp[i].grow()) break;
    if (sp[i].grow()) sp[i].grow();
  }
  setColors();
}
reset();
*/

for (let i=0; i<sp.length; i++) {
  sp[i]=new SPath(i);
  if (sp[i].grow()) sp[i].grow();
}
setColors();

start();
