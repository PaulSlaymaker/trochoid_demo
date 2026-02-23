"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
const TP=2*Math.PI;
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
ctx.lineCap="round";

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
  const CT=256-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=100+400*Math.random();
    this.GK1=100+400*Math.random();
    this.BK1=100+400*Math.random();
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

function Point(i,j,r) {
  this.i=i;
  this.j=j;
  this.x=i*r;
  this.y=j*r;
  this.key=i+","+j;
}

function GP(spt1,spt2,dpt1,dpt2,ka) {	// add dash, dash offset rate?
  this.spt1=spt1;
  this.spt2=spt2;
  this.dpt1=dpt1;
  this.dpt2=dpt2;
  this.type=Math.round(Math.random()); 
  this.getPath=()=>{
    if (this.type) return this.getPath1();
    else return this.getPath2();
  }
  this.getPath1=()=>{
// set sx,sy before drawing?
    let sx=(this.spt1.x+this.spt2.x)/2;
    let sy=(this.spt1.y+this.spt2.y)/2;
    let p=new Path2D();
    let x=f*(this.dpt1.x+this.dpt2.x)/2+(1-f)*sx;
    let y=f*(this.dpt1.y+this.dpt2.y)/2+(1-f)*sy;
    p.moveTo(x,y);
    p.lineTo(f*this.dpt1.x+(1-f)*sx,f*this.dpt1.y+(1-f)*sy);
    p.lineTo(this.spt1.x,this.spt1.y);
    p.moveTo(x,y);
    p.lineTo(f*this.dpt2.x+(1-f)*sx,f*this.dpt2.y+(1-f)*sy);
    p.lineTo(this.spt2.x,this.spt2.y);
    return p;
  }
  this.getPath2=()=>{
    let sx=(this.spt1.x+this.spt2.x)/2;
    let sy=(this.spt1.y+this.spt2.y)/2;
    let p=new Path2D();
    p.moveTo(this.spt1.x,this.spt1.y);
    p.lineTo(f*this.dpt1.x+(1-f)*sx,f*this.dpt1.y+(1-f)*sy);
    let x=f*(this.dpt1.x+this.dpt2.x)/2+(1-f)*sx;
    let y=f*(this.dpt1.y+this.dpt2.y)/2+(1-f)*sy;
    p.lineTo(x,y);
    p.moveTo(this.spt2.x,this.spt2.y);
    p.lineTo(f*this.dpt2.x+(1-f)*sx,f*this.dpt2.y+(1-f)*sy);
    p.lineTo(x,y);
    return p;
  }
  this.keyOnGrid=(key)=>{
    if (key.includes("-1")) return false;
    if (key.includes(ka.nmax+1)) return false;
    return true;
  }
  this.grow=()=>{
    let pa=[];
    if (this.dpt1.i-this.dpt2.i) {
      let k1=this.dpt1.i+","+(this.dpt1.j-1);
      let k2=this.dpt2.i+","+(this.dpt2.j-1);
      if (k1==this.spt1.key) {
        k1=this.dpt1.i+","+(this.dpt1.j+1);
        k2=this.dpt2.i+","+(this.dpt2.j+1);
      }
      if (this.keyOnGrid(k1)) pa.push([k1,k2,0]);
// left and right
      k1=(this.dpt1.i+1)+","+this.dpt1.j;
      k2=(this.spt1.i+1)+","+this.spt1.j;
      if (k1==this.dpt2.key) {
	k1=(this.dpt1.i-1)+","+this.dpt1.j;
	k2=(this.spt1.i-1)+","+this.spt1.j;
      }
      if (this.keyOnGrid(k1)) pa.push([k1,k2,1]);
      k1=(this.dpt2.i+1)+","+this.dpt2.j;
      k2=(this.spt2.i+1)+","+this.spt2.j;
      if (k1==this.dpt1.key) {
	k1=(this.dpt2.i-1)+","+this.dpt2.j;
	k2=(this.spt2.i-1)+","+this.spt2.j;
      }
      if (this.keyOnGrid(k1)) pa.push([k1,k2,2]);
    } else {
      let k1=(this.dpt1.i+1)+","+this.dpt1.j;
      let k2=(this.dpt2.i+1)+","+this.dpt2.j;
      if (k1==this.spt1.key) {
        k1=(this.dpt1.i-1)+","+this.dpt1.j;
        k2=(this.dpt2.i-1)+","+this.dpt2.j;
      }
      if (this.keyOnGrid(k1)) pa.push([k1,k2,0]);
      // up and down
      k1=this.dpt1.i+","+(this.dpt1.j+1);
      k2=this.spt1.i+","+(this.spt1.j+1);
      if (k1==this.dpt2.key) {
	k1=this.dpt1.i+","+(this.dpt1.j-1);
	k2=this.spt1.i+","+(this.spt1.j-1);
      }
      if (this.keyOnGrid(k1)) pa.push([k1,k2,1]);
      k1=this.dpt2.i+","+(this.dpt2.j+1);
      k2=this.spt2.i+","+(this.spt2.j+1);
      if (k1==this.dpt1.key) {
	k1=this.dpt2.i+","+(this.dpt2.j-1);
	k2=this.spt2.i+","+(this.spt2.j-1);
      }
      if (this.keyOnGrid(k1)) pa.push([k1,k2,2]);
    }

//console.log("pa",pa);
/*
for (let i=0; i<pa.length; i++) {
  let pt1=ka.pm.get(pa[i][0]);
if (!pt1) debugger;
  drawPoint(pt1.x,pt1.y,"white");
  pt1=ka.pm.get(pa[i][1]);
if (!pt1) debugger;
  drawPoint(pt1.x,pt1.y,"white");
}
*/

    let pda=pa[getRandomInt(0,pa.length)];
    if (pda[2]==0) {
      this.spt1=this.dpt1;        
      this.spt2=this.dpt2;        
      this.dpt1=ka.pm.get(pda[0]);
      this.dpt2=ka.pm.get(pda[1]);
      return this;
    } else if (pda[2]==1) {
      this.spt2=this.spt1;        
      this.spt1=this.dpt1;        
      this.dpt1=ka.pm.get(pda[0]);
      this.dpt2=ka.pm.get(pda[1]);
      return this;
    } else if (pda[2]==2) {
      this.spt1=this.spt2;        
      this.spt2=this.dpt2;        
      this.dpt1=ka.pm.get(pda[1]);
      this.dpt2=ka.pm.get(pda[0]);
      return this;
    }
  }
/*
  this.show=()=>{	// diag
    drawPoint(this.spt1.x,this.spt1.y,"green",2);
    drawPoint(this.spt2.x,this.spt2.y,"cyan",2);
    drawPoint(this.dpt1.x,this.dpt1.y,"magenta",2);
    drawPoint(this.dpt2.x,this.dpt2.y,"magenta",2);
  }
*/
}

var createPoints=()=>{
  //let ra=[180,120,90,72];
  let ra=[180,120,90];
  let ka=[];
  for (let i=0; i<ra.length; i++) {
    let pm=new Map(), pa=[];
    for (let j=0; j<=CSIZE/ra[i]; j++) {
      for (let k=0; k<=CSIZE/ra[i]; k++) {
        let pt=new Point(j,k,ra[i]);
        pa.push(pt);
        pm.set(pt.key,pt);
      }
    }
    ka.push({"R":ra[i],"nmax":CSIZE/ra[i],"pa":pa,"pm":pm});
  }
  return ka;
}
var kseta=createPoints();

/*
ctx.font="9px sans-serif";
ctx.textAlign="center";
var drawPoints=()=>{
  KA.pa.forEach((pt)=>{
    drawPoint(pt.x,pt.y);
    ctx.fillStyle="silver";
    ctx.fillText(pt.i+","+pt.j,pt.x,pt.y-6);
  });
}
*/

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
  //if (EM) { parent.postMessage("lf"); return; }
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var DUR=80;	// f(KM.R)	// 120:80, 180:120
var f=0;
var t=0;
var c=0;

var animate=(ts)=>{
  if (stopped) return;
  //for (let i=0; i<gpa.length; i++) {
  //  gpa[i].t++;
  //}
  t++,c++;
  if (t>DUR) {
    t=0;
    for (let i=0; i<gpa.length; i++) {
//      gpa[i]=
      gpa[i].grow();
//      if (!gpa[i]) { gpa[i]=generateGrowthPoint(); debugger; }
      gpa[i].type=Math.round(Math.random());
    }
    cf=(1+2*Math.random())/2;
    df=0.5+1.5*Math.random();
    df2=0.5+1.5*Math.random();
    if (Math.random()<0.1) { 
      pauseTS=performance.now()+4000;
      requestAnimationFrame(pause);
      return; 
    }
  }
  f=t/DUR;
  //f=Math.pow(Math.sin(TP/4*t/DUR),0.9);
//  f=Math.pow(t/DUR,0.1);
  draw();
  requestAnimationFrame(animate);
}

var transformPath=(pth)=>{
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  let p=new Path2D(pth);
  p.addPath(p,dmx);
  p.addPath(p,dmy);
p.addPath(p,new DOMMatrix([0,1,-1,0,0,0]));
  return p;
}

var cf=(1+2*Math.random())/2;
console.log("cf",cf);
var draw=()=>{
  let p=transformPath(gpa[0].getPath());
  for (let i=1; i<gpa.length; i++) { p.addPath(transformPath(gpa[i].getPath())); }
  ctx.setLineDash([df2*KA.R,df*KA.R]);
  ctx.lineDashOffset=-c*cf;
  ctx.lineWidth=9;
  ctx.strokeStyle="#0000000C";
  ctx.stroke(p);
  ctx.lineWidth=2;
  ctx.strokeStyle=color.getRGB();
  ctx.stroke(p);
}

onresize();

var KA=kseta[1];

var generateGrowthPoint=(init)=>{
  const dir=[[1,0],[-1,0],[0,1],[0,-1]];
  var point=init?KA.pa[0]:KA.pa[getRandomInt(0,KA.pa.length)];
  let ridx=getRandomInt(0,4);
  let pt2;
  for (let i=0; i<4; i++) {
    let idx=(i+ridx)%4;
    pt2=KA.pm.get((point.i+dir[idx][0])+","+(point.j+dir[idx][1]));
    if (pt2) {
      let d=Math.random()<0.5?-1:1;
      if (point.i-pt2.i) {
        if (point.j==0) d=1;
        else if (point.j>=KA.nmax) d=-1;
        let dpt1=KA.pm.get(point.i+","+(point.j+d));
        let dpt2=KA.pm.get(pt2.i+","+(pt2.j+d));
        return new GP(point,pt2,dpt1,dpt2,KA);
      } else {
        if (point.i==0) d=1;
        else if (point.i>=KA.nmax) d=-1;
        let dpt1=KA.pm.get((point.i+d)+","+point.j);
        let dpt2=KA.pm.get((pt2.i+d)+","+pt2.j);
        return new GP(point,pt2,dpt1,dpt2,KA);
      }
      break;
    }
  }
  return false;
}

//drawPoints();

//ctx.setLineDash([KA.R,1.3*KA.R]);
let df=0.5+1.5*Math.random();
let df2=0.5+1.5*Math.random();
ctx.setLineDash([df2*KA.R,df*KA.R]);

let gp=generateGrowthPoint(true);
var gpa=[gp,generateGrowthPoint(),generateGrowthPoint(),generateGrowthPoint()];

start();

