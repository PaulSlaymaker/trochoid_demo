"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
body.style.display="grid";
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

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

onresize=function() { 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

var colors=[];
var setColors=()=>{
  colors=[];
  let hue=getRandomInt(0,360);
  let hd=getRandomInt(90,270);
  //let n=getRandomInt(3,33);
  for (let i=0; i<W; i++) {
    let sat=80+20*Math.random();
    //let lum=60+20*Math.random();
    let lum=50+30*Math.random();
    colors.push("hsl("+((hue+i*hd)%360)+","+sat+"%,"+lum+"%)");
  }
  (()=>{
    let no=[];
    do {
      no.push(colors.splice(getRandomInt(0,colors.length),1)[0]);
    } while (colors.length>0);
    colors=no;
  })();
}

let arc=new Path2D();
let r1=TP*Math.random();
let r2=r1+Math.random();
arc.arc(0,0,200,0,TP/2);
r1=TP*Math.random();
r2=r1+Math.random();
ctx.strokeStyle="yellow";
//ctx.fillStyle="hsla(0,0%,0%,0.03)";
ctx.fillStyle="hsla(0,0%,0%,0.4)";

var f=[];

//var C=2*getRandomInt(1,17);
//var C=2*getRandomInt(1,12);
var C=2;
var W=5;

{
  let b=Math.floor(C/3);
  let S=[-1,1][getRandomInt(0,2)];
  if (b<3) {
    W==2;
  } else {
    W=b+S*getRandomInt(0,b-2,true);
  }
  //W=Math.min(27,W);
  W=Math.min(7,W);
}

var r=[];
/*
var r=[getRandomInt(20,360),getRandomInt(20,360),
  getRandomInt(20,360),
  getRandomInt(20,360),
  getRandomInt(20,360)
];
*/
var setRadii=()=>{
  r=[];
  r2=[];
  for (let i=0; i<W; i++) {
    r.push(getRandomInt(20,380));
    r2.push(getRandomInt(20,380));
  }
  r.sort((a,b)=>{ return a-b; });
  r2.sort((a,b)=>{ return a-b; });
}
setRadii();

function Point(x,y) {
  this.x=x;
  this.y=y;
}

var getRadius=(idx)=>{
  return r1[idx]*Math.sin(t/RATE)+r2[idx]*Math.cos(t/RATE);
}

const RATE=400;
//const RATE=80;
var QQ=0;

var pts=[];
//var Q=Math.random();
var setPoints=()=>{
  let Q=(1+Math.cos(t/RATE*TP))/4;
  pts=[];
let QZ=QQQ[C];
  for (let j=0; j<W+2; j++) {
    let cr=[];
    for (let i=0; i<C+1; i++) {
//let rr=getRadius(j);
      if (j%2==0) { 
	if (j==0) {
	    cr.push(new Point(0,0));
	} else {
	//    let q=(i%2==0)?i-Q:i+Q;
        //let q=((i%2==0)?i+Q:i-Q)+0.5;
        //let q=i+0.5;
        //let q=i+0.5+QQ;
//let q=i+0.5+QZ;
let q=i;
	    cr.push(new Point(r[j-1]*Math.sin(q*TP/C),r[j-1]*Math.cos(q*TP/C)));
	}
      } else {
        let q=((i%2==0)?i-Q:i+Q);
//        q+=QQ;
q-=0.5;
        cr.push(new Point(r[j-1]*Math.sin(q*TP/C),r[j-1]*Math.cos(q*TP/C)));
      }
    }
    pts.push(cr);
  }
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  setPoints();
  for (let j=0; j<W; j++) {
    let pa=new Path2D();
    //let pa=[new Path2D(),new Path2D()];
    for (let i=0; i<C; i++) {
      //let p=pa[j%2];
      let p=pa;
      if (j%2) {
	p.moveTo(pts[j][i+1].x,pts[j][i+1].y);
	p.lineTo(pts[j+1][i].x,pts[j+1][i].y);
	p.lineTo(pts[j+2][i+1].x,pts[j+2][i+1].y);
//	p.lineTo(pts[j+1][i+1].x,pts[j+1][i+1].y);
      } else {
	p.moveTo(pts[j][i].x,pts[j][i].y);
	p.lineTo(pts[j+1][i].x,pts[j+1][i].y);
	p.lineTo(pts[j+2][i].x,pts[j+2][i].y);
//	p.lineTo(pts[j+1][i+1].x,pts[j+1][i+1].y);
      }
      p.lineTo(pts[j+1][i+1].x,pts[j+1][i+1].y);
      p.closePath();
    }
    ctx.fillStyle=colors[j];
    //ctx.fill(pa[j]);
    ctx.fill(pa);
//    ctx.fillStyle=colors[1];
//    ctx.fill(pa[1]);
  }
}

/*
var drawO=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  setPoints();
//  ctx.beginPath();
  let pa=[new Path2D(),new Path2D()];
  for (let i=0; i<C; i++) {
    //ctx.moveTo(0,0);
    let p=pa[i%2];
    p.moveTo(pts[0][i].x,pts[0][i].y);
    p.lineTo(pts[1][i].x,pts[1][i].y);
    p.lineTo(pts[2][i].x,pts[2][i].y);
    p.lineTo(pts[1][i+1].x,pts[1][i+1].y);
    p.closePath();
  }
  ctx.fillStyle="red";
  ctx.fill(pa[0]);
  ctx.fillStyle="blue";
  ctx.fill(pa[1]);
//  ctx.stroke(pa[0]);
//  ctx.stroke(pa[1]);
}
*/

var pauseTS=0;
var pauseDuration=1000;
var pause=(ts)=>{
  if (stopped) return;
  if (pauseTS==0) pauseTS=ts+1000
  if (ts<pauseTS) {
    t++;
    draw();
    requestAnimationFrame(pause);
  } else {
    pauseTS=0;
    t=0;
    requestAnimationFrame(animate);
  }
}

//var QQQ={2:0,4:0.5,8:0,16:0.5,32:0,64:0.5};
var QQQ={2:-0.5,4:-0.5,8:-0.5,16:-0.5,32:-0.5,64:-0.5,128:-0.5};

var EXP=true;
var t=0;
var stopped=true;
var animate=(ts)=>{
  if (stopped) return;
  t++;
if (t%(RATE/2)==0) {
//  stopped=true;
  if (QQ==0) QQ=0.5;
  else QQ=0;
  t=0;
  if (C<100) C*=2;
//  else C/=2;
}
//if (t%RATE==0) stopped=true;
//if (t%RATE==RATE/2) stopped=true;
  draw();
  requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

onresize();
//draw();
setColors();
start();
