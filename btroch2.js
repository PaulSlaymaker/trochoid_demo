"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/BaZeLKN
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
ctx.lineWidth=3;
ctx.strokeStyle="black";

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

var getZeroRadii=()=>{
  let s=[];
//  let ring=Math.round(EDGE*Math.random());
  for (let i=0; i<W+2; i++) {
    s.push(0);
  }
  return s;
}

var getRadii=()=>{
  let s=[];
  let sr=[];
  for (let i=0; i<5*W; i++) sr.push(Math.round(i*EDGE/(W+1)/5));
//    sr.splice(getRandomInt(0,sr.length+1),0,i*EDGE/W/2);
//  for (let i=0; i<4*W; i++) { sr.splice(getRandomInt(0,sr.length),1); }
  for (let i=0; i<W; i++) {
    let idx=getRandomInt(0,sr.length);
    s.push(sr[idx]);
    sr.splice(idx,1); 
  }
  s.sort((a,b)=>{ return a-b; });
  s.unshift(0);
  s.push(EDGE);
return s;
  
}

var colors=[];
var colors2=[];
var getColors=()=>{
  let c=[];
  let cset={
     "2":[2,4],"4":[2,4,8],"6":[2,3,6],"8":[2,4,8],
     "10":[2,5],
     "12":[2,3,4,6],
     "14":[2,7]
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

var Point=function() {
  this.x=0;
  this.y=0;
}

var Quad=function() { this.pts=[new Point(),new Point(),new Point(),new Point()]; }

var drawQuad=(q)=>{
  ctx.beginPath();
  ctx.moveTo((q.pts[0].x+q.pts[1].x)/2,(q.pts[0].y+q.pts[1].y)/2);
  for (let i=0; i<4; i++) {
    let a=(i+1)%4;
    let b=(i+2)%4;
    let cx=q.pts[a].x;
    let cy=q.pts[a].y;
    ctx.bezierCurveTo(cx,cy,cx,cy,(cx+q.pts[b].x)/2,(cy+q.pts[b].y)/2);
  }
}

const EDGE=CSIZE-20;
var C=2*getRandomInt(3,8);
var W=getRandomInt(3,9);
var pts=[];
var quads=[];

var setPoints=()=>{
  pts=[];
//  let radii=getRadii();
  for (let i=0; i<C+2; i++) {
    pts[i]=[];
    for (let j=0; j<W+2; j++) {
      //let r=radii[j];
      let r=j*EDGE/(W+2);
      let z=i*TP/C+j*(TP/C/2);
      pts[i][j]=new Point();
      pts[i][j].x=Math.round(r*Math.cos(z));
      pts[i][j].y=Math.round(r*Math.sin(z));
    }
  }
}

/*
var setRingPoints=()=>{
  pts=[];
  let r=Math.round(EDGE*Math.random()/2);
  for (let i=0; i<C+2; i++) {
    pts[i]=[];
    for (let j=0; j<W+2; j++) {
      let z=i*TP/C+j*(TP/C/2);
      pts[i][j]=new Point();
      pts[i][j].x=Math.round(r*Math.cos(z));
      pts[i][j].y=Math.round(r*Math.sin(z));
    }
  }
}
*/

var cwsign=()=>{ return 1; };
/*
var getTgen=()=>{
  return [
    (i,j)=>{ return j%2; },
    (i,j)=>{ return (i+j)%2; },
    (i,j)=>{ return i%2; },
    (i,j)=>{ return 1; }
  ][getRandomInt(0,4,true)];
}
*/

var getCWSign=()=>{
  return [
    (i,j)=>{ return [-1,1][j%2]; },
    (i,j)=>{ return [-1,1][(i+j)%2]; },
    (i,j)=>{ return [-1,1][i%2]; },
    (i,j)=>{ return 1; }
  ][getRandomInt(0,4,true)];
}


var rf=1;
var kf=1;
var radii=getRadii();
var radii2=getRadii();
var move=()=>{
  for (let i=0; i<C+1; i++) {
    for (let j=0; j<W+1; j++) {
      //let sf=[-1,1][(j)%2];
      let sf=cwsign(i,j);
//let sf=1;
      //let r=radii[j];
      let r=(1-sfrac)*radii[j]+sfrac*radii2[j];
      //let r=(j)*EDGE/(W+1);
      let z=i*TP/C+(j)*(TP/C/2);
      pts[i][j].x=r*Math.cos(z);
      pts[i][j].y=r*Math.sin(z);

      //pts[i][j].x+=sf*r/6*Math.cos(frac*TP+i*TP/C);
      //pts[i][j].y+=sf*r/6*Math.sin(frac*TP+i*TP/C);
//let cwf=6/(C*W);
let cwf=4/(C*W);
//let cwf=2/(C*W);
      pts[i][j].x+=sf*r*cwf*(Math.cos(frac*TP+i*TP/C)/2+Math.cos(kf*frac*TP+i*TP/C)/2);
      pts[i][j].y+=sf*r*cwf*(Math.sin(frac*TP+i*TP/C)/2+Math.sin(kf*frac*TP+i*TP/C)/2);
    }
  }
}

var reset=()=>{
  C=2*getRandomInt(3,8);
  W=getRandomInt(3,9);
  radii=getZeroRadii();
  radii2=getRadii();
  setPoints();
  setQuads2();
  cwsign=getCWSign();
}

var setQuads2=()=>{
  quads=[];
  for (let j=0; j<W; j++) {
    quads[j]=[];
    for (let i=0; i<C; i++) {
      quads[j][i]=new Quad();
      quads[j][i].pts[0]=pts[i+1][j];
      quads[j][i].pts[1]=pts[i][j+1];
      quads[j][i].pts[2]=pts[i][j+2];
      quads[j][i].pts[3]=pts[i+1][j+1];
    }
  }
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<C; i++) {
    for (let j=0; j<W; j++) {
      drawQuad(quads[j][i]);
      ctx.globalAlpha=1-frac;
      ctx.fillStyle=colors2[(j+2*i)%colors2.length];
      ctx.fill();
      ctx.globalAlpha=frac;
      ctx.fillStyle=colors[(j+2*i)%colors.length];
      ctx.fill();
      ctx.globalAlpha=1;
      ctx.stroke();
    }
  }
}

var doReset=false;

var transit=()=>{
  //kf=[1,2,3,4][getRandomInt(0,4)];
  //kf=2*getRandomInt(0,2)+1;
  kf=getRandomInt(1,4);
  rf=[1,3][getRandomInt(0,2)];
  radii=radii2;
  if (!doReset) {
    if (Math.random()<0.2) {
      doReset=true;
      radii2=getZeroRadii();
    } else {
      radii2=getRadii();
    }
  } else {
    reset();
    doReset=false;
  }
  colors2=colors;
  if (Math.random()<0.8) {
    colors=getColors();
  }
}

var frac=1;
var sfrac=1;
var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    if (frac>0) time=performance.now()-frac*duration;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var time=0;
const duration=5000;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  if (ts-time>duration) {
    frac=0;
    sfrac=0;
    time=0;
    transit();
if (EM) stopped=true;
  } else {
    //frac=Math.pow(Math.sin(TP/4*(ts-time)/duration),2);
    frac=(ts-time)/duration;
    let z=TP*frac/4;
    sfrac=(Math.pow(Math.sin(z),2)+Math.pow(Math.sin(rf*z),2))/2;
  }
  move();
  draw();
  requestAnimationFrame(animate);
}

onresize();
colors=getColors();
setPoints();
setQuads2();
move();

if (EM) draw();
else start();
