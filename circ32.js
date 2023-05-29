"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/yLRvdBg
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
//c.style.outline="1px dotted gray";
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
  const CBASE=157;
  const CT=255-CBASE;
  this.RK1=30+30*Math.random();
  this.GK1=30+30*Math.random();
  this.BK1=30+30*Math.random();
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.set=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1));
    this.v="rgb("+red+","+grn+","+blu+")";
  }
  this.set();
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

var t=0;
var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  c++;
  color.set();
  color2.set();
  draw();
if (EM && t%300==0) stopped=true;
  requestAnimationFrame(animate);
}

var color=new Color();
var color2=new Color();

onresize();

ctx.lineWidth=3;

var MAXR=90;
var MINR=10;

var CirclePath=function(cp) {
  this.r=MINR+Math.random()*(MAXR-MINR);
  this.dir=cp?cp.dir*-1:1;
  this.a1=cp?(cp.a2+TP/2)%TP:TP*Math.random();
  this.a2=cp?(cp.a2+0.2+0.7*Math.random())%TP:(TP/2+1-2*Math.random()+this.a1)%TP;
  let pnx=cp?cp.x+(cp.r+2*this.r)*Math.cos(cp.a2):0;
  let pny=cp?cp.y+(cp.r+2*this.r)*Math.sin(cp.a2):0;
  let d=Math.pow(pnx*pnx+pny*pny,0.5);
  if (d>CSIZE-20-2*MINR) this.r=MINR;
  this.x=cp?cp.x+(cp.r+this.r)*Math.cos(cp.a2):0;
  this.y=cp?cp.y+(cp.r+this.r)*Math.sin(cp.a2):0;
  let q=this.dir*(this.a2-this.a1);
  let tf=q>0?(this.dir*TP+this.a1-this.a2)/(this.a2-this.a1):1;
  this.tdur=4*this.r*tf;
/*
  this.path=new Path2D();
  this.path.arc(this.x,this.y,this.r,this.a1,this.a2,this.dir==1);
  ctx.strokeStyle="red";
  ctx.stroke(this.path);
*/
}

var cpa=[new CirclePath()];
for (let i=1; i<3; i++) cpa.push(new CirclePath(cpa[i-1]));

const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);
const dm3=new DOMMatrix([0,1,-1,0,0,0]);

var draw=()=>{
//if (c%10==0) { ctx.fillStyle="#00000006"; ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE); }
  //a=cpa[1].a1+t/(10*cpa[1].r)*cpa[1].dir*(cpa[1].a2-cpa[1].a1);
  let a=0;
  if (cpa[1].a1>cpa[1].a2) {
    a=cpa[1].a1+t/(4*cpa[1].r)*cpa[1].dir*(cpa[1].a2-cpa[1].a1);
  } else {
    a=cpa[1].a1+t/(4*cpa[1].r)*cpa[1].dir*(cpa[1].a1-cpa[1].a2);
  }
  let rs=0;//0.2*cpa[1].r;
  if (t<=cpa[1].tdur/2) {
//    rs=cpa[1].r-Math.min(cpa[1].r,cpa[0].r);
    rs=((cpa[1].tdur/2-t)/(cpa[1].tdur/2))*(cpa[1].r-Math.min(cpa[1].r,cpa[0].r));
    //rs=(1-(cpa[1].tdur/2-t)/cpa[1].tdur/2)*cpa[1].r+(cpa[1].tdur/2-t)/cpa[1].tdur/2*Math.min(cpa[1].r,cpa[0].r);
  } else {
    //rs=cpa[1].r-Math.min(cpa[1].r,cpa[2].r);
    rs=((t-cpa[1].tdur/2)/(cpa[1].tdur/2))*(cpa[1].r-Math.min(cpa[1].r,cpa[2].r));
  }
  rs+=5;
  let p=new Path2D();
  //ctx.beginPath();
if (cpa[1].dir==1) {
  p.moveTo(cpa[1].x+rs*Math.cos(a),cpa[1].y+rs*Math.sin(a));
  p.lineTo(cpa[1].x+(2*cpa[1].r-rs)*Math.cos(a),cpa[1].y+(2*cpa[1].r-rs)*Math.sin(a));
} else {
  p.moveTo(cpa[1].x+(2*cpa[1].r-rs)*Math.cos(a),cpa[1].y+(2*cpa[1].r-rs)*Math.sin(a));
  p.lineTo(cpa[1].x+rs*Math.cos(a),cpa[1].y+rs*Math.sin(a));
}
  //p.moveTo(cpa[1].x,cpa[1].y);
  //p.lineTo(cpa[1].x+(2*cpa[1].r)*Math.cos(a),cpa[1].y+(2*cpa[1].r)*Math.sin(a));
//  if (t>=cpa[1].tdur/2) ctx.strokeStyle="blue";
//  else ctx.strokeStyle="red";
  p.addPath(p,dm1);
  p.addPath(p,dm2);
  p.addPath(p,dm3);

  let d=2*cpa[1].r-2*rs;
    //let d1=d*Math.pow(Math.cos(c/200),2);
    //let d2=d-d1;
  ctx.setLineDash([d/18,2*d/18,d/18,5*d/18,d/18,2*d/18,d/18,2*d/18]);
  ctx.lineDashOffset=0;
  ctx.strokeStyle=color.v;
  ctx.lineCap="butt";
  ctx.stroke(p);

  ctx.setLineDash([0,6*d/18,d/18,2*d/18,d/18,8*d/18]);
  //ctx.setLineDash([0,6*d/18,4*d/18,8*d/18]);
  ctx.strokeStyle=color2.v;
  ctx.stroke(p);

  //ctx.setLineDash([rs,2*cpa[1].r-rs,rs,1000]);
  ctx.lineDashOffset=2*d/18;
  //ctx.setLineDash([2*d/18,d/18]);
  ctx.setLineDash([2*d/18,d/18]);
  ctx.strokeStyle="#00000080";//"black";color2.v;//"red";//"#00000040";
  ctx.lineCap="round";
  ctx.stroke(p);

  if (t>cpa[1].tdur) {
    cpa.push(new CirclePath(cpa[cpa.length-1]));
    cpa.shift();
    t=0;
  }
}

start();
