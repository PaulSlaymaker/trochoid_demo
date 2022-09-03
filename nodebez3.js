"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/gOeNgeJ
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
ctx.globalCompositeOperation="lighten";

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
var nodeCount=14;
var armCount=160;
//var aos2=1-2*TP*Math.random();
//var af=0.01+0.02*Math.random();
var af=new Array(nodeCount);
//var aos2=new Array(nodeCount);
var afo=new Array(nodeCount);
var afo2=new Array(nodeCount);
//var rf=new Array(nodeCount);
for (let i=0; i<nodeCount; i++) {
//  af[i]=0.1-0.2*Math.random();
//  aos2[i]=1-2*TP*Math.random();
  afo[i]=1-2*TP*Math.random();
  afo2[i]=1-2*TP*Math.random();
//  rf[i]=1+TP*Math.random()/2;
}

var speed=3200;

var Node=function(pn,idx) {
  this.level=pn?pn.level+1:0;
  //this.r=this.rf*30;
//  this.r=rf[idx]*10;
//this.r=28;
//this.r=32;
this.r=pn?0.90*pn.r:60;
  this.a0=0;
  this.setPosition=(at)=>{
    if (pn) {
      //this.a=pn.a+this.aos*TP*Math.sin(t/200+this.aos2);
      //this.a=pn.a+0.1*TP*Math.sin(2*(this.level+1)*t/200+this.aos2);
//let lp1=this.level+1;
//let lp1=Math.pow(this.level,1.4)+1;
let lp1=Math.pow(this.level+1,0.8);
let lp2=0.7*this.level+1;//this.level+1;
//this.a=pn.a+0.1*TP*Math.sin(2*(this.level+1)*t/200+this.aos2)+this.aos;
//this.a=pn.a+lp1*0.003*TP*Math.sin(0.2*lp1*t/200+this.aos2)+this.aos;
//this.a=pn.a+lp1*0.001*TP*Math.sin(0.3*lp1*t/200+this.aos2)+this.aos;
//this.a=pn.a+lp2*0.015*TP*Math.sin(0.1*lp1*t/500+this.aos2)+this.aos;
//this.a=pn.a+lp2*this.af*TP*Math.sin(TP*0.1*lp1*t/400+this.aos2)+this.aos;
//this.a=pn.a+lp2*this.af*TP*Math.sin(TP*0.1*lp1*t/400)+this.aos;
this.a=pn.a+lp2*af[idx]*TP*Math.sin(8*(at+TP*t/speed));//+aos2[idx]);//+this.aos;
      this.x=pn.x+this.r*Math.cos(this.a);
      this.y=pn.y+this.r*Math.sin(this.a);
    } else {
//this.a=at+TP*t/800+TP/4;
this.a=at;
//this.a=0;
//this.a=TP*t/400;
//this.a=at;
      this.r=2;
    //this.r=40+400*Math.pow(Math.sin(t/200),2);
      this.x=this.r*Math.cos(this.a);
      this.y=this.r*Math.sin(this.a);
    }
  }
}

const pf=0.24;	// 0.23 flatt

var Arm=function(idx) {
  let at=TP*idx/armCount;
  this.na=[new Node(0,0)];
  this.na[0].x=80*Math.random();
  for (let i=0; i<nodeCount; i++) {
    let nn=new Node(this.na[i],i+1);
    this.na.push(nn);
  }
  this.setPath=()=>{
    for (let i=0; i<this.na.length; i++) this.na[i].setPosition(at);
    this.path=new Path2D();
    //this.path.moveTo(0,0);
    this.path.moveTo(this.na[0].x,this.na[0].y);
//    this.path.lineTo(this.na[0].x/2,this.na[0].y/2);
    let xn=(this.na[0].x+this.na[1].x)/2
    let yn=(this.na[0].y+this.na[1].y)/2
//    this.path.lineTo(xn,yn);
    for (let i=1; i<this.na.length-1; i++) {
      xn=(this.na[i].x+this.na[i+1].x)/2;
      yn=(this.na[i].y+this.na[i+1].y)/2;
      let cpx=(1-pf)*this.na[i].x+pf*this.na[i-1].x;
      let cpy=(1-pf)*this.na[i].y+pf*this.na[i-1].y;
      let cp2x=(1-pf)*this.na[i].x+pf*this.na[i+1].x;
      let cp2y=(1-pf)*this.na[i].y+pf*this.na[i+1].y;
      this.path.bezierCurveTo(cpx,cpy,cp2x,cp2y,xn,yn);
    }
  }
}

ctx.lineWidth=5;
var hue=getRandomInt(120,240);
var hue2=(hue+getRandomInt(90,180))%360;

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
let pa=[new Path2D(), new Path2D()];
  let p1=new Path2D();
  let p2=new Path2D();
  for (let i=0; i<aa.length; i++) {
    pa[i%2].addPath(aa[i].path);
//if (i%2) p1.addPath(aa[i].path);
//else p2.addPath(aa[i].path);
  }
  
let color="hsl("+hue+",96%,52%)";
let color2="hsl("+hue2+",96%,52%)";
  ctx.strokeStyle=color2;
  ctx.stroke(pa[0]);
  ctx.strokeStyle=color;
  ctx.stroke(pa[1])
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var c=0;
var animate=()=>{
  if (stopped) return;
  t++;
  c++;
  let frac=0;
  if (c==speed/2) {
    reset();
    c=0;
  }
  frac=c/(speed/2);
  for (let i=0; i<nodeCount; i++) {
    //af[i]=0.01*Math.sin(afo[i]+16*t/speed);
    af[i]=0.017*Math.sin((1-frac)*afo[i]+frac*afo2[i]+t/speed);
    //af[i]=0.04*Math.sin((1-frac)*afo[i]+frac*afo2[i]+t/speed);
  }
  for (let i=0; i<aa.length; i++) aa[i].setPath();
  if (t%20==0) { hue=++hue%360; hue2=++hue2%360; }
  draw();
  requestAnimationFrame(animate);
}

var aa=new Array(armCount);
for (let i=0; i<armCount; i++) {
  aa[i]=new Arm(i);
  aa[i].setPath();
}

var reset=()=>{
  for (let i=0; i<nodeCount; i++) {
    afo[i]=afo2[i];
    afo2[i]=1-2*TP*Math.random();
  }
}

onresize();

start();
