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
ctx.fillStyle="hsla(0,0%,0%,0.07)";

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
  container.style.height=D+"px";
  container.style.width=D+"px";
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

function Line(x,y) {
  this.x=x;
  this.y=y;
//  this.o=o;
}

var COUNT=4;
var count=COUNT;
var yf=300;
var b=0;
var W=6;
var contract=0;

var hue;
var hDur=[];
var setHues=()=>{
  hue=[];
  hDur=[];
  for (let i=0; i<COUNT; i++) {
    hue[i]=getRandomInt(0,360);
    hDur[i]=4+getRandomInt(0,10);
  }
}

var colors;
var setColors=()=>{
  colors=[];
  for (let i=0; i<COUNT; i++) {
    colors.push("hsl("+hue[i]+",100%,50%)");
  }
}

var rot;
var osc;
var setRotation=()=>{
  rot=[];
  osc=[];
  for (let i=0; i<COUNT; i++) {
    //rot.push((COUNT-i+1)*(1-2*Math.random())/100);
    //rot[i]=Math.pow(COUNT-i,3)*(1-2*Math.random())/500;
    rot[i]=[64,27,8,1][i]*(1-2*Math.random())/400;
    //osc[i]=Math.random()/200;
    osc[i]=200*getRandomInt(1,16);
  }
}

var branch=(pts)=>{
  if (--count<0) {
    return;
//if (yf<1) return;
  }
  ctx.beginPath();
  let ptsa=[]
  for (let i=0; i<pts.length; i++) {
    for (let j=0; j<W; j++) {
//if (j==pts[i].o) { continue; }
      let z=TP*j/W+t[count];
      let x=pts[i].x+yf*Math.cos(z);
      let y=pts[i].y+yf*Math.sin(z);
      ctx.moveTo(pts[i].x,pts[i].y);
      ctx.lineTo(x,y);
      //ptsa.push(new Line(x,y,(j+W/2)%W));
      if (count>0) ptsa.push(new Line(x,y));
    }
  }
  //yf/=W/2+b;
  yf/=W/2;
  ctx.strokeStyle=colors[count];
//ctx.lineWidth=4*count+1;
//ctx.lineWidth=Math.pow(count+1,1.8);
  ctx.lineWidth=Math.pow(count,3)+5;
  ctx.stroke();
  branch(ptsa);
}

var draw=()=>{
  count=COUNT;
  yf=400;
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE); 
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE); 
  branch([new Line(0,0)]);
}

var stopped=true;
function start() {
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var t=[];
var c=1;
for (let i=0; i<COUNT; i++) {
  t[i]=0;
}

var animate=(ts)=>{
  if (stopped) return;
  for (let i=0; i<COUNT; i++) {
    if (c%osc[i]==0) {
      rot[i]=[64,27,8,1][i]*(1-2*Math.random())/400;
      let g=[];
      for (let k=1; k<16; k++) if (c%(k*200)==0) g.push(k);
      osc[i]=200*g[getRandomInt(0,g.length)];
      if (EM) stopped=true;
    } else t[i]+=rot[i]*Math.sin(c*TP/osc[i]);
    //t[i]+=rot[i]*Math.sin(osc[i]*c);
    if (c%hDur[i]==0) {
      hue[i]=++hue[i]%360;
      colors[i]="hsl("+hue[i]+",100%,50%)";
    }
  }
/*
  if (contract==1) {
    if (b<4000) b*=1.1;
    else { 
      contract=-1;
    }
  } else if (contract==-1) {
    if (b>0.0001) {
      b/=1.1;
    } else {
      contract=0;
      b=0;
    }
  }
*/
  c++;
  draw();
  requestAnimationFrame(animate);
}

onresize();
//draw();
setHues();
setColors();
setRotation();
if (EM) draw();
else start();
