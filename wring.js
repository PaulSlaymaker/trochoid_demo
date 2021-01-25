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
  c.style.cursor="pointer";
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
//ctx.lineCap="round";

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

var R=2*CSIZE;
var W=getRandomInt(2,10);
var CYC=12*getRandomInt(7+W,22);
//ctx.lineWidth=1;
var F=0.074;
var WID=28;
var z=0;

var getX=(r,t,q,f)=>{ 
  return r*(Math.cos(t)*(1+(F+f)*Math.cos(W*t+q))); 
}
var getY=(r,t,q,f)=>{ 
  return r*(Math.sin(t)*(1+(F+f)*Math.cos(W*t+q))); 
}
var getZ=(t,q)=>{ return Math.sin(W*t+q); }

var colors=[];
var points=[];
var pz=[];
var rz=[];

var randomizeColors=()=>{
  colors=[];
  let hue=getRandomInt(0,360);
  for (let i=0; i<RING; i++) {
    hue+=getRandomInt(90,150)%360;
    colors.push("hsl("+hue+",100%,47%)");
  }
};

var dec=0.028;
var fec=0.0065;
var RING=8;

var setPoints2=()=>{
  points=[];
  for (let ring=0; ring<RING; ring++) {
    points[ring]=[];
    let rset=R/2.5-ring*dec*R;
    let rot=[0,TP/2][ring%2];
    let fset=ring*fec;
    pz[ring]=[];
    rz[ring]=TP*rset/CYC/2.5;
    for (let i=0; i<CYC; i++) {
      let t=TP*i/CYC+z;
      points[ring][i]={
	"x1":getX(rset,t,rot,fset),
	"y1":getY(rset,t,rot,fset),
	"x2":getX(rset+WID,t,rot,fset),
	"y2":getY(rset+WID,t,rot,fset),
      };
      if (ring<2) {
	if (ring==0) {
	  pz[0][i]=getZ(t,TP/8);
	} else {
	  pz[1][i]=getZ(t,3*TP/8);
	}
      }
    }
  }
}

var drawPanel2=(idx)=>{
  let i1=idx+1;
  if (i1==CYC) i1=0;
  for (let ring=0; ring<RING; ring++) {
    ctx.beginPath();
    ctx.moveTo(points[ring][idx].x1,points[ring][idx].y1);
    ctx.lineTo(points[ring][idx].x2,points[ring][idx].y2);
    ctx.lineTo(points[ring][i1].x2,points[ring][i1].y2);
    ctx.lineTo(points[ring][i1].x1,points[ring][i1].y1);
    ctx.lineTo(points[ring][idx].x1,points[ring][idx].y1);
    let xc=(points[ring][idx].x1+points[ring][idx].x2+points[ring][i1].x1+points[ring][i1].x2)/4;
    let yc=(points[ring][idx].y1+points[ring][idx].y2+points[ring][i1].y1+points[ring][i1].y2)/4;
    ctx.moveTo(xc+rz[ring],yc);
    ctx.arc(xc,yc,rz[ring],0,TP);
    ctx.strokeStyle=colors[ring];
    ctx.stroke();
    ctx.fillStyle=colors[ring];
    ctx.fill("evenodd");
  }
}

var drawPanel3=(idx)=>{
  let i1=idx+1;
  if (i1==CYC) i1=0;
  for (let ring=RING-1; ring>=0; ring--) {
    ctx.beginPath();
    ctx.moveTo(points[ring][idx].x1,points[ring][idx].y1);
    ctx.lineTo(points[ring][idx].x2,points[ring][idx].y2);
    ctx.lineTo(points[ring][i1].x2,points[ring][i1].y2);
    ctx.lineTo(points[ring][i1].x1,points[ring][i1].y1);


let xc=(points[ring][idx].x1+points[ring][idx].x2+points[ring][i1].x1+points[ring][i1].x2)/4;
let yc=(points[ring][idx].y1+points[ring][idx].y2+points[ring][i1].y1+points[ring][i1].y2)/4;
ctx.moveTo(xc+rz[ring],yc);
ctx.arc(xc,yc,rz[ring],0,TP);

//    ctx.closePath();
  ctx.strokeStyle=colors[ring];
  ctx.stroke();
    ctx.fillStyle=colors[ring];
    //ctx.fillStyle=points[ring].col[0];
    ctx.fill("evenodd");
  }
}

var drawPoints2=()=>{
  for (let i=0; i<points[0].length; i++) {
    if (pz[0][i]<pz[1][i]) {
      drawPanel2(i);
    } else {
      drawPanel3(i);
    }
  }
}

var draw=()=>{
  setPoints2();
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  drawPoints2();
}

var inc=0.02/W*(2*getRandomInt(0,2)-1);

var randomize=()=>{
  randomizeColors();
  W=[6,5,7,4,3,8,9][getRandomInt(0,7)];
  inc=0.02/W*(2*getRandomInt(0,2)-1);
  CYC=120;
  //F=0.1+getRandomInt(0,10)/100;
  //F=0.074;
  //WID=getRandomInt(16,14+Math.round(80*F));
  o=0;
}

var t=0;
var stopped=true;
var start=()=>{
  if (stopped) {
    stopped=false;
    randomize();
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("dblclick", start, false);
ctx.canvas.addEventListener("click", randomize, false);
//ctx.canvas.addEventListener("click", start, false);

var S=0;
var o=0;
var opacity=1;
var animate=(ts)=>{
  if (stopped) return;
  o++;
  z+=inc;
  if (o==800) {
    S=1;
  } else if (S==1) {
    opacity-=0.02;
    if (opacity<0) {
      opacity=0;
      randomize();
      S=2;
    }
    ctx.canvas.style.opacity=opacity;
  } else if (S==2) {
    opacity+=0.02;
    if (opacity>1) { opacity=1; S=0; }
    ctx.canvas.style.opacity=opacity;
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();
start();
