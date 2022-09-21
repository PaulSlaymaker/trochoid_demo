"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/bGMgjmQ
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

// possible additions: random brush speed, and complementary path (cross shape)

var Brush=function(idx) {
  this.o1=getRandomInt(0,speed*5);
  this.o2=(this.o1+20+getRandomInt(0,220))%(speed+5);
  this.doff=TP*Math.random();
  this.getPath=()=>{
//    let o2t=this.o1+200*Math.sin(tk/100);
    this.o2=this.o1+300*Math.sin(tk/2000+this.doff);
    let p=new Path2D();
    let pt=getPoint(this.o1);
    let pt2=getPoint(this.o2);
    p.moveTo(pt.x,pt.y);
    p.lineTo(pt2.x,pt2.y);
    return getSymPath(p);
  }
}

var hues=[];
var colors=[];
var setHues=()=>{
  let colorCount=4;
  let hue=getRandomInt(180,270);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(180/colorCount)*i+getRandomInt(-10,10);
    let h=(hue+hd)%360;
    hues.splice(getRandomInt(0,hues.length+1),0,h);
  }
}
setHues();
colors[0]="hsl("+hues[0]+",90%,50%)";
colors[1]="hsl("+hues[1]+",90%,50%)";
colors[2]="hsl("+hues[2]+",90%,50%)";
colors[3]="hsl("+hues[3]+",90%,50%)";

/*
var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,8,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}
*/

const dm0=new DOMMatrix([0.5,0,0,0.5,200,200]);
const dm1=new DOMMatrix([-0.5,0,0,0.5,-200,200]);
const dm2=new DOMMatrix([-0.5,0,0,-0.5,-200,-200]);
const dm3=new DOMMatrix([0.5,0,0,-0.5,200,-200]);
var getSymPath=(p)=>{
  let sympath=new Path2D();
  sympath.addPath(p,dm0);
  sympath.addPath(p,dm1);
  sympath.addPath(p,dm2);
  sympath.addPath(p,dm3);
  return sympath;
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
var tk=0;
function animate(ts) {
  if (stopped) return;
  t++;
  tk++;
  if (t==5*speed) t=0;	//4*t/speed==20
  if (tk%20==0) for (let i=0; i<hues.length; i++) {
    hues[i]=++hues[i]%360;
    colors[i]="hsl("+hues[i]+",100%,50%)";
  }
  draw();
  requestAnimationFrame(animate);
}

var R=CSIZE/3;

/*
var drawPath=()=>{
  ctx.beginPath();
  ctx.lineWidth=1;
  ctx.strokeStyle="yellow";
  ctx.moveTo(2*R,-R);
  ctx.arc(2*R,0,R,3*TP/4,TP/4,true);
  ctx.arc(2*R,2*R,R,3*TP/4,TP/2);
  ctx.arc(0,2*R,R,0,TP/2,true);
  ctx.arc(-2*R,2*R,R,0,3*TP/4);
  ctx.arc(-2*R,0,R,TP/4,3*TP/4,true);
  ctx.arc(-2*R,-2*R,R,TP/4,0);
  ctx.arc(0,-2*R,R,TP/2,0,true);
  ctx.arc(2*R,-2*R,R,TP/2,TP/4);
  ctx.stroke();
}
*/

/*
1, 3, 2, 3, 2, 3, 2, 3, 1
1, 4, 6, 9,11,14,16,19,20	5*TP
*/

/*
var COUNT=1;
for (let i=0; i<COUNT; i++) {
  let ga=i*5*TP/COUNT;
  if ((ga-TP/4)/(TP/4)<0) console.log("use 0"); 
  if ((ga-TP/4)/(TP/4)<3) console.log("use 1"); 
  if ((ga-TP/4)/(TP/4)<5) console.log("use 1"); 
}
*/

var speed=200;

//var s=0;

var getPoint=(o)=>{
  let t2=(t+o)%(speed*5);
  let z=TP*(t2)/speed;
  let s=4*(t2)/speed;	// arc segment
       if (s<1) return {"x":-2*R+R*Math.cos( z),"y":    R*Math.sin( z)};
  else if (s<4) return {"x":-2*R+R*Math.cos(-z),"y":2*R+R*Math.sin(-z)};
  else if (s<6) return {"x":R*Math.cos(z+TP/2),"y":2*R+R*Math.sin(z+TP/2)};
  else if (s<9) return {"x":2*R+R*Math.cos(-z),"y":2*R+R*Math.sin(-z)};
  else if (s<11) return {"x":2*R+R*Math.cos(z),"y":R*Math.sin(z)};
  else if (s<14) return {"x":2*R+R*Math.cos(-z),"y":-2*R+R*Math.sin(-z)};
  else if (s<16) return {"x":R*Math.cos(z+TP/2),"y":-2*R+R*Math.sin(z+TP/2)};
  else if (s<19) return {"x":-2*R+R*Math.cos(-z),"y":-2*R+R*Math.sin(-z)};
  else if (s<20) return {"x":-2*R+R*Math.cos(z),"y":R*Math.sin(z)};
  else stopped=true;
}

ctx.globalAlpha=0.3;

var draw=()=>{
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  //ctx.fillStyle="#00000008";
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  //drawPath();

  for (let i=0; i<ba.length; i++) {
    if (i%2) ctx.strokeStyle="black";
    else ctx.strokeStyle=colors[(i/2)%colors.length];
    ctx.stroke(ba[i].getPath());
  }
}

var ba=[
  new Brush(),new Brush(),
  new Brush(),new Brush(),
  new Brush(),new Brush()
];

onresize();

ctx.lineWidth=6;
//draw();
start();

