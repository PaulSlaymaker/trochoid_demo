"use strict"; // Paul Slaymaker, paul25882@gmail.com,  https://codepen.io/aymak/pen/QWZzQep
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;
const CSO=40;

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

function Color(type) {
  const CBASE=127;
  const CT=255-CBASE;
  if (type==0) {
    if (Math.random()<0.3) {
      this.TF=2;
      this.CR=20;
    } else if (Math.random()<0.7) {
      this.TF=2;
      this.CR=30;
    } else {
      this.TF=1;
      this.CR=40;
    }
  } else {
    if (Math.random()<0.5) {
      this.TF=1;
      this.CR=40;
    } else {
      this.TF=2;
      this.CR=20;
    }
  }
  this.RK1=this.CR+this.CR*Math.random();
  this.GK1=this.CR+this.CR*Math.random();
  this.BK1=this.CR+this.CR*Math.random();
  this.RK2=this.TF*Math.PI-Math.random();
  this.GK2=this.TF*Math.PI-Math.random();
  this.BK2=this.TF*Math.PI-Math.random();
  this.set=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    this.v="rgb("+red+","+grn+","+blu+")";
  }
  this.set();
}

const DMO=new DOMMatrix([-1,0,0,-1,0,0]);

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

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  if (t==280) {
    if (Math.random()<0.5) {
      strokeFct=strokeTile2;
      color=new Color(0);
    } else {
      strokeFct=strokeTile;
      color=new Color(1);
    }
    t=0;
if (EM) stopped=true;
  }
  if (t<200) draw();
  requestAnimationFrame(animate);
}

onresize();

const S1=Math.sin(TP/16);
const S2=Math.sin(TP/8);
const S3=Math.sin(3*TP/16);

var strokeTile2=()=>{
  let z=TP*t/800;
  let p=new Path2D();
  let xv=CSO*Math.cos(z);
  let x1=1.4*CSO*Math.cos(z);
  let y1=1.4*CSO*Math.sin(z);
  p.moveTo(xv,-xv);
  p.lineTo(x1,y1);
  let x2=1.4*CSO*Math.sin(z+TP/2);
  let y2=1.4*CSO*Math.cos(z+TP/2);
  p.moveTo(xv,-xv);
  p.lineTo(x2,y2);
  let p2=new Path2D();
  p2.addPath(p,DMO);
  color.set();
  ctxo.strokeStyle=color.v;
  ctxo.save();
  ctxo.clip(clip);
  ctxo.stroke(p);
  ctxo.restore();
  ctxo.save();
  ctxo.clip(clip2);
  ctxo.stroke(p2);
  ctxo.restore();
}

var clip=new Path2D();
var clip2=new Path2D();
clip.moveTo(-CSO,-CSO);
clip.lineTo(CSO,CSO);
clip.lineTo(CSO,-CSO);
clip.closePath();
clip2.moveTo(-CSO,-CSO);
clip2.lineTo(CSO,CSO);
clip2.lineTo(-CSO,CSO);
clip2.closePath();

var strokeTile=()=>{
  let rt=1.42*CSO*Math.pow(Math.cos(TP*t/800),2);
  let p=new Path2D();
  p.arc(0,0,rt,0,TP);
//p.ellipse(x,-x,rt+rt*Math.sin(t/200),rt,TP/8,0,TP);
//  p.addPath(p,new DOMMatrix([-1,0,0,-1,0,0]));
  let p2=new Path2D();
  p2.addPath(p,DMO);
  color.set();
  ctxo.strokeStyle=color.v;
  ctxo.save();
  ctxo.clip(clip);
  ctxo.stroke(p);
  ctxo.restore();
  ctxo.save();
  ctxo.clip(clip2);
  ctxo.stroke(p2);
  ctxo.restore();
}

var strokeFct=strokeTile;

var draw=()=>{
  ctxo.clearRect(-CSO,-CSO,2*CSO,2*CSO);
  strokeFct();
  drawTiles();
}

const tta=[0,S1,S2,S3,1,S3,S2,S1,0,-S1,-S2,-S3,-1,-S3,-S2,-S1];
const ttb=[4-2*S1, 4-2*S3, 2*S1,-2*S1,-4+2*S3,-4+2*S1,-2-2*S3,-2-2*S3,
          -4+2*S1,-4+2*S3,-2*S1, 2*S1, 4-2*S3, 4-2*S1, 2+2*S3, 2+2*S3];
const ttb2=[6,4,2*S2,-2*S2,-4,-6,-8+S3,-8+S3,-6,-4,-2*S2,2*S2,4,6,8-S3,8-S3];
const ttb3=[6+2*S3, 6-2*S1, 2*S3,-2*S3,-6+2*S1,-6-2*S3,-10+2*S1,-10+2*S1,
           -6-2*S3,-6+2*S1,-2*S3, 2*S3, 6-2*S1, 6+2*S3, 10-2*S1, 10-2*S1];
const ttb4=[10-4*S1,2+4*S3,2,-2,-2-4*S3,-10+4*S1,-10,-10,-10+4*S1,-2-4*S3,-2,2,2+4*S3,10-4*S1,10,10];

var drawTiles=()=>{
  for (let i=0; i<16; i++) {
    let a1=(i+7)%16, a2=(i+3)%16, a3=(i+6)%16, a4=(i+2)%16;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],CSIZE,CSIZE);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+7)%16, a2=(i+3)%16, a3=(i+13)%16, a4=(i+9)%16;
    let b1, b2=(i+12)%16;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],CSIZE+ttb[i]*CSO,CSIZE+ttb[b2]*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+1)%16, a2=(i+13)%16, a3=(i+4)%16;
    b1=(i+13)%16, b2=(i+9)%16;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[i],CSIZE+ttb[b1]*CSO,CSIZE+ttb[b2]*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+8)%16, a2=(i+4)%16, a3=(i+12)%16, a4=(i+8)%16;
    b2=(i+12)%16;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],CSIZE+ttb2[i]*CSO,CSIZE+ttb2[b2]*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+11)%16, a2=(i+7)%16, a4=(i+12)%16;
    ctx.setTransform(tta[a1],tta[a2],tta[i],tta[a4],CSIZE+ttb3[i]*CSO,CSIZE+ttb3[b2]*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+1)%16, a2=(i+13)%16, a3=(i+3)%16, a4=(i+15)%16;
    b1=(i+1)%16, b2=(i+13)%16;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],CSIZE+ttb3[b1]*CSO,CSIZE+ttb3[b2]*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+10)%16, a2=(i+6)%16, a3=(i+1)%16, a4=(i+13)%16;
    b2=(i+12)%16;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],CSIZE+ttb4[i]*CSO,CSIZE+ttb4[b2]*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
  }
}

start();
