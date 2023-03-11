"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/YzOZeYP
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

function CV() {
  this.xk=TP*Math.random();
  this.yk=TP*Math.random();
  this.y2k=TP*Math.random();
  this.tkx=200+20*Math.random();
  this.tky=200+20*Math.random();
  this.tky2=200+20*Math.random();
  let dl=8+30*Math.random();
  this.dk=TP*Math.random();
  this.tdk=200+20*Math.random();
  this.dash=[dl,dl];
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
  if (t%20==0) {
    for (let i=0; i<colors.length; i++) {
      hues[i]=++hues[i]%360;
      colors[i]="hsl("+hues[i]+",98%,60%)";
    }
  }
  ctx.lineDashOffset=t/20;
  transit();
  draw();
  requestAnimationFrame(animate);
}

var ca=new Array();
for (let i=0; i<3; i++) ca.push(new CV());

var transit=()=>{
  for (let i=0; i<ca.length; i++) {
    xa[i]=20+CSIZE*(1+Math.sin(ca[i].xk+t/ca[i].tkx))/2;
    ya[i]=20+CSIZE*(1+Math.sin(ca[i].yk+t/ca[i].tky))/2;
    y2a[i]=20+CSIZE*(1+Math.sin(ca[i].y2k+t/ca[i].tky2))/2;
    let dl=10+16*(1+Math.sin(ca[i].dk+t/ca[i].tdk));
    ca[i].dash=[dl,dl];
  }
  xa.sort((a,b)=>{ return b-a; });
  ya.sort((a,b)=>{ return b-a; });
  y2a.sort((a,b)=>{ return b-a; });
}

onresize();

var xa=new Array();
let ya=new Array();
let y2a=new Array();

ctx.strokeStyle="#00000080";
ctx.lineWidth=2;
var draw=()=>{
  for (let i=0; i<xa.length; i++) {
    let path=new Path2D();
    path.moveTo(0,0);
    path.bezierCurveTo(0,-ya[i],0,-ya[i],xa[i]/2,-ya[i]/2);
    path.bezierCurveTo(xa[i],0,xa[i],0,xa[i]/2,y2a[i]/2);
    path.bezierCurveTo(0,y2a[i],0,y2a[i],0,0);
    path.addPath(path, new DOMMatrix([-1,0,0,1,0,0]));
//    path.addPath(path, new DOMMatrix([1,0,0,-1,0,0]));
//if (i%2==0)
//    ctx.fillStyle=colors[i%colors.length];
//else ctx.fillStyle="#00000060";
//    ctx.fill(path);
    ctx.setLineDash(ca[i].dash);
    ctx.lineWidth=10;
    ctx.strokeStyle="#00000030";
    ctx.stroke(path);
    ctx.setLineDash([]);
    ctx.lineWidth=2;
    ctx.strokeStyle=colors[i%colors.length];
    ctx.stroke(path);
/*
    if (i<xa.length-1) {
      let path2=new Path2D();
//      let r=Math.pow((xa[i]-xa[i+1])*(xa[i]-xa[i+1])+(ya[i]-ya[i+1])*(ya[i]-ya[i+1]),0.5);
      path2.moveTo(xa[i]/2,ya[i]/2);
      path2.lineTo(xa[i+1]/2,ya[i+1]/2);
      ctx.stroke(path2);
    }
*/
  }
}

transit();
start();
