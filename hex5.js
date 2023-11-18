"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");

const TP=2*Math.PI;
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
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);

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
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.getRGB=()=>{
/*
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
*/
    let red=Math.round(CBASE+CT*(this.fb*Math.cos(this.RK2+t/this.RK1)+(1-this.fb)*Math.cos(t/this.RK3)));
    let grn=Math.round(CBASE+CT*(this.fg*Math.cos(this.GK2+t/this.GK1)+(1-this.fg)*Math.cos(t/this.GK3)));
    let blu=Math.round(CBASE+CT*(this.fb*Math.cos(this.BK2+t/this.BK1)+(1-this.fb)*Math.cos(t/this.BK3)));
//    let grn=Math.round(CBASE+CT*(0.8*Math.cos(this.GK2+t/this.GK1)+0.2*Math.cos(t/this.GK3)));
//    let blu=Math.round(CBASE+CT*(0.5*Math.cos(this.BK2+t/this.BK1)+0.5*Math.cos(t/this.BK3)));
    return "rgb("+red+","+grn+","+blu+")";
/*
    let alpha=1; //(1+Math.sin(t/this.KA))/2;
    return "rgba("+red+","+grn+","+blu+","+alpha+")";
*/
  }
  this.randomizeF=()=>{
    this.fr=1-Math.pow(0.9*Math.random(),14);
    this.fg=1-Math.pow(0.9*Math.random(),14);
    this.fb=1-Math.pow(0.9*Math.random(),14);
  }
  this.randomize=()=>{
    this.RK1=180+180*Math.random();
    this.GK1=180+180*Math.random();
    this.BK1=180+180*Math.random();
//if (s) this.BK1=10+10*Math.random();
    this.RK3=1+4*Math.random();
    this.GK3=1+4*Math.random();
    this.BK3=1+4*Math.random();
//this.KA=40+40*Math.random();
    this.randomizeF();
  }
  this.randomize();
}

const colors=[new Color(),new Color()];

const radius=72;

var hpm=new Map();
var xSet=new Set();
var ySet=new Set();

var Circle=function(x,y) {
  this.x=x;
  this.y=y;
  this.hpts=new Array(6);
  let RF=radius/Math.cos(TP/12);
  let xz=new Array(6);
  let yz=new Array(6);
  for (let i=0; i<6; i++) {
    let z=i*TP/6+TP/12;
    xz[i]=Math.round(x+RF*Math.cos(z));
    yz[i]=Math.round(y+RF*Math.sin(z));
  }
  for (let i=0; i<6; i++) {
    xSet.add(xz[i]);
    ySet.add(yz[i]);
    let hk=[xz[i],yz[i]].toString();
    if (!hpm.has(hk)) {
      let hp={"x":xz[i],"y":yz[i]};
      hpm.set(hk,hp);
      this.hpts[i]=hp;
    } else {
      this.hpts[i]=hpm.get(hk);
    }
  }

  this.getHexPath=()=>{
    let p=new Path2D();
    p.moveTo(this.hpts[0].x,this.hpts[0].y);
    for (let i=1; i<6; i++) {
      p.lineTo(this.hpts[i].x,this.hpts[i].y);
    }
    p.closePath();
//    p.moveTo(this.hpts[0].x+4,this.hpts[0].y);
//    p.arc(this.hpts[0].x,this.hpts[0].y,4,0,TP);
/*
    //p.rect((this.hpts[0].x+this.hpts[3].x)/2-2,(this.hpts[0].y+this.hpts[3].y)/2-1,4,4);
    let x=(this.hpts[0].x+this.hpts[3].x)/2;
    let y=(this.hpts[0].y+this.hpts[3].y)/2;
    p.moveTo(x+4,y);
    p.arc(x,y,4,0,TP);
*/
    return p;
  }
}

var cm=new Map();

var fibo=(f,n)=>{
  if (n==0) return f;
  return fibo(f+=n,n-1);
}

var generateHexes=()=>{
  const sin=[0,0.866,0.866,0,-0.866,-0.866];
  const cos=[1,0.5,-0.5,-1,-0.5,0.5];
  let aCount=Math.trunc(CSIZE/2/radius);
  let cCount=1+6*fibo(0, aCount-1);
  let c=new Circle(0,0);
  cm.set("0,0",c);
  cm.forEach((c)=>{
    if (cm.size>=cCount) return;
    for (let a=0; a<6; a++) {
      let xt=radius*cos[a];
      let yt=radius*sin[a];
      let xc=c.x+2*xt;
      let yc=c.y+2*yt;
//if (Math.round(xc)<0 || Math.round(yc)<0) continue
      let ckey=[Math.round(xc),Math.round(yc)];
      if (!cm.has(ckey.toString())) {
	cm.set(ckey.toString(),new Circle(xc,yc));
      }
    }
  });
/*
  cm.forEach((c,key)=>{
    if (c.x<0 || c.y<0) {
      cm.delete(key);
    }
  });
*/
  hpm.forEach((h,key)=>{
    if (Math.round(h.x)<=0 || Math.round(h.y)<=0) {
      hpm.delete(key);
    }
  });
}
generateHexes();

/*
var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,6,0,TP);
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}
var drawHexes=()=>{  // diag
  let p=new Path2D();
  cm.forEach((c)=>{
    p.moveTo(c.hpts[0].x,c.hpts[0].y);
    for (let i=1; i<6; i++) {
      p.lineTo(c.hpts[i].x,c.hpts[i].y);
    }
    p.closePath();
  });
  ctx.lineWidth=3;
  ctx.strokeStyle="yellow";
  ctx.stroke(p);
}
*/

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
//var ga=TP*Math.random();
var draw=()=>{
  setPoints();
  let pa=[new Path2D(), new Path2D()];
  let counter=0;
//let R=20-20*Math.cos(TP*t/DUR);
  hpm.forEach((h)=>{
    let a=t/h.ka;
//let ar=Math.cos(TP*t/DUR);
    let r=h.r-h.r*Math.cos(TP*t/DUR);
    let r2=h.r2-h.r2*Math.cos(TP*t/DUR);

//let fr=1+0.005*Math.sin(t/2); r=fr*r; r2=fr*r2;
//  let rc=Math.max(r,r2);
//  if (h.x<-CSIZE || this.x2>EDGE) this.x2=this.x1-R*Math.cos(a);
//  let path=new Path2D();
    //pa[++counter%2].moveTo(h.x+r,h.y);
    pa[++counter%2].moveTo(h.x+r*Math.cos(a),h.y+r*Math.sin(a));
    //pa[counter%2].arc(h.x,h.y,R,0,TP);
    pa[counter%2].ellipse(h.x,h.y,r,r2,a,0,TP);
  });
  let shadp=new Path2D();

/*
if (counter%2) ctx.globalAlpha=Math.pow(Math.sin(t/4),8);
else ctx.globalAlpha=Math.pow(Math.sin(t/5),8);
*/
  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  ctx.lineWidth=3;
  for (let i=0; i<pa.length; i++) {
    pa[i].addPath(pa[i],dmx);
    pa[i].addPath(pa[i],dmy);
    ctx.strokeStyle=colors[i].getRGB();
    ctx.stroke(pa[i]);
    shadp.addPath(pa[i]);
  }
  ctx.setTransform(1,0,0,1,CSIZE-1,CSIZE+1);
  ctx.strokeStyle="#00000020";
  ctx.lineWidth=5;
  ctx.stroke(shadp);
}

var transit=()=>{
  hpm.forEach((h,key)=>{
    h.r=4+60*Math.random();
    h.r2=4+60*Math.random();
    h.ka=(50+150*Math.random())*(Math.random()<0.5?1:-1);
    //h.e=TP*Math.random();
  });
  colors.forEach((c)=>{ c.randomizeF(); });
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

var pauseTS=1000;
var pause=(ts)=>{
  if (EM) stopped=true;
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var t=0;
var DUR=400;
var animate=()=>{
  if (stopped) return;
  t++;
  if (t%DUR==0) {//stopped=true;
    transit();
    pauseTS=performance.now()+4000;
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
  draw();
}

let xpa=Array.from(xSet).sort((a,b)=>{ return a-b; });
let ypa=Array.from(ySet).sort((a,b)=>{ return a-b; });

var Kxa=new Array((xSet.size-1)/2);
var Kxb=new Array((xSet.size-1)/2);
for (let i=0; i<Kxa.length; i++) {
  Kxa[i]=240+240*Math.random();
  Kxb[i]=TP*Math.random();
}

var Kya=new Array(ySet.size/2);
var Kyb=new Array(ySet.size/2);
for (let i=0; i<Kya.length; i++) {
  Kya[i]=240+240*Math.random();
  Kyb[i]=TP*Math.random();
}

const EDGE=CSIZE-100;
var setPoints=()=>{
  let xpr=[0];
  for (let i=0; i<(xSet.size-1)/2; i++) {
    let rand=EDGE/2*(1+Math.sin(Kxb[i]+t/Kxa[i]));
    xpr.push(rand);
    xpr.push(-rand);
  }
  xpr.sort((a,b)=>{ return a-b; });
  let ypr=[];
  for (let i=0; i<ySet.size/2; i++) {
    let rand=EDGE/2*(1+Math.sin(Kyb[i]+t/Kya[i]));
    ypr.push(rand);
    ypr.push(-rand);
  }
  ypr.sort((a,b)=>{ return a-b; });
  for (let i=0; i<xpa.length; i++) {
    for (let j=0; j<ypa.length; j++) {
      let hex=hpm.get([xpa[i],ypa[j]].toString());
      if (hex) { hex.x=xpr[i]; hex.y=ypr[j]; } 
    }
  }
}

onresize();

transit();
start();
