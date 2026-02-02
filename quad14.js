"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/WNWzBKL
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
//c.style.outline="1px dotted gray";
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
  const CBASE=160;
  const CT=255-CBASE;
  this.getRGB=(c)=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=30+30*Math.random();
    this.GK1=30+30*Math.random();
    this.BK1=30+30*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
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

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  draw();
  if (EM && t%100==0) {
    stopped=true;
    parent.postMessage("lf");
  }
  requestAnimationFrame(animate);
}

const SQ2=Math.pow(2,0.5);	// 2*Math.sin(TP/8)

//ctx.lineCap="round";

var getDistance=(x1,y1,x2,y2)=>{
  let dx=x2-x1;
  let dy=y2-y1;
  return Math.pow(dx*dx+dy*dy,0.5);
}

var radmap=new Map();

function Point(x,y) {
  this.px=x;
  this.py=y;
  //this.KA=(200+200*Math.random())*[-1,1][getRandomInt(0,2)];
  this.setLocation=(ra)=>{
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
  if (!radmap.get(ds)) {
    radmap.set(ds,new Radius(this.rad));
  }
/*
  let rm=radmap.get(ds);
  if (!rm) {
    radmap.set(ds,new Radius(this.rad));
  } else rm.pts.push(this);
*/
  this.radius=radmap.get(ds);
}

const getDualPath=(spath)=>{
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  let p=new Path2D(spath);
  p.addPath(p,dmy);
  p.addPath(p,dmx);
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
    return getDualPath(p);
  }
  this.getAP=()=>{	// area proxy
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

let radiusArray=Array.from(radmap.values()).sort((a,b)=>{ return b.rad-a.rad; });
for (let i=0; i<radiusArray.length; i++) { 
  radiusArray[i].idx=i; 
}
for (let i=0; i<pa.length; i++) {
  for (let j=0; j<pa[i].length; j++) {
    pa[i][j].ridx=pa[i][j].radius.idx;
  }
}

/*
var setPointLocations=(ra)=>{
  for (let i=0; i<pa.length; i++) {
    for (let j=0; j<pa[i].length; j++) pa[i][j].setLocation(ra);
  }
}
*/

var qa=[];

for (let j=0; j<pa.length-1; j++) {
  for (let i=0; i<pa[j].length-1; i++) {
    qa.push(new Quad(pa[i][j],pa[i+1][j],pa[i+1][j+1],pa[i][j+1]));
  }
}

function Radius(r) {
  this.rad=r;
//  this.pts=[pt];
  this.KB=(15000+15000*Math.random())*[-1,1][getRandomInt(0,2)];
  this.KA=(1200+1200*Math.random())*[-1,1][getRandomInt(0,2)];
  this.KBO=TP*Math.random();
//this.ao=Math.asin(this.rad/(CSIZE*SQ2))
//this.ao=Math.asin(this.rad/(CSIZE*SQ2)-1)
  this.setValue=()=>{
    let f=3*Math.sin(this.KBO+TP*t/this.KB);
    //this.val=CSIZE*(Math.sin(this.ao-TP*t/this.KA));
    this.val=CSIZE/2*(1-Math.cos(f-TP*t/this.KA));
  }
  this.setValue();
}

ctx.strokeStyle="black";
var draw=()=>{
  let ra=new Array();
  radmap.forEach((rm)=>{ 
    rm.setValue();  
    ra.push(rm.val); 
  });
  ra.sort((a,b)=>{ return b-a; });
//for (let i=0; i<radiusArray.length; i++) { ra.push(radiusArray[i].val); }
  //setPointLocations(ra);
  for (let i=0; i<pa.length; i++) for (let j=0; j<pa[i].length; j++) pa[i][j].setLocation(ra);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<qa.length; i++) {
    let pth=qa[i].getPath();
    ctx.fillStyle=color.getRGB(qa[i].getAP()+t/10);
    ctx.fill(pth);
    ctx.stroke(pth);
  }
}

onresize();

start();
