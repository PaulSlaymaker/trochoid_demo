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
ctx.lineCap="round";
ctx.globalAlpha=0.7;
ctx.fillStyle="white"; // diag

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
  this.xp=xp;	// entry point
  this.yp=yp;
  this.radius=radius;
  this.pc=pc;
  this.eadx=0;	// exit angle index
/*
  this.drawCircle=(rf)=>{	// diag
    ctx.beginPath();
    ctx.moveTo(this.x+this.radius*rf,this.y);
    ctx.arc(this.x,this.y,this.radius*rf,0,TP);
    ctx.fill();
  }
*/
  this.hexant=Math.round(Math.atan2(y,x)/TP*12);
  this.draw=()=>{	// diag
    ctx.beginPath();
    ctx.moveTo(this.x+this.radius,this.y);
    ctx.arc(this.x,this.y,this.radius,0,TP);
    ctx.stroke();
ctx.fillText(this.hexant,this.x,this.y-6);
if (this.iDir) ctx.fillText(this.iDir,this.x,this.y+16);
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

var PathArc=function() {
// x,y,rad,a1,a2
}

var Curve=function() {
  let ar=TP*Math.random();
  this.car=[new Circle((CSIZE-rad2)*Math.cos(ar),(CSIZE-rad2)*Math.sin(ar),0,0,rad2,0,0)];
/*
  if (initCircle) {
    let ar=TP*Math.random();
    this.car=[new Circle((CSIZE-rad2)*Math.cos(ar),(CSIZE-rad2)*Math.sin(ar),0,0,rad2,0,0)];
  } else {	// deprecate?
    this.car=[];
  }
*/
  this.shrink=()=>{
    if (this.car.length<4) return false;
    this.car.shift();
    this.sh=true;
    return true;
  }
  this.grow=()=>{
    let c=this.car[this.car.length-1];
    for (let i=0; i<40; i++) {
      //let rad2=36-i/4;
      //let rad2=30+8*getRandomInt(0,7);
      //let minr=[10,15,20,25,30][Math.floor(i/8)];
      let minr=[12,16,20,24,28][Math.floor(i/8)];
      //let rad2=minr+6*getRandomInt(0,12);
      let rad2=minr+5*getRandomInt(0,14);
      //let a=TP*Math.random();
      let aidx=getRandomInt(0,6);
      if (c.pc) { 
	aidx=[c.pc.eadx,(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,3)]; 
//if (Math.pow(c.x*c.x,0.5)>240) {
  if (this.hexant==0) {
    if ([-2,-1,0,1].includes(c.pc.iDir)) aidx=(c.pc.eadx+1)%6;
    else if ([-4,-5,-6,6,5].includes(c.pc.iDir)) aidx=(c.pc.eadx+5)%6;
    //else if (-3==c.pc.iDir)) aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
  } else if (this.hexant==1) {
  }
//}
	//aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
      }
      let a=TP*aidx/6;
      let x=c.x+(c.radius+rad2)*Math.cos(a);
      let y=c.y+(c.radius+rad2)*Math.sin(a);
      if (cvalN(x,y,rad2)) {
        c.eadx=aidx;
	let xp=c.x+c.radius*Math.cos(a);
	let yp=c.y+c.radius*Math.sin(a);
        c.iDir=Math.round(Math.atan2(c.xp-xp,c.yp-yp)/TP*12);
	let circle=new Circle(x,y,xp,yp,rad2,c);
        //c.cc=circle;
        this.car.push(circle);
        this.gr=true;
//console.log("tries "+i);
        return true;
      }
    }
    return false;
  }
  this.setPathT=()=>{
    this.len=0;
    this.patht=new Path2D();
    this.path.moveTo(this.car[1].xp,this.car[1].yp);
    for (let i=1; i<this.car.length-1; i++) {
      if (this.car[i-1].eadx==this.car[i].eadx) {
      }
    }
  }
  this.setPath=()=>{
    this.path=new Path2D();
    this.path.moveTo(this.car[2].xp,this.car[2].yp);	// 0 not draws, drawn back 2->1
let CC=(this.gr)?this.car.length-2:this.car.length-1;
    for (let i=2; i<CC; i++) {
    //for (let i=2; i<this.car.length-2; i++) {
      //this.len+=2*this.car[i].radius;
      if (this.car[i-1].eadx==this.car[i].eadx) {
	this.path.lineTo(this.car[i+1].xp,this.car[i+1].yp);
      } else {
	let aidx1=this.car[i].eadx;
	let aidx2=(this.car[i-1].eadx+3)%6;
	let aidx3=getTrisAngleIdx(this.car[i].eadx,aidx2);
	let acx=this.car[i].x+2*this.car[i].radius*Math.cos(aidx3*TP/6);
	let acy=this.car[i].y+2*this.car[i].radius*Math.sin(aidx3*TP/6);
        if ((this.car[i-1].eadx+3)%6==(this.car[i].eadx+2)%6) {
	  let a1=((aidx1+3.5)%6)*TP/6;
	  let a2=((aidx1+4.5)%6)*TP/6;
	  this.path.arc(acx,acy,1.732*this.car[i].radius,a1,a2);
	} else if ((this.car[i-1].eadx+3)%6==(this.car[i].eadx+4)%6) {	// left
	  let a1=((aidx1+2.5)%6)*TP/6;
	  let a2=((aidx1+1.5)%6)*TP/6;
	  this.path.arc(acx,acy,1.732*this.car[i].radius,a1,a2,true);
	} else debugger;
      }
    }

    let aidx1=this.car[1].eadx;
    let aidx2=(this.car[0].eadx+3)%6;
    let aidx3=getTrisAngleIdx(aidx1,aidx2);
    if (this.car[0].eadx==this.car[1].eadx) {
	// empty straight
    } else if ((this.car[0].eadx+3)%6==(this.car[1].eadx+2)%6) {	// right
      //this.path2.moveTo(this.car[2].xp,this.car[2].yp);	// front will use car[length-2]?
//console.log(aidx1,aidx2);

//this.path2.arc(acx,acy,1.732*this.car[1].radius,a2,a1+f*(a2-a1),true);	// a1->a2
//this.path2.arc(p3x,p3y,1.732*this.car[1].radius,a2,a1+0.2,true);

      this.endArcCx=this.car[1].x+2*this.car[1].radius*Math.cos(aidx3*TP/6);	// arc center x
      this.endArcCy=this.car[1].y+2*this.car[1].radius*Math.sin(aidx3*TP/6);
      this.endA1=((aidx1+3.5)%6)*TP/6;
      this.endA2=((aidx1+4.5)%6)*TP/6;
    } else if ((this.car[0].eadx+3)%6==(this.car[1].eadx+4)%6) {	// left
      this.endArcCx=this.car[1].x+2*this.car[1].radius*Math.cos(aidx3*TP/6);
      this.endArcCy=this.car[1].y+2*this.car[1].radius*Math.sin(aidx3*TP/6);
      this.endA1=((aidx1+2.5)%6)*TP/6;
      this.endA2=((aidx1+1.5)%6)*TP/6;
    } else debugger;

    aidx1=this.car[this.car.length-2].eadx;
    aidx2=(this.car[this.car.length-3].eadx+3)%6;
    aidx3=getTrisAngleIdx(aidx1,aidx2);

    if (this.car[this.car.length-3].eadx==this.car[this.car.length-2].eadx) {
	// straight, empty
    } else {
      this.frontArcCx=this.car[this.car.length-2].x+2*this.car[this.car.length-2].radius*Math.cos(aidx3*TP/6);
      this.frontArcCy=this.car[this.car.length-2].y+2*this.car[this.car.length-2].radius*Math.sin(aidx3*TP/6);
      if ((this.car[this.car.length-3].eadx+3)%6==(this.car[this.car.length-2].eadx+2)%6) {// right
	this.frontA1=((aidx1+3.5)%6)*TP/6;
	this.frontA2=((aidx1+4.5)%6)*TP/6;
      } else if ((this.car[this.car.length-3].eadx+3)%6==(this.car[this.car.length-2].eadx+4)%6) {// left
	this.frontA1=((aidx1+2.5)%6)*TP/6;
	this.frontA2=((aidx1+1.5)%6)*TP/6;
      } else debugger;
    }
  }
  this.drawFront=()=>{
    let p=new Path2D();
    let c1=this.car[this.car.length-2];
    let c2=this.car[this.car.length-1];
    p.moveTo(c1.xp,c1.yp);
    if (this.car[this.car.length-3].eadx==this.car[this.car.length-2].eadx) {
      p.lineTo(c1.xp+f*(c2.xp-c1.xp),c1.yp+f*(c2.yp-c1.yp));
    } else if ((this.car[this.car.length-3].eadx+3)%6==(this.car[this.car.length-2].eadx+2)%6) {// right
      p.arc(this.frontArcCx,this.frontArcCy,1.732*c1.radius,this.frontA1,this.frontA1+f*TP/6);
    } else if ((this.car[this.car.length-3].eadx+3)%6==(this.car[this.car.length-2].eadx+4)%6) {// left
      p.arc(this.frontArcCx,this.frontArcCy,1.732*c1.radius,this.frontA1,this.frontA1-f*TP/6,true);
    }
    ctx.stroke(p);
let TTT=Math.atan2(this.car[this.car.length-2].xp-this.car[this.car.length-1].xp,this.car[this.car.length-2].yp-this.car[this.car.length-1].yp);
TTT=TTT/TP*12;
ctx.fillText(TTT.toFixed(2),this.car[this.car.length-2].x,this.car[this.car.length-2].y+8);
//ctx.fillText(this.iDir,this.car[this.car.length-2].x,this.car[this.car.length-2].y+20);
  }
  this.drawEnd=()=>{
    // punch clear
    let p=new Path2D();
    p.moveTo(this.car[2].xp,this.car[2].yp);
    if (this.car[0].eadx==this.car[1].eadx) {
      p.lineTo(this.car[1].xp+f*(this.car[2].xp-this.car[1].xp),
               this.car[1].yp+f*(this.car[2].yp-this.car[1].yp));
    } else if ((this.car[0].eadx+3)%6==(this.car[1].eadx+2)%6) {
      p.arc(this.endArcCx,this.endArcCy,1.732*this.car[1].radius,this.endA2,this.endA1+f*TP/6,true);
    } else if ((this.car[0].eadx+3)%6==(this.car[1].eadx+4)%6) {	// left
      p.arc(this.endArcCx,this.endArcCy,1.732*this.car[1].radius,this.endA2,this.endA1-f*TP/6);
    }
    ctx.stroke(p);
  }
  this.drawCurve=()=>{
    ctx.lineWidth=16;	// 4 less than minr*2
    ctx.strokeStyle=col1;
    ctx.stroke(this.path);
//    ctx.lineWidth=10;
//    ctx.strokeStyle=color2.getRGB(0);
    this.drawEnd();
    if (this.gr) this.drawFront();
  }
}

var cvalN=(x,y,rad)=>{
  if (Math.pow(x*x+y*y,0.5)>CSIZE-rad) return false;
  for (let j=0; j<curves.length; j++) {
    for (let i=0; i<curves[j].car.length; i++) {
      let rt=rad+curves[j].car[i].radius;
      let xd=curves[j].car[i].x-x;
      if (Math.abs(xd)>rt) continue;
      let yd=curves[j].car[i].y-y;
      if (Math.abs(yd)>rt) continue;
      if (Math.pow(xd*xd+yd*yd,0.5)+1<rt) {
	return false;
      }
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

/*
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
*/

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

const annulus=new Path2D();
annulus .arc(0,0,CSIZE,0,TP);
var draw=()=>{
//ctx.fillStyle="#00000020";
//ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
drawCircles();
  for (let i=0; i<curves.length; i++) curves[i].drawCurve();

ctx.lineWidth=1;
ctx.stroke(annulus);
}

var transit=()=>{
  curves[0].gr=false;
  curves[0].sh=false;
  curves[0].shrink();
  curves[0].grow();
  curves[0].setPath();
if (curves[0].car.length<4) stopped=true;
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
var dur=100;
var animate=()=>{
  if (stopped) return;
  t++;
  f=t/dur;
  draw();
  if (!(t<dur-1)) {
    t=0;
    //stopped=true;
    transit();
  }
  requestAnimationFrame(animate);
}

var curves=[];

ctx.font="bold 14px sans-serif";
var drawCircles=(col,lw)=>{	// diag
  ctx.save();
  ctx.lineWidth=lw?lw:1;
  if (col) ctx.strokeStyle=col;
  else ctx.strokeStyle="gray";
  for (let i=0; i<curves[0].car.length; i++) {
    curves[0].car[i].draw();
  }
  ctx.restore();
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

var initCurves=()=>{
  curves=[new Curve()];
  let ccount=30;
  for (let i=0; i<ccount; i++) if (!curves[0].grow()) break;
  console.log(" ca.len "+curves[0].car.length);
  if (curves[0].car.length<3) {
    debugger;	// fixme
  }
  curves[0].setPath();
  if (curves[0].car.length<ccount) {
  } else curves[0].gr=true;
  //             
}
initCurves();
draw();
drawPoint(curves[0].car[0].x,curves[0].car[0].y,"white");
ctx.moveTo(-CSIZE,0);
ctx.lineTo(CSIZE,0);
ctx.moveTo(-CSIZE*0.866,-CSIZE/2);
ctx.lineTo(CSIZE*0.866,CSIZE/2);
ctx.moveTo(-CSIZE/2,-CSIZE*0.866);
ctx.lineTo(CSIZE/2,CSIZE*0.866);
ctx.stroke();

var test=(n)=>{
  ctx.save();
  let p=new Path2D();
  p.arc(curves[0].car[n].x,ca[n].y,ca[1].radius,0,TP);
ctx.clip(p);
  ctx.clearRect(ca[1].x-ca[1].radius,ca[1].y-ca[1].radius,2*ca[1].radius,2*ca[1].radius);
  ctx.restore();
}
