"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/rNRRwPO
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
  this.getRGB=(ct)=>{
   let red=Math.round(CBASE+CT*(Math.cos(this.RK2+ct/this.RK1)));
   let grn=Math.round(CBASE+CT*(Math.cos(this.GK2+ct/this.GK1)));
   let blu=Math.round(CBASE+CT*(Math.cos(this.BK2+ct/this.BK1)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=100+100*Math.random();
    this.GK1=100+100*Math.random();
    this.BK1=100+100*Math.random();
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
var tt=0;
var trans=false;
var animate=(ts)=>{
  if (stopped) return;
  tt++;
  draw();
  if (EM && tt%300==0) stopped=true;
  requestAnimationFrame(animate);
}

var Circle=function() { 
  this.dir=false;
  this.randomize=()=>{ 
    this.kr=TP*Math.random();
    this.kr2=120+240*Math.random();
    this.ka=TP*Math.random();
    this.ka2=120+240*Math.random();
  }
  this.randomize();
  this.r=8+100*Math.random();
  this.a2=TP/24+5*TP/12*Math.random(); 
  this.setRA=()=>{
    //this.r=40+40*(1+Math.sin(this.kr+tt/this.kr2));
this.r=2+100*(1+Math.sin(this.kr+tt/this.kr2));
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
this.a2=TP/4+3*TP/16*(1+Math.sin(this.ka+tt/this.ka2))/2-0.001;
//this.a2=TP/6+TP/3*(1+Math.sin(this.ka+tt/this.ka2))/2-0.001;
//this.a2=TP/3+TP/6*(1+Math.sin(this.ka+tt/this.ka2))/2-0.001;
    if (this.dir) this.a2=-this.a2;
  }
//  this.getRandomA=()=>{ return TP/24+5*TP/12*Math.random(); }
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
//  c2.y=c.y+(c.r+c2.r)*Math.sin(c.a-c.a2);
    } else {
      this.x=this.r*Math.cos(this.a);
      this.y=this.r*Math.sin(this.a);
    }
    this.path=new Path2D();
    this.path.arc(this.x,this.y,this.r,TP/2+this.a,this.a-this.a2,this.dir);
  }
  this.setPath=()=>{
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
  ca[0].setRA();
  ca[0].x=ca[0].r*Math.cos(ca[0].a);
  ca[0].y=ca[0].r*Math.sin(ca[0].a);
//  ca[0].setPath();
}
reset();

var addCircle=(c)=>{
  let c2=new Circle();
  c2.a=c.a-c.a2;
  c2.dir=!c.dir;
  c2.setRA();
  c2.p=c;
  c2.cont=false;
  ca.push(c2);
  let c3=new Circle();
  c3.a=TP/2+c.a-c.a2;
  c3.dir=c.dir;
  c3.setRA();
  c3.p=c;
  c3.cont=true;
  ca.push(c3);
}

for (let i=0; i<7; i++) addCircle(ca[i]);

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dmxy=new DOMMatrix([-1,0,0,-1,0,0]);
const dmq=new DOMMatrix([0,1,-1,0,0,0]);

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

const getTriPath=(spath)=>{
  const dm1=new DOMMatrix([-0.5,0.866,-0.866,-0.50,0,0]);
  const dm2=new DOMMatrix([-0.5,-0.866,0.866,-0.50,0,0]);
  let p=new Path2D(spath);
  p.addPath(p,dmx);
  let p2=new Path2D(p);
  p2.addPath(p,dm1);
  p2.addPath(p,dm2);
  return p2;
}

/*
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
*/

var sym=[getDualPath,getXYPath,getQuadPath,getTriPath][getRandomInt(0,4,true)];
ctx.lineWidth=2;

var draw=()=>{
//ca[0].a=tt/1000;
  for (let i=0; i<ca.length; i++) ca[i].setRA();
/*
  //ca[0].a=TP*Math.sin(tt/6000);
//ca[0].a=TP*Math.sin(tt/4000);
  ca[0].x=ca[0].r*Math.cos(ca[0].a);
  ca[0].y=ca[0].r*Math.sin(ca[0].a);
  ca[0].setPath();
*/
  //for (let i=0; i<ca.length-1; i++) setPath(ca[i],ca[i+1]);
  for (let i=0; i<ca.length; i++) ca[i].setPath2();
  let p=new Path2D();
  let p2=new Path2D();
  let p3=new Path2D();
  let p4=new Path2D();
  for (let i=1; i<ca.length; i++) {
    let px=sym(ca[i].path);
    p.addPath(px);
    if (i<3) p3.addPath(px);
    else if (i<7) p4.addPath(px);
    else p2.addPath(px);
  }
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//if (tt%10==0) { ctx.fillStyle="#00000002"; ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE); }

  ctx.strokeStyle=color.getRGB(tt+160);
  ctx.lineWidth=3;
  ctx.stroke(p4);

  ctx.strokeStyle=color.getRGB(tt);
  ctx.lineWidth=3;
  ctx.stroke(p3);

  ctx.strokeStyle=color.getRGB(tt+320);
  ctx.lineWidth=3;
  ctx.stroke(p2);

ctx.setLineDash([1,2000]);
  ctx.strokeStyle="#00000040";
  ctx.lineWidth=4;
  ctx.stroke(p2);
  ctx.stroke(p4);
ctx.setLineDash([]);

  ctx.strokeStyle="#00000010";
  ctx.lineWidth=9;
  ctx.stroke(p);

}

start();

