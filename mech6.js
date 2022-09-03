"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/RwQPYrY
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
  c.style.border="3px solid #444";
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

var hues=[];
var colors=new Array(4);
var getHues=()=>{
  let h=[];
  let hueCount=4;
  let hr=Math.round(90/hueCount);
  //let hue=getRandomInt(0,90,true)+30;
  let hue=getRandomInt(-30,30);
  for (let i=0; i<hueCount; i++) {
    let hd=(hue+Math.round(240/hueCount)*i+getRandomInt(-hr,hr))%360;
    h.splice(getRandomInt(0,h.length+1),0,hd);
  }
//  for (let i=0; i<h.length; i++) colors[i]="hsl("+h[i]+",100%,50%)";
  return h;
}
hues=getHues();
var setColors=()=>{
  colors[0]="hsl("+hues[0]+",100%,50%)";
  colors[1]="hsl("+hues[1]+",100%,50%)";
  colors[2]="hsl("+hues[2]+",90%,60%)";
  colors[3]="hsl("+hues[3]+",90%,60%)";
}
setColors();

/*
var colors=[];
var getColors=()=>{
  let c=[];
  let colorCount=4;
  let hue=getRandomInt(0,90,true)+30;
  let colorSeg=Math.round(360/colorCount);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-40,40);
    let sat=70+getRandomInt(0,31);
//    let lum=40+getRandomInt(0,11);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,50%)");
  }
  return c;
}
*/

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var dashLength=10;
var dashLength2=10;
var rotOff=TP/4;
var dm=new DOMMatrix([1,0,0,1,0,0]);
var stopped=true;
var t=0;
function animate(ts) {
  if (stopped) return;
  t++;
//ctx.transform(1,0,0,1,0,-1);
  ldo=600*Math.sin(t/450);
  ldo2=600*Math.sin(t/480);
  rotOff=TP/4*Math.cos(t/200);
  dashLength=20+70*(1+Math.cos(t/250))/2;
  dashLength2=20+70*(1+Math.cos(t/300))/2;
  if (t%8==0) { for (let i=0; i<hues.length; i++) hues[i]=(++hues[i])%360; setColors(); }
  draw();
if (EM && t%100==0) stopped=true;
  requestAnimationFrame(animate);
}

var ldo=0;	// dash offset
var ldo2=0;	// dash offset

ctx.lineWidth=2;
const grid=60;
const radius=Math.ceil(grid*Math.pow(2,0.5));
var dm=new DOMMatrix([1,0,0,1,0,0]);
var dpx1=new DOMPoint(-radius,0);
var dpx2=new DOMPoint(radius,0);

var clipGrid=(v)=>{ return v<-grid?-grid:v>grid?grid:v; }

ctx.fillStyle="#00000005";
var draw=()=>{
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);

  let a=TP*t/600;
  dm.a=Math.cos(a);
  dm.b=Math.sin(a);
  let dp1=dpx1.matrixTransform(dm);
//  let x=dp1.x<-grid?-grid:dp1.x>grid?grid:dp1.x;
//  let y=dp1.y<-grid?-grid:dp1.y>grid?grid:dp1.y;
  let pathx=new Path2D();
  pathx.moveTo(0,0);
  //pathx.lineTo(x,y);
  pathx.lineTo(clipGrid(dp1.x),clipGrid(dp1.y));
  pathx.moveTo(0,0);
  let dp2=dpx2.matrixTransform(dm);
//  x=dp2.x<-grid?-grid:dp2.x>grid?grid:dp2.x;
//  y=dp2.y<-grid?-grid:dp2.y>grid?grid:dp2.y;
  pathx.lineTo(clipGrid(dp2.x),clipGrid(dp2.y));

  let b=a+rotOff;
  dm.a=Math.cos(b);
  dm.b=Math.sin(b);
  dp1=dpx1.matrixTransform(dm);
  dp2=dpx2.matrixTransform(dm);
//  x=dp1.x<-grid?-grid:dp1.x>grid?grid:dp1.x;
//  y=dp1.y<-grid?-grid:dp1.y>grid?grid:dp1.y;
  let pathx2=new Path2D();
  pathx2.moveTo(0,0);
  pathx2.lineTo(clipGrid(dp1.x),clipGrid(dp1.y));
  pathx2.moveTo(0,0);
  //dp2=dpx2.matrixTransform(dm);
  //x=dp2.x<-grid?-grid:dp2.x>grid?grid:dp2.x;
  //y=dp2.y<-grid?-grid:dp2.y>grid?grid:dp2.y;
  pathx2.lineTo(clipGrid(dp2.x),clipGrid(dp2.y));

/*
  pathx.moveTo(x,y);
  let dp2=dpx2.matrixTransform(dm);
  x=dp2.x<-grid?-grid:dp2.x>grid?grid:dp2.x;
  y=dp2.y<-grid?-grid:dp2.y>grid?grid:dp2.y;
  pathx.lineTo(x,y);
*/

  //let pathx2=new Path2D();
  //pathx2.addPath(pathx, new DOMMatrix([0,-1,1,0,0,0]));

  //pathx2.addPath(pathx, new DOMMatrix([0.7,0.866,-0.866,0.7,0,0]));
  let path=new Path2D();
  let path2=new Path2D();
  for (let i=-3; i<4; i++) {
    for (let j=-3; j<4; j++) {
      let d=(i+j)%2?-1:1;
      let sdm=new DOMMatrix([d,0,0,1,i*2*grid,j*2*grid]);
      path.addPath(pathx, sdm);
      path2.addPath(pathx2, sdm);
    }
  }
//ctx.globalCompositeOperation="destination-over";

  ctx.lineDashOffset=ldo;
  ctx.setLineDash([dashLength,dashLength]);
  ctx.strokeStyle=colors[0];
  ctx.stroke(path);
  ctx.lineDashOffset=ldo+dashLength;
  ctx.strokeStyle=colors[2];
  ctx.stroke(path);

  ctx.lineDashOffset=ldo2;
  ctx.setLineDash([dashLength2,dashLength2]);
  ctx.strokeStyle=colors[1];
  ctx.stroke(path2);
  ctx.lineDashOffset=ldo2+dashLength2;
  ctx.strokeStyle=colors[3];
  ctx.stroke(path2);
}

onresize();

//colors=getColors();

start();
