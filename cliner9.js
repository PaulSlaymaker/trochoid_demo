"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;
const S8=Math.sin(TP/8);

var DUR=800;

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

function Point(xfi,yfi) {
  this.setLocation=()=>{ this.x=fa[xfi]*EDGE; this.y=fb[yfi]*EDGE; }
}

function PointO(px1,px2,py1,py2) {
  this.randomize=()=>{
    this.K2=(Math.random()<0.5?1:-1)*(40+40*Math.random());
    this.K4=(Math.random()<0.5?1:-1)*(40+40*Math.random());
  }
  this.randomize();
}

var KF=0.9; //0.008; //(1+Math.sin(TP*t/1000))/2; 

function Fraction(idx) {
  this.f=0;
  this.zero=false;
  this.randomize=()=>{
    this.K1=800+800*Math.random();
    this.K2=TP*Math.random();
    //this.K1=DUR; //600+600*Math.random();
//    this.K1=DUR*getRandomInt(1,3);
    //this.K2=TP/24*idx; //getRandomInt(0,2)*TP/2;
//    this.K2=getRandomInt(0,2)*TP/2;
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
    for (let i=0; i<n; i++) {
      this.fa[i].setFraction();
      fs+=this.fa[i].f;
    }
    let ffa=[0];
    for (let i=0, acc=0; i<n; i++) {
      acc+=this.fa[i].f/fs;
      ffa.push(acc);
    }
//    ffa.push(EDGE);
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
/*
  this.getCent=()=>{
    let xm=(ppc.x+pp2.x+pp3.x)/3;
    let ym=(ppc.y+pp2.y+pp3.y)/3;
    return Math.pow(xm*xm+ym*ym,0.5); 

  }
*/
  this.getSizeProx=()=>{
    let xm=(ppc.x+pp2.x+pp3.x)/3;
    let ym=(ppc.y+pp2.y+pp3.y)/3;
/*
    let prox=
      Math.abs(ppc.x-xm)+Math.abs(pp2.x-xm)+Math.abs(pp3.x-xm)+
      Math.abs(ppc.y-ym)+Math.abs(pp2.y-ym)+Math.abs(pp3.y-ym)
    ;
    return prox;
*/
    return Math.abs(ppc.x-xm)+Math.abs(pp2.x-xm)+Math.abs(pp3.x-xm)+
           Math.abs(ppc.y-ym)+Math.abs(pp2.y-ym)+Math.abs(pp3.y-ym);
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
//var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  draw();
  if (EM && t%200==0) {
    stopped=true
    parent.postMessage("lf");
  }
  requestAnimationFrame(animate);
}

const EDGE=CSIZE;//0.7*CSIZE;

var pt1=new Point(1,0);	// moveable tiling points, shared oct/quad vertices
var pt2=new Point(2,0);
var pt3=new Point(0,1);
var pt4=new Point(0,2);
var pt5=new Point(1,3);
var pt6=new Point(2,3);
var pt7=new Point(3,1);
var pt8=new Point(3,2);
var pt9=new Point(4,0);
var pt10=new Point(5,0);
var pt11=new Point(0,4);
var pt12=new Point(0,5);
var pt13=new Point(4,3);
var pt14=new Point(5,3);
var pt15=new Point(3,4);
var pt16=new Point(3,5);

var ptc0=new Point(0,0);
var ptc1=new Point(3,0);
var ptc2=new Point(0,3);
var ptc3=new Point(3,3);
var ptc4=new Point(0,6);
var ptc5=new Point(6,0);
var ptc6=new Point(3,6);
var ptc7=new Point(6,3);
var ptc8=new Point(6,6);
var ptc9=new Point(0,9);
var ptc10=new Point(9,0);
var ptc11=new Point(3,9);
var ptc12=new Point(9,3);
var ptc13=new Point(6,9);
var ptc14=new Point(9,6);
var ptc15=new Point(9,9);

var pt17=new Point(1,6);
var pt18=new Point(2,6);
var pt19=new Point(6,1);
var pt20=new Point(6,2);
var pt21=new Point(4,6);
var pt22=new Point(5,6);
var pt23=new Point(6,4);
var pt24=new Point(6,5);
var pt25=new Point(0,7);
var pt26=new Point(0,8);
var pt27=new Point(7,0);
var pt28=new Point(8,0);
var pt29=new Point(1,9);
var pt30=new Point(2,9);
var pt31=new Point(3,7);
var pt32=new Point(3,8);
var pt33=new Point(7,3);
var pt34=new Point(8,3);
var pt35=new Point(9,1);
var pt36=new Point(9,2);
var pt37=new Point(4,9);
var pt38=new Point(5,9);
var pt39=new Point(6,7);
var pt40=new Point(6,8);
var pt41=new Point(9,4);
var pt42=new Point(9,5);
var pt43=new Point(7,6);
var pt44=new Point(8,6);
var pt45=new Point(7,9);
var pt46=new Point(8,9);
var pt47=new Point(9,7);
var pt48=new Point(9,8);

var pto=new PointO(pt1,pt2,pt3,pt4);
var pto2=new PointO();
var pto3=new PointO();
var pto4=new PointO();
var pto5=new PointO();
var pto6=new PointO();
var pto7=new PointO();
var pto8=new PointO();
var pto9=new PointO();

const fs1=new FractionSet(9);
const fs2=new FractionSet(9);

var fa=fs1.getArray();
var fb=fs1.getArray();
ptc0.setLocation();
ptc9.setLocation();
ptc10.setLocation();
ptc15.setLocation();

var locate=()=>{
  fa=fs1.getArray();
  fb=fs2.getArray();
  const pca=[ptc1,ptc2,ptc3,ptc4,ptc5,ptc6,ptc7,ptc8,ptc11,ptc12,ptc13,ptc14];
  pca.forEach((p)=>{ p.setLocation(); });
  const pa=[
    pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8,
    pt9, pt10,pt11,pt12,pt13,pt14,pt15,pt16,
    pt17,pt18,pt19,pt20,pt21,pt22,pt23,pt24,
    pt25,pt26,pt27,pt28,pt29,pt30,pt31,pt32,
    pt33,pt34,pt35,pt36,pt37,pt38,pt39,pt40,
    pt41,pt42,pt43,pt44,pt45,pt46,pt47,pt48
  ];
  pa.forEach((p)=>{ p.setLocation(); });

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

const ta=[
  new Triangle(ptc0,pt1,pt3),	// central quads
  new Triangle(ptc1,pt2,pt7),
  new Triangle(ptc1,pt7,pt9),	
  new Triangle(ptc2,pt4,pt5),
  new Triangle(ptc2,pt5,pt11),
  new Triangle(ptc3,pt6,pt8),
  new Triangle(ptc3,pt6,pt15),
  new Triangle(ptc3,pt8,pt13),
  new Triangle(ptc3,pt15,pt13),

  new Triangle(pto,pt1,pt3),
  new Triangle(pto,pt1,pt2),
  new Triangle(pto,pt2,pt7),
  new Triangle(pto,pt7,pt8),
  new Triangle(pto,pt8,pt6),
  new Triangle(pto,pt5,pt6),
  new Triangle(pto,pt4,pt5),
  new Triangle(pto,pt3,pt4),

  new Triangle(ptc4,pt12,pt17),
  new Triangle(ptc4,pt17,pt25),	

  new Triangle(pto3,pt11,pt5),
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

  new Triangle(pto7,pt21,pt31),
  new Triangle(pto7,pt21,pt22),
  new Triangle(pto7,pt31,pt32),
  new Triangle(pto7,pt32,pt37),
  new Triangle(pto7,pt22,pt39),
  new Triangle(pto7,pt37,pt38),
  new Triangle(pto7,pt39,pt40),
  new Triangle(pto7,pt38,pt40),

  new Triangle(pto8,pt23,pt33),
  new Triangle(pto8,pt23,pt24),
  new Triangle(pto8,pt33,pt34),
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
  new Triangle(ptc6,pt16,pt18),			// quad
  new Triangle(ptc6,pt16,pt21),			// quad
  new Triangle(ptc6,pt18,pt31),			// quad
  new Triangle(ptc6,pt21,pt31),			// quad
  new Triangle(ptc7,pt14,pt20),			// quad
  new Triangle(ptc7,pt20,pt33),			// quad
  new Triangle(ptc7,pt23,pt33),			// quad
  new Triangle(ptc7,pt14,pt23),

  new Triangle(ptc8,pt22,pt24),
  new Triangle(ptc8,pt22,pt39),
  new Triangle(ptc8,pt24,pt43),
  new Triangle(ptc8,pt39,pt43),
  new Triangle(ptc14,pt42,pt44),
  new Triangle(ptc14,pt44,pt47),
  new Triangle(ptc9,pt26,pt29),
  new Triangle(ptc10,pt28,pt35),
  new Triangle(ptc15,pt46,pt48),
]

ctx.lineWidth=2;

var draw=()=>{
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  locate();

//let pf=new Path2D();
  for (let i=0; i<ta.length; i++) {
//let c=ta[i].getSizeProx()/60+ta[i].getCent()/200;
    //ctx.fillStyle=color.getRGB(ta[i].getSizeProx()/50);
    //ctx.fillStyle=color.getRGB(ta[i].getCent()/50);
    //ctx.fillStyle=color.getRGB(c);
    ctx.fillStyle=color.getRGB(ta[i].getSizeProx()/50);
    let pth=ta[i].getPath();
    //let ptho=ta[i].getPath();
  //let pth=new Path2D();
  //pth.addPath(ptho,new DOMMatrix([1,1-S8,1-S8,1,0,0]));
  pth.addPath(pth,dmx);
  pth.addPath(pth,dmy);
//pf.addPath(pth);
    ctx.fill(pth);
    //ctx.strokeStyle="#000000DD";
ctx.strokeStyle="#00000088";
    ctx.stroke(pth);
  }
}

onresize();

start();

