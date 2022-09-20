"use strict"; // Paul Slaymaker, paul25882@gmail.com
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

var colors=[];
var setColors=()=>{
  colors=[];
  let colorCount=4;
  let hue=getRandomInt(210,240);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(240/colorCount)*i+getRandomInt(-10,10);
    let h=(hue+hd)%360;
    colors.splice(getRandomInt(0,colors.length+1),0,"hsl("+h+",90%,50%)");
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

let randomS=getRandomInt(0,3);
//const COUNT=[12,15,17,19,21,24][randomS];
//const lw=   [14,13,12,12,11,10][randomS];
var COUNT=[12,18,24][randomS];
var lw=   [14,12,10][randomS];
var R=(CSIZE-lw)/COUNT;

function Arc(pt, aidx, dir){
  this.cp=pt;
  this.aidx=aidx;
  this.addPath=(p)=>{
    if (dir) p.arc(pt.x,pt.y,R,aidx*TP/4,aidx*TP/4-TP/4,dir);
    else p.arc(pt.x,pt.y,R,aidx*TP/4,aidx*TP/4+TP/4,dir);
  }
  this.draw=()=>{
    ctx.beginPath();
    if (dir) ctx.arc(pt.x,pt.y,R,aidx*TP/4,aidx*TP/4-TP/4,dir);
    else ctx.arc(pt.x,pt.y,R,aidx*TP/4,aidx*TP/4+TP/4,dir);
    ctx.stroke();
  }
}

var path;
var pathLength;

var reset=()=>{
  let randomS=getRandomInt(0,3);
  COUNT=[12,18,24][randomS];
  lw=   [14,12,10][randomS];
  R=(CSIZE-lw)/COUNT;
  setPoints();
  initPointArray();
  while (grow(pa.length-1));// && pa.length<9);
  path=setArcPath();
  pathLength=R*(aa.length-1)*Math.PI/2;	// bad estimate, needs fudge factor
  pathLength+=[26,-107,-162][randomS];
  ds=pathLength/([20,30,40,50,60][getRandomInt(0,5)]);
  setColors();
  speed=getRandomInt(2,4);
}

var pts=[];
var setPoints=()=>{
for (let i=0; i<COUNT; i++) {
  pts[i]=[];
  for (let j=0; j<COUNT; j++) {
    pts[i][j]={"x":-CSIZE+R+lw+i*2*R,"y":-CSIZE+R+lw+j*2*R,"i":i,"j":j,"cpa":[]};
//if (Math.abs(i-6)+Math.abs(j-6)>6) pts[i][j].d=true;
  }
}
}

/* draw circles
for (let i=0; i<COUNT; i++) {
  for (let j=0; j<COUNT; j++) {
    ctx.beginPath();
    ctx.arc(pts[i][j].x,pts[i][j].y,R,0,TP);
ctx.stroke();
    //drawPoint(pts[i][j].x,pts[i][j].y);
  }
}
*/

var oQuadrant=(i,j)=>{
  if (i==1) {
    if (j==1) return 2;
    else return 1;
  } else {
    if (j==1) return 3;
    else return 0;
  }
}

var pa;	// point array of centers for connected circles

var initPointArray=()=>{
  //pa=[pts[(COUNT-1)/2][(COUNT-1)/2]];
  pa=[pts[getRandomInt(0,COUNT)][getRandomInt(0,COUNT)]];
  pa[0].d=true;
  pa[0].aidx=getRandomInt(0,4);
}

var grow=(idx)=>{
  let a1=[[-1,1],[1,-1]][getRandomInt(0,2)];
  let a2=[[-1,1],[1,-1]][getRandomInt(0,2)];
  for (let c=pa.length-1; c>=0; c--) {
    idx=c;
    for (let i of a1) {
      if (pa[idx].i+i<0) continue;
      if (pa[idx].i+i>COUNT-1) continue;
      for (let j of a2) {
	if (pa[idx].j+j<0) continue;
	if (pa[idx].j+j>COUNT-1) continue;
	let pt=pts[pa[idx].i+i][pa[idx].j+j];
	if (pt.d) continue;
	pt.d=true;
        pt.aidx=oQuadrant(i,j);
	pt.pp=pa[idx];
//	pa[idx].cpa[pt.aidx]=pt;
	pa.push(pt);
	return true; 
      }
    }
  }
  return false;
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
var t=0;
function animate(ts) {
  if (stopped) return;
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  t++;
  if (t<60) {
    ctx.globalAlpha=t/60;
  } else if (t>1060) {
    reset();
    t=0;
    ctx.globalAlpha=0;
  } else if (t>1000) {
    let f=(1060-t)/60;
    ctx.globalAlpha=f;
  }
  draw();
  requestAnimationFrame(animate);
}

/*	draw points
//let p=new Path2D();
for (let i=0; i<pa.length; i++) {
//  if (i==0) p.moveTo(pa[i].x,pa[i].y);
//  else p.lineTo(pa[i].x,pa[i].y);
if (pa[i].cpa.length==0) drawPoint(pa[i].x,pa[i].y,"blue");
  else drawPoint(pa[i].x,pa[i].y);
//  pa[i].cpa.sort((a,b)=>{ return a.aidx-b.aidx; });
}
//ctx.stroke(p);
*/

/*	draw point connections
ctx.lineWidth=2;
ctx.strokeStyle="yellow";
var drawLine=(ppt)=>{
  for (let i=0; i<ppt.cpa.length; i++) {
    if (ppt.cpa[i]) {
    ctx.beginPath();
    ctx.moveTo(ppt.x,ppt.y);
    ctx.lineTo(ppt.cpa[i].x,ppt.cpa[i].y);
    ctx.stroke();
    drawLine(ppt.cpa[i]);
    }
  }
}
drawLine(pa[0]);
*/

var aa=new Array();

var getSplicePoint=(pt)=>{
  for (let i=0; i<aa.length; i++) {
    if (aa[i].cp==pt.pp && aa[i].aidx==(pt.aidx+2)%4) {
      return i;
    }
  }
//  debugger;
}

var setArcPath=()=>{
  aa=[];
  for (let i=0; i<4; i++) {
    aa.push(new Arc(pa[0],i));
  }
  for (let i=1; i<pa.length; i++) {
    let point=pa[i];
    let sp=getSplicePoint(point);
    if (point.aidx==0) {
      let c1=new Arc(pts[point.i][point.j+1],0,true);
      let b1=new Arc(point,1);
      let b2=new Arc(point,2);
      let b3=new Arc(point,3);
      let c2=new Arc(pts[point.i+1][point.j],2,true);
      aa.splice(sp,1,c1,b1,b2,b3,c2);
    } else if (point.aidx==1) {
      let c1=new Arc(pts[point.i-1][point.j],1,true);
      let b1=new Arc(point,2);
      let b2=new Arc(point,3);
      let b3=new Arc(point,0);
      let c2=new Arc(pts[point.i][point.j+1],3,true);
      aa.splice(sp,1,c1,b1,b2,b3,c2);
    } else if (point.aidx==2) {
      let c1=new Arc(pts[point.i][point.j-1],2,true);
      let b1=new Arc(point,3);
      let b2=new Arc(point,0);
      let b3=new Arc(point,1);
      let c2=new Arc(pts[point.i-1][point.j],0,true);
      aa.splice(sp,1,c1,b1,b2,b3,c2);
    } else if (point.aidx==3) {
      let c1=new Arc(pts[point.i+1][point.j],3,true);
      let b1=new Arc(point,0);
      let b2=new Arc(point,1);
      let b3=new Arc(point,2);
      let c2=new Arc(pts[point.i][point.j-1],1,true);
      aa.splice(sp,1,c1,b1,b2,b3,c2);
    } //else debugger;
  }
  var path=new Path2D();
  for (let i=0; i<aa.length; i++) aa[i].addPath(path);
  return path;
}

var speed=getRandomInt(2,4);
var ds=pathLength/([8,16,32,64][getRandomInt(0,4)]);

var draw=()=>{
  ctx.globalCompositeOperation="source-over";
  let tf=Math.abs(Math.sin(t/1000));

//var ds=pathLength/32;
//var ds=pathLength/64;
  let td1=3*pathLength/256;
  let td2=13*pathLength/256;
  //ctx.setLineDash([td1-tf*td1/2,td2-tf*td2/2]);
  //ctx.setLineDash([td1-tf*td1/2,td2-tf*td2/2,tf*td1/2,tf*td2/2]);
  //ctx.setLineDash([3*pathLength/256,13*pathLength/256]);
  ctx.setLineDash([3/8*ds,13/8*ds]);
  ctx.lineWidth=lw;
  ctx.lineDashOffset=speed*t;
  ctx.strokeStyle=colors[0];
  ctx.stroke(path);

  //ctx.lineDashOffset=speed*t+pathLength/32;
  ctx.lineDashOffset=speed*t+ds;
  ctx.strokeStyle=colors[2];
  ctx.stroke(path);

  let td3=pathLength/64;
  let td4=3*pathLength/64;
  //ctx.setLineDash([td3-tf*td3,td4-tf*td4,tf*td3,tf*td4]);
  //ctx.setLineDash([pathLength/64,3*pathLength/64]);
  ctx.setLineDash([1/2*ds,3/2*ds]);
  ctx.lineWidth=lw/2.3;
  ctx.lineDashOffset=speed*t;
  ctx.strokeStyle=colors[1];
  ctx.stroke(path);

  ctx.lineDashOffset=speed*t+ds;
  ctx.strokeStyle=colors[3];
  ctx.stroke(path);

  ctx.globalCompositeOperation="lighter";
  ctx.lineWidth=1.7*lw;
  //ctx.setLineDash([10,pathLength/16-10]);
  ctx.setLineDash([10,2*ds-10]);
  ctx.lineDashOffset=speed*t;
  ctx.strokeStyle=colors[0];
  ctx.stroke(path);
  ctx.lineDashOffset=speed*t+ds;
  ctx.strokeStyle=colors[2];
  ctx.stroke(path);
}

onresize();

reset();

start();
/*
ctx.rotate(TP/8);
ctx.strokeStyle="yellow";
ctx.stroke(path);
ctx.setLineDash([1,pathLength-1]);
ctx.lineDashOffset=1;
ctx.lineWidth=lw;
ctx.stroke(path);
drawPoint(pa[0].x,pa[0].y,"white");
*/

/*
ctx.fillStyle="white";
ctx.font="24px sans-serif";
for (let i=0; i<COUNT; i++) {
  for (let j=0; j<COUNT; j++) {
    let pt=pts[i][j];
    if (Number.isInteger(pt.aidx))
    ctx.fillText(pt.aidx,pt.x+2,pt.y-2);  
  }
}
*/
