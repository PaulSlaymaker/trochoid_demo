"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;
const CSIZE=480;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
//c.style.outline="1px dotted red";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";
//ctx.font="bold 16px sans-serif";

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
  let colorCount=getRandomInt(3,8);
  let hue=getRandomInt(0,90,true)+30;
  let colorSeg=Math.round(360/colorCount);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-40,40);
    let sat=60+getRandomInt(0,31);
    let lum=40+getRandomInt(0,21);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}

//var radius=[12,16,20,24,30,32][getRandomInt(0,6)];	// no 15?
//var radius=[16,20,24,30,32,40][getRandomInt(0,6)];	// no 15?
//var radius=[8,12,16,20,24,30,32][getRandomInt(0,7)];	// no 15?
const radius=30;

const cos=[1,0.5,-0.5,-1,-0.5,0.5];
const sin=[0,0.866,0.866,0,-0.866,-0.866];

var Circle=function(x,y) {
  this.x=x;
  this.y=y;
  this.pts=new Array(6);
  this.circ=[];
  this.d=false;
}

var Point=function(x,y,a,cir) {
  this.x=x;
  this.y=y;
  this.c=[{"idx":a,"cir":cir}];
  this.d=false;
}

var Arc=function(c,a,d) {
  this.circle=c;
  this.angle=a;
  this.dir=d;
  this.path=new Path2D();
  //this.path.arc(this.circle.x,this.circle.y,radius,this.angle*TP/6, (this.angle+6+this.dir)%6*TP/6, this.dir==-1);
  this.path.arc(c.x,c.y,radius,a*TP/6, (a+6+d)%6*TP/6, d==-1);
  this.p1=this.circle.pts[this.angle];
  this.p2=this.circle.pts[(this.angle+this.dir+6)%6];
//if (!this.p1 || !this.p2) debugger;
}

var Branch=function(iar) {
  this.arcs=iar;
  this.rc=0;
}

var pm=new Map();

var setSymmetry=(point)=>{
  let angle=Math.atan(point.y/point.x);
  let rad=Math.pow(point.x*point.x+point.y*point.y,0.5);
  for (let i=0; i<6; i++) {
    let z=i*TP/6+angle; 
    let x=Math.round(rad*Math.cos(z));
    let y=Math.round(rad*Math.sin(z));
    pm.get([x,y].toString()).d=true;
/*
    let p=pm.get([x,y].toString());
    if (p) p.d=true;
else {
drawPoint(p,"green");
debugger;
}
*/
  }
}

var setSymmetryV=(point)=>{
  point.d=true;
  let x=Math.round(point.x);
  let y=Math.round(point.y);
//if (x==0 || y==0) debugger;
  return pm.get([-x,y].toString());
  pm.get([-x,y].toString()).d=true;
  pm.get([-x,-y].toString()).d=true;
  pm.get([x,-y].toString()).d=true;
}

var setSymmetryF=(point)=>{
  let angle=Math.atan(point.y/point.x);
  let rad=Math.pow(point.x*point.x+point.y*point.y,0.5);
  for (let i=0; i<3; i++) {
    let ia=2*i;
    let z=ia*TP/6+angle; 
    let x=Math.round(rad*Math.cos(z));
    let y=Math.round(rad*Math.sin(z));
    pm.get([x,y].toString()).d=true;
    let ib=2*i+1;
    z=ib*TP/6+angle; 
    x=Math.round(rad*Math.cos(z));
    y=Math.round(-rad*Math.sin(z));
    pm.get([x,y].toString()).d=true;
  }
}

colors=getColors();

onresize();

var cm=new Map();
var pm=new Map();

var fibo=(f,n)=>{
  if (n==0) return f;
  return fibo(f+=n,n-1);
}

var generateHexes=()=>{
  let ra=radius;
  let aCount=Math.trunc(CSIZE/2/ra);
  let cCount=1+6*fibo(0, aCount-1);
  //let edge=CSIZE-radius-20;
  let c=new Circle(0,0,ra);
  cm.set("0,0",c);
  cm.forEach((c)=>{
    if (cm.size>=cCount) return;
    for (let a=0; a<6; a++) {
      let xt=ra*cos[a];
      let yt=ra*sin[a];
      let xc=c.x+2*xt;
      let yc=c.y+2*yt;
      let ckey=[Math.round(xc),Math.round(yc)];
      if (!cm.has(ckey.toString())) {
	let nc=new Circle(xc,yc,ra);
	cm.set(ckey.toString(),nc);
	for (let b=0; b<6; b++) {
	  let xz=xc+ra*cos[b];
	  let yz=yc+ra*sin[b];
	  let cb=[Math.round(xz),Math.round(yz)];
	  if (!pm.has(cb.toString())) {
	    let np=new Point(xz,yz,b,nc);
//pXset.add(Math.round(xz));
//pYset.add(Math.round(yz));
	    pm.set(cb.toString(),np);
	    nc.pts[b]=np;
	  } else {
	    let op=pm.get(cb.toString());
	    op.c.push({"idx":b,"cir":cm.get(ckey.toString())});
	    nc.pts[b]=op;
	  }
	}
      }
    }
  });
}

generateHexes();

var drawPoint=(p,col)=>{	// diag
ctx.beginPath();
ctx.arc(p.x,p.y,6,0,TP);
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
  ctx.lineWidth=1;
  ctx.strokeStyle="yellow";
  ctx.stroke(p);
}

var grow=(branch)=>{
  if (branch.arcs.length==0) return false;
  let earc=branch.arcs[branch.arcs.length-1];
  let ci=getRandomInt(0,earc.p2.c.length);
  let njunc=earc.p2.c[ci];
  let jsw=earc.circle==njunc.cir;
//  let dirz=(earc.circle==njunc.cir)?earc.dir:-earc.dir;
  let dirz=jsw?earc.dir:-earc.dir;

//if (jsw) branch.rc++;
//else branch.rc=0;
/*
  let dirz=earc.dir;
  if (earc.circle==njunc.cir) {
//    branch.rc++;
//if (branch.rc==4) branch.loop=true;
  } else {
    dirz=-dirz;
//    branch.rc=0;
  }
*/
  let np=njunc.cir.pts[(njunc.idx+dirz+6)%6];
  if (np.d) {
/*
    if (earc.p2.c.length==2) {
      njunc=earc.p2.c[(ci+1)%2];
      jsw=earc.circle==njunc.cir;
      dirz=jsw?earc.dir:-earc.dir;
//console.log(np);
      np=njunc.cir.pts[(njunc.idx+dirz+6)%6];
//console.log(np);
//console.log("pre2nd "+ci);
      if (np.d) return false; 
console.log("2nd");
    } else return false;
*/
    return false;
  }
  if (sType==4) setSymmetryV(np);
  else setSymmetry(np); //  np.d=true;
  branch.arcs.push(new Arc(njunc.cir, njunc.idx, dirz));
  return true;
}

var getBranch=(aidx)=>{ // branch only from initial path
  let spt=arcs[aidx].p1;
  if (spt.c.length<2) return false;
  let cindex=(arcs[aidx].angle==spt.c[0].idx)?1:0;
  let np=spt.c[cindex].cir.pts[(spt.c[cindex].idx-arcs[aidx].dir+6)%6];
  let ars=[];
  if (!np.d) {
    if (sType==4) setSymmetryV(np);
    else setSymmetry(np);
    ars.push(new Arc(spt.c[cindex].cir, spt.c[cindex].idx, -arcs[aidx].dir));
  }
  return new Branch(ars);
}

var arcs=[];
var branches=[];

var initBranchesV=()=>{
  arcs.length=0;
  branches.length=0;
  let setD=()=>{
    pm.forEach((p)=>{ 
      if (Math.abs(p.x)<radius || Math.round(p.y)==0) p.d=true;
      else p.d=false; 
    });
  }
  setD();
//  let pt1=pm.get([radius/2,Math.round(radius*sin[1])].toString());
//  let pt2=pm.get([3*radius/2,Math.round(radius*sin[1])].toString());
//  setSymmetryV(pt1);
//  setSymmetryV(pt2);
  if (Math.random()<0.5) {
    arcs[0]=new Arc(cm.get([radius,Math.round(2*radius*sin[1])].toString()),4,1);
  } else {
    arcs[0]=new Arc(cm.get([2*radius,0].toString()),3,1);
  }
  setSymmetryV(arcs[0].p1);
  setSymmetryV(arcs[0].p2);
  branches[0]=new Branch(arcs);
  while (grow(branches[0]));
  while (branches[0].arcs.length<5) {
console.log("small V");
    branches[0].arcs.length=1;
    setD();
    setSymmetryV(arcs[0].p1);
    setSymmetryV(arcs[0].p2);
    while (grow(branches[0]));
  }
}

var initBranchesF=()=>{
  arcs.length=0;
  branches.length=0;
  let setD=()=>{
    pm.forEach((p)=>{ 
      if (Math.abs(Math.abs(p.y/p.x)-1.732)<0.1 || Math.round(p.y)==0) p.d=true;
      else p.d=false; 
    });
  }
  setD();
/*
  if (Math.random()<0.5) {
    arcs[0]=new Arc(cm.get([radius,Math.round(2*radius*sin[1])].toString()),4,1);
  } else {
    arcs[0]=new Arc(cm.get([2*radius,0].toString()),3,1);
  }
*/
/*
  setSymmetryF(arcs[0].p1);
  setSymmetryF(arcs[0].p2);
  branches[0]=new Branch(arcs);
  while (grow(branches[0]));
*/
/*
  while (branches[0].arcs.length<5) {
console.log("small V");
    branches[0].arcs.length=1;
    setD();
    setSymmetryV(arcs[0].p1);
    setSymmetryV(arcs[0].p2);
    while (grow(branches[0]));
  }
*/
}

var initBranches=()=>{
  arcs.length=0;
  branches.length=0;
  let setD=()=>{ pm.forEach((p)=>{ p.d=false; }); }
  setD();
//  let rpt=pm.get(radius+",0");
  //let caa=rpt.c[getRandomInt(0,rpt.c.length)];
//  setSymmetry(rpt);
//  let pt2=caa.cir.pts[(caa.idx+dirx+6)%6];
//  setSymmetry(pt2);
  let c=cm.get([2*radius,0].toString());
  //arcs.push(new Arc(caa.cir, caa.idx, dirx));
  let dirx=(Math.random()<0.5)?1:-1;
  arcs[0]=new Arc(c,3,dirx);
  setSymmetry(arcs[0].p1);
  setSymmetry(arcs[0].p2);
  branches[0]=new Branch(arcs);
  while (grow(branches[0]));
  //while (branches[0].arcs.length<7) {
  while (branches[0].arcs.length<6) {
  console.log("small");
    branches[0].arcs.length=1;
    setD();
    setSymmetry(arcs[0].p1);
    setSymmetry(arcs[0].p2);
    while (grow(branches[0]));
  }
}

var setBranches=()=>{
  for (let i=1; i<branches[0].arcs.length-2; i++) {
  //for (let i=branches[0].arcs.length-3; i>1; i--) {
    let brn=getBranch(i);
    if (!brn) continue;
    branches.push(brn);
    //while (grow(branches[i]));
    while (grow(brn));
  }
}

var drawArcSym=(a)=>{
  let p=new Path2D();
  for (let i=0; i<6; i++) {
    // don't create? modify a,b,c,d
    p.addPath(a.path,new DOMMatrix([cos[i],sin[i],-sin[i],cos[i],0,0]));
  }
  ctx.stroke(p);
}

var drawArcSymV=(a)=>{
  let p=new Path2D();
  p.addPath(a.path,new DOMMatrix([1,0,0,1,0,0]));
  p.addPath(a.path,new DOMMatrix([1,0,0,-1,0,0]));
  p.addPath(a.path,new DOMMatrix([-1,0,0,-1,0,0]));
  p.addPath(a.path,new DOMMatrix([-1,0,0,1,0,0]));
  ctx.stroke(p);
}

var drawArcSymF=(a)=>{
  let p=new Path2D();
  for (let i=0; i<3; i++) {
    let ia=2*i;
    let ib=2*i+1;
    p.addPath(a.path,new DOMMatrix([cos[ia],sin[ia],-sin[ia],cos[ia],0,0]));
    p.addPath(a.path,new DOMMatrix([cos[ib],sin[ib],sin[ib],-cos[ib],0,0]));
  }
  ctx.stroke(p);
}

var drawEndsSym=(bi)=>{
  let end=new Path2D();
  let aa=branches[bi].arcs;
  let pt=aa[aa.length-1].p1;
  end.arc(pt.x,pt.y,radius/1.6,0,TP);
  let dm=new DOMMatrix([1,0,0,1,0,0]);
  let p=new Path2D();
  for (let i=0; i<6; i++) {
    // don't create? modify a,b,c,d
    dm.a=cos[i]; dm.b=sin[i]; dm.c=-sin[i]; dm.d=cos[i];
    p.addPath(end,dm);
    //p.addPath(end,new DOMMatrix([cos[i],sin[i],-sin[i],cos[i],0,0]));
  }
  ctx.fillStyle=colors[1+bi%(colors.length-1)];
  ctx.fill(p);
}

var drawEndsSymV=(bi)=>{
  let end=new Path2D();
  let aa=branches[bi].arcs;
  let pt=aa[aa.length-1].p1;
  end.arc(pt.x,pt.y,radius/1.6,0,TP);
  let p=new Path2D();
  p.addPath(end,new DOMMatrix([1,0,0,1,0,0]));
  p.addPath(end,new DOMMatrix([1,0,0,-1,0,0]));
  p.addPath(end,new DOMMatrix([-1,0,0,-1,0,0]));
  p.addPath(end,new DOMMatrix([-1,0,0,1,0,0]));
  ctx.fillStyle=colors[1+bi%(colors.length-1)];
  ctx.fill(p);
}

/*
var drawShrink=(bi)=>{
  let end=new Path2D();
  let aa=branches[bi].arcs;
  let pt=aa[aa.length-1].p1;
  end.arc(pt.x,pt.y,radius/1.5,0,TP);
  let dm=new DOMMatrix([1,0,0,1,0,0]);
  let p=new Path2D();
  for (let i=0; i<6; i++) {
    // don't create? modify a,b,c,d
    dm.a=cos[i]; dm.b=sin[i]; dm.c=-sin[i]; dm.d=cos[i];
    p.addPath(end,dm);
    //p.addPath(end,new DOMMatrix([cos[i],sin[i],-sin[i],cos[i],0,0]));
  }
  ctx.fillStyle="black";
  ctx.fill(p);
  let pe=new Path2D();
  drawArcSym(aa[aa.length-3])
}
*/

//drawCircle(cm.get("0,0"), colors[0]);  // don't use drawCircle, draw ctx directly

var drawCenter=()=>{
  ctx.beginPath();
  ctx.arc(0,0,radius,0,TP);
  ctx.stroke();
}

var drawBranch=(b)=>{	// diag
  b.arcs.forEach((a)=>{ drawArcSym(a); }); 
}

var getNextBranchIndex=()=>{
  for (let b=bidx+1; b<branches.length; b++) {
    if (branches[b].arcs.length>2) return b;
  }
  return false;
}

var getPrevBranchIndex=()=>{
  if (bidx==0) return false;
  for (let b=bidx-1; b>=0; b--) {
    if (branches[b].arcs.length>2) return b;
  }
  return false;
}

/*
var setBranchD=()=>{	// temp
  setSymmetry(arcs[0].p1);
  for (let i=0; i<arcs.length; i++) {
    setSymmetry(arcs[i].p2);
  }
}
*/

var sType=6;

var reset=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  if (Math.random()<0.1) sType=4;
  else sType=6;
  if (sType==4) initBranchesV();
  else initBranches();
  setBranches();
reportBranches();
  colors=getColors();
  ctx.strokeStyle=colors[0];
  ctx.lineWidth=radius/2;
  bidx=0;
  pidx=0;
  drawCenter();
}

//var drawD=()=>{ pm.forEach((pt)=>{ if (pt.d) drawPoint(pt); }); } // diag

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
//body.addEventListener("click", ()=>{ reset(); start() }, false);

/*
ctx.canvas.addEventListener("click", 
  ()=>{ 
    console.log(event);
  }, 
  false
);
*/

var t=0;
var pidx=0;
var bidx=0;

var reportBranches=()=>{	// diag
  let len="";
//  let rc="";
ctx.fillStyle="black";
  for (let i=0; i<branches.length; i++) {
    len+=branches[i].arcs.length+" "
//    rc+=branches[i].rc+" "
/*
    let aa=branches[i].arcs;
    if (aa.length>2) {
      let pt=aa[aa.length-1].p1;
      ctx.fillText(i,pt.x-3,pt.y+3);
    }
*/
  }
  console.log(len);
//  console.log(rc);
}

var step=0;
var animate=()=>{
  if (stopped) return;
  t++;
  if (step==0) {
    if (t==5) {
      t=0;
      if (sType==4) drawArcSymV(branches[bidx].arcs[pidx]);
      else drawArcSym(branches[bidx].arcs[pidx]);
      pidx++;
      if (pidx>=branches[bidx].arcs.length-1) {
        if (sType==4) drawEndsSymV(bidx);
	else drawEndsSym(bidx);
	pidx=0;
	bidx=getNextBranchIndex();
	if (!bidx || bidx>branches.length) {
	  step=1;
	}
      }
    }
  } else if (step==1) {
    if (t==160) {
      t=0;
      step=2;
    }
  } else if (step==2) {
    ctx.canvas.style.opacity=1-t/80;
    ctx.canvas.style.transform="scale("+(1-t/80)+")";
    if (t==80) {
      t=0;
      step=3;
    }
  } else {
    t=0;
    reset();
    ctx.canvas.style.opacity=0.99;
    ctx.canvas.style.transform="none";
    step=0;
  //  stopped=true;
  }
  requestAnimationFrame(animate);
}

reset();

start();
