"use strict"; // Paul Slaymaker, paul25882@gmail.com
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
//c.style.outline="1px dotted gray";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=144;
  const CT=255-CBASE;
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    //return "rgba("+red+","+grn+","+blu+",0.5)";
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=60+60*Math.random();
    this.GK1=60+60*Math.random();
    this.BK1=60+60*Math.random();
  }
  this.randomize();
//  this.set();
}

var color=new Color();

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,10,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

ctx.lineWidth=4;

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var t=0;
var animate=()=>{
  if (stopped) return;
  t++;
//  ctx.setLineDash([t,2000]);
//  ctx.lineDashOffset=-t+1000;

  draw(t,false);
  //draw(t,true);
//if (t%1000==0) stopped=true;
  requestAnimationFrame(animate);
}

var curves=[];

//const EDGE=;

onresize();

const K1=500+500*Math.random();
const K2=500+500*Math.random();
var K3=500+500*Math.random();
var K4=500+500*Math.random();
var KA=500+500*Math.random();

const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);

var draw=(t,bl)=>{
  let r=CSIZE*Math.pow(Math.sin(3*t/K1)/2+Math.sin(5*t/K2)/2,2);
  //let r2=CSIZE*Math.pow(Math.cos(t/400)/2+Math.sin(2*t/410)/2,2);
  //let r=CSIZE*Math.pow(Math.sin(TP*t/4000),2);
  //let r2=CSIZE*Math.pow(Math.cos(TP*t/1900),2);
  let r2=CSIZE*Math.pow(Math.cos(3*t/K3)/2+Math.cos(5*t/K4)/2,2);
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//ctx.globalAlpha=0.3*Math.max(0,Math.sin(t/10));
  //ctx.beginPath();
  let path=new Path2D();
  //ctx.arc(0,0,r,0,TP);
  //path.ellipse(0,r2/2,r,r2/2,0,0,TP);
  path.ellipse(0,0,r,r2,0,0,TP);
  let path2=new Path2D();
  path2.ellipse(r+(CSIZE-r)/2,0,(CSIZE-r)/2,r2,0,0,TP);
  //path2.ellipse(CSIZE,0,CSIZE-r,r2,0,0,TP);
  let path3=new Path2D();
  path3.ellipse(0,r2+(CSIZE-r2)/2,r,(CSIZE-r2)/2,0,0,TP);
  //path3.ellipse(0,CSIZE,r,CSIZE-r2,0,0,TP);
  let path4=new Path2D();
  path4.ellipse(r+(CSIZE-r)/2,r2+(CSIZE-r2)/2,(CSIZE-r)/2,(CSIZE-r2)/2,0,0,TP);
  //path4.ellipse(CSIZE,CSIZE,CSIZE-r,CSIZE-r2,0,0,TP);
  ctx.strokeStyle=color.getRGB();
  //ctx.globalAlpha=0.5*Math.pow(Math.cos(TP*t/2000),2);
ctx.globalAlpha=0.4*Math.pow(Math.cos(TP*t/KA),2);
/*
if (bl) {
  ctx.lineWidth=8;
  ctx.strokeStyle="#00000010";
  //ctx.strokeStyle="black";
} else {
  ctx.lineWidth=3;
}
*/
  ctx.strokeStyle=color.getRGB();
//  let pth=new Path2D(path);
//pth.addPath(path,new DOMMatrix([1,0,0,-1,0,0]));
//pth.addPath(pth,new DOMMatrix([0,1,-1,0,0,0]));
//pth.addPath(path,new DOMMatrix([0.5,0.866,-0.866,0.5,0,0]));
//pth.addPath(path,new DOMMatrix([-0.5,0.866,-0.866,-0.5,0,0]));
  ctx.stroke(path);
  path2.addPath(path2,dm1);
  ctx.stroke(path2);
  path3.addPath(path3,dm2);
  ctx.stroke(path3);
  path4.addPath(path4,dm1);
  path4.addPath(path4,dm2);
  ctx.stroke(path4);
}

start();
