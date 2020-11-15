"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
const EM=location.href.endsWith("em");
const CSIZE=400;

const TP=2*Math.PI;

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const ctx=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  c.style.display="block";
  body.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=1.3;

const PT=function(x,y) { this.x=x; this.y=y; }

onresize=()=>{ 
  ctx.canvas.style.width=window.innerWidth-1+"px";
  ctx.canvas.style.height=window.innerHeight-1+"px";
}

const randomColor=()=>{
  return "hsl("+getRandomInt(0,360)+","
               +(40+20*Math.random())+"%,"
               +(40+20*Math.random())+"%)";
}

var hues=[]
var COLCOUNT=getRandomInt(4,40);
var setColors=()=>{
  hues=[];
  for (let i=0; i<COLCOUNT; i++) hues.push(randomColor());
}
setColors();

const cFrac=(frac)=>{
  let f1=.1;
  let f2=.9;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var W=20;
var C=10;

//const W=16;
//const C=8;
//const W=5;
//const C=8;  // 1.3
var setTiles=()=>{
  W=getRandomInt(6,40);
  C=2*getRandomInt(3,20);
}
setTiles();

const SS=Math.pow(2,0.5);
//const SS=1;
var perimeter=[]; 

var sk=[0,-TP/C/2,-TP/C/2,0];
var setPerimeter=()=>{
  perimeter=[[],[],[],[],[],[]];
  for (let wo=0; wo<6; wo++) {
    for (let c=0; c<=C; c++) {
      //let z=TP/C*c+TP/C/2+sk[wo%4];  // hex skews
      let z=TP/C*c+[0,-TP/C/2,-TP/C/2,0][wo%4];  // hex skews
      if (z<TP/8) {
	perimeter[wo][c]=new PT(1,SS*Math.sin(z));
      } else if (z<3*TP/8) {
	perimeter[wo][c]=new PT(SS*Math.cos(z),1);
      } else if (z<5*TP/8) {
	perimeter[wo][c]=new PT(-1,SS*Math.sin(z));
      } else if (z<7*TP/8) {
	perimeter[wo][c]=new PT(SS*Math.cos(z),-1);
      } else {
	perimeter[wo][c]=new PT(1,SS*Math.sin(z));
      }
    }
  }
}
setPerimeter();

var R=(W*Math.random()+W)/2.5;
//console.log(X0);
//console.log(Y0);
//var X0=W*(1-2*Math.random());
//var Y0=W*(1-2*Math.random());
var X0=0;
var Y0=0;
var Z=0;

var getCurveX=(z,w,c)=>{
  let lf=w/W;
  //let lf=Math.pow(w/W,.02);  //motion with exponent
  //let lf=Math.pow(Math.sin(w/W*TP/4),7);
  //return Math.cos(z);
  //return (1-lf)*Math.cos(z)+lf*perimeter[w%4][c].x;
  return ((1-lf)*(w*Math.cos(z+Z)+X0)+lf*w*perimeter[w%4][c].x);
  //return perimeter[w%2][c].x;
}

var getCurveY=(z,w,c)=>{
  let lf=w/W;
  //let lf=Math.pow(w/W,.02);
  //let lf=Math.sin(w/W*TP/4);
  //let lf=Math.pow(Math.sin(w/W*TP/4),7);
  //return Math.sin(z);
  return ((1-lf)*(w*Math.sin(z+Z)+Y0)+lf*w*perimeter[w%4][c].y);
  //return perimeter[w%2][c].y;
}

var points=[];
var setPoints=()=>{
  points=[];
  for (let w=0; w<W+3; w++) {
    points[w]=[];
    for (let c=0; c<=C; c++) {
      points[w].push(new PT(0,0));
    }
  }
};
setPoints();

var setLocs=()=>{
  for (let w=0; w<W+3; w++) {
    //let wf=(W+2)*Math.sin(TP/4*w/(W+2));  // slight effect vs w
//console.log(wf);
    for (let c=0; c<=C; c++) {
      //let z=TP/C*c+sk[w%4];  // hex skews
      let z=TP/C*c+[0,-TP/C/2,-TP/C/2,0][w%4];  // hex skews
      points[w][c].x=getCurveX(z,w,c);
      points[w][c].y=getCurveY(z,w,c);
    }
  }
}

var frame=false;

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let a=CSIZE/W;
  for (let w=0; w<W; w+=2) {
    let w1=(w+1);
    let w2=(w+2);
    let w3=(w+3);
    for (let c=0; c<C; c++) {
      let cm=(w%4==0)?c:(C+c-1)%C;
      let cp=(w%4==0)?c+1:c;
      ctx.beginPath();
      ctx.moveTo(a*points[w][c].x,a*points[w][c].y);
      ctx.lineTo(a*points[w1][cm].x,a*points[w1][cm].y);
      ctx.lineTo(a*points[w2][cm].x,a*points[w2][cm].y);
      ctx.lineTo(a*points[w3][c].x,a*points[w3][c].y);
      ctx.lineTo(a*points[w2][cp].x,a*points[w2][cp].y);
      ctx.lineTo(a*points[w+1][cp].x,a*points[w+1][cp].y);
      ctx.closePath();
      ctx.stroke();
      if (frame) {
      } else {
	ctx.fillStyle=hues[(w+c%2)%COLCOUNT];
	ctx.fill();
      }
    }
  }
}


var xa=getRandomInt(-5,6);
var xb=getRandomInt(-5,6);
var ya=getRandomInt(-5,6);
var yb=getRandomInt(-5,6);
var transit=()=>{
//X0=R*Math.pow(Math.cos(t),3);
//Y0=R*Math.pow(Math.sin(t),3);
//X0=R*Math.cos(t);
//Y0=R*Math.sin(t);
X0=R*(Math.cos(xa*t)+Math.cos(xb*t))/2;
Y0=R*(Math.sin(ya*t)+Math.sin(yb*t))/2;
//X0=R*Math.cos(t);
//Y0=R*Math.sin(t);
//Z=8*TP/C*Math.sin(t/6);
//Z=2*TP/C*Math.sin(t/0.7);
Z=TP/4*Math.sin(t/0.7);
}

var S=0;
var op=1;
var t=0;
var stopped=true;
var frac=0;
var time=0;
var duration=2400;
var animate=(ts)=>{
  if (stopped) return;
  t+=0.005;
  transit();
  setLocs();
  draw();
  if (S==0) {
    if (Math.random()<0.001)  S=1;
  } else if (S==1) {
    op-=0.03;
    if (op<0) {
      op=0;
      reset();
      S=2;
    }
    ctx.canvas.style.opacity=op;
  } else if (S==2) {
    op+=0.03;
    if (op>1) { op=1; S=0; }
    ctx.canvas.style.opacity=op;
  }
/*
  if (op<1) {
    op+=0.01;
    if (op>1) op=1;
    ctx.canvas.style.opacity=op;
  }
*/
  requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    stopped=false;
    if (frac>0) time=performance.now()-frac*duration;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}

var reset=()=>{
  setTiles();
  R=(W*Math.random()+W)/2.5;
  setPerimeter();
  setPoints();
  setLocs();
  xa=getRandomInt(-5,6);
  xb=getRandomInt(-5,6);
  ya=getRandomInt(-5,6);
  yb=getRandomInt(-5,6);
  COLCOUNT=getRandomInt(2,40);
  setColors();
Z=0;
}
body.addEventListener("click", reset, false);

onresize();

/*
X0=R*Math.cos(t);
Y0=R*Math.sin(t);
//transit();
setLocs();
draw();
*/

start();
