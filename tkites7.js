"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/MWzWZwN
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
ctx.globalCompositOperation="lighter";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color(type) {
  const CBASE=127;
  const CT=255-CBASE;
  this.RK1=600+600*Math.random();
  this.GK1=600+600*Math.random();
  this.BK1=600+600*Math.random();
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.set=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    if (type) this.v="rgba("+red+","+grn+","+blu+",0.6)";
    else this.v="rgba("+red+","+grn+","+blu+",0.3)";
  }
  this.set();
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

var t=200;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  color.set();
  color2.set();
  color3.set();
  ctx.strokeStyle=color3.v;
  if (t<200) {
    ctx.canvas.style.opacity=t/200;
  } else if (t==200) {
    ctx.canvas.style.opacity=1;
  } else if (t>3200) {
    reset();
    t=0;
  } else if (t>3000) {
    ctx.canvas.style.opacity=1-(t-3000)/200;
  }
if (EM && t%50==0) stopped=true;
  draw();
  requestAnimationFrame(animate);
}

var diamond=new Path2D();
diamond.moveTo(0,-200);
diamond.lineTo(200,0);
diamond.lineTo(0,200);
diamond.lineTo(-200,0);
diamond.closePath();

var heart=new Path2D();
for (let i=0; i<200; i++) {
  let z=i*TP/200; 
  let x=140*Math.pow(Math.sin(z),3);
  let y=140*(-0.8125*Math.cos(z)+0.3125*Math.cos(2*z)+0.125*Math.cos(3*z)+0.0625*Math.cos(4*z));
  heart.lineTo(x,y);
}

var circle=new Path2D();
circle.arc(0,0,140,0,TP);

var star=new Path2D();
for (let i=0; i<200; i++) {
  let z=i*TP/200; 
  let x=140*Math.pow(Math.sin(z),3);
  let y=140*Math.pow(Math.cos(z),3);
  star.lineTo(x,y);
}
star.closePath();

var color,color2,color3;
var k1,k2,k3,k4,k5;
var kb1,kb2,kb3,kb4,kb5,kb6;
var path,count;

ctx.lineWidth=2;

var reset=()=>{
  if (Math.random()<0.3) {
    path=circle;
    count=4*getRandomInt(9,13);
  } else if (Math.random()<0.1) {
    path=heart;
    count=4*getRandomInt(2,6);
  } else if (Math.random()<0.1) {
    path=star;
    count=4*getRandomInt(7,11);
  } else {
    path=diamond;
    count=4*getRandomInt(7,11);
  }
  k1=TP*Math.random();
  k2=TP*Math.random();
  k3=TP*Math.random();
  k4=TP*Math.random();
  k5=TP*Math.random();
  kb1=(100+100*Math.random())*[1,-1][getRandomInt(0,2)];
  kb2=(100+100*Math.random())*[1,-1][getRandomInt(0,2)];
  kb3=(100+100*Math.random())*[1,-1][getRandomInt(0,2)];
  kb4=(100+100*Math.random())*[1,-1][getRandomInt(0,2)];
  kb5=(300+300*Math.random())*[1,-1][getRandomInt(0,2)];
  kb6=(300+300*Math.random())*[1,-1][getRandomInt(0,2)];
  color=new Color();
  color2=new Color();
  color3=new Color(true);
  ctx.strokeStyle=color3.v;
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let pc=new Path2D();
  let pa=[];
  for (let i=0; i<count; i++) {
    let z=i*TP/count;
    let p=new Path2D();
    p.addPath(path, new DOMMatrix([
      Math.sin(k1+z+t/kb1),
      Math.sin(k2+z+t/kb2),
      Math.sin(k3+z+t/kb3),
      Math.sin(k4+z+t/kb4),
      200*Math.cos(z+t/kb5),
      200*Math.sin(z+t/kb6)
    ]));
    pc.addPath(p);
    pa.push(p);
  }
  ctx.stroke(pc);
  ctx.fillStyle=color.v;
  for (let i=0; i<count-1; i+=2) ctx.fill(pa[i]);
  ctx.fillStyle=color2.v;
  for (let i=1; i<count; i+=2) ctx.fill(pa[i]);
}

onresize();

reset();

start();
