"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/MWvwRXL
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
  c.width=2*CSIZE;
  c.height=2*CSIZE;
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
  //let colorCount=Math.random()<0.5?2:4;
  let colorCount=[2,4,8][getRandomInt(0,3)];
  let hue=getRandomInt(0,90,true)+30;
  let colorSeg=Math.round(360/colorCount);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-40,40);
    let sat=60+getRandomInt(0,31);
    let lum=30+getRandomInt(0,21);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}

var Point=function() {
  this.x=0;
  this.y=0;
  this.d=false;
}

var LineObject=function(ln,idx) {
  this.line=ln;
  this.mi=true;
  this.idx=idx;  // color only, bring color back?
}

var drawLineB=(lineObject,rt)=>{
  let ln=lineObject.line;
  ctx.beginPath();
  let pt1=pts[ln[0][0]][ln[0][1]];
  let pt2=pts[ln[1][0]][ln[1][1]];
  ctx.moveTo((pt1.x+pt2.x)/2,(pt1.y+pt2.y)/2);
  for (let p=0; p<ln.length; p++) {
    let a=(p+1)%ln.length;
    let b=(p+2)%ln.length;
    let cx=pts[ln[a][0]][ln[a][1]].x;
    let cy=pts[ln[a][0]][ln[a][1]].y;
    ctx.bezierCurveTo(cx,cy,cx,cy,
      (cx+pts[ln[b][0]][ln[b][1]].x)/2,
      (cy+pts[ln[b][0]][ln[b][1]].y)/2,
    );
  }
  ctx.strokeStyle=colors[lineObject.idx%colors.length];
  ctx.closePath();
  ctx.globalCompositeOperation="source-over";
  ctx.lineWidth=lineWidthA;
  ctx.stroke();
  ctx.globalCompositeOperation="lighter";
  ctx.lineWidth=lineWidthB;
  ctx.stroke();

/*
if (!lineObject.mi) {
  ctx.globalCompositeOperation="source-over";
  ctx.fillStyle=ctx.strokeStyle;
//ctx.globalCompositeOperation="lighten";
  ctx.fill();
}
*/

}

const EDGE=CSIZE;

var pts=[];
var setPoints=()=>{
  pts=[];
  let d=2*EDGE/(COUNT);
  let xs=getSet();
  let ys=getSet();
  for (let i=0; i<COUNT+1; i++) {
    pts[i]=[];
    for (let j=0; j<COUNT+1; j++) {
      pts[i][j]=new Point();
      pts[i][j].x=Math.round(xs[i]);
      pts[i][j].y=Math.round(ys[j]);
      if (Math.abs(xs[i])==EDGE || Math.abs(xs[j])==EDGE) pts[i][j].d=true;
    }
  }
}

var lo=[];
var COUNT=getRandomInt(50,90);
var lineWidthA=Math.round(2*EDGE/COUNT)-2;
var lineWidthB=Math.round(2*EDGE/(COUNT+3)/6);
var posX=0; // [central, random, peripheral]
var posY=0; // [diagonal,peripheral,central,random]
//var dPoints=(()=>{ let p=[]; for (let i=0; i<(COUNT-1)/2; i++) p.push(i); return p; })();
var dPoints=[1,2,3];
var TX=0;
var TY=0;
var vert=false;
var horz=false;
var rotation=["left","right","alternate"][0];

var getLineIndexX=[
()=>{ return dPoints.splice(dPoints.length-1,1)[0]; },
()=>{ return dPoints.splice(getRandomInt(0,dPoints.length-1),1)[0]; },
()=>{ return dPoints.splice(0,1)[0]; }
];

var getLineIndexY=[
(x)=>{ return x; },
( )=>{ return getRandomInt(1,(COUNT-1)/2); },
( )=>{ return getRandomInt(1,(COUNT-1)/2,true); },
( )=>{ return (COUNT-1)/2-getRandomInt(1,(COUNT-1)/2,true); }
];

var getNextQuad3=()=>{
  let lidx=getLineIndexX[posX]();
  let lidy=getLineIndexY[posY](lidx);
  let sx0=lidx;
  let sy0=lidy;
  let sx1=lidx+1;
  let sy1=lidy+1;
if (pts[sx0][sy0].d || pts[sx1][sy0].d || pts[sx0][sy1].d || pts[sx1][sy1].d) debugger;
  return [[sx0,sy0], [COUNT-1-sx0,sy0], [COUNT-1-sx0,COUNT-1-sy0], [sx0,COUNT-1-sy0]];
}

var initLineQ=()=>{
  let lidx,lidy;
  let quads=getNextQuad3();
  let lines=[];
  for (let i=0; i<4; i++) {
   [lidx,lidy]=quads[i];
    let line=[];
    line[0]=[lidx,lidy];
    line[1]=[lidx+1,lidy];
    line[2]=[lidx+1,lidy+1];
    line[3]=[lidx,lidy+1];
    pts[lidx][lidy].d=true;
    pts[lidx+1][lidy].d=true;
    pts[lidx+1][lidy+1].d=true;
    pts[lidx][lidy+1].d=true;
    lines.push(line);
  }
  return lines;
}

var lineCount;	// temp

var reset=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  COUNT=2*getRandomInt(16,60)+1;
  setPoints();
  dPoints=(()=>{ let p=[]; for (let i=1; i<(COUNT-1)/2; i+=2) p.push(i); return p; })();
  lineWidthA=Math.round(2*EDGE/COUNT)-1;
  lineWidthB=Math.round(2*EDGE/(COUNT+3)/6);
  lineCount=4*Math.round(COUNT/4/(1.3+2*Math.random()));
  lo=[];
  posX=getRandomInt(0,3);
  posY=getRandomInt(0,4);
  rotation=["alternate","left","right","alternate"][getRandomInt(0,4)];
  vert=Math.random()<0.1;
  horz=Math.random()<0.1;
let tf=posY?0.1:0.4;
  TX=(Math.random()<tf)?18-getRandomInt(2,17):0;	
  TY=(Math.random()<tf)?18-getRandomInt(2,17):0;	
//console.log(TX+" "+TY+" "+rotation);
  for (let l=0; l<lineCount/4; l++) {
    let lines=initLineQ();
    for (let i=0; i<4; i++) {
      lo[i+4*l]=new LineObject(lines[i],i+l);
      for (let j=0; j<i; j++) lines[i].push(lines[i].shift());
      if (rotation=="right") {
	lines[i].reverse();
      } else if (rotation=="alternate") {
	if (i%2) lines[i].reverse();
      }
    }
  }
  colors=getColors();
}

var getSet=()=>{	// can't use
  let s=[];
  let d=2*EDGE/(COUNT);
  for (let i=0; i<COUNT; i++) {
    s.push(-EDGE+i*d);
  }
  s.push(EDGE);
  return s;
}

var grow=(lineObject)=>{
  if (!lineObject.mi) return false;
  let ln=lineObject.line;
//ln.unshift(ln.pop());
//if (lineObject.rndStart) ln.unshift(...ln.splice(getRandomInt(1,ln.length-1)));
//ln.unshift(...ln.splice(2));
//ln.push(...ln.splice(ln.length-1));
//ln.push(ln.shift());
  for (let p=0; p<ln.length; p++) {
    let s1=p;
    let s2=(s1+1)%ln.length;
    let c=[1,-1];
    //let c=[-1,1];
    if (ln[s1][0]==ln[s2][0]) {
      for (let i=0; i<2; i++) {
	let pt1=pts[ln[s1][0]+c[i]][ln[s1][1]];
	let pt2=pts[ln[s2][0]+c[i]][ln[s2][1]];
	if (pt1.d==false && pt2.d==false) {
          if (TX) {
	    if (ln.length%TX) 
              ln.splice(s2,0,[ln[s1][0]+c[i],ln[s1][1]],[ln[s2][0]+c[i],ln[s2][1]]);
	    else ln.splice(s2,0,[ln[s2][0]+c[i],ln[s2][1]],[ln[s1][0]+c[i],ln[s1][1]]);
          } else {
	    ln.splice(s2,0,[ln[s1][0]+c[i],ln[s1][1]],[ln[s2][0]+c[i],ln[s2][1]]);
          }
	  pt1.d=true;
	  pt2.d=true;
          if (horz) ln.push(ln.shift());
	  return true;
	}
      }
    } else {
      for (let i=0; i<2; i++) {
	let pt1=pts[ln[s1][0]][ln[s1][1]+c[i]];
	let pt2=pts[ln[s2][0]][ln[s2][1]+c[i]];
	if (pt1.d==false && pt2.d==false) {
          if (TY) {
	    if (ln.length%TY) 
              ln.splice(s2,0,[ln[s1][0],ln[s1][1]+c[i]],[ln[s2][0],ln[s2][1]+c[i]]);
	    else ln.splice(s2,0,[ln[s2][0],ln[s2][1]+c[i]],[ln[s1][0],ln[s1][1]+c[i]]);
          } else {
	    ln.splice(s2,0, [ln[s1][0],ln[s1][1]+c[i]], [ln[s2][0],ln[s2][1]+c[i]],);
          }
	  pt1.d=true;
	  pt2.d=true;
          if (vert) ln.push(ln.shift());
	  return true;
	}
      }
    }
  }
  lineObject.mi=false;
  return false;
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<lo.length; i++) {
    drawLineB(lo[i]);
  }
}

var frac=1;
var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var pidx=0;
var step=0;
var time=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  if (step==0) {
    if (ts-time>30) {
      if (pidx>lo.length-1) {
        step=1;
        pidx=0;
      } else {
        drawLineB(lo[pidx++]);
      }
      time=0;
    }
  } else if (step==2) {
    if (ts-time>1600) {
      time=0;
      step=3;
    }
if (EM) stopped=true;
  } else if (step==3) {
    if (ts-time>1000) {
      time=0;
      step=0;
      ctx.canvas.style.opacity=1;
      reset();
    } else {
      ctx.canvas.style.opacity=1-(ts-time)/1000;
    }
  } else {
    if (ts-time>8) {
      frac=0;
      time=0;
      let moved=false;
      for (let i=0; i<lo.length; i++) {
	moved=grow(lo[i]) || moved;
      }
      if (!moved) step=2;
      draw();
    }
  }
  requestAnimationFrame(animate);
}

onresize();
reset();
start();
