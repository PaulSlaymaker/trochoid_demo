"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/gORdyyN
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.border="8px gray outset";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var chue=getRandomInt(0,360);
var getHSLString=(f)=>{
  let hue=(chue+getRandomInt(0,90))%360;
  let sat=60+35*Math.random();
  let lum=40+f*40;
  return "hsl("+hue+","+sat+"%,"+lum+"%)";
}

const DUR=24000;
var Growth=function(df) {
  this.time=-getRandomInt(0,DUR);
  this.randomize=()=>{
    // constrain X,Y within ellipse, offset up 100
    let a=TP*Math.random();
    this.X=Math.round(320*Math.pow(Math.random(),0.5)*Math.cos(a));
    let ry=250*Math.pow(Math.random(),0.5);
    this.Y=Math.round(-100+ry*Math.sin(a));	// up 160 for 240?
    this.Xpf=Math.random();
    this.Ypf=Math.random();
    //this.sColor=new Color(df).getHSLString();
    //this.fColor=new Color(df).getHSLString();
    this.sColor=getHSLString(df);
    this.fColor=getHSLString(df);
    this.kinex=getRandomInt(1,8)*[-1,1][getRandomInt(0,2)];
    this.kiney=getRandomInt(1,8)*[-1,1][getRandomInt(0,2)];
    this.duration=DUR-Math.round(Math.random()*4000);
  }
  this.randomize();
  this.grow=(ts)=>{
    if (!this.time) this.time=ts;
    let progress=ts-this.time;
    if (progress<this.duration) {
      this.frac=progress/this.duration;
      this.draw();
    } else {
      this.draw();
      this.time=0;
      this.randomize();
    }
  }
  this.getPoint=()=>{
    let z=-TP*this.frac;
    if (this.X<0) z=-z;
    let xc=this.X+64*Math.cos(this.kinex*z);
    let yc=this.Y+64*Math.sin(this.kiney*z);
    let f=Math.pow(Math.sin(this.frac*TP/2),3);	// 0->1->0
    let x=f*xc;
    let y=(1-f)*200+f*yc;
    let xpf=f*x*this.Xpf;
    let ypf=(1-f)*200+f*(y-(CSIZE-this.Y)/2*this.Ypf);
    return {"x":x,"y":y,"xpf":xpf,"ypf":ypf,"f":f};
  }
  this.draw=()=>{
    let pt=this.getPoint();
    ctx.beginPath();
    ctx.moveTo(0,CSIZE);
    ctx.bezierCurveTo(0,200, pt.xpf,pt.ypf, pt.x,pt.y);
    ctx.lineWidth=1+pt.f*3;
//ctx.shadowBlur=0;
    ctx.strokeStyle=this.sColor;
    ctx.stroke();
    let fruit=new Path2D();
    let w=2+pt.f*16;
    fruit.moveTo(pt.x+w,pt.y);
    fruit.arc(pt.x,pt.y,w,0,TP);
    ctx.strokeStyle="gray";
    ctx.lineWidth=1;
//ctx.shadowBlur=40;
    ctx.stroke(fruit);
    ctx.fillStyle=this.fColor;
    ctx.fill(fruit);
  }
}

var growth=(()=>{
  let n=[];
  for (let i=0; i<30; i++) n.push(new Growth(i/30));
  return n;
})();

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    growth.forEach((g)=>{ 
      if (g.frac>0) g.time=performance.now()-g.frac*g.duration;
    });
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!t) t=ts;
  if (ts-t>DUR) {
    chue=getRandomInt(0,360);
    t=0;
  }
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<growth.length; i++) {
    growth[i].grow(ts);
  }
  requestAnimationFrame(animate);
}

onresize();
start();
