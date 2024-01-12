"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/details/abMzyVJ
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
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
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*(this.fr*Math.cos(this.RK2+t/this.RK1)+(1-this.fr)*Math.cos(t/this.RK3)));
    let grn=Math.round(CBASE+CT*(this.fg*Math.cos(this.GK2+t/this.GK1)+(1-this.fg)*Math.cos(t/this.GK3)));
    let blu=Math.round(CBASE+CT*(this.fb*Math.cos(this.BK2+t/this.BK1)+(1-this.fb)*Math.cos(t/this.BK3)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomizeF=()=>{
    this.RK3=1+5*Math.random();
    this.GK3=1+5*Math.random();
    this.BK3=1+5*Math.random();
    this.fr=1-Math.pow(Math.random(),6);
    this.fg=1-Math.pow(Math.random(),6);
    this.fb=1-Math.pow(Math.random(),6);
  }
  this.randomize=()=>{
    this.RK1=50+50*Math.random();
    this.GK1=50+50*Math.random();
    this.BK1=50+50*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.randomizeF();
  }
  this.randomize();
}

function Quad(x,y,r) {
  this.x=x;
  this.y=y;
  this.r=r;
  this.t=getRandomInt(-100,0);
  this.move=()=>{
    this.t+=1;
    if (this.t>=this.r) this.t=getRandomInt(-400,0);
  }
  this.getPath=(d)=>{
    let p=new Path2D();
    if (this.t>0) {
      p.moveTo(this.x-this.t-d,this.y-this.t-d);
      p.lineTo(this.x+this.t+d,this.y-this.t-d);
      p.lineTo(this.x+this.t+d,this.y+this.t+d);
      p.lineTo(this.x-this.t-d,this.y+this.t+d);
      p.closePath();
    }
    return p;
  }
}

var color=new Color();

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
var t=200;
var frac=0;
var dur=1200;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t%4==0) for (let i=0; i<qa.length; i++) qa[i].move();
  if (t%800==0) color.randomizeF();
  draw();
  requestAnimationFrame(animate);
}

var qa=[];
for (let i=0; i<4; i++) {
  for (let j=0; j<4; j++) {
    qa.push(new Quad(50+100*i,50+100*j,50));
  }
}

const DMX=new DOMMatrix([-1,0,0,1,0,0]);
const DMY=new DOMMatrix([1,0,0,-1,0,0]);

var draw=()=>{
  let p=new Path2D();
  let pd=new Path2D();
  for (let i=0; i<qa.length; i++) {
    p.addPath(qa[i].getPath(0));
    pd.addPath(qa[i].getPath(1));
  }
  pd.addPath(pd,DMX);
  pd.addPath(pd,DMY);
  ctx.globalCompositeOperation="destination-out";
  ctx.strokeStyle="#000000FF";
  ctx.stroke(pd);
  p.addPath(p,DMX);
  p.addPath(p,DMY);
  ctx.globalCompositeOperation="destination-over";
  ctx.strokeStyle=color.getRGB();
  ctx.stroke(p);
}

onresize();

start();
