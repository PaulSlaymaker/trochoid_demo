"use strict"; // Paul Slaymaker, paul25882@gmail.com
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
  c.width=c.height=2*CSIZE;
c.style.outline="1px dotted gray";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
//ctx.lineJoin="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=160;
  const CT=255-CBASE;
  this.getRGB=(c)=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1));
/*
    let red=Math.round(CBASE+CT*(this.fr*Math.cos(this.RK2+c/this.RK1)+(1-this.fr)*Math.cos(t/this.RK3)));
    let grn=Math.round(CBASE+CT*(this.fg*Math.cos(this.GK2+c/this.GK1)+(1-this.fg)*Math.cos(t/this.GK3)));
    let blu=Math.round(CBASE+CT*(this.fb*Math.cos(this.BK2+c/this.BK1)+(1-this.fb)*Math.cos(t/this.BK3)));
*/
    return "rgb("+red+","+grn+","+blu+")";
  }
/*
  this.randomizeF=()=>{
    this.RK3=1+5*Math.random();
    this.GK3=1+5*Math.random();
    this.BK3=1+5*Math.random();
    this.fr=1;//-Math.pow(0.9*Math.random(),3);
    this.fg=1;//-Math.pow(0.9*Math.random(),3);
    this.fb=1;//-Math.pow(0.9*Math.random(),3);
  }
*/
  this.randomize=()=>{
    this.RK1=30+30*Math.random();
    this.GK1=30+30*Math.random();
    this.BK1=30+30*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
//    this.randomizeF();
  }
  this.randomize();
}

var color=new Color();

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

var DUR=400;
var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  draw();
/*
if (t%200==0) {
  //reset();
//  stopped=true;
//  t=0;
}
*/
  requestAnimationFrame(animate);
}

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

const SQ2=Math.pow(2,0.5);	// 2*Math.sin(TP/8)

ctx.lineCap="round";
var DUR=1000;
var dash1,dash2,maxDash=120;;
//const DO1=0; //TP*Math.random();
var DO2=TP*Math.random();
const DT1=DUR;
var DT2=400+2000*Math.random();

var getDistance=(x1,y1,x2,y2)=>{
  let dx=x2-x1;
  let dy=y2-y1;
  return Math.pow(dx*dx+dy*dy,0.5);
}

onresize();

var ka=[
//  300,-300
//  (100+200*Math.random())*[-1,1][getRandomInt(0,2)],
//  (100+200*Math.random())*[-1,1][getRandomInt(0,2)]
];

var ka=new Array(3);
var kb=new Array(3);

var reset=()=>{
//  radiusArray.forEach((rr)=>{ if (rr.KA==1240) rr.KA=1162.5; });
  //kb[0]=100; kb[1]=-50;
//  for (let i=0; i<ka.length; i++) ka[i]=DUR*[-1,1][getRandomInt(0,2)];
//  for (let i=0; i<kb.length; i++) kb[i]=(100+100*Math.random())*[-1,1][getRandomInt(0,2)];
/*
  for (let i=0; i<pa.length; i++) {
    for (let j=0; j<pa[i].length; j++) {
       pa[i][j].KA=ka[(i)%2];
//pt.KA=ka[Math.floor(i%4/2)];
       pa[i][j].KB=kb[(j)%2];
      // reassing constants
    }
  }
*/
}

/*
function Dev() {
  this.ka=
  this.kb=
  this.r=
  this.a=
}
*/

var radmap2=new Map();

function Point(x,y) {
  this.px=x;
  this.py=y;
  //this.KA=(200+200*Math.random())*[-1,1][getRandomInt(0,2)];
  this.setLocation=()=>{
    //let a2=this.a<0?Math.PI-this.a:this.a;
let r2=this.radius.val;///2*(1+Math.cos(TP*t/600));
    //this.x=CSIZE+this.rad*Math.cos(this.a);
    //this.y=CSIZE+this.rad*Math.sin(this.a);
//pa[11][10].x
    //this.x=r2*Math.cos(this.a);
    //this.y=r2*Math.sin(this.a);
    //this.x=ra[this.radius.idx]*Math.cos(this.a);
    //this.y=ra[this.radius.idx]*Math.sin(this.a);
    this.x=ra[this.ridx]*Math.cos(this.a);
    this.y=ra[this.ridx]*Math.sin(this.a);
  }
  this.rad=getDistance(0,0,this.px,this.py);
  this.a=Math.atan2(this.py,this.px);
  let ds=this.rad.toFixed(1);
  if (!radmap2.get(ds)) {
    radmap2.set(ds,new Radius(this.rad));
  }
/*
  let rm=radmap2.get(ds);
  if (!rm) {
    radmap2.set(ds,new Radius(this.rad));
  } else rm.pts.push(this);
*/
  this.radius=radmap2.get(ds);
}

function Line(p1,p2) {
  this.getPath=()=>{
    let p=new Path2D();
    p.moveTo(p1.x,p1.y);
    p.lineTo(p2.x,p2.y);
    return p;
  }
}

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dmq=new DOMMatrix([0,1,-1,0,0,0]);
const getDualPath=(spath)=>{
  let p=new Path2D(spath);
  p.addPath(p,dmy);
  p.addPath(p,dmx);
  return p;
}
const getQuadPath=(spath)=>{
  let p=getDualPath(spath);
  p.addPath(p,dmq);
  return p;
}

function Quad(p1,p2,p3,p4) {
  this.getPath=()=>{
    let p=new Path2D();
    p.moveTo(p1.x,p1.y);
    p.lineTo(p2.x,p2.y);
    p.lineTo(p3.x,p3.y);
    p.lineTo(p4.x,p4.y);
    p.closePath();
//p.addPath(p,dmx);
    return getDualPath(p);
  }
  this.getAP=()=>{
    let as1=p2.x-p1.x
    let as2=p3.y-p2.y
    let as3=p4.x-p3.x
    let as4=p1.y-p4.y
    return Math.pow(as1*as1+as2*as2+as3*as3+as4*as4,0.5);
  }
}

var pa=new Array();

var count=5;
for (let j=0; j<=count; j++) {
  let pac=[];
  for (let i=0; i<=count; i++) {
    pac.push(new Point(j*CSIZE/count,i*CSIZE/count));
  }
  pa.push(pac);
}
pa[0][0].setLocation=()=>{ pa[0][0].x=0; pa[0][0].y=0; };
//pa[count][count].setLocation=()=>{ pa[count][count].x=CSIZE; pa[count][count].y=CSIZE; };

let radiusArray=Array.from(radmap2.values()).sort((a,b)=>{ return b.rad-a.rad; });
//console.log(radiusArray);
for (let i=0; i<radiusArray.length; i++) { 
  radiusArray[i].idx=i; 
}
for (let i=0; i<pa.length; i++) {
  for (let j=0; j<pa[i].length; j++) {
    pa[i][j].ridx=pa[i][j].radius.idx;
  }
}



/*
for (let i=0; i<pa.length; i++) {
  for (let j=0; j<pa[i].length; j++) {
    pa[i][j].ridx=pa[i][j].ridx=radmap2.get(pa.ds).idx; 
  }
}
pa.forEach((pt)=>{ pa.ridx=radmap2.get(pt.ds).idx; });
*/

let ra=new Array();
//radmap2.forEach((rm)=>{ ra.push(rm.rad); });
for (let i=0; i<radiusArray.length; i++) {
  ra.push(radiusArray[i].val);
}
ra.sort((a,b)=>{ return b-a; });
for (let i=0; i<pa.length; i++) {
  for (let j=0; j<pa[i].length; j++) {
    pa[i][j].ridx=pa[i][j].radius.idx;
  }
}

reset();

var setPointLocations=()=>{
  for (let i=0; i<pa.length; i++) {
    for (let j=0; j<pa[i].length; j++) pa[i][j].setLocation();
  }
}

var la=[];
/*
for (let j=0; j<pa.length; j++) {
  for (let i=0; i<pa[j].length; i++) {
    if (i<pa[j].length-1) la.push(new Line(pa[i][j],pa[i+1][j]));
    if (j<pa.length-1) la.push(new Line(pa[i][j],pa[i][j+1]));
  }
}
*/

var qa=[];

for (let j=0; j<pa.length-1; j++) {
  for (let i=0; i<pa[j].length-1; i++) {
    qa.push(new Quad(pa[i][j],pa[i+1][j],pa[i+1][j+1],pa[i][j+1]));
  }
}

/*
var radmap=new Map();
let cj=(pa.length-1)/2;
let ci=(pa[cj].length-1)/2;
let xc=pa[11][10].px;	
let yc=pa[11][10].py;
for (let i=0; i<pa.length; i++) {
  for (let j=0; j<pa[i].length; j++) {
    let d=getDistance(0,0,pa[i][j].px,pa[i][j].py);
    let ds=d.toFixed(1);
    let rm=radmap.get(ds);
    if (!rm) radmap.set(ds,{"d":d,"pts":[pa[i][j]]});
    else {
      rm.pts.push(pa[i][j]);
    }
    //pa[i][j].a=Math.atan2(pa[i][j].py-yc,pa[i][j].px-xc);	// symmetry for KA,KB
    pa[i][j].a=Math.atan2(pa[i][j].py,pa[i][j].px);	// symmetry for rad,a
  }
}
radmap.forEach((radval)=>{ radval.pts.sort((a,b)=>{ a.a-b.a; }); });
let sortedValues=Array.from(radmap.values()).sort((a,b)=>{ a.d-b.d; });
for (let i=0; i<sortedValues.length; i++) { sortedValues[i].pts.sort((a,b)=>{ a.a-b.a; }); }
*/

function Radius(r,pt) {
  this.rad=r;
  this.pts=[pt];
  //if (this.rad>200) this.KA=2400; else this.KA=1200;
  //this.KA=[1200,2400][getRandomInt(0,2)];
  //this.KB=[2400,4800][getRandomInt(0,2)];
  //this.KA=[1200,1240][getRandomInt(0,2)];
  //this.KA=1200;
  //this.KA=1200*[-1,1][getRandomInt(0,2)];
  //this.KA=2400; //+2400*Math.random();
  //this.KA=1200; //(1200+1200*Math.random())*[-1,1][getRandomInt(0,2)];
  this.KB=(5000+5000*Math.random())*[-1,1][getRandomInt(0,2)];
  this.KA=(1200+1200*Math.random())*[-1,1][getRandomInt(0,2)];
  this.KBO=TP*Math.random();
  //this.KB=(1200+r)*[-1,1][getRandomInt(0,2)];
  //this.KB=1200;
//this.ao=Math.asin(this.rad/(CSIZE*SQ2))
this.ao=Math.asin(this.rad/(CSIZE*SQ2)-1)
//this.ao=TP*Math.random();
  //this.val=r; //CSIZE*SQ2*Math.cos(t/this.KA);
//this.fk=TP*Math.random()/60;
  this.setValue=()=>{
    //let f=1-0.9*Math.sin(TP*4*t/this.KA);
    let f=3*Math.sin(this.KBO+TP*t/this.KB);
    //this.val=CSIZE*(Math.sin(this.ao-TP*t/this.KA));
    this.val=CSIZE/2*(1-Math.cos(f-TP*t/this.KA));
  }
  this.setValue();
}

ctx.strokeStyle="yellow";
ctx.lineWidth=1;

var draw=()=>{
  ra=new Array();
  radmap2.forEach((rm)=>{ 
    rm.setValue();  
    ra.push(rm.val); 
  });
  ra.sort((a,b)=>{ return b-a; });
//for (let i=0; i<radiusArray.length; i++) { ra.push(radiusArray[i].val); }
  setPointLocations();
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let pth=new Path2D();
  for (let i=0; i<qa.length; i++) {
    //pth.addPath(qa[i].getPath());
    let pth=qa[i].getPath();
//  ctx.strokeStyle=color.getRGB();
    ctx.fillStyle=color.getRGB(qa[i].getAP()+t/10);
    ctx.fill(pth);
    ctx.strokeStyle="black";
    ctx.stroke(pth);
  }
}

draw();

//ctx.font="bold 11px sans-serif";
ctx.font="bold 20px sans-serif";
ctx.textAlign="center";
var drawText=()=>{	// diag
  for (let i=0; i<lines.length; i++) {
    ctx.fillText(i,lines[i].mx,lines[i].my);
  }
}

//for (let i=0; i<ra.length; i++) { console.log(ra[i].toFixed(0), radiusArray[i].val.toFixed(0)); }
