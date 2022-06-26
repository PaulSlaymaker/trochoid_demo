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
  let hue=getRandomInt(-30,30);
  for (let i=0; i<hueCount; i++) {
    let hd=(hue+Math.round(240/hueCount)*i+getRandomInt(-hr,hr))%360;
    h.splice(getRandomInt(0,h.length+1),0,hd);
  }
//  for (let i=0; i<h.length; i++) colors[i]="hsl("+h[i]+",100%,50%)";
  return h;
}
hues=getHues();
var setColors=()=>{
  colors[0]="hsl("+hues[0]+",100%,50%)";
  colors[1]="hsl("+hues[1]+",100%,50%)";
  colors[2]="hsl("+hues[2]+",90%,60%)";
  colors[3]="hsl("+hues[3]+",90%,60%)";
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

var drawPoint=(pth,x,y)=>{	// diag
  pth.arc(x,y,6,0,TP);
}

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

var Line=function(idx,radius,rdx) {
  this.a=idx*TP/C;
//  this.r=radius;
this.r=radii[rdx];
this.rdx=rdx;
  //let f=0.5;
  let f=2/C;
  this.f1x=Math.cos(this.a-f);
  this.f1y=Math.sin(this.a-f);
  this.f2x=Math.cos(this.a+f);
  this.f2y=Math.sin(this.a+f);
  this.dp1=new DOMPoint();
  this.dp2=new DOMPoint();
  this.setLine=()=>{
    //f=TP/16*(1+Math.pow(Math.sin(t/200),2));
    let r=this.r;
    this.dp1.x=Math.round(r*this.f1x);
    this.dp1.y=Math.round(r*this.f1y);
    this.dp2.x=Math.round(r*this.f2x);
    this.dp2.y=Math.round(r*this.f2y);
//mx=(this.dp1.x+this.dp2.x)/2
// r2=Math.pow(mx*mx+my*my,0.5);
  }
  this.setLine();
}

var Trav=function(pidx) {
  this.pathIndex=pidx;
  this.draw=()=>{
    ctx.lineDashOffset=-tf*t;
    ctx.setLineDash([1,8000]);
    ctx.lineWidth=18;
    ctx.stroke(pa[pidx][acounter]);
  }
}

var nodes={};

var radii=[220,280,340];

/*
const ERA=[];
for (let i=0; i<radii.length; i++) {
  let linec=new Line(0,radii[i]);
  let mx=(linec.dp1.x+linec.dp2.x)/2;
  let my=(linec.dp1.y+linec.dp2.y)/2;
  ERA.push(Math.pow(mx*mx+my*my,0.5));
}
*/

var rset=new Array(C);
for (let i=0; i<C; i++) {
  let rs=new Array(radii.length);
  for (let i=0; i<radii.length; i++) {
    //rs[i]=220+60*getRandomInt(0,W);
    rs[i]=radii[getRandomInt(0,radii.length)];
  }
  rs.sort();
  rset[i]=rs;
}

var iset=new Array(C);
for (let i=0; i<C; i++) {
  let is=new Array(radii.length);
  for (let i=0; i<radii.length; i++) {
    is[i]=getRandomInt(0,radii.length);
  }
  is.sort();
  iset[i]=is;
}

var lset=[new Array(C),new Array(C),new Array(C)];
/*
for (let i=0; i<C; i++) {
  for (let j=0; j<W; j++) {
    lset[j]=new Line(i,rset[i][j]);
  }
}
*/
//  for (let j=0; j<radii.length; j++) {
//    lset[j]=new Array(C);
for (let i=0; i<C; i++) {
  lset[0][i]=new Line(i,0,iset[i][0]);
  lset[1][i]=new Line(i,0,iset[i][1]);
  lset[2][i]=new Line(i,0,iset[i][2]);
}

var getPath=(lp)=>{
//  let lines=lp;
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

var getPath2=(idx)=>{
  let p=new Path2D();
  for (let i=0; i<C; i++) {
    p.addPath(pa[idx][i]);
  }
  return p;
}

var pa=new Array(radii.length);
var dpath=new Path2D();
var setPaths=()=>{
  for (let l=0; l<radii.length; l++) {
    let lp=lset[l];
let a2=new Array(C);
    for (let i=0; i<C; i++) {
      let p=new Path2D();
      let i0=i;
      let i1=(i+1)%C;
    let x=(lp[i0].dp1.x+lp[i0].dp2.x)/2;
    let y=(lp[i0].dp1.y+lp[i0].dp2.y)/2;
pointsPath.moveTo(x+6,y);
pointsPath.arc(x,y,6,0,TP);
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
//var paths=[getPath(lset[0]),getPath(lset[1]),getPath(lset[2])];
//dpath.addPath(paths[0]);
//dpath.addPath(paths[1]);
//dpath.addPath(paths[2]);

ctx.fillStyle="white";
ctx.lineWidth=2;
ctx.strokeStyle=colors[0];
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);

ctx.fill(pointsPath);

  ctx.setLineDash([]);
  ctx.lineWidth=2;
  ctx.stroke(dpath);
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
var t=0;
function animate(ts) {
  if (stopped) return;
  t++;
if (t==STOP) {
  acounter=++acounter%C;
let i0=acounter
let i1=(acounter+1)%C
  tf=ls[lset[rndLine][i0].rdx+"-"+lset[rndLine][i1].rdx]*10;
  t=0;
//stopped=true;
}
  draw();
  test();
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
  ls[key]=ls[key]/5000; 
}

// 2/3    rr=(ERA[2]+ERA[1])/2+9;

var STOP=100;

var rndLine=getRandomInt(0,3);
//console.log((rset[0][rndLine]-220)/60);
//console.log(lset[rndLine][0].rdx);
console.log(lset[rndLine][0].rdx+"-"+lset[rndLine][1].rdx);
console.log(Math.round(ls[lset[rndLine][0].rdx+"-"+lset[rndLine][1].rdx]*1000));
//STOP=Math.round(ls[lset[rndLine][0].rdx+"-"+lset[rndLine][1].rdx]*1000);
var tf=ls[lset[rndLine][0].rdx+"-"+lset[rndLine][1].rdx]*10;
console.log("tf "+tf);
console.log("path "+rndLine);

var acounter=0;

var test=(la,o)=>{
  //let pth=getPath(lset[1]);
//let z=(ERA[2]+ERA[1])/2+o;
//let z=ERA[1];
  //ctx.lineDashOffset=-TP*z/8;	// 271
  //ctx.lineDashOffset=-TP*ERA[2]/8;	// 271
  ctx.lineDashOffset=-tf*t;
  ctx.setLineDash([1,8000]);
  //ctx.lineWidth=8;
  ctx.lineWidth=18;
//  ctx.stroke(paths[rndLine]);
ctx.stroke(pa[rndLine][acounter]);
}

var test2=()=>{
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(0,0,340,0,TP)
  ctx.lineWidth=0.5;
  ctx.strokeStyle="white";
  ctx.stroke();
}

setPaths();
draw();
test();
