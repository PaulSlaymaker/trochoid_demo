"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;

const container=document.createElement("div");
container.style.margin="auto";
body.append(container);
for (let i=0; i<4; i++) {
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  c.ctx=c.getContext("2d");
  c.ctx.translate(CSIZE,CSIZE);
  c.ctx.lineCap="round";
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
  const CBASE=160;
  const CT=255-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=40+40*Math.random();
    this.GK1=40+40*Math.random();
    this.BK1=40+40*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();

var cycle=()=>{
  let canv1=container.removeChild(container.firstChild);
  canv1.ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  canv1.style.opacity=1;
  container.append(canv1);
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

var DUR=200;
var t=0;
var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++,c++;
  draw();
  container.firstChild.style.opacity=1-c/DUR;
  if (c%DUR==0) {
if (EM) stopped=true;
    c=0;
    cycle();
  }
  requestAnimationFrame(animate);
}

// 0-1-0 r,   other zeros: dist all, dash 0
// couple constants, i.e. to idx

function Dist(v) {
  this.val=0;
  this.KA=(100+100*Math.random())*[-1,1][getRandomInt(0,2)];
  //this.KA=200+50*v;
  //this.KB=0; //TP*v/30; //TP*Math.random();
  this.KB=TP*Math.random();
  this.setLocation=()=>{
    return this.val=CSIZE/2+CSIZE/2*Math.sin(this.KB+t/this.KA);
  }
  this.setLocation();
}

var getPath1=(x1,y1,x2,y2)=>{	// 4-stroke can be in 2 directions
  let p=new Path2D();
  let mx=x1/2+x2/2;
  let my=y1/2+y2/2;
  let rx=(x2-x1)/2;
  let ry=(y2-y1)/2;
  p.moveTo(mx,y2);
  p.ellipse(mx,my,rx,ry,0,TP/4,TP/2);
  p.moveTo(mx,y2);
  p.ellipse(mx,my,rx,ry,0,TP/4,0,true);
  p.moveTo(mx,y1);
  p.ellipse(mx,my,rx,ry,0,3*TP/4,TP/2,true);
  p.moveTo(mx,y1);
  p.ellipse(mx,my,rx,ry,0,3*TP/4,0);
  return p;
}

var getPath2=(x1,y1,x2,y2)=>{
  let p=new Path2D();
  let mx=x1/2+x2/2;
  let my=y1/2+y2/2;
  let rx=(x2-x1)/2;
  let ry=(y2-y1)/2;
  p.moveTo(x2,my);
  p.ellipse(mx,my,rx,ry/2,0,0,TP/4);
  p.moveTo(x2,y1/2+y2/2);
  p.ellipse(mx,my,rx,ry,0,0,3*TP/4,true);
  p.moveTo(x1,y1/2+y2/2);
  p.ellipse(mx,my,rx,ry,0,TP/2,TP/4,true);
  p.moveTo(x1,my);
  p.ellipse(mx,my,rx,ry,0,TP/2,3*TP/4);
  return p;
}

let gp=[getPath1,getPath2][getRandomInt(0,2)];

var distxa=new Array();
for (let i=0; i<3; i++) distxa.push(new Dist(i));
var distya=new Array();
for (let i=0; i<3; i++) distya.push(new Dist(i));

var draw=()=>{
  let xa=new Array();
  for (let i=0; i<distxa.length; i++) {
//    distxa[i].setLocation();
//    xa.push(distxa[i].val);
    xa.push(distxa[i].setLocation());
  }
  xa.sort((a,b)=>{ return a-b; });
  xa.unshift(0);
  xa.push(CSIZE);
  let ya=new Array();
  for (let i=0; i<distya.length; i++) {
    distya[i].setLocation();
    ya.push(distya[i].val);
  }
  ya.sort((a,b)=>{ return a-b; });
  ya.unshift(0);
  ya.push(CSIZE);
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let pth=new Path2D();
  for (let i=0; i<xa.length-1; i++) { 
    for (let j=0; j<ya.length-1; j++) { 
      pth.addPath(gp(xa[i],ya[j],xa[i+1],ya[j+1]));
    }
  }
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  pth.addPath(pth,dmx);
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  pth.addPath(pth,dmy);

  let ctt=container.lastChild.ctx;
  let dash1=6*(1-Math.cos(TP*c/DUR));
  let dash2=100+100*(1-Math.cos(t/200));
  ctt.setLineDash([dash1,dash2]);
//  ctx.stroke(pth);
  ctt.strokeStyle=color.getRGB();
  ctt.lineWidth=2;
  ctt.stroke(pth);
  ctt.strokeStyle="#00000010";
  ctt.lineWidth=8;
  ctt.stroke(pth);
}

onresize();

start();

