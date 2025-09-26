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
//c.style.outline="1px dotted gray";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

ctx.lineWidth=6;
//ctx.lineCap="round";

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
  this.getRGB=(o)=>{
    //let red=Math.round(CBASE+CT*Math.random());
    //let grn=Math.round(CBASE+CT*Math.random());
    //let blu=Math.round(CBASE+CT*Math.random());
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+o/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+o/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+o/this.BK1));
    //let red=Math.round(CBASE+CT*Math.cos(o*this.RK2));
    //let grn=Math.round(CBASE+CT*Math.cos(o*this.GK2));
    //let blu=Math.round(CBASE+CT*Math.cos(o*this.BK2));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=3+3*Math.random();
    this.GK1=3+3*Math.random();
    this.BK1=3+3*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
//  this.randomize();
}

var color=new Color();

function Point(x,y) {
  this.x=x;
  this.y=y;
  this.o=false;
  this.l=0;
}

function Curve(init) {
  if (init==0) this.inda=[[0,0]];
  else this.inda=[];
  this.getPath=()=>{
    let p=new Path2D(); 
    let point=pa[this.inda[0][0]][this.inda[0][1]];
    let point2=pa[this.inda[1][0]][this.inda[1][1]];
    if (point.x==0 && point.y==0) {
      p.moveTo(0,0);
      p.lineTo(point2.x/2,point2.y/2);
    } else {
      p.moveTo((point.x+point2.x)/2,(point.y+point2.y)/2);
    }
    for (let i=1; i<this.inda.length-1; i++) {
      let point=pa[this.inda[i][0]][this.inda[i][1]];
      let point2=pa[this.inda[i+1][0]][this.inda[i+1][1]];
      let pex=(point.x+point2.x)/2;
      let pey=(point.y+point2.y)/2;
      //p.bezierCurveTo(point.x,point.y,point.x,point.y,pex,pey);
      p.quadraticCurveTo(point.x,point.y,pex,pey);
// if (i==this.inda.length-1 && terminal) p.arc,  don't branch from terminal
    }
    return p;
  }
  this.getSegment=(index)=>{
    let p=new Path2D(); 
    if (index==this.inda.length-2) {
      let point=pa[this.inda[index][0]][this.inda[index][1]];
      let point2=pa[this.inda[index+1][0]][this.inda[index+1][1]];
//      let point3=pa[this.inda[index+2][0]][this.inda[index+2][1]];
      p.moveTo((point.x+point2.x)/2,(point.y+point2.y)/2);
      p.lineTo(point2.x,point2.y);
      p.arc(point2.x,point2.y,del/8,0,TP);
      return {"path":p,"lvl":point.l};
    }
    if (index>this.inda.length-3) debugger; //return false; // temp
    let point=pa[this.inda[index][0]][this.inda[index][1]];
    let point2=pa[this.inda[index+1][0]][this.inda[index+1][1]];
    if (point.x==0 && point.y==0) {
      p.moveTo(0,0);
      p.lineTo(point2.x/2,point2.y/2);
    } else {
      p.moveTo((point.x+point2.x)/2,(point.y+point2.y)/2);
    }
    let point3=pa[this.inda[index+2][0]][this.inda[index+2][1]];
    let pex=(point2.x+point3.x)/2;
    let pey=(point2.y+point3.y)/2;
    p.quadraticCurveTo(point2.x,point2.y,pex,pey);
    return {"path":p,"lvl":point.l};
  }
/*
  this.getPathS=()=>{
    let p=new Path2D(); 
    let point=pa[this.inda[0][0]][this.inda[0][1]];
    p.moveTo(point.x,point.y);
    for (let i=1; i<this.inda.length; i++) {
      let point=pa[this.inda[i][0]][this.inda[i][1]];
      //p.lineTo(pa[this.inda[i][0]][this.inda[i][1]].x,pa[this.inda[i][0]][this.inda[i][1]].y);
      p.lineTo(point.x,point.y);
    }
    return p;
  }
*/
  this.grow=()=>{
    for (let i=0; i<MC; i++) {
      let eix=this.inda[this.inda.length-1][0];
      let eiy=this.inda[this.inda.length-1][1];
      let ma=getMoveArray(eix,eiy);
      if (ma.length==0) break;
      let move=ma[getRandomInt(0,ma.length)];
      this.inda.push(move);
      pa[move[0]][move[1]].o=true;
      pa[move[0]][move[1]].l=pa[eix][eiy].l+1;
    }
  }
}

var pauseTS=1000;
var pause=(ts)=>{
  //if (EM) stopped=true;
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
var time=0;
var state=1;
var animate=(ts)=>{
  if (stopped) return;
  t++;
/*
  if (t%100==0) {
    if (state==-1) time=path.length-Math.floor(t/100);
    else time=Math.floor(t/100);
  }
*/
  if (state==-1) time=path.length-t;
  else time=t;
  if (time>path.length || time<0) {
    state*=-1;
    time=0;
    t=0;
    if (state==-1) {
      time=path.length;
      pauseTS=performance.now()+2000;
      requestAnimationFrame(pause);
      return;
    } else {
      time=0
      reset();
    }
  } else {
    draw();
  }
  requestAnimationFrame(animate);
}

//start();

/*
var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}
*/

const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<time; i++) {
    let pth=new Path2D(path[i]);
    pth.addPath(pth,dm1);
    pth.addPath(pth,dm2);
    ctx.strokeStyle=color.getRGB(i);
    ctx.stroke(pth);
  }
}

var pa=[];
var MC=24;

var deltas=[12,14,18,24,26,28,30,32,34,38,42,46];
/*
  { "del":44,"branchAttempts":20},
  { "del":42,"branchAttempts":20},
  { "del":38,"branchAttempts":20},
//  { "del":36,"branchAttempts":24},
  { "del":34,"branchAttempts":26},
  { "del":32,"branchAttempts":28},
  { "del":30,"branchAttempts":28},
  { "del":28,"branchAttempts":30},
  { "del":26,"branchAttempts":36},
  { "del":24,"branchAttempts":38},
//  { "del":22,"branchAttempts":38},	// terminals over bounds
  { "del":18,"branchAttempts":62},
];
*/

var del=18;

const generatePoints=()=>{
  pa=[];
  for (let i=0; i<=CSIZE/del; i++) {
    pa[i]=[];
    for (let j=0; j<=CSIZE/del; j++) {
      pa[i][j]=new Point(i*del,j*del);
    }
  }
  pa[0][0].o=true;
}

const mot2=[[0,1],[0,-1],[1,0],[-1,0]];
const getMoveArray=(xd,yd)=>{
  let ma=[];
  for (let i=0; i<mot2.length; i++) {
    let tx=xd+mot2[i][0];
    if (tx<0) continue;
    if (tx>pa.length-1) continue;
    let ty=yd+mot2[i][1];
    if (ty<0) continue;
    if (ty>pa.length-1) continue;
    if (pa[tx][ty].o) continue;
    ma.push([tx,ty]);
  }
  return ma;
}

const getRandomBranchPath=()=>{
  let ridx=getRandomInt(0,ca.length);
  for (let c=0; c<ca.length; c++) {
    let idx=(ridx+c)%ca.length;
    let ma=[];
    for (let i=1; i<ca[idx].inda.length; i++) {
      if (i==ca[idx].inda.length-1) continue;
      for (let j=0; j<mot2.length; j++) {
	let tx=ca[idx].inda[i][0]+mot2[j][0];
	if (tx<0) continue;
	if (tx>pa.length-1) continue;
	let ty=ca[idx].inda[i][1]+mot2[j][1];
	if (ty<0) continue;
	if (ty>pa.length-1) continue;
	if (pa[tx][ty].o) continue;
	ma.push({"xy":[tx,ty],"cidx":i});
      }
    }
    if (ma.length==0) continue;
    let mp=ma[getRandomInt(0,ma.length)];
    let point=pa[mp.xy[0]][mp.xy[1]];
    let curve=new Curve();
    curve.inda.push(ca[idx].inda[mp.cidx-1]);
    curve.inda.push(ca[idx].inda[mp.cidx]);
    curve.inda.push(mp.xy);
    let bp=pa[curve.inda[curve.inda.length-1][0]][curve.inda[curve.inda.length-1][1]];
    bp.o=true;
    let bp2=pa[curve.inda[curve.inda.length-2][0]][curve.inda[curve.inda.length-2][1]];
    bp.l=bp2.l+1;
    return curve;
  }
  return false;
}

var branchAttempts=40;
var ca=[];
var generateCurveArray=()=>{
  var curve1=new Curve(0);
  curve1.grow();
  ca=[curve1];
  for (let i=0; i<branchAttempts; i++) {
    let c=getRandomBranchPath();
    if (!c) break;
    c.grow();
    ca.push(c);
  }
}

var path=[];
var setPath=()=>{
  path=[];
  for (let i=0; i<ca.length; i++) {
    for (let j=0; j<ca[i].inda.length-1; j++) {
      let s=ca[i].getSegment(j);
      if (path[s.lvl]==undefined) {
        path[s.lvl]=new Path2D();
      }
      path[s.lvl].addPath(s.path);
    }
  }
}

const reset=()=>{
  del=deltas[getRandomInt(0,deltas.length,true)];
  branchAttempts=getRandomInt(20,120,true);
  generatePoints();
  MC=Math.floor(getRandomInt(1,7)/2*(pa.length+1));
  generateCurveArray();
  setPath();
  color.randomize();
//console.log("del "+del,"ba "+branchAttempts,"MC "+MC,"ca "+ca.length);
}

reset();
onresize();
start();

var showO=()=>{
  for (let i=0; i<pa.length; i++) {
    for (let j=0; j<pa[i].length; j++) {
      if (pa[i][j].o) drawPoint(pa[i][j].x,pa[i][j].y,"cyan");
    }
  } 
}

/*
for (let i=0; i<pa.length; i++) {
  for (let j=0; j<pa[i].length; j++) {
    drawPoint(pa[i][j].x,pa[i][j].y)
  }
}
showO();
*/

// internalize ca
// inda to point with indexes?
// x,y arrays f(t)
// bez to arc?
