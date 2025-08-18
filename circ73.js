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
ctx.translate(CSIZE,2*CSIZE);
ctx.lineCap="round";
ctx.globalCompositeOperation="destination-over";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=154;
  const CT=255-CBASE;
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(o+this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(o+this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(o+this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=400+400*Math.random();
    this.GK1=400+400*Math.random();
    this.BK1=400+400*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();

function Circle(x,y,r,a1,a2,d,ci) {
  this.x=x;
  this.y=y;
  this.r=r;
  this.a1=a1;
  this.a2=a2;
  this.dir=d;
  this.ci=ci;
  this.getCirclePath=()=>{
    let p=new Path2D();
    p.arc(x,y,r,0,TP);
    return p;
  }
  this.getD=()=>{ 
    let xd=this.x-CSIZE;
    let yd=this.y-CSIZE;
    return Math.pow(xd*xd+yd*yd,0.5); 
  }
  this.setPath=(p)=>{
    //let p=new Path2D();
    if (this.dir==1) {
      p.arc(this.x,this.y,this.r,TP/2-this.a1,TP/2+this.a2);
//this.dist=this.r*(this.a2+this.a1);
    } else {
      p.arc(this.x,this.y,this.r,this.a1,-this.a2,true);
    }
this.dist=this.r*(this.a1+this.a2);
    //return p;
  }
  this.getNodePoint=()=>{
    let xp=this.x-this.dir*this.r*Math.cos(this.a2);
    let yp=this.y-         this.r*Math.sin(this.a2);
    return {"x":xp,"y":yp};
  }
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
  this.setPath=()=>{
    for (let i=0; i<this.ca.length; i++) {
      //this.path.addPath(this.ca[i].getPath());
      this.ca[i].setPath(this.path);
    }
  }
}

var f=1;
//ctx.setLineDash([1,1000]);
var draw=()=>{	// ? states: moving, growing, shrinking
  //ctx.clearRect(0,0,2*CSIZE,2*CSIZE);
  //f=1-t/800;

ctx.lineWidth=8;
  
  ctx.strokeStyle=color.getRGB(0);
  for (let i=0; i<cua.length; i++) {
//ctx.lineDashOffset=-dist-t;	// dist for each curve
//    if (cua[i].oc) ctx.strokeStyle="white";
//    else ctx.strokeStyle=color.getRGB(0);
ctx.lineDashOffset=-t+2;

ctx.strokeStyle="#FFFFFF33";
ctx.lineWidth=2;
ctx.stroke(cua[i].path);

    //ctx.strokeStyle="#0000003C";
    ctx.strokeStyle="#0000008C";
    ctx.lineWidth=12;
    ctx.stroke(cua[i].path);

//ctx.lineDashOffset=-t;
    ctx.strokeStyle=color.getRGB(i);
    ctx.lineWidth=8;
    ctx.stroke(cua[i].path);
  }
}

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

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
//if (EM && t%100==0) stopped=true
  if (t>=DUR) {
    stopped=true
return;	// test
    t=0;
  }
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

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

onresize();

//const MAXR=CSIZE;
const MAXR=CSIZE/2;
const MINR=CSIZE/4;

/*
let x=2*CSIZE+CSIZE*Math.random(); //MAXR+2*(CSIZE-MAXR)*Math.random();
let y=2*CSIZE; //MAXR+2*(CSIZE-MAXR)*Math.random();
let r=x-CSIZE; //MINR+(MAXR-MINR)*Math.random();
let a=TP/2; //Math.PI/4; //0.3+0.7*TP*Math.random();
*/

ctx.strokeStyle="green";
//ctx.stroke(new Path2D(ca[ca.length-2].getPath(ca[ca.length-1].a,1)));
//ctx.stroke(new Path2D(ca[ca.length-3].getPath(ca[ca.length-2].a,1)));

/*
var drawCircle=(x,y,r)=>{
  ctx.lineWidth=0.4;
  ctx.strokeStyle="silver";
  ctx.beginPath();
  ctx.arc(x,y,r,0,TP);
  ctx.stroke();
}
*/

var getAngle=(a1,at,n)=>{
//if (-az6>az6+a7) { 
  //
}

//let rd=1.8;	// ? curve specific, varying about some value, larger rd, shorter r
let rd=1.3;	// diag, MAXR=CSIZE/2
//let ad=0.8;
let ad=0.92;
var branch_start=0;

var createBranchN=(cu)=>{
  let start=getRandomInt(0,cu.ca.length);	// also need distance
  let curve=new Curve();
  for (let i=0; i<8-start; i++) {
  let circle=(i==0)?cu.ca[start]:curve.ca[i-1];
    let c=getCircle(circle);
    if (c instanceof Circle) curve.ca.push(c);
    else {
console.log("failed curve");
      return false;
    }
  }
  curve.setPath();
curve.branch_start=start;
  return curve;
}

var createBranch=(cu)=>{
branch_start=start;

for (let i=0; i<8-start; i++) {
  let circle=(i==0)?cu.ca[start]:curve.ca[i-1];
  //let d=d*=-1;	// random?
  let d=-circle.dir;
//  let d=(i==1)?-circle.dir:-d;	// random?
//console.log("branch dir "+d);
  let r=(MAXR+MAXR*Math.random())/Math.pow(rd,circle.ci+1+i);
  let x=circle.x+d*(circle.r+r)*Math.cos(circle.a2);
  let y=circle.y-(circle.r+r)*Math.sin(circle.a2);
//  let a=TP/48+TP/16*Math.random();	// need minimum angle, TP/24?
  //let a=((start+1+i)%4==0)?circle.a2:TP/24+TP/(2+6/Math.pow(ad,circle.ci+1+i))*Math.random();
  let a=((start+1+i)%4==0)?circle.a2:TP/24+TP/(2+6/Math.pow(ad,1/(circle.ci+1+i)))*Math.random();
//let a=((start+1+i)%4==0)?circle.a2:TP/24+TP/(2+6/Math.pow(ad,Math.random()/(circle.ci+1+i)));
  //let a=((start+1+i)%4==0)?circle.a2:TP/24+TP/(2+6*Math.pow(Math.random(),circle.ci+1+i))*Math.random();
if (2*circle.a2<-a)  {
  //debugger;
console.log("branch overcircle idx "+i);
  a-=2*circle.a2;
curve.oc=true;
}

  let az=a-circle.a2;
  let xp=x-d*r*Math.cos(az);
  let yd=y-r*Math.sin(az)+CSIZE;
  //if (checkPoint(xp,yd)) return undefined;
  if (checkPoint(xp,yd)) break;	
  else curve.ca.push(new Circle(x,y,r,circle.a2,az,d,0));

//console.log(x,y);
//drawPoint(x,y);
}
  if (curve.ca.length==0) return undefined;
  curve.setPath();
console.log("branch start idx "+start);
  return curve;
}

var getCircle=(pc)=>{
  for (let m=0; m<4; m++) {
    let d=-1*pc.dir;
    let r=(MAXR+MAXR*Math.random())/Math.pow(rd,pc.ci+1)/m;
    let x=pc.x+d*(pc.r+r)*Math.cos(pc.a2);
    let y=pc.y  -(pc.r+r)*Math.sin(pc.a2);
    let a=TP/24+TP*20/24*(1-Math.pow(ad,pc.ci+1))*Math.random();
    let az=(a-pc.a2)/m;
    if (Math.abs(az)>TP) az/=4;
    else if (Math.abs(az)>Math.PI) az/=2;
    let c=new Circle(x,y,r,pc.a2,az,d,pc.ci+1);
    if (c.checkPoint()) {
//console.log("m "+m);
      return c;
    }
  }
  return false;
}

var createCurveN=(d)=>{	// left or right, non-0 start
  let curve=new Curve();
  let r=MAXR+MAXR*Math.random();
  let x=d*r;
  let y=0;
  let a=TP/48+TP/16*Math.random();	// need minimum angle, TP/24?
  let c=new Circle(x,y,r,0,a,d,0);
  curve.ca.push(new Circle(x,y,r,0,a,d,0));
  for (let i=1; i<8; i++) {
    let c=getCircle(curve.ca[i-1]);
    if (c instanceof Circle) curve.ca.push(c);
    else {
console.log("failed curve");
      return false;
    }
  }
  curve.setPath();
  return curve;
}

var createCurve=(d)=>{	// left or right, non-0 start
  let curve=new Curve();
  let r=MAXR+MAXR*Math.random();
  let x=d*r;
  let y=0;
  let a=TP/48+TP/16*Math.random();	// need minimum angle, TP/24?

//  let az=a;
  //let xp=x-d*r*Math.cos(a);
  curve.ca.push(new Circle(x,y,r,0,a,d,0));
  for (let i=1; i<8; i++) {
//    d*=-1;
    d=curve.ca[i-1].dir*-1;
    r=(MAXR+MAXR*Math.random())/Math.pow(rd,i);
    x=curve.ca[i-1].x+d*(curve.ca[i-1].r+r)*Math.cos(curve.ca[i-1].a2);
    y=curve.ca[i-1].y-(curve.ca[i-1].r+r)*Math.sin(curve.ca[i-1].a2);
    //let a=TP/24+TP/(2+6/Math.pow(ad,i-1))*Math.random();
//    if ((i+1)%4==0) {
    //let a=((i+1)%4==0)?curve.ca[i-1].a2:TP/24+TP/(2+6*Math.pow(ad,curve.ca[i-1].ci+i+1))*Math.random();
    //let a=((i+1)%4==0)?curve.ca[i-1].a2:TP/24+TP/(2+6*Math.pow(ad,curve.ca[i-1].ci+i+1))*Math.random();
    //let a=((i+1)%4==0)?curve.ca[i-1].a2:TP/24+TP/(2+6*Math.pow(ad,curve.ca[i-1].ci+i+1))*Math.random();
//let a=((i+1)%4==0)?curve.ca[i-1].a2:TP/(24-22*Math.pow(ad,curve.ca[i-1].ci+i+1));
//let a=TP/(24-22*Math.pow(ad,curve.ca[i-1].ci+i+1));
    //let a=TP/(24-22*Math.pow(0.92,curve.ca[i-1].ci+i+1));
    //let a=TP/24+23/24*(1-Math.pow(ad,curve.ca[i-1].ci+i-1))*Math.random();
//let a=TP/24+TP*23/24*(1-Math.pow(ad,curve.ca[i-1].ci+i-1))*Math.random();
let a=TP/24+TP*20/24*(1-Math.pow(ad,curve.ca[i-1].ci+i-1))*Math.random();
    //let a=((i+1)%4==0)?curve.ca[i-1].a2:TP/24+23*TP/(48-24*Math.pow(ad,curve.ca[i-1].ci+i+1))*Math.random();
    //let a=((i+1)%4==0)?curve.ca[i-1].a2:TP/24+TP/(2+6/Math.pow(ad,1/(circle.ca[i-1].ci+1+i)))*Math.random();
let oc=false;
//if (curve.ca[i-1].a2>Math.PI) debugger; //console.log("a2 "+curve.ca[i-1].a2);
//if (i==2 || i==6) {
/*
let azt=a-curve.ca[i-1].a2;
//let azt=d==1?a-curve.ca[i-1].a2:curve.ca[i-1].a2-a;
if (azt<-Math.PI) debugger;
if (azt>TP) {
  console.log(i+" oc TP positive azt "+azt.toFixed(2)+" a2 "+curve.ca[i-1].a2.toFixed(2)+" a "+a.toFixed(2));
a/=4;
} else if (azt>Math.PI) {
  console.log(i+" oc positive azt "+azt.toFixed(2)+" a2 "+curve.ca[i-1].a2.toFixed(2)+" a "+a.toFixed(2));
a/=2;
//  console.log(i+" oc new a "+a.toFixed(2));
}
*/
/*
if (2*curve.ca[i-1].a2<-a)  {
  //debugger;
//console.log("azt "+azt.toFixed(2));
console.log(i+" overcircle "+a.toFixed(2)+" "+curve.ca[i-1].a2.toFixed(2)+" "+cua.length+" "+i);
  //a-=2*curve.ca[i-1].a2;
a-=(2*curve.ca[i-1].a2)%TP;
  oc=true;
}
*/
//}
    let az=a-curve.ca[i-1].a2;
if (Math.abs(az)>TP) az/=4;
else if (Math.abs(az)>Math.PI) az/=2;
// if (az+a2>Math.PI)
    let xp=x-d*r*Math.cos(az);
    let yp=y-r*Math.sin(az);
//    let yd=yp+CSIZE;
    //if (Math.pow(xp*xp+yd*yd,0.5)>CSIZE) {
//console.log(Math.pow(xp*xp+yd*yd,0.5).toFixed(0));
//debugger;
    if (checkPoint(xp,yp+CSIZE)) {
      break; // don't break, increase a, decrease r
    }
//drawPoint(xp,yp);
//drawPoint(xp,yp,"yellow");
    let c=new Circle(x,y,r,curve.ca[i-1].a2,az,d,i);
    c.oc=oc;
    curve.ca.push(c);
    //curve.ca.push(new Circle(x,y,r,curve.ca[i-1].a2,az,d,i));
  }
  curve.setPath();
  return curve;
}

/***********
//let curve=new Curve();
//let ca=curve.ca;
let ca=[];
let n=0;
let dir=1;
let r1=(MAXR+MAXR*Math.random())/Math.pow(rd,n);
//let x1=r1;
let x1=dir*(r1+0)*Math.cos(0);
let y1=0;
//let y1=0+r1*Math.sin(0);
let a1=TP/48+TP/16*Math.random();	// need minimum angle, TP/24?
let az1=a1+0;
let xp1=x1-dir*r1*Math.cos(az1);
let yp1=y1-r1*Math.sin(az1);
ca[n]=new Circle(x1,y1,r1,0,az1,dir);

n=1;
dir*=-1;	// -1
let r2=(MAXR+MAXR*Math.random())/Math.pow(rd,n);
let x2=x1+dir*(r1+r2)*Math.cos(az1);
let y2=y1-(r1+r2)*Math.sin(az1);
//let a2=TP/24+TP/8*Math.random();
let a2=TP/24+TP/(2+6/Math.pow(ad,n-1))*Math.random();
//console.log(2+6/Math.pow(ad,n-1));
let az2=a2+dir*az1;
let xp2=x2-dir*r2*Math.cos(az2);
let yp2=y2-r2*Math.sin(az2);
ca[n]=new Circle(x2,y2,r2,az1,az2,dir);

n=2;
dir*=-1;	// +1
let r3=(MAXR+MAXR*Math.random())/Math.pow(rd,n);
let x3=x2+dir*(r2+r3)*Math.cos(az2);
let y3=y2-(r2+r3)*Math.sin(az2);
//let a3=TP/24+TP/8*Math.random();
//let a3=TP/24+TP/6*Math.random();
let a3=TP/24+TP/(2+6/Math.pow(ad,n-1))*Math.random();
//if (az2<-az3) { 
if (az2<-az2-a3) { 
  console.log("over-circ?");
  debugger;	// make 
a3-=2*az2;
}
let az3=a3+dir*az2;
//let xp3=x3-r3*Math.cos(a3+a2-a1);
//let yp3=y3-r3*Math.sin(a3+a2-a1);
let xp3=x3-dir*r3*Math.cos(az3);
let yp3=y3-r3*Math.sin(az3);
ca[n]=new Circle(x3,y3,r3,az2,az3,dir);

n=3;
dir*=-1;	// -1
let r4=(MAXR+MAXR*Math.random())/Math.pow(rd,n);
let x4=x3+dir*(r3+r4)*Math.cos(az3);
let y4=y3-(r3+r4)*Math.sin(az3);
let a4=az3;
//if (az3<a4) { console.log("norm4");
//} else { console.log("over-circ4"); }
let az4=a4+dir*az3;	// az4=0
//console.log((a4-az3).toFixed(2));
//console.log(a4.toFixed(2));
//console.log(az3.toFixed(2));
//console.log(az4.toFixed(2));
let xp4=x4-dir*r4*Math.cos(az4);
let yp4=y4-r4*Math.sin(az4);
ca[n]=new Circle(x4,y4,r4,az3,az4,dir);

n=4;
dir*=-1;	// +1
let r5=(MAXR+MAXR*Math.random())/Math.pow(rd,n);
let x5=x4+dir*(r4+r5)*Math.cos(az4);
let y5=y4-(r4+r5)*Math.sin(az4);
let a5=TP/24+TP/(2+6/Math.pow(ad,n-1))*Math.random();
let az5=a5+dir*az4;	// az5=a5
let xp5=x5-dir*r5*Math.cos(az5);
let yp5=y5-r5*Math.sin(az5);
ca[n]=new Circle(x5,y5,r5,az4,az5,dir);

n=5;
dir*=-1;	// -1
let r6=(MAXR+MAXR*Math.random())/Math.pow(rd,n);
let x6=x5+dir*(r5+r6)*Math.cos(az5);
let y6=y5-(r5+r6)*Math.sin(az5);
let a6=TP/24+TP/(2+6/Math.pow(ad,n-1))*Math.random();
let az6=a6+dir*az5;
//let xp6=x6+r6*Math.cos(a6-a5);
//let yp6=y6-r6*Math.sin(a6-a5);
let xp6=x6-dir*r6*Math.cos(az6);
let yp6=y6-r6*Math.sin(az6);
ca[n]=new Circle(x6,y6,r6,az5,az6,dir);

n=6;
dir*=-1;	// +1
let r7=(MAXR+MAXR*Math.random())/Math.pow(rd,n);
//let x7=x6+(r6+r7)*Math.cos(a6-a5);
//let y7=y6-(r6+r7)*Math.sin(a6-a5);
let x7=x6+dir*(r6+r7)*Math.cos(az6);
let y7=y6-(r6+r7)*Math.sin(az6);
let a7=TP/24+TP/(2+6/Math.pow(ad,n-1))*Math.random();
//if (a6-a5<a5-a6-a7) { 
//console.log("a7 "+a7.toFixed(2));
//if (az6<-az6-a7) { 
//if (-az6>az6+a7) { 
//if (-az6>az6+a7) { 
if (-2*az6>a7) { 
  console.log("az6 "+az6.toFixed(2));
  console.log("a7 "+a7.toFixed(2));
  console.log("over-circ2");
  //a7=-2*az6+0.01;
  a7-=2*az6;
  console.log("a7 "+a7.toFixed(2));
  console.log("az7 "+(a7+az6).toFixed(2));
}
let az7=a7+dir*az6;
//let xp7=x7-r7*Math.cos(a7+a6-a5);
//let yp7=y7-r7*Math.sin(a7+a6-a5);
let xp7=x7-dir*r7*Math.cos(az7);
let yp7=y7-r7*Math.sin(az7);
ca[n]=new Circle(x7,y7,r7,az6,az7,dir);

n=7;
dir*=-1;	// -1
let r8=(MAXR+MAXR*Math.random())/Math.pow(rd,n);
//let x8=x7-(r7+r8)*Math.cos(a7+a6-a5);
//let y8=y7-(r7+r8)*Math.sin(a7+a6-a5);
let x8=x7+dir*(r7+r8)*Math.cos(az7);
let y8=y7-(r7+r8)*Math.sin(az7);
//let a8=TP/24+TP/(2+6/Math.pow(ad,n-1))*Math.random();
let a8=az7;	// ? verify
let az8=a8+dir*az7;	// az8=0
let xp8=x8-dir*r8*Math.cos(az8);
let yp8=y8-r8*Math.sin(az8);
ca[n]=new Circle(x8,y8,r8);

ctx.lineWidth=4;
ctx.strokeStyle=color.getRGB(0);

ctx.beginPath();
//ctx.arc(x1,y1,r1,TP/2,TP/2+a1);
ctx.arc(x1,y1,r1,TP/2,TP/2+az1);
//ctx.arc(x2,y2,r2,a1,a1-a2,true);
ctx.arc(x2,y2,r2,az1,-az2,true);
//ctx.arc(x3,y3,r3,TP/2-a2+a1,TP/2-a1+a2+a3);
//ctx.arc(x3,y3,r3,TP/2-az2,TP/2+az2+a3);
ctx.arc(x3,y3,r3,TP/2-az2,TP/2+az3);
//if (-a2+a1>-a1+a2+a3) {
//if (a2-a1<a1-a2-a3) {
//ctx.moveTo(xp3,yp3);
//ctx.arc(x4,y4,r4,a3+a2-a1,a4-a3-a2+a1,true);
//ctx.arc(x4,y4,r4,a3+az2,a4-a3-az2,true);
//ctx.arc(x4,y4,r4,az3,a4-az3,true);
ctx.arc(x4,y4,r4,az3,-az4,true);
//ctx.arc(x5,y5,r5,TP/2,TP/2+a5);
ctx.arc(x5,y5,r5,TP/2-az4,TP/2+az5);
//ctx.arc(x6,y6,r6,a5,a5-a6,true);
ctx.arc(x6,y6,r6,az5,-az6,true);
//ctx.arc(x7,y7,r7,TP/2-a6+az5,TP/2-az5+a6+a7);
ctx.arc(x7,y7,r7,TP/2-az6,TP/2+az7);
ctx.arc(x8,y8,r8,az7,-az8,true);
ctx.stroke();

ctx.fillStyle="red";
for (let i=0; i<ca.length; i++) {
  ctx.beginPath();
  ctx.arc(ca[i].x,ca[i].y,3,0,TP);
  ctx.closePath();
  if (i==ca.length-1) ctx.fillStyle="green";
  ctx.fill();
}
*************/

/*
ctx.strokeStyle="white";
ctx.lineWidth=1;
for (let i=0; i<4; i++) {
  ctx.stroke(ca[i].getPath());
}
*/

var cua=[];	// curve array
let i=0;
while (i<1) {
//for (let i=0; i<8; i++) {
  let cur=createCurveN(Math.pow(-1,i));
  if (cur instanceof Curve) {
    cua.push(cur);
    i++;
  }
//  cua.push(createCurveN(Math.pow(-1,i)));
}

var drawNodes=()=>{
  for (let i=0; i<cua.length; i++) {
    for (let j=0; j<cua[i].ca.length; j++) {
      let pt=cua[i].ca[j].getNodePoint();
      drawPoint(pt.x,pt.y);
    }
  }
}

/*
let c=cua[0].ca;
for (let i=0; i<c.length; i++) {
  console.log(i,c[i].dir,c[i].a1.toFixed(2),c[i].a2.toFixed(2),c[i].dist.toFixed(0));
}
*/


/*
var dist=0;
let dq=getRandomInt(0,cua[0].ca.length);
//console.log("dq "+dq);
for (let i=0; i<dq; i++) {
  dist+=cua[0].ca[i].dist;
}
console.log("dist "+dist.toFixed(0));
cua[0].dist=dist;
*/

for (let i=0; i<4; i++) {
  let sc=getRandomInt(0,cua.length);
  let cb=createBranchN(cua[sc]);
  if (cb instanceof Curve) {
    cua.unshift(cb);
  }
}

/*
let cb=createBranch(cua[0]);
if (cb instanceof Curve) {
  cua.push(cb);
//  ctx.stroke(cua[1].path);
}
let sc=getRandomInt(0,cua.length);
let cb2=createBranch(cua[sc]);
if (cb2 instanceof Curve) {
  cua.push(cb2);
//  ctx.stroke(cua[1].path);
}
*/
console.log("curve count "+cua.length);
for (let i=0; i<cua.length; i++) {
  console.log(i+" "+cua[i].ca.length+" "+cua[i].branch_start);
}

drawNodes();
draw();

var report=()=>{
  for (let i=0; i<cua.length; i++) {
    console.log(i);
    for (let j=0; j<cua[i].ca.length; j++) {
      console.log(j+" "+cua[i].ca[j].a1.toFixed(2)+" "+cua[i].ca[j].a2.toFixed(2)+
                " azt "+(cua[i].ca[j].a2-cua[i].ca[j].a1).toFixed(2));
//drawPoint(cua[i].ca[j].x,cua[i].ca[j].y);
    }
  }
}
//report();

/*
ctx.strokeStyle="red";
ctx.lineWidth=1;
if (cua[1]) {
ctx.stroke(cua[1].ca[0].getCirclePath());
ctx.strokeStyle="white";
if (cua[1].ca[1]) ctx.stroke(cua[1].ca[1].getCirclePath());
}
ctx.strokeStyle="yellow";
ctx.stroke(cua[0].ca[branch_start].getCirclePath());
*/

/*
ctx.lineWidth=4;
for (let i=0; i<cua.length; i++) {
  ctx.strokeStyle=color.getRGB(i+1);
  ctx.stroke(cua[i].path);
}
*/


/*
ctx.strokeStyle=color.getRGB(1);
var c=createCurve(-1);
ctx.stroke(c.getPath());
c=createCurve(1);
ctx.strokeStyle=color.getRGB(2);
ctx.stroke(c.getPath());
c=createCurve(-1);
ctx.strokeStyle=color.getRGB(3);
ctx.stroke(c.getPath());
*/

// is a4 over-circ?, larger a promote overcirc?
// dir
// activate createCurve, curve.draw
// getAngle

// +/- dir init
// over circ fct
// test draw growth
// branch
// optional, movement vs growth

