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
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

function CV() {
  this.k1=TP*Math.random();
  this.k2=1200+400*Math.random();
  this.k3=TP*Math.random();
  this.k4=500+200*Math.random();
  this.d=new Array();
  this.move=()=>{
    //this.a=Math.PI*(1+Math.sin(this.k1+t/this.k2));
    this.a=TP*Math.sin(this.k1+t/this.k2);
    this.l=40+(CSIZE-120)*(1+Math.sin(this.k3+t/this.k4))/2;
    this.x=this.l*Math.cos(this.a);
    this.y=this.l*Math.sin(this.a);
  }
}

/*
function DL() {
  this.x1;
  this.y1;
  this.x2;
  this.y2;
  this.d;
}
*/

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

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  transit();
  draw();
  requestAnimationFrame(animate);
}

onresize();

var fibo=(f,n)=>{
  if (n==0) return f;
  return fibo(f+=n,n-1);
}

var ca=[];
for (let i=0; i<3; i++) ca.push(new CV());

const CT=fibo(0,12*1-1);
var da=[];
//for (let i=0; i<CT; i++) da.push(new DL());
for (let i=0; i<CT; i++) da.push({});


var pa=[];
var transit=()=>{
  pa=[];
  for (let i=0; i<ca.length; i++) {
    ca[i].move();
    pa.push({"x":ca[i].x,"y":ca[i].y});
    pa.push({"x":-ca[i].x,"y":ca[i].y});
    pa.push({"x":-ca[i].x,"y":-ca[i].y});
    pa.push({"x":ca[i].x,"y":-ca[i].y});
  }
  for (let i=0,idx=0; i<pa.length; i++) {
    for (let j=i+1; j<pa.length; j++,idx++) {
      let d=Math.pow((pa[i].x-pa[j].x)*(pa[i].x-pa[j].x)+(pa[i].y-pa[j].y)*(pa[i].y-pa[j].y),0.5);
      da[idx].x1=pa[i].x;
      da[idx].y1=pa[i].y;
      da[idx].x2=pa[j].x;
      da[idx].y2=pa[j].y;
      da[idx].d=d;
    }
  }
  da.sort((a,b)=>{ return a.d-b.d; });
  K=60+120*Math.pow(Math.sin(t/190),2);
  S=0.3+Math.pow(Math.sin(t/400),2);
}

/*
ctx.strokeStyle="yellow";
ctx.fillStyle="red";
ctx.lineWidth=2;
*/

var K=60+120*Math.pow(Math.cos(t/190),2);
var R=80;
var S=0.3+Math.pow(Math.sin(t/400),2);
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<da.length; i++) {
//    let p=new Path2D();
    ctx.beginPath();
    let r=Math.max(4,R-S*da[i].d);
    let a=TP/4+Math.atan2(da[i].y2-da[i].y1,da[i].x2-da[i].x1);
    let f=Math.pow(da[i].d/K+1,2);
    ctx.arc(da[i].x1,da[i].y1,r,a,Math.PI+a);
    ctx.ellipse(da[i].x1,da[i].y1,r,f*r,Math.PI+a,0,TP/2);
//    ctx.stroke();
//    ctx.fill();
//    ctx.beginPath();
//    ctx.moveTo(da[i].x2,da[i].y2+r);
    ctx.arc(da[i].x2,da[i].y2,r,Math.PI+a,a);
//    ctx.ellipse(da[i].x2,da[i].y2,r,f*r,a,0,TP/2);
    ctx.ellipse(da[i].x2,da[i].y2,r,f*r,a,0,TP/2);
let l=Math.min(60,da[i].d/6);
ctx.fillStyle="hsla("+(da[i].d)+",98%,"+l+"%)";
//ctx.fillStyle="hsl("+(1*da[i].d)+",98%,60%)";
    ctx.fill();
  }
//for (let i=0; i<pa.length; i++) drawPoint(pa[i].x,pa[i].y);
}

transit(true);

start();
