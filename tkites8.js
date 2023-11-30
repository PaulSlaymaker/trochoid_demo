"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
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
  return c.getContext("2d", {"willReadFrequently": true});
})();
ctxo.setTransform(1,0,0,1,CSO,CSO);
ctxo.lineWidth=1;

const ctxo2=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSO;
  return c.getContext("2d", {"willReadFrequently": true});
})();
ctxo2.setTransform(1,0,0,1,CSO,CSO);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=64;
  const CT=255-CBASE;
  const RKO=Math.random();
  let GKO=Math.random();
  let BKO=Math.random();
  let RKK=100+200*Math.random();
  let GKK=100+200*Math.random();
  let BKK=100+200*Math.random();
  this.getRGB=()=>{
    this.fr=0.8*(1-Math.cos(RKO+t/this.RKF))/2;
    this.fg=0.8*(1-Math.cos(GKO+t/this.GKF))/2;
    this.fb=0.8*(1-Math.cos(BKO+t/this.BKF))/2;
    this.RK3=6+36*(1-Math.sin(t/RKK))/2;
    this.GK3=6+36*(1-Math.sin(t/GKK))/2;
    this.BK3=6+36*(1-Math.sin(t/BKK))/2;
    let red=Math.round(CBASE+CT*(1+this.fr*Math.cos(this.RK2+t/this.RK1)+(1-this.fr)*Math.cos(this.RK2+t/this.RK3))/2);
    let grn=Math.round(CBASE+CT*(1+this.fg*Math.cos(this.GK2+t/this.GK1)+(1-this.fg)*Math.cos(this.GK2+t/this.GK3))/2);
    let blu=Math.round(CBASE+CT*(1+this.fb*Math.cos(this.BK2+t/this.BK1)+(1-this.fb)*Math.cos(this.BK2+t/this.BK3))/2);
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=1000+1000*Math.random();
    this.GK1=1000+1000*Math.random();
    this.BK1=1000+1000*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.RKF=100+200*Math.random();
    this.GKF=100+200*Math.random();
    this.BKF=100+200*Math.random();
  }
  this.randomize();
}

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dmr=new DOMMatrix([0,1,-1,0,0,0]);

/*
var Brush=function() {
  this.path=new Path2D();
    this.path.moveTo(CSO,CSO);
    this.path.lineTo(CSO,0);
    this.path.addPath(this.path,dmx);
    this.path.addPath(this.path,dmy);
    this.path.addPath(this.path,dmr);
  this.getPath=()=>{
    let p=new Path2D();
    //this.x=CSO/2-CSO/2*(this.xf*Math.cos(this.k1+t/this.k2)+(1-this.xf)*Math.cos(t/this.k5));
    //let r=(6+this.sr*Math.pow(this.rf*Math.cos(this.k3+t/this.k4)+(1-this.rf)*Math.cos(t/this.k6),2));
//this.x=CSO/2+(CSO-CSO/2)*(1-Math.cos(this.k1+t/this.k2));
    //this.r=CSO/2; //(this.sr*Math.pow(this.rf*Math.cos(this.k3+t/this.k4)+(1-this.rf)*Math.cos(t/this.k6),2));
    //this.r=40+(CSO-40)*Math.pow(this.rf*Math.cos(this.k3+t/this.k4)+(1-this.rf)*Math.cos(t/this.k6),2);
    this.r=10+(CSO/2-10)*Math.pow(this.rf*Math.cos(this.k3+t/this.k4)+(1-this.rf)*Math.cos(t/this.k6),2);
//this.y=this.r+(CSO-this.r)*(1-Math.cos(this.k1+t/this.k2));
    p.moveTo(CSO,CSO/2);
    p.lineTo(CSO,CSO/2+this.r);
    p.moveTo(CSO,CSO/2);
    p.lineTo(CSO,CSO/2-this.r);
    p.addPath(p,dmx);
    p.addPath(p,dmy);
    p.addPath(p,dmr);
    return p;
  }
  this.randomize=()=>{
    this.k1=TP*Math.random();
    this.k2=40+160*Math.random();
    this.k3=TP*Math.random();
    this.k4=40+160*Math.random();
//    this.ry=8+80*Math.random();
    //this.sr=20+40*Math.random();
    this.sr=CSO*(0.1+0.8*Math.random());
    this.xf=1-Math.pow(0.9*Math.random(),10);
    this.k5=30+60*Math.random();
    this.rf=1-Math.pow(0.9*Math.random(),8);
    this.k6=12+60*Math.random();
//    this.type=Math.random()<0.7;
  }
  this.randomize();
}
*/

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
//ctxo.clearRect(0,0,2*CSO,2*CSO);
//drawTiles();
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  if (!(t%5)) draw();
  requestAnimationFrame(animate);
}

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
  }
  ctxo2.putImageData(ctxo.getImageData(0,0,2*CSO,2*CSO),0,0);
  ctxo2.fillStyle="#00000010";
  ctxo2.fillRect(-CSO,-CSO,2*CSO,2*CSO);
  for (let i=0; i<12; i+=2) {
    let a1=(i+2)%12, a2=(i+5)%12, a3=(i+6)%12, a4=(i+9)%12;
    let b1=(i+1)%12, b2=(i+0)%12, b3=(i+3)%12, b4=(i+4)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],
      CSIZE+(ttb[b1]+ttb[b2]*S6)*CSO,CSIZE+(ttb[b3]+ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo2.canvas,0,0);
    a1=(i+9)%12, a3=(i+5)%12, a4=(i+8)%12;
    b1=(i+3)%12, b2=(i+4)%12, b3=(i+7)%12, b4=(i+6)%12;
    ctx.setTransform(tta[a1],tta[i],tta[a3],tta[a4],
      CSIZE+(ttb[b1]+ttb[b2]*S6)*CSO,CSIZE+(ttb[b3]+ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo2.canvas,0,0);
  }
  ctxo2.fillStyle="#00000020";
  ctxo2.fillRect(-CSO,-CSO,2*CSO,2*CSO);
  for (let i=0; i<12; i+=2) {
    let a1=(i+3)%12, a4=(i+9)%12;
    let b1=(i+8)%12, b2=(i+7)%12, b3=(i+4)%12, b4=(i+5)%12;
    ctx.setTransform(tta[a1],tta[i],tta[i],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo2.canvas,0,0);
    a1=(i+6)%12; let a2=(i+3)%12; let a3=(i+3)%12;
    b1=(i+5)%12, b2=(i+4)%12, b3=(i+1)%12, b4=(i+2)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[i],
      CSIZE+(ttb[b1]+ttb[b2]*S6)*CSO,CSIZE+(ttb[b3]+ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo2.canvas,0,0);
  }
  ctxo2.fillStyle="#00000030";
  ctxo2.fillRect(-CSO,-CSO,2*CSO,2*CSO);
  for (let i=0; i<12; i+=2) {
    let a1=(i+2)%12, a2=(i+5)%12, a4=(i+3)%12;
    let b1=(i+4)%12, b2=(i+5)%12, b3=(i+8)%12, b4=(i+7)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[i],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo2.canvas,0,0);
    a1=(i+5)%12, a2=(i+2)%12; let a3=(i+7)%12; a4=(i+4)%12;
    b1=(i+10)%12, b2=(i+9)%12, b3=(i+6)%12, b4=(i+7)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo2.canvas,0,0);
  }
  let id=ctxo.getImageData(0,0,2*CSO,2*CSO);
  ctxo2.fillStyle="#00000040";
  ctxo2.fillRect(-CSO,-CSO,2*CSO,2*CSO);
  for (let i=0; i<12; i+=2) {
    let a1=(i+2)%12, a2=(i+11)%12, a3=(i+7)%12, a4=(i+4)%12;
    let b1=(i+4)%12, b2=(i+5)%12, b3=(i+2)%12, b4=(i+1)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo2.canvas,0,0);
    a1=(i+2)%12, a2=(i+5)%12, a3=(i+7)%12, a4=(i+10)%12;
    b1=(i+4)%12, b2=(i+5)%12, b3=(i+8)%12, b4=(i+7)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo2.canvas,0,0);
  }
}

var col=new Color();
//var brush=new Brush();

var path=new Path2D();
path.moveTo(CSO,CSO);
path.lineTo(CSO,0);
path.addPath(path,dmx);
path.addPath(path,dmy);
path.addPath(path,dmr);
/*
  this.path=new Path2D();
    this.path.moveTo(CSO,CSO);
    this.path.lineTo(CSO,0);
    this.path.addPath(this.path,dmx);
    this.path.addPath(this.path,dmy);
    this.path.addPath(this.path,dmr);
*/ 

//var dash;

var draw=()=>{
//  ctxo.clearRect(-CSO,-CSO,2*CSO,2*CSO);
/*
  var id=ctxo.getImageData(CSO,CSO,CSO,CSO);
  ctxo.putImageData(id,CSO+1,CSO+1);
  id=ctxo.getImageData(0,CSO,CSO,CSO);
  ctxo.putImageData(id,-1,CSO+1);
  id=ctxo.getImageData(CSO,0,CSO,CSO);
  ctxo.putImageData(id,CSO+1,-1);
  id=ctxo.getImageData(0,0,CSO,CSO);
  ctxo.putImageData(id,-1,-1);
*/
  var id=ctxo.getImageData(CSO+1,CSO+1,CSO-1,CSO-1);
  ctxo.putImageData(id,CSO,CSO);
  id=ctxo.getImageData(0,CSO+1,CSO-1,CSO-1);
  ctxo.putImageData(id,1,CSO);
  id=ctxo.getImageData(CSO+1,0,CSO-1,CSO-1);
  ctxo.putImageData(id,CSO,1);
  id=ctxo.getImageData(0,0,CSO-1,CSO-1);
  ctxo.putImageData(id,1,1);

  ctxo.strokeStyle=col.getRGB();
//  ctxo.stroke();
//ctxo.globalAlpha=(1+Math.sin(t/200))/2;
//dash=[30+(CSO-30)*(1+Math.cos(t/490))/2,20+30*(1+Math.sin(t/460))/2];
//dash=[30+60*(1+Math.cos(t/490))/2,20+30*(1+Math.sin(t/460))/2];
ctxo.setLineDash([30+50*(1+Math.cos(t/490))/2,10+20*(1+Math.sin(t/400))/2]);
//ctxo.setLineDash(dash);
ctxo.lineDashOffset=t/5;
//  let p=brush.getPath();
  ctxo.stroke(path);
  drawTiles();

/*
//  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
//  ctx.drawImage(ctxo.canvas,150,150,200,200);
ctx.lineWidth=4;
ctx.strokeStyle="white";
ctx.strokeRect(150,150,200,200);
*/
}

onresize();

/*
ctxo.lineWidth=2;
ctxo.beginPath();
ctxo.moveTo(-CSO,0);
ctxo.lineTo(CSO,0)
ctxo.lineTo(0,2*CSO)
ctxo.stroke();
ctxo.strokeStyle="yellow";
ctxo.beginPath();
ctxo.moveTo(2*CSO,0);
ctxo.lineTo(2*CSO,2*CSO)
ctxo.lineTo(0,2*CSO)
ctxo.stroke();
*/

//ctxo.strokeRect(-CSO,-CSO,2*CSO,2*CSO);
drawTiles();

start();

var test=()=>{
  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.drawImage(ctxo.canvas,0,0);
}
