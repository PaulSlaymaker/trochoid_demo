"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S6=Math.sin(Math.PI/3);
const S8=Math.sin(Math.PI/4);
const CSIZE=360;

const container=document.createElement("div");
container.style.margin="auto";
body.append(container);
for (let i=0; i<3; i++) {
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
c.style.outline="1px dotted gray";
  c.ctx=c.getContext("2d");
  //c.ctx.setTransform(0,1,-1,0,CSIZE,CSIZE);
c.ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  c.ctx.lineCap="round";
//  c.ctx.lineJoin="round";
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
  const CBASE=168;
  const CT=255-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=40+120*Math.random();
    this.GK1=40+120*Math.random();
    this.BK1=40+120*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();

var DT=120;
//var DT=40;
//const RANGEMK=200;
//const RANGEMK=100;
//const MINMK=60;

// r=320
const RANGEMK=200;
const MINMK=100;


function Line() {
this.td=DT+t;
this.RK=0;
  this.dirx=Math.random()<0.5?1:-1;	// permanent line attribute
  this.diry=-1;//Math.random()<0.5?1:-1;	// permanent line attribute
  this.dm=new DOMMatrix();
  this.randomize=()=>{
    //this.MK1=((Math.random()<0.5)?1:-1)*(MINMK+RANGEMK*Math.random());	// remove +/-, then put dir in path	// remove +/-, then put dir in path
    this.MK1=this.diry*(MINMK+RANGEMK*Math.random());
    //this.MK2=-400; //this.dirx*(MINMK+RANGEMK*Math.random());
    this.MK2=this.dirx*(MINMK+RANGEMK*Math.random());
    this.NK1=0; //TP*Math.random();
    this.NK2=0; //TP*Math.random();
  }
//  this.randomize();	// only initial, not subsequent new Line
/*
  this.locate=()=>{
    let f1=Math.cos(t/this.MK1);
    let f2=Math.sin(t/this.MK2);
//if (Math.abs(f1)<0.001) console.log("f1 "+t);
//if (Math.abs(f2)<0.001) console.log("f2 "+t);
    this.dm.a=s*f1;
    this.dm.b=s*Math.sin(t/this.MK2);
    this.dm.c=s*Math.sin(t/this.MK3);
    this.dm.d=s*Math.cos(t/this.MK4);
    this.dm.e=320*Math.sin(t/400);	// can be CSIZE w/point end?
    this.dm.f=0; //320*Math.sin(t/400);
  }
*/
  this.getParameterArray2=()=>{
    let MKx=this.dirx*(MINMK+RANGEMK*Math.random());
    let NKx=this.NK2+t/this.MK2-t/MKx;
    let MKy=this.diry*(MINMK+RANGEMK*Math.random());
    let NKy=this.NK1+t/this.MK1-t/MKy;
    return [MKx,NKx,MKy,NKy];
  }
  this.getParameterArray=()=>{
    let ksl=-(Math.cos(this.NK1+t/this.MK1)/this.MK1)
            /(Math.sin(this.NK2+t/this.MK2)/this.MK2);
    let MKx=this.dirx*(MINMK+RANGEMK*Math.random());
    let NKx=this.NK2+t/this.MK2-t/MKx;
    let K2=Math.sin(NKx+t/MKx)/MKx;
    let Ksy=Math.cos(this.NK1+t/this.MK1);
    let MKy=-Ksy/(ksl*K2);
    let NKy=this.NK1+t/this.MK1-t/MKy;
    return [MKx,NKx,MKy,NKy];
  }
/*
  this.gp=()=>{
    let ksl=-(Math.cos(this.NK1+t/this.MK1)/this.MK1)
            /(Math.sin(this.NK2+t/this.MK2)/this.MK2);
    let MKx=-(MINMK+RANGEMK*Math.random());
    let NKx=this.NK2+t/this.MK2-t/MKx;
    let K2=Math.sin(NKx+t/MKx)/MKx;
    let Ksy=Math.cos(this.NK1+t/this.MK1);
    return [ksl,MKx,NKx,K2,Ksy];
  }
*/
  this.changePath=()=>{
    this.td+=DT;
    [this.MK2,this.NK2,this.MK1,this.NK1]=this.getParameterArray2();
  }
  this.changePathO=()=>{
this.td+=DT;

//let ys0=this.NK1+t/this.MK1;
//let xs0=this.NK2+t/this.MK2;
    let ksl=-(Math.cos(this.NK1+t/this.MK1)/this.MK1)
            /(Math.sin(this.NK2+t/this.MK2)/this.MK2);


// if abs ksl>1000 dirx change +-, abs<0.001 diry change +-
//console.log("slope "+ksl);
//console.log(this.MK1/this.MK2);
    let MKx=-(MINMK+RANGEMK*Math.random());
    //let MKx=((Math.random()<0.5)?1:-1)*(MINMK+RANGEMK*Math.random());
//    let MKy=MINMK+RANGEMK*Math.random();
    let NKx=this.NK2+t/this.MK2-t/MKx;
    //let K2=1/MKx*(Math.sin(NKx+t/MKx));
    let K2=Math.sin(NKx+t/MKx)/MKx;

let Ksy=Math.cos(this.NK1+t/this.MK1);

//[ksl,MKx,NKx,K2,Ksy]=this.gp();
let MKy=-Ksy/(ksl*K2);
//let MKy=Ksy/(ksl*K2);
//if (MKy<MINMK) debugger;

//MKy=MKx*this.MK1/this.MK2;
let NKy=this.NK1+t/this.MK1-t/MKy;
//console.log("x: "+
//    let NKy=Math.asin(-K2/MKy)-t/MKy;
//console.log(NKy);
//if (isNaN(NKy)) debugger;
    this.NK1=NKy;
    this.MK1=MKy;
    this.NK2=NKx;
    this.MK2=MKx;
/*
let ys1=this.NK1+t/this.MK1;
let xs1=this.NK2+t/this.MK2;
console.log(ys0+" "+ys1);
console.log(xs0+" "+xs1);
let ksl2=-(Math.cos(this.NK1+t/this.MK1)/this.MK1)/(Math.sin(this.NK2+t/this.MK2)/this.MK2);
console.log("slopes "+ksl+" "+ksl2);
*/
  }
  this.getPath=()=>{
    //let f1=80*Math.cos(t/this.MK1);
    //let f2=80*Math.sin(this.NK2+t/this.MK2);
    //if (Math.abs(f1)<0.001) console.log("f1 "+t);
    //if (Math.abs(f2)<0.001) console.log("f2 "+t);
    //let r1=20+10*Math.sin(t/22);
    //let r2=t/33;
    let p=new Path2D();
// convert x growth to radius
// RK=s*f2;  add to x,y
//let r=320*Math.sin(t/(K*2));
let r=320*t/(TP*100);
//let x=r;//*Math.cos(this.NK1+t/this.MK1);

/*
let x=r+80*Math.cos(this.NK2+t/this.MK2);
//let y=r*Math.sin(this.NK2+t/this.MK2);
let y=r+80*Math.sin(this.NK1+this.diry*t/this.MK1);
*/

//let x=-140+140*Math.cos(this.NK2+t/this.MK2);
let x=120+120*Math.cos(this.NK2+t/this.MK2);
let y=240*Math.sin(this.NK1+t/this.MK1);

    //p.ellipse(x,y,s*10,s*80,0,-TP/4,TP/4);
    //p.ellipse(x,y,s*1,s*8,0,-TP/4,TP/4);
    p.ellipse(x,y,1,1,0,0,TP);
    //p.ellipse(320*Math.sin(t/400),f2,s*2,s*12,0,-TP/4,TP/4);
    //p.ellipse(320*Math.sin(t/400),s*f2,s*20,s*60,0,TP/4,3*TP/4);
    //p.ellipse(320*Math.sin(t/400)+s*f1,s*f2,s*r1,s*(60-r1),r2,0,TP);
    return p;
  }
  this.divide3=()=>{
if (la.length>400) stopped=true;
    this.td+=DT;
    let nl=new Line();
nl.dirx=this.dirx;
nl.diry=this.diry;
    [nl.MK2,nl.NK2,nl.MK1,nl.NK1]=this.getParameterArray2();
    //la.push(nl);
if (Math.random()<0.4) la.unshift(nl);
    else la.push(nl);
this.changePath();
  }
  this.divide2=()=>{
if (la.length>400) debugger;
    this.td+=DT;
    let nl=new Line();
    [nl.MK2,nl.NK2,nl.MK1,nl.NK1]=this.getParameterArray();
    la.push(nl);
    this.changePath();
  }
  this.divide=()=>{
if (la.length>400) debugger;
    //this.y1=(this.y0+this.y1)/2;
    this.td+=DT;
//nl.randomize();
//let MK=((Math.random()<0.5)?1:-1)*(60+240*Math.random());
//let NK=this.NK2+t/this.MK2-t/MK;
//let MK=((Math.random()<0.5)?1:-1)*(60+240*Math.random());
//let MK=this.MK2+((Math.random()<0.5)?1:-1)*(80*Math.random());	// force min 160
let MK=MINMK+RANGEMK*Math.random();
if (Math.abs(MK)<MINMK) { debugger; if (MK<0) MK=-MINMK; else MK=MINMK; }

//this.MK2=((Math.random()<0.5)?1:-1)*(60+240*Math.random());
this.NK2=this.NK2+t/this.MK2-t/MK;

//let yt1=Math.sin(this.NK2+t/this.MK2);
//this.NK2=Math.acos(this.MK2/MK*Math.cos(this.NK2+t/this.MK2))-(t/MK);
//this.NK2=Math.acos(MK/this.MK2*Math.cos(this.NK2+t/this.MK2))-(t/MK);
this.MK2=MK;
//let yt2=Math.sin(this.NK2+t/this.MK2);
//console.log(yt1+" "+yt2);

/*
    let nl=new Line();
//nl.MK1=((Math.random()<0.5)?1:-1)*(160+200*Math.random());
//nl.NK1=TP*Math.random();

//nl.MK2=((Math.random()<0.5)?1:-1)*(160+200*Math.random());
//nl.MK2=this.MK2+((Math.random()<0.5)?1:-1)*(80*Math.random());	// force min 160
//nl.MK2=this.MK2+((Math.random()<0.5)?1:-1)*(80*Math.random());	// force min 160
nl.MK2=(this.MK2+MINMK)/2;
//nl.MK2=MINMK+RANGEMK*Math.random();
if (Math.abs(nl.MK2)<60) {
debugger;
  if (nl.MK2<0) nl.MK2=-MINMK; else nl.MK2=MINMK;
  console.log(nl.MK2);
}
//nl.td=this.td;
//    nl.MK2=this.MK2;
//console.log(nl.MK2, this.MK2);
    //nl.NK2=this.NK2*this.MK2/nl.MK2;
    nl.NK2=this.NK2+t/this.MK2-t/nl.MK2;
    la.push(nl);
*/
  }

}

var cycle=()=>{
container.lastChild.ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let canv1=container.removeChild(container.firstChild);
  canv1.ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  canv1.style.opacity=1;
  container.append(canv1);
  color.randomize();
dash1=20+80*Math.random();
dash2=4+8*Math.random();
//  for (let i=0; i<la.length; i++) { la[i].randomize(); }
  la=[line];
  line.randomize();
  line.td=DT;
//  line.NK1=0;
//  line.NK2=0;
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

var K=200;
var DUR=TP*K/2;	// half Line dm motion K
var t=0;
var s=0; //Math.pow(Math.sin(t/K),1);
var animate=(ts)=>{
  if (stopped) return;
  t++;
s=Math.abs(Math.sin(t/K));
//  container.firstChild.style.opacity=1-c/DUR;
  //if (t%DUR==0) {
//if (t%(DUR/2)<1) stopped=true;
/*
  if (t>DUR) {	// cycle on x or y >320?
//    t=0;
//    cycle();
//if (EM) stopped=true
    stopped=true	// pause
  }
*/
  draw();
  requestAnimationFrame(animate);
}

var dash1=20+80*Math.random();
var dash2=4+8*Math.random();

var draw=()=>{
  const dm1=new DOMMatrix([-1,0,0,1,0,0]);
  const dm2=new DOMMatrix([0,1,-1,0,0,0]);
  const dm3=new DOMMatrix([1,0,0,-1,0,0]);
  const dmr=new DOMMatrix([-0.5,S6,S6,0.5,0,0]);	// 1st rotation
  const dmr2=new DOMMatrix([S8,S8,-S8,S8,0,0]);	// 1st rotation
  let ctx=container.lastChild.ctx;
/*
let TC=1+0.5*Math.cos(t/300);
let TS=-0.5*Math.sin(t/200);
ctx.setTransform(TC,TS,-TS,TC,CSIZE,CSIZE);
*/
let pf=new Path2D();
  for (let i=0; i<la.length; i++) {
//ctx.setLineDash([s*3,s*6]);
//ctx.setLineDash([s*dash1,s*dash2]);
  //la[i].locate();

    if (la[i].td==t) la[i].divide3();
    //if (la[i].td==t) la[i].changePath();

/*
let TC=Math.cos(t/200);
let TS=Math.sin(t/200);
ctx.setTransform(TC,TS,-TS,TC,CSIZE,CSIZE);
*/

//  ctx.lineWidth=3;
//  ctx.strokeStyle=color.getRGB();

let p=new Path2D(la[i].getPath());
/*
p.addPath(p,dm1);
p.addPath(p,dm3);
p.addPath(p,dm2);
p.addPath(p,dmr2);
*/
pf.addPath(p);
  }

  ctx.strokeStyle="#0000001C";
  ctx.lineWidth=8;
  ctx.stroke(pf);
  ctx.strokeStyle=color.getRGB();
  ctx.lineWidth=4;
  ctx.stroke(pf);
}

onresize();

var line=new Line();	// create only in cycle fct
line.randomize();
line.NK1=0;
//line.NK2=TP/4;	// start at 0,0
line.NK2=TP/2;
//line.NK2=0;
var line2=new Line();	// create only in cycle fct
line2.randomize();
//line2.NK2=0; //TP/4;	// start at 0,0
line2.NK2=TP/2; //TP/4;	// start at 0,0
var la=[line,line2];

start();
