"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/MWqdQMB
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
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

const dec=0.3;
var Circle=function(x,y,xp,yp,radius) {
  this.x=x;
  this.y=y;
  this.xp=xp;
  this.yp=yp;
  this.radius=radius;
/*
  this.drawCircle=()=>{
    ctx.beginPath();
      ctx.moveTo(this.x+this.radius,this.y);
      ctx.arc(this.x,this.y,this.radius,0,TP);
    ctx.setLineDash([]);
    ctx.strokeStyle="red";
    ctx.stroke();
  }
*/
  this.grow=()=>{
    this.rd+=dec;
    if (this.rd>this.radius) {
      this.rd=this.radius;
      return false;
    }
    return true;
  }
  this.shrink=()=>{
    this.rd-=dec;
    if (this.rd<=0) {
      this.rd=0;
      return false;
    }
    return true;
  }
}

var cval=(c,x,y,rad)=>{
  if (x>CSIZE-rad-20) return false;
  if (y>CSIZE-rad-20) return false;
  if (x<rad) return false;
  if (y<rad) return false;
  for (let i=0; i<ca.length; i++) {
    if (ca[i]==c) continue;
    let rt=rad+ca[i].radius+16;
    let xd=ca[i].x-x;
    let yd=ca[i].y-y;
    if (Math.abs(xd)>rt) continue;
    if (Math.abs(yd)>rt) continue;
    if (Math.pow(xd*xd+yd*yd,0.5)<rt) {
      return false;
    }
  }
  return true;
}

var growCircles=(rad)=>{
  let c=ca[ca.length-1];
  let a=TP*Math.random();
  let x=c.x+(c.radius+rad)*Math.cos(a);
  let y=c.y+(c.radius+rad)*Math.sin(a);
  if (cval(c,x,y,rad)) {
    let xp=c.x+c.radius*Math.cos(a);
    let yp=c.y+c.radius*Math.sin(a);
    let circle=new Circle(x,y,xp,yp,rad);
    ca.push(circle);
    c.a1=a;
    circle.a2=(a+Math.PI)%TP;
    return true;
  }
  return false;
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var shrink=0;
var t=0;
var animate=()=>{
  if (stopped) return;
  t++;
  if (shrink) {
    if (!ca[gidx].shrink()) {
      gidx--;
      if (gidx==-1) {
	gidx=0;
	setCircles();
	setStrokes();
	shrink=false;
      }
    }
  } else {
    if (!ca[gidx].grow()) {
      gidx++;
      if (gidx==ca.length) {
	shrink=true;
	gidx=ca.length-1;
      }
    }
  }
  setPath();
  draw();
if (EM && t%200==0) stopped=true;
  requestAnimationFrame(animate);
}

var ca=new Array();
var gidx=3;

var setCircles=()=>{
  let r0=10*getRandomInt(2,7);
  ca=[new Circle(r0,r0,r0,r0,r0,0)];
  for (let i=0; i<30; i++) {
    for (let r=80; r>12; r-=6) {
      if (growCircles(r)) break;
    }
  }
  for (let i=0; i<ca.length; i++) ca[i].rd=i>=gidx?0:ca[i].radius;
}

var path=new Path2D();
var setPath=()=>{
  const dm1=new DOMMatrix([1,0,0,-1,0,0]);
  const dm2=new DOMMatrix([-1,0,0,1,0,0]);
  path=new Path2D();
  path.moveTo(0,0);
  path.lineTo(ca[0].rd,0);
  path.arc(ca[0].rd,ca[0].rd,ca[0].rd,3*TP/4,ca[0].a1);
  for (let i=1; i<gidx; i++) path.arc(ca[i].x,ca[i].y,ca[i].rd,ca[i].a2,ca[i].a1,i%2);
  let c=ca[gidx];
  let x=c.xp+c.rd*Math.cos(c.a2+Math.PI);
  let y=c.yp+c.rd*Math.sin(c.a2+Math.PI);
  if (gidx%2) path.arc(x,y,c.rd,c.a2,c.a2-TP,true);
  else path.arc(x,y,c.rd,c.a2-TP,c.a2);
  for (let i=gidx-1; i>0; i--) {
    path.arc(ca[i].x,ca[i].y,ca[i].radius,ca[i].a1,ca[i].a2,i%2);
  }
  path.arc(ca[0].rd,ca[0].rd,ca[0].rd,ca[0].a1,TP/2);
  path.lineTo(0,0);
  path.addPath(path,dm1); 
  path.addPath(path,dm2); 
}

var strokes=new Array(5);

var setStrokes=()=>{ 
  let w=[24,18,13,7,2];
  for (let i=0; i<5; i++) {
    let k1=5-10*Math.random();
    strokes[i]={"col":i%2?"#000000C0":"hsl("+getRandomInt(0,360)+",90%,60%)",
               "dash":[getRandomInt(200,1100),getRandomInt(200,1100),getRandomInt(200,1100)],
                 "os":(t)=>{ return k1*t; },
                "wid":w[i]};
  }
};

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<5; i++) {
    ctx.strokeStyle=strokes[i].col;
    ctx.setLineDash(strokes[i].dash);
    ctx.lineDashOffset=strokes[i].os(t);
    ctx.lineWidth=strokes[i].wid;
    ctx.stroke(path);
  }
}

onresize();
setCircles();
setPath();
setStrokes();

start();
