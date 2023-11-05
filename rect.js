"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/rNKYoLX
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=512;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.lineWidth=4;

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var colors=[];
var setColors=()=>{
  colors=[];
  let colorCount=6;
  let hue=getRandomInt(180,270);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(180/colorCount)*i+getRandomInt(-10,10);
    let h=(hue+hd)%360;
    colors.splice(getRandomInt(0,colors.length+1),0,"hsl("+h+",98%,50%)");
  }
}

//const W=32;
const W=32;

var K=Math.random();

function RCT(p1,p2) {
  this.v=Math.random()<0.5;
//this.v=ra.length%4<2;
//this.v=ra.length%2==1;
  this.p1=p1;
  this.p2=p2;
  this.q1={};
  this.q2={};
  this.sr=[];
  this.col=colors[getRandomInt(0,colors.length)];
  //this.col="hsl("+getRandomInt(0,360)+",100%,50%)";
  this.draw3=()=>{
    if (this.sr.length) {
      for (let i=0; i<this.sr.length; i++) this.sr[i].draw3();
    } else {
      ctx.fillStyle=this.col;
      let x1=(1-f)*this.q1.x+f*this.p1.x;
      let x2=(1-f)*this.q2.x+f*this.p2.x;
      let y1=(1-f)*this.q1.y+f*this.p1.y;
      let y2=(1-f)*this.q2.y+f*this.p2.y;
//      ctx.fillStyle="hsl("+(((x2-x1)*(y2-y1))/400)%360+",100%,50%)";
      ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
      ctx.fillRect(x1,y1,x2-x1,y2-y1);
      ctx.strokeRect(x1,y1,x2-x1,y2-y1);
      ctx.setTransform(-1,0,0,1,CSIZE,CSIZE);
      ctx.fillRect(x1,y1,x2-x1,y2-y1);
      ctx.strokeRect(x1,y1,x2-x1,y2-y1);
      ctx.setTransform(1,0,0,-1,CSIZE,CSIZE);
      ctx.fillRect(x1,y1,x2-x1,y2-y1);
      ctx.strokeRect(x1,y1,x2-x1,y2-y1);
      ctx.setTransform(-1,0,0,-1,CSIZE,CSIZE);
      ctx.fillRect(x1,y1,x2-x1,y2-y1);
      ctx.strokeRect(x1,y1,x2-x1,y2-y1);
    }
  }
  this.split=()=>{
    if (!this.sr.length) { 
      if (this.v) {
        if (this.p2.y-this.p1.y<=W) return;
	//let y=getRandomInt(this.p1.y+W/4,this.p2.y-W/4-1);
	let y=(this.p1.y+this.p2.y)/2;
	this.sr=[ 
	  new RCT(this.p1,{"x":this.p2.x,"y":y}),
	  new RCT({"x":this.p1.x,"y":y},this.p2)
	];
      } else {
        if (this.p2.x-this.p1.x<=W) return;
	//let x=getRandomInt(this.p1.x+W/4,this.p2.x-W/4-1);
	let x=(this.p1.x+this.p2.x)/2;
	this.sr=[ 
	  new RCT(this.p1,{"x":x,"y":this.p2.y}),
	  new RCT({"x":x,"y":this.p1.y},this.p2)
	];
      }
    }
    for (let i=0; i<this.sr.length; i++) this.sr[i].split();
  }
  this.resetY=()=>{
//    if (this.sr.length==0) return;
/*
        if (this.p1.x!=this.sr[1].p1.x) debugger;
        if (this.p2.x!=this.sr[1].p2.x) debugger;
        if (this.p1.y==this.sr[1].p1.y) debugger;
        if (this.sr[0].p2.y!=this.sr[1].p1.y) debugger;
*/
      //if (this.p2.y-this.p1.y>W/2) {
      //if (this.p2.y-this.p1.y>W) {
      //if (true) {
    if (Math.random()<K) {
      //let y=getRandomInt(this.p1.y+W/4,this.p2.y-W/4+1);
      let y=getRandomInt(this.p1.y,this.p2.y+1);
      this.sr[0].p2.y=y;
      this.sr[1].p1.y=y;
    } else {
      this.sr[0].p2.y=this.p2.y;
      this.sr[1].p1.y=this.p1.y;
    }
    this.sr[0].p1.y=this.p1.y;
    this.sr[1].p2.y=this.p2.y;
    this.sr[0].p1.x=this.p1.x;
    this.sr[0].p2.x=this.p2.x;
    this.sr[1].p1.x=this.p1.x;
    this.sr[1].p2.x=this.p2.x;
    this.sr[0].reset();
    this.sr[1].reset();
  }
  this.resetX=()=>{
    //if (this.p2.x-this.p1.x>W/2) {
    //if (true) {
    if (Math.random()<K) {
      //let x=getRandomInt(this.p1.x+W/4,this.p2.x-W/4+1);
      let x=getRandomInt(this.p1.x,this.p2.x+1);
      this.sr[0].p2.x=x;
      this.sr[1].p1.x=x;
    } else {
      this.sr[0].p2.x=this.p2.x;
      this.sr[1].p1.x=this.p1.x;
    }
    this.sr[0].p1.x=this.p1.x;
    this.sr[1].p2.x=this.p2.x;
    this.sr[0].p1.y=this.p1.y;
    this.sr[0].p2.y=this.p2.y;
    this.sr[1].p1.y=this.p1.y;
    this.sr[1].p2.y=this.p2.y;
//if (this.p2.x-this.p1.x<128) 
    this.sr[0].reset();
    this.sr[1].reset();
  }
  this.reset=()=>{
    if (this.sr.length==0) {
      if (this.q1.x==this.q2.x) this.col=colors[getRandomInt(0,colors.length)];
      if (this.q1.y==this.q2.y) this.col=colors[getRandomInt(0,colors.length)];
      return;
    }
    if (this.v) this.resetY();
    else this.resetX();
  }
  this.transit=()=>{
    this.q1.x=this.p1.x;
    this.q1.y=this.p1.y;
    this.q2.x=this.p2.x;
    this.q2.y=this.p2.y;
    for (let i=0; i<this.sr.length; i++) this.sr[i].transit();
  }
//  ra.push(this);
}

var transit=()=>{
  rect.transit();
  K=Math.pow(Math.random(),0.5);
//console.log(K);
  rect.reset();
}

function cFrac(frac) {
  let f1=0.1;
  let f2=0.9;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var stopped=true;
function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var f=0;
var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  if (t==440) {
    transit();
    t=0;
if (EM) stopped=true;
  }
  f=cFrac(t/440);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  rect.draw3();
  requestAnimationFrame(animate);
}

onresize();

setColors();

//var ra=new Array();

var rect=new RCT({"x":0,"y":0},{"x":CSIZE,"y":CSIZE});
rect.split();

transit();

if (EM) rect.draw3();
else start();
