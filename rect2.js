"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/NWBVEzb
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
  d.append(c);
  return c.getContext("2d");
})();
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
ctx.lineWidth=5;

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);

function V(idx,vv) {
  this.k=TP*Math.random();
  //this.kt=200+100*Math.random();
  this.kt=250+150*Math.random();
  if (vv==undefined) {
    this.setVector=()=>{ this.v=10+(CSIZE-10)*(1+Math.sin(this.k+t/this.kt))/2; }
    //this.setVector=()=>{ this.v=CSIZE*(1+Math.sin(this.k+t/this.kt))/2; }
    //this.setVector=()=>{ this.v=idx*30+(CSIZE-COUNT*30)*(1+Math.sin(this.k+t/this.kt))/2; }
  } else { 
    this.setVector=()=>{ this.v=vv; }
  }
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

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  transit();
  draw();
  requestAnimationFrame(animate);
}

onresize();

const COUNT=5;
var pa=new Array(COUNT);
var setPoints=()=>{
  for (let i=0; i<COUNT; i++) {
    pa[i]=new Array(COUNT);  
    for (let j=0; j<COUNT; j++) {
      pa[i][j]={"x":xan[i][j].v,"y":yan[j][i].v};
    }
  }  
}

var getVectorArray=()=>{
  let a=[new V(0,0)];
  for (let i=0; i<COUNT-2; i++) a.push(new V(i+1));
  a.push(new V(COUNT-1,CSIZE));
  return a;
}

/*
var getVectorArray=()=>{
  let a=[0];
  for (let i=0; i<1; i++) a.push(getRandomInt(0,CSIZE));
  a.push(CSIZE);
  a.sort((a,b)=>{ return a-b; });
  return a;
}
*/

var xan=new Array(COUNT);
var yan=new Array(COUNT);
for (let i=0; i<COUNT; i++) {
  xan[i]=getVectorArray();
  yan[i]=getVectorArray();
}

/*
var drawPoint=(x,y,col,r)=>{	// diag
  ctx.beginPath();
  let rad=r?r:4; 
  ctx.arc(x,y,rad,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}
*/

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<COUNT-1; i++) {
    for (let j=0; j<COUNT-1; j++) {
      let path=new Path2D();
      path.moveTo((pa[i][j].x+pa[i][j+1].x)/2,(pa[i][j].y+pa[i][j+1].y)/2);
//drawPoint((pa[i][j].x+pa[i][j+1].x)/2,(pa[i][j].y+pa[i][j+1].y)/2,"green",3);
      path.bezierCurveTo(pa[i][j+1].x,pa[i][j+1].y,pa[i][j+1].x,pa[i][j+1].y,
        (pa[i][j+1].x+pa[i+1][j+1].x)/2,(pa[i][j+1].y+pa[i+1][j+1].y)/2);
      path.bezierCurveTo(pa[i+1][j+1].x,pa[i+1][j+1].y,pa[i+1][j+1].x,pa[i+1][j+1].y,
        (pa[i+1][j+1].x+pa[i+1][j].x)/2,(pa[i+1][j+1].y+pa[i+1][j].y)/2);
      path.bezierCurveTo(pa[i+1][j].x,pa[i+1][j].y,pa[i+1][j].x,pa[i+1][j].y,
        (pa[i+1][j].x+pa[i][j].x)/2,(pa[i+1][j].y+pa[i][j].y)/2);
      path.bezierCurveTo(pa[i][j].x,pa[i][j].y,pa[i][j].x,pa[i][j].y,
        (pa[i][j].x+pa[i][j+1].x)/2,(pa[i][j].y+pa[i][j+1].y)/2);
      path.addPath(path,dm1);
      path.addPath(path,dm2);
let s=(pa[i+1][j+1].x-pa[i][j].x)*(pa[i+1][j+1].y-pa[i][j].y)/(CSIZE*CSIZE)*700;
      ctx.fillStyle="hsl("+(360-s)+",90%,50%)";
      ctx.fill(path);
//      ctx.strokeStyle=colors[0];
      ctx.stroke(path);
    }
  }
}

var transit=()=>{
  for (let i=0; i<COUNT; i++) {
    for (let j=0; j<COUNT; j++) {
      xan[i][j].setVector();
      yan[i][j].setVector();
    }
    xan[i].sort((a,b)=>{ return a.v-b.v; });
    yan[i].sort((a,b)=>{ return a.v-b.v; });
  }
  setPoints();
}

transit();

/*
ctx.font="bold 12px sans-serif";
ctx.textAlign="center";
ctx.fillStyle="white";
var showPoints=()=>{
  for (let i=0; i<COUNT; i++) {
    for (let j=0; j<COUNT; j++) {
      drawPoint(xan[i][j].v,yan[j][i].v,"yellow");
      ctx.fillText(i+" "+j,xan[i][j].v-12,yan[j][i].v-16);
      ctx.fillText(j+" "+i,xan[i][j].v-12,yan[j][i].v-6);
console.log(xan[i][j].v.toFixed(0),yan[j][i].v.toFixed(0));
    }
  }
}
var showPoints2=()=>{
  for (let i=0; i<COUNT; i++) {
    for (let j=0; j<COUNT; j++) {
      drawPoint(pa[i][j].x,pa[i][j].y,"yellow");
      ctx.fillText(i+" "+j,pa[i][j].x-12,pa[i][j].y-12);
//console.log(pa[i][j].x.toFixed(0),pa[i][j].y.toFixed(0));
    }
  }
}
*/

ctx.strokeStyle="#000000CC";
start();
