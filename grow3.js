"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/ZEojYgW
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
c.style.outline="1px dotted gray";
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
  let colorCount=3;
  let hue=getRandomInt(180,270);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(180/colorCount)*i+getRandomInt(-10,10);
    let h=(hue+hd)%360;
    colors.splice(getRandomInt(0,colors.length+1),0,"hsl("+h+",98%,40%)");
  }
}

var drawPoint=(x,y,col,rp)=>{	// diag
  let r=rp?rp:5;
  ctx.beginPath();
  ctx.arc(x,y,r,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var drawPt=(pt,col,rp)=>{	// diag
  let r=rp?rp:5;
  ctx.beginPath();
  ctx.arc(pt.x,pt.y,r,0,TP);
//  ctx.closePath();
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

/*
const ipt=[
  [0,1,3],
  [1,2,0],
  [2,3,1],
  [3,0,2],
]
*/

const iptX=[	// add reverse, make itpX[DK] a SPath member?
  [0,1,2,3],
  [0,1,3,2],
  [0,2,1,3],
  [0,2,3,1],
  [0,3,1,2],
  [0,3,2,1],
];

var CK=getRandomInt(1,12);
var DK=getRandomInt(0,6);
var TR=24;

function SPath(idx) {
  let initPoint=pts[getRandomInt(1,CT-1)][getRandomInt(1,CT-1)];
  initPoint.d=true;	// TODO, check if already true
  initPoint.ppt=pts[0][0];
  this.pa=[initPoint];
  //this.shrinkPoint=initPoint;
  this.l=0;
  this.path;
  this.term;

  this.grow=(sec)=>{
if (!sec) {
  this.growPoint=false;
  this.growPoint2=false;
}
// vary c max, c dir?, ic max?, ic rnd?, trend to front/back/early/late or loc?, rnd df
    //let cz=getRandomInt(0,this.pa.length,true);
    //let cz=getRandomInt(0,Math.min(CK,this.pa.length),true);	// not var
    let cz=getRandomInt(0,Math.min(CK,this.pa.length-1));	// not var
//    let cz=this.pa.length<2?0:1;
    //let cz=Math.max(0,this.pa.length+1);	// not var
    //let cz=Math.round(Math.min(CK,this.pa.length)/2+1);	// not var
    for (let c=0; c<this.pa.length-cz; c++) {
      let ci=(this.pa.length-c-cz-1)%this.pa.length;    
      //let ci=(this.pa.length-c-1);
      let pt=this.pa[ci];
      if (pt==undefined) debugger;
if (sec && pt==this.growPoint) continue;
      
	let rz=getRandomInt(0,4,true);
      for (let ic=0; ic<4; ic++) {
	//let i=(ic+rz)%4;
	//let dfunc=df[i];
    let dfunc=df[iptX[DK][ic]];
	let cpt=dfunc(pt);
    if (cpt==undefined) debugger;
	if (cpt.d) continue;
	//if (cpt==this.shrinkPoint) debugger;
    if (cpt==this.shrinkPoint) continue;
if (sec && this.cpt==this.growPoint) debugger; //continue;
    //    else {
	  cpt.d=true;
	  pt.cpa.push(cpt);
	  cpt.ppt=pt;
	  this.pa.push(cpt);
if (sec) this.growPoint2=cpt;
else
          this.growPoint=cpt;
	  return true;
    //    }
      }
    }
    return false;
  }

  this.setShrink=()=>{
    if (this.pa.length<3) {
console.log("no shrink<3");
      return;
    }
    let pt=this.pa[0];
      if (pt.cpa.length<2) {
this.shrinkPoint=pt;
//console.log("set 0")
return;
}
    for (let i=1; i<this.pa.length-1; i++) {	// -4 not needed?
      // always shrink from oldest end, if possible
      let pt=this.pa[i];
if (pt==this.growPoint) continue;
if (pt==this.growPoint2) debugger;
//console.log(pt.cpa);
      if (pt.cpa.length==0) {
this.shrinkPoint=pt;

/*
let idx=pt.ppt.cpa.indexOf(pt);
if (idx==-1) debugger;
pt.ppt.cpa.splice(idx,1);
*/

//console.log("set "+i)
return;
//break;
      }
    }
this.shrinkPoint=false;
console.log("no shrink");
  }
  this.shrink2=()=>{
if (!this.shrinkPoint) return;
    let pt=this.shrinkPoint;
if (pt.ppt.cpa==undefined) debugger;
//if (pt.ppt.x==226) debugger;
/*
console.log("redp "+pt.toString());
console.log("red0 "+pt.ppt.cpa);
console.log("red1 "+pt.ppt);
*/

//debugger;
//    if (pt.ppt.cpa.length==1) { pt.ppt.cpa=[];
//} else {
    //if (pt.ppt.cpa.length) {

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
//console.log("redx "+idx2)
    this.pa.splice(idx2,1);
    pt.d=false;
  }
  this.setPath=()=>{
    this.path=new Path2D(); 
    //this.term=new Path2D(); 
if (this.pa.length==1) {
debugger;
/*
  p.moveTo(this.pa[0].x,this.pa[0].y);
  p.lineTo(this.pa[0].x,this.pa[0].y);
  return p;
*/
}

    for (let i=1; i<this.pa.length; i++) {
      let pt=this.pa[i];
      if (pt.ppt==this.shrinkPoint) {
	let pt2=this.pa[0];
	this.path.moveTo((1-frac)*pt.ppt.x+frac*pt2.cpa[0].x,(1-frac)*pt.ppt.y+frac*pt2.cpa[0].y);
	this.path.lineTo(pt2.cpa[0].x,pt2.cpa[0].y);
//let mx=(1-frac)*pt.ppt.x+frac*pt2.cpa[0].x;
//let my=(1-frac)*pt.ppt.y+frac*pt2.cpa[0].y;
//this.term.moveTo(mx+TR,my);
//this.term.arc(mx,my,TR,0,TP);
      } else {
	if (pt==this.shrinkPoint) {
	  this.path.moveTo((1-frac)*pt.x+frac*pt.ppt.x,(1-frac)*pt.y+frac*pt.ppt.y);
//let mx=(1-frac)*pt.x+frac*pt.ppt.x;
//let my=(1-frac)*pt.y+frac*pt.ppt.y;
//this.term.moveTo(mx+TR,my);
//this.term.arc(mx,my,TR,0,TP);
	} else if (pt==this.growPoint) {
	  this.path.moveTo((1-frac)*pt.ppt.x+frac*pt.x,(1-frac)*pt.ppt.y+frac*pt.y);
//let mx=(1-frac)*pt.ppt.x+frac*pt.x;
//let my=(1-frac)*pt.ppt.y+frac*pt.y;
//this.term.moveTo(mx+TR,my);
//this.term.arc(mx,my,TR,0,TP);
	} else if (pt==this.growPoint2) {
	  this.path.moveTo((1-frac)*pt.ppt.x+frac*pt.x,(1-frac)*pt.ppt.y+frac*pt.y);
	} else {
	  this.path.moveTo(pt.x,pt.y);
//if (pt.cpa.length==0) {
//  this.term.moveTo(pt.x+TR,pt.y);
//  this.term.arc(pt.x,pt.y,TR,0,TP);
//}
	}
	this.path.lineTo(pt.ppt.x,pt.ppt.y);
      }
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
var n=0;
var frac=0;
var dur=10;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t==dur) {
  for (let i=0; i<sp.length; i++) {
    sp[i].shrink2();
  }

    if (spath.pa.length<GC) {
	if (spath.grow()) {
	  if (spath.pa.length<GC) {
    //        console.log("2nd gp");
    //        stopped=true;
	    spath.grow(true);
	  }
	} else console.log("no grow");
    }
    spath.setShrink();
    if (++n>100) {
      reset();
      n=0;
    }

    t=0;
//checkFalse();
//stopped=true;
  }
  frac=t/dur;
draw();
  requestAnimationFrame(animate);
}

onresize();

ctx.font="bold 11px sans-serif";
ctx.textAlign="center";
var showIndexes=()=>{	
  for (let i=0; i<spath.pa.length; i++) {
    let pt=spath.pa[i];
    drawPt(pt,"white",12);
    ctx.fillStyle="black";
    ctx.fillText(i,pt.x,pt.y+3);
  }
}

const CT=11;
//const GC=getRandomInt(CT,4*CT);
var GC=getRandomInt(CT,(CT-2)*(CT-2));

var showFalse=()=>{
  for (let i=0; i<CT; i++) {
    for (let j=0; j<CT; j++) {
      if (pts[i][j].d) continue;
      drawPoint(pts[i][j].x,pts[i][j].y)
    }
  }
}

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
      if (pts[i][j].ppt) drawPoint(pts[i][j].x,pts[i][j].y,"yellow");
    }
  }
}

var checkFalse=()=>{	// diag
  for (let i=0; i<spath.pa.length; i++) {
    if (spath.pa[i].d==false) {
console.log(i);
stopped=true;
break;
    }
  }
}

var drawTerminals=()=>{	// diag
  let pt=spath.pa[0];
  //if (pt.cpa.length<2) drawPoint(pt.x,pt.y,colors[1],TR);
  if (pt==spath.shrinkPoint) drawPoint(pt.x,pt.y,colors[1],TR);
  for (let i=1; i<spath.pa.length; i++) {
    let pt=spath.pa[i];
    //if (pt.cpa.length==0 || !pt.ppt) {
    if (pt.cpa.length==0) {
      drawPt(pt,colors[1],TR);
    } 
  }
}

var showShrink=()=>{	// diag
  drawPt(spath.shrinkPoint,"#FF000080",8);
  //drawPt(spath.shrinkPoint,"#000000",8);
  //drawPt(spath.shrinkPoint,"#FF0000",8);
}

var showGrow=()=>{	// diag
  drawPt(spath.growPoint,"#00FF0080",8);
  drawPt(spath.growPoint2,"#00FF0080",8);
  //drawPt(spath.shrinkPoint,"#000000",8);
  //drawPt(spath.shrinkPoint,"#FF0000",8);
}

var showZero=(pth)=>{
  drawPt(pth.pa[0]);
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  //ctx.fillStyle="#00000004";
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
/*
  let pa=[new Path2D(),new Path2D(),new Path2D(),new Path2D()];
  for (let i=0; i<rpa.length; i++) {
    pa[rpa[i].kidx%4].addPath(rpa[i].getPath());
  }
  for (let i=0; i<4; i++) {
    ctx.strokeStyle=colors[i%colors.length];
    ctx.stroke(pa[i]);
  }
*/
  //ctx.strokeStyle="#88888888";
  //let p=spath.getPath();
  for (let i=0; i<sp.length; i++) {
    sp[i].setPath();
  }
ctx.globalAlpha=1;
ctx.lineWidth=Math.round(360/CT);
  ctx.strokeStyle=colors[0];
  ctx.stroke(spath.path);
ctx.globalAlpha=0.4;
ctx.lineWidth=Math.round(120/CT);
  ctx.strokeStyle="white";//colors[1];
  ctx.stroke(spath.path);
//ctx.strokeStyle="white";
//ctx.stroke(spath.pathx);

//drawTerminals();
/*
  ctx.globalAlpha=1;
  ctx.fillStyle=colors[1];
  ctx.fill(spath.term);
*/
/*
ctx.globalAlpha=1;
showChilds();
showIndexes();
showShrink();
showGrow();
*/
//showZero(spath);
}

ctx.lineWidth=Math.round(300/CT);

//draw();

const pts=new Array();

const inc=2*CSIZE/(CT-1);

for (let i=0; i<CT; i++) {
  pts.push(new Array());
  for (let j=0; j<CT; j++) {
    pts[i].push(new Array());
    pts[i][j]={"x":-CSIZE+i*inc,"y":-CSIZE+j*inc,"i":i,"j":j,"cpa":[]};//,"ppt":{"cpa":[]}};
    if (i==0 || i==CT-1 || j==0 || j==CT-1) pts[i][j].d=true;
//if (pts[i][j].d) drawPoint(pts[i][j].x, pts[i][j].y);
  }
}

var spath;
var sp=new Array(1);

var reset=()=>{
  for (let i=0; i<CT; i++) {
    for (let j=0; j<CT; j++) {
      pts[i][j].cpa=[];
      pts[i][j].ppt=false;
      if (i==0 || i==CT-1 || j==0 || j==CT-1) pts[i][j].d=true;
      else pts[i][j].d=false;
    }
  }
  CK=getRandomInt(0,12);
  DK=getRandomInt(0,6);
  GC=getRandomInt(CT,(CT-2)*(CT-2));
  console.log("CK "+CK+" DK "+DK+" GC "+GC);
//  let m=pts[getRandomInt(1,CT-1)][getRandomInt(1,CT-1)];
  sp[0]=new SPath();
spath=sp[0];
//for (let i=0; i<GC; i++) {
  for (let i=0; i<sp.length; i++) {
    if (!sp[i].grow()) break;
//    if (!sp[i].grow()) break;
  }
  //spath.setShrink();
  setColors();
}

reset();

draw();
//start();
