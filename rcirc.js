"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;

var ctx=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  let co=document.createElement("div");
  co.style.textAlign="center";
  co.append(c);
  body.append(co);
  return c.getContext("2d");
})();

ctx.translate(CSIZE,CSIZE);
ctx.fillStyle="#AAD";
ctx.strokeStyle="white";

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
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

var Curve=function() {
  this.r=CSIZE*Math.random();
  this.n=4*getRandomInt(1,12);
  //this.m=0.6+(0.4-0.8*Math.random());
  this.m=1+(0.6-1.2*Math.random());	// fade
  //this.f1=[1,5,9,13][getRandomInt(1,4)];
  //this.f2=[1,5,9,13][getRandomInt(1,4)];
  this.f1=1;
  this.f2=1;
  this.v=6;
  this.hue=getRandomInt(0,360);
  this.points=[];
  this.randomize=()=>{ 
    if (this.v==4) this.n=4*getRandomInt(1,12);
    else if (this.v==6) this.n=6*getRandomInt(1,8);
    else if (this.v==8) this.n=8*getRandomInt(1,6);
    else this.n=12*getRandomInt(1,4);
    //this.n=10*getRandomInt(1,6);
    this.n=6*getRandomInt(1,10);
    this.m=0.6+(0.4-0.8*Math.random());
    //this.m=0.8+(0.5-Math.random());	// fade
    this.hue=getRandomInt(0,360);
    let mult={
      4:[1,5,9,13,17,21,25,29,33,37],
      6:[1,7,13,19,25,31,37],
      8:[1,9,17,25,33],
      12:[1,13,25,37]
    }
    this.f1=mult[this.v][getRandomInt(0,mult[this.v].length)];
    this.f2=mult[this.v][getRandomInt(0,mult[this.v].length)];
//    this.f2=[1,7,13,19,25,31][getRandomInt(1,6)];
  }
  this.getX=(t)=>{ 
    //return this.r*(Math.cos(t)+Math.cos(5*t))/2;
    //return this.r*Math.cos(t);
    let q=Math.pow(this.r/CSIZE,3);
    return this.r*(q*Math.cos(t)+(1-q)/2*(Math.cos(this.f1*t)+Math.cos(this.f2*t)));
  }
  this.getY=(t)=>{ 
    //return this.r*(Math.sin(t)+Math.sin(5*t))/2;
    //return this.r*Math.sin(t);
    //let q=this.r/CSIZE;
    let q=Math.pow(this.r/CSIZE,3);
    return this.r*(q*Math.sin(t)+(1-q)/2*(Math.sin(this.f1*t)+Math.sin(this.f2*t)));
  }
}

var curves=[
  new Curve(),new Curve(),new Curve(),
  new Curve(),new Curve(),new Curve(),
  new Curve(),new Curve(),new Curve()
];
var points=[];
var setPoints=()=>{
  points=[];  // each curve
for (let i=0; i<curves.length; i++) {
  let md=Math.min(CSIZE-curves[i].r,curves[i].r);
  for (let t=0; t<Math.PI*2-0.001; t+=TP/curves[i].n) {   // to curve
    let x=curves[i].getX(t);
    let y=curves[i].getY(t);
    //points.push({"x":x,"y":y,"md":CSIZE-curves[i].r,"d":[]});
    points.push({"x":x,"y":y,"hue":curves[i].hue,"md":md,"d":[]});
  }
}
  for (let j=0; j<points.length; j++) {
    for (let k=j+1; k<points.length; k++) {
      let d=Math.pow(Math.pow(points[j].x-points[k].x,2)+Math.pow(points[j].y-points[k].y,2),0.5);
      points[j].d.push(d);
      points[k].d.push(d);
    }
  }
  for (let i=0; i<points.length; i++) {
    //points[i].d.sort((a,b)=>{ return a.m-b.m; });
    //points[i].d.sort((a,b)=>{ return a-b; });
    //let mind=CSIZE-curves[0].r;
    let mind=points[i].md;
    for (let j in points[i].d) {
      mind=Math.min(mind,points[i].d[j]);
    }
    points[i]["mr"]=mind;
  }
}

var getR=(pt)=>{
  //let d=Math.min(pt.d[0]/2,CSIZE-Math.max(Math.abs(pt.x),Math.abs(pt.y)));
  let d=Math.min(pt.mr/2,CSIZE-Math.max(Math.abs(pt.x),Math.abs(pt.y)));
  if (d<0) d=0;
  return d;
}

var draw=()=>{
  setPoints();
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
ctx.fillStyle="hsla(0,0%,0%,0.05)";   // fade
ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<points.length; i++) {
    let r=getR(points[i]);
    if (r==0) continue;
    ctx.beginPath();
    ctx.moveTo(points[i].x+r,points[i].y);
    ctx.arc(points[i].x,points[i].y,r,0,TP);
    ctx.closePath();
    //ctx.fillStyle="hsl("+(hue+360*r/80)+",80%,70%)"; // fade
    ctx.fillStyle="hsl("+points[i].hue+",92%,60%)"; 
    ctx.fill();
  }
}

var stopped=true;
var start=()=>{
  if (stopped) {
    stopped=false;
    stx=0;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var stx=0;
var frac=0;
var duration=6000;
var animate=(ts)=>{
  if (stopped) return;
  if (!stx) stx=ts;
  let progress=ts-stx;
  if (progress<duration) {
  } else {
    stx=0;
    if (EM) stopped=true;
  }
  draw();
  for (let i=0; i<curves.length; i++) {
    curves[i].r+=curves[i].m;
    if (curves[i].r>CSIZE) {
      curves[i].r=0;
      curves[i].randomize();
    }
  }
  if (Math.random()<0.001) {
    //let v=[4,6,12][getRandomInt(0,3)];
    let v=6;
    if (curves[0].v==6) v=12;
    else if (curves[0].v==8) v=4;
    else if (curves[0].v==4) v=[8,12][getRandomInt(0,2)];
    else v=[4,6][getRandomInt(0,2)];
    for (let i=0; i<curves.length; i++) {
      curves[i].v=v;
    }
  }
  requestAnimationFrame(animate);
}

var hue=getRandomInt(0,360);
var reset=()=>{
  hue=getRandomInt(0,360);
}

onresize();
reset();
if (EM) draw();
else start();
