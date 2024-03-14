"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/MWxLXWr
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
  this.getRGB=()=>{
   let red=Math.round(CBASE+CT*(this.fr*Math.cos(this.RK2+tt/this.RK1)+(1-this.fr)*Math.cos(tt/this.RK3)));
   let grn=Math.round(CBASE+CT*(this.fg*Math.cos(this.GK2+tt/this.GK1)+(1-this.fg)*Math.cos(tt/this.GK3)));
   let blu=Math.round(CBASE+CT*(this.fb*Math.cos(this.BK2+tt/this.BK1)+(1-this.fb)*Math.cos(tt/this.BK3)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomizeF=()=>{
    this.RK3=1+5*Math.random();
    this.GK3=1+5*Math.random();
    this.BK3=1+5*Math.random();
    this.fr=1-Math.pow(0.9*Math.random(),3);
    this.fg=1-Math.pow(0.9*Math.random(),3);
    this.fb=1-Math.pow(0.9*Math.random(),3);
  }
  this.randomize=()=>{
    this.RK1=40+40*Math.random();
    this.GK1=40+40*Math.random();
    this.BK1=40+40*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.randomizeF();
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

var dur=2000;
var tt=getRandomInt(0,2000);
var pause=0;
var trans=false;
var animate=(ts)=>{
  if (stopped) return;
  tt++;
  draw();
  if (tt%dur==0) {
    //tt=0;
    //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    if (EM) stopped=true;
    color.randomize();
    for (let i=0; i<ca.length; i++) ca[i].randomize();
/*
      ca[i].kr=TP*Math.random();
      ca[i].kr2=300+600*Math.random();
      ca[i].ka=TP*Math.random();
      ca[i].ka2=300+600*Math.random();
    }
*/
  }
  requestAnimationFrame(animate);
}

var Circle=function() { 
  this.dir=false;
  //this.t=//getRandomInt(-200,0);
  this.randomize=()=>{ 
    this.kr=TP*Math.random();
    this.kr2=300+600*Math.random();
    this.ka=TP*Math.random();
    this.ka2=300+600*Math.random();
    this.kf=Math.pow(0.9*Math.random(),4);
    this.k3=6+100*Math.random();
  }
  this.randomize();
  this.r=8+100*Math.random();
  this.a2=TP/24+5*TP/12*Math.random(); 
  this.setRA=()=>{
    //this.r=8+60*(1+Math.sin(this.kr+tt/400));
//this.r=50*(1-Math.cos(TP*tt/dur));
//this.r=50*(1+Math.sin(this.kr+tt/this.kr2))*(1-Math.cos(TP*tt/dur));
    this.r=32*(1+Math.sin(this.kr+tt/this.kr2))*(1-Math.cos(TP*tt/dur));
    //this.a2=TP/24+5*TP/12*(1+Math.sin(this.ka+tt/410))/2;
//this.a2=TP/24+5*TP/12*(1+Math.sin(this.ka+tt/this.ka2))/2;
//this.a2=TP/24+5*TP/12*(1+Math.sin(this.ka+tt/this.ka2))/2+TP/96*Math.sin(tt/40);
this.a2=TP/48+11*TP/24*(1+Math.sin(this.ka+tt/this.ka2))/2+TP/96*this.kf*Math.sin(tt/this.k3);
    if (this.dir) this.a2=-this.a2;
  }
  this.getRandomA=()=>{ 
return TP/24+5*TP/12*Math.random(); 
//return 11*TP/24-ca.length/10;
//return 11*TP/24-10*TP/24*tt/dur;
//return 11*TP/24-(10*TP/24*tt/dur)*(1+Math.random())/2;
//return 11*TP/24-(10*TP/24*tt/dur)*(1+Math.pow(Math.random(),4))/2;
  }
  //this.a2=this.getRandomA();
/*
  this.split=()=>{
//if (Math.random()<0.7) { // non-random a,r
//if (Math.random()<0.58) {
if (false) {
let r3=this.getRandomR();
let x3=this.x+(this.r-r3)*Math.cos(this.a-this.a2);
let y3=this.y+(this.r-r3)*Math.sin(this.a-this.a2);
let c=new Circle();
c.r=r3;
//c.a=c.a+c.a2;
c.x=x3,c.y=y3;
//c.a=this.a-this.a2; //TP*Math.random();
c.a=TP/2+this.a-this.a2; //TP*Math.random();
c.dir=this.dir;
//if (c.dir) c.a2=-TP/6;
if (c.dir) c.a2=-this.getRandomA();
else c.a2=this.getRandomA();
if (c.dir) c.kt=Math.round(c.r*(TP/2+c.a2));
else {
  let an=TP/2-c.a2;
  if (an<0) an+=TP;
  c.kt=Math.round(c.r*an);
}
c.setPath();
ca.push(c);
if (c.kt<=0) debugger;
}
    let c2=new Circle();
    let r2=this.getRandomR();
    let x2=this.x+(this.r+r2)*Math.cos(this.a-this.a2);
    let y2=this.y+(this.r+r2)*Math.sin(this.a-this.a2);
    c2.r=r2;
    c2.a=this.a-this.a2;
    c2.x=x2,c2.y=y2;
    c2.dir=!this.dir;
    if (c2.dir) c2.a2=-this.getRandomA();
    else c2.a2=this.getRandomA();
    if (c2.dir) {
      //this.kt=Math.round(this.r/2*(TP/2-this.a2));
//let an=TP/4-this.a2/2;
//let an=TP/2+this.a2;
      c2.kt=Math.round(c2.r*(TP/2+c2.a2));
    } else {
      let an=TP/2-c2.a2;
      if (an<0) an+=TP;
      c2.kt=Math.round(c2.r*an);
    }
    c2.setPath();
    ca.push(c2);
  }
*/
  this.setPath=()=>{
    this.path=new Path2D();
    this.path.arc(this.x,this.y,this.r,TP/2+this.a,this.a-this.a2,this.dir);
  }
}

onresize();

var ca=[];
var reset=()=>{
  ca=[new Circle()];
  ca[0].a=0;//TP*Math.random();
  ca[0].x=0;//ca[0].r*Math.cos(ca[0].a);
  ca[0].y=0;//ca[0].r*Math.sin(ca[0].a);
  ca[0].setPath();
}
reset();

var addPath=(c)=>{
  let c2=new Circle();
  c2.a=c.a-c.a2;
  c2.x=c.x+(c.r+c2.r)*Math.cos(c.a-c.a2);
  c2.y=c.y+(c.r+c2.r)*Math.sin(c.a-c.a2);
  c2.dir=!c.dir;
  if (c2.dir) c2.a2=-c2.getRandomA();
  else c2.a2=c2.getRandomA();
  c2.setPath();
  ca.push(c2);
}

var setPath=(c,c2)=>{
  c2.a=c.a-c.a2;
  c2.x=c.x+(c.r+c2.r)*Math.cos(c.a-c.a2);
  c2.y=c.y+(c.r+c2.r)*Math.sin(c.a-c.a2);
  c2.setPath();
}

//ca=[ca[0]];

//for (let i=0; i<5; i++) {
for (let i=0; i<8; i++) addPath(ca[i]);

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dmxy=new DOMMatrix([-1,0,0,-1,0,0]);
const dmq=new DOMMatrix([0,1,-1,0,0,0]);
const p8=Math.sin(TP/8);
const dmo=new DOMMatrix([p8,p8,-p8,p8,0,0]);

const getXYPath=(spath)=>{
  this.level=1;
  let p=new Path2D(spath);
  p.addPath(p,dmxy);
  return p;
}

const getDualPath=(spath)=>{
  let p=new Path2D(spath);
  p.addPath(p,dmy);
  p.addPath(p,dmx);
  return p;
}

const getQuadPath=(spath)=>{
  let p=getDualPath(spath);
  p.addPath(p,dmq);
  return p;
}

const getHexPath=(spath)=>{
//let dmr=new DOMMatrix([Math.cos(tt/100),Math.sin(tt/100),-Math.sin(tt/100),Math.cos(tt/100),0,0]);
  const dm1=new DOMMatrix([0.5,0.866,-0.866,0.50,0,0]);
  const dm2=new DOMMatrix([-0.5,0.866,-0.866,-0.50,0,0]);
  let p=getDualPath(spath);
  let hpath=new Path2D(p);
  hpath.addPath(p,dm1);
  hpath.addPath(p,dm2);
  return hpath;
}

const getRPath=(spath)=>{
  this.level=4;
  let p=getXYPath(spath);
  p.addPath(p,dmq);
  p.addPath(p,dmo);
  return p;
}

var draw=()=>{

/*
let D=40+80*(1+Math.sin(tt/20));
let D2=40+80*(1+Math.sin(tt/21));
ctx.setLineDash([D,D2]);
*/

  //ctx.lineDashOffset=-tt;
  for (let i=0; i<ca.length; i++) ca[i].setRA();
/*
  //ca[0].a=TP*Math.sin(tt/6000);
//ca[0].a=TP*Math.sin(tt/4000);
  ca[0].x=ca[0].r*Math.cos(ca[0].a);
  ca[0].y=ca[0].r*Math.sin(ca[0].a);
  ca[0].setPath();
*/
  for (let i=0; i<ca.length-1; i++) setPath(ca[i],ca[i+1]);
  let p=new Path2D();
  for (let i=4; i<ca.length; i++) p.addPath(getHexPath(ca[i].path));
  ctx.setTransform(1,0,0,1,CSIZE-2,CSIZE+2);
  ctx.strokeStyle=color.getRGB();
  ctx.lineWidth=3;
  ctx.strokeStyle=color.getRGB();
  ctx.stroke(p);

  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  ctx.strokeStyle="#0000000C";
  ctx.lineWidth=10;
  ctx.stroke(p);
}

//ctx.globalCompositeOperation="destination-over";
//ctx.setLineDash([80,80]);
start();
