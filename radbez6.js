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
ctx.lineCap="round";

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

var hues=[];
var getHues=()=>{
  let h=[];
  let hueCount=4;
  let hr=Math.round(90/hueCount);
  let hue=getRandomInt(0,90,true)+30;
  for (let i=0; i<hueCount; i++) {
    let hd=Math.round(240/hueCount)*i+getRandomInt(-hr,hr);
    h.splice(getRandomInt(0,h.length+1),0,(hue+hd)%360);
  }
  return h;
}
hues=getHues();

var drawPoint=(pt,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(pt.x,pt.y,2,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var drawPoint2=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
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
var duration=6000;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t%(duration/2)==duration/4) randomize(); //stopped=true;
  setLines();
  if (t%10==0) for (let i=0; i<hues.length; i++) hues[i]=(++hues[i])%360;
  draw();
  requestAnimationFrame(animate);
}

onresize();
var C=8;
//var R=220+200*Math.random();	
var R=360;

var Line=function(idx) {
  this.a=idx*TP/C+(C/4-1)*TP/C/2;
  this.ad=0;
  this.fd=0;
  this.r=R;
  this.rd=0;
  this.rot=0;
  this.dp1=new DOMPoint();
  this.dp2=new DOMPoint();
/*
  this.rotate=(z)=>{
    //let dm1=new DOMMatrix([1,0,0,1,-this.mx,-this.my]);
    //let dm2=new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),0,0]);
    let dm2=new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),this.mx,this.my]);
    let dm3=dm2.multiply(this.dm1);
    this.dp1=this.dp1.matrixTransform(dm3);
    this.dp2=this.dp2.matrixTransform(dm3);
  }
*/
  this.setLine=()=>{
    let f=2/C+this.fd;
    this.dp1.x=(R+this.rd)*Math.cos(this.a+this.ad-f);
    this.dp1.y=(R+this.rd)*Math.sin(this.a+this.ad-f);
    this.dp2.x=(R+this.rd)*Math.cos(this.a+this.ad+f);
    this.dp2.y=(R+this.rd)*Math.sin(this.a+this.ad+f);
    this.mx=(this.dp1.x+this.dp2.x)/2;
    this.my=(this.dp1.y+this.dp2.y)/2;
    // rotate line
    this.dm1=new DOMMatrix([1,0,0,1,-this.mx,-this.my]);
    let dm2=new DOMMatrix([
      Math.cos(this.rot),Math.sin(this.rot),-Math.sin(this.rot),Math.cos(this.rot),
      this.mx,this.my
    ]);
    let dm3=dm2.multiply(this.dm1);
    this.dp1=this.dp1.matrixTransform(dm3);
    this.dp2=this.dp2.matrixTransform(dm3);
  }
}

// lines.length (always 32) vs C
var lines=new Array(16);
for (let i=0; i<16; i++) lines[i]=new Line(i);

//var skipLevel=2*getRandomInt(0,C/4)+1;

//ctx.fillStyle="#00000009";
ctx.lineWidth=14;
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let p=new Path2D();
  let p2=new Path2D();
  p.moveTo(lines[0].mx,lines[0].my);
  p2.moveTo(lines[C/2].mx,lines[C/2].my);
  for (let i=0; i<C; i++) {
    let i1=(i+1)%C;
    p.bezierCurveTo(lines[i].dp2.x,lines[i].dp2.y,lines[i1].dp1.x,lines[i1].dp1.y,lines[i1].mx,lines[i1].my);
    let i3=(i+C/2)%C;
    let i4=(i+1+C/2)%C;
    p2.bezierCurveTo(lines[i3].dp2.x,lines[i3].dp2.y,lines[i4].dp1.x,lines[i4].dp1.y,lines[i4].mx,lines[i4].my);
//drawPoint2(lines[i].mx,lines[i].my);
//drawPoint(lines[i].dp2,"blue");
  }
ctx.setLineDash([240,10000]);
ctx.lineDashOffset=-2000*Math.pow(Math.sin(t/300),2);
ctx.lineWidth=50;
ctx.strokeStyle="hsla("+hues[2]+",100%,70%,0.4)";
ctx.stroke(p);
ctx.stroke(p2);

ctx.setLineDash([]);
    ctx.lineWidth=14;
    ctx.strokeStyle="hsl("+hues[0]+",100%,70%)";
    ctx.stroke(p);
    ctx.lineWidth=9;
    ctx.strokeStyle="hsl("+hues[1]+",100%,20%)";
    ctx.stroke(p);
//    ctx.lineWidth=2;
//    ctx.strokeStyle=colors[2];
//    ctx.stroke(p);

ctx.setLineDash([240,10000]);
//  ctx.lineDashOffset=300-t;
//  ctx.lineDashOffset=-2000*Math.pow(Math.sin(t/200),2);
  ctx.strokeStyle="hsl("+hues[2]+",100%,70%)";
  ctx.lineWidth=7;
  ctx.stroke(p);
  ctx.stroke(p2);
//drawPoint2(lines[0].mx,lines[0].my);
}

var AD=new Array(C);
var RD=new Array(C);
var RO=new Array(C);
var TFA=1;
var TFR=1;
var TFE=1;
var ts=tSet[0];
var randomize=()=>{
  //for (let i=0; i<C; i++) AD[i]=6-12*Math.random();
  for (let i=0; i<C; i++) AD[i]=6*Math.random();
  for (let i=0; i<C; i++) RD[i]=Math.random();
  for (let i=0; i<C; i++) RO[i]=9-18*Math.random();
  TFA=[1,3][getRandomInt(0,2)]; 
  TFR=[1,3][getRandomInt(0,2)]; 
  TFE=[1,3][getRandomInt(0,2)]; 
console.log(TFA+" "+TFR+" "+TFE);
}

var setLines=()=>{
  for (let i=0; i<C; i++) {
    lines[i].ad=AD[i]*Math.cos(TFA*TP*t/(duration));
    //lines[i].fd=FD[i]*Math.sin(t/200);
    lines[i].fd=0.4*Math.pow(Math.cos(TP*t/duration),2);
    lines[i].rot=RO[i]*Math.cos(TFR*TP*t/duration);
    lines[i].rd=-R*RD[i]*Math.pow(Math.cos(TFE*TP*t/duration),2);
    lines[i].setLine();
  }
}

randomize();
//setLines();
start();
