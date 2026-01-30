"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S6=Math.sin(TP/6);
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
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=144;
  const CT=256-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1));
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
  this.randomize();
}
const color=new Color();

var drawPoint=(x,y,col,r)=>{	// diag
  ctx.beginPath();
  let rad=r?r:3;
  ctx.arc(x,y,rad,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

function Point(i,j) {
  this.i=i;
  this.j=j;
  this.x=r*i;
  this.y=r*j;
  this.o=false;
}

var pa=[];
let r=36;
let R=r;
for (let i=0; i<CSIZE/r; i++) {
  pa[i]=[];
  for (let j=0; j<CSIZE/r; j++) {
    pa[i][j]=new Point(i,j);
  }
}

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dm2=new DOMMatrix([0,1,-1,0,0,0]);

function Shape(pt,cra) {
  this.path=new Path2D(); 
  for (let i=0; i<cra.length; i++) {
    let p=new Path2D();
    p.moveTo(pt.x,pt.y);
    let r=cra[i]*R+R/2-2;
    if (i==0) p.lineTo(pt.x+r,pt.y);
    else if (i==1) p.lineTo(pt.x,pt.y+r);
    else if (i==2) p.lineTo(Math.max(0,pt.x-r),pt.y);
    else if (i==3) p.lineTo(pt.x,Math.max(0,pt.y-r));
/*
    if (i>1) r=-r;
    if (i%2) p.lineTo(pt.x,pt.y+r);
    else p.lineTo(pt.x+r,pt.y);
*/
    this.path.addPath(p);
  }
  this.path.addPath(this.path,dmx);
  this.path.addPath(this.path,dmy);
  if (sym) this.path.addPath(this.path,dm2);
  pt.o=true;
  for (let i=1; i<=cra[0]; i++) pa[pt.i+i][pt.j].o=true;
  for (let i=1; i<=cra[1]; i++) pa[pt.i][pt.j+i].o=true;
  for (let i=1; i<=cra[2]; i++) pa[pt.i-i][pt.j].o=true;
  for (let i=1; i<=cra[3]; i++) pa[pt.i][pt.j-i].o=true;
  this.len=Math.max(...cra);
//  if (this.len==0) this.td=getRandomInt(0,CSIZE-r);
//  else this.td=getRandomInt(0,tdiff);
    this.td=getRandomInt(0,CSIZE-(1+this.len)*r);
// ? max=CSIZE/r-1
}

var drawPoints=()=>{	// diag
  for (let i=0; i<CSIZE/r; i++) {
    for (let j=0; j<CSIZE/r; j++) {
let col=pa[i][j].o?"blue":"";
      drawPoint(pa[i][j].x,pa[i][j].y,col);
    }
  }
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var pauseTS=1000;
var pause=(ts)=>{
  if (EM) { parent.postMessage("lf"); return; }
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var DUR=360;
var t=0;
var c=0;
var re=0;

var animate=(ts)=>{
  if (stopped) return;
  //t++,c++;
  t+=2,c++;
  if (t>DUR) {
    t=0;
    re=(re+1)%2;
    if (re==0) {
      sym=(Math.random()<0.5)?1:0;
      sa=getRandomShapeArray();
      color.randomize();
    } else {
pauseTS=performance.now()+2000;
requestAnimationFrame(pause);
return;
    }
    //stopped=true;
  }
  if (re) erase();
  else draw();
  requestAnimationFrame(animate);
}

onresize();

var getRandomPoint=()=>{
  let ridx=getRandomInt(0,pa.length);
  for (let i=0; i<pa.length; i++) {
    let idx=(i+ridx)%pa.length;
    let rjdx=getRandomInt(0,pa.length);
    for (let j=0; j<pa.length; j++) {
      let jdx=(j+rjdx)%pa.length;
      if (pa[idx][jdx].o) continue;
      return pa[idx][jdx];
    }
  }
  return false;
}

var getFitCR=(pt)=>{
  let dira=[];
  for (let i=1; i<CSIZE/r+1; i++) if (pt.i+i>=CSIZE/r || pa[pt.i+i][pt.j].o) { dira[0]=i-1; break; }
  for (let i=1; i<CSIZE/r+1; i++) if (pt.j+i>=CSIZE/r || pa[pt.i][pt.j+i].o) { dira[1]=i-1; break; }
  for (let i=1; i<CSIZE/r+1; i++) if (pt.i-i<0        || pa[pt.i-i][pt.j].o) { dira[2]=i-1; break; }
  for (let i=1; i<CSIZE/r+1; i++) if (pt.j-i<0        || pa[pt.i][pt.j-i].o) { dira[3]=i-1; break; }
  return [
    dira[0]-getRandomInt(0,dira[0],true),
    dira[1]-getRandomInt(0,dira[1],true),
    dira[2]-getRandomInt(0,dira[2],true),
    dira[3]-getRandomInt(0,dira[3],true)
  ];
}

var clearPoints=()=>{ 
  for (let i=0; i<CSIZE/r; i++) for (let j=0; j<CSIZE/r; j++) {
    pa[i][j].o=false; 
  }
}

var clearPoints2=()=>{ 
  for (let i=0; i<CSIZE/r; i++) for (let j=0; j<CSIZE/r; j++) {
    if (j>i) pa[i][j].o=true; 
    else pa[i][j].o=false; 
  }
}

var sym=0;

var getRandomShapeArray=()=>{
  if (sym) clearPoints2();
  else clearPoints();
  let arr=[];
  for (let k=0; k<100; k++) {
    let pt=getRandomPoint();
    if (pt==false) break;
    let cra=getFitCR(pt);
    arr.push(new Shape(pt,cra));
  }
  return arr;
}

var sa=getRandomShapeArray();

ctx.setLineDash([2,1000]);
var draw=()=>{
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE)
  ctx.lineWidth=r-4;
  for (let i=0; i<sa.length; i++) {
    ctx.lineDashOffset=-t+sa[i].td;
    ctx.strokeStyle=color.getRGB();
    ctx.stroke(sa[i].path);
  }
}

var erase=()=>{
  ctx.strokeStyle="black";
  ctx.lineWidth=r;
  ctx.lineDashOffset=t-DUR;
  for (let i=0; i<sa.length; i++) {
    ctx.stroke(sa[i].path);
  }
}

draw();
start();
//drawPoints();

