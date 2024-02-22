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

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=144;
  const CT=255-CBASE;
  this.getRGB=(ct)=>{
   let red=Math.round(CBASE+CT*(Math.cos(this.RK2+ct/this.RK1)));
   let grn=Math.round(CBASE+CT*(Math.cos(this.GK2+ct/this.GK1)));
   let blu=Math.round(CBASE+CT*(Math.cos(this.BK2+ct/this.BK1)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=360+360*Math.random();
    this.GK1=360+360*Math.random();
    this.BK1=360+360*Math.random();
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

var dur=2000;
var tt=getRandomInt(0,1000);
var pause=0;
var trans=false;
var animate=(ts)=>{
  if (stopped) return;
  tt++;
  draw();
if (EM && tt%200==0) stopped=true;
  requestAnimationFrame(animate);
}

var KF=Math.random();

var Circle=function() { 
  this.dir=false;
  this.r=80;
  this.randomize=()=>{ 
    //this.kr=0; //TP*Math.random();
    //this.kr2=120+240*Math.random();
    this.ka=0; //TP*Math.random();
    //this.ka2=120+240*Math.random();
this.ka2=200;
//this.ka2=[150,300,450][getRandomInt(0,3)];
//this.ka2=[200,400][getRandomInt(0,2)];
//this.ka2=200+40*Math.random();
  }
  this.randomize();
  //this.a2=TP/24+5*TP/12*Math.random(); 
  this.setRA=()=>{
    //this.r=40+40*(1+Math.sin(this.kr+tt/this.kr2));
//this.r=2+100*(1+Math.sin(this.kr+tt/this.kr2));
//this.r=40;
//this.r=60*(1+Math.sin(this.kr+tt/this.kr2));
//this.r=50*(1-Math.cos(TP*tt/dur));
//this.r=50*(1+Math.sin(this.kr+tt/this.kr2))*(1-Math.cos(TP*tt/dur));
//this.r=30*(1+Math.sin(this.kr+tt/this.kr2))*(1-Math.cos(TP*tt/dur));
//this.r=30*(1+Math.sin(this.kr+tt/this.kr2));
    //this.a2=TP/24+5*TP/12*(1+Math.sin(this.ka+tt/410))/2;
//this.a2=TP/24+5*TP/12*(1+Math.sin(this.ka+tt/this.ka2))/2;
//this.a2=TP/24+5*TP/12*(1+Math.sin(this.ka+tt/this.ka2))/2+TP/96*Math.sin(tt/40);
//this.a2=TP/48+11*TP/24*(1+Math.sin(this.ka+tt/this.ka2))/2;
//this.a2=TP/3+TP/7*(1+Math.sin(this.ka+tt/this.ka2))/2;
//this.a2=TP/24+5*TP/12*(1+Math.sin(this.ka+tt/this.ka2))/2;
//this.a2=11*TP/24; //TP/4+3*TP/16*(1+Math.sin(this.ka+tt/this.ka2))/2-0.001;
//this.a2=TP/6+TP/3*(1+Math.sin(this.ka+tt/this.ka2))/2-0.001;
//this.a2=TP/3+TP/6*(1+Math.sin(this.ka+tt/this.ka2))/2-0.001;
this.a2=TP/4+1.57*(1+Math.sin(tt/this.ka2))/2;
//this.a2=TP/3+1.04*(1+Math.sin(this.ka+tt/this.ka2))/2;
//if (this.cont) this.a2=TP/5+1.57*(1+Math.sin(tt/KA1))/2;
//else this.a2=TP/5+1.57*(1+Math.sin(tt/KA2))/2;
    if (this.dir) this.a2=-this.a2;
  }
  this.setPath2=()=>{
    if (this.p) {
      if (this.cont) {
	this.a=TP/2+this.p.a-this.p.a2;
	this.x=this.p.x+(this.p.r-this.r)*Math.cos(this.p.a-this.p.a2);
	this.y=this.p.y+(this.p.r-this.r)*Math.sin(this.p.a-this.p.a2);
      } else {
	this.a=this.p.a-this.p.a2;
	this.x=this.p.x+(this.p.r+this.r)*Math.cos(this.p.a-this.p.a2);
	this.y=this.p.y+(this.p.r+this.r)*Math.sin(this.p.a-this.p.a2);
      }
    } else {
      this.x=this.r*Math.cos(this.a);
      this.y=this.r*Math.sin(this.a);
    }
    this.path=new Path2D();
    this.path.arc(this.x,this.y,this.r,TP/2+this.a,this.a-this.a2,this.dir);
  }
}

onresize();

var ca=[];
var reset=()=>{
  ca=[new Circle()];
  ca[0].p=false;
  ca[0].a=0; //TP*Math.random();
}
reset();

var addCircle=(c)=>{
  let c2=new Circle();
  c2.a=c.a-c.a2;
  c2.dir=!c.dir;
  c2.p=c;
  c2.cont=false;
  c2.r=c.r*0.8;
if (Math.random()<KF)
c2.ka2=c.ka2*0.8;
//c2.ka2=c.ka2*(0.8+Math.random()/8);
//c2.ka2=c.ka2*KF1;
//c2.ka2=c.ka2-32;
  ca.push(c2);
  let c3=new Circle();
  c3.a=TP/2+c.a-c.a2;
  c3.dir=c.dir;
  c3.p=c;
  c3.cont=true;
  c3.r=c.r*0.8;
//c3.ka2=c.ka2*0.8;
//c3.ka2=c.ka2*KF2;
//c3.ka2=c.ka2-30;
//c3.ka2=200;
//c3.ka2=c.ka2*(0.8+Math.random()/8);
if (Math.random()<1-KF)
c3.ka2=c.ka2*0.8;
  ca.push(c3);
}

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dmxy=new DOMMatrix([-1,0,0,-1,0,0]);
//const dmq=new DOMMatrix([0,1,-1,0,0,0]);
const getXYPath=(spath)=>{
  this.level=1;
  let p=new Path2D(spath);
  p.addPath(p,dmxy);
  return p;
}

var draw=()=>{
  ca[0].a=tt/1000;
  for (let i=0; i<ca.length; i++) ca[i].setRA();
  for (let i=0; i<ca.length; i++) ca[i].setPath2();
  let pa=new Array(8);
  for (let i=0; i<pa.length; i++) pa[i]=new Path2D();
  for (let i=0; i<ca.length; i++) {
    if (i==0) pa[0].addPath(ca[i].path);
    else if (i<3) pa[1].addPath(ca[i].path);
    else if (i<7) pa[2].addPath(ca[i].path);
    else if (i<15) pa[3].addPath(ca[i].path);
    else if (i<31) pa[4].addPath(ca[i].path);
    else if (i<63) pa[5].addPath(ca[i].path);
    else if (i<127) pa[6].addPath(ca[i].path);
    else pa[7].addPath(ca[i].path);
  }
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);

  for (let i=0; i<pa.length; i++) {
    let pth=getXYPath(pa[i]);
/*
    ctx.strokeStyle="#00000060";
    ctx.lineWidth=3+Math.max(3, 16-2*i);
    ctx.stroke(pth);
*/
    ctx.strokeStyle=color.getRGB(tt-180*i);
    //ctx.lineWidth=Math.max(3, 16-2*i);
    ctx.lineWidth=Math.max(3, 24-3*i);
    ctx.stroke(pth);
  }
}

for (let i=0; i<127; i++) addCircle(ca[i]);

start();

