"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=600;

var createContext=(rot)=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  let context=c.getContext("2d");
  context.translate(CSIZE,CSIZE);
  if (rot) context.rotate(-Math.PI/2);
  return context;
}

const ctx=createContext(true);
ctx.fillStyle="#F22";
const ctx2=createContext(true);
const ctx3=createContext(true);

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="0 auto";
  for (let i=0; i<5; i++) co.append(createContext(false).canvas);
  co.append(ctx3.canvas);
  co.append(ctx2.canvas);
  co.append(ctx.canvas);
  body.append(co);
  return co;
})();

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.height=D+"px";
  container.style.width=D+"px";
  let canvs=document.getElementsByTagName("canvas");
  for (let i=0; i<canvs.length; i++) {
    canvs.item(i).style.width=D+"px";
    canvs.item(i).style.height=D+"px";
  }
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const R=CSIZE-20;
const RATE=30;
const paths=[];
const zpaths=[];

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
  this.arcs=[false,false,false,false,false,false];
  this.getX=(t)=>{ return this.x+this.r*Math.cos(t); }
  this.getY=(t)=>{ return this.y+this.r*Math.sin(t); }
  this.fillColor=(ix)=>{
    if (this.level!=0) return;
    this.arcs[ix]=true;
    //let arced=false;
    let arced=0;
    for (let i=0; i<6; i++) {
      if (this.arcs[i]) arced++;
/*
      if (this.arcs[i]) continue;
      else { arced=false; break; }
*/
    }
    //if (arced>3) {
    if (arced>2) {
      let ct=[ctx3][this.level];
//let col=fillColors[this.level][getRandomInt(0,4)];
      ct.fillStyle=fillColors[this.level][getRandomInt(0,4)];
      ct.save();
for (let i=0; i<3; i++) {
  ct.rotate(TP/3);
      ct.beginPath();
      ct.moveTo(this.x+this.r,this.y);
      //ct.arc(this.x,this.y,this.r,0,TP);
      ct.arc(this.x,this.y,this.r-2,0,TP);
      ct.moveTo(this.x+this.r,-this.y);
      //ct.arc(this.x,-this.y,this.r,0,TP);
      ct.arc(this.x,-this.y,this.r-2,0,TP);
//      ct.fillStyle=col;
      ctx3.fill();
}
      ctx3.restore();
      this.arcs.fill(false);
    }
  }
  paths.push(this);
  if (yp==0 && lp<2) zpaths.push(this);
  generatePoints(this);
}

function DrawPath(pp) {
  this.path=pp;
  this.c=0;
  this.d=1;
  this.t=0;
  this.move=()=>{
    this.c=++this.c%this.path.rate; 
    this.t=this.d*this.c/this.path.rate*TP;
  }
  this.drawNib=(x,y)=>{
    ctx.save();
    for (let i=0; i<3; i++) {
      ctx.rotate(TP/3);
      ctx.clearRect(x-20,y-20,40,40);
      ctx.clearRect(x-20,-y+20,40,-40);
      ctx.beginPath();
      ctx.moveTo(x+10,y);
      ctx.arc(x,y,10,0,TP);
      ctx.moveTo(x+10,-y);
      ctx.arc(x,-y,10,0,TP);
      ctx.fill();
    }
    ctx.restore();
  }
  this.draw=()=>{
    let x=this.path.getX(this.t);
    let y=this.path.getY(this.t);
    this.drawNib(x,y);
    ctx2.save();
    for (let i=0; i<3; i++) {
      ctx2.rotate(TP/3);
	ctx2.beginPath();
	ctx2.moveTo(x+5,y);
	ctx2.arc(x,y,5,0,TP);
	ctx2.moveTo(x+5,-y);
	ctx2.arc(x,-y,5,0,TP);
	ctx2.fill();
    }
    ctx2.restore();
  }
}

var points=[];
var COUNT=3;	// levels

var juns=new Map();

var getPoint=(x,y)=>{
  for (let i=0; i<points.length; i++) {
    if (points[i][0]==x && points[i][1]==y) return points[i];
  }
}

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

var zPath;

var fill6=(xp,yp,r,level)=>{
  for (let i=0; i<6; i++) {
    let x=xp+2*r/3*Math.cos(i*TP/6);
    let y=yp+2*r/3*Math.sin(i*TP/6);
    if (Math.abs(y)<0.001) y=0;
    new CPath(x,y,level);
    if (level>0) fill6(x,y,r/3,level-1);
  }
  new CPath(xp,yp,level);
  if (level>0) fill6(xp,yp,r/3,level-1);
}

var fillColors=[[],[],[]];
let huex=getRandomInt(0,360);

var setColors=()=>{
  //let hue=getRandomInt(0,360);
  let hue=huex;
  ctx2.fillStyle="hsl("+hue+",100%,50%)";
  for (let i=0; i<3; i++) {
    fillColors[i]=[];
    for (let j=1; j<5; j++) {
      let huem=(j*70+hue)%360;
      let lum=60-i*20;
      fillColors[i].push("hsl("+huem+",100%,"+lum+"%)");
    }
  }
}

var sortJunctions=()=>{
  let sortArray=(()=>{
    //let ztt=[0,1,2,3];
    //let ztt=[1,2,0,3];
    //let ztt=[1,2,3,0];
    let ztt=[2,0,3,1];
    let sa=[];
    do {
      sa.push(ztt.splice(getRandomInt(0,ztt.length,true),1)[0]);
    } while (ztt.length>0);
//console.log(sa);
    return sa;
  })();
  paths.forEach((p)=>{	// add junction array at each of 6 path points
    for (let i=0; i<6; i++) {
      if (p.juncs[i]==undefined) continue;
      p.juncs[i].sort((a,b)=>{ 
	return sortArray[b.level]-sortArray[a.level]; 
      });
    }
  });
}

let cpath=new CPath(0,0,COUNT);
fill6(0,0,R,COUNT-1);
juns.forEach((path_array,k)=>{
  if (path_array.length==1) juns.delete(k); //  prune non-junction points
});
paths.forEach((p)=>{	// add junction array at each of 6 path points
  for (let i=0; i<6; i++) {
    p.juncs[i]=juns.get(p.points[i]);
  }
});
sortJunctions();
setColors();
//var drawPath=new DrawPath(zpaths[getRandomInt(0,zpaths.length)]);
var drawPath=new DrawPath(paths[399]);

const DC=30;
var drawCount=0
var timeoutID;
var draw=()=>{
  drawPath.draw();
  if (drawPath.c%drawPath.path.rarc==0) {
    let idx=drawPath.c/drawPath.path.rarc;
    drawPath.path.fillColor(idx);
    if (drawPath.d<0) idx=6-idx;
    let junctionPathsArray=drawPath.path.juncs[idx];
    if (junctionPathsArray!=undefined) {
      var p2=junctionPathsArray[getRandomInt(0,junctionPathsArray.length,true)];
      if (p2!=drawPath.path) {
	if (p2.points[idx]!=drawPath.path.points[idx]) {	// reverse direction
	  drawPath.d=-drawPath.d;
	  if (drawPath.d>0) drawPath.c=p2.rarc*((idx+3)%6);
	  else drawPath.c=p2.rarc*((9-idx)%6);
	}  else {
	  if (drawPath.d<0) drawPath.c=p2.rarc*(6-idx);
	  else drawPath.c=p2.rarc*idx;
	}
	drawPath.path=p2;
      }	// path change
    }	// junction available
    container.children[4].style.opacity=1-drawCount/DC/8;
    container.children[3].style.opacity=7/8-drawCount/DC/8;
    container.children[2].style.opacity=6/8-drawCount/DC/8;
    container.children[1].style.opacity=5/8-drawCount/DC/(8/2);
    container.children[0].style.opacity=3/8-drawCount/DC/(8/3);
    drawCount++;
    if (drawCount>DC) {
      timeoutID=setTimeout(()=>{ reset(); start(); },100);
      stopped=true;
      //ctx.clearRect(-CSIZE,-CSIZE,CSIZE*2,CSIZE*2)
    }

  } // movement reached hex point
}

var copyImage=()=>{
  container.children[0].getContext("2d").clearRect(-CSIZE,-CSIZE,CSIZE*2,CSIZE*2)
  container.children[0].style.opacity=1;
  container.insertBefore(container.children[0],container.children[5]);
  let ct=container.children[4].getContext("2d");
  ct.drawImage(ctx3.canvas,-CSIZE,-CSIZE);
  ct.drawImage(ctx2.canvas,-CSIZE,-CSIZE);
}

var reset=()=>{
  copyImage();
  drawCount=0;
  ctx2.clearRect(-CSIZE,-CSIZE,CSIZE*2,CSIZE*2)
  ctx3.clearRect(-CSIZE,-CSIZE,CSIZE*2,CSIZE*2)
  sortJunctions();
  huex=(huex+6)%360;
  setColors();
  //drawPath.path=zpaths[getRandomInt(0,zpaths.length)];
  //drawPath.c=0;
  //drawPath.t=0;
  paths.forEach((pa)=>{ pa.arcs.fill(false); });
  //drawPath.draw();
}

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  drawPath.move();
  draw();
  if (EM && ++t%1000==0) stopped=true;
  requestAnimationFrame(animate);
}

var stopped=true;
var start=()=>{
  clearTimeout(timeoutID);
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

onresize();

drawPath.draw();
start();
