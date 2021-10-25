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
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=0;
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

var colors=[];
var getColors=()=>{
  let c=[];
  //let colorCount=Math.random()<0.5?2:4;
  //let colorCount=[2,3,6][getRandomInt(0,3)];
  let colorCount=getRandomInt(3,7);
let hr=Math.round(90/colorCount);
  //let hue=getRandomInt(0,90,true)+30;
  let hue=30;
  let colorSeg=Math.round(360/colorCount);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-hr,hr);
    let sat=60+getRandomInt(0,31);
    //let lum=40+getRandomInt(0,41);
    //let lum=40+20*Math.pow(Math.cos((hue+60)*TP/360),2);
    let col=(hue+hd)%360;
    let lum=Math.round(30+40*Math.pow(Math.sin((col+90)*TP/360),2));
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+col+","+sat+"%,"+lum+"%)");
  }
  return c;
}

//var radius=getRandomInt(20,30);
//var radius=getRandomInt(8,30);
//var radius=getRandomInt(8,16);
//var radius=getRandomInt(4,15,true);
//var radius=getRandomInt(3,15,true);
var radius=5;

var axisCount=Math.trunc(CSIZE/2/radius);

var circlesMap=new Map();

var circleXSet=new Set();
var circleYSet=new Set();

const cos=[1,0.5,-0.5,-1,-0.5,0.5];
const sin=[0,0.866,0.866,0,-0.866,-0.866];

var Circle=function(x,y) {
  this.x=x;
  this.y=y;
  this.er=Math.pow(x*x+y*y,0.5);
  this.circ=[];
  this.d=false;

  if (x==0 && y==0) {
    this.ckeys=[];
  } else {
    let angle=Math.atan(y/x);
    let x1=Math.round(this.er*Math.cos(angle+TP/6));
    let y1=Math.round(this.er*Math.sin(angle+TP/6));
    let x2=Math.round(this.er*Math.cos(angle+TP/3));
    let y2=Math.round(this.er*Math.sin(angle+TP/3));
    this.ckeys=[
      [Math.round(x),Math.round(y)],
      [Math.round(-x),Math.round(y)],
      [Math.round(-x),Math.round(-y)],
      [Math.round(x),Math.round(-y)],
      [Math.round(x1),Math.round(y1)],
      [Math.round(-x1),Math.round(y1)],
      [Math.round(-x1),Math.round(-y1)],
      [Math.round(x1),Math.round(-y1)],
      [Math.round(x2),Math.round(y2)],
      [Math.round(-x2),Math.round(y2)],
      [Math.round(-x2),Math.round(-y2)],
      [Math.round(x2),Math.round(-y2)],
    ];
  }

  circleXSet.add(x);
  circleYSet.add(y);

  this.draw=()=>{
    ctx.moveTo(this.x+radius*0.7,this.y);
    ctx.arc(this.x,this.y,radius*0.7,0,TP);
  }

  this.drawHex=()=>{
//let r2=1.06*radius;
let r2=0.9*radius;
    ctx.moveTo(this.x,this.y+r2);
    for (let i=1; i<6; i++) {
      let z=i*TP/6;
      ctx.lineTo(this.x+r2*Math.sin(z),this.y+r2*Math.cos(z));
    }
    ctx.moveTo(this.x,this.y+r2);
  }

  this.drawArc=(a)=>{
    let z=a*TP/6;
//console.log(this.x+radius*Math.cos(z));
//console.log(this.y+radius*Math.sin(z));
let xx=this.x+radius*Math.cos(z);
let yy=this.y+radius*Math.sin(z);
    ctx.moveTo(xx,yy);
    ctx.arc(this.x,this.y,radius,z,z+TP/6);
  }
}

//var Line=function(x1,y1,x2,y2) { this.x1=x1; this.y1=y1; this.x2=x2; this.y2=y2; }

var Path=function(circleArray,idx) {
  this.ca=circleArray;
//  this.la=[];
  this.mi=true;
  this.fixed=false;
  this.dir=getRandomInt(0,6);
  this.dirc=getRandomInt(0,6);
  this.idx=idx;  // color only, bring color back?
}

var grow2=(po)=>{
  if (po.fixed) return false;
  let pa=po.ca;
  if (!po.mi) return false;
for (let p=0; p<pa.length; p++) {
    let pc=pa[pa.length-p-1];
    //let pc=pa[pa.length-1];
    for (let i=0; i<6; i++) {
      //let s1=i;
      let s1=(i+po.dir)%6;
      let pcirc=pc.circ[s1];
      if (!pcirc || pcirc.d) continue;  // step out pc.circ[s1].circ[s1?]
      for (let i=0; i<pcirc.ckeys.length; i++) {
        let ec=circlesMap.get(pcirc.ckeys[i].toString());
if (ec==undefined) {
  console.log(pcirc.ckeys[i]);
  debugger;
}
        ec.d=true;
        pa.push(ec);
      }
      po.dir=(po.dir+k)%6;
      return true;
    }
  }
  po.mi=false;
  return false;
} // end of grow2

/*
var grow=(po)=>{
  if (po.fixed) return false;
  let pa=po.ca;
  if (!po.mi) {
    return false;
  }
for (let p=0; p<pa.length; p++) {
    let pc=pa[pa.length-p-1];
    //let pc=pa[pa.length-1];
    for (let i=0; i<6; i++) {
      //let s1=i;
      let s1=(i+po.dir)%6;
//let s1=(i%2==0)?(i+po.dir)%6:(i+po.dir+3)%6;
//let tcirc=pc.circ[s1];  // alternate link levels
//if (!tcirc) continue;
//let t2circ=tcirc.circ[s1];
//if (!t2circ) continue;
//let pcirc=tcirc.circ[(s1+1)%6];	
      let pcirc=pc.circ[s1];
      //let pcirc=tcirc.circ[s1];
      //if (!pc.circ[s1] || pc.circ[s1].d) continue;  // step out pc.circ[s1].circ[s1?]
      if (!pcirc || pcirc.d) continue;  // step out pc.circ[s1].circ[s1?]
      pcirc.d=true;
pa.push(pcirc);
//po.dir=(po.dir+po.dirc)%6;	// set a f(pa.length)
po.dir=(po.dir+k)%6;
//po.la.push(new Line(pc.x,pc.y,pc.circ[s1].x,pc.circ[s1].y));
      return true;
    }
  }
  po.mi=false;
  return false;
} // end of grow
*/

var draw2=()=>{
//  ctx.fillStyle="#00000022";
//  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  let init=center?0:1;
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<paths.length; i++) {
    drawPathEnd(paths[i]);
  }
}

/*
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.beginPath();
  circlesMap.forEach((c)=>{ c.draw(); });
  ctx.strokeStyle=colors[0];
  ctx.stroke();
}
*/

var drawPath=(path)=>{
  ctx.beginPath();
  for (let i=0; i<path.ca.length; i++) {
    path.ca[i].drawHex();
  }
  if (path.idx==0) {
  ctx.fillStyle="gray";
  } else {
  ctx.fillStyle=colors[path.idx%colors.length];
  }
  ctx.fill();
/*
  ctx.beginPath();
//  ctx.globalCompositeOperation="lighter";
  for (let i=0; i<path.la.length; i++) {
    let ln=path.la[i];
    ctx.moveTo(ln.x1,ln.y1);
    ctx.lineTo(ln.x2,ln.y2);
  }
  ctx.lineWidth=radius;
  ctx.strokeStyle=colors[path.idx%colors.length];
  ctx.stroke();
*/
}

var drawPathEnd=(path)=>{
  ctx.beginPath();
  if (path.ca.length==1) {
    //path.ca[path.ca.length-1].drawHex();
  } else {
    for (let i=path.ca.length-1; i>path.ca.length-13; i--) {
if (path.ca[i]==undefined) debugger;
      path.ca[i].drawHex();
    }
  }
  if (path.idx==0) ctx.fillStyle="gray";
  else ctx.fillStyle=colors[path.idx%colors.length];
  ctx.fill();
}

var drawCircle=(c,col)=>{  // diagnostic
  ctx.beginPath();
if (c==undefined) debugger;
if (typeof c.draw != "function") debugger;
  c.draw();
  if (col) {
    ctx.strokeStyle=col;
  } else {
    ctx.strokeStyle="yellow";
  }
  ctx.lineWidth=5;
  ctx.stroke();
}

let c=new Circle(0,0);
circlesMap.set("0,0",c); //****
//c.level=0;

var hexSet=(()=>{
  let a=[];
  for (let i=0; i<6; i++)  a.splice(getRandomInt(0,a.length+1),0,i);
  return a;
})();

var fibo=(f,n)=>{
  if (n==0) return f;
  return fibo(f+=n,n-1);
}

//console.log("fibo "+fibo(0, Math.trunc(CSIZE/2/radius)-1));

var COUNT=1+6*fibo(0, Math.trunc(CSIZE/2/radius)-1);
//console.log("count "+COUNT);
//console.log(hexSet);

circlesMap.forEach((c)=>{
  let edge=CSIZE-radius;
  if (circlesMap.size>=COUNT) return;
  for (let a=0; a<6; a++) {
    let xc=c.x+2*radius*Math.cos(a*TP/6);
    let yc=c.y+2*radius*Math.sin(a*TP/6);
    //let ca=[c.x+2*radius*cos[a],Math.round((c.y+2*radius*sin[a])*10)/10];
    let ca=[Math.round(xc),Math.round(yc)];
    //if (Math.abs(ca[0])<edge && Math.abs(ca[1])<edge) {
    if (Math.abs(xc)<edge && Math.abs(yc<edge)) {
      if (!circlesMap.has(ca.toString())) {
        //let nc=new Circle(ca[0],ca[1]);
        let nc=new Circle(xc,yc);
        c.circ[a]=nc;
//nc.level=c.level+1;
        circlesMap.set(ca.toString(),nc);
      } else {
        c.circ[a]=circlesMap.get(ca.toString());
      }
    } else {
      c.circ[a]=false;
    }
  }
////if (a%2) c.circ.reverse();
});

/*
circlesMap.forEach((c)=>{
  if (c.x==0 && c.y==0) return;
  let angle=Math.atan(c.y/c.x);
  let x1=Math.round(c.er*Math.cos(angle+TP/6));
  let y1=Math.round(c.er*Math.sin(angle+TP/6));
  let x2=Math.round(c.er*Math.cos(angle+TP/3));
  let y2=Math.round(c.er*Math.sin(angle+TP/3));
  c.ckeys=[
    [Math.round(c.x),Math.round(c.y)],
    [Math.round(-c.x),Math.round(c.y)],
    [Math.round(-c.x),Math.round(-c.y)],
    [Math.round(c.x),Math.round(-c.y)],
    [Math.round(x1),Math.round(y1)],
    [Math.round(-x1),Math.round(y1)],
    [Math.round(-x1),Math.round(-y1)],
    [Math.round(x1),Math.round(-y1)],
    [Math.round(x2),Math.round(y2)],
    [Math.round(-x2),Math.round(y2)],
    [Math.round(-x2),Math.round(-y2)],
    [Math.round(x2),Math.round(-y2)],
  ];
});
c.ckeys=[];
*/

/*
var xa=Array.from(circleXSet).sort((a,b)=>{ return a-b; });
var ya=Array.from(circleYSet).sort((a,b)=>{ return a-b; });
var xmin=xa[0];
var xmax=xa[xa.length-1];
var ymin=ya[0];
var ymax=ya[ya.length-1];
*/

/*
if ((circleXSet.size+circleYSet.size)%4) {
  //circlesMap.get((xa[0]+","+ya[0])),"white");
  circlesMap.delete(xa[0]+","+ya[0]);
  circlesMap.delete(xa[0]+","+ya[ya.length-1]);
//  console.log(circlesMap.get(xa[length-1]+","+ya[0]));
  circlesMap.delete(xa[xa.length-1]+","+ya[0]);
  circlesMap.delete(xa[xa.length-1]+","+ya[ya.length-1]);
}
*/

/*
//let rndx=getRandomInt(1,xa.length-2);
let xind=getRandomInt(2,xa.length-3);
let yind=getRandomInt(1,xa.length-2);
let zx=xa[xind];
let zy=ya[yind];
let rndCircle=circlesMap.get([zx,zy].toString());
console.log(rndCircle);
console.log(xind+" "+yind);
*/

//let rndCircle=circles.splice(getRandomInt(0,circles.length-1),1)[0];

//var q=[1,2,3,4,5,6,7,8,9,10][getRandomInt(0,10)];	// should not be 1 for linklevel>1?

//var k1=3; //getRandomInt(1,8);  // arbitrary, refine
var k1=getRandomInt(2,axisCount-1);  // arbitrary, refine
var k2=[0,1,5][getRandomInt(0,3)];

var getLevelCircle=(circ,idx,lvl)=>{
  if (lvl==0) return circ;
  else {
    //let rdx=(idx+1)%6;
    //let rdx=(lvl%5==0)?(idx+2)%6:(idx+4)%6;
    //let rdx=(lvl%k1)?(idx+k2)%6:idx;
    let rdx=(lvl==k1)?(idx+k2)%6:idx;
    //let rdx=(lvl%q)?(idx+1)%6:idx;
      //(lvl==6)?(idx+1)%6:(lvl==4)?(idx+5)%6:idx; 
    //let rdx=(lvl%4==0)?(idx+5)%6:idx;
    //let rdx=(lvl%2==0)?(idx+1)%6:(idx+5)%6;
    return getLevelCircle(circ.circ[rdx],rdx,lvl-1);
  }
}

/*
let initArray=[];
//for (let i=1; i<Math.trunc(xa.length/4); i++) {
// try centered array
//let init=getRandomInt(1,Math.trunc(CSIZE/2/radius)-5,true); // for high values, add i to color idx
for (let i=1; i<axisCount; i++) {
  if (i%3) continue;
  initArray.push(i);
}
for (let j=0; j<initArray.length; j++) {
k1=getRandomInt(2,axisCount-1);
k2=[0,1,5][getRandomInt(0,3)];
  for (let i=0; i<6; i++) {
//if (i%2==0) continue;
    //let ci=getCircle(i,initArray[j]);
    let ci=getLevelCircle(cc,i,initArray[j]);
    ci.d=true;
// try push for skipping %2,3
    //let p=new Path([ci],i+j+1);
    let p=new Path([ci],j+1);
if (j%2) p.dir=(i+k)%6;
else p.dir=(i+k+4)%6;
//    p.dirc=k;
    p.dirc=(j+k+1)%6;
    paths.push(p);
  }
}
*/

var paths=[];
let k=getRandomInt(0,6);
//let k=[1,4,5][getRandomInt(0,3)];

var initPaths=(count)=>{
  let circles=Array.from(circlesMap.values());
  let cc=circlesMap.get("0,0");
  cc.d=true;
  cc.dir=0;
  let path0=new Path([cc],0);
  path0.mi=false;
  path0.fixed=true;
  paths=[path0]
  for (let p=1; p<count; p++) {
    paths[p]=new Path([],p);
    paths[p].dir=k;
    let rndCircle=circles.splice(getRandomInt(0,circles.length-1),1)[0];
    for (let i=0; i<rndCircle.ckeys.length; i++) {
      let ec=circlesMap.get(rndCircle.ckeys[i].toString());
      paths[p].ca.push(ec);
      circles.splice(circles.indexOf(ec),1);
    }
  }
}

colors=getColors();
var reset=()=>{
circlesMap.forEach((c)=>{ c.d=false; });
  k=getRandomInt(0,6);
  //let pathCount=getRandomInt(8,40,true);
  let pathCount=8;
  initPaths(pathCount);
  if (Math.random()<0.2) colors=getColors();
//  colors=getColors();	// should be 2,3 for linklevel>1
console.log("k "+k);
console.log("hex per path "+Math.round((COUNT-1)/pathCount));
duration=Math.min(100, Math.round(10000/COUNT*pathCount));
console.log(duration);
console.log("percent init "+Math.round(100*pathCount*12/COUNT));
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  pidx=1;
  step=0;
}

var frac=1;
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
//body.addEventListener("click", ()=>{ reset(); start(); }, false);

var pidx=1;
var step=0;
var time=0;
var duration=50;	// grow
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
/*
  if (step==0) {
    if (ts-time>90) {
      if (pidx>paths.length-1) {
        step=1;
        pidx=0;
      } else {
        drawPath(paths[pidx++]);
      }
      time=0;
    }
  } else if (step==2) {
    if (ts-time>1600) {
      time=0;
      step=0;
      reset();
    }
*/
/*
  } else if (step==3) {
    if (ts-time>1000) {
      time=0;
      step=0;
      ctx.canvas.style.opacity=1;
      reset();
    } else {
      ctx.canvas.style.opacity=1-(ts-time)/1000;
    }
*/
//  } else {
    if (ts-time>duration) {
      time=0;
//      if (!grow(path)) return;
      let moved=false;
let pco=0;
      for (let i=0; i<paths.length; i++) {
	moved=grow2(paths[i]) || moved;
if (moved && pco++>2) break;
      }
      //if (!moved) step=2;
      if (!moved) reset();
      draw2();
    }
//  }
  requestAnimationFrame(animate);
}

reset();

start();

//paths.forEach((p)=>{ drawPath(p); });

/*
ctx.beginPath();
//circlesMap.forEach((c)=>{ c.drawHex(); });
let cir=Array.from(circlesMap.values());
for (let i=0; i<61; i++) {
  cir[i].drawHex();
}
ctx.fillStyle="gray";
ctx.fill();
*/

