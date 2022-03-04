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
  c.style.borderBottom="3px dotted gray";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,2*CSIZE);
ctx.lineWidth=3;
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
  let colorCount=4;
  let hr=Math.round(90/colorCount);
  let hue=getRandomInt(0,90,true)+30;
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(240/colorCount)*i+getRandomInt(-hr,hr);
    let sat=60+getRandomInt(0,21);
    let lum=20+getRandomInt(0,41);
    //let lum=Math.round(50+20*Math.pow(Math.sin((col+90)*TP/360),2));
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}
colors=getColors();

ctx.strokeStyle=colors[0];

var Node=function(pNode) {
  this.cna=[];  // child node array
  this.pn=pNode;
  if (pNode) {
    this.rsdx=pNode.rsdx+1;
    this.rsO={	// radial set object
      "a":pNode.rsO.a,
      "a2":pNode.rsO.a,
      "r":pNode.rsO.r,
      "r2":pNode.rsO.r,
    };
  } else {	// only start node
    this.rsdx=0;
    this.rsO={"a":TP/2,"r":0,"a2":TP/2,"r2":0};
  }
  this.rsO.node=this;
  this.cnc=0;
  this.setCNC=()=>{
    if (this.pn) {
      this.pn.cnc++;
      this.pn.setCNC();
    }
  }
  this.setCNC();
  this.time=t;
  this.getPoint=()=>{
    return {"x":this.rsO.r*Math.sin(this.rsO.a),"y":this.rsO.r*Math.cos(this.rsO.a)};
  }
  this.getPoint2=()=>{
    return {"x":this.rsO.r2*Math.sin(this.rsO.a2),"y":this.rsO.r2*Math.cos(this.rsO.a2)};
  }
  this.getFrac=()=>{
    if ((t-this.time)<0) return 0;
    if ((t-this.time)<duration) return (t-this.time)/duration;
    if ((t-this.time)>=duration) return 1;
  }
  this.getPointT=()=>{
    let f=this.getFrac();
    if (f==0 || f==1) return this.getPoint();
    let r=(1-f)*this.rsO.r+f*this.rsO.r2;
    let a=(1-f)*this.rsO.a+f*this.rsO.a2;
    return {"x":r*Math.sin(a),"y":r*(Math.cos(a))};
  }
  this.getRadiusT=()=>{
    let f=this.getFrac();
    if (f==0 || f==1) return this.rsO.r;
    return (1-f)*this.rsO.r+f*this.rsO.r2;
  }
  this.getAngleT=()=>{
    let f=this.getFrac();
    if (f==0 || f==1) return this.rsO.a;
    return (1-f)*this.rsO.a+f*this.rsO.a2;
  }
  this.getPath=()=>{
    let p=new Path2D();
    let p2=new Path2D();
    let bpt=this.pn.getPointT();
    p.moveTo(bpt.x,bpt.y);
    let anT=this.getAngleT();
    let raT=this.getRadiusT();
    let x=raT*Math.sin(anT);
    let y=raT*Math.cos(anT);
    p2.arc(x,y,2,0,TP);
//let lx=0.9*raT*Math.sin(anT);
//let ly=0.9*raT*Math.cos(anT);
    let f=this.getFrac();

    let xs1=12+1.05*raT*Math.sin(anT-0.03);
    let ys1=-4+1.1*raT*Math.cos(anT-0.03);
    let xs2=-12+1.05*raT*Math.sin(anT+0.03);
    let ys2=-4+1.1*raT*Math.cos(anT+0.03);

    if (this.rsdx==1) {
      let mp=this.getRadiusT()/2;
      let ang=this.getAngleT();
      let cpx2=mp*Math.sin(ang);
      let cpy2=mp*Math.cos(ang);
      p.bezierCurveTo(0,-mp,cpx2,cpy2,x,y);
      if (this.cna.length==0) {
        p2.moveTo(x,y);
        p2.bezierCurveTo(xs1,ys1,xs2,ys2,x,y);
      }
    } else {
      let pa=this.pn.getAngleT();
      let mp=(this.getRadiusT()+this.pn.getRadiusT())/2;
      let cpx1=mp*Math.sin(pa);
      let cpy1=mp*Math.cos(pa);
      let ang=this.getAngleT();
      let cpx2=mp*Math.sin(ang);
      let cpy2=mp*Math.cos(ang);
      p.bezierCurveTo(cpx1,cpy1,cpx2,cpy2,x,y);
      if (this.cna.length==0) {
	p2.moveTo(x,y);
	p2.bezierCurveTo(xs1,ys1,xs2,ys2,x,y);
      }
    }
    return {"s":p,"h":p2};
  }
}

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,4,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

const NW=6;
const radii=[];
const R=720/(NW-1);
for (let i=0; i<NW; i++) radii.push(i*R);

const segmentCount=14;

var generateCounts2=()=>{	// Math.pow(2,n) to get to 32, i.e. sum(n)==5
  let c=[1];
  c.push([2,1,3,4][getRandomInt(0,4,true)]);
  //c.push(getRandomInt(2,5,true));	// for NW>10
  // ? from  2 root of 32/1	**increase 32 to ss
  let ff=Math.pow(segmentCount/c[1],1/(NW-2));  // 0.5 = 1/(NW-3)
  for (let i=0; i<NW-2; i++) {
    let f1=ff-ff*Math.random()/5;	
    c.push(Math.round(c[c.length-1]*f1));
  }
console.log("counts "+c);
  return c;
}
var counts=generateCounts2();

var initRadialSets=()=>{
  let rsa=[];
  for (let i=0; i<NW; i++) rsa.push([]);
  return rsa;
}
let RSA=initRadialSets();

var transit=()=>{
  for (let i=1; i<nodes.length; i++) {
    let rso=nodes[i].rsO;
    rso.a=rso.a2;
    rso.r=rso.r2;
    nodes[i].time=t;
  }
}

var reset=()=>{
  counts=generateCounts2();
  RSA=initRadialSets();
  colors=getColors();
  t=0;
  initNodes();
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

var S=0;
var stopped=true;
var t=0;
var ot=0;
var ot2=0;
var duration=60;
function animate(ts) {
  if (stopped) return;
  t++; 	// can't be async since radial sets have to be synced
  if (S==0) {
    if (t%duration==0) {
      transit();
      if (!addNode()) {
	console.log("full");
	S=1;
	ot=t;
      } else {
	let c=getRandomInt(0,5);
	for (let i=0; i<c; i++) if (!addNode()) break;
      }
      for (let i=1; i<NW; i++) setRandomRSN2(i);
    } 
  } else if (S==1) {
    if (t%duration==0) {
      transit();
      for (let i=1; i<NW; i++) setRandomRSN2(i);
    }
    if (t>ot+160) {
      S=2;
      ot2=t;
    }
  } else if (S==2) {
    if (t%duration==0) {
      transit();
      for (let i=1; i<NW; i++) setRandomRSN2(i);
    }
    ctx.filter="opacity("+(Math.max(0,100*(1-(t-ot2)/40)))+"%)";
    if (t>ot2+40) {
      S=3;
    }
  } else {
    reset();
    ctx.filter="none";
    S=0;
  }
  draw();
  requestAnimationFrame(animate);
}

var getPoint=(rs)=>{	// diag
debugger;
if (rs==undefined) debugger;
  return {"x":rs.r*Math.sin(rs.a),"y":rs.r*(Math.cos(rs.a)) };
}
var getPoint2=(rs)=>{	// diag
debugger;
if (rs==undefined) debugger;
  return {
    "x":rs.r2*Math.sin(rs.a2),
    "y":rs.r2*(Math.cos(rs.a2))
  }
}

var getRandomSortedRadii=(rsdx)=>{
  let ra=[];
  for (let i=0; i<RSA[rsdx].length; i++) {
    ra.push(radii[rsdx]-R/1.9*Math.random());	// 3 & 2
  }
  ra.sort((b,a)=>{ return a-b; });
  let ra2=[];
  for (let i=0; i<ra.length; i++) {
    if (Math.random()<0.5) ra2.push(ra[i]);
    //if (i%2) ra2.push(ra[i]);
    else ra2.unshift(ra[i]);
  }
  return ra2;
}

var setRandomRSN2=(n)=>{	// no n, internal loop
  let rsr=getRandomSortedRadii(n);
  for (let i=0; i<RSA[n].length; i++) {	// 3
    //let d=40/radii[n];	// R0 never called, should vary with segmentCount
//let d=30/radii[n];
//let d=60/radii[n];
let d=92/radii[n];	// 18 seg
    ////let start=TP/2-counts[n]/2*d;
    let start=TP/2-RSA[n].length/2*d;
    //let angle=start+i*d;
//let angle=start+i*d+d*(1-2*Math.random())/3;  // diag
let angle=start+i*d+d*Math.random()/3;  // diag

/*
    if (RSA[n][i].node.cna.length>0) {
      let cna=RSA[n][i].node.cna;
      //let angle2=(cna[0].rsO.a2+cna[cna.length-1].rsO.a2)/2;
      angle=(5*angle+angle2)/6;
    }
*/
let angle2=RSA[n][i].node.pn.rsO.a2;
angle=(angle+angle2)/2;

    RSA[n][i].a2=angle;
//    RSA[n][i].r=radii[n]-(radii[n]-radii[n-1])/2*Math.random();	// 3 & 2
//RSA[n][i].r2=radii[n];
//RSA[n][i].r2=radii[n]*(1-Math.random()/10);
    RSA[n][i].r2=rsr[i];
  }
}

var nodes;
var initNodes=()=>{
nodes=[new Node(false)];
//nodes[0].time=0;
RSA[0].push(nodes[0].rsO);
nodes.push(new Node(nodes[0]));
RSA[1].push(nodes[1].rsO);
setRandomRSN2(1);
}
initNodes();

var draw=()=>{
  let bPath=new Path2D();
  let fPath=[new Path2D(), new Path2D()];
  ctx.clearRect(-CSIZE,0,2*CSIZE,-2*CSIZE);
  for (let i=nodes.length-1; i>0; i--) {
    let po=nodes[i].getPath();
    ctx.lineWidth=2+nodes[i].cnc/1.6;
    ctx.strokeStyle=colors[0];
    ctx.stroke(po.s);
//    if (nodes[i].cna.length==0) {
      fPath[i%2].addPath(po.h);
//    }
  }
  ctx.lineWidth=6;
  ctx.strokeStyle=colors[0];
  ctx.stroke(fPath[0]);
  ctx.stroke(fPath[1]);
  ctx.lineWidth=2;
  ctx.strokeStyle="#222";
  ctx.stroke(fPath[0]);
  ctx.stroke(fPath[1]);
  ctx.fillStyle=colors[1];
  ctx.fill(fPath[0]);
  ctx.fillStyle=colors[2];
  ctx.fill(fPath[1]);
}

/*
var drawo=()=>{
  ctx.clearRect(-CSIZE,0,2*CSIZE,-2*CSIZE);
  let spath=new Path2D();
  let fpath=[new Path2D(), new Path2D()];
  for (let i=nodes.length-1; i>0; i--) {
    let po=nodes[i].getPath();
    spath.addPath(po.s);
    fpath[i%2].addPath(po.h);
  }
ctx.lineWidth=3;
  ctx.strokeStyle=colors[0];
  ctx.stroke(spath);

ctx.lineWidth=8;
  ctx.strokeStyle=colors[2];
  ctx.filter="blur(5px)";
  ctx.stroke(fpath[0]);
  ctx.stroke(fpath[1]);
  ctx.filter="none";
  ctx.fillStyle=colors[1];
  ctx.fill(fpath[0]);
  ctx.fillStyle=colors[3];
ctx.lineWidth=1.2;
ctx.strokeStyle="black";
ctx.stroke(fpath[0]);
  ctx.fill(fpath[1]);
ctx.stroke(fpath[1]);
}
var drwGrw=()=>{
debugger;
  ctx.clearRect(-CSIZE,0,2*CSIZE,-2*CSIZE);
  let lpath=new Path2D();
  let npath=[new Path2D(), new Path2D()];
  let n2path=[new Path2D(), new Path2D()];
  //let n2path=new Path2D();
  for (let i=1; i<nodes.length; i++) {
    let f=nodes[i].getFrac();
      let bpt=nodes[i].pn.getPointT();
      lpath.moveTo(bpt.x,bpt.y);
      let pt=nodes[i].getPointT();
      let x=pt.x;
      let y=pt.y;
      //if (nodes[i].cna.length==0 || nodes[i].rsdx==NW-1) 	// mark terminals
      if (nodes[i].cna.length==0) {	// mark terminals
	npath[i%2].arc(x,y,10,0,TP);	
	npath[i%2].closePath();
      } else {
	n2path[i%2].arc(x,y,3,0,TP);
	n2path[i%2].closePath();
      }
      if (nodes[i].rsdx==0) {
debugger;
      } else if (nodes[i].rsdx==1) {
	let mp=nodes[i].getRadiusT()/2;
	let ang=nodes[i].getAngleT();
	let cpx2=mp*Math.sin(ang);
	let cpy2=mp*Math.cos(ang);
	lpath.bezierCurveTo(0,-mp,cpx2,cpy2,x,y);
      } else {	// rsdx>1
	let mp=(nodes[i].getRadiusT()+nodes[i].pn.getRadiusT())/2;
	let pa=nodes[i].pn.getAngleT();
	let cpx1=mp*Math.sin(pa);
	let cpy1=mp*Math.cos(pa);
        if (nodes[i].rsdx==NW-1) {
	  lpath.bezierCurveTo(cpx1,cpy1,x,y,x,y);
        } else {
	  let ang=nodes[i].getAngleT();
	  let cpx2=mp*Math.sin(ang);
	  let cpy2=mp*Math.cos(ang);
	  lpath.bezierCurveTo(cpx1,cpy1,cpx2,cpy2,x,y);
        }
      }
  }
  ctx.stroke(lpath);
  ctx.fillStyle=colors[1];
  ctx.fill(npath[0]);
  ctx.fill(n2path[0]);
  ctx.fillStyle=colors[2];
  ctx.fill(npath[1]);
  ctx.fill(n2path[1]);
}
*/

var getRandomRSAIndex=()=>{	// for selecting parent node
  let rri=[];
  for (let i=0; i<NW-1; i++) {
    rri.splice(getRandomInt(0,rri.length+1),0,i);
  }
  for (let i=0; i<NW-1; i++) {
    if (RSA[rri[i]].length==0) continue;
    if (RSA[rri[i]+1].length>=counts[rri[i]+1]) continue;
// go through RSA[rri[i]], check each nodes cna for max length
//for (let j=0; j<RSA[rri[i]].length; i++) { if (RSA[rri[i]][j].node.pn.cna.length>5); }
    return rri[i];
  }
  return -1;
}

var addNode=()=>{
  let rrsai=getRandomRSAIndex();
  if (rrsai==-1) return false;
  let rset=RSA[rrsai];
  if (rset.length>0) {
    let slots=[];
    let prn=0;  // should line up with RSA2
    for (let i=0; i<rset.length; i++) {
      for (let j=0; j<rset[i].node.cna.length+1; j++) {
        if (rset[i].node.cna[j]) prn++;
        if (rset[i].node.cna.length<3)	// limit 3 branches per node
          slots.push({"ri":i,"ci":j,"prn":prn});
      }
    }
    let rsi=getRandomInt(0,slots.length);
    if (!slots[rsi]) {
console.log("cna full");
      return false; 	// occurs when cna fills up on the only available nodes
    }
    let pn=rset[slots[rsi].ri].node;
    let n=new Node(pn);
    nodes.push(n);
    pn.cna.splice(slots[rsi].ci+1,0,n);
    RSA[n.rsdx].splice(slots[rsi].prn,0,n.rsO);
    // parent node should be rset[slots[rsi].ri].node
    // cna insertion point from ci
    // RSA2 insertion point from prn
  }
  return true;
}

onresize();

start();
