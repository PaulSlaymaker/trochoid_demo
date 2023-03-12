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
ctx.rotate(TP/4);

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

var colors=[];
var hues=[];
var setColors=()=>{
  colors=[];
  let colorCount=4;
  let h=getRandomInt(180,300);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(150/colorCount)*i+getRandomInt(-10,10);
    let hue=(h+hd)%360;
    colors.push("hsl("+hue+",98%,60%)");
    hues.push(hue);
  }
}
setColors();
colors[1]="white";
colors[2]="green";

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

function CVO() {
  this.k1=TP*Math.random();
  this.k2=600+100*Math.random();
  this.k3=TP*Math.random();
  this.k4=600+100*Math.random();
  this.d=new Array();
  this.move=()=>{
    this.a=Math.PI*(1+Math.sin(this.k1+t/this.k2));
    //this.l=20+(CSIZE-40)*(1+Math.sin(this.k3+t/this.k4))/2;
    this.l=60+(CSIZE-120)*(1+Math.sin(this.k3+t/this.k4))/2;
    this.x=this.l*Math.cos(this.a);
    this.y=this.l*Math.sin(this.a);
  }
}

function DL() {
  this.x1;
  this.y1;
  this.x2;
  this.y2;
  this.d;
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

const CT=fibo(0,4*3-1);
var da=[];
for (let i=0; i<CT; i++) da.push(new DL());


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
}

var draw=()=>{
  for (let i=0; i<da.length; i++) {
    ctx.beginPath();
    //let r=Math.max(0,80-0.3*da[i].d);
    let r=Math.max(2,80-0.4*da[i].d);
//    if (r>0) {
      ctx.arc(da[i].x1,da[i].y1,r,0,TP);
      ctx.moveTo(da[i].x2+r,da[i].y1);
      ctx.arc(da[i].x2,da[i].y2,r,0,TP);
//ctx.fillStyle="hsl("+(1.5*da[i].d)+",98%,50%)";
//ctx.fillStyle="hsla("+(90+1.5*da[i].d)+",98%,50%,0.3)";
let l=Math.min(60,da[i].d/2);
//ctx.fillStyle="hsla("+(4*da[i].d)+",98%,50%,0.2)";
ctx.fillStyle="hsla("+(3*da[i].d)+",98%,"+l+"%,0.2)";
      ctx.fill();
//    }
  }
//for (let i=0; i<pa.length; i++) drawPoint(pa[i].x,pa[i].y);
}

transit(true);

start();
