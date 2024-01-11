"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/jOdJzgz
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
ctx.globalCompositeOperation="destination-over";

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
    let red=Math.round(CBASE+CT*(this.fr*Math.cos(this.RK2+t/this.RK1)+(1-this.fr)*Math.cos(t/this.RK3)));
    let grn=Math.round(CBASE+CT*(this.fg*Math.cos(this.GK2+t/this.GK1)+(1-this.fg)*Math.cos(t/this.GK3)));
    let blu=Math.round(CBASE+CT*(this.fb*Math.cos(this.BK2+t/this.BK1)+(1-this.fb)*Math.cos(t/this.BK3)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomizeF=()=>{
    this.RK3=1+6*Math.random();
    this.GK3=1+6*Math.random();
    this.BK3=1+6*Math.random();
    this.fr=1-Math.pow(0.9*Math.random(),5);
    this.fg=1-Math.pow(0.9*Math.random(),5);
    this.fb=1-Math.pow(0.9*Math.random(),5);
  }
  this.randomize=()=>{
    this.RK1=160+160*Math.random();
    this.GK1=160+160*Math.random();
    this.BK1=160+160*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.randomizeF();
  }
  this.randomize();
}

var colors=[new Color(),new Color()];
const KT=14000; 

var Circle=function(k1) { 
  this.randomize=()=>{
    this.maxr=20+60*Math.random();
    //this.ka=(60+120*Math.random())*[-1,1][getRandomInt(0,2)];
    this.ka=(80+160*Math.random())*[-1,1][getRandomInt(0,2)];
    //this.alpha=TP*Math.random();
    this.alpha=TP/8-TP/4*Math.random();
    this.er=1+3*Math.pow(Math.random(),4);
    this.erk=(20+100*Math.random())*[-1,1][getRandomInt(0,2)];
  }
  this.randomize();
  this.getPath=()=>{
    let p=new Path2D();
    //p.arc(this.x,this.y,Math.max(1,this.r-1),0,TP);
    let rr=Math.max(0,this.r);
    p.ellipse(this.x,this.y,rr,rr/this.er,t/this.erk,0,TP);
    return p;
  }
  this.extend=()=>{
    if (this.cc) {
      let ccz=this.alpha+t/this.ka;
      let cx=Math.min((CSIZE-this.r),this.x+this.r*Math.cos(ccz));
      let cy=Math.min((CSIZE-this.r),this.y+this.r*Math.sin(ccz));
      let d=Math.pow(cx*cx+cy*cy,0.5);
      //let cr=Math.min(this.maxr*(2*d)/CSIZE,this.maxr,CSIZE-Math.abs(cx),CSIZE-Math.abs(cy));
let cr=Math.min(d,this.maxr,CSIZE-Math.abs(cx)-this.r,CSIZE-Math.abs(cy)-this.r);
      this.cc.x=this.x+(this.r+cr/2)*Math.cos(this.alpha+t/this.ka);
      this.cc.y=this.y+(this.r+cr/2)*Math.sin(this.alpha+t/this.ka);
      this.cc.r=cr/2;
      this.cc.extend();
    }
  }
  this.move=()=>{
    let z=TP*t/KT;
    this.x=(CSIZE-this.maxr-40)*(Math.cos(k1+z)+Math.cos(k1+3*z))/2;
    this.y=(CSIZE-this.maxr-40)*(Math.sin(k1+z)-Math.sin(k1+3*z))/2;
    let d=Math.pow(this.x*this.x+this.y*this.y,0.5);
    //this.r=Math.min(Math.abs(this.x),Math.abs(this.y),CSIZE-Math.abs(this.x),CSIZE-Math.abs(this.y),maxr); 
    //this.r=Math.min(d,CSIZE-d,maxr);
    //this.r=Math.min(this.maxr*(2*d)/CSIZE,this.maxr);
    //this.r=Math.min(this.maxr*(2*d)/CSIZE,this.maxr,CSIZE-Math.abs(this.x),CSIZE-Math.abs(this.y));
//let rf=(1-Math.cos(d*TP/CSIZE/2))/2;
    //this.r=Math.min(this.maxr*rf,this.maxr,CSIZE-Math.abs(this.x),CSIZE-Math.abs(this.y));
this.r=Math.min(d,this.maxr,CSIZE-Math.abs(this.x),CSIZE-Math.abs(this.y));
    this.extend();
  }
}

const DMX=new DOMMatrix([-1,0,0,1,0,0]);
const DMY=new DOMMatrix([1,0,0,-1,0,0]);

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
var KTD=KT/8;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  ca[0].move();
  draw();
  if (t>KTD-100)   ctx.canvas.style.opacity=(KTD-t)/100;
  if (t%KTD==0) {
    ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    colors.forEach((c)=>{ c.randomize(); });
    ca.forEach((circ)=>{ circ.randomize(); });
    ctx.canvas.style.opacity=1;
    t=0;
//report();
  }
if (EM && t%400==0) stopped=true;
  requestAnimationFrame(animate);
}

var ca=[new Circle(TP/4)];

for (let i=0; i<5; i++) {
  ca[ca.length-1].cc=new Circle(0);
  ca.push(ca[ca.length-1].cc);
}
ca[0].move();

const getHexPath=(spath)=>{
  const dm1=new DOMMatrix([0.5,0.866,-0.866,0.50,0,0]);
  const dm2=new DOMMatrix([-0.5,0.866,-0.866,-0.50,0,0]);
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  let p=new Path2D(spath);
  p.addPath(p,dmy);
  p.addPath(p,dmx);
  let hpath=new Path2D(p);
  hpath.addPath(p,dm1);
  hpath.addPath(p,dm2);
  return hpath;
}

var draw=()=>{
  let pa=[new Path2D(),new Path2D()];
  ctx.setTransform(1,0,0,1,CSIZE-2,CSIZE+2);
  ctx.lineWidth=8;
  for (let i=0; i<ca.length; i++) {
    let p=getHexPath(ca[i].getPath());
/*
    let p=ca[i].getPath();
    p.addPath(p,DMX);
    p.addPath(p,DMY);
p.addPath(p,new DOMMatrix([0,1,-1,0,0,0]));
*/
    pa[i%colors.length].addPath(p);
    //ctx.strokeStyle="rgba(0,0,0,"+(0.1-0.08*(ca[i].maxr-ca[0].r)/ca[i].maxr)+")";
ctx.strokeStyle="rgba(0,0,0,"+(0.08-0.06*(ca[i].maxr-ca[0].r)/ca[i].maxr)+")";
//ctx.strokeStyle="rgba(0,0,0,"+(0.12-0.1*(maxr-ca[0].r)/maxr)+")";
    ctx.stroke(p);
  }
  ctx.lineWidth=3;
  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
    ctx.strokeStyle=colors[0].getRGB();
    ctx.stroke(pa[1]);
    ctx.strokeStyle=colors[1].getRGB();
    ctx.stroke(pa[0]);
/*
  for (let i=0; i<colors.length; i++) {
    ctx.strokeStyle=colors[i].getRGB();
    ctx.stroke(pa[i]);
  }
*/
}

onresize();

start();

//// full screen, no?, selected trochoids, speed-length matching problems?, 1,3,then 5
// start 0 radius
//// 2nd brush
//// hex 0 r, ?+/-TP/12, no, ... 4x symmetry, flip x,y
// 0 r at 0, 0 r at CSIZE radius
//// matching endpoints
// ellipses?

// one trochoid, generic coverage, randomization vi Circle.extend
// no endpoints, drawing point generally lost under paint after KT/2
// no 2nd brush needed, screen fills quickly (and with enough colors)

var report=()=>{
  let info=[];
  for (let i=0; i<ca.length; i++) {
    info.push({
      "maxr":Math.round(ca[i].maxr),
      "ka":Math.round(ca[i].ka),
      "er":ca[i].er.toFixed(2),
      "erk":Math.round(ca[i].erk),
      "alpha":ca[i].alpha.toFixed(1),
    });
  }
  console.table(info);
}
