"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
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
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var hues=[];
var colors=[];
var setHues=()=>{
  let colorCount=4;
  let hue=getRandomInt(180,270);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(240/colorCount)*i+getRandomInt(-10,10);
    let h=(hue+hd)%360;
    hues.splice(getRandomInt(0,hues.length+1),0,h);
  }
}
setHues();
colors[0]="hsl("+hues[0]+",90%,50%)";
colors[1]="hsl("+hues[1]+",90%,50%)";
colors[2]="hsl("+hues[2]+",90%,50%)";
colors[3]="hsl("+hues[3]+",90%,50%)";

//var lw=92;
var lw=36;

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.setLineDash([length/12-lw,3*length/12+lw]);
let sc=200*Math.sin(t/200);
let ss=1.3*speed*t;
  ctx.lineDashOffset=-ss+sc;
  ctx.lineWidth=lw;
  ctx.strokeStyle=colors[0];
  ctx.stroke(path);
  ctx.lineDashOffset=ss-lw-sc;
  ctx.strokeStyle=colors[1];
  ctx.stroke(path2);
  ctx.lineDashOffset=ss-lw-sc+length/12;	// 12
  //ctx.lineDashOffset=ss-lw-sc;		// 24
  ctx.strokeStyle=colors[2];
  ctx.stroke(path3);
  ctx.lineDashOffset=-ss+sc-length/12;	// 12
  //ctx.lineDashOffset=-ss+sc;			// 24
  ctx.strokeStyle=colors[3];
  ctx.stroke(path4);

  ctx.setLineDash([len2/8-lw,3*len2/8+lw]);
  for (let i=0; i<4; i++) {
    let offset=speed*t+i*len2/8;
    ctx.strokeStyle=colors[i%colors.length];
    //ctx.lineDashOffset=-speed*t+i*len2/8;
    for (let c=0; c<5; c++) {
      if (c==0) ctx.lineDashOffset=offset+len2/3*Math.sin(t/200+coff[0]);
      else ctx.lineDashOffset=-offset+len2/3*Math.sin(t/200+coff[c]);
      ctx.stroke(patha[c]);
    }
  }
  ctx.setLineDash([pathp.length/8-lw,3*pathp.length/8+lw]);
  for (let i=0; i<4; i++) {
    ctx.lineDashOffset=-speed*t+i*pathp.length/8;
    ctx.strokeStyle=colors[i%colors.length];
    ctx.stroke(pathp);
  }
}

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
var t=0;
var speed=2;
function animate(ts) {
  if (stopped) return;
  t++;
  if (t%20==0) for (let i=0; i<hues.length; i++) {
    hues[i]=++hues[i]%360;
    colors[i]="hsl("+hues[i]+",82%,54%)";
  }
  ctx.rotate(-0.002);
  draw();
  requestAnimationFrame(animate);
}

onresize();

var R1=CSIZE-lw/2-lw;

var path=new Path2D();
path.arc(0,-2*R1/3,R1/3,3*TP/4,TP/4);
path.arc(0,0,R1/3,3*TP/4,TP/4,true);
path.arc(0,2*R1/3,R1/3,3*TP/4,TP/4);
path.arc(0,0,R1,TP/4,3*TP/4);
path.closePath();
var path2=new Path2D();
path2.addPath(path, new DOMMatrix([-1,0,0,1,0,0]));
var path3=new Path2D();
path3.addPath(path, new DOMMatrix([0,1,1,0,0,0]));
var path4=new Path2D();
path4.addPath(path, new DOMMatrix([0,-1,1,0,0,0]));
length=R1*TP;
//var scoff=TP*Math.random();

var pathc=new Path2D();
pathc.arc(0,0,R1/3-lw,0,TP);
var pathc1=new Path2D();
pathc1.addPath(pathc, new DOMMatrix([1,0,0,1,2*R1/3,0]));
var pathc2=new Path2D();
pathc2.addPath(pathc, new DOMMatrix([1,0,0,1,-2*R1/3,0]));
var pathc3=new Path2D();
pathc3.addPath(pathc, new DOMMatrix([1,0,0,1,0,-2*R1/3]));
var pathc4=new Path2D();
pathc4.addPath(pathc, new DOMMatrix([1,0,0,1,0,2*R1/3]));
var len2=TP*(R1/3-lw);
var coff=[TP*Math.random(),TP*Math.random(),TP*Math.random(),TP*Math.random(),TP*Math.random()];
var patha=[pathc,pathc1,pathc2,pathc3,pathc4];
patha.len=len2;

var pathp=new Path2D();
pathp.arc(0,0,R1+lw,0,TP);
var lenp=TP*(R1+lw);
pathp.length=TP*(R1+lw);

start();

