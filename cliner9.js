"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;
const S6=Math.sin(TP/6);
const C6=0.5;
const S8=Math.sin(TP/8);

var DUR=800;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
c.style.outline="1px dotted gray";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
//ctx.globalCompositeOperation="destination-over";
//ctx.setLineDash([2,100]);
ctx.lineJoin="round";

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
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(o+this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(o+this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(o+this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=200+200*Math.random();
    this.GK1=200+200*Math.random();
    this.BK1=200+200*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();

function Point(xp,yp,xfi,yfi) {
  this.x=xp;
  this.y=yp;
  this.setLocation=()=>{
    this.x=fa[xfi]*EDGE;
    this.y=fb[yfi]*EDGE;
  }
  this.getX=()=>{
//    return fa[nx]*EDGE;
  }
}

function PointN(xfi,yfi) {
  this.setLocation=()=>{
    this.x=fa[xfi]*EDGE;
    this.y=fb[yfi]*EDGE;
  }
}

function PointO() {
  this.randomize=()=>{
    this.K2=(Math.random()<0.5?1:-1)*(40+40*Math.random());
    this.K4=(Math.random()<0.5?1:-1)*(40+40*Math.random());
  }
  this.randomize();
//  this.getFraction=()=>{ }
}

var KF=0.9; //0.008; //(1+Math.sin(TP*t/1000))/2; 

function Fraction(idx) {
  this.f=0;
  this.zero=false;
  this.randomize=()=>{
    this.K1=800+800*Math.random();
    this.K2=TP*Math.random();
    //this.K1=DUR; //600+600*Math.random();
    //this.K2=TP/8*idx; //getRandomInt(0,2)*TP/2;
    //this.K2=getRandomInt(0,4)*TP/4;
  }
  this.randomize();
  this.setFraction=()=>{ 
//if (this.zero && this.f>0) debugger;
    //let f=(1+KF*Math.sin(this.K2+TP*t/this.K1))/2; 
this.f=(1-KF)+KF*Math.pow(Math.sin(this.K2+TP*t/this.K1),2); 
/*
if (f<0.001) { 
if (this.zero && this.f>0) debugger;
  if (this.zero) { 
    if (Math.random()<0.4) {
      this.zero=false;
    }
  } else {
    if (Math.random()<0.1) {
      this.zero=true;
      this.f=0;
    }
  }
//  if (this.zero) { this.f=0; return; }
if (this.zero && this.f>0) debugger;
  return;
}
if (this.zero) return;
if (this.zero && this.f>0) debugger;
//   if (this.zero) return;
    this.f=f; //(1+KF*Math.sin(this.K2+TP*t/this.K1))/2; 
//if (this.f<0.001) { this.f=0; this.zero=true; }
if (this.zero && this.f>0) debugger;
*/
  }
  this.setFractionZ=()=>{ 
    let f=(1+KF*Math.sin(this.K2+TP*t/this.K1))/2; 
if (f<0.001) { 
  this.zero=false; 
} else return;
  }
}

var zc;

function FractionSet(n) {
  this.fa=(()=>{
    let a=[];
    for (let i=0; i<n; i++) a.push(new Fraction(i));
    return a;
  })();

  this.getArray=()=>{
    let fs=0;
//    zc=0;
    for (let i=0; i<n; i++) {
//if (this.fa[i].zero) { zc++; }
//else
      this.fa[i].setFraction();
//if (this.fa[i].zero && this.fa[i].f>0) debugger;
      fs+=this.fa[i].f;
    }
    let ffa=[];
    for (let i=0, acc=0; i<n; i++) {
      acc+=this.fa[i].f/fs;
      ffa.push(acc);
    }
    return ffa;
  }

  this.getArrayN=()=>{
    let fs=0;
    for (let i=0; i<n; i++) {
      this.fa[i].setFraction();
      fs+=this.fa[i].f;
    }
    let ffa=[0];
    for (let i=0, acc=0; i<n; i++) {
      acc+=this.fa[i].f/fs;
      ffa.push(acc);
    }
    ffa.push(EDGE);
    return ffa;
  }

}

var f1=new Fraction();
var f2=new Fraction();

function Triangle(ppc,pp2,pp3) {
  this.getPath=()=>{
    let p=new Path2D();
    p.moveTo(ppc.x,ppc.y);
    p.lineTo(pp2.x,pp2.y);
    p.lineTo(pp3.x,pp3.y);
    p.closePath();
    return p;
  }
  this.getCent=()=>{
    let xm=(ppc.x+pp2.x+pp3.x)/3;
    let ym=(ppc.y+pp2.y+pp3.y)/3;
    return Math.pow(xm*xm+ym*ym,0.5); 

  }
  this.getSizeProx=()=>{
    let xm=(ppc.x+pp2.x+pp3.x)/3;
    let ym=(ppc.y+pp2.y+pp3.y)/3;
    let prox=
      Math.abs(ppc.x-xm)+Math.abs(pp2.x-xm)+Math.abs(pp3.x-xm)+
      Math.abs(ppc.y-ym)+Math.abs(pp2.y-ym)+Math.abs(pp3.y-ym)
    ;
    return prox;
  }
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
var animate=(ts)=>{
  if (stopped) return;
  t++;
  c++;
//KF=(1+Math.sin(TP*t/100))/2; 
  draw();
//if (EM && t%200==0) stopped=true
//  container.firstChild.style.opacity=1-c/DUR;
/*
  if (t%200==0) {
    c=0;
//    cycle();
stopped=true
//ctx.globalCompositeOperation="source-over";
  }
*/
  requestAnimationFrame(animate);
}

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,4,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

const EDGE=CSIZE;//0.7*CSIZE;

var pt1=new Point(0,0,1,0);	// moveable tiling points, shared oct/quad vertices
var pt2=new Point(0,0,2,0);
var pt3=new Point(0,0,0,1);
var pt4=new Point(0,0,0,2);
var pt5=new Point(0,0,1,3);
var pt6=new Point(0,0,2,3);
var pt7=new Point(0,0);
var pt8=new Point(0,0);
var pt9=new Point(0,0);
var pt10=new Point(0,0);

var pt13=new Point(0,0);
var pt14=new Point(0,0);

var pt15=new Point(0,0);
var pt16=new Point(0,0);

var ptc1=new Point(0,0);
var ptc2=new Point(0,0);
var ptc3=new Point(0,0);
var ptc4=new Point(0,0);
var ptc5=new Point(EDGE,0);
var ptc6=new Point(0,EDGE);
var ptc7=new Point(EDGE,0);
var ptc8=new Point(0,0);
var ptc11=new Point(0,EDGE);
var ptc12=new Point(EDGE,0);
var ptc13=new Point(0,EDGE);
var ptc14=new Point(EDGE,0);

var pt17=new Point(0,EDGE);
var pt18=new Point(0,EDGE);

var pt11=new Point(0,0);
var pt12=new Point(0,0);

var pt19=new Point(EDGE,0);
var pt20=new Point(EDGE,0);

var pt21=new Point(0,EDGE);
var pt22=new Point(0,EDGE);

var pt23=new Point(EDGE,0);
var pt24=new Point(EDGE,0);

var pt25=new Point(0,0);
var pt26=new Point(0,EDGE);

var pt27=new Point(EDGE,0);
var pt28=new Point(EDGE,0);

var pt29=new Point(0,EDGE);
var pt30=new Point(0,EDGE);

var pt31=new Point(0,0);
var pt32=new Point(0,0);

var pt33=new Point(0,0);
var pt34=new Point(0,0);

var pt35=new Point(EDGE,0);
var pt36=new Point(EDGE,0);

var pt37=new Point(0,EDGE);
var pt38=new Point(0,EDGE);

var pt39=new Point(0,EDGE);

var pt40=new Point(0,0);

var pt41=new Point(EDGE,0);
var pt42=new Point(EDGE,0);

var pt43=new Point(0,0);
var pt44=new Point(0,0);

var pt45=new Point(0,EDGE);
var pt46=new Point(0,EDGE);

var pt47=new Point(EDGE,0);
var pt48=new Point(EDGE,0);

var pto=new PointO();
var pto2=new PointO();
var pto3=new PointO();
var pto4=new PointO();
var pto5=new PointO();
var pto6=new PointO();
var pto7=new PointO();
var pto8=new PointO();
const pto9=new PointO();

const fs1=new FractionSet(9);
const fs2=new FractionSet(9);

var fa,fb;

var locate=()=>{
  fa=fs1.getArrayN();
  fb=fs2.getArrayN();

/*
  pt1.x=fa[1]*EDGE;
  pt1.y=fa[0]*EDGE;
  pt2.x=fa[2]*EDGE;
  pt3.y=fb[1]*EDGE;
  pt4.y=fb[2]*EDGE;
*/
  pt1.setLocation();
  pt2.setLocation();
  pt3.setLocation();
  pt4.setLocation();

  pt5.x=fa[1]*EDGE;
  pt5.y=fb[3]*EDGE;
  pt6.x=fa[2]*EDGE;
  pt6.y=fb[3]*EDGE;

  pt7.x=fa[3]*EDGE;
  pt7.y=fb[1]*EDGE;
  pt8.x=fa[3]*EDGE;
  pt8.y=fb[2]*EDGE;

  pt9.x=fa[4]*EDGE;
  pt10.x=fa[5]*EDGE;

  pt11.y=fb[4]*EDGE;
  pt12.y=fb[5]*EDGE;

  pt13.x=fa[4]*EDGE;
  pt13.y=fb[3]*EDGE;
  pt14.x=fa[5]*EDGE;
  pt14.y=fb[3]*EDGE;

  pt15.x=fa[3]*EDGE;
  pt15.y=fb[4]*EDGE;
  pt16.x=fa[3]*EDGE;
  pt16.y=fb[5]*EDGE;

  pt17.x=fa[1]*EDGE;
  pt17.y=fb[6]*EDGE;
  pt18.x=fa[2]*EDGE;
  pt18.y=fb[6]*EDGE;

  pt19.x=fa[6]*EDGE;
  pt19.y=fb[1]*EDGE;
  pt20.x=fa[6]*EDGE;
  pt20.y=fb[2]*EDGE;

  pt21.x=fa[4]*EDGE;
  pt21.y=fb[6]*EDGE;
  pt22.x=fa[5]*EDGE;
  pt22.y=fb[6]*EDGE;

  pt23.x=fa[6]*EDGE;
  pt23.y=fb[4]*EDGE;
  pt24.x=fa[6]*EDGE;
  pt24.y=fb[5]*EDGE;

  pt25.y=fb[7]*EDGE;
  pt26.y=fb[8]*EDGE;

  pt27.x=fa[7]*EDGE;
  pt28.x=fa[8]*EDGE;

  pt29.x=fa[1]*EDGE;
  pt30.x=fa[2]*EDGE;

  pt31.x=fa[3]*EDGE;
  pt31.y=fb[7]*EDGE;
  pt32.x=fa[3]*EDGE;
  pt32.y=fb[8]*EDGE;

  pt33.x=fa[7]*EDGE;
  pt33.y=fb[3]*EDGE;
  pt34.x=fa[8]*EDGE;
  pt34.y=fb[3]*EDGE;

  pt35.y=fb[1]*EDGE;
  pt36.y=fb[2]*EDGE;

  pt37.x=fa[4]*EDGE;
  pt38.x=fa[5]*EDGE;

  pt39.x=fa[6]*EDGE;
  pt39.y=fb[7]*EDGE;
  pt40.x=fa[6]*EDGE;
  pt40.y=fb[8]*EDGE;

  pt41.y=fb[4]*EDGE;
  pt42.y=fb[5]*EDGE;

  pt43.x=fa[7]*EDGE;
  pt43.y=fb[6]*EDGE;
  pt44.x=fa[8]*EDGE;
  pt44.y=fb[6]*EDGE;

  pt45.x=fa[7]*EDGE;
  pt46.x=fa[8]*EDGE;

  ptc1.x=fa[3]*EDGE;
  ptc2.y=fb[3]*EDGE;
  ptc3.x=fa[3]*EDGE;
  ptc3.y=fb[3]*EDGE;
  ptc4.y=fb[6]*EDGE;
  ptc5.x=fa[6]*EDGE;
  ptc6.x=fa[3]*EDGE;
  ptc6.y=fb[6]*EDGE;
  ptc7.x=fa[6]*EDGE;
  ptc7.y=fb[3]*EDGE;
  ptc8.x=fa[6]*EDGE;
  ptc8.y=fb[6]*EDGE;
  ptc11.x=fa[3]*EDGE;
  ptc12.y=fb[3]*EDGE;
  ptc13.x=fa[6]*EDGE;
  ptc14.y=fb[6]*EDGE;

////

  pt47.y=fb[6]*EDGE;
  pt48.y=fb[7]*EDGE;

  pto.x=pt1.x+(pt2.x-pt1.x)*(1+Math.sin(t/pto.K2))/2;
  pto.y=pt3.y+(pt4.y-pt3.y)*(1+Math.sin(t/pto.K4))/2;

  pto2.x=pt9.x+(pt10.x-pt9.x)*(1+Math.sin(t/pto2.K2))/2;
  pto2.y=pt3.y+(pt4.y-pt3.y)*(1+Math.sin(t/pto2.K4))/2;

  pto3.x=pt1.x+(pt2.x-pt1.x)*(1+Math.sin(t/pto3.K2))/2;
  pto3.y=pt11.y+(pt12.y-pt11.y)*(1+Math.sin(t/pto3.K4))/2;

  pto4.x=pt9.x+(pt10.x-pt9.x)*(1+Math.sin(t/pto4.K2))/2;
  pto4.y=pt11.y+(pt12.y-pt11.y)*(1+Math.sin(t/pto4.K4))/2;

  pto5.x=pt1.x+(pt2.x-pt1.x)*(1+Math.sin(t/pto5.K2))/2;
  pto5.y=pt25.y+(pt26.y-pt25.y)*(1+Math.sin(t/pto5.K4))/2;

  pto6.x=pt27.x+(pt28.x-pt27.x)*(1+Math.sin(t/pto6.K2))/2;
  pto6.y=pt3.y+(pt4.y-pt3.y)*(1+Math.sin(t/pto6.K4))/2;

  pto7.x=pt9.x+(pt10.x-pt9.x)*(1+Math.sin(t/pto7.K2))/2;
  pto7.y=pt25.y+(pt26.y-pt25.y)*(1+Math.sin(t/pto7.K4))/2;

  pto8.x=pt27.x+(pt28.x-pt27.x)*(1+Math.sin(t/pto8.K2))/2;
  pto8.y=pt11.y+(pt12.y-pt11.y)*(1+Math.sin(t/pto8.K4))/2;

  pto9.x=pt27.x+(pt28.x-pt27.x)*(1+Math.sin(t/pto9.K2))/2;
  pto9.y=pt25.y+(pt26.y-pt25.y)*(1+Math.sin(t/pto9.K4))/2;
}

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
/*
const dmr=(()=>{
  let da=[];
  for (let i=0; i<6; i++) {
    da.push(new DOMMatrix([Math.cos(i*TP/6),Math.sin(i*TP/6),-Math.sin(i*TP/6),Math.cos(i*TP/6),0,0]));
  }
  return da;
})();
*/

const ta=[
  new Triangle(pto,pt1,pt3),
  new Triangle(pto,pt1,pt2),
  new Triangle(pto,pt2,pt7),
  new Triangle(pto,pt7,pt8),
  new Triangle(pto,pt8,pt6),
  new Triangle(pto,pt5,pt6),
  new Triangle(pto,pt4,pt5),
  new Triangle(pto,pt3,pt4),

  new Triangle({"x":0,"y":0},pt1,pt3),	// center quad
  new Triangle(ptc1,pt2,pt7),
  new Triangle(ptc2,pt4,pt5),
  new Triangle(ptc3,pt6,pt8),

  new Triangle(ptc1,pt7,pt9),	
  new Triangle(pt11,ptc2,pt5),


  new Triangle(pto3,pt11,pt5),			// first outside oct, bottom
  new Triangle(pto3,pt5,pt6),			// pto3 oct
  new Triangle(pto3,pt6,pt15),			// pto3 oct
  new Triangle(pto3,pt16,pt15),			// pto3 oct	
  new Triangle(pto3,pt11,pt12),			// pto3 oct	
  new Triangle(pto3,pt12,pt17),			// pto3 oct	
  new Triangle(pto3,pt17,pt18),			// pto3 oct	
  new Triangle(pto3,pt16,pt18),			// pto3 oct	

  new Triangle(pto2,pt7,pt9),			// pto2 oct
  new Triangle(pto2,pt7,pt8),			// pto2 oct
  new Triangle(pto2,pt8,pt13),			// pto2 oct
  new Triangle(pto2,pt9,pt10),			// pto2 oct
  new Triangle(pto2,pt9,pt10),			// pto2 oct
  new Triangle(pto2,pt10,pt19),			// pto2 oct
  new Triangle(pto2,pt19,pt20),			// pto2 oct
  new Triangle(pto2,pt13,pt14),			// pto2 oct
  new Triangle(pto2,pt14,pt20),			// pto2 oct

  
  new Triangle(ptc3,pt6,pt15),			// quad
  new Triangle(ptc3,pt8,pt13),			// quad
  new Triangle(ptc3,pt15,pt13),			// quad
  new Triangle(ptc11,pt30,pt32),			// quad
  new Triangle(ptc11,pt32,pt37),			// quad
  new Triangle(ptc12,pt34,pt36),			// quad
  new Triangle(ptc12,pt34,pt41),
  new Triangle(ptc13,pt38,pt40),
  new Triangle(ptc13,pt40,pt45),

  new Triangle(pto4,pt15,pt13),			// pto4 oct	
  new Triangle(pto4,pt15,pt16),			// pto4 oct	
  new Triangle(pto4,pt13,pt14),			// pto4 oct	
  new Triangle(pto4,pt14,pt23),			// pto4 oct	
  new Triangle(pto4,pt16,pt21),			// pto4 oct	
  new Triangle(pto4,pt21,pt22),			// pto4 oct	
  new Triangle(pto4,pt23,pt24),			// pto4 oct	
  new Triangle(pto4,pt22,pt24),			// pto4 oct	

  new Triangle(pto5,pt17,pt18),			// pto5 oct	
  new Triangle(pto5,pt17,pt25),			// pto5 oct	
  new Triangle(pto5,pt25,pt26),			// pto5 oct	
  new Triangle(pto5,pt26,pt29),			// pto5 oct	
  new Triangle(pto5,pt18,pt31),			// pto5 oct	
  new Triangle(pto5,pt29,pt30),			// pto5 oct	
  new Triangle(pto5,pt30,pt32),			// pto5 oct	
  new Triangle(pto5,pt31,pt32),			// pto5 oct	

  new Triangle(pto6,pt19,pt20),			// pto6 oct	
  new Triangle(pto6,pt19,pt27),			// pto6 oct	
  new Triangle(pto6,pt27,pt28),			// pto6 oct	
  new Triangle(pto6,pt28,pt35),			// pto6 oct	
  new Triangle(pto6,pt20,pt33),			// pto6 oct	
  new Triangle(pto6,pt35,pt36),			// pto6 oct	
  new Triangle(pto6,pt33,pt34),			// pto6 oct	
  new Triangle(pto6,pt34,pt36),			// pto6 oct	

  new Triangle(pto7,pt21,pt31),			// pto7 oct	
  new Triangle(pto7,pt21,pt22),			// pto7 oct	
  new Triangle(pto7,pt31,pt32),			// pto7 oct	
  new Triangle(pto7,pt32,pt37),
  new Triangle(pto7,pt22,pt39),
  new Triangle(pto7,pt37,pt38),
  new Triangle(pto7,pt39,pt40),
  new Triangle(pto7,pt38,pt40),

  new Triangle(pto8,pt23,pt33),			// pto8 oct	
  new Triangle(pto8,pt23,pt24),			// pto8 oct	
  new Triangle(pto8,pt33,pt34),			// pto8 oct	
  new Triangle(pto8,pt34,pt41),
  new Triangle(pto8,pt41,pt42),
  new Triangle(pto8,pt42,pt44),
  new Triangle(pto8,pt24,pt43),
  new Triangle(pto8,pt43,pt44),

  new Triangle(pto9,pt39,pt43),
  new Triangle(pto9,pt39,pt40),
  new Triangle(pto9,pt43,pt44),
  new Triangle(pto9,pt40,pt45),
  new Triangle(pto9,pt44,pt47),
  new Triangle(pto9,pt45,pt46),
  new Triangle(pto9,pt47,pt48),
  new Triangle(pto9,pt46,pt48),

  new Triangle(ptc5,pt10,pt19),			// quads
  new Triangle(ptc5,pt19,pt27),			// quad
  new Triangle(ptc7,pt14,pt20),			// quad
  new Triangle(ptc7,pt20,pt33),			// quad
  new Triangle(ptc7,pt23,pt33),			// quad

  new Triangle(ptc4,pt12,pt17),			// quad
  new Triangle(ptc4,pt17,pt25),			// quad

  new Triangle(ptc6,pt16,pt18),			// quad
  new Triangle(ptc6,pt16,pt21),			// quad
  new Triangle(ptc6,pt18,pt31),			// quad
  new Triangle(ptc6,pt21,pt31),			// quad

  new Triangle(ptc7,pt14,pt23),			// quad
  //new Triangle({"x":EDGE,"y":EDGE},pt22,pt24),
  new Triangle(ptc8,pt22,pt24),
  new Triangle(ptc8,pt22,pt39),
  new Triangle(ptc8,pt24,pt43),
  new Triangle(ptc8,pt39,pt43),
  new Triangle(ptc14,pt42,pt44),
  new Triangle(ptc14,pt44,pt47),
  new Triangle({"x":0,"y":EDGE},pt26,pt29),
  new Triangle({"x":EDGE,"y":0},pt28,pt35),
  new Triangle({"x":EDGE,"y":EDGE},pt46,pt48),
]

ctx.lineWidth=2;
var fs1a;
var fs2a;

var draw2=()=>{
  fs1a=fs1.getArrayN();
  fs2a=fs2.getArrayN();
//  pt1.ta[i].setLocation();
  for (let i=0; i<1; i++) {
    ctx.fillStyle=color.getRGB(ta[i].getSizeProx()/50);
    let pth=ta[i].getPath();
    pth.addPath(pth,dmx);
    pth.addPath(pth,dmy);
    ctx.fill(pth);
    ctx.strokeStyle="#00000088";
    ctx.stroke(pth);
  }
}

var draw=()=>{
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  fs1a=fs1.getArrayN();
//  fs2a=fs2.getArrayN();
  locate();

/*
let ph=new Path2D();
let dmh=new DOMMatrix([S6,C6,C6,S6,0,0]);
//let dmh2=new DOMMatrix([-C6,S6,S6,-C6,0,0]);
ph.addPath(tri4,dmh);
let pf=new Path2D(ph);
for (let i=1; i<6; i++) pf.addPath(ph,dmr[i]);
pf.addPath(pf,dmy);
*/

//let pf=new Path2D();
  for (let i=0; i<ta.length; i++) {
//let c=ta[i].getSizeProx()/60+ta[i].getCent()/200;
    //ctx.fillStyle=color.getRGB(ta[i].getSizeProx()/50);
    //ctx.fillStyle=color.getRGB(ta[i].getCent()/50);
    //ctx.fillStyle=color.getRGB(c);
    ctx.fillStyle=color.getRGB(ta[i].getSizeProx()/50);
    let pth=ta[i].getPath();
    //let ptho=ta[i].getPath();
  //let dmh=new DOMMatrix([S6,C6,C6,S6,0,0]);
  //let pth=new Path2D();
  //pth.addPath(ptho,dmh);
  //pth.addPath(ptho,new DOMMatrix([1,1-S8,1-S8,1,0,0]));
  pth.addPath(pth,dmx);
  pth.addPath(pth,dmy);
//pf.addPath(pth);
    ctx.fill(pth);
    //ctx.strokeStyle="#000000DD";
ctx.strokeStyle="#00000088";
    ctx.stroke(pth);
  }

/*
ctx.strokeStyle=color.getRGB(0);
ctx.lineWidth=1;
ctx.stroke(pf);
ctx.strokeStyle="#00000010";
ctx.lineWidth=4;
ctx.stroke(pf);
*/

}

onresize();

draw();

ctx.font="bold 20px sans-serif";
ctx.textAlign="center";
var drawText=()=>{	// diag
  for (let i=0; i<lines.length; i++) {
    ctx.fillText(i,lines[i].mx,lines[i].my);
  }
}
var test=(n)=>{
  ctx.fillStyle="white";
  ctx.fill(ta[n].getPath());
}

var showpts=()=>{
  ctx.fillStyle="yellow";
  ctx.fillText("7",pt7.x-8,pt7.y);
  ctx.fillText("9",pt9.x-8,pt9.y);
  ctx.fillText("10",pt10.x-8,pt10.y);
  ctx.fillText("11",pt11.x-8,pt11.y);
  ctx.fillText("12",pt12.x-8,pt12.y);
  ctx.fillText("13",pt13.x-8,pt13.y);
  ctx.fillText("15",pt15.x-8,pt15.y);
  ctx.fillText("16",pt16.x-8,pt16.y);
  ctx.fillText("17",pt17.x-8,pt17.y);
  ctx.fillText("18",pt18.x-8,pt18.y);
  ctx.fillText("19",pt19.x-8,pt19.y);
  ctx.fillText("23",pt23.x-8,pt23.y);
  ctx.fillText("25",pt25.x-8,pt25.y);
  ctx.fillText("26",pt26.x-8,pt26.y);
  ctx.fillText("27",pt27.x-8,pt27.y);
  ctx.fillText("29",pt29.x-8,pt29.y);
  ctx.fillText("35",pt35.x-8,pt35.y);
  ctx.fillText("c1",ptc1.x-8,ptc1.y);
  ctx.fillText("c2",ptc2.x-8,ptc2.y);
  ctx.fillText("c3",ptc3.x-8,ptc3.y);
  ctx.fillText("c4",ptc4.x-8,ptc4.y);
  ctx.fillText("c5",ptc5.x-8,ptc5.y);
  ctx.fillText("c6",ptc6.x-8,ptc6.y);
  ctx.fillText("c7",ptc7.x-8,ptc7.y);
  ctx.fillText("o3",pto3.x-8,pto3.y);
  ctx.fillText("o4",pto4.x,pto4.y);
  ctx.fillText("o5",pto5.x,pto5.y);
}

showpts();
