"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=600;

var ctx=(()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=2;
ctx.fillStyle="#F22";
ctx.strokeStyle="white";

var ctx2=(()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
ctx2.translate(CSIZE,CSIZE);
ctx2.fillStyle="#66D";
ctx2.strokeStyle="white";

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="0 auto";
  co.append(ctx2.canvas);
  co.append(ctx.canvas);
  body.append(co);
  return co;
})();

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.height=D+"px";
  container.style.width=D+"px";
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
  ctx2.canvas.style.width=D+"px";
  ctx2.canvas.style.height=D+"px";
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

function CPath(xp,yp,lp) {
  this.x=xp;
  this.y=yp;
  this.r=R/Math.pow(3,COUNT-lp);
  this.level=lp;
  this.juncs=new Array(6);
  this.points=new Array(6);
  this.rate=RATE;
  this.rate=Math.pow(3,lp)*RATE;
  this.rarc=this.rate/6;
  this.draw=()=>{
    ctx2.beginPath();
/*
    ctx.moveTo(this.x+this.r,this.y);
    ctx.arc(this.x,this.y,this.r,0,TP);
    ctx.stroke();
*/
    ctx2.moveTo(this.x+8,this.y);
    ctx2.arc(this.x,this.y,8,0,TP);
    ctx2.fill();
  }
}

function DrawPath(pp) {
  this.path=pp;
  this.c=0;
  this.d=1;
  this.t=0;
  this.color="blue";
  this.mcolor="red";
  this.past=[];
  this.getX=()=>{ return this.path.x+this.path.r*Math.cos(this.t); }
  this.getY=()=>{ return this.path.y+this.path.r*Math.sin(this.t); }
  this.move=()=>{
    this.c=++this.c%this.path.rate; 
    this.t=this.d*this.c/this.path.rate*TP;
  }
  this.onHex=()=>{
  }
  this.draw=()=>{
    let x=this.getX();
    let y=this.getY();
    ctx2.beginPath();
    ctx2.moveTo(x+10,y);
    ctx2.arc(x,y,10,0,TP);
    ctx2.fillStyle=this.color;
    ctx2.fill();
/*
    ctx.beginPath();
    ctx.moveTo(x+12,y);
    ctx.arc(x,y,12,0,TP);
    ctx.fill();
*/
    this.past.push([x,y]);
    if (this.past.length>16) {
      let pt=this.past.shift();
      ctx2.beginPath();
      ctx2.moveTo(this.past[1][0]+6,this.past[1][1]);
      ctx2.arc(this.past[1][0],this.past[1][1],6,0,TP);
      ctx2.fillStyle="black";
      ctx2.fill();
      ctx2.beginPath();
      ctx2.moveTo(pt[0]+2,pt[1]);
      ctx2.arc(pt[0],pt[1],2,0,TP);
      ctx2.fillStyle=this.mcolor;
      ctx2.fill();
    }
  }
}
 
var paths=[];
var points=[];
var COUNT=3;	// levels
var DCOUNT=4;	// draw count

const R=CSIZE-20;
//const RATE=216;
const RATE=36;
const RARC=RATE/6;

var juns=new Map();

var getGeneratePoint=(xp,yp)=>{
  for (let i=0; i<points.length; i++) {
    if (points[i][0]==xp && points[i][1]==yp) return points[i];
  }
  points.push([xp,yp]);
  return points[points.length-1];
}

var generatePoints=(path)=>{
  for (let i=0; i<6; i++) {
    let x=Math.round(path.x+path.r*Math.cos(i*TP/6));
    let y=Math.round(path.y+path.r*Math.sin(i*TP/6));
    let pt=getGeneratePoint(x,y);
    path.points[i]=pt;
    if (juns.has(pt)) {
      let path_array=juns.get(pt);
      path_array.push(path);
    } else {
      juns.set(pt,[path]);
    }
  }
}

var fill6=(xp,yp,r,level)=>{
  for (let i=0; i<6; i++) {
    let x=xp+2*r/3*Math.cos(i*TP/6);
    let y=yp+2*r/3*Math.sin(i*TP/6);
    let cpath=new CPath(x,y,level);
    paths.push(cpath);
    generatePoints(cpath);
    if (level>0) fill6(x,y,r/3,level-1);
  }
  let cpath=new CPath(xp,yp,level);
  paths.push(cpath);
  generatePoints(cpath);
  if (level>0) {
    fill6(xp,yp,r/3,level-1);
  }
}

var dp=[];	// draw paths

var setColors=()=>{
  let hue=getRandomInt(0,360);
  let hueSeg=Math.round(360/DCOUNT);
  for (let i=0; i<DCOUNT; i++) {
    let dhue=(i*hueSeg+hue)%360;
    dp[i].color="hsl("+dhue+",100%,70%)";
    let huem=(dhue+getRandomInt(0,360))%360;
    dp[i].mcolor="hsl("+huem+",100%,50%)";
  }
}

var setPaths=()=>{
  let cpath=new CPath(0,0,COUNT);
  paths.push(cpath);
  generatePoints(cpath);
  fill6(0,0,R,COUNT-1);
  // paths.forEach((p)=>{ p.generatePoints();
  juns.forEach((path_array,k)=>{
    if (path_array.length==1) juns.delete(k); //  prune non-junction points
  });
  paths.forEach((p)=>{	// add junction array at each of 6 path points
    for (let i=0; i<6; i++) {
      /*
      let ptha=juns.get(p.points[i]);
      if (ptha==undefined) continue;
      for (let j=0; j<ptha.length; j++) { if (p==ptha[j]) ptha.splice(j,1); }
      */
      p.juncs[i]=juns.get(p.points[i]);
    }
  });
  paths.forEach((p)=>{	// add junction array at each of 6 path points
    for (let i=0; i<6; i++) {
      if (p.juncs[i]==undefined) continue;
      p.juncs[i].sort((a,b)=>{ a.level-b.level; } );
    }
  });
  let rpn=getRandomInt(0,paths.length);
  let s=Math.round(paths.length/DCOUNT);
  for (let i=0; i<DCOUNT; i++) {
    let index=(i*s+rpn)%paths.length;
    dp.push(new DrawPath(paths[index]));
  }
  setColors();
}

var drawCount=0
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let p=0; p<dp.length; p++) {
    dp[p].draw();
    if (dp[p].c%dp[p].path.rarc==0) {
      let idx=dp[p].c/dp[p].path.rarc;
      if (dp[p].d<0) idx=6-idx;
      let junctionPathsArray=dp[p].path.juncs[idx];
      if (junctionPathsArray!=undefined) {
        var p2=junctionPathsArray[getRandomInt(0,junctionPathsArray.length,true)];
	if (p2!=dp[p].path) {
	  if (p2.points[idx]!=dp[p].path.points[idx]) {	// reverse direction
	    dp[p].d=-dp[p].d;
	    if (dp[p].d>0) { 
	      //dp[p].c=dp[p].path.rarc*((idx+3)%6);
	      //dp[p].c=RARC*((idx+3)%6);
	      dp[p].c=p2.rarc*((idx+3)%6);
	    } else {
	      //dp[p].c=dp[p].path.rarc*((9-idx)%6);
	      //dp[p].c=RARC*((9-idx)%6);
	      dp[p].c=p2.rarc*((9-idx)%6);
	    }
	  }  else {
            if (dp[p].d<0) dp[p].c=p2.rarc*(6-idx);
            else dp[p].c=p2.rarc*idx;
          }
	  dp[p].path=p2;
	}	// path change
      }	// junction available
if (p==0) {
  drawCount++;
  if (drawCount>300) {
/*
  if (drawCount>4) {
    ctx2.fillStyle="hsla(0,0%,0%,0.04)";
    ctx2.fillRect(-CSIZE,-CSIZE,CSIZE*2,CSIZE*2)
*/
    drawCount=0;
    ctx2.clearRect(-CSIZE,-CSIZE,CSIZE*2,CSIZE*2)
    setColors();
    dp.forEach((ddp)=>{ ddp.past=[]; });
  }
}
    } // movement reached hex point
  } // end dpath array
}

var stopped=true;
var start=()=>{
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  dp.forEach((drawP)=>{ drawP.move(); });
  draw();
  if (EM && ++t%500==0) stopped=true;
  requestAnimationFrame(animate);
}

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

onresize();

setPaths();

//for (let i=0; i<paths.length; i++) paths[i].draw();
//ctx2.fillStyle="#FF0";

//draw();
start();
