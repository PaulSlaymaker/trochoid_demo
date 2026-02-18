"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S6=Math.sin(TP/6);
const CSIZE=360;

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
  const CT=256-CBASE;
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
//60,240 for 180
    this.RK1=100+400*Math.random();
    this.GK1=100+400*Math.random();
    this.BK1=100+400*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}
const color=new Color();

var drawPoint=(x,y,col,r)=>{	// diag
  ctx.beginPath();
  let rad=r?r:3;
  ctx.arc(x,y,rad,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

function Point(i,j,r) {
  const B1=TP/6+0.001; 
  const B2=TP/3-0.001; 
  this.i=i;
  this.j=j;
  if (j%2) this.x=i*r+r/2;
  else this.x=i*r;
  if (r%2) this.x+=0.00001;
  this.y=S6*j*r;
  this.key=Math.round(this.x)+","+Math.round(this.y);
  if (j==0) this.b=false;
  else this.b=(Math.atan2(this.y,this.x)>B1 || Math.atan2(this.y,this.x-360)<B2);
}

function GP(gpt,s1pt,s2pt,km) {	// dash, dash offset rate
if (!km) debugger;
  this.pt=gpt;	// this needed?
  this.s1=s1pt;
  this.s2=s2pt;
  this.km=km;
//  this.t=0;
//  this.dur=km.R+10-getRandomInt(0,20);
// dash, offset rate
  this.type=Math.round(Math.random());
  this.getPath1=()=>{
    let p=new Path2D();
    let x=f*this.pt.x+(1-f)*(this.s1.x+this.s2.x)/2;
    let y=f*this.pt.y+(1-f)*(this.s1.y+this.s2.y)/2;
    p.moveTo(x,y);
    p.lineTo(this.s1.x,this.s1.y);
    p.moveTo(x,y);
    p.lineTo(this.s2.x,this.s2.y);
    return p;
  }
  this.getPath2=()=>{
    let p=new Path2D();
    let x=f*this.pt.x+(1-f)*(this.s1.x+this.s2.x)/2;
    let y=f*this.pt.y+(1-f)*(this.s1.y+this.s2.y)/2;
    p.moveTo(this.s1.x,this.s1.y);
    p.lineTo(x,y);
    p.moveTo(this.s2.x,this.s2.y);
    p.lineTo(x,y);
    return p;
  }
  this.getPath=()=>{
    if (this.type) return this.getPath1();
    else return this.getPath2();
  }
  this.grow=()=>{
    let pa=[];
    let z1=Math.atan2(this.s2.y-this.s1.y,this.s2.x-this.s1.x);
    let x1=this.pt.x+KM.R*Math.cos(z1);
    let y1=this.pt.y+KM.R*Math.sin(z1);
    let p1=KM.pm.get(Math.round(x1)+","+Math.round(y1));
    if (p1 && !p1.b) pa[0]=p1;
    else pa[0]=false;
    let z2=z1+Math.PI;
    let x2=this.pt.x+KM.R*Math.cos(z2);
    let y2=this.pt.y+KM.R*Math.sin(z2);
    let p2=KM.pm.get(Math.round(x2)+","+Math.round(y2));
    if (p2 && !p2.b) pa[1]=p2;
    else pa[1]=false;
    if (!pa[0] && !pa[1]) return false;
    if (pa[0] && pa[1]) {
      if (Math.random()<0.5) {
        this.s1=this.pt;
        this.pt=pa[0];
        return this;
      } else {
        this.s2=this.s1;
        this.s1=this.pt;
        this.pt=pa[1];
        return this;
      }
    } else {
      if (pa[0]) {
        this.s1=this.pt;
        this.pt=pa[0];
        return this;
      } else {
        this.s2=this.s1;
        this.s1=this.pt;
        this.pt=pa[1];
        return this;
      }
    }
  }
}

var createPointMaps=()=>{
  //let ra=[60,40,30,24,20,15,12,10,8]; //,15,12];
  //let ra=[180,120,90,72,60,45,40,30,24];	// 60,30,15	// 72,24,12	// 60,20,10
  //let ra=[120,90,45]
  //let ra=[180,120];
  let ra=[180,90];
  let km=[];
  for (let i=0; i<ra.length; i++) {
    let pm=new Map(), fpa=[];
    for (let j=0; j<CSIZE/ra[i]+1; j++) {
      for (let k=0; k<CSIZE/(ra[i]*S6); k++) {
        let pt=new Point(j,k,ra[i]);
        pm.set(pt.key,pt);
        if (!pt.b) fpa.push(pt);
      }
    }
//    let va=[pm.get("0,0"),pm.get(CSIZE+",0"),pm.get(CSIZE/2+","+Math.round(CSIZE*S6))];
    pm.get("0,0").v=true;
    pm.get(CSIZE+",0").v=true;
    pm.get(CSIZE/2+","+Math.round(CSIZE*S6)).v=true;
    km.push({"R":ra[i],"count":CSIZE/ra[i]+1,"pm":pm,"fpa":fpa});
  }
  return km;
}
var ksetm=createPointMaps();

/*
ctx.font="9px sans-serif";
ctx.textAlign="center";
var drawPoints=()=>{
  let km=KM;
  km.pm.forEach((pt)=>{
    let p=new Path2D();
    p.arc(pt.x,pt.y,3,0,TP);
    if (pt.b) ctx.fillStyle="red";
    else ctx.fillStyle="white";
    if (pt.v) ctx.fillStyle="gray";
    ctx.fill(p);
    ctx.fillStyle="silver";
    //ctx.fillText(pt.key,pt.x,pt.y-6);
    ctx.fillText(pt.i+","+pt.j,pt.x,pt.y-6);
  });
}
*/

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var DUR=120;	// f(KM.R)	// 120:80, 180:120
var f=0;
var t=0;
var c=0;

var animate=(ts)=>{
  if (stopped) return;
  //for (let i=0; i<gpa.length; i++) {
  //  gpa[i].t++;
  //}
  t++,c++;
  if (t>DUR) {
    t=0;
    for (let i=0; i<gpa.length; i++) {
      gpa[i]=gpa[i].grow();
      if (!gpa[i]) gpa[i]=generateGrowthPoint();
       gpa[i].type=Math.round(Math.random());
    }
    if (Math.random()<0.2) {
      KM=ksetm[1]; DUR=60;	//90
    } else {
      KM=ksetm[0]; DUR=120;	//180
    }
    ctx.setLineDash([KM.R,1.3*KM.R]);
  }
  f=t/DUR;
  draw();
  requestAnimationFrame(animate);
}

var transformPath=(pth)=>{
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  let p=new Path2D();
  p.addPath(pth,new DOMMatrix([S6,0.5,-0.5,S6,0,0]));
  let p2=new Path2D(p);
  p2.addPath(p2,new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]));
  p2.addPath(p2,new DOMMatrix([-0.5,-S6,S6,-0.5,0,0]));
  p2.addPath(p2,dmx);
  return p2;
}

var draw=()=>{
  let p=transformPath(gpa[0].getPath());
  for (let i=1; i<gpa.length; i++) { p.addPath(transformPath(gpa[i].getPath())); }
  ctx.lineDashOffset=-c;
  ctx.lineWidth=8;
  ctx.strokeStyle="#00000008";
  ctx.stroke(p);
  ctx.lineWidth=3;
  ctx.strokeStyle=color.getRGB(0);
  ctx.stroke(p);
}

onresize();

var KM=ksetm[0];

//drawPoints();

var generateGrowthPoint=()=>{
  let km=KM;
  var point=km.fpa[getRandomInt(0,km.fpa.length)];
//drawPoint(point.x,point.y,"blue");
  let ridx=getRandomInt(0,6);
  for (let i=0; i<6; i++) {
    let idx=(i+ridx)%6;
    let x1=point.x+km.R*Math.cos(idx/6*TP);
    let y1=point.y+km.R*Math.sin(idx/6*TP);
    let s1=km.pm.get(Math.round(x1)+","+Math.round(y1));
    if (s1) {
      if (s1.b) continue;
      let idx2=(i+1+ridx)%6;
      let x2=point.x+km.R*Math.cos(idx2/6*TP);
      let y2=point.y+km.R*Math.sin(idx2/6*TP);
      let s2=km.pm.get(Math.round(x2)+","+Math.round(y2));
      if (s2) {
	if (s2.b) continue;
	return new GP(point,s1,s2,km);
      }
    }
  }
}

//ctx.setLineDash([KM.R/2,200]);
//ctx.setLineDash([KM.R/2,KM.R/2]);
//ctx.setLineDash([KM.R/66.2,KM.R/8.2]);
ctx.setLineDash([KM.R,1.3*KM.R]);
// 3 for 180, 4 for 120
var gpa=[generateGrowthPoint(),generateGrowthPoint(),generateGrowthPoint(),generateGrowthPoint()];

start();

// fixed points, or changing?
// 1 or 2 distant next point?
// variable dash
// dark color range
// 2 color (with slow c change)
// vary gpa length with sum of km.Rs

