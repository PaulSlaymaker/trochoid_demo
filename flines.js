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
//c.style.outline="1px dotted gray";
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.transform(1,0,0,1,CSIZE,CSIZE);
ctx.lineWidth=4;
ctx.lineJoin="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var colors=[];
var setColors=()=>{
  colors=[];
  let colorCount=6;
  let hue=getRandomInt(180,270);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(180/colorCount)*i+getRandomInt(-10,10);
    let h=(hue+hd)%360;
    colors.splice(getRandomInt(0,colors.length+1),0,"hsl("+h+",98%,60%)");
  }
}

const DM1=new DOMMatrix([-1,0,0,1,0,0]);
const DM2=new DOMMatrix([1,0,0,-1,0,0]);
const DM3=new DOMMatrix([0.5,-0.866,0.866,0.5,0,0]);
const DM4=new DOMMatrix([0.5,0.866,-0.866,0.5,0,0]);

function Line() {
  this.x0=0;
  this.y0=0;
  this.a=0;
  this.b=0;
  this.len=8;
  this.t=0;
  this.pathLength=0;
  this.generatePath=()=>{
    this.path=new Path2D();
    this.xpol=[Math.cos,Math.sin][getRandomInt(0,2)];
    if (this.xpol==Math.sin) {
      this.ypol=Math.cos;
    } else {
      this.ypol=[Math.cos,Math.sin][getRandomInt(0,2)];
    }
//console.log(this.xpol.name+" "+this.ypol.name);
    this.Kx=8*Math.random();
    this.Ky=8*Math.random();
//console.log(this.Kx.toFixed(1)+" "+this.Ky.toFixed(1));
    let c=0;
    this.pathLength=0;
    this.path.moveTo(0,0);
    let x=0;
    let y=0;
    do {
      let lx=this.len*this.xpol(this.a);
      let ly=this.len*this.ypol(this.b);
      x+=lx;
      y+=ly;
      this.pathLength+=Math.pow(lx*lx+ly*ly,0.5);
      this.path.lineTo(x,y);
      if (Math.abs(x)>CSIZE || Math.abs(y)>CSIZE) {
//console.log("size "+c+" "+this.pathLength.toFixed(0));
        break;
      }
      if (c>1200) {
//console.log("count"+c+" "+this.pathLength.toFixed(0));
        break;
      }
      this.x0=x;
      this.y0=y;
      this.a=this.Kx*Math.sin(c/20);
      this.b=this.Ky*Math.sin(c/20);
      c++;
    } while(true);
    if (c>1200) this.generatePath();
    else {
    //this.lineLength=Math.min(1000,Math.round(this.pathLength/2));
      this.lineLength=Math.min(800,Math.round(this.pathLength/2));
      this.col=colors[getRandomInt(0,colors.length)];
    }
  }
  this.draw2=()=>{
    let p=new Path2D(this.path);
    p.addPath(p,DM1);
    p.addPath(p,DM2);
    let p2=new Path2D(p);
    p2.addPath(p,DM3);
    p2.addPath(p,DM4);
    ctx.setLineDash([this.lineLength,100000]);    
    ctx.lineDashOffset=this.lineLength-this.t;
    ctx.strokeStyle=this.col;
    //ctx.lineWidth=0.5+7*(this.t/(this.lineLength+this.pathLength));
ctx.lineWidth=8*(this.t/(this.lineLength+this.pathLength));
    ctx.stroke(p2);
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
function animate(ts) {
  if (stopped) return;
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  lines.forEach((l)=>{ 
    l.t+=2;
    l.draw2();
    if (l.t>l.lineLength+l.pathLength) {
      l.generatePath();
      l.t=0;
    }
  });
/*
  if (line.t>line.lineLength+line.pathLength) {
    line.generatePath();
    line.t=0;
  }
  if (line2.t>line2.lineLength+line2.pathLength) {
    line2.generatePath();
    line2.t=0;
  }
*/
  requestAnimationFrame(animate);
}

onresize();
setColors();

const COUNT=6;
const lines=new Array(COUNT);
for (let i=0; i<COUNT; i++) {
  lines[i]=new Line();
  lines[i].generatePath();
}

start();
