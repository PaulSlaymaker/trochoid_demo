"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/xxdPpqB
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
body.style.display="grid";
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

var colors=[];
var setColors=()=>{
  colors=[];
  let hue=getRandomInt(0,360);
  let hd=getRandomInt(90,270);
  for (let i=0; i<W; i++) {
    let sat=80+getRandomInt(0,21);
    let lum=50+getRandomInt(0,31);
    colors.push("hsl("+((hue+i*hd)%360)+","+sat+"%,"+lum+"%)");
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
  this.getR=()=>{ return frac*this.r+(1-frac)*this.r2; }
}

var RMIN=0;
var getW=()=>{ return [12,20,28][getRandomInt(0,3)]; }
var W=0;
var RSEG=[80,90,100,110,120][getRandomInt(0,5)];

var getC=()=>{ return [12,16,18,20,24,28,30,32,36,40,42,44,48][getRandomInt(0,13)]; }
var C=0;

var getRadii=()=>{ 
  let w=[];
  for (let j=0; j<W-5; j++) {
    w[j]=Math.min(CSIZE,RSEG*getRandomInt(0,Math.round(CSIZE/RSEG)+1));
    //w[j]=RSEG*getRandomInt(0,(CSIZE-RMIN)/RSEG);
    //w[j]=CSIZE-RSEG-RSEG*getRandomInt(0,(CSIZE-RMIN)/RSEG,true);
    if (j && Math.random()<0.5) w[j]=w[j-1]; 
  }
  w.sort((a,b)=>{ return b-a; });
  w.push(0);
  w.push(0);
  //w.unshift(RSEG*Math.round(CSIZE/RSEG));
  //w.unshift(RSEG*Math.round(CSIZE/RSEG));
  //w.unshift(RSEG*Math.round(CSIZE/RSEG));
  let Rmax=Math.min(CSIZE,RSEG*Math.round(CSIZE/RSEG)+1);
  w.unshift(Rmax);
  w.unshift(Rmax);
  w.unshift(Rmax);
  return w;
}

const sym={
  12:[3,2],
  16:[4,2],
  18:[3],
  20:[5,2],
  24:[4,3,2],
  28:[2],
  30:[5,3],
  32:[4,2],
  36:[3,2],
  40:[5,4,2],
  42:[3],
  44:[2],
  48:[6,4,3,2],
//  randomC:()=>{ return parseInt(Object.keys(sym)[getRandomInt(0,Object.keys(sym).length)]); }
};

var rot={
 "12-2":3,
 "12-3":1,
 "16-2":1,
 "16-4":1,
 "18-3":4,
 "20-2":3,
 "20-5":1,
 "24-2":3,
 "24-3":1,
 "24-4":5,
 "28-2":3,
 "30-3":4,
 "30-5":6,
 "32-2":1,
 "32-4":1,
 "36-2":3,
 "36-3":1,
 "40-2":5,
 "40-4":5,
 "40-5":1,
 "42-3":4,
 "44-2":3,
 "48-2":1,
 "48-3":1,
 "48-4":1,
 "48-6":1,
}

var ROT=0;
var S=2;
var setSymmetry=()=>{
if (sym[C]==undefined) debugger;
  S=sym[C][getRandomInt(0,sym[C].length,true)];
  ctx.rotate(-ROT);
  ROT=0;
if (rot[C+"-"+S]==undefined) debugger;
  ROT=rot[C+"-"+S]*TP/C/2;
  ctx.rotate(ROT);
//console.log(C+" "+S);
}

var pts2=[];
var setPoints=()=>{
  pts2=[];
  let pa=[];
  let z=(()=>{
    let z1=[];
    for (let i=0; i<S; i++) z1.push(getRadii());
    return z1;
  })();
  z=z.concat([...z].reverse());
  for (let i=0; i<C; i++) {
    pa[i]=z[i%z.length];
  }
  for (let j=0; j<W; j++) { 
    pts2[j]=[];
    for (let i=0; i<C; i++) {
      pts2[j][i]=new Point(pa[i][j]); 
    }
  }
}

const TRING=200;

var setPointsRing=()=>{
  pts2=[];
  for (let j=0; j<W; j++) { 
    pts2[j]=[];
    for (let i=0; i<C; i++) {
      pts2[j][i]=new Point(TRING); 
    }
  }
}

var transitPoints=()=>{
  let pa=[];
  let z=(()=>{
    let z1=[];
    for (let i=0; i<S; i++) z1.push(getRadii());
    return z1;
  })();
  z=z.concat([...z].reverse());
  for (let i=0; i<C; i++) {
    pa[i]=z[i%z.length];
  }
  for (let j=0; j<W; j++) { 
    for (let i=0; i<C; i++) {
      pts2[j][i].r=pa[i][j]; 
    }
  }
}

var transitRing=()=>{
  pts2.forEach((p1)=>{ p1.forEach((p2)=>{ p2.r2=p2.r; }); });
  pts2.forEach((p1)=>{ p1.forEach((p2)=>{ p2.r=TRING; }); });
}

var sine3=(idr)=>{
//if (idr==W-1) debugger;
  let D=10;
  let DT=TP/D/4;
  let p=new Path2D();
  for (let j=idr; j<idr+2; j++) {
    if (j==W-1) {
      return p;
    }
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

var paths2=[];
var setPaths2=()=>{
  let pa=[];
  for (let j=0; j<W; j++) {
    pa[j]=sine3(j);
  }
  return pa;
}

ctx.lineWidth=3;
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let j=0; j<W-1; j++) {
if (j==W-2) ctx.fillStyle="black"; else
    ctx.fillStyle=colors[j%colors.length];
    ctx.fill(paths2[j],"evenodd");
    ctx.stroke(paths2[j]);
  }
}

var transitLevels=()=>{
  pts2[0].forEach((p)=>{ p.r2=0; p.r=0; });
  pts2.push(pts2.shift());
  colors.push(colors.shift());
  paths2.push(paths2.shift());
//console.log("w shift");
}

var transit=()=>{
  if (!mode) {
    let Rmax=Math.min(CSIZE,RSEG*Math.round(CSIZE/RSEG)+1);
    var isMaxed=()=>{
      let coll=true;
      for (let i=0; i<C; i++) {
	if (pts2[1][i].r!=Rmax) {
	  coll=false;
	  break;
	}
      } 
      return coll;
    }
    if (isMaxed()) transitLevels();
    if (isMaxed()) transitLevels();

/*
   let coll=true;
   for (let i=0; i<C; i++) {
     if (pts2[1][i].r!=Rmax) {
       coll=false;
       break;
     }
   } 
   if (coll) transitLevels();	// not needed for mode==2?
  console.log(coll);
    let coll=true;
    for (let i=0; i<C; i++) {
      if (pts2[1][i].r!=Rmax) {
	coll=false;
	break;
      }
    } 
  if (coll) transitLevels();	// not needed for mode==2?
  console.log("2- "+coll+" "+mode);
*/
  }

  pts2.forEach((p1)=>{ p1.forEach((p2)=>{ p2.r2=p2.r; }); });
  transitPoints(); 
}

function cFrac(cf) {
  let f1=.1;
  let f2=.9;
  var e2=3*cf*Math.pow(1-cf,2)*f1;
  var e3=3*(1-cf)*Math.pow(cf,2)*f2;
  var e4=Math.pow(cf,3);
  return e2+e3+e4;
}

/*
var pauseTS=0;
//var pauseDuration=[30,120][getRandomInt(0,2)];
var pauseDuration=3000;
var pause=(ts)=>{
  if (stopped) return;
  if (pauseTS==0) pauseTS=performance.now()+pauseDuration;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    pauseTS=0;
    requestAnimationFrame(animate);
  }
}
*/

var mode=0;
var time=0;
var frac=0;
var f=0;
var stopped=true;
var duration=3600;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  f=(ts-time)/duration;
  frac=cFrac(f);
  let af=animate;
  if (f>1) {
    if (!mode && Math.random()<0.1) mode=1;
    if (mode==1) {
      transitRing();
      mode=2;
//      af=pause;
    } else if (mode==2) {
      W=getW();
      C=getC();
      setColors();
RSEG=[80,90,100,110,120][getRandomInt(0,5)];
      setSymmetry();
      setPointsRing(); 
      transit();
      mode=0;
      af=animate;
    } else {
      transit();
//pauseDuration=[30,120,480][getRandomInt(0,3)];
//      af=pause;
    }
//    transit();
    time=0;
    //frac=0;
    frac=0;
    f=0;
//af=pause;
if (EM) stopped=true;
  }
  paths2=setPaths2(); 
  draw();
  requestAnimationFrame(af);
}

var start=()=>{
  if (stopped) {
    stopped=false;
    if (frac) time=performance.now()-frac*duration;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

onresize();
W=getW();
C=getC();
setColors();
setSymmetry();
setPoints();
paths2=setPaths2();
transit();

if (EM) draw();
else start();
