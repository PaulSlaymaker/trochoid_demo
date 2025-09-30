"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;
const S6=Math.sin(TP/6);
const SA2=Math.sin(5*TP/24);

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
//ctx.globalCompositeOperation="destination-over";
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
  const CBASE=160;
  const CT=255-CBASE;
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=10+50*Math.random();
    this.GK1=10+50*Math.random();
    this.BK1=10+50*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
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
  this.dist=0;
  this.setPath=()=>{
    let p=new Path2D(); 
    let point=pa[this.inda[0][0]][this.inda[0][1]];
    let point2=pa[this.inda[1][0]][this.inda[1][1]];
    if (point.x==0 && point.y==0) {
      p.moveTo(0,0);
      p.lineTo(point2.x/2,point2.y/2);
      this.distStart=0;
      this.dist=del/2;
point.d=del/2;
    } else {
      p.moveTo((point.x+point2.x)/2,(point.y+point2.y)/2);  // not needed
    }
    for (let i=1; i<this.inda.length-1; i++) {
      let point=pa[this.inda[i][0]][this.inda[i][1]];
      let point2=pa[this.inda[i+1][0]][this.inda[i+1][1]];
      let pex=(point.x+point2.x)/2;
      let pey=(point.y+point2.y)/2;

      if (this.inda[i-1][0]==this.inda[i+1][0] || this.inda[i-1][1]==this.inda[i+1][1]) {
	this.dist+=del;
      point.d=this.dist;
	 p.lineTo(pex,pey);
      } else {
	this.dist+=K*del;
	    p.quadraticCurveTo(point.x,point.y,pex,pey);
      point.d=this.dist;
      }
    }
    let pointe=pa[this.inda[this.inda.length-1][0]][this.inda[this.inda.length-1][1]];
    p.lineTo(pointe.x,pointe.y);
    this.dist+=del/2;
    return p;
  }
  this.grow=()=>{
    for (let i=0; i<MC; i++) {
      let eix=this.inda[this.inda.length-1][0];
      let eiy=this.inda[this.inda.length-1][1];
      let ma=getMoveArray(eix,eiy);
      if (ma.length==0) break;
      let move=ma[getRandomInt(0,ma.length)];
      this.inda.push(move);
      pa[move[0]][move[1]].o=true;
//      pa[move[0]][move[1]].l=pa[eix][eiy].l+1;
// add to this.path here?
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
  if (state==-1) time=maxDistance-t*TF;
  else time=t*TF;
  if (time>maxDistance || time<0) {
    state*=-1;
    time=0;
    t=-1;
    if (state==-1) {
      //time=path.length;
      time=maxDistance;
      ctx.lineWidth=20;
      TF=9; // more?
      pauseTS=performance.now()+2000;
      requestAnimationFrame(pause);
      return;
    } else {
ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
      time=0
      reset();
      TF=4;
    }
  } else {
    draw();
  }
  requestAnimationFrame(animate);
}

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

const DUAL=0,QUAD=1,HEX=2;
var sym=DUAL;

const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);
const dm3=new DOMMatrix([0,1,1,0,0,0]);
const dm4=new DOMMatrix([0.5,S6,-S6,0.5,0,0])
const dm5=new DOMMatrix([-0.5,S6,-S6,-0.5,0,0])

var TF=4;

ctx.setLineDash([1,10000]);
ctx.lineWidth=6;
var draw=()=>{
  if (state==-1) ctx.strokeStyle="black";
  else ctx.strokeStyle=color.getRGB();
  for (let i=0; i<ca.length; i++) {
    ctx.lineDashOffset=-time+ca[i].distStart;	// 3 factor with lw==6
      let pth=new Path2D(ca[i].path);
      pth.addPath(pth,dm1);
      pth.addPath(pth,dm2);
      if (sym==QUAD) {
        pth.addPath(pth,dm3);
      } else if (sym==HEX) {
	let pathHex=new Path2D();
	pathHex.addPath(pth,dm4);
	pathHex.addPath(pth,dm5);
	pth.addPath(pathHex);
      }
  /*
  ctx.lineWidth=del;
    ctx.strokeStyle=color.getRGB(0);
    ctx.stroke(pth);
  ctx.lineWidth=del+8;
    ctx.strokeStyle="#00000010";
  */
    ctx.stroke(pth);
  }

//if (t>maxDistance/TF) stopped=true;
/*
  for (let i=0; i<time; i++) {
  //for (let i=0; i<path.length; i++) {
    let pth=new Path2D(path[i]);
    pth.addPath(pth,dm1);
    pth.addPath(pth,dm2);
    if (sym==QUAD) {
      pth.addPath(pth,dm3);
    } else if (sym==HEX) {
      let pathHex=new Path2D();
      pathHex.addPath(pth,dm4);
      pathHex.addPath(pth,dm5);
      pth.addPath(pathHex);
    }
    ctx.strokeStyle=color.getRGB(i);
    ctx.stroke(path[i]);
  }
*/
}

var pa=[];
var MC=24;

var deltas=[24,22,26,18,28,14,30,12,32,34,38,42,46];

var del=18;
var osk=0;
var yf=1;

const generatePoints=()=>{
  const T45=Math.atan2(1,1);
  const T30=Math.atan2(0.5,S6);
  pa=[];
  for (let i=0; i<=(CSIZE-osk)/del; i++) {
    pa[i]=[];
    for (let j=0; j<=CSIZE/del; j++) {
      let os=(j%2)?osk:0;
      let x=os+i*del;
      let y=j*del*yf;
      pa[i][j]=new Point(Math.round(x),Math.round(y));
//pa[i][j]=new Point(x,y);
      if (sym==QUAD) {
        if (Math.atan2(pa[i][j].y,pa[i][j].x)>T45) pa[i][j].o=true;
      } else if (sym==HEX) {
        if (Math.atan2(pa[i][j].y,pa[i][j].x)>T30) pa[i][j].o=true;
//        if (i>Math.floor((CSIZE-osk)/del)-2) pa[i][j].o=true;
        if (pa[i][j].x>S6*(CSIZE-osk)) pa[i][j].o=true;
      }
    }
  }
  pa[0][0].x=0;
  pa[0][0].y=0;
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
    curve.distStart=pa[ca[idx].inda[mp.cidx-1][0]][ca[idx].inda[mp.cidx-1][1]].d;
    curve.dist=curve.distStart;
    curve.inda.push(ca[idx].inda[mp.cidx-1]);	// extract dist here
    curve.inda.push(ca[idx].inda[mp.cidx]);
    curve.inda.push(mp.xy);
    let bp=pa[curve.inda[curve.inda.length-1][0]][curve.inda[curve.inda.length-1][1]];
    bp.o=true;
//    let bp2=pa[curve.inda[curve.inda.length-2][0]][curve.inda[curve.inda.length-2][1]];
//    bp.l=bp2.l+1;
    return curve;
  }
  return false;
}

var branchAttempts=40;
var ca=[];
var generateCurveArray=()=>{
  var curve1=new Curve(0);
  curve1.grow();
curve1.path=curve1.setPath();
  ca=[curve1];
  for (let i=0; i<branchAttempts; i++) {
    let c=getRandomBranchPath();
    if (!c) break;
    c.grow();
c.path=c.setPath();
    ca.push(c);
  }
}

var drawPoints=()=>{
  ctx.globalCompositeOperation="source-over";
  for (let i=0; i<pa.length; i++) {
    for (let j=0; j<pa[i].length; j++) {
      drawPoint(pa[i][j].x,pa[i][j].y)
    }
  }
ctx.setLineDash([]);
  ctx.lineWidth=1;
  ctx.strokeStyle="white";
  for (let i=1; i<ca.length; i++) {
    ctx.stroke(ca[i].path);
  }
}

var maxDistance=0;
const reset=()=>{
  sym=getRandomInt(0,3);
  del=deltas[getRandomInt(0,deltas.length,true)];
  //del=16*getRandomInt(1,5);
  if (del<22) ctx.lineWidth=7;
  else ctx.lineWidth=8;
  let skewIdx=0; //getRandomInt(0,3,true); 
  osk=[0,del/4,del/2][skewIdx];
  yf=[1,SA2,S6][skewIdx];
  branchAttempts=getRandomInt(20,120,true);
  generatePoints();
  MC=Math.floor(getRandomInt(1,7)/2*(pa.length+1));
//console.log("MC",MC);
  generateCurveArray();
  color.randomize();
//console.log("del "+del,"ba "+branchAttempts,"MC "+MC,"ca "+ca.length);
  maxDistance=0;
  ca.forEach((cu)=>{ maxDistance=Math.max(maxDistance,cu.dist); })
}

var K=0.81;
reset();
onresize();
/*
ctx.strokeStyle="white";
draw();
drawPoints();
//for (let i=0; i<4; i++) {
drawPoint(del/2,del,"white",8);
drawPoint(del/2,3*del/2,"white",8);
drawPoint(del,del/2,"white",8);
drawPoint(del,3*del/2,"white",8);
drawPoint(3*del/2,0,"white",8);
drawPoint(3*del/2,del/2,"white",8);
ctx.setLineDash([1,10000]);
ctx.lineWidth=12;
ctx.strokeStyle="red";
ctx.lineDashOffset=-del/2-K*del;
draw();
ctx.lineDashOffset=-del/2-2*K*del;
*/
draw();
start();

/*
var showO=()=>{
  for (let i=0; i<pa.length; i++) {
    for (let j=0; j<pa[i].length; j++) {
      if (pa[i][j].o) drawPoint(pa[i][j].x,pa[i][j].y,"cyan");
    }
  } 
}
*/

//showO();

// internalize ca
