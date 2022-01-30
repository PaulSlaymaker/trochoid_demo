"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
c.style.outline="1px dotted silver";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,2*CSIZE);
ctx.textAlign="center";
ctx.lineWidth=3;

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
  //let colorCount=getRandomInt(2,7);
  let colorCount=5;
  let hr=Math.round(90/colorCount);
  let hue=getRandomInt(0,90,true)+30;
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(240/colorCount)*i+getRandomInt(-hr,hr);
    let sat=60+getRandomInt(0,41);
    let lum=40+getRandomInt(0,41);
    //let lum=Math.round(50+20*Math.pow(Math.sin((col+90)*TP/360),2));
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}
colors=getColors();

ctx.strokeStyle=colors[0];

var Node=function(rs,pNode,ridx,rsdx) {
  this.rsdx=rsdx;
  this.rSet=rs;	// switch to rsdx
  this.rsO=rs[ridx];
  this.rsi=[];  // convert to node array
  this.cna=[];  // child node array
  this.time=0;
  this.g=false;
  if (pNode) {
    pNode.rsi.push(ridx);
    pNode.cna.push(this);
  }
  else this.g=true;
  this.getPoint=()=>{
    return {
      "x":this.rsO.r*Math.sin(this.rsO.a)*Math.pow(Math.sin(this.rsO.a/2),1.3),
      "y":this.rsO.r*(Math.cos(this.rsO.a)-1)
    };
  }
}

var draw=()=>{
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let npath=new Path2D();
  let n2path=new Path2D();
  let n3path=new Path2D();
  let lpath=new Path2D();
  for (let i=0; i<nodes.length; i++) {
    let rad=nodes[i].rsO;
    //let pt=getPoint(rad);
    let pt=nodes[i].getPoint();

if (nodes[i].rsdx==1 || nodes[i].rsdx==3) {
    n2path.arc(pt.x,pt.y,8,0,TP);
    n2path.closePath();
} else if (nodes[i].rSet==RS2) {
    n3path.arc(pt.x,pt.y,8,0,TP);
    n3path.closePath();
} else {
    npath.arc(pt.x,pt.y,8,0,TP);
    npath.closePath();
}

/*
  if (nodes[i].rSet==RS4) continue;
    let rsc=RS1;
    if (nodes[i].rSet==RS1) {
      rsc=RS2;
    } else if (nodes[i].rSet==RS2) {
      rsc=RS3;
    } else if (nodes[i].rSet==RS3) {
      rsc=RS4;
    }
//    let rsc=(nodes[i].rSet==RS1)?RS2:RS1;
*/

    //let rss=nodes[i].rsi;
    let cns=nodes[i].cna;
      for (let l=0; l<cns.length; l++) {	
//    for (let l=0; l<rss.length; l++) {	
      lpath.moveTo(pt.x,pt.y);
      // let rad2=nodes[i].cna[l].rsO;
//      let rad2=rsc[rss[l]];
let rad2=cns[l].rsO;
//if (radx!=rad2) debugger;
//let rad2=cns[l].rsO;
      let pt2=getPoint(rad2);
      if (nodes[i].rSet==RS0) {
	let cpx=R1/2*Math.cos(rad2.ca);
	let cpy=R1/2*Math.sin(rad2.ca);
	lpath.bezierCurveTo(0,-R1/2,cpx,cpy,pt2.x,pt2.y);
      } else {
        let mp=(rad.cr+rad2.cr)/2;
	let cpx1=mp*Math.cos(rad.ca);
	let cpy1=mp*Math.sin(rad.ca);
	let cpx2=mp*Math.cos(rad2.ca);
	let cpy2=mp*Math.sin(rad2.ca);
	lpath.bezierCurveTo(cpx1,cpy1,cpx2,cpy2,pt2.x,pt2.y);
      }
    }
  }
//  ctx.strokeStyle=colors[0];
  ctx.stroke(lpath);
  ctx.fillStyle=colors[1];
  ctx.fill(npath);
  ctx.fillStyle=colors[2];
  ctx.fill(n2path);
  ctx.fillStyle=colors[3];
  ctx.fill(n3path);
//drawText2();
}

/*
var reset=()=>{
}
*/

var nodes=[];	// nodes are used for drawing, only?

ctx.font="bold 11px sans-serif";
var drawText=()=>{	// diag
  //ctx.fillStyle="#BBB";
  ctx.fillStyle="black";
  for (let i=0; i<RS1.length; i++) ctx.fillText(i,RS1[i].x-1,RS1[i].y+2.5);
  for (let i=0; i<RS2.length; i++) ctx.fillText(i,RS2[i].x-1,RS2[i].y+2.5);
}

var drawPoint=(x,y)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,4,0,TP);
  ctx.fillStyle="red";
  ctx.fill();
}

var drawNodes2=()=>{	// diag
  let p=new Path2D();
  for (let i=0; i<RS2.length; i++) {
    let pt=getPoint(RS2[i]);
p.moveTo(pt.x,pt.y);
    p.arc(pt.x,pt.y,10,0,TP);
  }
  ctx.fillStyle="yellow";
  ctx.fill(p);
  ctx.fillStyle="black";
  for (let i=0; i<RS2.length; i++) {
    let pt=getPoint(RS2[i]);
    ctx.fillText(i,pt.x-1,pt.y+2.5);
  }
}

var drawText2=()=>{	// node indexes
  ctx.fillStyle="black";
  for (let i=0; i<nodes.length; i++) {
    let rad=nodes[i].rsO;
    let pt=getPoint(rad);
    ctx.fillText(i,pt.x-1,pt.y+2.5);
  }
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
//ctx.canvas.addEventListener("click", ()=>{ reset(); draw(); }, false);

var stopped=true;
var t=0;
var f=0;
var duration=400;
function animate(ts) {
  if (stopped) return;
  t++;
  f=t/duration;
  if (t==duration) {
    t=0;
    f=0;
    stopped=true;
return;
  }
  drwGrw();
  requestAnimationFrame(animate);
}

const R1=90;
const R2=190;
const R3=290;

const radii=[0,R1,R2,R3,390];

const NW=5;

var generateCounts2=()=>{	// Math.pow(2,n) to get to 32, i.e. sum(n)==5
  let c=[1];
  c.push([2,1,3,4][getRandomInt(0,4,true)]);
/*
  if (c[1]==2) {
    // 4 from  2 root of 32/2
    // 4 from  3 root of 32/2
    //let f1=4+(4-8*Math.random())/5;
    let f1=4-4*Math.random()/5;	
    c[2]=Math.round(c[1]*f1);
    let f2=4-4*Math.random()/5;	
    //let f2=4+(4-8*Math.random())/5;
    c[3]=Math.round(c[2]*f2);
    let f3=4-4*Math.random()/5;	
    c[4]=Math.round(c[3]*f3);
  //} else if (c[1]==1) {
  } else {
*/
    // ? from  2 root of 32/1	**increase 32 to ss
    let ff=Math.pow(36/c[1],1/3);  // 0.5 = 1/(NW-3)
    //let f1=ff+(ff-ff*2*Math.random())/5;	// /5 if +/- 20%
    let f1=ff-ff*Math.random()/5;	
    c[2]=Math.round(c[1]*f1);
    let f2=ff-ff*Math.random()/5;	
    c[3]=Math.round(c[2]*f2);
    let f3=ff-ff*Math.random()/5;	
    c[4]=Math.round(c[3]*f3);
//  }
  return c;
}

/*
var counts=[1,
  [2,1,3,4][getRandomInt(0,4,true)],
  getRandomInt(6,9),
  getRandomInt(9,14),
  getRandomInt(19,36)	// 36 cannot be larger than arc divisor
];
*/

var counts=generateCounts2();
//var count1=counts[1];
//var count2=counts[2];
//var count3=counts[3];
//var count4=counts[4];
console.log(counts);

var bSet=[[],[],[],[]];	// branchSet array covers branching arrays at each radial set

var setRandomBranchingN=(n)=>{
  let rb=[];
  for (let i=1; i<counts[n+1]; i++) rb.push(i); 
  bSet[n].push(0);
  bSet[n].push(counts[n+1]);
  for (let i=0; i<counts[n]-1; i++) {
    bSet[n].push(rb.splice(getRandomInt(0,rb.length),1)[0]);
  }
  bSet[n].sort((a,b)=>{ return a-b; });
}

var setNodes=()=>{
  nodes=[new Node(RS0,false,0,0)];
  for (let i=0; i<counts[1]; i++) {
    let node=new Node(RS1,nodes[0],i,1);
    nodes.push(node);
//    RS1[i].node=node;	// ? just for growth timing?
    for (let j=bSet[1][i]; j<bSet[1][i+1]; j++) {
      let node2=new Node(RS2,node,j,2);
      nodes.push(node2);
//      RS2[j].node=node2;
      for (let k=bSet[2][j]; k<bSet[2][j+1]; k++) {
        let node3=new Node(RS3,node2,k,3);
        nodes.push(node3);
//        RS3[k].node=node3;
        for (let l=bSet[3][k]; l<bSet[3][k+1]; l++) {
          let node4=new Node(RSA[4],node3,l,4);
          nodes.push(node4);
//          RS4[l].node=node4;
        }
      }
    }
  }
}

var getPoint=(rs)=>{
  return {
    "x":rs.r*Math.sin(rs.a)*Math.pow(Math.sin(rs.a/2),1.3),
    "y":rs.r*(Math.cos(rs.a)-1)
  }
}

var initRadialSets=()=>{
  let rsa=[[{"a":0,"r":0}]];
  for (let i=0; i<NW-1; i++) {
    let a=[];
    for (let j=0; j<counts[i+1]; j++) a.push({}); 
    rsa.push(a);
  }
  return rsa;
}

setRandomBranchingN(1);
setRandomBranchingN(2);
setRandomBranchingN(3);

/*
var RSA=[
  RS0=[{"a":0,"r":0}],
  (()=>{ let a=[]; for (let i=0; i<count1; i++) a.push({}); return a; })(),
  (()=>{ let a=[]; for (let i=0; i<count2; i++) a.push({}); return a; })(),
  (()=>{ let a=[]; for (let i=0; i<count3; i++) a.push({}); return a; })(),
  (()=>{ let a=[]; for (let i=0; i<count4; i++) a.push({}); return a; })(),
];
*/
let RSA=initRadialSets();
var RS0=RSA[0];
var RS1=RSA[1];
var RS2=RSA[2];
var RS3=RSA[3];
//var RS4=RSA[4];

var setRandomTerminals=()=>{
  let extraSet=[];
  let ss=36;	// spacing in radians/ss for full cycle,  make global const
  for (let i=0; i<ss; i++) extraSet.push(i);
  extraSet.sort((a,b)=>{ return Math.abs(a-ss/2)-Math.abs(b-ss/2); });
  // generate rr and sort
  for (let i=0; i<counts[counts.length-1]; i++) {
    let ai=extraSet.splice(getRandomInt(0,extraSet.length,true),1)[0];
    //RSA[RSA.length-1].a=ai*TP/ss;	// full cycle
    //RSA[RSA.length-1]].a=TP/8+ai*3*TP/4/ss; // 3/4 cycle
    let rso=RSA[RSA.length-1][i];
    rso.a=TP/4+ai*TP/2/ss;	// 1/2 cycle
    let rr=radii[radii.length-1]-(radii[radii.length-1]-radii[radii.length-2])/2*Math.random();	
    rso.r=rr;
    let pt=getPoint(rso);
    rso.ca=Math.atan2(pt.y,pt.x);
    rso.cr=Math.pow(pt.x*pt.x+pt.y*pt.y,0.5);
  }
  RSA[RSA.length-1].sort((a,b)=>{ return a.a-b.a; });
}

var setRandomRSN=(n)=>{
  for (let i=0; i<counts[n]; i++) {	// 3
    let angle=(RSA[n+1][bSet[n][i]].a+RSA[n+1][bSet[n][i+1]-1].a)/2;
    RSA[n][i].a=angle;	// 3
    RSA[n][i].r=radii[n]-(radii[n]-radii[n-1])/3*Math.random();	// 3 & 2
    let pt=getPoint(RSA[n][i]);
    RSA[n][i].ca=Math.atan2(pt.y,pt.x);
    RSA[n][i].cr=Math.pow(pt.x*pt.x+pt.y*pt.y,0.5);
  }
}

setRandomTerminals();
setNodes();
//setRandomRS4();
setRandomRSN(3);
setRandomRSN(2);
setRandomRSN(1);
//setRandomRS3();
//setRandomRS2();
//setRandomRS1();

onresize();

draw();

var drwGrw=()=>{
  ctx.clearRect(-CSIZE,0,2*CSIZE,-2*CSIZE);
  let lpath=new Path2D();
  for (let i=0; i<nodes.length; i++) {
    if (nodes[i].g) {
      //let rad=nodes[i].rsO;
      let pt=nodes[i].getPoint();

//      let rss=nodes[i].rsi;
      let cns=nodes[i].cna;
      for (let l=0; l<cns.length; l++) {	
//      for (let l=0; l<rss.length; l++) {	
	lpath.moveTo(pt.x,pt.y);
//	let rad2=rsc[rss[l]];
        let rad2=cns[l].rsO;
	let pt2=getPoint(rad2);
// TODO node specific f
        let x=(1-f)*pt.x+f*pt2.x;
        let y=(1-f)*pt.y+f*pt2.y;
        if (nodes[i].rSet==RS0) {
let fz=Math.pow(f,3);
//let fz=f;
	  let cpx=fz*R1/2*Math.cos((f)*rad2.ca);
	  let cpy=fz*R1/2*Math.sin((f)*rad2.ca);
//let cpx=R1/2*Math.cos(rad2.ca);
//let cpy=R1/2*Math.sin(rad2.ca);
	  lpath.bezierCurveTo(0,fz*-R1/2,cpx,cpy,x,y);
        } else {
        }
      }
    }	// growth nodes loop
  }
  ctx.stroke(lpath);
}
