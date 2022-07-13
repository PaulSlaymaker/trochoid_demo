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
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var hues=[];
var colors=new Array(4);
var getColors=()=>{
  let h=[];
  let hueCount=3;
  let hue=getRandomInt(200,360);
  for (let i=0; i<hueCount; i++) {
    let hd=(hue+Math.round(200/hueCount)*i+getRandomInt(-10,10))%360;
    //h.splice(getRandomInt(0,h.length+1),0,hd);
    h.splice(getRandomInt(0,h.length+1),0,"hsl("+hd+",100%,70%)");
  }
  return h;
}

/*
var setColors=()=>{
  hues=getHues();
  colors[0]="hsl("+hues[0]+",100%,70%)";
  colors[1]="hsl("+hues[1]+",100%,70%)";
  colors[2]="hsl("+hues[2]+",100%,70%)";
//  colors[3]="hsl("+hues[3]+",100%,70%)";
}
*/

const C=16;

var Line=function(idx,rdx) {
  //this.a=idx*TP/C;
  this.radius=radii[rdx];
  let f=2/C;
  //let f=TP/C*Math.random();
let a=idx*TP/C;
  this.f1x=Math.cos(a-f);
  this.f1y=Math.sin(a-f);
  this.f2x=Math.cos(a+f);
  this.f2y=Math.sin(a+f);
  this.dp1=new DOMPoint();
  this.dp2=new DOMPoint();
  this.setLine=()=>{
    this.dp1.x=Math.round(this.radius*this.f1x);
    this.dp1.y=Math.round(this.radius*this.f1y);
    this.dp2.x=Math.round(this.radius*this.f2x);
    this.dp2.y=Math.round(this.radius*this.f2y);
  }
  this.setLine();
}

//var radii=[150,220,290,360];
//var radii=[50,150,250,350];
//var radii=[60,180,300];
var radii=new Array(4);
var setRadii=()=>{
  radii[0]=1;
  for (let i=1; i<radii.length; i++) {
    radii[i]=Math.round(380*Math.random());
  }
  radii.sort((a,b)=>{ return a-b; });
//radii[0]=Math.min(0,radii[0]);
}
setRadii(radii);

let L=C/4+1;
var lset=[new Array(L),new Array(L),new Array(L),new Array(L), new Array(L), new Array(L)];
var lset2=[new Array(L),new Array(L),new Array(L),new Array(L), new Array(L), new Array(L)];

var setLines=(ls)=>{
  var iset=new Array(L);
  for (let i=0; i<L; i++) {
    let is=new Array(ls.length);
    for (let j=0; j<ls.length; j++) {
      is[j]=getRandomInt(0,radii.length);
    }
    is.sort();
    iset[i]=is;
  }
  for (let i=0; i<L; i++) {
    for (let j=0; j<ls.length; j++) {
      ls[j][i]=new Line(i,iset[i][j]);
    }
  }
  ls.reverse();
}

var pa=new Array(lset.length);	// path array
var dpath;
var setPaths=()=>{
  dpath=new Path2D();
  for (let l=0; l<lset.length; l++) {
    let lp=lset[l];
    let lp2=lset2[l];
    let x=(1-frac)*(lp[0].dp1.x+lp[0].dp2.x)/2+frac*(lp2[0].dp1.x+lp2[0].dp2.x)/2;
    let y=(1-frac)*(lp[0].dp1.y+lp[0].dp2.y)/2+frac*(lp2[0].dp1.y+lp2[0].dp2.y)/2;
    pa[l]=new Path2D();
    pa[l].moveTo(Math.round(x),Math.round(y));
    for (let i=0; i<C/4; i++) {
//      let p=new Path2D();
      let i0=i;
      let i1=(i+1)%C;
    //let x=(lp[i0].dp1.x+lp[i0].dp2.x)/2;
    //let y=(lp[i0].dp1.y+lp[i0].dp2.y)/2;
//      x=Math.round((lp[i1].dp1.x+lp[i1].dp2.x)/2);
//      y=Math.round((lp[i1].dp1.y+lp[i1].dp2.y)/2);
      x=Math.round((1-frac)*(lp[i1].dp1.x+lp[i1].dp2.x)/2+frac*(lp2[i1].dp1.x+lp2[i1].dp2.x)/2);
      y=Math.round((1-frac)*(lp[i1].dp1.y+lp[i1].dp2.y)/2+frac*(lp2[i1].dp1.y+lp2[i1].dp2.y)/2);
      let c1x=(1-frac)*lp[i0].dp2.x+frac*lp2[i0].dp2.x;
      let c1y=(1-frac)*lp[i0].dp2.y+frac*lp2[i0].dp2.y;
      let c2x=(1-frac)*lp[i1].dp1.x+frac*lp2[i1].dp1.x;
      let c2y=(1-frac)*lp[i1].dp1.y+frac*lp2[i1].dp1.y;
      pa[l].bezierCurveTo(c1x,c1y,c2x,c2y,x,y);
      //p.bezierCurveTo(c1x,c1y,lp[i1].dp1.x,lp[i1].dp1.y,x,y);
      //p.bezierCurveTo(lp[i0].dp2.x,lp[i0].dp2.x,lp[i1].dp1.y,lp[i1].dp1.y,x,y);
      //pa[l].addPath(p);
    }
    dpath.addPath(pa[l]);
  }
}

var ldo=[];
//for (let i=0; i<lset.length; i++) { ldo[i]=100*Math.random(); }
var ldf=[];

var ldo2=[];
//for (let i=0; i<lset.length; i++) { ldo2[i]=100*Math.random(); }
var ldf2=[];

var ldo3=[];
var ldf3=[];
for (let i=0; i<lset.length; i++) {
  ldo[i]=100*Math.random();
  ldo2[i]=100*Math.random();
  ldo3[i]=100*Math.random();
  ldf[i]=(0.5+Math.random())*[-1,1][getRandomInt(0,2)];
  ldf2[i]=(0.5+Math.random())*[-1,1][getRandomInt(0,2)];
  ldf3[i]=(0.5+Math.random())*[-1,1][getRandomInt(0,2)];
}

//var pointsPath=new Path2D();
//ctx.fillStyle="#00000008";
ctx.fillStyle="black";
ctx.lineWidth=10;
ctx.globalAlpha=0.2;
var dash=[30,60];
ctx.setLineDash(dash);

var draw=()=>{
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//ctx.fillStyle="#00000004";
//ctx.globalAlpha=0.8;
ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
let p2=new Path2D();
ctx.setLineDash(dash);
ctx.lineWidth=40;
ctx.globalAlpha=0.04;
  for (let i=0; i<lset.length; i++) {
//ctx.lineWidth=20-3*i;
let p=new Path2D(pa[i]);
p.addPath(p,new DOMMatrix([-1,0,0,1,0,0]));
p.addPath(p,new DOMMatrix([-1,0,0,-1,0,0]));
p2.addPath(p);

//ctx.strokeStyle=(i%2==0)?"black":colors[i%colors.length];
//ctx.strokeStyle=colors[i%colors.length];
//ctx.globalAlpha=(i%2==0)?0.3:0.07;
//ctx.lineWidth=(i%2==0)?4:10;

/*
if (i==1) {
  ctx.setLineDash(dash);
  ctx.lineDashOffset=t;
} else if (i==3) {
  ctx.setLineDash(dash);
  ctx.lineDashOffset=100+t;
} else {
  ctx.setLineDash([]);
//  ctx.lineDashOffset=t;
}
*/

//if (i==0) ctx.lineWidth=8; else ctx.lineWidth=2;
//ctx.lineWidth=30-6*i;
//ctx.strokeStyle=colors[i%colors.length];
//if (i==4) ctx.strokeStyle="red";
//else ctx.strokeStyle="white";
ctx.strokeStyle=colors[i%colors.length];
ctx.lineWidth=50;
  ctx.lineDashOffset=ldf[i]*t+ldo[i];
  ctx.stroke(p);

ctx.strokeStyle="black"; //colors[(i+1)%colors.length];
ctx.lineWidth=28;
ctx.lineDashOffset=ldf2[i]*t+ldo2[i];
ctx.stroke(p);

ctx.strokeStyle=colors[(i+1)%colors.length];
ctx.lineWidth=20;
ctx.lineDashOffset=ldf3[i]*t+ldo3[i];
ctx.stroke(p);

/*
let p=new Path2D(dpath);
p.addPath(p,new DOMMatrix([-1,0,0,1,0,0]));
p.addPath(p,new DOMMatrix([-1,0,0,-1,0,0]));
  ctx.stroke(p);
*/
  }

/*
ctx.globalAlpha=0.8;
ctx.lineWidth=24;
ctx.strokeStyle="black";
  ctx.stroke(p2);
ctx.lineWidth=1;
ctx.strokeStyle=colors[0];
  ctx.stroke(p2);
*/

  ctx.setLineDash([]);
  ctx.lineWidth=2;
  ctx.strokeStyle="silver";
  ctx.stroke(p2);
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
var t=0;
var s=0;
var frac=0;
function animate(ts) {
  if (stopped) return;
  t++;
  frac=(1+Math.sin(3*TP/4+t*TP/300))/2;
  if (t%150==0) {
    s=++s%2;
    setRadii(radii);
    setLines(s?lset:lset2);
    if (Math.random()<0.1) colors=getColors();
  }
  setPaths();
  draw();
  requestAnimationFrame(animate);
}

onresize();

setLines(lset);
setLines(lset2);
setPaths();
colors=getColors();

//var reset=()=>{ setColors(); }
//reset();

//draw();
start();
