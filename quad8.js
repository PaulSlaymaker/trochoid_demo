"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;
const CSIZE=400;
const SF=2*Math.sin(Math.PI/4);

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
c.style.outline="0.5px dotted red";
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
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var colors=[];
var getColors=()=>{
  let c=[];
  let colorCount=getRandomInt(2,10);
  let hr=Math.round(90/colorCount);
  let hue=getRandomInt(0,90,true)+30;
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-hr,hr);
    let sat=60+getRandomInt(0,41);
    let lum=40+getRandomInt(0,41);
    //let lum=Math.round(50+20*Math.pow(Math.sin((col+90)*TP/360),2));
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
    //c.splice(getRandomInt(0,c.length+1),0,"hsla("+((hue+hd)%360)+","+sat+"%,"+lum+"%,0.4)");
  }
  return c;
}

var Point=function(x,y,d) {
  this.x=x;
  this.y=y;
  let rx=Math.round(x);
  let ry=Math.round(y);
  if (rx==0 && ry==0) {
    this.rps=["0,0"];
  } else if (rx==0) {
    this.rps=[[0,ry].toString(),[0,-ry].toString()];
  } else if (ry==0) {
    this.rps=[[rx,0].toString(),[-rx,0].toString()];
  } else {
    this.rps=[[rx,ry].toString(),[-rx,ry].toString(),[rx,-ry].toString(),[-rx,-ry].toString()];
  }
  this.d=d;
}

var Quad=function(point,nr) {
  this.point=point;
  this.nr=nr;
  this.path=new Path2D();
  let cr=(1+2*this.nr)*SF*EDGE/COUNT;
  let x=Math.round(this.point.x+cr*Math.cos(TP/8));
  let y=Math.round(this.point.y+cr*Math.sin(TP/8));
  this.path.moveTo(x,y);
  for (let i=1; i<4; i++) {
    let z=TP/8+i*TP/4;
    x=Math.round(this.point.x+cr*Math.cos(z));
    y=Math.round(this.point.y+cr*Math.sin(z));
    this.path.lineTo(x,y);
  }
  this.path.closePath();
}

const EDGE=CSIZE;

var pm=new Map();
var setPoints=()=>{
  let rad=2*EDGE/(COUNT);
  for (let i=0; i<COUNT+1; i++) {
    for (let j=0; j<COUNT+1; j++) {
      let x=-EDGE+i*rad;
      let y=-EDGE+j*rad;
      let d=(i==0 || i==COUNT || j==0 || j==COUNT);
      pm.set([Math.round(x),Math.round(y)].toString(), new Point(x,y,d));
    }
  }
}

var COUNT=40;

var drawSquares=(qs)=>{
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<qs.length; i++) {
    ctx.fillStyle=colors[i%colors.length];
    let pth=new Path2D();
    qs[i].forEach((q)=>{ pth.addPath(q.path); });
    ctx.fill(pth);
    ctx.stroke(pth);
  }
}

var drawSquaresT=(idx)=>{
    //if (idx>qset2.length-1) return false;
    if (idx>squareSets[1].length-1) return false;
    ctx.fillStyle=colors[idx%colors.length];
    let pth=new Path2D();
    //qset2[idx].forEach((q)=>{ pth.addPath(q.path); });
    squareSets[1][idx].forEach((q)=>{ pth.addPath(q.path); });
    ctx.fill(pth);
    ctx.stroke(pth);
  return true;
}

var frac=1;
var stopped=true;
var pidx=0;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var step=0;
var time=0;
var frac=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  if (step==0) {
    if (ts-time>4000) {
      time=0;
      step=1;
    }
  } else if (step==1) {
//    if (ts-time>5) {
      if (!drawSquaresT(pidx++)) {
	step=0;
	time=0;
	pidx=0;
	transit();
      }
//    }
  }
  requestAnimationFrame(animate);
}

onresize();

var getSymQuads=()=>{
  let rPoints=Array.from(pm.values()).filter((pt)=>{ return !pt.d; });
  if (rPoints.length==0) return false;
  let quads=[];
  let rp=rPoints[getRandomInt(0,rPoints.length)];
  rp.rps.forEach((rpp)=>{ 
    let pt=pm.get(rpp);
    let dist=2*EDGE/COUNT;
    let xd=Math.abs(pt.x);
    let yd=Math.abs(pt.y);
    let minD=COUNT/7;
    if (Math.round(xd)==0 && Math.round(yd)==0) {
      minD=COUNT/7;
    } else if (Math.round(xd)==0) {
      minD=Math.min(yd/dist, (EDGE-yd)/dist, minD);
    } else if (Math.round(yd)==0) {
      minD=Math.min(xd/dist, (EDGE-xd)/dist, minD);
    } else {
      minD=Math.min(
	xd/dist,
	yd/dist,
	Math.abs((EDGE-xd)/dist),
	Math.abs((EDGE-yd)/dist),
	minD
      );
    }
    minD=Math.round(--minD);
    let checkPoint=()=>{
      if (minD==0) return true;
      for (let i=-minD; i<=minD; i++) {
      for (let j=-minD; j<=minD; j++) {
	let key=[Math.round(pt.x+i*dist), Math.round(pt.y+j*dist)].toString();
	let ptc=pm.get(key);
	if (ptc.d) return false;
      }
      }
      return true;
    }
    while (!checkPoint()) minD--;
    quads.push(new Quad(pt,minD));
    for (let i=-minD; i<=minD; i++) {
      for (let j=-minD; j<=minD; j++) {
	let key=[Math.round(pt.x+i*dist), Math.round(pt.y+j*dist)].toString();
	let ptc=pm.get(key);
	ptc.d=true;
	let aio=rPoints.indexOf(ptc);
	if (aio!=-1) rPoints.splice(aio,1);
      }
    }
  }); // each reflector
  return quads;
}

/*
ctx.beginPath();
pm.forEach((p)=>{
  ctx.moveTo(p.x+2,p.y);
  ctx.arc(p.x,p.y,2,0,TP);
});
ctx.fillStyle="white";
ctx.fill();
*/

var createSquares2=()=>{
  setPoints();
  let qs=new QuadSet();
  let tq=getSymQuads();
  while (tq) {
    qs.quads(push(tq));
    tq=getSymQuads();
  }
  return qs;
};

var createSquares=()=>{
  setPoints();
  let qs=[];
  let tq=getSymQuads();
  while (tq) {
    qs.push(tq);
    tq=getSymQuads();
  }
  return qs;
};

var squareSets=[createSquares(), createSquares()];

//var clearPoints=()=>{ pm.forEach((p)=>{ p.d=false; }); }

var transit=()=>{
  squareSets[0]=createSquares();
  squareSets.reverse();
  if (Math.random()<0.5) colors=getColors();
}

/*
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.lineWidth=2;
  //ctx.lineWidth=2+20*(1-frac);
  //ctx.lineWidth=30*frac;
  ctx.globalAlpha=1-frac;
  drawSquares(squareSets[0]);
  ctx.globalAlpha=frac;
  drawSquares(squareSets[1]);
}
*/

//draw();
colors=getColors();
ctx.lineWidth=2;
drawSquares(squareSets[0]);
start();
