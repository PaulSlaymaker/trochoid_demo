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
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";
//ctx.font="bold 12px sans-serif";
//ctx.textAlign="center";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
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
this.dormant=false;
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
    //this.path.moveTo(0,0);
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
  }
  this.drawCurve=(gs)=>{
    //let tt=this.to+t;
let tt=t;
//if (gs!=this.set) debugger;
//if (gs) {
if (this.set) {
    ctx.setLineDash([Math.max(1,tt),3000]);
} else {
tt=DUR-t;
ctx.setLineDash([Math.max(1,tt),3000]);
}

ctx.lineWidth=32-40*this.len/2000;
ctx.strokeStyle="hsla("+(hue+360*this.len/2000)+",90%,60%,0.5)";

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
  //if (Math.abs(x)>CSIZE-rad) return false;
  //if (Math.abs(y)>CSIZE-rad) return false;
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
//console.log(eg);

var grow=(rad)=>{
  //let bca=ca.filter((c)=>{ return !c.dormant; });
//if (ca.length>60) { console.log(bca); }

for (let i=0; i<97; i++) {
  //let c=bca[getRandomInt(0,bca.length)];
  let c=ca[getRandomInt(0,ca.length)];
  //let c=ca[ca.length-1-getRandomInt(0,ca.length,true)]
//let rad2=42-i/4;
//let rad2=42-i/4;
let rad2=36-i/4;
//if (rad2==24) c.dormant=true;
if (rad2<12) {
console.log(rad2);
debugger;
return false;
}
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
//  c.dormant=true;
  return false;
}

/*
var growO=(rad)=>{
  let c=eg
        ?ca[ca.length-1-getRandomInt(0,ca.length,true)]
        :ca[getRandomInt(0,ca.length)];
  let a=TP*Math.random();
  let x=c.x+(c.radius+rad)*Math.cos(a);
  let y=c.y+(c.radius+rad)*Math.sin(a);
  if (cval(x,y,rad)) {
    let xp=c.x+c.radius*Math.cos(a);
    let yp=c.y+c.radius*Math.sin(a);
    let circle=new Circle(x,y,xp,yp,rad,c);
    c.c.push(circle);
    ca.push(circle);
    return true;
  }
  return false;
}
*/

ctx.fillStyle="green";
ctx.lineWidth=7;

var drawCurveSet=(cuixd)=>{
  ctx.save();
  ctx.strokeStyle="white";
  ctx.lineWidth=1;
  ctx.setLineDash([]);
  for (let i=0; i<cu[cuixd].length; i++) {
    ctx.stroke(cu[cuixd][i].path);
  }
  ctx.restore();
}

var draw=()=>{
//  ctx.strokeStyle="hsla("+hue+",90%,60%,0.4)";
//ctx.strokeStyle="hsla("+hue+",90%,60%,0.1)";
//ctx.fillStyle="#00000020";
//ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  //  for (let i=0; i<ca.length; i++) { ca[i].draw(); }
  let drawn=0;

//CURVE
for (let i=0; i<curves.length; i++) {
  if (curves[i].drawCurve()) drawn++;
}

/*
//CU
for (let j=0; j<2; j++) {
  for (let i=0; i<cu[j].length; i++) {
    if (cu[j][i].drawCurve(j)) drawn++;
  }
}
*/

/*
  for (let i=0; i<curves.length; i++) {
    if (i%2) ctx.strokeStyle="hsla("+hue+",90%,60%,0.6)";
//  ctx.strokeStyle="hsla("+getRandomInt(0,360)+",90%,60%,0.6)";
    else ctx.strokeStyle="hsla("+270+",90%,60%,0.6)";
    if (curves[i].drawCurve(i)) drawn++;
  }
*/
  //drawPoint(ca[0].x,ca[0].y,"silver");
  drawPoint(ca[0].x,ca[0].y,ctx.strokeStyle);
//if (t>1400) console.log("tt "+t);
//if (!drawn) console.log("maxt "+t);
  return drawn;
}

/*
var draw2=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<ca.length; i++) { ca[i].draw(); }
  let grown=0;
  for (let i=0; i<curves.length; i++) {
    //if (drawCurve(curves[i])) grown++;
    if (curves[i].drawCurve()) grown++;
  }
  drawPoint(0,0,"silver");
  return grown;
}
*/

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

var t=0;
const INC=7;
var inc=INC;
const DUR=1300;
var animate=()=>{
  if (stopped) return;
  //t++;
  t+=inc;
//  ctx.setLineDash([t,2000]);
//  ctx.lineDashOffset=-t+1000;
/*
  if (!draw() || t<0) {		// +- 1300
    if (inc==3) {
      inc=-3;
//console.log("maxt "+t);
    } else { 
      inc=3; 
      t=0; 
      reset();
    }
  }
*/
draw();
  if (t>DUR) {
//stopped=true;
//drawCircles(false,"#FFFFFF40",8);
//drawCircles(true,"red");
pruneCircles(0);
setCircles();
//drawCircles(false,"green",2);
setCurves2(0);
//drawCurveSet(0);
    // prune circles, 0
    // regenerate paths to
    // replace red
    inc=-INC;
  } else if (t<0) {
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
var ca=[new Circle(0,0,0,0,50,0,0)];

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
// need to set ca[i].cuidx01
/*
  ca.forEach((c,i)=>{
    if (!c.cuidx1 && c.cuidx0) ca.splice(i,1);
  });
*/
console.log("prune from "+pc+" to "+ca.length);
}

var lengths=[
]

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
  curves.sort((a,b)=>{ return a.len-b.len; });
console.log("cuidx "+csidx+" len "+curves.length);
}

/*
var setCurves=(csidx)=>{
  cu[csidx]=[];
//let i=curves.length;
//while (i--) if (curves[i].set==csidx) curves.splice(i,1); 
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
      cu[csidx].push(nc)
    }
  }
cu[csidx].sort((a,b)=>{ return b.len-a.len; });
console.log("cuidx "+csidx+" len "+cu[csidx].length);
}
*/

var initCurves=()=>{
  curves=[];
  cu[0]=[];
  cu[1]=[];
  for (let i=0; i<ca.length; i++) {
    if (ca[i].c.length==0) {
//let csidx=(cu[0].length>cu[1].length)?1:0;
let csidx=(curves.length%2);
      var nc=new Curve(csidx);
      nc.car=[ca[i]];
      nc.addCurveCircle(ca[i],csidx);
      nc.setPath();
      curves.push(nc)
//      cu[csidx].push(nc);
    }
  }
curves.sort((a,b)=>{ return a.len-b.len; });
console.log("curves "+curves.length);
}

let a=TP*Math.random();
let x=CSIZE*Math.random()*Math.cos(a);
let y=CSIZE*Math.random()*Math.sin(a);
ca=[new Circle(x,y,0,0,50,0,0)];

var setCircles=()=>{
  //for (let i=0; i<2000; i++) {
  let counter=0;
    let r=42;
  for (let i=0; i<200; i++) {
    if (!grow(r)) counter++;
    //if (!grow(r)) {
    if (counter>3) {
//console.log("no grow count "+i);
console.log("grow count "+i+" ca.len "+ca.length);
//console.log(ca[0]);
break;
    }
  }
//console.log("grow count "+counter+" "+r);
}

onresize();

reset();

//draw();
//drawCircles();
start();

var getRandomCurve=()=>{
  let rnd=getRandomInt(0,curves.length);
  console.log(curves.splice(rnd,1));
}

