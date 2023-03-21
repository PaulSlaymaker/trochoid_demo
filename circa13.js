"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/yLxqyWJ
const body=document.getElementsByTagName("body").item(0);
const EM=location.href.endsWith("em");
body.style.background="#000";
const TP=2*Math.PI;
const CSIZE=350;

const ctx=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
//c.style.outline="1px dotted gray";
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";
ctx.clip(ctx.rect(-CSIZE+20,-CSIZE+20,2*CSIZE-40,2*CSIZE-40));

const ctx2=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
ctx2.translate(CSIZE,CSIZE);

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="0 auto";
  co.append(ctx2.canvas);
  co.append(ctx.canvas);
  body.append(co);
  return co;
})();

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.width=ctx.canvas.style.height=D+"px";
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
  ctx2.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var colors=[];
var setColors=()=>{
  colors=[];
  let colorCount=4;
  let h=getRandomInt(180,300);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(150/colorCount)*i+getRandomInt(-10,10);
    let hue=(h+hd)%360;
    colors.push("hsl("+hue+",98%,60%)");
if (i%2) colors.push("black");
  }
}
setColors();
ctx.globalAlpha=0.7;

function Path() {
  this.sa=new Array();
  this.path=new Path2D();
  this.len=0;
  this.width=4+48*Math.random();
  this.t=-480*Math.random();
  this.col=colors[getRandomInt(0,colors.length)];
  this.inc=0.1+Math.random()/3;
  this.dash=[getRandomInt(1,Math.round(-this.t)),100000];
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
ctx.canvas.addEventListener("click", start, false);

var c=0;
var animate=(ts)=>{
  if (stopped) return;
  for (let i=0; i<count; i++) {
    pa[i].t+=1+pa[i].inc;
    if (pa[i].t>pa[i].len+2*pa[i].width) {
//      pa[i]=new Path();
      generate(pa[i]=new Path());
    }
  }
if (EM && ++c%100==0) stopped=true;
  draw();
  requestAnimationFrame(animate);
}

const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmz=new DOMMatrix([-1,0,0,-1,0,0]);
const dm1=new DOMMatrix([0,1,-1,0,0,0]);
//const dm2=new DOMMatrix([1,0,0,-1,0,0]);
//const dm3=new DOMMatrix([0,-1,1,0,0,0]);

const R=2*CSIZE/7;

var e1i={"type":"line","x1":0,         "y1":-CSIZE,    "x2":0,         "y2":-CSIZE+R/2};
var e2i={"type":"line","x1":CSIZE,     "y1":0,         "x2":CSIZE-R/2, "y2":0};
var e3i={"type":"line","x1":0,         "y1":CSIZE,     "x2":0,         "y2":CSIZE-R/2};
var e4i={"type":"line","x1":-CSIZE,    "y1":0,         "x2":-CSIZE+R/2,"y2":0};
var e1o={"type":"line","x1":0,         "y1":-CSIZE+R/2,"x2":0,         "y2":-CSIZE};
var e2o={"type":"line","x1":CSIZE-R/2, "y1":0,         "x2":CSIZE,     "y2":0};
var e3o={"type":"line","x1":0,         "y1":CSIZE-R/2, "x2":0,         "y2":CSIZE};
var e4o={"type":"line","x1":-CSIZE+R/2,"y1":0,         "x2":-CSIZE,    "y2":0};

var anir1={"type":"arc","x":R,         "y":-CSIZE+R/2,"a1":TP/2,  "a2":TP/4,"dir":true};
var anir2={"type":"arc","x":CSIZE-R/2, "y":R,         "a1":3*TP/4,"a2":TP/2,"dir":true};
var anir3={"type":"arc","x":-R,        "y":CSIZE-R/2, "a1":0,     "a2":3*TP/4,"dir":true};
var anir4={"type":"arc","x":-CSIZE+R/2,"y":-R,        "a1":TP/4,  "a2":0,"dir":true};
var anil1={"type":"arc","x":-R,        "y":-CSIZE+R/2,"a1":0,     "a2":TP/4,"dir":false};
var anil2={"type":"arc","x":CSIZE-R/2, "y":-R,        "a1":TP/4,  "a2":TP/2,"dir":false};
var anil3={"type":"arc","x":R,         "y":CSIZE-R/2, "a1":TP/2,  "a2":3*TP/4,"dir":false};
var anil4={"type":"arc","x":-CSIZE+R/2,"y":R,         "a1":3*TP/4,"a2":0,"dir":false};

var anor1={"type":"arc","x":R,         "y":-CSIZE+R/2,"a1":TP/4,  "a2":TP/2,"dir":false};
var anor2={"type":"arc","x":CSIZE-R/2, "y":R,         "a1":TP/2,  "a2":3*TP/4,"dir":false};
var anor3={"type":"arc","x":-R,        "y":CSIZE-R/2, "a1":3*TP/4,"a2":0,"dir":false};
var anor4={"type":"arc","x":-CSIZE+R/2,"y":-R,        "a1":0,     "a2":TP/4,"dir":false};
var anol1={"type":"arc","x":-R,        "y":-CSIZE+R/2,"a1":TP/4,  "a2":0,"dir":true};
var anol2={"type":"arc","x":CSIZE-R/2, "y":-R,        "a1":TP/2,  "a2":TP/4,"dir":true};
var anol3={"type":"arc","x":R,         "y":CSIZE-R/2, "a1":3*TP/4,"a2":TP/2,"dir":true};
var anol4={"type":"arc","x":-CSIZE+R/2,"y":R,         "a1":0,     "a2":3*TP/4,"dir":true};

/*
var cp11={"type":"arc","x":R, "y":-R,"a1":3*TP/4,"a2":0,"dir":false};
var cp12={"type":"arc","x":R, "y":-R,"a1":0,     "a2":TP/4,"dir":false};
var cp13={"type":"arc","x":R, "y":-R,"a1":TP/4,  "a2":TP/2,"dir":false};
var cp14={"type":"arc","x":R, "y":-R,"a1":TP/2,  "a2":3*TP/4,"dir":false};
var cp21={"type":"arc","x":R, "y":R, "a1":3*TP/4,"a2":0,"dir":false};
var cp22={"type":"arc","x":R, "y":R, "a1":0,     "a2":TP/4,"dir":false};
var cp23={"type":"arc","x":R, "y":R, "a1":TP/4,  "a2":TP/2,"dir":false};
var cp24={"type":"arc","x":R, "y":R, "a1":TP/2,  "a2":3*TP/4,"dir":false};
var cp31={"type":"arc","x":-R,"y":R, "a1":3*TP/4,"a2":0,"dir":false};
var cp32={"type":"arc","x":-R,"y":R, "a1":0,     "a2":TP/4,"dir":false};
var cp33={"type":"arc","x":-R,"y":R, "a1":TP/4,  "a2":TP/2,"dir":false};
var cp34={"type":"arc","x":-R,"y":R, "a1":TP/2,  "a2":3*TP/4,"dir":false};
var cp41={"type":"arc","x":-R,"y":-R,"a1":3*TP/4,"a2":0,"dir":false};
var cp42={"type":"arc","x":-R,"y":-R,"a1":0,     "a2":TP/4,"dir":false};
var cp43={"type":"arc","x":-R,"y":-R,"a1":TP/4,  "a2":TP/2,"dir":false};
var cp44={"type":"arc","x":-R,"y":-R,"a1":TP/2,  "a2":3*TP/4,"dir":false};
*/

for (let i=0; i<4; i++) {
  let arcs1=[3*TP/4,0,TP/4,TP/2];
  let arcs2=[0,TP/4,TP/2,3*TP/4];
  let x=[R,R,-R,-R][i];
  let y=[-R,R,R,-R][i];
  for (let j=0; j<4; j++) {
//    let a1=arcs1[j]; let a2=arcs2[j];
    window["cp"+(i+1)+(j+1)]={"type":"arc","x":x, "y":y,"a1":arcs1[j],"a2":arcs2[j],"dir":false};
    window["cn"+(i+1)+(j+1)]={"type":"arc","x":x, "y":y,"a1":arcs2[3-j],"a2":arcs1[3-j],"dir":true};
  }
}

/*
for (let i=0; i<4; i++) {
  let arcs1=[3*TP/4,0,TP/4,TP/2];
  let arcs2=[0,TP/4,TP/2,3*TP/4];
  let x=[R,R,-R,-R][i];
  let y=[-R,R,R,-R][i];
  for (let j=0; j<4; j++) {
    //let a1=[3*TP/4,TP/2,TP/4,0][j];
    //let a2=[TP/2,TP/4,0,3*TP/4][j];
//    let a1=arcs2[3-j];
//    let a2=arcs1[3-j];
    window["cn"+(i+1)+(j+1)]={"type":"arc","x":x, "y":y,"a1":arcs2[3-j],"a2":arcs1[3-j],"dir":true};
  }
}
*/

/*
var cn11={"type":"arc","x":R, "y":-R,"a1":3*TP/4,"a2":TP/2,"dir":true};
var cn12={"type":"arc","x":R, "y":-R,"a1":TP/2,  "a2":TP/4,"dir":true};
var cn13={"type":"arc","x":R, "y":-R,"a1":TP/4,  "a2":0,"dir":true};
var cn14={"type":"arc","x":R, "y":-R,"a1":0,     "a2":3*TP/4,"dir":true};
var cn21={"type":"arc","x":R, "y":R, "a1":3*TP/4,"a2":TP/2,"dir":true};
var cn22={"type":"arc","x":R, "y":R, "a1":TP/2,  "a2":TP/4,"dir":true};
var cn23={"type":"arc","x":R, "y":R, "a1":TP/4,  "a2":0,"dir":true};
var cn24={"type":"arc","x":R, "y":R, "a1":0,     "a2":3*TP/4,"dir":true};
var cn31={"type":"arc","x":-R,"y":R, "a1":3*TP/4,"a2":TP/2,"dir":true};
var cn32={"type":"arc","x":-R,"y":R, "a1":TP/2,  "a2":TP/4,"dir":true};
var cn33={"type":"arc","x":-R,"y":R, "a1":TP/4,  "a2":0,"dir":true};
var cn34={"type":"arc","x":-R,"y":R, "a1":0,     "a2":3*TP/4,"dir":true};
var cn41={"type":"arc","x":-R,"y":-R,"a1":3*TP/4,"a2":TP/2,"dir":true};
var cn42={"type":"arc","x":-R,"y":-R,"a1":TP/2,  "a2":TP/4,"dir":true};
var cn43={"type":"arc","x":-R,"y":-R,"a1":TP/4,  "a2":0,"dir":true};
var cn44={"type":"arc","x":-R,"y":-R,"a1":0,     "a2":3*TP/4,"dir":true};
console.log(cn44=={"type":"arc","x":-R,"y":-R,"a1":0,     "a2":3*TP/4,"dir":true});
console.log(cn44);
console.log({"type":"arc","x":-R,"y":-R,"a1":0,     "a2":3*TP/4,"dir":true});
*/

e1i.p=[anir1,anil1];
e4i.p=[anir4,anil4];
anir1.p=[cp11];
anir4.p=[cp44];
anil1.p=[cn41];
anil4.p=[cn32];
anor1.p=[e1o];
anor2.p=[e2o];
anor3.p=[e3o];
anor4.p=[e4o];
anol1.p=[e1o];
anol2.p=[e2o];
anol3.p=[e3o];
anol4.p=[e4o];
cp11.p=[cp12,anol2];
cp12.p=[cp13,cn21];
cp13.p=[cp14,cn44];
cp14.p=[cp11];
cp21.p=[cp22];
cp22.p=[cp23,anol3];
cp23.p=[cp24,cn34];
cp24.p=[cp21,cn13];
cp31.p=[cp32,cn22];
cp32.p=[cp33];
cp33.p=[cp34,anol4];
cp34.p=[cp31,cn43];
cp41.p=[cp42,cn12];
cp42.p=[cp43,cn31];
cp43.p=[cp44];
cp44.p=[cp41,anol1];
cn11.p=[cn12,cp42];
cn12.p=[cn13,cp21];
cn13.p=[cn14];
cn14.p=[cn11,anor1];
cn21.p=[cn22,cp32];
cn22.p=[cn23];
cn23.p=[cn24,anor2];
cn24.p=[cn21,cp13];
cn31.p=[cn32];
cn32.p=[cn33,anor3];
cn33.p=[cn34,cp24];
cn34.p=[cn31,cp43];
cn41.p=[cn42,anor4];
cn42.p=[cn43,cp31];
cn43.p=[cn44,cp14];
cn44.p=[cn41];

const bf="#101022";

var drawFrame=()=>{
  let frame=new Path2D();
  frame.moveTo(0,-CSIZE);
  frame.arc(R,-CSIZE+R/2,R,TP/2,TP/4,true);
  frame.moveTo(CSIZE,0);
  frame.arc(CSIZE-R/2,-R,R,TP/4,TP/2);
  frame.arc(R,-R,R,0,TP);
  frame.addPath(frame,dmy); 
  frame.addPath(frame,dmx); 
  ctx2.lineWidth=124;
  ctx2.strokeStyle=bf;
  ctx2.stroke(frame);
  ctx2.lineWidth=60;
  ctx2.strokeStyle="#888888";
  ctx2.stroke(frame);
  ctx2.lineWidth=52;
  ctx2.strokeStyle="black";
  ctx2.stroke(frame);
  ctx2.strokeStyle=bf;
  ctx2.lineWidth=30;
  ctx2.arc(0,0,CSIZE-10,0,TP);
  ctx2.stroke();
}

/*
var testSeg2=(seg)=>{
  ctx.arc(seg.x,seg.y,R,seg.a1,seg.a2,seg.dir);
  ctx.lineWidth=2;
  ctx.strokeStyle="red";
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.setLineDash([1,100000]);
  ctx.lineWidth=12;
  ctx.strokeStyle="green";
  ctx.stroke();
}
*/

var generate=(seg)=>{
  const AL=Math.PI*R/2;
  seg.sa.push(e4i);
  seg.path.moveTo(e4i.x1,e4i.y1);
  seg.path.lineTo(e4i.x2,e4i.y2);
  seg.len=R/2;
  while (seg.sa[seg.sa.length-1].p) {
    if (seg.sa[seg.sa.length-1].p.length==1) {
      let p=seg.sa[seg.sa.length-1].p[0];
      seg.sa.push(p);
      if (p.type=="arc") {
        seg.path.arc(p.x,p.y,R,p.a1,p.a2,p.dir);
        seg.len+=AL;
      } else {
        seg.path.lineTo(p.x2,p.y2);
        seg.len+=R/2;
        break;
      }
    } else {
      let p=seg.sa[seg.sa.length-1].p[getRandomInt(0,2)];
      seg.sa.push(p);
      seg.path.arc(p.x,p.y,R,p.a1,p.a2,p.dir);
      seg.len+=AL;
    }
  }
//if (seg.len>5000) console.log(seg.len.toFixed(0));
}

drawFrame();
var count=20;
var pa=new Array(count);
for (let i=0; i<count; i++) {
  pa[i]=new Path();
  generate(pa[i]);
  pa[i].t=100;
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<count; i++) {
    ctx.setLineDash(pa[i].dash);
    ctx.lineDashOffset=-pa[i].t;
    ctx.strokeStyle=pa[i].col;
    ctx.lineWidth=pa[i].width;
    let path=new Path2D(pa[i].path);
/*
    path.addPath(path,dmx);
    path.addPath(path,dmy);
*/
    path.addPath(path,dm1);
    path.addPath(path,dmz);
    path.addPath(path,dmx);
    ctx.stroke(path);
//    ctx.stroke(pa[i].path);
  }
}

onresize();

start();
