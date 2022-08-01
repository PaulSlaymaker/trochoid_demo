"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/rNdwMjK
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
  c.width=2*CSIZE;
  c.height=2*CSIZE;
c.style.outline="1px dotted gray";
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
var getColors=()=>{
  let c=[];
  let colorCount=4;
  let hue=getRandomInt(90,270);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(240/colorCount)*i+getRandomInt(-20,20);
    let sat=70+getRandomInt(0,31);
    let lum=50+getRandomInt(0,11);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}

var Circle=function(x,y) {
  this.x=x;
  this.y=y;
  this.pts=new Array(6);
  this.d=false;
}

var Point=function(x,y,a,cir) {
  this.x=x;
  this.y=y;
  this.c=[{"idx":a,"cir":cir}];
}

var Arc=function(c,a,d) {
  this.circle=c;
  this.angle=a;
  this.dir=d;
  this.p1=this.circle.pts[this.angle];
  this.p2=this.circle.pts[(this.angle+this.dir+6)%6];
}

var Curve=function(idx) {
  this.arcs=[];
  this.setPath=()=>{
    this.path=new Path2D();
    for (let i=0; i<this.arcs.length; i++) {
      this.path.arc(this.arcs[i].circle.x,this.arcs[i].circle.y,radius,this.arcs[i].angle*TP/6, 
          (this.arcs[i].angle+6+this.arcs[i].dir)%6*TP/6, this.arcs[i].dir==-1);
    }
  }
}

var cm;

var fibo=(f,n)=>{
  if (n==0) return f;
  return fibo(f+=n,n-1);
}

var generateHexes=()=>{
  const cos=[1,0.5,-0.5,-1,-0.5,0.5];
  const sin=[0,0.866,0.866,0,-0.866,-0.866];
  cm=new Map();
  let pm=new Map();
  let ra=radius;
  let aCount=Math.trunc(CSIZE/2/ra);
  let cCount=1+6*fibo(0, aCount-1);
  let c=new Circle(0,0);
  cm.set("0,0",c);
  for (let b=0; b<6; b++) {
	  let xz=ra*cos[b];
	  let yz=ra*sin[b];
	  let cb=[Math.round(xz),Math.round(yz)];
	  let np=new Point(xz,yz,b,c);
	  pm.set(cb.toString(),np);
	  c.pts[b]=np;
  }
  cm.forEach((c)=>{
    if (cm.size>=cCount) return;
    for (let a=0; a<6; a++) {
      let xt=ra*cos[a];
      let yt=ra*sin[a];
      let xc=c.x+2*xt;
      let yc=c.y+2*yt;
      let ckey=[Math.round(xc),Math.round(yc)];
      if (!cm.has(ckey.toString())) {
	let nc=new Circle(xc,yc);
	cm.set(ckey.toString(),nc);
	for (let b=0; b<6; b++) {
	  let xz=xc+ra*cos[b];
	  let yz=yc+ra*sin[b];
	  let cb=[Math.round(xz),Math.round(yz)];
	  if (!pm.has(cb.toString())) {
	    let np=new Point(xz,yz,b,nc);
	    pm.set(cb.toString(),np);
	    nc.pts[b]=np;
	  } else {
	    let op=pm.get(cb.toString());
            op.c.push({"idx":b,"cir":nc});
	    nc.pts[b]=op;
	  }
	}
      }
    }
  });
}

/*
var drawPoint=(p,col)=>{	// diag
ctx.beginPath();
ctx.arc(p.x,p.y,4,0,TP);
if (col) ctx.fillStyle=col;
else ctx.fillStyle="red";
ctx.fill();
}

var drawCircles=()=>{
  let p=new Path2D();
  cm.forEach((c)=>{
    p.moveTo(c.x+radius,c.y);
    p.arc(c.x,c.y,radius,0,TP);
  });
ctx.setLineDash([]);
  ctx.lineWidth=1;
  ctx.strokeStyle="#555555";
  ctx.stroke(p);
}
*/

var grow2=(arcs)=>{
  if (arcs.length==0) return false;
  let earc=arcs[arcs.length-1];
  let ci=getRandomInt(0,earc.p2.c.length);
  let njunc=earc.p2.c[ci];
  let jsw=earc.circle==njunc.cir;
  let dirz=jsw?earc.dir:-earc.dir;
  arcs.push(new Arc(njunc.cir, njunc.idx, dirz));
  return true;
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

var s=0;
var t=0;
const timeMultiplier=3;
var tStep=20;//Math.round(radius*TP/6/timeMultiplier);

var animate=()=>{
  if (stopped) return;
  t++;
  if (s++>1000) {
    if (s==1080) {
      reset();
      t=0;
      ctx.canvas.style.opacity=1;
    }
    if (s-1000<80) ctx.canvas.style.opacity=(1080-s)/80;
    else ctx.canvas.style.opacity=(s-1080)/80;
    if (s==1160) { ctx.canvas.style.opacity=1; s=0; }
  }
  if (t==tStep) {
    for (let i=0; i<curves.length; i++) {
	curves[i].arcs.shift();
	grow2(curves[i].arcs);
	t=0;
	curves[i].setPath()
    }
  }
  draw();
  requestAnimationFrame(animate);
}

var getSymPath22=(path)=>{
  const dm1=new DOMMatrix([-1,0,0,-1,0,0]);
  const dm2=new DOMMatrix([1,0,0,-1,0,0]);
  let p=new Path2D(path);
  p.addPath(p,dm1);
  p.addPath(p,dm2);
  return p;
}

var getSymPath6=(path)=>{
  const dm1=new DOMMatrix([-1,0,0,-1,0,0]);
  const dm2=new DOMMatrix([0.5,0.866,-0.866,0.5,0,0]);
  const dm3=new DOMMatrix([-0.5,0.866,-0.866,-0.5,0,0]);
let p=new Path2D(path);
p.addPath(path,dm2);
p.addPath(path,dm3);
p.addPath(p,dm1);
  return p;
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  drawCircles();
  for (let i=0; i<curves.length; i++) {
    ctx.lineDashOffset=-timeMultiplier*t;
    let p=symmetry(curves[i].path);
    //let p=getSymPath22(curves[i].path);
    if (i) {
      ctx.lineWidth=curves[i].lw+3;
      ctx.strokeStyle="#000000AA";
      ctx.stroke(p);
    }
    ctx.lineWidth=curves[i].lw;
    ctx.strokeStyle=colors[i%colors.length];
    ctx.stroke(p);
  }
}

var curves;
var setCurves=()=>{
  let curveCount=5;
  if (cm.size==7) curveCount=6;
  else if (cm.size==91) curveCount=4;
  curves=new Array(curveCount);
  for (let i=0; i<curveCount; i++) curves[i]=new Curve(i);
  let tca=Array.from(cm);
  for (let i=0; i<curves.length; i++) {
    curves[i]=new Curve(i);
    curves[i].arcs[0]=new Arc(tca[getRandomInt(0,tca.length)][1],
			      getRandomInt(0,6),
			      (Math.random()<0.5)?1:-1
			 );
    for (let a=0; a<arcCount; a++) grow2(curves[i].arcs);
    curves[i].setPath();
    curves[i].lw=curveCount*9+3-11*i;
  }
}

var radius=66;//[66,100][getRandomInt(0,2)];
var arcCount=6;
var symmetry=getSymPath22;

var reset=()=>{
  radius=[32,40,50,66,100][getRandomInt(0,5)];
  generateHexes();
  tStep=Math.round(radius*TP/6/timeMultiplier);
  symmetry=[getSymPath22,getSymPath6][getRandomInt(0,2)];
  if (symmetry.name=="getSymPath6") {	// 7,19,37,61,91
    if (cm.size==7) arcCount=getRandomInt(2,4);
    else if (cm.size==19) arcCount=getRandomInt(4,7);
    else if (cm.size==37) arcCount=getRandomInt(6,11);
    else if (cm.size==61) arcCount=getRandomInt(8,14);
    else if (cm.size==91) arcCount=getRandomInt(14,24);	//
    else arcCount=2;
  } else {
    if (cm.size==7) arcCount=getRandomInt(3,7);
    else if (cm.size==19) arcCount=getRandomInt(5,12);
    else if (cm.size==37) arcCount=getRandomInt(9,20);
    else if (cm.size==61) arcCount=getRandomInt(12,25);
    else if (cm.size==91) arcCount=getRandomInt(18,36);
    else arcCount=2;
  }
  setCurves();
  colors=getColors();
  ctx.setLineDash([Math.round((arcCount-1)*radius*TP/6),3000]);	// could be curve specific
  t=0;
}

onresize();

reset();

start();
