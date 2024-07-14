"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;

const container=document.createElement("div");
container.style.margin="auto";
body.append(container);
for (let i=0; i<2; i++) {
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  c.ctx=c.getContext("2d");
  c.ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  c.ctx.lineWidth=0;
  c.ctx.lineCap="round";
  container.append(c);
}

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.width=container.style.height=D+"px";
  for (let i=0; i<container.children.length; i++) {
    let canv=container.children.item(i);
    canv.style.width=canv.style.height=D+"px";
  }
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=160;
  const CT=255-CBASE;
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(o+this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(o+this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(o+this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=30+130*Math.random();
    this.GK1=30+130*Math.random();
    this.BK1=30+130*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();

function Point(xp,yp) {
  this.randomize=()=>{
    this.K1=TP*Math.random();
    this.K2=240+240*Math.random();
    this.K3=TP*Math.random();
    this.K4=240+240*Math.random();
  }
  this.randomize();
  this.setLocation=()=>{
    let al=TP/8*(1+Math.sin(this.K1+TP*t/this.K2))/2;
    let r=CSIZE*(1+Math.sin(this.K3+TP*t/this.K4))/2;
    this.x=r*Math.cos(al);
    this.y=r*Math.sin(al);
  }
}

var cp1=new Point();

function Stem(ap) {
//  let a=ap; //TP*Math.random();
  let rf=1; //Math.random();
  this.xt=1*CSIZE*Math.cos(ap);
  this.yt=1*CSIZE*Math.sin(ap);
  this.getPath=()=>{
    let path=new Path2D();
    //path.moveTo(this.xo,this.yo);
    path.moveTo(0,0);
    //path.bezierCurveTo(0,this.yt/8,this.xo/2,2*CSIZE,this.xt,this.yt);
    //path.bezierCurveTo(0,0,this.xo/2,2*CSIZE,this.xt,this.yt);
    //path.bezierCurveTo(this.xo,this.yo,cp1.x,cp1.y,this.xt,this.yt);
    path.quadraticCurveTo(cp1.x,cp1.y,this.xt,this.yt);
    return path;
  }
}

var cycle=()=>{
  let canv1=container.removeChild(container.firstChild);
  canv1.ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  canv1.style.opacity=1;
  container.append(canv1);
//  let ctx=container.lastChild.ctx;
  cp1.randomize();
  KO1=TP*Math.random();
  KO2=1000+1000*Math.random();
  color.randomize(); 
  sa=getStems();
ldo=40-80*Math.random();
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
body.addEventListener("click", start, false);

var pauseTS=1000;
var pause=(ts)=>{
  if (EM) return;
  if (stopped) return;
  if (ts<pauseTS) requestAnimationFrame(pause);
  else requestAnimationFrame(animate);
}

var DUR=1000;
var t=0;
var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  c++;
  draw();
/*
  if (c>DUR-100) { 
let s=(DUR-c)/100;
    ctx.canvas.style.opacity=(DUR-c)/100;
stopped=true;
//console.log(ctx.canvas.style.opacity);
  }
//if (t==1000) stopped=true;
//if (EM && t%200==0) stopped=true
*/
  container.firstChild.style.opacity=Math.pow(1-c/DUR,5);
  if (c>=DUR) {
    c=0;
    cycle();
//stopped=true;
    pauseTS=performance.now()+5000;
    requestAnimationFrame(pause);
  } else
  requestAnimationFrame(animate);
}

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dmr=(()=>{
  let da=[];
  for (let i=0; i<4; i++) {
    da.push(new DOMMatrix([Math.cos(i*TP/4),Math.sin(i*TP/4),-Math.sin(i*TP/4),Math.cos(i*TP/4),0,0]));
  }
  return da;
})();

onresize();

var getStems=()=>{
  let count=getRandomInt(1,10,true);
console.log("count: "+count);
  let a=[];
  for (let i=0; i<=count; i++) a.push(new Stem(TP/8*i/count));
  return a;
}

var sa=getStems();

var dash;

var KO1=TP*Math.random();
var KO2=1000+1000*Math.random();

var ldo=40-80*Math.random();

var draw=()=>{
  let ctx=container.lastChild.ctx;
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  dash=240*(1-Math.cos(TP*c/(DUR)))/2;
  //ctx.setLineDash([dash,2*dash+1]);
  ctx.setLineDash([dash,1.6*dash,dash,1.6*dash,dash,1000]);
  //ctx.setLineDash([dash,dash,dash,4*dash]);
  //ctx.lineDashOffset=-200+200*(1+Math.cos(KO1+TP*t/(2*DUR)))/2;
//ctx.lineDashOffset=-240*(1-Math.cos(KO1+TP*c/(2*DUR)))/2;
//ctx.lineDashOffset=-240*(1-Math.cos(KO1+TP*t/KO2))/2;
  cp1.setLocation();
  var path=new Path2D();
  for (let i=0; i<sa.length; i++) {
ctx.lineDashOffset=i*ldo-240*(1+Math.sin(KO1+TP*t/KO2))/2;
    let path=new Path2D(sa[i].getPath());
    //let pth=sa[i].getPath();
    let pf=new Path2D(path);
    for (let i=1; i<dmr.length; i++) {
      pf.addPath(path,dmr[i]);
    }
    pf.addPath(pf,dmx);
    ctx.strokeStyle=color.getRGB(i/2);
    ctx.lineWidth=2;
    ctx.stroke(pf);
    ctx.strokeStyle="#00000018";
    ctx.lineWidth=6;
    ctx.stroke(pf);
  }
}

start();
