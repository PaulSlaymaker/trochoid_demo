"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=360;
const CSO=120;

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
   let red=Math.round(CBASE+CT*(Math.cos(this.RK2+c/this.RK1)));
   let grn=Math.round(CBASE+CT*(Math.cos(this.GK2+c/this.GK1)));
   let blu=Math.round(CBASE+CT*(Math.cos(this.BK2+c/this.BK1)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=120+120*Math.random();
    this.GK1=120+120*Math.random();
    this.BK1=120+120*Math.random();
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
if (EM && t%100==0) stopped=true;
  requestAnimationFrame(animate);
}

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dmr=new DOMMatrix([0,1,-1,0,0,0]);

let lw=CSIZE/6*Math.random();	// lw<CSIZE/6-20 ?
let lw2=20+80*Math.random();
let lw3=20;

//ctx.lineCap="square";

const K1=TP*Math.random();
const K2=TP*Math.random();
const KRO1=TP*Math.random();
const KRO2=TP*Math.random();
const KT1=60+100*Math.random();
const KT2=60+100*Math.random();
const KR1=60+100*Math.random();
const KR2=60+100*Math.random();

var getPathArray=()=>{
//  lw=CSIZE/3*(1+Math.sin(K1+t/120))/2;
  lw=CSIZE/3*(1+Math.sin(K1+t/KT1))/2*(0.5);	// extend only 0.3 of range
  let r=CSIZE/3-lw/2;

  let sq=new Path2D();	
let rz=r-lw/2*(1+Math.sin(KRO1+t/KR1))/2;
  //sq.moveTo(-r-lw,-r);
  sq.moveTo(-rz,-rz);
  sq.lineTo(0,-rz);
  sq.addPath(sq,dmx);
  sq.addPath(sq,dmy);
  sq.addPath(sq,dmr);

let sq2=new Path2D();	
let rco=2*r+lw;
for (let i=-1; i<2; i++) for (let j=-1; j<2; j++) {
  sq2.addPath(sq,new DOMMatrix([1,0,0,1,rco*i,j*rco]));
}
/*
sq2.addPath(sq,new DOMMatrix([1,0,0,1,-rco,-rco]));
sq2.addPath(sq,new DOMMatrix([1,0,0,1,   0,-rco]));
sq2.addPath(sq,new DOMMatrix([1,0,0,1,rco,-rco]));
sq2.addPath(sq,new DOMMatrix([1,0,0,1,-rco,0]));
sq2.addPath(sq,new DOMMatrix([1,0,0,1,rco,0]));
sq2.addPath(sq,new DOMMatrix([1,0,0,1,0,2*r+lw]));
*/

  //lw2=(r-lw/2)/3*Math.random();	// lw<CSIZE/6-20 ?
//lw2=(r-lw/2)/3*(1.5+0.5*Math.sin(K2+t/KT2))/2;
  lw2=(r-lw/2)/3*(1+Math.sin(K2+t/KT2))/2;
  let r2=(r-lw/2)/3-lw2/2;
  let sq3=new Path2D();	
  //sq3.moveTo(-r2-lw2,-r2);
  let rx=r2*(1+Math.sin(KRO2+t/KR2))/2;
  sq3.moveTo(-rx,-rx);
  sq3.lineTo(0,-rx);
  sq3.addPath(sq3,dmx);
  sq3.addPath(sq3,dmy);
  sq3.addPath(sq3,dmr);
  let sq4=new Path2D(sq3);	
  let rco2=2*r2+lw2;
  for (let i=-1; i<2; i++) for (let j=-1; j<2; j++) {
    sq4.addPath(sq3,new DOMMatrix([1,0,0,1,i*rco2,j*rco2]));
  }
  let sq5=new Path2D();	
  for (let i=-1; i<2; i++) for (let j=-1; j<2; j++) {
    sq5.addPath(sq4,new DOMMatrix([1,0,0,1,i*rco,j*rco]));
  }

/*
  //lw3=(r2-lw2/2)/3*Math.random();
  //lw3=(r2-lw2/2)/3/6;
lw3=(r2-lw2/2)/3*(1.5+0.5*Math.sin(K3+t/100))/2;
  let r3=(r2-lw2/2)/3-lw3/2;
  let sq6=new Path2D();	
  sq6.moveTo(-r3,-r3);
  //sq6.moveTo(-r3-lw3,-r3);
  sq6.lineTo(0,-r3);
  sq6.addPath(sq6,dmx);
  sq6.addPath(sq6,dmy);
  sq6.addPath(sq6,dmr);
  let sq7=new Path2D();	
  let rco3=2*r3+lw3;
  for (let i=-1; i<2; i++) for (let j=-1; j<2; j++) {
    sq7.addPath(sq6,new DOMMatrix([1,0,0,1,i*rco3,j*rco3]));
  }
  let sq8=new Path2D();	
  for (let i=-1; i<2; i++) for (let j=-1; j<2; j++) {
    sq8.addPath(sq7,new DOMMatrix([1,0,0,1,i*rco2,j*rco2]));
  }
  let sq9=new Path2D();	
  for (let i=-1; i<2; i++) for (let j=-1; j<2; j++) {
    sq9.addPath(sq8,new DOMMatrix([1,0,0,1,i*rco,j*rco]));
  }
*/

  return [sq2,sq5];
}

//ctx.globalAlpha=0.5;

//ctx.setLineDash([0.6,12]);
//ctx.setLineDash([0.6,4]);
//ctx.setLineDash([1,30]);
//ctx.fillStyle="#00000004";
ctx.fillStyle="#00000010";
var ss="#00000008";
//ctx.setLineDash([1,85]);

var DK1;
var DK2;
var DK3;
var DK4;
var DO1=TP*Math.random();
var DO2=TP*Math.random();
var DO3=TP*Math.random();
var DO4=TP*Math.random();
var DT1=300+300*Math.random();
var DT2=300+300*Math.random();
var DT3=300+300*Math.random();
var DT4=300+300*Math.random();

var draw=()=>{
  //ctx.beginPath();
  let pa=getPathArray();
  DK1=1+30*(1+Math.sin(DO1+t/DT1));
  DK2=1+30*(1+Math.sin(DO2+t/DT2));
  DK3=1+10*(1+Math.sin(DO3+t/DT3));
  DK4=1+10*(1+Math.sin(DO4+t/DT4));
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.setLineDash([DK1,DK2]);
  ctx.lineWidth=6;
  ctx.strokeStyle=ss;
  ctx.stroke(pa[0]);
  ctx.lineWidth=1;
  ctx.strokeStyle=color.getRGB(t);
  ctx.stroke(pa[0]);

  ctx.setLineDash([DK3,DK4]);
  ctx.lineWidth=6;
  ctx.strokeStyle=ss;
  ctx.stroke(pa[1]);
  ctx.lineWidth=1;
  ctx.strokeStyle=color.getRGB(t+300);
  ctx.stroke(pa[1]);
}

onresize();

start();
