"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/vYzWQqB
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
  if (t%20==0) {
    for (let i=0; i<colors.length; i++) {
      hues[i]=++hues[i]%360;
      colors[i]="hsl("+hues[i]+",98%,60%)";
    }
  }
if (EM && t%400==0) stopped=true;
  draw();
  requestAnimationFrame(animate);
}

onresize();

const EDGE=CSIZE-80;

var a1=TP*Math.random();
var l1=EDGE*Math.random();
var a2=(TP-a1)*Math.random();
var l2=EDGE*Math.random();
var a3=(TP-a1-a2)*Math.random();
var l3=EDGE*Math.random();

const k1=TP*Math.random();
const k2=TP*Math.random();
const k3=TP*Math.random();
const k4=400+300*Math.random();

var transit=()=>{
  a1=Math.PI*(1+Math.sin(k1+t/k4));
  a2=Math.PI*(1+Math.sin(k2+t/510));
  a3=Math.PI*(1+Math.sin(k3+t/420));
  l1=CSIZE*(1+Math.sin(k3+t/610))/2;
  l2=CSIZE*(1+Math.sin(k2+t/500))/2;
  l3=CSIZE*(1+Math.sin(t/390))/2;
}

var draw=()=>{
  const dm1=new DOMMatrix([1,0,0,-1,0,0]);
  const dm2=new DOMMatrix([-1,0,0,1,0,0]);
  let path=new Path2D();
  let x1=l1*Math.cos(a1);
  let y1=l1*Math.sin(a1);
  let x2=l2*Math.cos(a2);
  let y2=l2*Math.sin(a2);
  let x3=l3*Math.cos(a3);
  let y3=l3*Math.sin(a3);
  path.moveTo((x1+x2)/2,(y1+y2)/2);
  path.bezierCurveTo(x2,y2,x2,y2,(x2+x3)/2,(y2+y3)/2);
  path.bezierCurveTo(x3,y3,x3,y3,(x3+x1)/2,(y3+y1)/2);
  path.bezierCurveTo(x1,y1,x1,y1,(x1+x2)/2,(y1+y2)/2);
  path.addPath(path,dm1); 
  path.addPath(path,dm2); 
  ctx.lineWidth=2;
  ctx.setLineDash([20,80]);
  ctx.lineDashOffset=0;
  ctx.strokeStyle=colors[0];
  ctx.stroke(path);
  ctx.lineDashOffset=50;
  ctx.strokeStyle=colors[1];
  ctx.stroke(path);
  ctx.setLineDash([]);
  ctx.strokeStyle="#00000018";
  ctx.lineWidth=8;
  ctx.stroke(path);
}

transit();
start();
