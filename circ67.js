"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;

const container=document.createElement("div");
container.style.margin="auto";
body.append(container);
for (let i=0; i<3; i++) {
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  c.ctx=c.getContext("2d");
  c.ctx.translate(CSIZE,CSIZE);
  c.ctx.lineCap="round";
  c.ctx.globalCompositeOperation="destination-over";
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
  const CBASE=154;
  const CT=255-CBASE;
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(o+this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(o+this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(o+this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=80+80*Math.random();
    this.GK1=80+80*Math.random();
    this.BK1=80+80*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();

var cycle=()=>{
  let canv1=container.removeChild(container.firstChild);
  canv1.ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  canv1.style.opacity=1;
  container.append(canv1);
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

var t=0;
var c=0;
var DUR=400;
var animate=(ts)=>{
  if (stopped) return;
  t++,c++;
  draw();
  container.firstChild.style.opacity=1-c/DUR;
//if (EM && t%100==0) stopped=true
  if (c%DUR==0) {
    c=0;
    cycle();
    KD=2+100*Math.random();
    ncount=getRandomInt(0,11,true);
//KD=2+200*Math.random();
//stopped=true;
  }
 
  requestAnimationFrame(animate);
}

const getDualPath=(spath)=>{
  let ra=t/300;
  let sp=Math.sin(ra);
  let cp=Math.cos(ra);
  let dmr=new DOMMatrix([cp,sp,-sp,cp,0,0]);
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  let p=new Path2D();
  p.addPath(spath,dmr);
  p.addPath(p,dmy);
  p.addPath(p,dmx);
  return p;
}

function DistA(v) {
  this.KA=(400+400*Math.random())*[-1,1][getRandomInt(0,2)];
  //this.KA=240+120*v;
  //if (v%2) this.KA=-this.KA;
  this.KB=TP*Math.random();
  //this.getAngle=()=>{ return TP/8+TP/8*Math.sin(this.KB+t/this.KA); }
  //this.getAngle=()=>{ return TP/8+TP/16*Math.sin(this.KB+t/this.KA); }
  this.getAngle=()=>{ return TP/8*Math.cos(this.KB+t/this.KA); }
  //this.getAngle=()=>{ return TP/4*Math.sin(t/100)*Math.cos(this.KB+t/this.KA); }
}

function Dist(v) {
  this.KA=(200+200*Math.random())*[-1,1][getRandomInt(0,2)];
  //this.KA=240+120*v;
//if (dir) this.KA=-this.KA;
  //this.KB=0; //v/12; //TP*Math.random();
  this.KB=TP*Math.random();
  //this.getLocation=()=>{ return 24+(CSIZE-24)/2*(1+Math.sin(this.KB+t/this.KA)); }
  this.getLocation=()=>{ return CSIZE/2*(1+Math.sin(this.KB+t/this.KA)); }
}

var distaa=new Array();
for (let i=0; i<12; i++) distaa.push(new DistA(i));
var distra=new Array();
for (let i=0; i<12; i++) distra.push(new Dist(i));

var getDistance=(x1,y1,x2,y2)=>{
  let dx=x2-x1;
  let dy=y2-y1;
  return Math.pow(dx*dx+dy*dy,0.5);
}

let ctt=container.lastChild.ctx;

var setCircle=(idx,cxp,cyp,rp)=>{
  if (idx>ra.length-2) return;
  let x=ra[idx+1]*Math.cos(aa[idx]);
  let y=ra[idx+1]*Math.sin(aa[idx]);
  let pa=Math.atan2(y-cyp,x-cxp);
  let px=cxp+rp*Math.cos(pa);
  let py=cyp+rp*Math.sin(pa);
  let cx=(x+px)/2;
  let cy=(y+py)/2;
  let r=getDistance(cx,cy,x,y);
/*
  ctx.beginPath();
  ctx.arc(cx,cy,r,0,TP);
  ctx.stroke();
*/
  let p=new Path2D();
//let rr=r*(1-Math.cos(TP*t/DUR))/2;
//let rr=r*(1-Math.cos(TP*t/DUR))/4;
  p.arc(cx,cy,r,0,TP);
  p=getDualPath(p);
  ctt.strokeStyle=color.getRGB(r/12);
  //ctt.lineWidth=Math.min(2,rr+0.001);
  ctt.lineWidth=Math.min(2,r);
  ctt.stroke(p);

  ctt.strokeStyle="#00000010";
  ctt.lineWidth=8;
  ctt.stroke(p);

  setCircle(idx+1,cx,cy,r);
}

var KK=TP*Math.random();
var KD=2+100*Math.random();
var dash;

let ra=new Array();
let aa=new Array();

var ncount=5;

let r1=ra[0]/2.414;
let cx1=r1;
let cy1=r1;
var path=new Path2D();
ctt.lineWidth=2;
ctt.setLineDash([20,10000]);

var draw=()=>{
ra=[];
aa=[];
path=new Path2D();
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//ctx.fillStyle="#00000010";
//ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<distra.length-ncount; i++) ra.push(distra[i].getLocation());
  ra.sort((a,b)=>{ return a-b; });
  for (let i=0; i<distaa.length-ncount; i++) aa.push(distaa[i].getAngle());
  aa.sort((a,b)=>{ return a-b; });
  for (let i=0; i<aa.length-ncount; i++) aa[i]=TP/8+TP/8*Math.sin(KK+aa[i]);

r1=ra[0];
cx1=0;
cy1=0;
//r1=ra[0]/2.414;
//cx1=r1;
//cy1=r1;
//ctt.beginPath();
//ctt.arc(cx1,cy1,r1,0,TP);
//ctt.stroke();
  ctt=container.lastChild.ctx;
  dash=KD*(1-Math.cos(TP*c/DUR));
  ctt.setLineDash([dash,400]);
  //setCircle(0,cx1,cy1,r1);
  setCircle(0,0,0,ra[0]);
}

onresize();

start();

