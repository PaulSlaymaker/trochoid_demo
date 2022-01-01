"use strict"; // Paul Slaymaker, paul25882@gmail.com
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
ctx.lineWidth=2;
ctx.strokeStyle="white";

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

var colors=[];
var colors2=[];
var getColors=()=>{
  let c=[];
  let cset={
     "2":[2,4],"4":[2,4,8],"6":[2,3,6],"8":[2,4,8],
     "10":[2,5],
     "12":[2,3,4,6],
     "14":[2,7],
     "16":[2,4,8],
     "18":[2,3,6]
  };
  let colorCount=cset[C][getRandomInt(0,cset[C].length)];
  let hue=getRandomInt(0,90,true)+30;
  let colorSeg=Math.round(360/colorCount);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-40,40);
    let sat=70+getRandomInt(0,31);
    let lum=48+getRandomInt(0,31);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}

var RadiusPaths=function(r,idx) {
  this.idx=idx;
  // just an array of paths
}

var Quad=function(r1,r2,r3,a) { 
  this.r1=r1;
  this.r2=r2;
  this.r3=r3;
  let ad=r2.idx%2?a:TP/2/C+a;
  this.dm=new DOMMatrix([Math.cos(ad),Math.sin(ad),-Math.sin(ad),Math.cos(ad),0,0]);
  this.getPaths=()=>{
    let p1=new Path2D();
    let p2=new Path2D();
    p1.addPath(r2.path,this.dm);
    p2.addPath(r2.path2,this.dm);
    return {"path1":p1,"path2":p2 };
  }
/*
  this.getPath=()=>{
    let p=new Path2D();
    let ad=r2.idx%2?a:TP/2/C+a;
    p.addPath(r2.path,new DOMMatrix([Math.cos(ad),Math.sin(ad),-Math.sin(ad),Math.cos(ad),0,0]));
    return p;
  }
  this.getPath2=()=>{
    let p=new Path2D();
    let ad=r2.idx%2?a:TP/2/C+a;
    p.addPath(r2.path2,new DOMMatrix([Math.cos(ad),Math.sin(ad),-Math.sin(ad),Math.cos(ad),0,0]));
    return p;
  }
*/
}

//var C=2*getRandomInt(4,9);
var C=12;
var W=12;
//var W=2*getRandomInt(3,8);
//var W=2*getRandomInt(3,12);

var quads=[];
var setQuads3=()=>{
  quads.length=W;
  for (let j=0; j<W; j++) {
    quads[j]=[];
    for (let i=0; i<C; i++) {
      quads[j][i]=new Quad(rad[0+j],rad[1+j],rad[2+j],i*TP/C);
    }
  }
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  ctx.fillStyle="#00000018";
//  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let getColorPath=(n)=>{ return (new Array(n)).fill().map(()=>{ return new Path2D(); }); }
  //let cpaths=(new Array(colors.length)).fill().map(()=>{ return new Path2D(); });
  let cpaths=getColorPath(colors.length);
  let cpaths2=getColorPath(colors2.length);
  let circles=new Path2D();
  for (let i=0; i<C; i++) {
    for (let j=0; j<W; j++) {
      let p=quads[j][i].getPaths();
      if (j<colorStep) cpaths2[(j+2*i)%colors2.length].addPath(p.path1);
      else cpaths[(j+2*i)%colors.length].addPath(p.path1);
      circles.addPath(p.path2);
/*
      paths[(j+2*i)%colors.length].addPath(quads[j][i].getPath());
      circles.addPath(quads[j][i].getPath2());
*/
    }
  }
  for (let i=0; i<cpaths.length; i++) {
    ctx.fillStyle=colors[i];
    ctx.fill(cpaths[i]);
  }
  if (colorStep) {
    for (let i=0; i<cpaths2.length; i++) {
      ctx.fillStyle=colors2[i];
      ctx.fill(cpaths2[i]);
    }
  }
  ctx.fillStyle="#00000096";
  ctx.fill(circles);
  ctx.stroke(circles);
}

//var ring=getRandomInt(0,CSIZE);
//var step=0;
var colorStep=0;
var transit=()=>{
  if (colorStep) {
    colorStep+=2;
    if (colorStep>W) {
      colorStep=0;
      colors=colors2.slice();
    }
  }
/*
  if (step) {
    C=2*getRandomInt(3,10);
    W=C;
    ra1.length=W+2;
    ra1.fill(ring);
    setRadii2();
    step=0;
    setRadiusArray();
    setQuads3();
    colors=getColors();
  } else {
*/
    ra2.pop();
    ra2.pop();
    ra2.unshift(0);
    ra2.unshift(0);
    ra1.forEach((r,i)=>{ ra1[i]=ra2[i]; });
/*
    if (Math.random()<0.2) {
      ring=getRandomInt(0,CSIZE);
      ra2.fill(ring);
      step=1;
    } else {
      setRadii2();
    }
*/
  setRadii2();
  colors.unshift(...colors.splice(colors.length-2,2))
  colors2.unshift(...colors2.splice(colors2.length-2,2))
//    colors.unshift(colors.pop());
//    colors.unshift(colors.pop());
//  }
  if (!colorStep && Math.random()<0.4) {
    colorStep=2;
    colors2=getColors();
  }
//  setRadiiPathsT();
}

function cFrac(frac) {
  let f1=.2;
  let f2=.8;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var t=0;
var animate=()=>{
  if (stopped) return;
  t++;
  if (t==dur) {
    t=0;
    transit();
if (EM) stopped=true;
  }
  setRadiiPathsT();
  draw();
  requestAnimationFrame(animate);
}

var ra1=[];
var setRadii1=()=>{
  ra1.length=0;
  ra1.push(...[0,0,0,0,CSIZE]);
  for (let i=0; i<W-3; i++) {
    ra1.push(Math.round(CSIZE*Math.random()*Math.random()));
  }
  ra1.sort((a,b)=>{ return a-b; });
}

var ra2=[];
var setRadii2=()=>{
  ra2.length=0;
  ra2.push(...[0,CSIZE,CSIZE,CSIZE,CSIZE]);
  for (let i=0; i<W-3; i++) {
    ra2.push(Math.round(CSIZE*Math.random()*Math.random()));
//    ra2.push(Math.round(CSIZE*Math.pow(Math.random(),1.7)));
  }
  ra2.sort((a,b)=>{ return a-b; });
}

var rad=[];

var setRadiusArray=()=>{
  rad.length=W+2;
  for (let i=0; i<W+2; i++) {
    rad[i]=new RadiusPaths(ra1[i],i);
  }
}

var dur=120;
var setRadiiPathsT=()=>{
  let f2=cFrac(t/dur);
//  let f2=1-Math.cos(TP/4*t/dur);
  let f1=1-f2;
  for (let i=1; i<W+1; i++) {
    let x1=f1*ra1[i-1]+f2*ra2[i-1];
    let x2=(f1*ra1[i]+f2*ra2[i])*Math.cos(TP/2/C);
    let x3=Math.round(f1*ra1[i+1]+f2*ra2[i+1]);
    let y=(f1*ra1[i]+f2*ra2[i])*Math.sin(TP/2/C);
    rad[i].path=new Path2D();
    rad[i].path.moveTo((x1+x2)/2,y/2);
    rad[i].path.bezierCurveTo(x2,y,x2,y,(x2+x3)/2,y/2);
    rad[i].path.bezierCurveTo(x3,0,x3,0,(x2+x3)/2,-y/2);
    rad[i].path.bezierCurveTo(x2,-y,x2,-y,(x1+x2)/2,-y/2);
    rad[i].path.bezierCurveTo(x1,0,x1,0,(x1+x2)/2,y/2);
    let dr=Math.min(x2-x1,x3-x2,y)/1.5;
    rad[i].path2=new Path2D();
    if (dr>0) {
      rad[i].path2.moveTo(x2+dr,0);
      rad[i].path2.arc(x2,0,dr,0,TP);
    }
  }
}

onresize();

setRadiusArray();
setQuads3();
setRadii1();
setRadii2();
setRadiiPathsT();
colors=getColors();
colors2=getColors();

if (EM) draw();
else start();
