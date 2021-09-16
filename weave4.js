"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
body.style.display="grid";
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.border="8px gray outset";
  d.append(c);
  return c.getContext("2d");
})();

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

onresize=function() { 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

const COUNT=16;	// factor of CSIZE?, 8,10,16,20,..
var edge=360;

var colors=[];	// as object
var setColors=()=>{
  colors=[];
  let colorCount=getRandomInt(2,COUNT/2+1,true);
  let hue=getRandomInt(0,90,true)+30;
  let colorSeg=Math.round(360/colorCount);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-40,40);
    let sat=70+getRandomInt(0,31);
    let lum=48+getRandomInt(0,31);
    colors.push("hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
}

var cindexh=[];
var cindexv=[];
var setColorIndexes=()=>{
  cindexh=[];
  cindexv=[];
  for (let i=0; i<COUNT/2-1; i++) {
    cindexh.push(i%colors.length);
    cindexv.push(i%colors.length);
  }
  let no=[];
  do no.push(cindexh.splice(getRandomInt(0,cindexh.length),1)[0]);
  while (cindexh.length>0);
  cindexh=no;
  no=[];
  do no.push(cindexv.splice(getRandomInt(0,cindexv.length),1)[0]);
  while (cindexv.length>0);
  cindexv=no;
}

setColors();
setColorIndexes();

//var restCount=0;

function Line(vh,x,y,r) {
  this.vh=vh;
  this.x=x;
  this.y=y;
  if (this.vh=="h") this.color=colors[cindexh[r]];
  else this.color=colors[cindexv[r]];
  this.o=0;
  this.r=r;
  this.inc=0;
  this.delay=0;

/*
var gradient=ctx.createLinearGradient(0,y-24,0,y+24);
if (vh=="v") gradient=ctx.createLinearGradient(x-24,0,x+24,0);
gradient.addColorStop(0, this.color);
gradient.addColorStop(0.5, "hsla(0,100%,100%,0.2)");
gradient.addColorStop(1, this.color);
this.color=gradient;
*/

  this.drawLine=()=>{ 
    ctx.beginPath();
    let ease=this.o*Math.sin(Math.PI/(400-this.delay)*(Math.max(0,t-this.delay)));
    if (vh=="h") {
//      ctx.moveTo(-edge+this.o,this.y);
//      ctx.lineTo(edge+this.o,this.y);
      ctx.moveTo(-edge+ease,this.y);
      ctx.lineTo(edge+ease,this.y);
    } else {
      //ctx.moveTo(this.x,-edge+this.o);
      //ctx.lineTo(this.x,edge+this.o);
      ctx.moveTo(this.x,-edge+ease);
      ctx.lineTo(this.x,edge+ease);
    }
    ctx.strokeStyle=this.color;
    ctx.stroke();
  }
  this.move=()=>{
    if (Math.abs(this.o)>2*CSIZE) {
/*
      if (Math.random()<0.5) this.o=-this.o;
      else this.inc=-this.inc;
*/
//this.inc=-this.inc;
      this.o=-this.o;
      if (this.vh=="h") this.color=colors[cindexh[this.r]];
      else this.color=colors[cindexv[this.r]];
    }
    if (t>this.delay) {
      this.o+=this.inc;
      if (this.inc!=0 && Math.abs(this.o)<0.1) {
	this.inc=0;
//	restCount++;
	this.o=0;
      }
    }
  }
}

var linesh=(()=>{
  let a=[],b=[];
  for (let i=0; i<COUNT/2-1; i++) { 
    a.push(new Line("h",0,-CSIZE+CSIZE/COUNT+(i+1)*2*CSIZE/COUNT,i));
    b.unshift(new Line("h",0,CSIZE+CSIZE/COUNT-(i+2)*2*CSIZE/COUNT,i));
  }
  return a.concat(b);
})();

var linesv=(()=>{
  let a=[],b=[];
  for (let i=0; i<COUNT/2-1; i++) { 
    a.push(new Line("v",-CSIZE+CSIZE/COUNT+(i+1)*2*CSIZE/COUNT,0,i));
    b.unshift(new Line("v",CSIZE+CSIZE/COUNT-(i+2)*2*CSIZE/COUNT,0,i));
  }
  return a.concat(b);
})();

const WIDTH=512/COUNT;	// depends on CSIZE
ctx.shadowColor="black";
//ctx.shadowColor="hsla(0,0%,0%,0.2)";
ctx.lineWidth=WIDTH;
ctx.shadowBlur=WIDTH/4;
//ctx.globalCompositeOperation = "destination-over";

//var SOL=3*WIDTH/4;
var SOL=2;
var SOP=2;

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.save();
  ctx.clip(grid2);
  linesh.forEach((l)=>{ l.drawLine(); });
  ctx.shadowOffsetX=SOP;
  ctx.shadowOffsetY=SOL;
  linesv.forEach((l)=>{ l.drawLine(); });
  ctx.restore();
  ctx.save();
  ctx.clip(grid1);
  linesv.forEach((l)=>{ l.drawLine(); });
  ctx.shadowOffsetX=SOL;
  ctx.shadowOffsetY=SOP;
  linesh.forEach((l)=>{ l.drawLine(); });
  ctx.restore();
}

var randomizeLines=()=>{
  let ih=[], iv=[];
  for (let i=0; i<COUNT/2-1; i++) { 
    let inc=Math.round(6*(Math.random()+0.6))*[-1,1][getRandomInt(0,2)];
    //let d=Math.round(400-1600/Math.abs(inc));
ih.push(inc);
//    linesh[i].inc=inc;
//    linesh[i].delay=d;
    let q=COUNT-i-3;
//    linesh[q].inc=-inc;
//    linesh[q].delay=d;
    inc=Math.round(6*(Math.random()+0.6))*[-1,1][getRandomInt(0,2)];
iv.push(inc);
/*
    let d=Math.round(400-1600/Math.abs(inc));
    linesv[i].inc=inc;
    linesv[i].delay=d;
    linesv[q].inc=-inc;
    linesv[q].delay=d;
*/
  }
  var cent=(b,a)=>{ return Math.abs(a)-Math.abs(b) };
  var per=(a,b)=>{ return Math.abs(a)-Math.abs(b) };
//ih.sort((b,a)=>{ return Math.abs(a)-Math.abs(b) });
  if (Math.random()<0.4) ih.sort(cent);
  else if (Math.random()<0.5) ih.sort(per);
  if (Math.random()<0.4) iv.sort(cent);
  else if (Math.random()<0.5) iv.sort(per);
  for (let i=0; i<COUNT/2-1; i++) {
    let z=COUNT/2-i-2;
    ih.push(-ih[z]);
    iv.push(-iv[z]);
  }
  for (let i=0; i<COUNT-2; i++) {
    linesh[i].inc=ih[i];
    linesh[i].delay=Math.round(400-1600/Math.abs(ih[i]));
    linesv[i].inc=iv[i];
    linesv[i].delay=Math.round(400-1600/Math.abs(iv[i]));
  }
}

var pauseTS=0;
var pause=(ts)=>{
  if (stopped) return;
  if (pauseTS==0) pauseTS=performance.now()+1000
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    pauseTS=0;
    requestAnimationFrame(animate);
  }
}

var t=0;
var stopped=true;
var duration=2000;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  linesh.forEach((l)=>{ l.move(); });
  linesv.forEach((l)=>{ l.move(); });
  draw();
  //if (restCount==2*(COUNT-2)) {
  if (t>400) {
    randomizeLines();
//    restCount=0;
//console.log(t);
    t=0;
    setColors();
    setColorIndexes();
    requestAnimationFrame(pause);
  } else requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    stopped=false;
    pauseTS=0;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

onresize();

let grid1=new Path2D();
let grid2=new Path2D();
let SE=2*CSIZE/COUNT;
for (let i=0; i<COUNT; i++) { 
  for (let j=0; j<COUNT; j++) { 
    if ((i+j)%2==0) {
      grid1.rect(-CSIZE+i*SE, -CSIZE+j*SE, SE, SE);
    } else {
      grid2.rect(-CSIZE+i*SE, -CSIZE+j*SE, SE, SE);
    }
  }
}

randomizeLines();
start();
