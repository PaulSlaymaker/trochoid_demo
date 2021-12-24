"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
body.style.display="grid";
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

var colors=[];
var setColors=()=>{
  colors=[];
  let hue=getRandomInt(0,360);
  let hd=getRandomInt(90,270);
  for (let i=0; i<W; i++) {
    let sat=80+getRandomInt(0,21);
    let lum=50+getRandomInt(0,31);
    colors.push("hsla("+((hue+i*hd)%360)+","+sat+"%,"+lum+"%,0.5)");
  }
  (()=>{
    let no=[];
    do no.push(colors.splice(getRandomInt(0,colors.length),1)[0]);
    while (colors.length>0);
    colors=no;
  })();
}

function Point(r) {
  this.r=r;
  this.r2=r;
  this.getR=()=>{
    return frac*this.r+(1-frac)*this.r2;
  }
}

var RSEG=40;
//var W=CSIZE/RSEG;
var RMIN=200;
var W=(CSIZE-RMIN)/RSEG;
var getC=()=>{
  return [24,30,36,40,20,28,18,12,32,26,22,14,34,38][getRandomInt(0,14,true)];
}

//var C=2*getRandomInt(6,21);
var C=getC();

var getRadii=()=>{ 
  let w=[];
  for (let j=0; j<W; j++) {
    if (j && Math.random()<0.2) w[j]=w[j-1]; else
      w[j]=RMIN+RSEG*getRandomInt(0,W);
      //w[j]=CSIZE-RSEG*getRandomInt(1,CSIZE/RSEG);
  }
  w.sort((a,b)=>{ return b-a; });
  return w;
}

// 24,30,36,40,20,28,18,12,32,26,22,14,34,38

var sym={
  12:[4,3,6,2,12],
  14:[7,2,14],
  16:[4,8,2,16],
  18:[3,6,2,9,18],
  20:[4,5,2,10,20],
  22:[2,11,22],
  24:[4,6,8,3,12,2,24],
  26:[2,13,26],
  28:[4,7,2,14,28],
  30:[3,5,2,6,10,15,30],
  32:[4,8,2,16],
  34:[2,17],
  36:[4,6,2,9,12,18],
  38:[2,19],
  40:[4,5,2,8,10,20],
}

/*
var symO={
  12:[12,6,4,3,2],
  14:[14,7,2],
  16:[16,8,4,2],
  18:[18,9,6,3,2],
  20:[20,10,5,4,2],
  22:[22,11,2],
  24:[24,12,8,6,4,3,2],
  26:[26,13,2],
  28:[28,14,7,4,2],
  30:[15,10,6,5,3,2],
  32:[16,8,4,2],
  34:[17,2],
  36:[18,12,9,6,4,2],
  38:[19,2],
  40:[20,10,8,5,4,2],
}
*/

var pts2=[];
var setPoints=()=>{
  pts2=[];
  let pa=[];
  let symmetry=sym[C][getRandomInt(0,sym[C].length,true)];
console.log(C+" "+symmetry);
  let z=(()=>{
    let z1=[];
    for (let i=0; i<symmetry; i++) z1.push(getRadii());
    return z1;
  })();
  for (let i=0; i<C; i++) {
    //pa[i]=getRadii(i);
    pa[i]=z[i%symmetry];
  }
  for (let j=0; j<W; j++) { 
    pts2[j]=[];
    for (let i=0; i<C; i++) {
      pts2[j][i]=new Point(pa[i][j]); 
    }
  }
}
setPoints();

var setPointsRing=()=>{
  for (let j=0; j<W; j++) { 
    for (let i=0; i<C; i++) {
      pts2[j][i]=new Point(300); 
    }
  }
}

var transitPoints=()=>{
  let pa=[];
  let symmetry=sym[C][getRandomInt(0,sym[C].length,true)];
console.log(C+" "+symmetry);
  let z=(()=>{
    let z1=[];
    for (let i=0; i<symmetry; i++) z1.push(getRadii());
    return z1;
  })();
  for (let i=0; i<C; i++) pa[i]=z[i%symmetry];
  for (let j=0; j<W; j++) { 
    for (let i=0; i<C; i++) {
      pts2[j][i].r=pa[i][j]; 
    }
  }
}

var transitRing=()=>{
  pts2.forEach((p1)=>{ p1.forEach((p2)=>{ p2.r=300; }); });
/*
  for (let j=0; j<W; j++) { 
    for (let i=0; i<C; i++) {
      pts2[j][i].r=300;
    }
  }
*/
}

var sine2=(idx,idr)=>{
  let idx1=(idx+1==C)?0:idx+1;
  let D=20;
  let DT=TP/D/4;
  let p=new Path2D();
  let radius=pts2[idr][idx].getR();
  let x=radius*Math.cos(idx*TP/C);
  let y=radius*Math.sin(idx*TP/C);
  p.moveTo(x,y);
  for (let i=0; i<D+1; i++) {
    let r=radius*Math.pow(Math.cos(i*DT),2)+pts2[idr][idx1].getR()*Math.pow(Math.sin(i/D*TP/4),2);
    //let r=(1+Math.sin(i/40*TP/4+TP/4))*pts2[0][0].r/2+(1+Math.cos(i/40*TP/4-TP/4))*pts2[0][1].r/2;
    //let r=Math.sin(i/40*TP/8+TP/4)+Math.cos(i/40*TP/8-TP/4);
    //let r=Math.sin(i/40*TP/4);
    x=r*Math.cos((i/D+idx)*TP/C);
    y=r*Math.sin((i/D+idx)*TP/C);
    p.lineTo(x,y);
  }
  return p;
}

var sine3=(idr)=>{
if (idr==W-1) debugger;
  let D=20;
  let DT=TP/D/4;
  let p=new Path2D();
  for (let j=idr; j<idr+2; j++) {
    let x=pts2[j][0].getR()*Math.cos(0);
    let y=0; //pts2[idr][0].getR()*Math.sin(0);
    p.moveTo(x,y);
    for (let i=0; i<C; i++) {
      let idx1=(i+1==C)?0:i+1;
      let radius=pts2[j][i].getR();
      for (let q=0; q<D+1; q++) {
	let r=radius*Math.pow(Math.cos(q*DT),2)+pts2[j][idx1].getR()*Math.pow(Math.sin(q*DT),2);
	x=r*Math.cos((q/D+i)*TP/C);
	y=r*Math.sin((q/D+i)*TP/C);
	p.lineTo(x,y);
      }
    }
  }
  return p;
}

var paths=[];
var setPaths=()=>{
  let pa=[];
  for (let j=0; j<W; j++) {
    let ring=[]
    for (let i=0; i<C; i++) ring[i]=sine2(i,j);
    pa[j]=ring;
  }
  return pa;
}

var paths2=[];
var setPaths2=()=>{
  let pa=[];
  for (let j=0; j<W-1; j++) {
    pa[j]=sine3(j);
  }
  return pa;
}

var draw2=()=>{
ctx.fillStyle="red";
ctx.strokeStyle="gray";
ctx.lineWidth=2;
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let j=0; j<W-1; j++) {
    ctx.fillStyle=colors[j%colors.length];
  ctx.fill(paths2[j],"evenodd");
  ctx.stroke(paths2[j]);
  }
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.lineWidth=16;
  ctx.strokeStyle="gray";
/*
ctx.arc(0,0,CSIZE-RSEG,0,TP);
//ctx.stroke();
ctx.moveTo(RMIN,0);
ctx.arc(0,0,RMIN,0,TP);
ctx.stroke();
*/
  for (let j=0; j<W; j++) {
    let p=new Path2D();
    for (let i=0; i<C; i++) p.addPath(paths[j][i]);
    ctx.stroke(p);
  }
  ctx.lineWidth=11;
  ctx.strokeStyle="black";
/*
ctx.moveTo(CSIZE-RSEG,0);
ctx.arc(0,0,CSIZE-RSEG,0,TP);
ctx.stroke();
*/
  for (let j=0; j<W; j++) {
    let p=new Path2D();
    for (let i=0; i<C; i++) p.addPath(paths[j][i]);
    ctx.stroke(p);
  }
    ctx.lineWidth=6;
/*
let p=new Path2D();
p.arc(0,0,CSIZE-RSEG,0,TP);
ctx.strokeStyle=colors[W%colors.length];
ctx.stroke(p);
*/
  for (let j=0; j<W; j++) {
    let p=new Path2D();
    for (let i=0; i<C; i++) p.addPath(paths[j][i]);
    ctx.strokeStyle=colors[j%colors.length];
    ctx.stroke(p);
  }
/*
p=new Path2D();
p.arc(0,0,RMIN,0,TP);
ctx.strokeStyle=colors[(W+1)%colors.length];
ctx.stroke(p);
*/
ctx.fill();
}

var reset=()=>{
  if (stopped) {
    C=getC();
    setPoints(); 
    setColors();
    frac=0;
    time=0;
    pauseTS=0;
    transit();
    paths=setPaths(); 
  }
  start();
}

/*
var resetO=()=>{
  if (stopped) {
    C=2*getRandomInt(6,21);
    setPoints(); 
    paths=setPaths(); 
    setColors();
  //  draw(); 
  frac=0;
  time=0;
  pauseTS=0;
  transit();
  }
  start();
}
*/

var transit=()=>{
  pts2.forEach((p1)=>{ p1.forEach((p2)=>{ p2.r2=p2.r; }); });
  if (mode==1) transitRing();
  else transitPoints(); 
}

var pauseTS=0;
var pause=(ts)=>{
  if (stopped) return;
  if (pauseTS==0) pauseTS=performance.now()+30
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    pauseTS=0;
    requestAnimationFrame(animate);
  }
}

var mode=0;
var time=0;
var frac=0;
var stopped=true;
var duration=3000;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  frac=(ts-time)/duration;
  let af=animate;
  if (frac>1) {
    if (!mode && Math.random()<0.3) mode=1;
    if (mode==1) {
      transit();
      mode=2;
      af=pause;
    } else if (mode==2) {
      setColors();
      C=getC();
      setPointsRing(); 
      transit();
      mode=0;
      af=animate;
    } else {
      transit();
      af=pause;
    }
//    transit();
    time=0;
    frac=0;
//af=pause;
  }
  paths=setPaths(); 
//  paths2=setPaths2(); 
  draw();
//  draw2();
  requestAnimationFrame(af);
}

var start=()=>{
  if (stopped) {
    stopped=false;
    if (frac) time=performance.now()-frac*duration;
    //reset();
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
//ctx.canvas.addEventListener("click", reset, false);
ctx.canvas.addEventListener("click", start, false);

onresize();
setColors();
paths=setPaths();
transit();

draw();
stopped=false;
requestAnimationFrame(pause);
//start();
