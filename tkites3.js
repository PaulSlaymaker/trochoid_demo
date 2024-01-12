"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/BaqqWZe
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;
const CSO=52;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);

const ctxo=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSO;
  return c.getContext("2d");
})();
ctxo.setTransform(1,0,0,1,CSO,CSO);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=143;
  //const CBASE=159;
  const CT=255-CBASE;
//  const CT=255;
//  const CBASE=-32;
  this.RK1=20+20*Math.random();
  this.GK1=20+20*Math.random();
  this.BK1=20+20*Math.random();
  this.AK1=80+80*Math.random();
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.set=(c)=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1));
    this.v="rgb("+red+","+grn+","+blu+")";
  }
  this.set(0);
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var color=new Color();
var color2=new Color();

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  if (t%2000==0) d=(d==6)?2:6;
  if (t%3000==0) strokeFct=(strokeFct==strokeTile)?strokeTile2:strokeTile;
  draw();
if (EM && t%300==0) stopped=true;
  requestAnimationFrame(animate);
}

onresize();

/*
ctxo.beginPath();
//ctxo.arc(0,0,40,0,TP);
ctxo.lineWidth=2;
ctxo.strokeStyle="yellow";
ctxo.strokeRect(-CSO,-CSO,2*CSO,2*CSO);
let x=-CSO+2*CSO*Math.random();
//let y=-CSO+2*CSO*Math.random();
let r=10+(CSO-10)*Math.random();
ctxo.beginPath();
ctxo.arc(x,-x,r,0,TP);
//ctxo.ellipse(x,-x,r,2*r,TP/8,0,TP);
ctxo.lineWidth=3;
ctxo.strokeStyle=color.v;
ctxo.stroke();
*/

const S6=Math.sin(TP/6);
const tta=[0,0.5,S6,1,S6,0.5,0,-0.5,-S6,-1,-S6,-0.5];
const ttb=[0,1,2,2,2,1,0,-1,-2,-2,-2,-1];

var drawTiles=()=>{
  for (let i=0; i<12; i+=2) {
    let a1=(i+4)%12, a2=(i+1)%12, a3=(i+5)%12, a4=(i+2)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],CSIZE,CSIZE);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+4)%12, a2=(i+1)%12, a3=(i+3)%12, a4=(i+0)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],CSIZE,CSIZE);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+2)%12, a2=(i+5)%12, a3=(i+6)%12, a4=(i+9)%12;
    let b1=(i+1)%12, b2=(i+0)%12, b3=(i+3)%12, b4=(i+4)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],
      CSIZE+(ttb[b1]+ttb[b2]*S6)*CSO,CSIZE+(ttb[b3]+ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+9)%12, a3=(i+5)%12, a4=(i+8)%12;
    b1=(i+3)%12, b2=(i+4)%12, b3=(i+7)%12, b4=(i+6)%12;
    ctx.setTransform(tta[a1],tta[i],tta[a3],tta[a4],
      CSIZE+(ttb[b1]+ttb[b2]*S6)*CSO,CSIZE+(ttb[b3]+ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+3)%12, a4=(i+9)%12;
    b1=(i+8)%12, b2=(i+7)%12, b3=(i+4)%12, b4=(i+5)%12;
    ctx.setTransform(tta[a1],tta[i],tta[i],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+6)%12, a2=(i+3)%12, a3=(i+3)%12;
    b1=(i+5)%12, b2=(i+4)%12, b3=(i+1)%12, b4=(i+2)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[i],
      CSIZE+(ttb[b1]+ttb[b2]*S6)*CSO,CSIZE+(ttb[b3]+ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+2)%12, a2=(i+5)%12, a4=(i+3)%12;
    b1=(i+4)%12, b2=(i+5)%12, b3=(i+8)%12, b4=(i+7)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[i],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+5)%12, a2=(i+2)%12, a3=(i+7)%12, a4=(i+4)%12;
    b1=(i+10)%12, b2=(i+9)%12, b3=(i+6)%12, b4=(i+7)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+2)%12, a2=(i+11)%12, a3=(i+7)%12, a4=(i+4)%12;
    b1=(i+4)%12, b2=(i+5)%12, b3=(i+2)%12, b4=(i+1)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+2)%12, a2=(i+5)%12, a3=(i+7)%12, a4=(i+10)%12;
    b1=(i+4)%12, b2=(i+5)%12, b3=(i+8)%12, b4=(i+7)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
  }
}

//drawTiles();

/*
var KK0=TP*Math.random();
var KK1=60+200*Math.random();
var KK2=TP*Math.random();
var KK3=60+200*Math.random();
const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);
var strokeTile3=()=>{
let a=TP*t/2400;
  let x=1.42*CSO*Math.cos(a);
  let y=1.42*CSO*Math.sin(a);
  let path=new Path2D();
  path.moveTo(0,0);
  path.lineTo(x,y);
  let p=new Path2D(path);
  p.addPath(p,dm1);
  p.addPath(p,dm2);
  let d1=Math.max(10,10+20*Math.cos(KK0+t/KK1));
  let d2=Math.max(10,10+20*Math.cos(KK2+t/KK3));
ctxo.setTransform(1,0,0,1,CSO,CSO);
  color.set(t);
  color2.set(t);
  ctxo.setLineDash([d1,d2]);
  ctxo.lineDashOffset=0;
  ctxo.strokeStyle=color.v;
  ctxo.stroke(p);
  ctxo.setLineDash([d2,d1]);
  ctxo.lineDashOffset=d2;
  ctxo.strokeStyle=color2.v;
  ctxo.stroke(p);
}
*/

var K1=0.5+1.5*Math.random();
var K2=0.5+1.5*Math.random();
var K3=50+40*Math.random();

var strokeTile2=()=>{
  ctxo.beginPath();
  let xv=CSO*Math.cos(t/90);
  let x1=1.4*CSO*Math.cos(t/80);
  let y1=1.4*CSO*Math.sin(t/80);
  ctxo.moveTo(xv,-xv);
  ctxo.lineTo(x1,y1);
  let x2=1.4*CSO*Math.sin(t/80+TP/2);
  let y2=1.4*CSO*Math.cos(t/80+TP/2);
  ctxo.moveTo(xv,-xv);
  ctxo.lineTo(x2,y2);
/*
  let x3=1.4*CSO*Math.cos(t/190+TP/2);
  let y3=1.4*CSO*Math.sin(t/190+TP/2);
  ctxo.moveTo(0,0);
  ctxo.lineTo(x3,y3);
  let x4=1.4*CSO*Math.sin(t/190);
  let y4=1.4*CSO*Math.cos(t/190);
  ctxo.moveTo(0,0);
  ctxo.lineTo(x4,y4);
*/

  ctxo.setLineDash([]);
  ctxo.lineWidth=6;
  ctxo.strokeStyle="#0000000C";
  ctxo.stroke();
  ctxo.lineWidth=1;
  color.set(K1*t);
  ctxo.strokeStyle=color.v;
  let dd=6+2*CSO*Math.pow(Math.cos(t/K3),2);
  ctxo.setLineDash([dd-6,10000]);
  //ctxo.setLineDash([dd,6,dd,10000]);
  ctxo.stroke();
  color2.set(K2*t);
  ctxo.strokeStyle=color2.v;
  ctxo.setLineDash([0,dd+6,10000]);
//ctxo.setLineDash([0,dd+6,dd,10000]);
  ctxo.stroke();
}

var d=2;//[2,6][getRandomInt(0,2)];

var strokeTile=()=>{
  let x=CSO*Math.sin(t/90);
  let rt=1.5*CSO*Math.pow(Math.cos(t/190),2);
  ctxo.beginPath();
  ctxo.arc(x,-x,rt,0,TP);
//ctxo.moveTo(-x,x+rt);
//ctxo.arc(-x,x,rt,0,TP);
//ctxo.ellipse(x,-x,rt+rt*Math.sin(t/40)/2,rt,TP/8,0,TP);
  ctxo.setLineDash([]);
  ctxo.lineWidth=10;
  ctxo.strokeStyle="#0000000C";
  ctxo.stroke();
  color.set(K1*t);
  ctxo.strokeStyle=color.v;
  ctxo.setLineDash([Math.PI*rt/d-2,Math.PI*rt/d+2]);
  ctxo.lineDashOffset=0;
  ctxo.lineWidth=2;
  ctxo.stroke();
  color2.set(K2*t);
  ctxo.strokeStyle=color2.v;
  ctxo.lineDashOffset=Math.PI*rt/d;
  ctxo.stroke();
  //ctxo.lineDashOffset=0;
}

var strokeFct=strokeTile;

var draw=()=>{
  ctxo.clearRect(-CSO,-CSO,2*CSO,2*CSO);
  //strokeTile3();
  strokeFct();
  drawTiles();
}

//ctxo.strokeRect(-CSO,-CSO,2*CSO,2*CSO);
start();
//drawTiles();
