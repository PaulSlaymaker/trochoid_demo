"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;
const CSIZE=400;
const SF=2*Math.sin(Math.PI/4);

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
//c.style.outline="0.5px dotted red";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineJoin="round";

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
var getColors=()=>{
  let c=[];
  let colorCount=getRandomInt(2,10);
  //let colorCount=[2,3,4,6,8][getRandomInt(0,5)];
  let hr=Math.round(90/colorCount);
  let hue=getRandomInt(0,90,true)+30;
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-hr,hr);
    let sat=60+getRandomInt(0,41);
    let lum=40+getRandomInt(0,41);
    //let lum=Math.round(50+20*Math.pow(Math.sin((col+90)*TP/360),2));
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
    //c.splice(getRandomInt(0,c.length+1),0,"hsla("+((hue+hd)%360)+","+sat+"%,"+lum+"%,0.4)");
  }
  return c;
}

var C=8*getRandomInt(2,8);  // divisible by 8
var W=C/2;

var Point2=function(c,w) {
  this.c=c;
  this.w=w;
  this.r=radii[w];
  this.z=c*TP/C+((w%2)?TP/2/C:0);
  if (this.r==0 || this.r==EDGE) this.d=true;
  else this.d=false;
}

var Kite=function(point,idx) {
if (!point) debugger;
  this.point=point;
//  this.idx=idx;
  this.path=new Path2D();
  let x=Math.round(radii[this.point.w-1]*Math.cos(this.point.z));
  let y=Math.round(radii[this.point.w-1]*Math.sin(this.point.z));
  this.path.moveTo(x,y);
  x=radii[this.point.w]*Math.cos(this.point.z-TP/2/C);
  y=radii[this.point.w]*Math.sin(this.point.z-TP/2/C);
  this.path.lineTo(x,y);
  x=radii[this.point.w+1]*Math.cos(this.point.z);
  y=radii[this.point.w+1]*Math.sin(this.point.z);
  this.path.lineTo(x,y);
  x=radii[this.point.w]*Math.cos(this.point.z+TP/2/C);
  y=radii[this.point.w]*Math.sin(this.point.z+TP/2/C);
  this.path.lineTo(x,y);
  this.path.closePath();
}

const EDGE=CSIZE-40;

var pm=new Map();

var radii=[]
var getRadii=()=>{
  let pts=[];
    for (let r=0; r<=W; r++) {
      let r2=EDGE*Math.sin(r*TP/(4*W));
      pts.push(r2);
  }
  return pts;
};
radii=getRadii();

var setPoints2=()=>{
  pm=new Map();
  for (let w=0; w<radii.length; w++) {
    for (let c=0; c<C; c++) {
      pm.set([c,w].toString(), new Point2(c,w));
    }
  }
}

var getSymKites=()=>{
  if (rPoints.length==0) return false;
  let kites=[];
  let rp=rPoints[getRandomInt(0,rPoints.length)];
  if (rp.w%2) {
    let c2=C-rp.c%(C/4)-1;
    for (let i=0; i<4; i++) {
      let pt=pm.get([(rp.c+i*C/4)%C,rp.w].toString());
      kites.push(new Kite(pt));
      let aio=rPoints.indexOf(pt);
      if (aio!=-1) rPoints.splice(aio,1);
      pt=pm.get([(c2+i*C/4)%C,rp.w].toString());
      kites.push(new Kite(pt));
      aio=rPoints.indexOf(pt);
      if (aio!=-1) rPoints.splice(aio,1);
    }
  } else {
    //if ([0,C/4,C/2,3*C/4].includes(rp.c)) {
    if ([0,C/8,C/4,3*C/8,C/2,5*C/8,3*C/4,7*C/8].includes(rp.c)) {
      let ad=rp.c%(C/4);
      for (let i=0; i<4; i++) {
	let pt=pm.get([i*C/4+ad,rp.w].toString());
/*
if (pt==undefined) {
  console.log([i*C/4+ad,rp.w].toString());
  debugger;
}
*/
	kites.push(new Kite(pt));
	let aio=rPoints.indexOf(pt);
	if (aio!=-1) rPoints.splice(aio,1);
/*
else {
  console.log(pt);
  debugger;
}
*/
      }
    } else {
      let c2=C-rp.c%(C/4);
      for (let i=0; i<4; i++) {
	let pt=pm.get([(rp.c+i*C/4)%C,rp.w].toString());
	kites.push(new Kite(pt));
	let aio=rPoints.indexOf(pt);
	if (aio!=-1) rPoints.splice(aio,1);
//else debugger;
	pt=pm.get([(c2+i*C/4)%C,rp.w].toString());
	kites.push(new Kite(pt));
	aio=rPoints.indexOf(pt);
	if (aio!=-1) rPoints.splice(aio,1);
/*
else {
  console.log([(rp.c+i*C/4)%C,rp.w].toString());
  console.log([(c2+i*C/4)%C,rp.w].toString());
  debugger;
}
*/
      }
    }
  }
  return kites;
}

/*
var drawCs=()=>{
  ctx.fillStyle="black";
  pm.forEach((pt)=>{
    let x=Math.round(radii[pt.w]*Math.cos(pt.z));
    let y=Math.round(radii[pt.w]*Math.sin(pt.z));
    ctx.fillText(pt.c,x,y);
  });
}
*/

var td=[];

var setTimeDelay=(early)=>{
  td=[0]
  //let range=kitePaths.length*80;
  let range=kitePaths.length*getRandomInt(10,50);
//console.log("range "+range/kitePaths.length);
  if (early) {
    for (let i=0; i<kitePaths.length-1; i++) td.push(-getRandomInt(0,range,true)); 
  } else {
    for (let i=0; i<kitePaths.length-1; i++) td.push(getRandomInt(0,range,true)-range); 
  }
  td.sort((a,b)=>{ return b-a; });
}

var setTimeDelayAlt=(early)=>{
  td=[0]
  //let range=kitePaths.length*80;
  let range=kitePaths.length*getRandomInt(10,50);
//console.log("range "+range/kitePaths.length);
  if (early) {
    for (let i=0; i<kitePaths.length-1; i++) td.push(-getRandomInt(0,range,true)); 
  } else {
    for (let i=0; i<kitePaths.length-1; i++) td.push(getRandomInt(0,range,true)-range); 
  }
  td.sort((a,b)=>{ return a-b; });
}

var transit=()=>{
  C=8*getRandomInt(2,8);
  W=C/2;
  radii=getRadii();
  setPoints2();	// pm.size=C*(C/2+1)
  rPoints=Array.from(pm.values()).filter((pt)=>{ return !pt.d; });
  kitePaths=getKitePaths();
  colors=getColors();
}

ctx.lineWidth=1;

setPoints2();
var rPoints=Array.from(pm.values()).filter((pt)=>{ return !pt.d; });

var z=0;

var duration=1200;	// divisible by 4

var drawAlt=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let drawn=0;
  for (let i=0; i<kitePaths.length; i++) {
    let tc=td[i]+t;
    if (tc<0) continue;
    let n=Math.min(tc,duration/4);
    if (n==duration/4) drawn++;
    let z=n*TP/duration;
    let path=new Path2D();
    let s=Math.sin(z);
    let a=ax[i]*(1-Math.sin(z));
    let q1=s*Math.cos(a);
    let q2=s*Math.sin(a);
    let dm=new DOMMatrix([q1,q2,-q2,q1,0,0]);
    kitePaths[i].forEach((k)=>{ path.addPath(k.path,dm); });
    ctx.fillStyle=colors[i%colors.length];
    ctx.fill(path);
    ctx.stroke(path);
  }
  return drawn>kitePaths.length-1;
}

var drawOut=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let drawn=0;
  for (let i=0; i<kitePaths.length; i++) {
    let tc=td[i]+t;
    if (tc>duration/4) continue;
    //let n=Math.min(tc,duration/4);
    let n=Math.max(tc,0);
    drawn++;
    let z=n*TP/duration;
    let path=new Path2D();
    let s=Math.cos(z);
    let a=ax[i]*(1-Math.cos(z));
    let q1=s*Math.cos(a);
    let q2=s*Math.sin(a);
    let dm=new DOMMatrix([q1,q2,-q2,q1,0,0]);
    kitePaths[i].forEach((k)=>{ path.addPath(k.path,dm); });
    ctx.fillStyle=colors[i%colors.length];
    ctx.fill(path);
    ctx.stroke(path);
  }
  return drawn;
}

var drawOutAlt=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let drawn=0;
  for (let i=0; i<kitePaths.length; i++) {
    let tc=td[i]+t;
    if (tc>duration/4) continue;
//    let n=Math.min(tc,duration/4);
    let n=Math.max(tc,0);
    //if (n==duration/4) drawn++;
    drawn++;
    let z=n*TP/duration;
    let path=new Path2D();
let s=1/Math.cos(z);
//let a=ax[i]*Math.sin(z);
let a=ax[i]*(1-Math.cos(z));
let q1=s*Math.cos(a);
let q2=s*Math.sin(a);
    let dm=new DOMMatrix([q1,q2,-q2,q1,
        //locx[i]*Math.pow(Math.sin(z),3),
        //locy[i]*Math.pow(Math.sin(z),3)
        locx[i]*(1-Math.cos(z)),
        locy[i]*(1-Math.cos(z)),
      ]
    );
    kitePaths[i].forEach((k)=>{ path.addPath(k.path,dm); });
    ctx.fillStyle=colors[i%colors.length];
    //ctx.globalAlpha=Math.pow(Math.cos(z),0.3);
    ctx.globalAlpha=Math.cos(z);
    ctx.fill(path);
    ctx.stroke(path);
  }
  ctx.globalAlpha=1;
  return drawn;
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let drawn=0;
  for (let i=0; i<kitePaths.length; i++) {
    //let n=Math.max(td[i]+t,0);
    let tc=td[i]+t;
    if (tc<0) continue;
    let n=Math.min(tc,duration/4);
    if (n==duration/4) drawn++;
    let z=n*TP/duration;
    let path=new Path2D();
//let q3=SF/4*(Math.sin(z)+Math.sin(3*z));
let q3=(Math.cos(z)+Math.cos(3*z))/2;
//let q4=SF/2*Math.pow(Math.sin(z),3);
//let q4=1/Math.pow(Math.sin(z),3);
let s=1/Math.sin(z);
let a=ax[i]*Math.cos(z);
let q1=s*Math.cos(a);
//let q1=s*(Math.cos(a)+Math.cos(3*a))/2;
let q2=s*Math.sin(a);
//let q2=s*(Math.sin(a)+Math.sin(3*a))/2;
    let dm=new DOMMatrix([q1,q2,-q2,q1,
        locx[i]*Math.pow(Math.cos(z),3),
        locy[i]*Math.pow(Math.cos(z),3)
      ]
    );
    kitePaths[i].forEach((k)=>{ path.addPath(k.path,dm); });
    ctx.fillStyle=colors[i%colors.length];
    ctx.globalAlpha=Math.pow(Math.sin(z),0.3);
    ctx.fill(path);
    ctx.stroke(path);
  }
/*
  if (drawn>kitePaths.length-1) {
//console.log(kitePaths.length-1);
    return true;
  }
  return false;
*/
  return drawn>kitePaths.length-1;
}

var kitePaths=[];
var getKitePaths=()=>{
//  kitePaths=[];
  let kites=[];
  let sk=getSymKites();
  while (sk) {
    let ag=getRandomInt(1,C/2,true);
    //let ag=getRandomInt(1,C/2);
    for (let i=0; i<ag; i++) {
      let sk2=getSymKites();
      if (sk2) sk=sk.concat(sk2);
      else break;
    }
    kites.push(sk);
    sk=getSymKites();
  }
  return kites;
};

var locx=[];
var locy=[];
var setLocDeviations=()=>{
  locx=[];
  locy=[];
  for (let i=0; i<kitePaths.length; i++) {
    locx.push(getRandomInt(-800,800));
    locy.push(getRandomInt(-800,800));
  }
}

var ax=[];
var setAngleDeviations=(e)=>{
  ax=[];
  for (let i=0; i<kitePaths.length; i++) {
    ax.push(e-2*e*Math.random());
  }
}

var frac=1;
var stopped=true;
var pidx=0;
var start=()=>{
  if (stopped) { 
    stopped=false;
    time=0;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var step=0;
var time=0;
var frac=0;
var t=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  t++;
  if (step==0) {
    //if (draw()) {
    if (drawAlt()) {
      step=1;
      t=0;
      time=0;
    }
  } else if (step==1) {
    if (ts-time>2500) {
      step=2;
      t=0;
      time=0;
//      setTimeDelay(false);
setTimeDelayAlt(false);
      //setAngleDeviations(10);
setAngleDeviations(2);
    }
  } else {
    //if (drawOut()==0) {
    if (drawOutAlt()==0) {
      t=0;
      time=0;
      transit();
      step=0;
      setTimeDelay(true);
//      setAngleDeviations(2);
setAngleDeviations(6);
      setLocDeviations();
    }
  }
  requestAnimationFrame(animate);
}

/*
ctx.fillStyle="black";
sk.forEach((k)=>{
  let x=Math.round(radii[k.point.w]*Math.cos(k.point.z));
  let y=Math.round(radii[k.point.w]*Math.sin(k.point.z));
  ctx.fillText(k.point.c,x,y);
});
*/

onresize();

transit();
setTimeDelay(true);
setAngleDeviations(4);
setLocDeviations();

//draw();
start();
