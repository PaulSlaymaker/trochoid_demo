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
    this.fr=1-Math.pow(0.9*Math.random(),7);
    this.fg=1-Math.pow(0.9*Math.random(),7);
    this.fb=1-Math.pow(0.9*Math.random(),7);
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
var maxr=40;

var Circle=function(k1,k2,k3,k4) { 
  //this.ka=(100+200*Math.random())*[-1,1][getRandomInt(0,2)];
  this.ka=(60+120*Math.random())*[-1,1][getRandomInt(0,2)];
  this.alpha=TP*Math.random();
  this.getPath=()=>{
    let p=new Path2D();
    p.arc(this.x,this.y,Math.max(1,this.r-1),0,TP);
    return p;
  }
  this.extend=()=>{
    if (this.cc) {
      let cx=this.x+this.r*Math.cos(this.alpha+t/this.ka);
      let cy=this.y+this.r*Math.sin(this.alpha+t/this.ka);
      let cr=Math.min(cx,cy,CSIZE-cx,CSIZE-cy,maxr);
      this.cc.x=this.x+(this.r+cr/2)*Math.cos(this.alpha+t/this.ka);
      this.cc.y=this.y+(this.r+cr/2)*Math.sin(this.alpha+t/this.ka);
      this.cc.r=cr/2;
      this.cc.extend();
    }
  }
  this.move=()=>{
    this.x=CSIZE*(1-Math.cos(k1+t/k2))/2;
    this.y=CSIZE*(1-Math.sin(k3+t/k4))/2;
//    this.x=CSIZE*(1-0.99*Math.cos(k1+t/k2)+0.01*Math.cos(t/10))/2;
//    this.y=CSIZE*(1-0.99*Math.sin(k3+t/k4)+0.01*Math.cos(t/15))/2;
    this.r=Math.min(this.x,this.y,CSIZE-this.x,CSIZE-this.y,maxr);
//this.r=this.r*(1.5-0.5*Math.cos(t/20))/2;
    this.extend();
  }
}

const DMX=new DOMMatrix([-1,0,0,1,0,0]);
const DMY=new DOMMatrix([1,0,0,-1,0,0]);

var drawPoint=(x,y,col,rad)=>{	// diag
  ctx.beginPath();
  if (rad) ctx.arc(x,y,rad,0,TP);
  else ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
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
var animate=(ts)=>{
  if (stopped) return;
  t++;
  ca[0].move();
  if (ca[0].r<0.00001) {
    colors.forEach((c)=>{ c.randomizeF(); });
    maxr=20+40*Math.random();
//console.log(maxr.toFixed(0));
    ca.forEach((c)=>{ 
      c.ka=(20+maxr+120*Math.random())*[-1,1][getRandomInt(0,2)];
//      c.ka=(60+120*Math.random())*[-1,1][getRandomInt(0,2)];
      c.alpha=TP*Math.random();
    });
  }
  draw();
if (EM && t%400==0) stopped=true;
  requestAnimationFrame(animate);
}

onresize();

//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
let k1=TP*Math.random()/10;
let k2=280+320*Math.random();
let k3=TP*Math.random()/10;
let k4=280+320*Math.random();
//console.log(k2.toFixed(0),k4.toFixed(0));
var ca=[new Circle(k1,k2,k3,k4)];

for (let i=0; i<3; i++) {
  ca[ca.length-1].cc=new Circle();
  ca.push(ca[ca.length-1].cc);
}
ca[0].move();

var draw=()=>{
  let pa=[new Path2D(),new Path2D()];
  ctx.setTransform(1,0,0,1,CSIZE-1,CSIZE+1);
  ctx.lineWidth=8;
  for (let i=0; i<ca.length; i++) {
    let p=ca[i].getPath();
    p.addPath(p,DMX);
    p.addPath(p,DMY);
    pa[i%colors.length].addPath(p);
    ctx.strokeStyle="rgba(0,0,0,"+(0.1-0.08*(maxr-ca[0].r)/maxr)+")";
//ctx.strokeStyle="rgba(0,0,0,"+(0.12-0.1*(maxr-ca[0].r)/maxr)+")";
    ctx.stroke(p);
  }
  ctx.lineWidth=3;
  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  for (let i=0; i<colors.length; i++) {
    ctx.strokeStyle=colors[i].getRGB();
    ctx.stroke(pa[i]);
  }
}

start();

