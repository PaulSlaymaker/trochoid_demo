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
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var hues=[];
var colors=new Array(4);
var getHues=()=>{
  let h=[];
  let hueCount=4;
  let hr=Math.round(90/hueCount);
  //let hue=getRandomInt(0,90,true)+30;
  let hue=getRandomInt(-20,20);
  for (let i=0; i<hueCount; i++) {
    let hd=(hue+Math.round(240/hueCount)*i+getRandomInt(-hr,hr))%360;
    h.splice(getRandomInt(0,h.length+1),0,hd);
  }
//  for (let i=0; i<h.length; i++) colors[i]="hsl("+h[i]+",100%,50%)";
  return h;
}
hues=getHues();
var setColors=()=>{
  colors[0]="hsl("+hues[0]+",100%,40%)";
  colors[1]="hsl("+hues[1]+",100%,50%)";
  colors[2]="hsl("+hues[2]+",100%,50%)";
  colors[3]="hsl("+hues[3]+",100%,50%)";
}
setColors();

/*
var colors=[];
const setColors=()=>{
  let hues=[];
  hues[0]=(getRandomInt(-200,40)+360)%360;
  hues[1]=(hues[0]+getRandomInt(60,90))%360;
//console.log(hues[0]+" "+hues[1]);
  if (Math.random()<0.5) hues.reverse();
  colors[0]="hsl("+hues[0]+",100%,60%)";
  colors[1]="hsl("+hues[1]+",100%,68%)";
}

var getColors=()=>{
  let c=[];
//  let colorCount=getRandomInt(2,10);
let colorCount=4;
  let hr=Math.round(90/colorCount);
  let hue=getRandomInt(0,90,true)+30;
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-hr,hr);
    let sat=80+getRandomInt(0,21);
    let lum=40+getRandomInt(0,21);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
    //c.splice(getRandomInt(0,c.length+1),0,"hsla("+((hue+hd)%360)+","+sat+"%,"+lum+"%,0.4)");
  }
  return c;
}
*/

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

const C=8;
const W=3;

var Line=function(idx,rdx) {
  this.a=idx*TP/C;
//  this.r=radius;
this.r=radii[rdx];
this.rdx=rdx;
  let f=2/C;
  this.f1x=Math.cos(this.a-f);
  this.f1y=Math.sin(this.a-f);
  this.f2x=Math.cos(this.a+f);
  this.f2y=Math.sin(this.a+f);
  this.dp1=new DOMPoint();
  this.dp2=new DOMPoint();
  this.setLine=()=>{
    let r=this.r;
    this.dp1.x=Math.round(r*this.f1x);
    this.dp1.y=Math.round(r*this.f1y);
    this.dp2.x=Math.round(r*this.f2x);
    this.dp2.y=Math.round(r*this.f2y);
  }
  this.setLine();
}

var Trav=function(arc) {
  this.pathIndex=getRandomInt(0,lset.length);
  this.arcCounter=arc;
  this.t=0;
  this.tf=ls[lset[this.pathIndex][arc].rdx+"-"+lset[this.pathIndex][(arc+1)%C].rdx];
let q=getRandomInt(0,3);
this.rad=[14,22,30][q];
this.col=colors[q+1];
  this.stepArc=()=>{
    this.arcCounter=++this.arcCounter%C;

    if (nodes[this.arcCounter][iset[this.arcCounter][this.pathIndex]].length>1) {
//console.log("switch "+nodes[this.arcCounter][iset[this.arcCounter][this.pathIndex]]);
       let ca=nodes[this.arcCounter][iset[this.arcCounter][this.pathIndex]];
       this.pathIndex=ca[getRandomInt(0,ca.length)];
    }

    let a2=(this.arcCounter+1)%C;
    this.tf=ls[lset[this.pathIndex][this.arcCounter].rdx+"-"+lset[this.pathIndex][a2].rdx];
//console.log(nodes[this.arcCounter][lset[this.pathIndex].rdx]);
//console.log(iset[this.arcCounter][this.pathIndex]);
  }
  this.step=()=>{
    this.t++;
    if (this.t==STOP) {
      this.stepArc();
      this.t=0;
    }
  }
  this.draw=()=>{
    ctx.lineDashOffset=-this.tf*this.t;
    ctx.setLineDash([1,4000]);
    ctx.lineWidth=this.rad;
    ctx.strokeStyle=this.col;
    ctx.stroke(pa[this.pathIndex][this.arcCounter]);
  }
}

var radii=[220,280,340];
var iset=new Array(C);

var setRadii=()=>{
  for (let i=0; i<C; i++) {
    let is=new Array(radii.length);
    for (let i=0; i<radii.length; i++) {
      is[i]=getRandomInt(0,radii.length);
    }
    is.sort();
    iset[i]=is;
  }
}
setRadii();

var lset=[new Array(C),new Array(C),new Array(C)];
var nodes=new Array(C);

for (let i=0; i<C; i++) {
  nodes[i]=[];
  for (let j=0; j<lset.length; j++) {
    lset[j][i]=new Line(i,iset[i][j]);
  //  lset[1][i]=new Line(i,0,iset[i][1]);
  //  lset[2][i]=new Line(i,0,iset[i][2]);
//let v=j+"-"+i;
    if (nodes[i][iset[i][j]]) {
      nodes[i][iset[i][j]].push(j);
    } else {
      nodes[i][iset[i][j]]=[j];
    }
  }
}

/*
var getPath=(lp)=>{
  let p=new Path2D();
  let x=(lp[0].dp1.x+lp[0].dp2.x)/2;
  let y=(lp[0].dp1.y+lp[0].dp2.y)/2;
  p.moveTo(x,y);
  for (let i=0; i<C; i++) {
    let i0=i;
    let i1=(i+1)%C;
    x=Math.round((lp[i1].dp1.x+lp[i1].dp2.x)/2);
    y=Math.round((lp[i1].dp1.y+lp[i1].dp2.y)/2);
    p.bezierCurveTo(lp[i0].dp2.x,lp[i0].dp2.y,lp[i1].dp1.x,lp[i1].dp1.y,x,y);
pointsPath.moveTo(x+6,y);
pointsPath.arc(x,y,6,0,TP);
  }
  return p;
}
*/

var pa=new Array(lset.length);
var dpath;//=new Path2D();
var setPaths=()=>{
  dpath=new Path2D();
  for (let l=0; l<radii.length; l++) {
    let lp=lset[l];
let a2=new Array(C);
    for (let i=0; i<C; i++) {
      let p=new Path2D();
      let i0=i;
      let i1=(i+1)%C;
    let x=(lp[i0].dp1.x+lp[i0].dp2.x)/2;
    let y=(lp[i0].dp1.y+lp[i0].dp2.y)/2;
//pointsPath.moveTo(x+6,y);
//pointsPath.arc(x,y,6,0,TP);
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

var pointsPath=new Path2D();

ctx.fillStyle="white";
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//ctx.fill(pointsPath);
  ctx.setLineDash([]);
  ctx.lineWidth=3;
ctx.strokeStyle=colors[0];
  ctx.stroke(dpath);
  for (let i=0; i<ta.length; i++) ta[i].draw();
//test();
//ctx.fill(path,"evenodd");
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
var time=0;
function animate(ts) {
  if (stopped) return;
  for (let i=0; i<ta.length; i++) ta[i].step();
//  trav.step();
//  trav2.step();
/*
  t++;
if (t==STOP) {
//  acounter=++acounter%C;
//let i0=acounter
//let i1=(acounter+1)%C
//  tf=ls[lset[rndLine][i0].rdx+"-"+lset[rndLine][i1].rdx]*10;
//  trav.stepArc();
  t=0;
//stopped=true;
}
*/
  draw();
ctx.rotate(-0.003);
//  test();
  requestAnimationFrame(animate);
}

onresize();

setColors();
//colors=getColors();

var ls={
  "0-0":832,
//  "1-2":991,
//  "2-1":991,
  "0-1":992,
  "1-0":992,
  //"0-2":994,
  //"2-0":994,
  "0-2":1218,
  "2-0":1218,
  "1-1":1061,
  "1-2":1212,
  "2-1":1212,
  "2-2":1288,
};

for (let key in ls) { 
  //ls[key]=Math.round(ls[key]/5000); 
  ls[key]=ls[key]/500; 
}

var STOP=100;

var rndLine=getRandomInt(0,3);
//console.log((rset[0][rndLine]-220)/60);
//console.log(lset[rndLine][0].rdx);
//console.log(lset[rndLine][0].rdx+"-"+lset[rndLine][1].rdx);
//console.log(Math.round(ls[lset[rndLine][0].rdx+"-"+lset[rndLine][1].rdx]*1000));
//STOP=Math.round(ls[lset[rndLine][0].rdx+"-"+lset[rndLine][1].rdx]*1000);
//var tf=ls[lset[rndLine][0].rdx+"-"+lset[rndLine][1].rdx]*10;
//console.log("tf "+tf);
//console.log("path "+rndLine);

var acounter=0;

/*
var test=(la,o)=>{
  //let pth=getPath(lset[1]);
//let z=(ERA[2]+ERA[1])/2+o;
//let z=ERA[1];
  //ctx.lineDashOffset=-TP*z/8;	// 271
  //ctx.lineDashOffset=-TP*ERA[2]/8;	// 271
  ctx.lineDashOffset=-tf*t;
  ctx.setLineDash([1,8000]);
  ctx.lineWidth=18;
  ctx.stroke(pa[rndLine][acounter]);
}
*/

setPaths();

//var ta=new Array(3);
/*
var trav=new Trav(0);
var trav2=new Trav(0);
trav2.t=16;
var ta=[trav,trav2,new Trav(0)];
ta[2].t=32;
*/
var ta=new Array(40);
for (let i=0; i<40; i++) {
  ta[i]=new Trav(Math.trunc(i/5));
//  ta[i].arcCounter=Math.trunc(i/5);
  ta[i].t=20*(i%5);	// 20 - 5 integral separation of trav, for Trav radius (linewidth),  5*20=STOP
}

start();
