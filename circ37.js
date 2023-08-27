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
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.setLineDash([1,3000]);
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var Circle=function(x,y,xp,yp,radius,pc) {
  this.x=x;
  this.y=y;
  this.xp=xp;
  this.yp=yp;
  this.radius=radius;
  this.pc=pc;
  this.c=[];
  this.cuidx0=false;
  this.cuidx1=false;
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
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+f/this.RK1+c/this.RK3));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+f/this.GK1+c/this.GK3));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+f/this.BK1+c/this.BK3));
    //return "rgba("+red+","+grn+","+blu+",0.7)";
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
//  this.set();
}

var color=new Color();

var Curve=function(cs) {
  this.set=cs;
  this.car=[];
  //this.to=-getRandomInt(0,400);
  this.addCurveCircle=(cir,cuidx)=>{
    if (cuidx) cir.cuidx1=true;
    else cir.cuidx0=true;
    if (cir.pc) {
      this.car.unshift(cir.pc);
      this.addCurveCircle(cir.pc,cuidx);
    } else {
      return;
    }
  }
  this.setPath=()=>{
    const dmx=new DOMMatrix([-1,0,0,1,0,0]);
    const dmy=new DOMMatrix([1,0,0,-1,0,0]);
    this.len=0;
    this.path=new Path2D();
this.path.moveTo(this.car[0].x,this.car[0].y);
    this.path.lineTo(this.car[1].xp,this.car[1].yp);
    this.len+=this.car[0].radius;
    for (let i=1; i<this.car.length-1; i++) {
      let cpx1=(this.car[i].x+this.car[i].xp)/2;
      let cpy1=(this.car[i].y+this.car[i].yp)/2;
      let cpx2=(this.car[i].x+this.car[i+1].xp)/2;
      let cpy2=(this.car[i].y+this.car[i+1].yp)/2;
      this.path.bezierCurveTo(cpx1,cpy1,cpx2,cpy2,
//      this.path.bezierCurveTo(this.car[i].x,this.car[i].y,
//                              this.car[i].x,this.car[i].y,
                              this.car[i+1].xp,this.car[i+1].yp);
      this.len+=2*this.car[i].radius;
    }
    this.path.lineTo(this.car[this.car.length-1].x,this.car[this.car.length-1].y);
    this.len+=this.car[this.car.length-1].radius;
    this.path.addPath(this.path,dmx);
    this.path.addPath(this.path,dmy);
  }
  this.drawCurve=()=>{
    //let tt=this.to+t;
let tt=t;
//let tt=DUR*Math.pow(Math.sin(t/DUR*TP/4),2);
ctx.lineDashOffset=-tt;
//ctx.lineWidth=Math.max(3,40-40*this.len/650);
ctx.lineWidth=Math.max(5,50-50*this.len/800);
//ctx.lineWidth=Math.max(3,80*(this.len-t)/this.len);
ctx.globalAlpha=0.7;

    if (this.set) {
      //if (inc>0) ctx.strokeStyle=color.getRGB(this.len/200);
      if (inc>0) {
	ctx.strokeStyle=color.getRGB(tt/300);
	ctx.stroke(this.path);
	ctx.strokeStyle="#00000040";
	ctx.lineWidth+=2;
	ctx.stroke(this.path);
      } else {
	//ctx.lineDashOffset=DUR-t;
    ctx.lineWidth+=2;
	ctx.strokeStyle="black";
	ctx.globalAlpha=1;
	ctx.stroke(this.path);
      }
    } else {
      tt=DUR-t;
      ctx.lineDashOffset=-tt;
      if (inc>0) {
        ctx.lineWidth+=2;
	ctx.strokeStyle="black";
	ctx.globalAlpha=1;
	ctx.stroke(this.path);
      } else {
	ctx.strokeStyle=color.getRGB(tt/300);
	ctx.stroke(this.path);
    //  else ctx.strokeStyle=color.getRGB(this.len/200);
	ctx.strokeStyle="#00000040";
	ctx.lineWidth+=2;
	ctx.stroke(this.path);
      }
    }
    ctx.lineWidth=0.6*(ctx.lineWidth-4);
    ctx.strokeStyle=color.getRGB(tt/300);
    ctx.stroke(this.path);
  }
}

var cval=(x,y,rad)=>{
  if (Math.pow(x*x+y*y,0.5)>CSIZE-rad) return false;
  for (let i=0; i<ca.length; i++) {
    let rt=rad+ca[i].radius;
    let xd=ca[i].x-x;
    let yd=ca[i].y-y;
    if (Math.abs(xd)>rt) continue;
    if (Math.abs(yd)>rt) continue;
//console.log(i+" "+Math.pow(xd*xd+yd*yd,0.5));
    if (Math.pow(xd*xd+yd*yd,0.5)+1<rt) {
      return false;
    }
  }
  return true;
}

var MC=getRandomInt(22,46);
var grow=()=>{
//  let MC=getRandomInt(22,46);
//let MC=getRandomInt(26,56);

  for (let i=0; i<97; i++) {
    //let c=bca[getRandomInt(0,bca.length)];
    let c=ca[getRandomInt(0,ca.length)];
    //let c=ca[ca.length-1-getRandomInt(0,ca.length,true)]
  //let rad2=36-i/4;
  let rad2=MC-i/4;
  //let rad2=26-i/4;
  //let rad2=MINR+96/4-i/4;
  /*
  if (rad2<10) {
  console.log(rad2);
  debugger;
  return false;
  }
  */
    let a=TP*Math.random();
    let x=c.x+(c.radius+rad2)*Math.cos(a);
if (x<0) continue;
    let y=c.y+(c.radius+rad2)*Math.sin(a);
if (y<0) continue;
    if (cval(x,y,rad2)) {
      let xp=c.x+c.radius*Math.cos(a);
      let yp=c.y+c.radius*Math.sin(a);
      let circle=new Circle(x,y,xp,yp,rad2,c);
      c.c.push(circle);
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
    if (curves[i].set==cuixd) ctx.stroke(curves[i].path);
  }
  ctx.restore();
}

var draw=()=>{
//ctx.fillStyle="#00000020";
//ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);	// CON
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

var pauseTS=1000;
var pause=(ts)=>{
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var f=0;
var t=0;
var c=0;
const INC=2;
var inc=INC;
//const DUR=1300;	// vary
const DUR=1200;	// vary
var animate=()=>{
  if (stopped) return;
  c++;
  t+=inc;
  draw();
//if (t==600) drawCurveSet(1,"red");
  if (t>DUR) {
    pruneCircles(0);
    setCircles();
    setCurves(0);
    inc=-INC;
//color.randomize();
  } else if (t<0) {
    pruneCircles(1);
    setCircles();
    setCurves(1);
    inc=+INC;
    t=0; 
  }
  if (t==DUR/2) {
    //stopped=true;
    pauseTS=performance.now()+1200;
    requestAnimationFrame(pause);
  } else requestAnimationFrame(animate);
}

var curves=[];

var drawCircles=(mark,col,lw)=>{	// diag
  let slw=ctx.lineWidth;
  ctx.lineWidth=lw?lw:1;
  if (col) ctx.strokeStyle=col;
  else ctx.strokeStyle="white";
  for (let i=0; i<ca.length; i++) {
if (mark) {
  if (!ca[i].cuidx1 && ca[i].cuidx0) ca[i].draw();
} else ca[i].draw();
ctx.fillText(i,ca[i].x,ca[i].y-3);
  }
  ctx.lineWidth=slw;
}

var pruneCircles=(cuidx)=>{
  let i=ca.length;
  let pc=ca.length;
  if (cuidx) {
    while (i--) {
      if (ca[i].cuidx1 && !ca[i].cuidx0) { ca.splice(i,1); }
      else ca[i].cuidx1=false;
    }
  } else {
    while (i--) {
      if (!ca[i].cuidx1 && ca[i].cuidx0) { ca.splice(i,1); }
      else ca[i].cuidx0=false;
    }
  }
  if (ca.length==0) ca.push(new Circle(0,0,0,0,50,0,0));
console.log("prune from "+pc+" to "+ca.length);
}

var setCurves=(csidx)=>{
  let i=curves.length;
  while (i--) if (curves[i].set==csidx) curves.splice(i,1); 
  for (let i=0; i<ca.length; i++) {
    if (ca[i].c.length==0) {
      if (csidx) {
	if (ca[i].cuidx0) continue;
      } else {
	if (ca[i].cuidx1) continue;
      }
      var nc=new Curve(csidx);
      nc.car=[ca[i]];
      nc.addCurveCircle(ca[i],csidx);
      nc.setPath();
      curves.push(nc)
    }
  }
  curves.sort((a,b)=>{ return b.len-a.len; });
console.log("curve set "+csidx+" len "+curves.length);
console.log("MAXL "+curves[curves.length-1].len);
}

var ca=[new Circle(0,0,0,0,50,0,0)];

var setCircles=()=>{
//MC=getRandomInt(22,46);
//MC=getRandomInt(28,42);
//MC=[32,31,30,32,29,33,28,34,27,35][getRandomInt(0,10,true)];
  MC=[34,33,35,31,36,30,37,29,38,28][getRandomInt(0,10,true)];
  let counter=0;
  for (let i=0; i<200; i++) {
    if (!grow()) counter++;
    if (counter>1) {
//console.log("no grow count "+i);
console.log("grow count "+i+" ca.len "+ca.length);
//console.log(ca[0]);
      break;
    }
  }
//console.log("grow count "+counter);
}

var initCurves=()=>{
  curves=[];
  for (let i=0; i<ca.length; i++) {
    if (ca[i].c.length==0) {
      let csidx=(curves.length%2);
      var nc=new Curve(csidx);
      nc.car=[ca[i]];
      nc.addCurveCircle(ca[i],csidx);
      nc.setPath();
      curves.push(nc)
    }
  }
  curves.sort((a,b)=>{ return b.len-a.len; });
//console.log("curves "+curves.length);
}

onresize();

setCircles();
initCurves();

start();

