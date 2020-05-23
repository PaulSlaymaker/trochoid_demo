"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);

onresize=function() { 
  let cfs=ctx.fillStyle;
  canvas.width=window.innerWidth; 
  canvas.height=window.innerHeight; 
  ctx.fillStyle=cfs;
  setPoints();
//  stopped=true;
//  draw(1);
}

const canvas=(()=>{
  let c=document.createElement("canvas");
  c.title="click to stop/start new design";
  body.append(c);
  return c;
})();

body.style.margin="0";
body.style.cursor="pointer";

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

canvas.width=window.innerWidth; 
canvas.height=window.innerHeight; 
var ctx=canvas.getContext('2d');
ctx.lineWidth=3;

var pts=[];
var R=120;
var KX=120,KXS=80;
var KX2=120,KXS2=80;
var KY=120,KYS=80;
var KY2=120,KYS2=80;
var V=6;
var V2=6;
var Z=0,Z2=0;
//var S=0;

var setPoints=()=>{
  pts=[];
  let O=(1+Math.random())/2;
  let O2=(1+Math.random())/2;
  for (let x=-3*R; x<canvas.width+3*R; x+=O*R) {
    for (let y=-3*R; y<canvas.height+3*R; y+=O2*R) { 
//if (Math.random()<0.05) continue;
pts.push([x,y]); }
  }
}

var randomizeColor=()=>{
  var light="hsl("+getRandomInt(0,360)+",70%,70%)";
  var dark="hsl("+getRandomInt(0,360)+",30%,30%)";
  if (Math.random()<0.5) {
    ctx.fillStyle=light;
    body.style.background=dark;
  } else {
    ctx.fillStyle=dark;
    body.style.background=light;
  }
}

var randomK=()=>{
  let k=()=>{ return R+80-Math.floor(160*Math.random()); }
  if (KX==0 || KX2==0) {
    if (KX==0) { V=getRandomInt(2,8,true); }
    if (KX2==0) { V2=getRandomInt(2,8,true); }
    KX=k();
    KY=k();
    KX2=k();
    KY2=k();
  } else {
    let rnd=Math.random();
    if (rnd<0.2) {
      KX=0;
      KY=0;
      KX2=k();
      KY2=k();
    } else if (rnd<0.4) {
      KX2=0;
      KY2=0;
      KX=k();
      KY=k();
    } else if (rnd<0.7) {
      KX=k();
      KY=k();
      KX2=k();
      KY2=k();
    } else {
      KX=k();
      KY=k();
      KX2=KX;
      KY2=KY;
    }
  }
}

/*
var randomKO=()=>{
  KX=k();
  KY=k();
  if (KX2==0) { 
    V2=getRandomInt(2,8); 
  }
  if (Math.random()<0.3) {
    KX2=0;
    KY2=0;
  } else if (Math.random()<0.7) {
    KX2=k();
    KY2=k();
  } else {
    KX2=KX;
    KY2=KY;
  }
}
*/

var randomZ=()=>{
  if (Math.random()<0.1) {
    Z=Math.PI*Math.random();
  } else {
    Z=0;
  }
}

/*
var randomS=()=>{
  if (Math.random()<0.3) {
    S=getRandomInt(2,7)
  } else {
    S=0;
  }
}
*/

var randomizeTess=()=>{
  //R=getRandomInt(120,240);
  R=getRandomInt(160,240);
  randomK();
  V=getRandomInt(2,8,true);
  V2=getRandomInt(2,8,true);
  randomZ();
  //randomS();
}

function cbLoc(p1,p2,frac) {
  var f1=.2;
  var f2=.8;
  var e1=Math.pow(1-frac,3)*p1;
  var e2=3*frac*Math.pow(1-frac,2)*(p1+(p2-p1)*f1);
  var e3=3*(1-frac)*Math.pow(frac,2)*(p1+(p2-p1)*f2);
  var e4=Math.pow(frac,3)*p2;
  return e1+e2+e3+e4;
}

var polyL=(x,y,xFrac,yFrac)=>{
  let v=V+1;
  ctx.moveTo(
    x+xFrac*(Math.sin(0)+Math.sin(0)),
    y+yFrac*(Math.cos(0)+Math.cos(0))
  );
  for (let j=0; j<=2*v; j++) {
    ctx.lineTo(
      x+xFrac*(Math.sin(j*Math.PI/v)+Math.sin(3*j*Math.PI/v)),
      y+yFrac*(Math.cos(j*Math.PI/v)+Math.cos(3*j*Math.PI/v)),
    );
  }
}

var polyN=(x,y,xFrac,yFrac,vn,z)=>{
  ctx.moveTo(x+xFrac*Math.sin(0+z),y+yFrac*Math.cos(0+z));
  for (let j=0; j<=2*vn; j++) {
//if (j%2==0) continue;
    ctx.lineTo(
      x+xFrac*Math.sin(j*Math.PI/vn+z),
      y+yFrac*Math.cos(j*Math.PI/vn+z)
    );
  }
}

var draw=(frac,swit)=>{
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  let xFrac=cbLoc(KXS,KX,frac);
  let xFrac2=cbLoc(KXS2,KX2,frac);
  let yFrac=cbLoc(KYS,KY,frac);
  let yFrac2=cbLoc(KYS2,KY2,frac);
  let zFrac=cbLoc(Z2,Z,frac);
  let D=(pts.length<160)?true:false;
  for (let i=0; i<pts.length; i++) {
//if ((i+swit)%2==0) continue;
//if (i%S==0) continue;
    if (D) {
      polyL(pts[i][0],pts[i][1],xFrac,yFrac);
    } else {
      if (i%2==0) {
        polyN(pts[i][0],pts[i][1],xFrac2,yFrac2,V2,zFrac);
      } else {
        polyN(pts[i][0],pts[i][1],xFrac,yFrac,V,zFrac);
      }
    }
  }
  ctx.closePath();
  ctx.stroke();
/*
if (swit==1) {
  let sfs=ctx.fillStyle;
  ctx.fillStyle="red";
  ctx.fill("evenodd");
  ctx.fillStyle=sfs;
} else {
}
*/
  ctx.fill("evenodd");
}

var time=0;
var stopped=true;
var duration=8000;
var frac=1;
var AF=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) {
    time=ts;
  }
  let progress=ts-time;
  if (progress<duration) {
    frac=progress/duration;
//  ctx.clearRect(0,0,canvas.width,canvas.height);
    draw(frac,0);
//    draw(frac,1);
  } else {
    KXS=KX;
    KXS2=KX2;
    KYS=KY;
    KYS2=KY2;
    Z2=Z;
    randomK();
    randomZ();
    time=0;
    frac=0;
  }
  AF=requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    randomizeColor();
    setPoints();
    randomizeTess();
    Z=Z2=0;
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
canvas.addEventListener("click", start, false);

start();
