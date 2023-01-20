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
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var colors=[];
var hues=[];
var setColors=()=>{
  let colorCount=3;
  let h=getRandomInt(180,270);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(180/colorCount)*i+getRandomInt(-10,10);
    let hue=(h+hd)%360;
    hues.splice(getRandomInt(0,hues.length+1),0,hue);
  }
  for (let i=0; i<colorCount; i++) colors[i]="hsl("+hues[i]+",98%,50%)";
}
setColors();

const dm1=new DOMMatrix([-1,0,0,1,0,0]);
const dm2=new DOMMatrix([1,0,0,-1,0,0]);

var Brush=function(idx) {
  this.col=idx;
  this.t=getRandomInt(0,800);
  this.CT=getRandomInt(800,1000);
  this.F1=getRandomInt(2,5);
  this.F2=getRandomInt(2,5);
  this.draw=()=>{
    let R=5+120*Math.pow(Math.sin(this.t/430),2);
    let z=(this.t/this.CT)%TP;
    let e=CSIZE-R;
    let K0=e*Math.pow(Math.sin(this.t/810),2);
    let x=K0*Math.cos(z)+(e-K0)*Math.cos(this.F1*z);
    let K1=e*Math.pow(Math.sin(this.t/830),2);
    let y=K1*Math.sin(z)+(e-K1)*Math.sin(this.F2*z);
    let path=new Path2D();
    path.arc(x,y,R,K*z,K*z+TP);
    path.addPath(path,dm1);
    path.addPath(path,dm2);
    ctx.setLineDash([TP*R/18,TP*R/9]);
    ctx.lineDashOffset=0;
    ctx.strokeStyle=colors[this.col%colors.length];
    ctx.stroke(path);
    ctx.setLineDash([TP*R/9,TP*R/18]);
    ctx.lineDashOffset=-TP*R/18;
    ctx.strokeStyle="black";//"#00000055";
    ctx.stroke(path);
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
function animate(ts) {
  if (stopped) return;
  if (t++%80==0) {
    for (let i=0; i<hues.length; i++) {
      hues[i]=++hues[i]%360;
      colors[i]="hsl("+hues[i]+",98%,50%)";
    }
  }
  brushes.forEach((b)=>{ b.t++; });
  draw();
  requestAnimationFrame(animate);
}

onresize();

var brushes=new Array();
for (let i=0; i<3; i++) {
  brushes.push(new Brush(i));
}

var K=48;
ctx.lineWidth=3;
ctx.globalAlpha=0.8;

var draw=()=>{ brushes.forEach((b)=>{ b.draw(); }); }

start();
