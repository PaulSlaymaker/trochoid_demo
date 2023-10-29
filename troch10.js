"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/gOqOmGG
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
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
ctx.globalAlpha=0.5;

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=144;
  const CT=255-CBASE;
  this.randomize=()=>{
    this.RK1=200+200*Math.random();
    this.GK1=200+200*Math.random();
    this.BK1=200+200*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
 this.randomize();
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
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
ctx.canvas.addEventListener("click", start, false);

var t=getRandomInt(0,4000);
var animate=(ts)=>{
  if (stopped) return;
  t++;
  draw();
if (EM && t%300==0) stopped=true;
  requestAnimationFrame(animate);
}

var color=new Color();

var drawPoint=(x,y,col,rad)=>{	// diag
  ctx.beginPath();
  if (rad) ctx.arc(x,y,rad,0,TP);
  else ctx.arc(x,y,8,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var K1a=[
 4000+4000*Math.random(),
 4000+4000*Math.random(),
 4000+4000*Math.random()
];
//K1a.sort((a,b)=>{ return b-a; });
var kxa=new Array(3);
const getNormalizedWave=()=>{
  let sum=0;
  for (let i=0; i<3; i++) {
    //kxa[i]=(1+Math.cos(TP*t/K1a[i]))/2;
    kxa[i]=(1+Math.cos(TP*t/K1a[i]))/2;
//kxa[i]=(1+Math.cos(Math.random()+TP*t/200))/2;
    sum+=kxa[i];
  }
//kxa.sort((a,b)=>{ return a-b; });
  for (let i=0; i<3; i++) {
    kxa[i]=kxa[i]/sum;
  }
}

getNormalizedWave();

var D=200;

var getRectArray=(er)=>{
  var rect1=new Path2D();
  var rect2=new Path2D();
  let d=Math.round(er*D*Math.cos(t/200));
  rect1.moveTo(-2,-d);
  rect1.lineTo(2,-d);
  rect1.lineTo(2,d);
  rect1.lineTo(-2,d);
  rect1.closePath();
  rect2.moveTo(-4,-d-4);
  rect2.lineTo(4,-d-4);
  rect2.lineTo(4,d+4);
  rect2.lineTo(-4,d+4);
  rect2.closePath();
  return [rect1,rect2];
}

const getHexPath=(spath)=>{
  const dm1=new DOMMatrix([0.5,0.866,-0.866,0.50,0,0]);
  const dm2=new DOMMatrix([-0.5,0.866,-0.866,-0.50,0,0]);
  const dm3=new DOMMatrix([-1,0,0,1,0,0]);
  let hpath=new Path2D(spath);
  hpath.addPath(spath,dm1);
  hpath.addPath(spath,dm2);
  hpath.addPath(hpath,dm3);
  hpath.addPath(hpath,new DOMMatrix([1,0,0,-1,0,0]));
  return hpath;
}

const draw=()=>{
  getNormalizedWave();
  let z=t*TP/8000;
  let x=(CSIZE-D)*(kxa[0]*Math.cos(3*z)+kxa[1]*Math.cos(5*z)+kxa[2]*Math.cos(7*z));
  let y=(CSIZE-D)*(kxa[0]*Math.sin(3*z)+kxa[1]*Math.sin(5*z)+kxa[2]*Math.sin(7*z));
  //let ap=TP+Math.sin(t/300);
  let ap=Math.atan2(
    -kxa[0]*Math.cos(z)-3*kxa[1]*Math.cos(5*z)-5*kxa[2]*Math.cos(7*z),
     kxa[0]*Math.sin(z)+3*kxa[1]*Math.sin(3*z)+5*kxa[2]*Math.sin(7*z));
  let dm=new DOMMatrix([Math.cos(ap),Math.sin(ap),-Math.sin(ap),Math.cos(ap),x,y]);
//let r=Math.pow(x*x+y*y,0.5);
//let er=Math.min(1,(CSIZE-r)/D);
//ctx.globalAlpha=er*Math.pow(Math.sin(t/200),2);
ctx.globalAlpha=Math.pow(Math.sin(t/200),2);
let ra=getRectArray(1);
  let pth=new Path2D();
  pth.addPath(ra[0],dm)
  let path=getHexPath(pth);
ctx.fillStyle=color.getRGB();
ctx.fill(path);

  let pth2=new Path2D();
  pth2.addPath(ra[1],dm)
  let path2=getHexPath(pth2);
ctx.fillStyle="#00000020";
ctx.fill(path2);
}

onresize();

start();
