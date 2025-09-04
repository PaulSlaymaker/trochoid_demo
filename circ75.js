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
//ctx.lineCap="round";
//ctx.globalCompositeOperation="destination-over";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=174;
  const CT=255-CBASE;
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(o+this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(o+this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(o+this.BK2+t/this.BK1));
/*
    let red=Math.round(CBASE+CT*(this.fr*Math.cos(o+this.RK2+t/this.RK1)+(1-this.fr)*Math.cos(t/this.RK3)));
    let grn=Math.round(CBASE+CT*(this.fg*Math.cos(o+this.GK2+t/this.GK1)+(1-this.fg)*Math.cos(t/this.GK3)));
    let blu=Math.round(CBASE+CT*(this.fb*Math.cos(o+this.BK2+t/this.BK1)+(1-this.fb)*Math.cos(t/this.BK3)));
*/
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomizeF=()=>{
    this.RK3=1+2*Math.random();
    this.GK3=1+2*Math.random();
    this.BK3=1+2*Math.random();
    this.fr=1-Math.pow(Math.random(),3);
    this.fg=1-Math.pow(Math.random(),3);
    this.fb=1-Math.pow(Math.random(),3);
  }
  this.randomize=()=>{
    this.RK1=200+400*Math.random();
    this.GK1=200+400*Math.random();
    this.BK1=200+400*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
//    this.randomizeF();
  }
  this.randomize();
}

var color=new Color();
var color2=new Color();
color2.RK1=40+80*Math.random();
color2.GK1=40+80*Math.random();
color2.BK1=40+80*Math.random();

//const MAXR=CSIZE;
const MAXR=180;
//const MAXR=CSIZE/2;

function Circle(gc,d) {
  this.gc=gc;
  if (gc==0) {
    this.dir=d;
    this.a1=d==-1?0:TP/2;
    this.cl=0;
  } else {
    this.cl=gc.cl+1;
  }
let st=80-6*Math.random()*this.cl;//75+10*Math.random();
let lt=320-6*Math.random()*this.cl; //300+40*Math.random();
  let akf=this.cl/NCOUNT;
  this.KA1=akf*st+(1-akf)*lt;
  //this.KA1=80+240*Math.random();
  this.KA2=TP*Math.random();
  //this.KR1=80+240*Math.random();
  this.KR1=akf*st+(1-akf)*lt;
  this.KR2=TP*Math.random();
  this.setAR=()=>{
    //this.r=MAXR+MAXR/2+MAXR/2*Math.sin(this.KR2+t/this.KR1);
//this.r=MAXR+MAXR*Math.sin(this.KR2+t/this.KR1);
this.r=10+(MAXR+MAXR*Math.sin(this.KR2+t/this.KR1))/Math.pow(rd,this.cl);
    if (gc==0) {
      if (d==-1) {
	this.a2=-(TP/48+TP/32+TP/32*Math.sin(this.KA2+t/this.KA1));	// FIXME
      } else { 
	this.a2=TP/48+TP/32+TP/32*Math.sin(this.KA2+t/this.KA1);	// FIXME
	this.a2+=TP/2;
	this.a2=this.a2%TP;
      }
      this.x=d*this.r;	
      this.y=0;
      this.dist=this.r*(this.dir*(this.a2-this.a1));
    } else {
      this.dir=-gc.dir;
      //this.x=gc.x-this.dir*(gc.r+this.r)*Math.cos(gc.a2);
      this.x=gc.x+(gc.r+this.r)*Math.cos(gc.a2);
      this.y=gc.y+(gc.r+this.r)*Math.sin(gc.a2);
      this.a1=(gc.a2+TP/2)%TP; 
      let aff=Math.pow((this.cl-1)/NCOUNT,0.2);
      let af=(1-aff)*32+aff*3;
//console.log(af);
//this.a2=TP/2-gc.a2+TP/32+TP/32*Math.sin(this.KA2+t/this.KA1);
      //if (this.dir==-1) this.a2=this.a1+this.dir*TP/8*(1+Math.sin(this.KA2+t/this.KA1));
      //else this.a2=this.a1+TP/8*(1+Math.sin(this.KA2+t/this.KA1));	// FIXME
      this.a2=this.a1+this.dir*TP/af*(1+Math.sin(this.KA2+t/this.KA1));
      if (this.a2<0) this.a2+=TP;
      //let and=this.dir*(this.a2-this.a1);
      let and=Math.abs(this.a2-this.a1);
      if (and>Math.PI) {
//console.log(this.dir+" "+this.a1+" "+this.a2);
//console.log(and);
        and=TP-and;
//console.log(and);
}
      //this.dist=this.r*(this.dir*(this.a2-this.a1));
      this.dist=this.r*and+gc.dist;
if (this.dist<0) debugger;
    }
  }
  this.setAR();	// remove?
  this.getCirclePath=()=>{
    let p=new Path2D();
    p.arc(this.x,this.y,this.r,0,TP);
    return p;
  }
  var getPath=()=>{
    let p=new Path2D();
    let xp1=this.x+this.r*Math.cos(this.a1);	// calc in setAR?
/*
    let yp1=this.ca[n].y+this.ca[n].r*Math.sin(this.ca[n].a1);
    this.path.moveTo(xp1,yp1);
    this.ca[n].setPath(p);
*/
    return p;
  } 
  this.report=()=>{
    ctx.strokeStyle="white";
    ctx.lineWidth=0.5;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,TP);
    ctx.stroke();
    let xp1=this.x+this.r*Math.cos(this.a1);
    let yp1=this.y+this.r*Math.sin(this.a1);
    //console.log("xp1 "+xp1.toFixed(0),yp1.toFixed(0));
    console.log("a1 "+this.a1.toFixed(2));
    drawPoint(xp1,yp1,"blue",3);
    let xp2=this.x+this.r*Math.cos(this.a2);
    //let yp2=this.y-this.r*Math.sin(this.a2);
//let yp2=this.y+this.dir*this.r*Math.sin(this.a2);
let yp2=this.y+this.r*Math.sin(this.a2);
    //console.log("xp2 "+xp2.toFixed(0),yp2.toFixed(0));
    console.log("a2 "+this.a2.toFixed(2));
    drawPoint(xp2,yp2);
    console.log(this.cl+" "+this.dist.toFixed(0));
  }
  this.showPath=()=>{
    ctx.strokeStyle="red";
    ctx.lineWidth=1;
    ctx.beginPath();
    if (this.cl==0) ctx.moveTo(0,0);
    if (this.dir==1) ctx.arc(this.x,this.y,this.r,this.a1,this.a2);
    else ctx.arc(this.x,this.y,this.r,this.a1,this.a2,true);
    ctx.stroke();
  }
  this.getD=()=>{ 
    let xd=this.x-CSIZE;
    let yd=this.y-CSIZE;
    return Math.pow(xd*xd+yd*yd,0.5); 
  }
  this.setPath=(p)=>{
    //let p=new Path2D();
//    this.setAR();
/*
    if (this.cl==0) {
      p.moveTo(0,0);	// FIXME for branches
    } else {
      let xp=this.x+this.r*Math.cos(this.a1);
      let yp=this.y+this.r*Math.sin(this.a1);
      p.moveTo(xp,yp);	// FIXME for branches
    }
*/
    if (this.dir==1) {
      p.arc(this.x,this.y,this.r,this.a1,this.a2);
    } else {
      //p.arc(this.x,this.y,this.r,this.a1,-this.a2,true);
      p.arc(this.x,this.y,this.r,this.a1,this.a2,true);
    }
  }
/*
  this.drawNodePoint1=()=>{
    let xp=this.x-this.dir*this.r*Math.cos(this.a1);
    let yp=this.y-         this.r*Math.sin(this.a1);
    drawPoint(xp,yp);
  }
  this.drawNodePoint2=()=>{
    let xp=this.x+this.r*Math.cos(this.a2);
    let yp=this.y-         this.r*Math.sin(this.a2);
console.log(xp,yp);
    drawPoint(xp,yp);
  }
*/
  this.checkPoint=()=>{
    let pt=this.getNodePoint();
    //let xp=      this.x-this.dir*this.r*Math.cos(this.a2);
    //let yd=CSIZE+this.y-         this.r*Math.sin(this.a2);
    let yd=CSIZE+pt.y;
    if (Math.pow(pt.x*pt.x+yd*yd,0.5)<CSIZE) return true;
    return false;
  }
}

function Curve() {
  this.ca=[];
  this.path=new Path2D();
//  this.dist=0;
  this.setPath=()=>{
    for (let i=0; i<this.ca.length; i++) this.ca[i].setAR();
    this.path=new Path2D();
    let xp1=this.ca[0].x+this.ca[0].r*Math.cos(this.ca[0].a1);
    let yp1=this.ca[0].y+this.ca[0].r*Math.sin(this.ca[0].a1);
    this.path.moveTo(xp1,yp1);
    for (let i=0; i<this.ca.length; i++) {
      //this.path.addPath(this.ca[i].getPath());
      this.ca[i].setPath(this.path);
//      this.dist+=this.ca[i].dist;
    }
  }
  this.getCLPath=(n)=>{	// not correct
    let p=new Path2D();
    let xp1=this.ca[n].x+this.ca[n].r*Math.cos(this.ca[n].a1);
    let yp1=this.ca[n].y+this.ca[n].r*Math.sin(this.ca[n].a1);
    this.path.moveTo(xp1,yp1);
    this.ca[n].setPath(p);
    return p;
  }
  this.getDistance=(tidx)=>{
    let dist=0;
    for (let i=0; i<this.ca.length; i++) {
      dist+=this.ca[i].dist;
      if (i==tidx) break;
    }
    return dist;
  }
}

var f=1;
//ctx.setLineDash([1,2000]);
var drawO=()=>{	// ? states: moving, growing, shrinking
  //f=1-t/800;
  ctx.strokeStyle=color.getRGB(0);

  for (let i=0; i<cua.length; i++) {
    if (cua[i].dist>t) continue;
    //ctx.lineDashOffset=cua[i].dist-t;	// dist for each curve
    //let lw=40-40*Math.pow(t/1000,0.7);
    ctx.lineWidth=3;
    ctx.stroke(cua[i].path);
  }

//    if (cua[i].oc) ctx.strokeStyle="white";
//    else ctx.strokeStyle=color.getRGB(0);
/*
ctx.lineDashOffset=-t+2;
ctx.strokeStyle="#FFFFFF33";
ctx.lineWidth=2;
ctx.stroke(cua[i].path);
*/

    //ctx.strokeStyle="#0000003C";

//ctx.lineWidth=lw;
//ctx.strokeStyle=color.getRGB(0);
//ctx.stroke(cua[i].path);

/*
    ctx.lineWidth*=1.3;
    ctx.lineDashOffset+=ctx.lineWidth/8;
    ctx.strokeStyle="#00000014";
    ctx.stroke(cua[i].path);
*/
}

const getHex=(path)=>{
  const S6=Math.sin(Math.PI/3);
  const dm60=new DOMMatrix([0.5,S6,-S6,0.5,0,0]);
  const dm120=new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]);
  let hex=new Path2D(path);
  hex.addPath(path,dm60);
  hex.addPath(path,dm120);
  return hex;
}

//ctx.fillStyle="#00000008";
const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);
const dm3=new DOMMatrix([0,1,1,0,0,0]);

ctx.lineWidth=3;
//ctx.setLineDash([-100,200000]);
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let path=new Path2D();
  for (let i=0; i<cua.length; i++) {
    cua[i].setPath();
    let p=new Path2D(cua[i].path);
    p.addPath(p,dm1);
    p.addPath(p,dm2);
    //p.addPath(p,dm3);
let p2=getHex(p);
    path.addPath(p2);

ctx.lineWidth=12;
let dash=120+100*Math.sin(t/100);
ctx.setLineDash([dash,20000]);
if (cua[i].ca[0].cl==0) ctx.lineDashOffset=0;
else ctx.lineDashOffset=cua[i].ca[0].gc.dist;

ctx.strokeStyle=color2.getRGB(1);
ctx.stroke(p2);

/*
ctx.lineWidth=6;
ctx.strokeStyle="black";
ctx.stroke(p);
*/

/*
ctx.lineWidth=3;
ctx.setLineDash([]);
//ctx.setLineDash([t,20000]);
//if (cua[i].ca[0].cl==0) ctx.lineDashOffset=0;
//else ctx.lineDashOffset=cua[i].ca[0].gc.dist;
    ctx.strokeStyle=color.getRGB(0);
//ctx.globalAlpha=1;
    ctx.stroke(p);
*/
/*
ctx.lineWidth=1;
ctx.setLineDash([40,200]);
if (cua[i].ca[0].cl==0) ctx.lineDashOffset=-pt;
else ctx.lineDashOffset=-pt+cua[i].ca[0].gc.dist;
    ctx.strokeStyle=color.getRGB(2);
//ctx.globalAlpha=0.5;
    ctx.stroke(p);

if (cua[i].ca[0].cl==0) ctx.lineDashOffset=-pt2;
else ctx.lineDashOffset=-pt2+cua[i].ca[0].gc.dist;
    ctx.strokeStyle=color.getRGB(1);
//ctx.globalAlpha=0.5;
    ctx.stroke(p);
*/

/*
ctx.lineWidth=6;
ctx.setLineDash([4,200000]);
//ctx.setLineDash([-cua[i].ca[0].dist,200000]);
if (cua[i].ca[0].cl==0) ctx.lineDashOffset=-t/2;
else ctx.lineDashOffset=-t/2+cua[i].ca[0].gc.dist;
ctx.strokeStyle="red"
    ctx.stroke(p);
*/
  }
  ctx.setLineDash([]);

ctx.lineWidth=6;
ctx.strokeStyle="black";
ctx.stroke(path);

  ctx.lineWidth=2;
  //ctx.setLineDash([t,20000]);
  //if (cua[i].ca[0].cl==0) ctx.lineDashOffset=0;
  //else ctx.lineDashOffset=cua[i].ca[0].gc.dist;
  ctx.strokeStyle=color.getRGB(0);
  //ctx.globalAlpha=1;
  ctx.stroke(path);
}

/*
var drawF=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.strokeStyle=color.getRGB(0);
  let p=new Path2D();
  for (let i=0; i<cua.length; i++) {
    cua[i].setPath();
    p.addPath(cua[i].path);
  }
  let p2=new Path2D(p);
  p2.addPath(p,dm1);
  p2.addPath(p2,dm2);
  p2.addPath(p2,dm3);
//  ctx.setLineDash([t,200000]);
  ctx.stroke(p2);
}
*/

var stopped=true;
const DUR=1000;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var DUR2=400;
var pt=0;
var pt2=0;
var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  pt=-10+160*(1+Math.sin(t/400));
  pt2=-10+160*(1+Math.cos(t/400));
  //pt=-10+cua[0].ca[NCOUNT].dist/3*(1+Math.sin(t/200));
  //pt2=-10+cua[0].ca[NCOUNT].dist/3*(1+Math.cos(t/200));
/*
  if (t>=DUR) {
    stopped=true
return;	// test
    t=0;
  }
*/
  draw();
  requestAnimationFrame(animate);
}

var checkPoint=(x,y)=>{
  if (Math.pow(x*x+y*y,0.5)>CSIZE) return true;
  return false;
}

var checkCircle=(x,y,r)=>{	// ? remove corners, spacer+lineWidth
return true;
  let dc=Math.pow((x-CSIZE)*(x-CSIZE)+(y-CSIZE)*(y-CSIZE),0.5);
  if (dc+r>CSIZE) return false;
/*
  if (x<r) return false;
  if (y<r) return false;
  if (x>2*CSIZE-r) return false;
  if (y>2*CSIZE-r) return false;
*/
  for (let i=0; i<ca.length-1; i++) {
    let d=-12+Math.pow((ca[i].x-x)*(ca[i].x-x)+(ca[i].y-y)*(ca[i].y-y),0.5);
    if (d<r+ca[i].r) return false;
  }
  return true;
}

var drawPoint=(x,y,col,r)=>{	// diag
  ctx.beginPath();
  let rad=6;
  if (r) rad=r;
  ctx.arc(x,y,rad,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

onresize();

ctx.strokeStyle="green";

const NCOUNT=12;
//const NCOUNT=6;
//let rd=1.8;	// ? curve specific, varying about some value, larger rd, shorter r
//let rd=1.8;	// ? curve specific, varying about some value, larger rd, shorter r
let rd=1.6;
//let ad=0.8;
let ad=0.92;
var branch_start=0;

var createBranch=()=>{
  let sc=getRandomInt(0,cua.length,true);
  let start=getRandomInt(0,cua[sc].ca.length-1,true);
branch_start=start;
//if (cua[sc].ca[start] == undefined) debugger;
  let end=NCOUNT-cua[sc].ca[start].cl;
if (end==0) return false;
  let curve=new Curve();
  for (let i=0; i<end; i++) { 	// FIXME, not start but cua[sc].ca[start].cl
    //let d=i==0?Math.random()<0.5?-1:1:-curve.ca[i-1].dir;
    if (i==0) curve.ca.push(new Circle(cua[sc].ca[start]));
    else curve.ca.push(new Circle(curve.ca[i-1]));
  }
  return curve;
}

/*
var createBranchN=(cu)=>{
  let start=getRandomInt(0,cu.ca.length-1,true);	// also need distance
  let curve=new Curve();
  for (let i=0; i<NCOUNT-start; i++) {
    let circle=(i==0)?cu.ca[start]:curve.ca[i-1];
    let c=getCircle(circle);
    if (c instanceof Circle) curve.ca.push(c);
    else {
      if (c instanceof Circle) curve.ca.push(c);
      else {
//console.log("failed curve");
//        return false;
break;
      }
    }
  }
  curve.setPath();
  curve.dist=cu.getDistance(start)+cu.dist;
curve.branch_start=start;
  return curve;
}
*/

var getCircle=(pc)=>{
//  for (let m=1; m<5; m++) {
    let d=-1*pc.dir;
    //let r=(MAXR+MAXR*Math.random())/Math.pow(rd,pc.ci+1)/m;
    let r=(MAXR+MAXR*Math.random())/Math.pow(rd,1.5*pc.ci+1);
    let x=pc.x+d*(pc.r+r)*Math.cos(pc.a2);
    let y=pc.y  -(pc.r+r)*Math.sin(pc.a2);
    //let a=TP/24+TP*20/24*(1-Math.pow(ad,pc.ci+1))*Math.random();
let a=TP/24+TP*22/24*(1-Math.pow(ad,1.5*pc.ci+1))*Math.random();
    //let az=(a-pc.a2)/m;
    let az=(a-pc.a2);
    if (Math.abs(az)>TP) az/=4;
    else if (Math.abs(az)>Math.PI) az/=2;
    let c=new Circle(x,y,r,pc.a2,az,d,pc.ci+1);
    if (c.checkPoint()) {
//console.log("m "+m);
      return c;
    }
//  }
  return false;
}

var createCurve=(d,n)=>{	// left or right, non-0 start
  let curve=new Curve();
/*
  let r=MAXR+MAXR*Math.random();
  let x=d*r;
  let y=0;
  let a=TP/48+TP/16*Math.random();	// need minimum angle, TP/24?
*/
  curve.ca.push(new Circle(0,d));
  for (let i=0; i<NCOUNT; i++) curve.ca.push(new Circle(curve.ca[i],d));
  return curve;
}

var getCurveArray=()=>{
  let arr=[];
  let i=0;
  for (let i=0; i<1; i++) {
    let cur=createCurve(Math.pow(-1,i));
//    cur.dist=0;
    arr.push(cur);
  }
  return arr;
}

//var cua=getCurveArray();
var cua=getCurveArray(); //[cur,createCurve(-1,NCOUNT)];
var addBranch=()=>{
  let cb=createBranch();
  if (cb instanceof Curve) {
    cua.push(cb);	// FIXME splice
  }
}
for (let i=0; i<4; i++) {
  addBranch();
}

var drawNodes=()=>{
  for (let i=0; i<cua.length; i++) {
    for (let j=0; j<cua[i].ca.length; j++) {
      let pt=cua[i].ca[j].getNodePoint();
      drawPoint(pt.x,pt.y,"#FF000060");
    }
  }
}

/*
var dist=0;
let dq=getRandomInt(0,cua[0].ca.length);
//console.log("dq "+dq);
for (let i=0; i<dq; i++) {
  dist+=cua[0].ca[i].dist;
}
console.log("dist "+dist.toFixed(0));
//cua[0].dist=dist;
*/

/*
for (let i=0; i<0; i++) {
  let sc=getRandomInt(0,cua.length);
  let cb=createBranchN(cua[sc]);
  //if (cb instanceof Curve) {
  if (cb.ca.length>0) {
    //cua.push(cb);
cua.splice(sc+1,0,cb);
cb.col=cua[sc].col;
  } else {
    let sc=getRandomInt(0,cua.length);
    let cb=createBranchN(cua[sc]);
//    if (cb instanceof Curve) {
    if (cb.ca.length>0) {
//      cua.push(cb);
cua.splice(sc+1,0,cb);
cb.col=cua[sc].col;
    } 
  }
}
*/

var reportCurve=(n)=>{
  for (let i=0; i<cua[n].ca.length; i++) {
    cua[n].ca[i].report();
  }
}

var reportDist=()=>{
  for (let i=0; i<cua.length; i++) {
    for (let j=0; j<cua[i].ca.length; j++) {
      console.log(i+" "+cua[i].ca[j].dist.toFixed(0));
    }
  }
}

//var report=(n)=>{ cur.ca[n].report(); }

start();
//reportDist();

// branch
// CF=32
// r=fct(cl), a=fct(cl), KR=fct(cl), KA=fct(cl)
// lll & llr
// wave patterns

