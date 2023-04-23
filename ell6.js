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
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=3;

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

var colors=new Array(4);
var hues=[];
let hue=getRandomInt(0,90,true)+30;
for (let i=0; i<colors.length; i++) {
  let hd=Math.round(360/colors.length)*i+getRandomInt(-20,20);
//    let sat=90+getRandomInt(0,11);
  //c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,56%)");
  hues.splice(getRandomInt(0,hues.length+1),0,(hue+hd)%360);
}
for (let i=0; i<colors.length; i++) colors[i]="hsl("+hues[i]+",96%,56%)";

const DEPTH=5;	// odd-numbered is symmetric

function Circle(depth) {
  if (depth<DEPTH+1) this.shape=new Shape(this,depth+1);
  this.draw=(x,y,r)=>{
    if (depth>0) {
      ctx.beginPath();
      ctx.arc(x,y,r,0,TP);
      ctx.fillStyle=colors[depth%colors.length];
      ctx.fill();
      ctx.stroke();
    }
    if (this.shape) this.shape.draw(x,y,r);
  }
}

function Shape(p,depth) {
  this.rk1=TP*Math.random();
  this.rk2=400+400*Math.random();
  this.ak1=TP*Math.random();
  this.ak2=(800+800*Math.random())/depth;
  this.rk=0.1+0.8*Math.random();
  this.circle1=new Circle(depth+1);
  this.circle2=new Circle(depth+1);
  if (depth<DEPTH) {
    this.circle=new Circle(depth+2);
  }
  this.draw=(x,y,r)=>{
    let r2=r*(0.1+0.5*Math.pow(Math.sin(this.rk1+t/this.rk2),2));
    ctx.beginPath();
    let a=TP*Math.sin(this.ak1+t/this.ak2);
    ctx.ellipse(x,y,r,r2,a,0,TP);
    ctx.fillStyle=colors[depth%colors.length];
    ctx.fill();
    ctx.stroke();
    if (this.circle) this.circle.draw(x,y,r2);
    if (this.circle1) {
      let dp=new DOMPoint(0,r2+(r-r2)/2);
      let dm=new DOMMatrix([Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),x,y]);
      let dp1=dp.matrixTransform(dm);
      let rp=(r-r2)/2;
      this.circle1.draw(dp1.x,dp1.y,rp);
      let ao=a+Math.PI;
      dm=new DOMMatrix([Math.cos(ao),Math.sin(ao),-Math.sin(ao),Math.cos(ao),x,y]);
      let dp2=dp.matrixTransform(dm);
      this.circle2.draw(dp2.x,dp2.y,rp);
    }
  }
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  c.draw(0,0,CSIZE);
}

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
var t=0;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t%50==0) {
    for (let i=0; i<hues.length; i++) {
      hues[i]=++hues[i]%360;
      colors[i]="hsl("+hues[i]+",96%,56%)";
    }
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();

const c=new Circle(0);

start();
