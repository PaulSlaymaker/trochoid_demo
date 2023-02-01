"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/vYeaajy
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
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.globalAlpha=0.2;

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

var t=0;

var getColors=()=>{
//  let c=["black","white","black"];
  let c=["black","black"];
  //let c=[];
  let colorCount=2;
  let hr=Math.round(60/colorCount);
  let hue=getRandomInt(0,90,true)+30;
  //let hue=getRandomInt(0,360);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-hr,hr);
    let sat=80+getRandomInt(0,21);
    //let lum=40+getRandomInt(0,41);
    //let lum=40+20*Math.pow(Math.cos((hue+60)*TP/360),2);
    let col=(hue+hd)%360;
    let lf=Math.random();
    //let lum=Math.round(30+50*Math.pow(Math.sin((col+90)*TP/360),2));
    let lum=Math.round(60+20*Math.pow(Math.sin((col+90)*TP/360),2));
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+col+","+sat+"%,"+lum+"%)");
  }
//  c.splice(getRandomInt(0,c.length+1),0,"black");
  return c;
}

var SS=4;
var speed=10;
var udms2=[];

const syma=(()=>{
  let ua=[];
  for (let i=0; i<64; i++) {
    let z=i*TP/64;
    ua.push(new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),0,0]));
  }
  return ua;
})();

var setSymmetries=()=>{
  udms2=[];
  for (let i=0; i<2; i++) udms2.push([16,8,4,8,2][getRandomInt(0,5,true)]);
  for (let i=0; i<pda.length; i++) {
    pda[i].sym=udms2[i%2];
  }
/*
  let as=udms2.reduce((a,b)=>{ return a+64/b; });
console.log(as);
  speed=Math.round(1200/as);
*/
}

var SYM=16;

function RPath(col) {
//  this.col=col;
  this.paths=[];
  this.idx=0;
  this.sym=16;
  this.getSymPath=(p)=>{
    let path=new Path2D();
    for (let s=0; s<64; s+=this.sym) {
      path.addPath(p,syma[s]);
    }
    return path;
  }
  this.setPaths=()=>{
    this.paths=[];
    //let x=SS*Math.round((-CSIZE+2*CSIZE*Math.random())/SS);
    //let y=SS*Math.round((-CSIZE+2*CSIZE*Math.random())/SS);
    let x=SS*Math.round(Math.pow(Math.random(),0.5)*(-CSIZE+2*CSIZE*Math.random())/SS);
    let y=SS*Math.round(Math.pow(Math.random(),0.5)*(-CSIZE+2*CSIZE*Math.random())/SS);
//    let s=new Set();
    let p=new Path2D();
    p.rect(x,y,SS,SS);
    p.rect(y,x,SS,SS);
    this.paths.push(this.getSymPath(p));
//    s.add([x,y].toString());
    for (let i=0; i<400; i++) {
      x+=[-SS,0,SS][getRandomInt(0,3)];
      if (Math.abs(x)>CSIZE) continue;
      y+=[-SS,0,SS][getRandomInt(0,3)];
      if (Math.abs(y)>CSIZE) continue;
      let k=[x,y].toString();
//      if (s.has(k)) continue;
      let p=new Path2D();
      p.rect(x,y,SS,SS);
      p.rect(y,x,SS,SS);
//      s.add(k);
      this.paths.push(this.getSymPath(p));
    }
  }
  this.transit=()=>{
//    this.sym=[16,8,4][getRandomInt(0,3,true)];
    this.idx++;
    if (this.idx==this.paths.length) {
      this.setPaths();
      this.idx=0;
    }
  }
  this.setPaths();
}

var getRPath=()=>{
  let x=SS*Math.round((-CSIZE+2*CSIZE*Math.random())/SS);
  let y=SS*Math.round((-CSIZE+2*CSIZE*Math.random())/SS);
  let s=new Set();
  let p=new Path2D();
  p.rect(x,y,SS,SS);
  p.rect(y,x,SS,SS);
  s.add([x,y].toString());
  for (let i=0; i<100; i++) {
    x+=[-SS,0,SS][getRandomInt(0,3)];
    if (Math.abs(x)>CSIZE) continue;
    y+=[-SS,0,SS][getRandomInt(0,3)];
    if (Math.abs(y)>CSIZE) continue;
    let k=[x,y].toString();
    if (s.has(k)) continue;
    p.rect(x,y,SS,SS);
    p.rect(y,x,SS,SS);
    s.add(k);
  }
//console.log(s.size);
  return p;
}

/*
var dc=0;
var draw=()=>{
debugger;
  let path=new Path2D();
  let p=getRPath();
  for (let s=0; s<64; s+=8) {
    path.addPath(p,syma[s]);
  }
  ctx.fillStyle=colors[dc++%colors.length];
  ctx.fill(path);
}
*/

var colors=getColors();

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    colors=getColors();
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var animate=(ts)=>{
  if (stopped) return;
  t++;
  if (t==400) {
    t=0;
    colors=getColors();
//    SYM=[16,8,4,8,2][getRandomInt(0,5,true)];
    setSymmetries();
if (EM) stopped=true;
  }
  for (let i=0; i<pda.length; i++) {
    pda[i].transit();
    ctx.fillStyle=colors[i%colors.length];
    ctx.fill(pda[i].paths[pda[i].idx]);
  }
//  if (t%1000==0) setSymmetries();
  requestAnimationFrame(animate);
}

onresize();

var pda=[];
for (let i=0; i<45; i++) {
  pda.push(new RPath(i));
}

setSymmetries();

start();
