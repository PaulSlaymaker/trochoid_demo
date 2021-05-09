"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const CSIZE=400;

var createContext=()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  let context=c.getContext("2d");
  return context;
}
const ctx=createContext();
const ctx2=createContext();

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="0 auto";
  co.style.border="20px double #666";
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
    canvs.item(i).style.width=D-40+"px";
    canvs.item(i).style.height=D-40+"px";
  }
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const RATE=720;

function Cycle3(direction) {
  this.cnum=0;
  this.path=(()=>{
  let F=1.74;
    let p2d=new Path2D();
    for (let i=0; i<3; i++) {
      let x=2*R*Math.cos(i*TP/3);
      let y=2*R*Math.sin(i*TP/3);
      p2d.moveTo(x+F*R,y);
      p2d.arc(x,y,F*R,0,TP);
//p2d.moveTo(x+R,y);
//p2d.arc(x,y,R,0,TP);
//p2d.moveTo(x+R/3.5,y);
//p2d.arc(x,y,R/3.5,0,TP);
    }
    return p2d;
  })();
  this.t=0;
  this.increment=()=>{ this.t=++this.t%RATE; }
  this.getRadial=()=>{ return direction*this.t/RATE*TP; }
  this.dm=new DOMMatrix([1,0,0,1,this.x,this.y]);
  this.draw=()=>{
    let dp=new Path2D();
    let z=this.getRadial();
    this.dm.a=Math.cos(z),this.dm.b=Math.sin(z),this.dm.c=-Math.sin(z),this.dm.d=Math.cos(z);
    dp.addPath(this.path,this.dm);
    //ctx2.fillStyle=colors1[this.cnum];
    ctx2.fillStyle=colors.cols[this.cnum];
    ctx2.fill(dp);
return dp;
  }
}

var colors={
  hues:[],
  cols:[],
  set:()=>{
    let n=getRandomInt(3,7);
    let h=getRandomInt(0,360);
    let hd=getRandomInt(90,270);
    for (let i=0; i<n; i++) {
      let hue=(h+i*hd)%360;
      colors.hues.push(hue);
      colors.cols.push("hsl("+hue+",70%,40%)");
    }
  },
  increment:()=>{
    for (let i=0; i<colors.cols.length; i++) {
      colors.hues[i]=++colors.hues[i]%360;
      colors.cols[i]="hsl("+colors.hues[i]+",70%,40%)";
    }
  }
};
colors.set();

const R=40;

var circles=[];

var setCycles=()=>{
  circles=[];
  let count=Math.round(2*CSIZE/(Math.cos(TP/12)*4*R));
  for (let i=0,c=0; i<count; i++) {
    for (let j=0; j<2*count; j++,c++) {
      let dir=[-1,1][j%2];
      let g=new Cycle3(dir);
      g.dm.e=2*R+((j+1)%4<2?(-4+i*8):i*8)*R*Math.cos(TP/12);
      g.dm.f=4*R*((j%2)+j)/2*Math.sin(TP/12)+4*R*(((j+1)%2)+j-1)/2;
      g.t=(j%2)*RATE/2;
      //g.cnum=c%colors1.length;
      g.cnum=c%colors.cols.length;
      circles.push(g); 
    }
  }
}
setCycles();

let hue=getRandomInt(0,360);
ctx.fillStyle="hsl("+hue+",100%,50%)";
ctx.lineWidth=3;
var draw=()=>{
  ctx.clearRect(0,0,2*CSIZE,2*CSIZE);
  ctx2.clearRect(0,0,2*CSIZE,2*CSIZE);
  let path=new Path2D();
  for (let i=0; i<circles.length; i++) {
    circles[i].increment(); 
    //circles[i].draw(); 
    path.addPath(circles[i].draw());
  }
//ctx2.fill(path);
  ctx.fill(path,"evenodd");
  ctx.stroke(path);
}

var reset=()=>{
  colors1=setColors();
  setCycle3s();
}

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  draw();
  if (++t==10) {
    ctx.fillStyle="hsl("+(++hue)+",100%,50%)";
    colors.increment();
    t=0;
  }
  requestAnimationFrame(animate);
}

var stopped=true;
var start=()=>{
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

onresize();
start();
//draw();
