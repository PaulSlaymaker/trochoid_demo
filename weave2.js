"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const CSIZE=600;

const ctx=(()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="0 auto";
  co.append(ctx.canvas);
  body.append(co);
  return co;
})();

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.width=D+"px";
  container.style.height=D+"px";
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var LW=14;
ctx.lineWidth=LW;
ctx.strokeStyle="white";
ctx.font="24px sans-serif";
ctx.fillStyle="blue";

var R=1.60*CSIZE;
var CYC=144;

var F=0.15;
var W=6;
var Q=TP/2;
var WID=24;
var z=0;
var o=0;

var getX=(r,t,q,f)=>{ 
  //return r*(Math.cos(t)+0.1*Math.pow(1-Math.cos(12*t),2)); 
  //return r*(Math.cos(t)+0.1*(Math.cos(TP/2*Math.cos(4*t)))); 
  //return r*(Math.cos(t)+0.1*Math.cos(12*t)); 
  return r*(Math.cos(t)*(1+F*Math.cos(W*t+q))); 
}
var getY=(r,t,q)=>{ 
  //return r*(Math.sin(t)+0.1*Math.pow(1-Math.sin(12*t),2)); 
  //return r*(Math.sin(t)+0.1*(Math.cos(TP/2*Math.cos(4*t)))); 
  //return r*(Math.sin(t)-0.1*(Math.sin(12*t))); 
  return r*(Math.sin(t)*(1+F*Math.cos(W*t+q))); 
}
//var getZ=(t,q)=>{ return Math.cos(W*t+q); }
var getZ=(t)=>{ return Math.sin(2*W*t); }

var points1=[];
var points2=[];
var points3=[];
var setPoints=()=>{
  points1=[];
  points2=[];
  points3=[];
  for (let i=0; i<CYC; i++) {
    let t=TP*i/CYC+z;
    let j=(i+o)%CYC;
//    points1.push({"x":getX(R/3,t,0),"y":getY(R/3,t,0),"z":getZ(t,0)});
//    points2.push({"x":getX(R/3+WID,t,0),"y":getY(R/3+WID,t,0)});
    points1[j]={
      "x1":getX(R/3,t,0),
      "y1":getY(R/3,t,0),
      "x2":getX(R/3+WID,t,0),
      "y2":getY(R/3+WID,t,0),
      "idx":i,
      "z":getZ(t)
    };
    points2[j]={
      "x1":getX(R/3,t,TP/3),
      "y1":getY(R/3,t,TP/3),
      "x2":getX(R/3+WID,t,TP/3),
      "y2":getY(R/3+WID,t,TP/3),
      "idx":i
    };
    points3[j]={
      "x1":getX(R/3,t,-TP/3),
      "y1":getY(R/3,t,-TP/3),
      "x2":getX(R/3+WID,t,-TP/3),
      "y2":getY(R/3+WID,t,-TP/3),
      "idx":i
    };
  }
}

var drawOrb=(pts,start,end,color)=>{
  ctx.beginPath();
  for (let j=start; j<end; j++) {
    ctx.moveTo(pts[j].x1+20,pts[j].y1);
    ctx.arc(pts[j].x1,pts[j].y1,20,0,TP);
  }
  ctx.fillStyle=color;
  ctx.fill();
}

var drawSeg=(pts,start,end,color,alt)=>{
  ctx.beginPath();
  for (let j=start; j<end; j++) {
if (pts[j]==undefined) debugger;
    if (pts[j].idx%2==alt) continue;
    ctx.moveTo(pts[j].x1,pts[j].y1);
    ctx.lineTo(pts[j].x2,pts[j].y2);
  }
  ctx.strokeStyle=color;
  ctx.stroke();
}

/*
var drawPointsN=()=>{
  let segLength=points1.length/W/2;
  for (let i=0; i<points1.length; i++) {
    if (Math.abs(points1[i].z)>0.80) {
      drawSeg(points1,i,i+segLength,"red");
      drawSeg(points2,i,i+segLength,"white");
    } else {
      drawSeg(points2,i,i+segLength,"white");
      drawSeg(points1,i,i+segLength,"red");
    }
    i+=segLength-1;
  }
}
*/

var drawPoints=()=>{
  let segLength=points1.length/W/2;
  for (let i=0; i<2*W; i++) {
    if (i%3==0) {
      drawSeg(points2,i*segLength,(i+1)*segLength,"silver",0);
      drawSeg(points2,i*segLength,(i+1)*segLength,"blue",1);
      drawSeg(points1,i*segLength,(i+1)*segLength,"red",0);
      drawSeg(points1,i*segLength,(i+1)*segLength,"yellow",1);
      drawSeg(points3,i*segLength,(i+1)*segLength,"green",0);
      drawSeg(points3,i*segLength,(i+1)*segLength,"green",1);
    } if (i%3==1) {
      drawSeg(points1,i*segLength,(i+1)*segLength,"red",0);
      drawSeg(points1,i*segLength,(i+1)*segLength,"yellow",1);
      drawSeg(points3,i*segLength,(i+1)*segLength,"green",0);
      drawSeg(points3,i*segLength,(i+1)*segLength,"green",1);
      drawSeg(points2,i*segLength,(i+1)*segLength,"silver",0);
      drawSeg(points2,i*segLength,(i+1)*segLength,"blue",1);
    } else {
      drawSeg(points3,i*segLength,(i+1)*segLength,"green",0);
      drawSeg(points3,i*segLength,(i+1)*segLength,"green",1);
      drawSeg(points2,i*segLength,(i+1)*segLength,"silver",0);
      drawSeg(points2,i*segLength,(i+1)*segLength,"blue",1);
      drawSeg(points1,i*segLength,(i+1)*segLength,"red",0);
      drawSeg(points1,i*segLength,(i+1)*segLength,"yellow",1);
    }
  }
}

//ctx.fillStyle="hsla(0,0%,0%,0.04)";
var draw=()=>{
  setPoints();
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  drawPoints();
}

var colors2=[];
var fillColors=[];

var t=0;
var stopped=true;
var start=()=>{
  if (stopped) {
    stopped=false;
    //setPoints();
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var animate=(ts)=>{
  if (stopped) return;
  //o++;
  z+=0.003;
  o=Math.round(z*CYC/TP);
  draw();
  requestAnimationFrame(animate);
}

onresize();

var controls=[];
body.append(
  (()=>{
    var getStdRange=(min,max,step,name)=>{
      let sr=document.createElement("input");
      sr.type="range";
      sr.min=min;
      sr.max=max;
      sr.step=step;
      sr.style.display="block";
      sr.onmouseover=()=>{ sr.title=sr.value; }
      return sr;
    }
    let d=document.createElement("div");
    d.style.gridColumn="2";
    d.append(
      (()=>{
	//let f1=getStdRange(0,4,0.01);  // Q
	let f1=getStdRange(10,180,1);	// WID
	//let f1=getStdRange(0,1,0.01);	// F
	//let f1=getStdRange(2,80,2);	// W
	//let f1=getStdRange(0,80,1);	// LW
	f1.value=WID;
	f1.oninput=()=>{
	  WID=parseFloat(f1.value);
//ctx.lineWidth=LW;
	  draw();
	}
        f1.set=()=>{ f1.value=WID; }
        controls.push(f1);
	return f1;
      })(),
    );
    return d;
  })(),
);
var setControls=()=>{
  for (let con of controls) { con.set(); }
}

//draw();
start();
