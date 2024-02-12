"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
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
ctx.globalCompositeOperation="destination-over";
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

var tt=0;
var pause=0;
var trans=false;
var animate=(ts)=>{
  if (stopped) return;
  tt++;
  if (ca.length>limit) {
    if (!trans) {
      trans=true;
      pause=tt+100;
//stopped=true;
    } else {
      if (tt>pause) {
	color.randomize();
	ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
        ctx.canvas.style.opacity=1;
        ctx.canvas.style.transform="scale(1,1)";
	reset();
	tt=0;
	trans=false;
      } else {
        let f=(pause-tt)/100;
        ctx.canvas.style.opacity=f;
        ctx.canvas.style.transform="scale("+f+","+f+")";
      }
    }
  } else {
    for (let i=0; i<ca.length; i++) ca[i].t++;
  //if (EM && t%400==0) stopped=true;
    draw();
    for (let i=0; i<ca.length; i++) {
      if (ca[i].t==ca[i].kt) {
	ca[i].t=0;
	ca[i].split();
  //if (Math.abs(ca[i].x)>1.5*CSIZE || Math.abs(ca[i].y)>1.5*CSIZE) { stopped=true; }
      }
    }
  }
  requestAnimationFrame(animate);
}

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

const getQuadPath=(spath)=>{
  let p=getDualPath(spath);
  p.addPath(p,dmq);
  return p;
}

const getOctPath=(spath)=>{
  let p=getQuadPath(spath);
  p.addPath(p,dmo);
  return p;
}

const getRPath=(spath)=>{
  this.level=4;
  let p=getXYPath(spath);
  p.addPath(p,dmq);
  p.addPath(p,dmo);
  return p;
}

var Circle=function() { 
  this.dir=false;
  this.t=0;
  //this.wk=WK;//30+90*Math.pow(Math.random(),2);
  this.wk=20+90*Math.pow(Math.random(),2);
  this.wo=0;
  this.getRandomR=()=>{
    //return 8+CSIZE/4*Math.random();
    return 6+CSIZE/5*Math.random();
//return 80/Math.pow(ca.length,0.5);
    //return [25,50][getRandomInt(0,2)];
    //return 50;
  }
  this.getRandomA=()=>{ 
    //return TP/12+TP/3*Math.random(); 
return TP/24+5*TP/12*Math.random(); 
//return 26*TP/64;
  }
  this.randomize=()=>{
    this.r=this.getRandomR();
    this.a=TP*Math.random();
    this.x=this.r*Math.cos(this.a);
    this.y=this.r*Math.sin(this.a);
    //this.a2=TP/12+TP/3*Math.random();
    this.a2=this.getRandomA();
    this.kt=Math.round(this.r*(TP/2-this.a2));
if (this.kt<=0) debugger;
//    this.lw=20*Math.random();
  }
  this.split=()=>{

//if (Math.random()<0.5) {
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
c.wk=20+90*Math.pow(Math.random(),2);
c.wo=this.wo+tt/this.wk-tt/c.wk;
ca.push(c);
if (c.kt<=0) debugger;
//}

    let r2=this.getRandomR();
    let x2=this.x+(this.r+r2)*Math.cos(this.a-this.a2);
    let y2=this.y+(this.r+r2)*Math.sin(this.a-this.a2);
    this.r=r2;
    this.a=this.a-this.a2;
    this.x=x2,this.y=y2;
    this.dir=!this.dir;
    //if (this.dir) this.a2=-TP/6-TP/12*Math.random();
    if (this.dir) this.a2=-this.getRandomA();
    else this.a2=this.getRandomA();
    if (this.dir) {
      //this.kt=Math.round(this.r/2*(TP/2-this.a2));
//let an=TP/4-this.a2/2;
//let an=TP/2+this.a2;
      this.kt=Math.round(this.r*(TP/2+this.a2));
    } else {
      let an=TP/2-this.a2;
      if (an<0) an+=TP;
      this.kt=Math.round(this.r*an);
    }
    let wk2=20+90*Math.pow(Math.random(),2);
    this.wo=this.wo+tt/this.wk-tt/wk2;
    this.wk=wk2;
    this.setPath();
    if (this.kt<=0) debugger;
  }
  this.setPath=()=>{
    this.path=new Path2D();
    this.path.arc(this.x,this.y,this.r,TP/2+this.a,this.a-this.a2,this.dir);
  }
}

ctx.setLineDash([1,4000]);

onresize();

var ca=[];
var LW=20;
//var WK=60;
var symf=getHexPath;
var limit=160;
const sym=[
  {"func":getHexPath,"level":6,"limit":160},
  {"func":getOctPath,"level":8,"limit":150},
  {"func":getQuadPath,"level":4,"limit":180},
  {"func":getDualPath,"level":2,"limit":200},
  {"func":getXYPath,"level":1,"limit":240},
  {"func":getRPath,"level":4,"limit":180}
];

var reset=()=>{
  let s=sym[getRandomInt(0,6,true)];
  symf=s.func;
  limit=s.limit;
//  LW=36*Math.pow(Math.random(),2);
//LW=(24+24/s.level)*Math.random();
LW=(18+48/s.level)*Math.random();
  //WK=30+90*Math.pow(Math.random(),2);
  ca=[new Circle()];
  ca[0].randomize();
  ca[0].setPath();
//console.log("LW:",LW.toFixed(0),"WK:",WK.toFixed(0),symf.name);
console.log("LW:",LW.toFixed(0),symf.name);
}
reset();

var draw=()=>{
//if (lw<0) { stopped=true; return; }
  for (let i=0; i<ca.length; i++) {
    ctx.lineDashOffset=-ca[i].t;
    let lw=5+LW*(1-Math.cos(ca[i].wo+tt/ca[i].wk));
    let p=symf(ca[i].path);
    //let p=ca[i].getPath();

    ctx.setTransform(1,0,0,1,CSIZE-2,CSIZE+2);
    ctx.strokeStyle="#0000000A";
    ctx.lineWidth=lw+10;	// 10 as f(lw)?
    ctx.stroke(p);

    ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
    ctx.strokeStyle=color.getRGB();
    ctx.lineWidth=lw;
    ctx.stroke(p);
  }
}

start();

