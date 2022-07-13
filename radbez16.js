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
c.style.outline="1px dotted gray";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";
//ctx.lineJoin="round";
//ctx.rotate(TP/4);

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
  let hueCount=3;
  //let hr=Math.round(90/hueCount);
  //let hue=getRandomInt(-10,10);
  let hue=getRandomInt(0,200);
  for (let i=0; i<hueCount; i++) {
    let hd=(hue+Math.round(240/hueCount)*i+getRandomInt(-10,10))%360;
    h.splice(getRandomInt(0,h.length+1),0,hd);
  }
  return h;
}

var setColors=()=>{
  hues=getHues();
  colors[0]="hsl("+hues[0]+",100%,70%)";
  colors[1]="hsl("+hues[1]+",100%,70%)";
  colors[2]="hsl("+hues[2]+",100%,70%)";
//  colors[3]="hsl("+hues[3]+",100%,70%)";
}

const C=32;

var Axis=function(idx) {
  this.pts=new Array(PC);
  this.pts2=new Array(PC);
  let f=2/C;
let a=idx*TP/C;
  this.f1x=Math.cos(a-f);
  this.f1y=Math.sin(a-f);
  this.f2x=Math.cos(a+f);
  this.f2y=Math.sin(a+f);
  this.setPoints=()=>{
    for (let i=0; i<PC; i++) {
      let r=CSIZE*i/(PC-1);
//let ri=getRandomInt(0,axFactors[i].length);
      let ri=Math.trunc(idx*axFactors[i].length/lineCount);
      let xf=axFactors[i][ri].x;
      let yf=axFactors[i][ri].y;
      this.pts[i]={"x":xf*r,"y":yf*r,"c1x":xf*(r-CD),"c1y":yf*(r-CD),"c2x":xf*(r+CD),"c2y":yf*(r+CD)};
      let xf2=axFactors2[i][ri].x;
      let yf2=axFactors2[i][ri].y;
      this.pts[i]={"x":xf*r,"y":yf*r,"c1x":xf*(r-CD),"c1y":yf*(r-CD),"c2x":xf*(r+CD),"c2y":yf*(r+CD)};
      this.pts2[i]={"x":xf2*r,"y":yf2*r,"c1x":xf2*(r-CD),"c1y":yf2*(r-CD),"c2x":xf2*(r+CD),"c2y":yf2*(r+CD)};
    }
  }
  this.setPoints();

  this.getPath=()=>{
    let p=new Path2D();
    p.moveTo(this.pts[0].x,this.pts[0].y);
    for (let i=0; i<this.pts.length-1; i++) {
        let x2=(1-frac)*this.pts[i+1].x+frac*this.pts2[i+1].x;
        let y2=(1-frac)*this.pts[i+1].y+frac*this.pts2[i+1].y;
        let c1x=(1-frac)*this.pts[i].c2x+frac*this.pts2[i].c2x;
        let c1y=(1-frac)*this.pts[i].c2y+frac*this.pts2[i].c2y;
        let c2x=(1-frac)*this.pts[i+1].c1x+frac*this.pts2[i+1].c1x;
        let c2y=(1-frac)*this.pts[i+1].c1y+frac*this.pts2[i+1].c1y;
/*
	p.bezierCurveTo(
	  this.pts[i].c2x,this.pts[i].c2y,this.pts[i+1].c1x,this.pts[i+1].c1y,
	  this.pts[i+1].x,this.pts[i+1].y
	);
*/
	p.bezierCurveTo(c1x,c1y,c2x,c2y,x2,y2);
    }
    return p;
  }
}

var radii=new Array(10);
var setRadii=()=>{
  for (let i=0; i<radii.length; i++) {
    //radii[i]=10+Math.round(380*Math.random());
    radii[i]=20+Math.round(360/radii.length*i);
  }
//  radii.sort((a,b)=>{ return a-b; });
}
setRadii(radii);

//var lset=[new Array(C),new Array(C),new Array(C),new Array(C), new Array(C), new Array(C)];
//var lset2=[new Array(C),new Array(C),new Array(C),new Array(C), new Array(C), new Array(C)];
var lset=new Array(20);
var lset2=new Array(20);
var setLineSets=()=>{
  for (let i=0; i<20; i++) {
    lset[i]=new Array(C);
    lset2[i]=new Array(C);
  }
}
setLineSets();

/*
var ldo=[];
for (let i=0; i<lset.length; i++) {
  ldo[i]=100*Math.random();
}
var ldf=[];
for (let i=0; i<lset.length; i++) {
  ldf[i]=(0.5+Math.random())*[-1,1][getRandomInt(0,2)];
}
var ldo2=[];
for (let i=0; i<lset.length; i++) {
  ldo2[i]=100*Math.random();
}
var ldf2=[];
var ldo3=[];
var ldf3=[];
for (let i=0; i<lset.length; i++) {
  ldo3[i]=100*Math.random();
  ldf2[i]=(0.5+Math.random())*[-1,1][getRandomInt(0,2)];
  ldf3[i]=(0.5+Math.random())*[-1,1][getRandomInt(0,2)];
}
*/

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
var t=0;
var s=0;
var frac=0;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t==200) {
    axFactors=getRandomAxialFactors();
    for (let i=0; i<lineCount; i++) aa[i].setPoints();
    frac=1;
  } else if (t==400) {
    axFactors2=getRandomAxialFactors();
    for (let i=0; i<lineCount; i++) aa[i].setPoints();
    t=0;
    frac=0;
//    stopped=true;
  } else if (t<200) {
    frac=t/200;
  } else {
    frac=(400-t)/200;
  //} else if (t>200) {
  }
//  for (let i=0; i<lineCount; i++) aa[i].setPoints();
  draw();
  requestAnimationFrame(animate);
}

onresize();

var drawPoint=(x,y,col)=>{
  ctx.beginPath();
  ctx.moveTo(x+6,y);
  ctx.arc(x,y,6,0,TP);
  if (col==undefined) ctx.fillStyle="red";
  else ctx.fillStyle=col;
  ctx.fill();
}

const PC=5;	// number of points/radii on each axis
//const CD=CSIZE/2/PC;
const CD=CSIZE/1.5/PC;

var lineCount=8;

var getAxialFactorArray=(n)=>{
  let fa=new Array(n);
  for (let i=0; i<n; i++) {
    //let z=TP/4/(n-1)*i;
    let z=TP/4*Math.random();
    fa[i]={"x":Math.cos(z),"y":Math.sin(z),"z":z};
  }
  fa.sort((a,b)=>{ return a.z-b.z; });
  return fa;
}

var getRandomAxialFactors=()=>{
  let af=new Array(PC);
  for (let i=0; i<PC; i++) {
    let fc=Math.max(1,Math.round(i*lineCount/(PC-3)));
    af[i]=getAxialFactorArray(fc);
  }
  return af;
}
var axFactors=getRandomAxialFactors();
var axFactors2=getRandomAxialFactors();

var pts=new Array(PC);
var setPoints=(l)=>{
//  pts[0]={"x":0,"y":0,"c2x":CD*fa[1].x,"c2y":CD*fa[1].y};
  for (let i=0; i<PC; i++) {
    let r=CSIZE*i/(PC-1);

//let ri=getRandomInt(0,axFactors[i].length);
    let ri=Math.trunc(l*axFactors[i].length/lineCount);
    let xf=axFactors[i][ri].x;
    let yf=axFactors[i][ri].y;

//    let x=r*Math.cos(z);
//    let y=r*Math.sin(z);
    pts[i]={"x":xf*r,"y":yf*r,"c1x":xf*(r-CD),"c1y":yf*(r-CD),"c2x":xf*(r+CD),"c2y":yf*(r+CD)};
  }
}

var opath=new Path2D();

/*
var getPath=()=>{
  let p=new Path2D();
  p.moveTo(pts[0].x,pts[0].y);
//opath.moveTo(0,0);
  for (let i=0; i<pts.length-1; i++) {
      p.bezierCurveTo(
        pts[i].c2x,pts[i].c2y,pts[i+1].c1x,pts[i+1].c1y,
        pts[i+1].x,pts[i+1].y
      );
//      opath.bezierCurveTo(pts[i].c2x,pts[i].c2y,pts[i+1].c1x,pts[i+1].c1y,pts[i+1].x,pts[i+1].y);
  }
  return p;
}
*/

var aa=new Array(lineCount);
for (let i=0; i<lineCount; i++) {
  aa[i]=new Axis(i);
}

ctx.lineWidth=6;
ctx.globalAlpha=0.9;
ctx.setLineDash([400,100000]);
ctx.fillStyle="#00000008";

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);

  let opath=new Path2D();
  for (let i=0; i<lineCount; i++) {
  //  aa[i].setPoints();
    let pth=aa[i].getPath();
    pth.addPath(pth, new DOMMatrix([1,0,0,-1,0,0]));
    pth.addPath(pth, new DOMMatrix([-1,0,0,1,0,0]));

ctx.lineWidth=7;
    ctx.strokeStyle=colors[i%colors.length];
    ctx.stroke(pth);

/*
ctx.setLineDash([0,400,1,100000]);
ctx.lineWidth=25;
    ctx.strokeStyle="red";
    ctx.stroke(pth);
*/
opath.addPath(pth);
  }

ctx.lineWidth=1;
ctx.strokeStyle="black";
ctx.stroke(opath);
 
/*
  for (let i=0; i<lineCount; i++) {
  setPoints(i);
  let pth=getPath();
pth.addPath(pth, new DOMMatrix([1,0,0,-1,0,0]));
pth.addPath(pth, new DOMMatrix([-1,0,0,1,0,0]));
  //ctx.strokeStyle="green";
  ctx.strokeStyle=colors[i%colors.length];
  ctx.stroke(pth);
  //  for (let i=0; i<pts.length; i++) drawPoint(pts[i].x,pts[i].y);
  }
*/

}

setColors();

draw();
//start();
