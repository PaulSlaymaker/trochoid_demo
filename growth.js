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
//ctx.setLineDash([8,8]);

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

var Node=function(pNode,ridx,rsdx) {
  this.rsdx=rsdx;
  this.rSet=RSA[rsdx];
  this.rsO=RSA[rsdx][ridx];
this.rsO.node=this;
  this.cna=[];  // child node array
  this.time=-rsdx*duration;
  this.g=false;
  if (pNode) {
    pNode.cna.push(this);
  }
  else this.g=true;
  this.getPoint=()=>{
    return {
      //"x":this.rsO.r*Math.sin(this.rsO.a)*Math.pow(Math.sin(this.rsO.a/2),1.3),
      //"x":this.rsO.r*Math.sin(this.rsO.a)*Math.sin(this.rsO.a/2),
      "x":this.rsO.r*Math.sin(this.rsO.a),
      "y":this.rsO.r*(Math.cos(this.rsO.a)-1)
    };
  }
  this.getFrac=()=>{
    if ((this.time+t)<0) return 0;
    if ((this.time+t)<duration) return (this.time+t)/duration;
    if ((this.time+t)>duration) return 1;
  }
}

var draw=()=>{
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let n1path=new Path2D();
  let n2path=new Path2D();
  let n3path=new Path2D();
  let npa=[n1path,n2path,n3path];
  let lpath=new Path2D();
  for (let i=0; i<nodes.length; i++) {
    let rad=nodes[i].rsO;
    let pt=nodes[i].getPoint();
if (nodes[i].cna.length==0) {
  npa[i%3].arc(pt.x,pt.y,7,0,TP);
  npa[i%3].closePath();
}
//    npa[nodes[i].rsdx%3].arc(pt.x,pt.y,7,0,TP);
//    npa[nodes[i].rsdx%3].closePath();
    let cns=nodes[i].cna;
      for (let l=0; l<cns.length; l++) {	
//    for (let l=0; l<rss.length; l++) {	
      lpath.moveTo(pt.x,pt.y);
      // let rad2=nodes[i].cna[l].rsO;
//      let rad2=rsc[rss[l]];
      let rad2=cns[l].rsO;
//      let pt2=getPoint(rad2);
let pt2=cns[l].getPoint();
      if (nodes[i].rsdx==0) {
	let cpx=radii[1]/2*Math.cos(rad2.ca);
	let cpy=radii[1]/2*Math.sin(rad2.ca);
	lpath.bezierCurveTo(0,-radii[1]/2,cpx,cpy,pt2.x,pt2.y);
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
  ctx.fill(n1path);
  ctx.fillStyle=colors[2];
  ctx.fill(n2path);
  ctx.fillStyle=colors[3];
  ctx.fill(n3path);
//drawText2();
}

var nodes=[];	// nodes are used for drawing, only?

var drawPoint=(x,y)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,4,0,TP);
  ctx.fillStyle="red";
  ctx.fill();
}

ctx.font="bold 10px sans-serif";
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
var duration=300;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t==2*duration) {
    t=0;
    stopped=true;
return;
  }
  drwGrw();
  requestAnimationFrame(animate);
}

const NW=8;

//const radii=[0,70,150,230,310,390];
const radii=[];
let r=390/(NW-1);
for (let i=0; i<NW-1; i++) {
  radii.push(i*r);
}

const segmentCount=40;

var generateCounts2=()=>{	// Math.pow(2,n) to get to 32, i.e. sum(n)==5
  let c=[1];
  c.push([2,1,3,4][getRandomInt(0,4,true)]);

    // ? from  2 root of 32/1	**increase 32 to ss
    let ff=Math.pow(segmentCount/c[1],1/(NW-2));  // 0.5 = 1/(NW-3)
    for (let i=0; i<NW-2; i++) {
      let f1=ff-ff*Math.random()/5;	
      c.push(Math.round(c[c.length-1]*f1));
    }
/*
    let f1=ff-ff*Math.random()/5;	
    c[2]=Math.round(c[1]*f1);
    let f2=ff-ff*Math.random()/5;	
    c[3]=Math.round(c[2]*f2);
    let f3=ff-ff*Math.random()/5;	
    c[4]=Math.round(c[3]*f3);
*/

console.log(c);
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

var bSet=[];	// branchSet array covers branching arrays at each radial set
for (let i=0; i<NW-1; i++) bSet.push([]);
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

var bSet2=[];	// branchSet array covers branching arrays at each radial set
for (let i=0; i<NW-1; i++) bSet2.push([]);
var setRandomBranching2=(n)=>{
  bSet2[n]=[];
  let sum=0;
  for (let i=0; i<counts[n]-1; i++) {
    let bc=getRandomInt(0,Math.min(counts[n+1]-sum,Math.round(counts[n+1]/2)),true);
    sum+=bc;
    bSet2[n].splice(getRandomInt(0,bSet2[n].length+1),0,bc);
  }
  bSet2[n].splice(getRandomInt(0,bSet2[n].length+1),0,counts[n+1]-sum);
}

var setNN=(pn,c,w)=>{
  if (w==NW-1) return;
//if (bSet[w]==undefined) debugger;
  for (let i=bSet[w][c]; i<bSet[w][c+1]; i++) { 
//if (Math.random()<0.1) continue; // remove RAD[w+1][i]?, count--
    let n=new Node(pn,i,w+1);
    nodes.push(n);
    setNN(n,i,w+1);
  }
}

var setNodes=()=>{
  nodes=[new Node(false,0,0)];
  for (let i=0; i<counts[1]; i++) {
    let node=new Node(nodes[0],i,1);
    nodes.push(node);
    setNN(node,i,1);
  }
}

var setNN2=(pn,w)=>{
  if (w==NW-1) return;
  for (let i=0; i<bSet2[w].length; i++) {
    let n=new Node(pn,i,w);
    nodes.push(n);
    RSA[w].push({"node":node});	// RSA object creation here
    setNN2(n,w+1);
  }
}

// need RSA initialized to new Array(NW-1),
var setNodes2=()=>{
  nodes=[new Node(false,0,0)];
  RSA[0]=[{"node":nodes[0]}];
  setNN2(nodes[0],1);
/*
  for (let i=0; i<bSet2[1].length; i++) {
    let node=new Node(nodes[0],i,1);
    nodes.push(node);
    RSA[1].push({"node":node});
    for (let j=0; j<bSet2[2].length; j++) {
      let node=new Node(node,j,2);
      nodes.push(node);
      RSA[2].push({"node":node});
    }
  }
*/
}

var getPoint=(rs)=>{
if (rs==undefined) debugger;
  return {
    //"x":rs.r*Math.sin(rs.a)*Math.pow(Math.sin(rs.a/2),1.3),
    //"x":rs.r*Math.sin(rs.a)*Math.sin(rs.a/2),
    "x":rs.r*Math.sin(rs.a),
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

for (let i=1; i<NW-1; i++) {
  setRandomBranchingN(i);
setRandomBranching2(i);
}
console.log(bSet2);

let RSA=initRadialSets();
var RS0=RSA[0];
var RS1=RSA[1];
var RS2=RSA[2];

var setRandomTerminals=()=>{
  let extraSet=[];
  let ss=segmentCount;	// spacing in radians/ss for full cycle,  make global const
  for (let i=0; i<ss; i++) extraSet.push(i);
  extraSet.sort((a,b)=>{ return Math.abs(a-ss/2)-Math.abs(b-ss/2); });
  // generate rr and sort
  for (let i=0; i<counts[counts.length-1]; i++) {
    //let ai=extraSet.splice(getRandomInt(0,extraSet.length,true),1)[0];
//let ai=extraSet.splice(getRandomInt(0,extraSet.length),1)[0];
    //RSA[RSA.length-1].a=ai*TP/ss;	// full cycle
    let rso=RSA[RSA.length-1][i];
    //rso.a=TP/8+ai*3*TP/4/ss; // 3/4 cycle
    //rso.a=TP/4+ai*TP/2/ss;	// 1/2 cycle
    //rso.a=TP*3/8+ai*TP/4/ss;	// 1/4 cycle
    //rso.a=TP/3+ai*TP/3/ss;	// 1/3 cycle
rso.a=TP/3+i/counts[counts.length-1]*TP/3;	// non-random, 1/3 cycle
//    let rr=radii[radii.length-1]-(radii[radii.length-1]-radii[radii.length-2])/2*Math.random();	
//    rso.r=rr;
rso.r=390;
    let pt=getPoint(rso);
    rso.ca=Math.atan2(pt.y,pt.x);
    rso.cr=Math.pow(pt.x*pt.x+pt.y*pt.y,0.5);
  }
  RSA[RSA.length-1].sort((a,b)=>{ return a.a-b.a; });
}

var setRandomRSN=(n)=>{
  // use RSA[n].length TODO
  for (let i=0; i<RSA[n].length; i++) {	// 3
    // take arbitrary minimum angle: 0.1, TODO applies only to 1 radius  (r3 close to 0.1)
    // multiply by counts/2 to get start
    // fill angle by start+i*0.1; 
    let d=0.1*400/radii[n];	// R0 never called
    let start=TP/2-counts[n]/2*d;
    let angle=start+i*d;
//    let angle=(RSA[n+1][bSet[n][i]].a+RSA[n+1][bSet[n][i+1]-1].a)/2;

    RSA[n][i].a=angle;	// 3
    //RSA[n][i].r=radii[n]-(radii[n]-radii[n-1])/3*Math.random();	// 3 & 2
RSA[n][i].r=radii[n];
    let pt=getPoint(RSA[n][i]);
    RSA[n][i].ca=Math.atan2(pt.y,pt.x);
    RSA[n][i].cr=Math.pow(pt.x*pt.x+pt.y*pt.y,0.5);
  }
}

setRandomTerminals();
setNodes();
for (let i=NW-2; i>0; i--) {
setRandomRSN(i);
}
/*
setRandomRSN(3);
setRandomRSN(2);
setRandomRSN(1);
*/

let RSAl=RSA[RSA.length-1];
let amax=0;
let da=[];
for (let i=0; i<RSAl.length-1; i++) {
  da.push(RSAl[i+1].a-RSAl[i].a);
  amax=Math.max(amax,400*(RSAl[i+1].a-RSAl[i].a));
//  console.log(RSAl[i].a);
}
//console.log(da);
console.log(amax);

/*
//var showRSASeg=(ri)=>{
  for (let i=0; i<RSA.length; i++) {
    console.log(i+" "+radii[i]*(RSA[i][RSA[i].length-1].a-RSA[i][0].a)/counts[i]);
  }
//}
*/

onresize();

draw();

var drwGrw=()=>{
  ctx.clearRect(-CSIZE,0,2*CSIZE,-2*CSIZE);
  let lpath=new Path2D();
  let drawn=0;
  for (let i=0; i<nodes.length; i++) {
    let f=nodes[i].getFrac();
    //if (nodes[i].time+t<duration) {	// use f
    if (f>0) {
      let pt=nodes[i].getPoint();
      let cns=nodes[i].cna;
      for (let l=0; l<cns.length; l++) {	
	lpath.moveTo(pt.x,pt.y);
        let rad2=cns[l].rsO;
	//let pt2=getPoint(rad2);
        let pt2=cns[l].getPoint();
// TODO node specific f
        let x=(1-f)*pt.x+f*pt2.x;
        let y=(1-f)*pt.y+f*pt2.y;
        let fz=Math.pow(f,3);
        if (nodes[i].rsdx==0) {
//let fz=f;
	  let cpx=fz*radii[1]/2*Math.cos((f)*rad2.ca);
	  let cpy=fz*radii[1]/2*Math.sin((f)*rad2.ca);
	  lpath.bezierCurveTo(0,fz*-radii[1]/2,cpx,cpy,x,y);
        } else {
          let rad=nodes[i].rsO;
	  let mp=fz*(rad.cr+rad2.cr)/2;
	  let cpx1=mp*Math.cos(rad.ca);
	  let cpy1=mp*Math.sin(rad.ca);
	  let cpx2=mp*Math.cos(rad2.ca);
	  let cpy2=mp*Math.sin(rad2.ca);
        let x=(1-f)*pt.x+f*pt2.x;
        let y=(1-f)*pt.y+f*pt2.y;
	  lpath.bezierCurveTo(cpx1,cpy1,cpx2,cpy2,x,y);
        }
        drawn++;      
      }
    }	// growth nodes loop
  }
  ctx.stroke(lpath);
  return drawn;
}

/*
let test=[];
let sum=0;
for (let i=0; i<counts[NW-2]-1; i++) {
  let bc=getRandomInt(0,Math.min(counts[NW-1]-sum,Math.round(counts[NW-1]/2)),true);
  //let bc=getRandomInt(0,counts[NW-1]-sum,true);
//console.log(counts[NW-1]-sum);
  sum+=bc;
  //test.push(bc);	// random splice
  test.splice(getRandomInt(0,test.length+1),0,bc);
}
test.splice(getRandomInt(0,test.length+1),0,counts[NW-1]-sum);
//test.push(counts[NW-1]-sum);
console.log(test.reduce((p,c)=>{ return p+c; }, 0));
console.log(test);
*/
