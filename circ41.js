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
    this.RK3=1+5*Math.random();
    this.GK3=1+5*Math.random();
    this.BK3=1+5*Math.random();
    this.fr=1-Math.pow(0.9*Math.random(),4);
    this.fg=1-Math.pow(0.9*Math.random(),4);
    this.fb=1-Math.pow(0.9*Math.random(),4);
  }
  this.randomize=()=>{
    this.RK1=40+40*Math.random();
    this.GK1=40+40*Math.random();
    this.BK1=40+40*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.randomizeF();
  }
  this.randomize();
}

var color=new Color();

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
//if (EM && t%400==0) stopped=true;
  draw();
//if (t==KT/5-101) stopped=true;
if (t>KTD-100)   ctx.canvas.style.opacity=(KTD-t)/100;
if (t>KTD) {
  randomizeCircles();
  color.randomize();
  D=8*Math.random();
  D2=8*Math.random();

  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.canvas.style.opacity=1;
/*
if (ctxa==ctx) {
//  ctx2.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.canvas.parentElement.appendChild(ctx2.canvas)
  ctxa=ctx2;
} else {
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.canvas.parentElement.appendChild(ctx.canvas)
  ctxa=ctx;
}
*/
  t=0;
//for (let i=0; i<pts.length; i++) { ctx.fillRect(pts[i].x-4,pts[i].y-4,8,8); }
}
  requestAnimationFrame(animate);
}

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

var Circle=function() { 
  this.randomize=()=>{
    let z=TP*Math.random();
    let r=CSIZE*Math.random();
    this.x=r*Math.cos(z);
    this.y=r*Math.sin(z);
    this.ka=TP*Math.random();		// vary
    this.et=(100+200*Math.random())*[-1,1][getRandomInt(0,2)];
    this.erk=1+2*Math.random();		// vary
  }
  this.randomize();
}
var ca=[new Circle()];

var pts=[];
var count=getRandomInt(2,8);
//console.log("count "+count);

var randomizeCircles=()=>{
  ca=[];
  count=getRandomInt(2,8);
console.log("count "+count);
  for (let i=0; i<count; i++) {
    let z=TP*Math.random();
    let r=CSIZE*Math.random();
    let x=r*Math.cos(z);
    let y=r*Math.sin(z);
    //pts.push({"x":0.707*CSIZE*(1-2*Math.random()),"y":0.707*CSIZE*(1-2*Math.random())});
//    pts.push({"x":x,"y":y});
    ca.push(new Circle());
    //pts.push({"x":0,"y":0});
  }
}
randomizeCircles();

const KT=4000; 
const KTD=KT/5; 

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);

ctx.fillStyle="#00000044";
let D=8*Math.random();
let D2=8*Math.random();

var draw=()=>{
  //let pa=[new Path2D(),new Path2D()];
  let p=new Path2D();
  let r=CSIZE*(Math.sin(TP*t/KT));
  for (let i=0; i<ca.length; i++) {
    p.moveTo(ca[i].x+r*Math.cos(ca[i].ka+t/ca[i].et),ca[i].y+r*Math.sin(ca[i].ka+t/ca[i].et));
    //p.arc(pts[i].x,pts[i].y,r,0,TP);
    p.ellipse(ca[i].x,ca[i].y,r,r/ca[i].erk,ca[i].ka+t/ca[i].et,0,TP);
  }
  ctx.setLineDash([D*r,D2*r]);

//  p.addPath(p,dmx);
//  p.addPath(p,dmy);
  let p2=getHexPath(p);
//for (let i=0; i<pa.length; i++) {

  ctx.setTransform(1,0,0,1,CSIZE-1,CSIZE+1);
//ctx.lineWidth=8;
  ctx.lineWidth=Math.min(r,8);
// only inner circle?  
  ctx.strokeStyle="#00000014";
  ctx.stroke(p2);

  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  ctx.lineWidth=Math.min(r,2);
  ctx.strokeStyle=color.getRGB();
  ctx.stroke(p2);
//}

}

onresize();

start();

//ctx.fillStyle = "rgba(0,0,0,1)"; // (Drawing with 0 alpha pretty much means doing nothing)
//ctx.globalCompositeOperation = "destination-out";

