"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/jOzoBWa
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

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var t=0;

var Node=function(pn) {
  this.level=pn?pn.level+1:0;
  this.aos=0.3-0.6*Math.random();
  this.aos2=1-2*TP*Math.random();
//this.af=0.025;//0.015;//0.01-0.025
this.af=0.02+0.01*Math.sin(t/700);
  this.rf=1+Math.random()/2;
  this.r=this.rf*30;
  this.a0=0;
  this.setPosition=()=>{
    if (pn) {
      //this.a=pn.a+this.aos*TP*Math.sin(t/200+this.aos2);
      //this.a=pn.a+0.1*TP*Math.sin(2*(this.level+1)*t/200+this.aos2);
//let lp1=this.level+1;
let lp1=Math.pow(this.level,1.7)+1;
let lp2=this.level+1;
//this.a=pn.a+0.1*TP*Math.sin(2*(this.level+1)*t/200+this.aos2)+this.aos;
//this.a=pn.a+lp1*0.003*TP*Math.sin(0.2*lp1*t/200+this.aos2)+this.aos;
//this.a=pn.a+lp1*0.001*TP*Math.sin(0.3*lp1*t/200+this.aos2)+this.aos;
//this.a=pn.a+lp2*0.015*TP*Math.sin(0.1*lp1*t/500+this.aos2)+this.aos;
this.a=pn.a+lp2*this.af*TP*Math.sin(0.1*lp1*t/500+this.aos2)+this.aos;
      this.x=pn.x+this.r*Math.cos(this.a);
      this.y=pn.y+this.r*Math.sin(this.a);
    } else {
this.a=this.a0+t/800;
      this.r=1;
    //this.r=40+400*Math.pow(Math.sin(t/200),2);
//      this.r=20*Math.random();
      this.x=this.r*Math.cos(this.a);
      this.y=this.r*Math.sin(this.a);
    }
  }
  this.setPosition();
/*
  this.draw=()=>{
    ctx.beginPath();
    ctx.moveTo(this.x,this.y);
    if (pn) {
      ctx.lineTo(pn.x,pn.y);
    } else {
      ctx.lineTo(na[0].x,na[0].y);
    }
    ctx.stroke();
  }
*/
}

const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);
const dm3=new DOMMatrix([0,1,-1,0,0,0]);
const pf=0.24;	// 0.23 flatt

var Arm=function(idx) {
  this.na=[new Node()];
  this.na[0].x=80*Math.random();
//let nodeCount=idx%2?14:12;
let nodeCount=idx%2?16:14;
  for (let i=0; i<nodeCount; i++) {
    let nn=new Node(this.na[i]);
    this.na.push(nn);
  }
  this.setPath=()=>{
    for (let i=0; i<this.na.length; i++) this.na[i].setPosition();
    this.path=new Path2D();
    this.path.moveTo(0,0);
//    this.path.lineTo(this.na[0].x/2,this.na[0].y/2);
    let xn=(this.na[0].x+this.na[1].x)/2
    let yn=(this.na[0].y+this.na[1].y)/2
    this.path.lineTo(xn,yn);
    for (let i=1; i<this.na.length-1; i++) {
      xn=(this.na[i].x+this.na[i+1].x)/2
      yn=(this.na[i].y+this.na[i+1].y)/2
      let cpx=(1-pf)*this.na[i].x+pf*this.na[i-1].x;
      let cpy=(1-pf)*this.na[i].y+pf*this.na[i-1].y;
      let cp2x=(1-pf)*this.na[i].x+pf*this.na[i+1].x;
      let cp2y=(1-pf)*this.na[i].y+pf*this.na[i+1].y;
      this.path.bezierCurveTo(cpx,cpy,cp2x,cp2y,xn,yn);
    }
    this.path.addPath(this.path,dm1);
    this.path.addPath(this.path,dm2);
    this.path.addPath(this.path,dm3);
  }
}

var hue=getRandomInt(0,360);
ctx.lineWidth=1;

var draw=()=>{
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let color="hsla("+hue+",95%,55%,0.5)";
  for (let i=0; i<aa.length; i++) {
    if (i%2) {
      ctx.strokeStyle="#0000003A";
      ctx.lineWidth=2;
    } else {
      ctx.strokeStyle=color;
      ctx.lineWidth=1;
    }
    ctx.stroke(aa[i].path);
  }
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var animate=()=>{
  if (stopped) return;
  t++;
  for (let i=0; i<aa.length; i++) aa[i].setPath();
  draw();
  if (t%7==0) hue=++hue%360;
  requestAnimationFrame(animate);
}

const COUNT=2;
var aa=new Array(COUNT);
for (let i=0; i<COUNT; i++) {
  aa[i]=new Arm(i);
  aa[i].na[0].a0=i*TP/COUNT;
}

onresize();

start();
