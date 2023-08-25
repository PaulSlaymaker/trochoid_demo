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
//ctx.globalCompositeOperation="luminosity";

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
  this.cua=new Array();
  this.cuidx0=false;
  this.cuidx1=false;
  this.drawCircle=(rf)=>{
    ctx.beginPath();
//ctx.moveTo(this.xp+this.radius/3,this.yp);
//ctx.arc(this.xp,this.yp,this.radius/3,0,TP);
      ctx.moveTo(this.x+this.radius*rf,this.y);
      ctx.arc(this.x,this.y,this.radius*rf,0,TP);
//let col=Math.round(this.radius/10);
//ctx.fillStyle=colors[col%colors.length];
//ctx.fillStyle="hsla("+(hue+4*this.radius)+",90%,50%,0.7)";
ctx.fillStyle="hsl("+((hue+5*this.radius)%360)+",90%,50%)";
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
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+f/this.RK1+c/160));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+f/this.GK1+c/130));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+f/this.BK1+c/110));
    //return "rgba("+red+","+grn+","+blu+",0.7)";
return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=(0.4+Math.random())/5;
    this.GK1=(0.4+Math.random())/5;
    this.BK1=(0.4+Math.random())/5;
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
this.path.addPath(this.path, new DOMMatrix([-1,0,0,1,0,0]));
this.path.addPath(this.path, new DOMMatrix([1,0,0,-1,0,0]));
  }
  this.drawCurve=()=>{
    //let tt=this.to+t;
let tt=t;
ctx.setLineDash([1,3000]);
ctx.lineDashOffset=-t;
//ctx.lineWidth=Math.max(3,40-40*this.len/650);
ctx.lineWidth=Math.max(4,50-50*this.len/800);
//ctx.lineWidth=Math.max(3,80*(this.len-t)/this.len);
ctx.globalAlpha=0.7;
if (this.set) {
    //ctx.setLineDash([Math.max(1,tt),3000]);
  //if (S0) ctx.strokeStyle=color.getRGB(this.len/200);
  if (S0) {
    ctx.strokeStyle=color.getRGB(tt/300);
    ctx.stroke(this.path);
    ctx.strokeStyle="#00000060";
    ctx.lineWidth+=2;
  } else {
    //ctx.lineDashOffset=DUR-t;
ctx.lineWidth+=2;
    ctx.strokeStyle="black";
    ctx.globalAlpha=1;
    ctx.stroke(this.path);
    ctx.lineWidth=3;
    ctx.strokeStyle=color.getRGB(tt/300);
  }
} else {
  tt=DUR-t;
//  ctx.setLineDash([Math.max(1,tt),3000]);
ctx.lineDashOffset=-tt;
  if (S0) {
ctx.lineWidth+=2;
    ctx.strokeStyle="black";
    ctx.globalAlpha=1;
    ctx.stroke(this.path);
    ctx.lineWidth=3;
    ctx.strokeStyle=color.getRGB(tt/300);
//    ctx.lineDashOffset=t;
  } else {
    ctx.strokeStyle=color.getRGB(tt/300);
    ctx.stroke(this.path);
//  else ctx.strokeStyle=color.getRGB(this.len/200);
    ctx.strokeStyle="#00000060";
    ctx.lineWidth+=2;
  }
}
//  else ctx.strokeStyle=color.getRGB(this.len/200);

//ctx.lineWidth=Math.max(2,34-36*this.len/800);
//ctx.lineWidth=32-40*this.len/2000;
    //ctx.strokeStyle="hsla("+(hue+360*this.len/1800)%360+",90%,60%,0.5)";
    //ctx.strokeStyle="hsla("+(hue+360*this.len/400)%360+",90%,60%,0.5)";
    //ctx.strokeStyle=color.getRGB(this.len/200);

    ctx.stroke(this.path);
    if (tt>this.len+120) return false;
    return true;
/*
    if (tt>this.len+40) {
      this.car[this.car.length-1].drawCircle(0.8);
      if (tt>this.len+120) return false;
      else return true;
    } else if (tt>this.len) {
      let raf=0.8*(tt-this.len)/40;
      this.car[this.car.length-1].drawCircle(raf);
      return true;
    } else {
      return true;
    }
*/
  }
}

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,10,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var cval=(x,y,rad)=>{
if (x<0) return false;
if (y<0) return false;
  if (Math.pow(x*x+y*y,0.5)>CSIZE-rad) return false;
  for (let i=0; i<ca.length; i++) {
    let rt=rad+ca[i].radius;
    let xd=ca[i].x-x;
    let yd=ca[i].y-y;
    if (Math.abs(xd)>rt) continue;
    if (Math.abs(yd)>rt) continue;
//console.log(i+" "+Math.pow(xd*xd+yd*yd,0.5));
    if (Math.pow(xd*xd+yd*yd,0.5)+1<rt) {
//drawPoint(x,y);
      return false;
    }
  }
  return true;
}

var eg=Math.random()<0.3;

var grow=()=>{
  let MC=getRandomInt(22,46);
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
  let y=c.y+(c.radius+rad2)*Math.sin(a);
  if (cval(x,y,rad2)) {
    let xp=c.x+c.radius*Math.cos(a);
    let yp=c.y+c.radius*Math.sin(a);
    let circle=new Circle(x,y,xp,yp,rad2,c);
    c.c.push(circle);
    ca.push(circle);
    return true;
  }
}	// end of loop
  return false;
}

ctx.fillStyle="green";
ctx.lineWidth=7;

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
  //  for (let i=0; i<ca.length; i++) { ca[i].draw(); }
  //let drawn=0;
  for (let i=0; i<curves.length; i++) {
    //if (curves[i].drawCurve()) drawn++;
//if (curves[i].set==0)	// CON
    curves[i].drawCurve();
  }
  //drawPoint(ca[0].x,ca[0].y,ctx.strokeStyle);
//if (t>1400) console.log("tt "+t);
//if (!drawn) console.log("maxt "+t);
  //return drawn;
}

var hue=0;
var reset=()=>{
  eg=Math.random()<0.3;
//console.log(eg);
  setCircles();
  initCurves();
//  ctx.strokeStyle="hsla("+getRandomInt(0,360)+",90%,60%,0.6)";
  hue=getRandomInt(0,360);
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var S0=true;
var t=0;
var c=0;
const INC=2;
var inc=INC;
//const DUR=1300;	// vary
const DUR=1000;	// vary
var animate=()=>{
  if (stopped) return;
  c++;
  t+=inc;
  draw();
//if (t>DUR/2) stopped=true;	// CON
//if (t==600) drawCurveSet(1,"red");
  if (t>DUR) {
//drawCurveSet(1,"red");
S0=!S0;
//drawCircles(false,"#FFFFFF40",8);
//drawCircles(true,"red");
pruneCircles(0);
setCircles();
//drawCircles(false,"green",2);
setCurves2(0);
    inc=-INC;
  } else if (t<0) {
S0=!S0;
pruneCircles(1);
setCircles();
//drawCircles(false,"green",2);
setCurves2(1);
//pruneCircles(1);
    // prune circles, 1
    inc=+INC;
    t=0; 
    //reset();
  }
  requestAnimationFrame(animate);
}

var hue=getRandomInt(0,360);
//var ca=[new Circle(0,0,0,0,50,0,0)];

var curves=[];
var cu=new Array(2);
for (let i=0; i<cu.length; i++) cu[i]=new Array();

var drawCircles=(mark,col,lw)=>{
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

var tcuidx=0;

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
// prevent empty ca
// need to set ca[i].cuidx01
/*
  ca.forEach((c,i)=>{
    if (!c.cuidx1 && c.cuidx0) ca.splice(i,1);
  });
*/
console.log("prune from "+pc+" to "+ca.length);
}

var setCurves2=(csidx)=>{
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
console.log("cuidx "+csidx+" len "+curves.length);
console.log("MAXL "+curves[curves.length-1].len);
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
console.log("curves "+curves.length);
}

/*
let a=TP*Math.random();
let x=0;//CSIZE*Math.random()*Math.cos(a);
let y=CSIZE*Math.random()*Math.sin(a);
*/
var ca=[new Circle(0,0,0,0,50,0,0)];

var setCircles=()=>{
  //for (let i=0; i<2000; i++) {
//ca[0].x+=10;
  let counter=0;
  for (let i=0; i<200; i++) {
    if (!grow()) counter++;
    if (counter>2) {
//console.log("no grow count "+i);
console.log("grow count "+i+" ca.len "+ca.length);
//console.log(ca[0]);
      break;
    }
  }
//console.log("grow count "+counter);
}

onresize();

reset();

start();

