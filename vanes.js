"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/LYQbrLb
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
//c.style.outline="1px solid #444";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.rotate(TP/4);

//ctx.font="bold 12px sans-serif";
//ctx.textAlign="center";

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

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var dashLength=10;
var rotOff=TP/4;
var stopped=true;
var t=-200;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t%300==0) {
    if (t%1200==0) t=0;
    reset();
  }
  a=TP*t/1200;
//if (t%1200==0) t=0;
//if (Math.cos(a/2)<0) debugger;
/*
  let wColor="hsl(0,100%,"+(50+50*Math.pow(Math.cos(a/2),2))+"%)";
  for (let i=0; i<circles.length; i++) {
    if (!circles[i].dmx2) circles[i].col=wColor;
  }
*/
if (t%40==0) huex++;
  for (let i=0; i<circles.length; i++) {
    let hue=(huex+Math.round(circles[i].hDiff*Math.pow(Math.sin(2*a),2)))%360;
    circles[i].col="hsl("+hue+",100%,50%)";
  }
if (EM && t%100==0) stopped=true;
  draw();
  requestAnimationFrame(animate);
}

var drawPoint2=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

ctx.lineWidth=2;
//const radius=10;
//const radius=16;
//const radius=20;
const radius=25;
//const radius=40;
//const radius=50;
//const radius=80;

var circles=[];
var cia=[];
var Circle=function(x) {
  this.x=x;
  this.dmx=new DOMMatrix([1,0,0,1,x,0]);
  this.dmx2=false;
  this.col="hsl("+huex+",100%,50%)";
  this.sf=1;
  this.hDiff=80;
}

var huex=getRandomInt(0,360);
let wColor="hsl("+huex+",100%,50%)";

for (let i=0; i<2*CSIZE/radius-1; i++) {
  circles.push(new Circle(-CSIZE+radius+i*radius));
  cia.push(i);
}

//var rots=[-4,-3,-2,-1,1,2,3,4];
//var rots=[-9,-8,-7,-6,-5,-4,-3,-2,-1,2,3,4,5,6,7,8,9];
//var rots=[-6,-5,-4,-3,-2,-1,2,3,4,5,6];
//var rots=[-4,-3,-2,2,3,4];
//var rots=[2,3,4,5,6,7,8,9,10];
//var rots=[2,4,6,8];
//var rots=[2,4,6,8,10,12,14];

var rots=[8,10,12,14,16,18,20,22,-6,-10,-12,-14,-16,-18,20,22];
var sf=[-1,1][getRandomInt(0,2)];
//var sf=1;
//rots.splice(rots.indexOf(-sf),1);

var a=0;
let cc=0;

var createCognates=(i1,i2)=>{
  let mp=(circles[i1].x+circles[i2].x)/2;
  circles[i1].dmx.e=mp;
  circles[i1].dmx2=new DOMMatrix([1,0,0,1,(i1-i2)*radius/2,0]);
  circles[i2].dmx.e=mp;
  circles[i2].dmx2=new DOMMatrix([1,0,0,1,(i2-i1)*radius/2,0]);
//let rr=Math.abs(circles[i1].x)+Math.abs(circles[i2].x);
let rr=Math.abs(circles[i1].x-circles[i2].x);
//console.log("rr "+rr);
if (rr>300) circles[i1].sf=[-2,2][getRandomInt(0,2)];
else if (rr>200) circles[i1].sf=[-6,-4,-2,2,4,6][getRandomInt(0,6)];
else if (rr>100) circles[i1].sf=[-10-8,-6,-4,-2,2,4,6,8,10][getRandomInt(0,8)];
else if (rr>40) circles[i1].sf=[-14,-12,-10,-8,-6,6,8,10,12,14][getRandomInt(0,10)];
else circles[i1].sf=rots[getRandomInt(0,rots.length)];
  circles[i2].sf=circles[i1].sf;
  cc++;
  circles[i1].hDiff=circles[i2].hDiff=80+100*(cc%4);
  circles[i1].col=circles[i2].col="hsl("+huex+",100%,50%)";
}

var getNextCognate=()=>{
  if (cia.length==0) return false;
  if (cia.length==1) {
    cia=[];
    return false;
  }
  let idx=cia.splice(getRandomInt(0,cia.length),1)[0];
//console.log("idx "+idx);
  let fc=false;
  for (let i=idx+1; i<circles.length; i++) { 
    fc=i-1;
    if (circles[i].dmx2 || i==circles.length-1) {
      if (i==idx+1) {
      //if (idx==circles.length-1) {
//console.log("false d "+fc);
// check for endpoint ?
        break;
      } else {
//console.log("use "+fc);
	let mp=(circles[idx].x+circles[fc].x)/2;
	createCognates(idx,fc);
	cia.splice(cia.indexOf(fc),1);
	return true;
      }
    }
/*
    if (i==circles.length-1 && idx==0) { 
      if (!circles[circles.length-1].dmx2) {
        createCognates(0,circles.length-1);
        cia.splice(cia.indexOf(circles.length-1),1);
      } else {
debugger;
      }
    }
*/
  }
  for (let i=idx-1; i>=0; i--) { 
    if (i==-1 || circles[i].dmx2) {
      if (i==idx-1) {
      //if (idx==0) {
//console.log("false d 2");
// check for endpoint ?
        return true;
      } else {
        fc=i+1;
//console.log("use2 idx "+idx+"  fc "+fc);
        createCognates(idx,fc);
        cia.splice(cia.indexOf(fc),1);
        return true;
      }
    }
  }
// endpoint cases
  if (idx==0) {
    if (!circles[circles.length-1].dmx2) {
      createCognates(0,circles.length-1);
      cia.splice(cia.indexOf(circles.length-1),1);
    } else {
debugger;
    }
  } else if (idx==circles.length-1) {
    if (!circles[0].dmx2) {
      createCognates(0,circles.length-1);
      cia.splice(cia.indexOf(0),1);
//      return true;
    } else {
debugger;
    }
  }
  return true;
}


for (let i=0; i<24; i++) {	// radius 20
//for (let i=0; i<50; i++) {	// radius 10
  if (!getNextCognate()) {
//console.log("end cog "+i);
    break;
  }
//  console.log(cia);
}
if (cia.length>0) debugger;

var draw=()=>{
  ctx.fillStyle="#0000000F";
  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let dmr=new DOMMatrix([Math.cos(sf*a),Math.sin(sf*a),-Math.sin(sf*a),Math.cos(sf*a),0,0])
  for (let i=0; i<circles.length; i++) { 
    let dp=new DOMPoint();
    if (circles[i].dmx2) {
      let cos=Math.cos(circles[i].sf*a);
      let sin=Math.sin(circles[i].sf*a);
      let dmr2=new DOMMatrix([cos,sin,-sin,cos,0,0]);
      dp=dp.matrixTransform(dmr2.multiply(circles[i].dmx2));
    }
    dp=dp.matrixTransform(dmr.multiply(circles[i].dmx));
    ctx.beginPath();
    ctx.arc(dp.x,dp.y,radius/2,0,TP);
//ctx.ellipse(dp.x,dp.y,radius/2,2*radius,circles[i].sf*4*a,0,TP);
    ctx.fillStyle=circles[i].col;
    ctx.fill();
//ctx.strokeStyle=circles[i].col;
//ctx.stroke();
//ctx.fillStyle="gray";
//ctx.fill();

//ctx.fillStyle="black";
//ctx.fillText(i,dp.x,dp.y+3);
  }
}

var reset=()=>{
//sf=[-1,1][getRandomInt(0,2)];
  cia=[];
  for (let i=0; i<circles.length; i++) {
     circles[i].dmx.e=circles[i].x;
     circles[i].dmx2=false;
     circles[i].sf=1;
     circles[i].hDiff=80;
     cia.push(i);
  }
  //for (let i=0; i<50; i++) {	// radius 10
  for (let i=0; i<24; i++) {	// radius 20
    if (!getNextCognate()) {
//      console.log("end cog "+i);
//      console.log(cia);
      break;
    }
  }
//  console.log(cia);
}

onresize();

//draw();
start();
