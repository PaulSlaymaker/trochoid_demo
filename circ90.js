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
  const CBASE=192;
  const CT=256-CBASE;
  this.getRGB=(o)=>{
    let adj=60*(TRICOUNT-o)/TRICOUNT;
    let red=Math.round(CBASE-adj+CT*Math.cos(o*this.RK3+this.RK2+c/this.RK1));
    let grn=Math.round(CBASE-adj+CT*Math.cos(o*this.GK3+this.GK2+c/this.GK1));
    let blu=Math.round(CBASE-adj+CT*Math.cos(o*this.BK3+this.BK2+c/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=200+800*Math.random();
    this.GK1=200+800*Math.random();
    this.BK1=200+800*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.RK3=Math.random()/2;
    this.GK3=Math.random()/2;
    this.BK3=Math.random()/2;
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

ctx.font="10px sans-serif";
ctx.textAlign="center";
ctx.fillStyle="white";

function Point(i,j,r) {
  const B1=TP/6+0.001; 
  const B2=TP/3-0.001; 
  this.i=i;
  this.j=j;
  if (j%2) this.x=i*r+r/2;
  else this.x=i*r;
  this.y=S6*j*r;
  if (j==0) this.b=false;
  else this.b=(Math.atan2(this.y,this.x)>B1 || Math.atan2(this.y,this.x-360)<B2);
}

var createPointArrays=()=>{
  let ra=[120,40,15];
  let ks=[];
  for (let i=0; i<ra.length; i++) {
    let pa=[], fpa=[];
    for (let j=0; j<CSIZE/ra[i]+1; j++) {
      pa[j]=[];
      for (let k=0; k<CSIZE/(ra[i]*S6); k++) {
        pa[j][k]=new Point(j,k,ra[i]);
        if (!pa[j][k].b) fpa.push(pa[j][k]);
      }
    }
    ks.push({"R":ra[i],"count":CSIZE/ra[i]+1,"pa":pa,"fpa":fpa});
  }
  return ks;
}
var kseta=createPointArrays();

function Triangle(p1,p2,p3,type) {
/*
  this.path=new Path2D();
  this.path.moveTo(p1.x,p1.y);	// TODO? randomize
  this.path.lineTo(p2.x,p2.y);	// TODO? randomize
  this.path.lineTo(p3.x,p3.y);	// TODO? randomize
  this.path.closePath();
  this.path2=new Path2D();
  this.path2.moveTo((p1.x+p2.x)/2,(p1.y+p2.y)/2);
  this.path2.quadraticCurveTo(p2.x,p2.y,(p2.x+p3.x)/2,(p2.y+p3.y)/2);
  this.path2.quadraticCurveTo(p3.x,p3.y,(p3.x+p1.x)/2,(p3.y+p1.y)/2);
  this.path2.quadraticCurveTo(p1.x,p1.y,(p1.x+p2.x)/2,(p1.y+p2.y)/2);
  this.path2.closePath();
*/
  this.p1=p1;
  this.p2=p2;
  this.p3=p3;
  this.td=getRandomInt(0,tdiff);
  this.td2=Math.max(0,Math.min(tdiff,this.td+(getRandomInt(-20,20))));
  this.td3=Math.max(0,Math.min(tdiff,this.td+(getRandomInt(-20,20))));
  //if (type=="d") this.td4=Math.max(0,Math.min(tdiff,this.td+(getRandomInt(-20,20))));
}

function Diamond(p1,p2,p3,p4) {
  this.path=new Path2D();
  this.path.moveTo(p1.x,p1.y);	// TODO? randomize
  this.path.lineTo(p2.x,p2.y);	// TODO? randomize
  this.path.lineTo(p3.x,p3.y);	// TODO? randomize
  this.path.closePath();
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

var pauseTS=1000;
var pause=(ts)=>{
  if (EM) return;
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var DUR=100;
var tdiff=80;
var t=0;
var c=0;

var animate=(ts)=>{
  if (stopped) return;
  t++,c++;
  if (t>DUR+tdiff) {
    t=0;
    ta=ta2;
    ta2=getRandomTriangleArray();
    pauseTS=performance.now()+2000;
    requestAnimationFrame(pause);
    return;
  }
  draw();
  requestAnimationFrame(animate);
}

function cFrac(frac) {
  let f1=.1;
  let f2=.9;
  let e2=3*frac*Math.pow(1-frac,2)*f1;
  let e3=3*(1-frac)*Math.pow(frac,2)*f2;
  let e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var f;
var draw=()=>{
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  //let f=t/DUR;
  //let f=(t<tdiff)?0:(t>DUR+tdiff)?1:cFrac((t-tdiff)/DUR);
  //let f=cFrac((t-tdiff)/DUR);
  //if (f<0) f=0;
  //if (f>1) f=1;
//console.log(f);
  //f=Math.pow(Math.cos(TP/4*t/DUR),2);
  //f=(1+Math.cos(TP/4*t/DUR))/2;
  //f=(1-Math.cos(Math.PI/2*t/DUR));
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE)
  for (let i=0; i<ta.length; i++) {
    let td=ta[i].td;
    let td2=ta[i].td2;
    let td3=ta[i].td3;
    let f=(t<td)?0:(t>DUR+td)?1:cFrac((t-td)/DUR);
    let f2=(t<td2)?0:(t>DUR+td2)?1:cFrac((t-td2)/DUR);
    let f3=(t<td3)?0:(t>DUR+td3)?1:cFrac((t-td3)/DUR);
    let x1=(1-f)*ta[i].p1.x+f*ta2[i].p1.x;
    let y1=(1-f)*ta[i].p1.y+f*ta2[i].p1.y;
    let x2=(1-f2)*ta[i].p2.x+f2*ta2[i].p2.x;
    let y2=(1-f2)*ta[i].p2.y+f2*ta2[i].p2.y;
    let x3=(1-f3)*ta[i].p3.x+f3*ta2[i].p3.x;
    let y3=(1-f3)*ta[i].p3.y+f3*ta2[i].p3.y;

    let p=new Path2D();
    p.moveTo((x1+x2)/2,(y1+y2)/2);
    p.quadraticCurveTo(x2,y2,(x2+x3)/2,(y2+y3)/2);
    p.quadraticCurveTo(x3,y3,(x3+x1)/2,(y3+y1)/2);
    p.quadraticCurveTo(x1,y1,(x1+x2)/2,(y1+y2)/2);
    p.closePath();

    let p2=new Path2D();
    p2.addPath(p,new DOMMatrix([S6,0.5,-0.5,S6,0,0]));	// vert symmetry
    let p3=new Path2D(p2);
    p3.addPath(p2,new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]));
    p3.addPath(p2,new DOMMatrix([-0.5,-S6,S6,-0.5,0,0]));
    p3.addPath(p3,dmx);
ctx.setTransform(1,0,0,1,CSIZE+2,CSIZE+2);
    ctx.strokeStyle="#00000016";
    ctx.lineWidth=10;
    ctx.stroke(p3);
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
    ctx.fillStyle=color.getRGB(i);
    ctx.fill(p3);
    ctx.strokeStyle="black";
    ctx.lineWidth=1;
    ctx.stroke(p3);
  }
}

onresize();

var df0=(tp,ks)=>{
  let pta=[];
  for (let cr=1; cr<ks.count; cr++) {
    let id=tp.i+cr;
    if (id>=ks.count) return pta;
    let tp2=ks.pa[id][tp.j];
    if (tp2.b) return pta;
    pta.push(tp2);
//drawPoint(tp2.x,tp2.y,"magenta");
  }
  return pta;
}

var df1=(tp,ks)=>{
  let pta=[];
  for (let cr=1; cr<ks.count; cr++) {
    let id=(cr%2)?tp.i-((tp.j+cr)%2)+(cr+cr%2)/2:tp.i+cr/2;
    if (id>=ks.count) return pta;
    let jd=tp.j+cr;
    if (jd>=ks.count) return pta;
    let tp2=ks.pa[id][jd];
    if (tp2.b) return pta;
    pta.push(tp2);
  }
  return pta;
}

var df2=(tp,ks)=>{
  let pta=[];
  for (let cr=1; cr<ks.count; cr++) {
    //let id=(cr%2)?tp.i-((tp.j+cr)%2)+(cr+cr%2)/2:tp.i+cr/2;
    let id=(cr%2)?tp.i+((((tp.j+cr)%2)==0)?1:0)-(cr+cr%2)/2:tp.i-cr/2;
    if (id<0) return pta;
    let jd=tp.j+cr;
    if (jd>=ks.count) return pta;
    let tp2=ks.pa[id][jd];
    if (tp2.b) return pta;
    pta.push(tp2);
  }
  return pta;
}

var df3=(tp,ks)=>{
  let pta=[];
  for (let cr=1; cr<ks.count; cr++) {
    let id=tp.i-cr;
    if (id<0) return pta;
    let tp2=ks.pa[id][tp.j];
    if (tp2.b) return pta;
    pta.push(tp2);
  }
  return pta;
}

var df4=(tp,ks)=>{
  let pta=[];
  for (let cr=1; cr<ks.count; cr++) {
    //let id=(cr%2)?tp.i+((tp.j+cr)%2)-(cr+cr%2)/2:tp.i-cr/2;
    let id=(cr%2)?tp.i+((((tp.j+cr)%2)==0)?1:0)-(cr+cr%2)/2:tp.i-cr/2;
    if (id<0) return pta;
    let jd=tp.j-cr;
    if (jd<0) return pta;
    let tp2=ks.pa[id][jd];
    if (tp2.b) return pta;
    pta.push(tp2);
  }
  return pta;
}

var df5=(tp,ks)=>{
  let pta=[];
  for (let cr=1; cr<ks.count; cr++) {
    let id=(cr%2)?tp.i-((((tp.j+cr)%2)==0)?0:1)+(cr+cr%2)/2:tp.i+cr/2;
    if (id>=ks.count) return pta;
    let jd=tp.j-cr;
    if (jd<0) return pta;
    let tp2=ks.pa[id][jd];
    if (tp2.b) return pta;
    pta.push(tp2);
  }
  return pta;
}
var df=[df0,df1,df2,df3,df4,df5];

var testX=()=>{
let cr=1;
//let i2=tp.i+tp.j%2;
//let i2=tp.i+((((tp.j+cr)%2)==0)?1:0)-(cr+cr%2)/2;
let i2=(cr%2)?tp.i-((tp.j+cr)%2)+(cr+cr%2)/2:tp.i+cr/2;
//let i2=tp.i+(cr+cr%2)/2;
let j2=tp.j+cr;
if (i2<0) return false;
let tp2=pa[i2][j2];
drawPoint(tp2.x,tp2.y,"aqua");
/*
cr=2;
//i2=tp.i+tp.j%2+(cr+cr%2)/2;
//i2=tp.i+(cr+cr%2)/2;
i2=tp.i-cr/2;
j2=tp.j+cr;
if (i2<0) return false;
tp2=pa[i2][j2];
drawPoint(tp2.x,tp2.y,"green");
cr=3;
//i2=tp.i+((tp.j%2==0)?-1:0)+(cr+cr%2)/2;
//i2=tp.i+(((tp.j+cr)%2==0)?0:-1)+(cr+cr%2)/2;
i2=tp.i-((tp.j+cr)%2)+(cr+cr%2)/2;
//console.log(i2);
j2=tp.j+cr;
tp2=pa[i2][j2];
drawPoint(tp2.x,tp2.y,"yellow");
cr=4;
i2=tp.i+cr/2;
j2=tp.j+cr;
tp2=pa[i2][j2];
drawPoint(tp2.x,tp2.y,"magenta");
*/
  return true;
}

//for (let i=0; i<fpa.length; i++) { drawPoint(fpa[i].x,fpa[i].y,"yellow",2); }


var getRandomTriangle=(ks)=>{
  let ta=[];
  let tp=ks.fpa[getRandomInt(0,ks.fpa.length)];
  let ridx=getRandomInt(0,6);
  for (let i=0; i<6; i++) {
    let id=(ridx+i)%6;
    let a1=df[id](tp,ks);
    if (a1.length==0) continue;
    let id1=(ridx+i+1)%6;
    let a2=df[id1](tp,ks);
    if (a2.length==0) continue;
    let len=Math.min(a1.length,a2.length);
    for (let j=0; j<len; j++) {
      ta.push(new Triangle(tp,a1[j],a2[j]));
    }
    break;
  }
  return ta[getRandomInt(0,ta.length)];
}

var TRICOUNT=38;
var getRandomTriangleArray=()=>{
  let ks=kseta[[1,1,0,2][getRandomInt(0,4,true)]];
  var tri0=new Triangle(ks.pa[0][0],ks.pa[0][0],ks.pa[0][0],"t");
//let cc=[0,0,0,10,20,30][getRandomInt(0,6,true)];
  let cc=Math.round(20*Math.pow(Math.random(),5));
//console.log(cc);
  let tar=[];
  for (let i=0; i<TRICOUNT; i++) {
    if (i<cc) { tar.push(tri0); continue; }
    tar.push(getRandomTriangle(ks));
  }
  return tar;
}

var ta=getRandomTriangleArray();
var ta2=getRandomTriangleArray();

var drawT=()=>{	// diag
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  for (let i=0; i<ta.length; i++) {
    let p=new Path2D();
    //p.addPath(getRandomTriangle().path,new DOMMatrix([S6,0.5,-0.5,S6,0,0]));
//p.addPath(getRandomTriangle().path2,new DOMMatrix([S6,0.5,-0.5,S6,0,0]));
    p.addPath(ta[i].path2,new DOMMatrix([S6,0.5,-0.5,S6,0,0]));	// vert symmetry
    let p2=new Path2D(p);
    p2.addPath(p,new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]));
    p2.addPath(p,new DOMMatrix([-0.5,-S6,S6,-0.5,0,0]));
    p2.addPath(p2,dmx);
ctx.strokeStyle="#00000010";
ctx.lineWidth=12;
ctx.stroke(p2);
    ctx.fillStyle=color.getRGB(i);
    ctx.fill(p2);
    ctx.strokeStyle="black";
ctx.lineWidth=1;
    ctx.stroke(p2);
  }
}

var drawPoints=()=>{
for (let i=0; i<kseta[0].pa.length; i++) {
  for (let j=0; j<kseta[0].pa[i].length; j++) {
    drawPoint(kseta[0].pa[i][j].x,kseta[0].pa[i][j].y);
  }
}
}

start();

// cr limit
// tri draw, vane,line,circ,fill
// variable/skewed triangle drawing durations, ?size-based, ?distance-based
// radial switch
// multi-shape
