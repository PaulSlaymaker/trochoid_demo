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
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
//ctx.setLineDash([1,3000]);
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var Circle=function(x,y,xp,yp,radius,pc,aidx) {
  this.x=x;
  this.y=y;
  this.xp=xp;
  this.yp=yp;
  this.radius=radius;
  this.pc=pc;
//  this.cuidx0=false;
//  this.cuidx1=false;
  this.eadx=0;	// exit angle index
  this.drawCircle=(rf)=>{	// diag
    ctx.beginPath();
    ctx.moveTo(this.x+this.radius*rf,this.y);
    ctx.arc(this.x,this.y,this.radius*rf,0,TP);
    ctx.fill();
  }
  this.draw=()=>{
    ctx.beginPath();
    ctx.moveTo(this.x+this.radius,this.y);
    ctx.arc(this.x,this.y,this.radius,0,TP);
    ctx.stroke();
  }
}

function Color() {
  const CBASE=160;
  const CT=255-CBASE;
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.getRGB=(f)=>{
/*
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+f/this.RK1+t/this.RK3));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+f/this.GK1+t/this.GK3));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+f/this.BK1+t/this.BK3));
*/
    let red=Math.round(CBASE+CT*Math.cos(this.RK2));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2));
return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=(0.4+Math.random())/5;
    this.GK1=(0.4+Math.random())/5;
    this.BK1=(0.4+Math.random())/5;
    this.RK3=80+120*Math.random();
    this.GK3=80+120*Math.random();
    this.BK3=80+120*Math.random();
  }
  this.randomize();
}

var color=new Color();
var col1=color.getRGB(0);
var color2=new Color();

var getTrisAngleIdx=(an1,an2)=>{	// an1-an2==2
  if (Math.max(an1,an2)==4) {
    if (Math.min(an1,an2)==0) return 5;
    else return 3;
  } else if (Math.max(an1,an2)==5) {
    if (Math.min(an1,an2)==1) return 0;
    else return 4;
  }
  return 1+Math.min(an1,an2);
}

var Curve=function(initCircle) {

  if (initCircle) {
    let ar=TP*Math.random();
    this.car=[new Circle((CSIZE-rad2)*Math.cos(ar),(CSIZE-rad2)*Math.sin(ar),0,0,rad2,0,0)];
  } else {	// deprecate?
    this.car=[];
  }

  this.addCurveCircle=(cir)=>{
    if (cir.pc) {
      this.car.unshift(cir.pc);
      this.addCurveCircle(cir.pc);
    } else {
      return;
    }
  }
  this.shrink=()=>{
  }

  this.grow=()=>{
    let c=this.car[this.car.length-1];
    for (let i=0; i<97; i++) {
      //let rad2=36-i/4;
      let rad2=30+10*getRandomInt(0,6);
      //let a=TP*Math.random();
      let aidx=getRandomInt(0,6);
      if (c.pc) { 
	aidx=[c.pc.eadx,(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,3)]; 
      }
      let a=TP*aidx/6;
      let x=c.x+(c.radius+rad2)*Math.cos(a);
      let y=c.y+(c.radius+rad2)*Math.sin(a);
      if (cval(x,y,rad2)) {
        c.eadx=aidx;
	let xp=c.x+c.radius*Math.cos(a);
	let yp=c.y+c.radius*Math.sin(a);
	let circle=new Circle(x,y,xp,yp,rad2,c);
        //c.cc=circle;
        this.car.push(circle);
        return true;
      }
    }
    return false;
  }
  this.setPath=()=>{
    this.len=0;
    this.path=new Path2D();
    this.pathInt=new Path2D();
    this.path3=new Path2D();
//this.path.moveTo(this.car[0].x,this.car[0].y);
    this.path.moveTo(this.car[2].xp,this.car[2].yp);
    //this.len+=this.car[0].radius;
    for (let i=2; i<this.car.length-1; i++) {
      //this.len+=2*this.car[i].radius;
//    if (i>this.car.length-8) { 
      this.path.moveTo(this.car[i].xp,this.car[i].yp);
      if (this.car[i-1].eadx==this.car[i].eadx) {
	this.path.lineTo(this.car[i+1].xp,this.car[i+1].yp);
	//this.path.lineTo(this.car[i].x,this.car[i].y);
      } else if ((this.car[i-1].eadx+3)%6==(this.car[i].eadx+2)%6) {
	let aidx1=this.car[i].eadx;
	let aidx2=(this.car[i-1].eadx+3)%6;
	let aidx3=getTrisAngleIdx(aidx1,aidx2);
	let acx=this.car[i].x+2*this.car[i].radius*Math.cos(aidx3*TP/6);
	let acy=this.car[i].y+2*this.car[i].radius*Math.sin(aidx3*TP/6);
	let a1=((aidx1+3.5)%6)*TP/6;
	let a2=((aidx1+4.5)%6)*TP/6;
	this.path.arc(acx,acy,1.732*this.car[i].radius,a1,a2);
      } else if ((this.car[i-1].eadx+3)%6==(this.car[i].eadx+4)%6) {	// left
	let aidx1=this.car[i].eadx;
	let aidx2=(this.car[i-1].eadx+3)%6;
	let aidx3=getTrisAngleIdx(aidx1,aidx2);
	let acx=this.car[i].x+2*this.car[i].radius*Math.cos(aidx3*TP/6);
	let acy=this.car[i].y+2*this.car[i].radius*Math.sin(aidx3*TP/6);
//this.path3.arc(acx,acy,3,0,TP);
	let a1=((aidx1+2.5)%6)*TP/6;
	let a2=((aidx1+1.5)%6)*TP/6;
	//this.path.arc(acx,acy,1.732*this.car[i].radius,a1,a2);
	this.path.arc(acx,acy,1.732*this.car[i].radius,a1,a2,true);
      }
    }
//    this.path.lineTo(this.car[this.car.length-1].x,this.car[this.car.length-1].y);
//    this.len+=this.car[this.car.length-1].radius;
    this.path2=new Path2D();	// draw end
    if (this.car[0].eadx==this.car[1].eadx) {
      this.path2.moveTo(this.car[2].xp,this.car[2].yp);	// front will use car[length-2]?
      //this.path2.lineTo(this.car[1].xp,this.car[1].yp);
      this.path2.lineTo(this.car[1].xp+f*(this.car[2].xp-this.car[1].xp),this.car[1].yp+f*(this.car[2].yp-this.car[1].yp));
//console.log("straight");
    } else if ((this.car[0].eadx+3)%6==(this.car[1].eadx+2)%6) {
      this.path2.moveTo(this.car[2].xp,this.car[2].yp);	// front will use car[length-2]?
      let aidx1=this.car[1].eadx;
      let aidx2=(this.car[0].eadx+3)%6;
//console.log(aidx1,aidx2);
      let aidx3=getTrisAngleIdx(aidx1,aidx2);

      let acx=this.car[1].x+2*this.car[1].radius*Math.cos(aidx3*TP/6);
      let p3y=this.car[1].y+2*this.car[1].radius*Math.sin(aidx3*TP/6);
let a1=((aidx1+3.5)%6)*TP/6;
let a2=((aidx1+4.5)%6)*TP/6;
//this.path2.arc(p3x,p3y,1.732*this.car[1].radius,a1,a2);
//this.path2.arc(p3x,p3y,1.732*this.car[1].radius,a2,a1+0.2,true);
this.path2.arc(acx,p3y,1.732*this.car[1].radius,a2,a1+f*(a2-a1),true);	// a1->a2
//this.path3.arc(p3x,p3y,3,0,TP);
//console.log("right");	// ccw==false
//console.log("aidx3 "+aidx3);	// ccw==false
    } else if ((this.car[0].eadx+3)%6==(this.car[1].eadx+4)%6) {	// left
      this.path2.moveTo(this.car[2].xp,this.car[2].yp);	// for end shrink
      let aidx1=this.car[1].eadx;
      let aidx2=(this.car[0].eadx+3)%6;
      let aidx3=getTrisAngleIdx(aidx1,aidx2);
/*
      let aidx3=1+Math.min(aidx1,aidx2);
if (Math.max(aidx1,aidx2)==4) {
  if (Math.min(aidx1,aidx2)==0) aidx3=5;
  else aidx3=3;
} else if (Math.max(aidx1,aidx2)==5) {
  if (Math.min(aidx1,aidx2)==1) aidx3=0;
  else aidx3=4;
}
*/
      let p3x=this.car[1].x+2*this.car[1].radius*Math.cos(aidx3*TP/6);
      let p3y=this.car[1].y+2*this.car[1].radius*Math.sin(aidx3*TP/6);
let a1=((aidx1+2.5)%6)*TP/6;
let a2=((aidx1+1.5)%6)*TP/6;
//this.path2.arc(p3x,p3y,1.732*this.car[1].radius,a2,a1);
//this.path2.arc(p3x,p3y,1.732*this.car[1].radius,a2,a1-0.2);
this.path2.arc(p3x,p3y,1.732*this.car[1].radius,a2,a1+f*(a2-a1));
//this.path3.arc(p3x,p3y,3,0,TP);
//console.log("left");
    } else {
debugger;
console.log(this.car[1].eadx);
    }
  }
  this.drawEnds=()=>{
    // punch clear
    let p=new Path2D();
    if ((this.car[0].eadx+3)%6==(this.car[1].eadx+4)%6) {	// left
    }
  }
  this.drawCurve=()=>{
ctx.globalAlpha=0.7;
    ctx.lineWidth=3;
    ctx.strokeStyle=col1;
    ctx.stroke(this.path);
    ctx.lineWidth=8;
    ctx.strokeStyle=color2.getRGB(0);
    ctx.stroke(this.path2);

ctx.fillStyle="yellow"; ctx.fill(this.path3);
  }
}

var cvalN=(x,y,rad)=>{
  if (Math.pow(x*x+y*y,0.5)>CSIZE-rad) return false;
  for (let i=0; j<curves.length; j++) {
    for (let i=0; i<curves[j].car.length; i++) {
      let rt=rad+curves[j].car[i].radius;
      let xd=curves[j].car[i].x-x;
      if (Math.abs(xd)>rt) continue;
/*
    let yd=ca[i].y-y;
    if (Math.abs(yd)>rt) continue;
    if (Math.pow(xd*xd+yd*yd,0.5)+1<rt) {
      return false;
    }
*/
    }
  }
  return true;
}

var cval=(x,y,rad)=>{
  if (Math.pow(x*x+y*y,0.5)>CSIZE-rad) return false;
  for (let i=0; i<ca.length; i++) {
    let rt=rad+ca[i].radius;
    let xd=ca[i].x-x;
    if (Math.abs(xd)>rt) continue;
    let yd=ca[i].y-y;
    if (Math.abs(yd)>rt) continue;
    if (Math.pow(xd*xd+yd*yd,0.5)+1<rt) {
      return false;
    }
  }
  return true;
}

var rad2=50+10*getRandomInt(0,5);

var grow=()=>{
  let c=ca[ca.length-1];
  for (let i=0; i<97; i++) {
    //let c=ca[getRandomInt(0,ca.length)];
    //let rad2=36-i/4;
    let rad2=30+10*getRandomInt(0,6);
    //let a=TP*Math.random();
    let aidx=getRandomInt(0,6);
    if (c.pc) { 
      aidx=[c.pc.eadx,(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,3)]; 
    }
    let a=TP*aidx/6;
    let x=c.x+(c.radius+rad2)*Math.cos(a);
    let y=c.y+(c.radius+rad2)*Math.sin(a);
    if (cval(x,y,rad2)) {
      c.eadx=aidx;
      let xp=c.x+c.radius*Math.cos(a);
      let yp=c.y+c.radius*Math.sin(a);
      let circle=new Circle(x,y,xp,yp,rad2,c);
      //c.c.push(circle);
      c.cc=circle;
      ca.push(circle);
      return true;
    }
  }
  return false;
}

var drawCurveSet=(cuixd, col)=>{	// diag
  ctx.save();
  if (col) ctx.strokeStyle=col;
  else ctx.strokeStyle="white";
  ctx.lineWidth=1;
  ctx.setLineDash([]);
  for (let i=0; i<curves.length; i++) {
    ctx.stroke(curves[i].path);
  }
  ctx.restore();
}

var draw=()=>{
//ctx.fillStyle="#00000020";
//ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<curves.length; i++) curves[i].drawCurve();
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var f=0;
var t=0;
const DUR=200;	// vary
var animate=()=>{
  if (stopped) return;
  t++;
  f=t/DUR;
curves[0].setPath();	// from 3-part curve
  draw();
  if (t>=DUR) {
    t=0;
    stopped=true;
  }
  requestAnimationFrame(animate);
}

var curves=[];

var drawCircles=(col,lw)=>{	// diag
  ctx.save();
  //let slw=ctx.lineWidth;
  ctx.lineWidth=lw?lw:1;
  if (col) ctx.strokeStyle=col;
  else ctx.strokeStyle="white";
  for (let i=0; i<ca.length; i++) {
    ca[i].draw();
  }
  //ctx.lineWidth=slw;
  ctx.restore();
}

var drawCircles2=(col,lw)=>{	// diag
  ctx.save();
  ctx.lineWidth=lw?lw:1;
  if (col) ctx.strokeStyle=col;
  else ctx.strokeStyle="white";
  for (let i=0; i<curves[0].car.length; i++) {
    curves[0].car[i].draw();
  }
  //ctx.lineWidth=slw;
  ctx.restore();
}

let ar=TP*Math.random();
var ca=[new Circle((CSIZE-rad2)*Math.cos(ar),(CSIZE-rad2)*Math.sin(ar),0,0,rad2,0,0)];

// move ca to car, grow as Curve function
// ca deprecate, cycle thru curves.car in cval

var setCircles=()=>{
  let counter=0;
  for (let i=0; i<40; i++) {
    if (!grow()) break;
/*
    if (!grow()) counter++;
    if (counter>1) {
console.log("grow count "+i+" ca.len "+ca.length);
      break;
    }
*/
  }
console.log(" ca.len "+ca.length);
if (ca.length<3) debugger;	// fixme
}

var initCurves=()=>{
  curves=[];
  for (let i=0; i<ca.length; i++) {
    //if (ca[i].c.length==0) {
    if (!ca[i].cc) {
      let csidx=(curves.length%2);
      var nc=new Curve();
      nc.car=[ca[i]];
      nc.addCurveCircle(ca[i]);
      nc.setPath();
      curves.push(nc)
    }
  }
//console.log("curve count "+curves.length);
}

var drawPoint=(x,y,col)=>{
  ctx.beginPath();
  ctx.moveTo(x+6,y);
  ctx.arc(x,y,6,0,TP);
  if (col==undefined) ctx.fillStyle="red";
  else ctx.fillStyle=col;
  ctx.fill();
}

onresize();

setCircles();
initCurves();
draw();
drawCircles();
drawPoint(ca[0].x,ca[0].y);
drawPoint(ca[ca.length-1].x,ca[ca.length-1].y,"blue");

/*
curves.push(new Curve(true));
for (let i=0; i<40; i++) {
  if (!curves[0].grow()) break;
}
console.log(" ca.len "+curves[0].car.length);
if (curves[0].car.length<3) debugger;	// fixme
curves[0].setPath();
draw();
drawCircles2();
drawPoint(curves[0].car[0].x,curves[0].car[0].y);
*/

ctx.beginPath();
ctx.arc(0,0,CSIZE,0,TP);
ctx.lineWidth=1;
ctx.stroke();

/*
ctx.strokeStyle="yellow";
ctx.beginPath();
ctx.arc(0,0,120,0,TP);
ctx.stroke();

let aidx=getRandomInt(0,6);
let p1x=120*Math.cos(aidx*TP/6);
let p1y=120*Math.sin(aidx*TP/6);

drawPoint(p1x,p1y);

let ccw=Math.random()<0.5;

//let aidx2=[(aidx+2)%6,(aidx+4)%6][getRandomInt(0,2)]; 
let aidx2=ccw?(aidx+4)%6:(aidx+2)%6;
let p2x=120*Math.cos(aidx2*TP/6);
let p2y=120*Math.sin(aidx2*TP/6);
drawPoint(p2x,p2y,"blue");

//let aidx3=aidx2-aidx>0?aidx+1:aidx-1;
let aidx3=1+Math.min(aidx,aidx2);
if (ccw) {
  let a1=((aidx+1.5)%6)*TP/6;
  let a2=((aidx+2.5)%6)*TP/6;
} else {
  let a1=((aidx+4.5)%6)*TP/6;
  let a2=((aidx+3.5)%6)*TP/6;
}
let a1=((aidx+(ccw?1.5:4.5))%6)*TP/6;
let a2=((aidx+(ccw?2.5:3.5))%6)*TP/6;
//if (Math.max(aidx,aidx2)==2) { } else if (Math.max(aidx,aidx2)==3) { aidx3=2; } else 
if (Math.max(aidx,aidx2)==4) {
  if (Math.min(aidx,aidx2)==0) aidx3=5;
  else aidx3=3;
} else if (Math.max(aidx,aidx2)==5) {
  if (Math.min(aidx,aidx2)==1) aidx3=0;
  else aidx3=4;
}
console.log(aidx,aidx2,aidx3);
//let p3x=1.577*120*Math.cos(aidx3*TP/6);
//let p3y=1.577*120*Math.sin(aidx3*TP/6);
//let a3=((aidx+aidx2)*TP/12);
let p3x=2*120*Math.cos(aidx3*TP/6);
let p3y=2*120*Math.sin(aidx3*TP/6);
drawPoint(p3x,p3y,"green");

ctx.beginPath();
ctx.arc(p3x,p3y,1.732*120,0,TP);
ctx.stroke();

ctx.beginPath();
ctx.arc(p3x,p3y,1.732*120,a1,a2,!ccw);
ctx.strokeStyle="white";
ctx.lineWidth=3;
ctx.stroke();

ctx.beginPath();
if (ccw) ctx.arc(p3x,p3y,1.732*120,a1,a1+0.1,false);
else ctx.arc(p3x,p3y,1.732*120,a1,a1-0.1,true);
ctx.strokeStyle="blue";
ctx.lineWidth=5;
ctx.stroke();

console.log(ccw);
console.log(a1/TP*360,a2/TP*360);
*/

var test=()=>{
  ctx.save();
  let p=new Path2D();
  p.arc(ca[1].x,ca[1].y,ca[1].radius,0,TP);
ctx.clip(p);
  ctx.clearRect(ca[1].x-ca[1].radius,ca[1].y-ca[1].radius,2*ca[1].radius,2*ca[1].radius);
  ctx.restore();
}
