"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
//body.style.background="black";
const PUBLISH=false;
const TP=2*Math.PI;

var canvas=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
c.style="border:1px solid silver;";
  c.onclick=()=>start();
  let co=document.createElement("div");
  co.style.textAlign="center";
  co.append(c);
  body.append(co);
  return c;
})();

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const CSIZE=400;
const scale=360;

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var ps=0;
const 
C_SR=0, C_SL=1, 
CS_CSR=2, CS_CSL=3, 
CS_CCR=4, CS_CCL=5, 
CCS_CSSR=6, CCS_CSSL=7,
CCS_CCSR=8, CCS_CCSL=9,
CCS_CCCR=10, CCS_CCCL=11,
CCCS_CSSSR=12, CCCS_CSSSL=13,
CCCS_CCSSR=14, CCCS_CCSSL=15,
CCCS_CCCSR=16, CCCS_CCCSL=17,
CCCS_CCCCR=18, CCCS_CCCCL=19;
var state=0;
var type=0;

var Curve=function() {
  this.pts=[];
  this.f=1;	// curve flatten
  this.cs=1;	// curve scale
  this.X=(idx)=>{ return scale*this.cs*this.pts[idx].x; }
  this.Y=(idx)=>{ return scale*this.cs*this.pts[idx].y; }
}

/*
const setPointsC_S2=(line)=>{	// inefficient
  let mux={}, muy={};
  let c=getRandomInt(1,10);
  for (let i=0; i<c; i++) {
    let m=2*getRandomInt(-4,4)+1;
    if (mux.hasOwnProperty(m)) mux[m]++;
    else mux[m]=1;
    if (ps%3==0) {  	// variety
      m=2*getRandomInt(-4,4)+1;
      if (muy.hasOwnProperty(m)) muy[m]++;
      else muy[m]=1;
    } else {		// beauty
      if (muy.hasOwnProperty(m)) muy[m]++;
      else muy[m]=1;
    }
  }
  const getX=(t)=>{ 
    let v=0;
    for (let [m,f] of Object.entries(mux)) { v+=f*Math.cos(m*t); }
    return v;
  }
  const getY=(t)=>{ 
    let v=0;
    for (let [m,f] of Object.entries(muy)) { v+=f*Math.sin(m*t); }
    return v;
  }
  let pointSet=ps%2;
  curves[pointSet].pts=[];
  curves[pointSet].cs=1;
  for (let i=0, t=0; i<Z; i+=1, t=i*I) {
    curves[pointSet].pts[i]={x:getX(t)/c,y:line?0:getY(t)/c};
  }
}
*/

const randomAny=()=>{ return [0,1,-1,2,-2,3,-3,4,-4,5,-5,6,-6][getRandomInt(0,13,true)]; }
const randomOdd=()=>{ return [-1,1,-3,3,-5,5][getRandomInt(0,6,true)]; }
const randomOddO=()=>{ return [-5,-3,-1,1,3,5][getRandomInt(0,6)]; }
const randomEven=()=>{ return [0,2,-2,4,-4][getRandomInt(0,5,true)]; }
const randomEvenO=()=>{ return [-4,-2,0,2,4][getRandomInt(0,5)]; }
const randomEvenNZ=()=>{ return [2,-2,4,-4,6,-6][getRandomInt(0,6,true)]; }
const randomEvenNZO=()=>{ return [-6,-4,-2,2,4,6][getRandomInt(0,6)]; }

const setPointsC_S=(line)=>{
  let mx=[];
  let my=[];
  let c=getRandomInt(1,10);
  for (let i=0; i<c; i++) {
    mx[i]=randomOdd();
    if (ps%3==0) {  	// variety
      my[i]=randomOdd();
    } else {		// beauty
      my[i]=mx[i];
    }
  }
  const getX=(t)=>{ 
    let v=0;
    for (let i=0; i<c; i++) v+=Math.cos(mx[i]*t);
    return v;
  }
  const getY=(t)=>{ 
    let v=0;
    for (let i=0; i<c; i++) v+=Math.sin(my[i]*t);
    return v;
  }
  let pointSet=ps%2;
  curves[pointSet].pts=[];
  curves[pointSet].cs=1;
  for (let i=0, t=0; i<Z; i+=1, t=i*I) {
    curves[pointSet].pts[i]={x:getX(t)/c,y:line?0:getY(t)/c};
  }
}

const getFactors=(n,c,xeo,yeo)=>{
  let xfact=[];
  let yfact=[];
  for (let i=0; i<c; i++) {
    for (let j=0; j<n; j++) {
    }
  }
  return {"xa":xfact,"ya":yfact};
}

const generatePoints=(xf,yf,c)=>{
  let pointSet=ps%2;
  curves[pointSet].pts=[];
  curves[pointSet].cs=1;
  let maxs=0;
  for (let i=0, t=0; i<Z; i+=1, t=i*I) {
    let x=0;
    for (let i=0; i<c; i++) x+=xf(i,t);
    maxs=Math.max(maxs,x);
    let y=0;
    for (let i=0; i<c; i++) y+=yf(i,t);
    maxs=Math.max(maxs,y);
    curves[pointSet].pts.push({"x":x,"y":y});
  }
  curves[pointSet].cs=1/(maxs<0.01?1:maxs);
}

const setPointsCS_CS=(line)=>{
  let mx=[], mx2=[];
  let my=[], my2=[];
  let c=line?1:getRandomInt(1,10);
// 2 types: mx+mx2 is even and sum my is odd, or vice versa in 2nd type
  for (let i=0; i<c; i++) {
    if (line) {
      mx[0]=0;
      mx2[0]=0;
    } else {
      mx[i]=randomAny();
      if (mx[i]%2==0) mx2[i]=randomEven();
      else mx2[i]=randomOdd(); // test for sum(mx2)==0 at end of loop?
    }
    my[i]=randomAny();
    if (my[i]%2==0) my2[i]=randomOdd();
    else my2[i]=randomEvenNZ(); // test for 0
  }
  const getX=(i,t)=>{ return Math.cos(mx[i]*t)*Math.sin(mx2[i]*t); }
  const getY=(i,t)=>{ return Math.cos(my[i]*t)*Math.sin(my2[i]*t); }
  generatePoints(getX,getY,c);
//console.log(mx[0]+" "+mx2[0]);
//console.log(my[0]+" "+my2[0]);
}

const setPointsCS_CC=(line)=>{
  let mx=[], mx2=[];
  let my=[], my2=[];
  let c=line?1:getRandomInt(1,10);
// my+my2 must be odd, then 2 types: mx+mx2 is or or mx+mx2 is even
  for (let i=0; i<c; i++) {
    if (line) {
      mx[0]=0;
      mx2[0]=0;
    } else {
      mx[i]=randomAny();
      if (mx[i]%2==0) mx2[i]=randomOdd();
      else mx2[i]=randomEvenNZ();
    }
    my[i]=randomAny();
    if (my[i]%2==0) my2[i]=randomOdd();
    else my2[i]=randomEven();
  }
  const getX=(i,t)=>{ return Math.cos(mx[i]*t)*Math.sin(mx2[i]*t); }
  const getY=(i,t)=>{ return Math.cos(my[i]*t)*Math.cos(my2[i]*t); }
  generatePoints(getX,getY,c);
//console.log(mx[0]+" "+mx2[0]);
//console.log(my[0]+" "+my2[0]);
//console.log(c);
}

const setPointsCCS_CSS=(line)=>{
  let mx=[], mx2=[], mx3=[];
  let my=[], my2=[], my3=[];
  let c=line?1:getRandomInt(1,10);
// sum y factors must be odd, sum x factors either even or odd by type
  for (let i=0; i<c; i++) {
    if (line) {
      mx[0]=0;
      mx2[0]=0;
      mx3[0]=0;
    } else {
      mx[i]=randomAny();
      mx2[i]=randomAny();
      mx3[i]=randomAny();
      if ((mx2[i]+mx[i])%2==0) {
	mx3[i]=randomEvenNZ();
      } else {
	mx3[i]=randomOdd();
	//if (mx3[i]==0) mx3[i]=2;  // less needed as c increases, test it
      }
    }
    my[i]=randomAny();
    my2[i]=randomAny();
    if (my2[i]==0) my2[i]=1;
    if ((my2[i]+my[i])%2==0) {
      my3[i]=randomOdd();
    } else {
      my3[i]=randomEvenNZ();
    }
  }
  const getX=(i,t)=>{ return Math.cos(mx[i]*t)*Math.cos(mx2[i]*t)*Math.sin(mx3[i]*t); }
  const getY=(i,t)=>{ return Math.cos(my[i]*t)*Math.sin(my2[i]*t)*Math.sin(my3[i]*t); }
  generatePoints(getX,getY,c);
//console.log(c);
}

var LOGxm=0;
var LOGym=0;
var LOGc=0;

const setPointsCCS_CCS=(line)=>{
  let mx=[], mx2=[], mx3=[];
  let my=[], my2=[], my3=[];
  let c=line?1:getRandomInt(1,10);
// sum x is even and sum y is odd OR (typs) sum x is odd and sum y is even
  for (let i=0; i<c; i++) {
    if (line) {
      mx[0]=0;
      mx2[0]=0;
      mx3[0]=0;
    } else {
      mx[i]=getRandomInt(-3,4);
      mx2[i]=getRandomInt(-3,4);
      if ((mx[i]+mx2[i])%2==0) {
	mx3[i]=randomEvenNZ();
      } else {
	mx3[i]=randomOdd();
      }
    }
    my[i]=getRandomInt(-3,4);
    my2[i]=getRandomInt(-3,4);
    if ((my[i]+my2[i])%2==0) {
      my3[i]=randomOdd();
    } else {
      my3[i]=randomEvenNZ();
    }
  }
  const getX=(i,t)=>{ return Math.cos(mx[i]*t)*Math.cos(mx2[i]*t)*Math.sin(mx3[i]*t); }
  const getY=(i,t)=>{ return Math.cos(my[i]*t)*Math.cos(my2[i]*t)*Math.sin(my3[i]*t); }
  generatePoints(getX,getY,c);
}

const setPointsCCS_CCC=(line)=>{
  let mx=[], mx2=[], mx3=[];
  let my=[], my2=[], my3=[];
  let c=line?1:getRandomInt(1,10);
// sum of y is odd, then 2 types: sum of x is even OR sum of x is odd
  for (let i=0; i<c; i++) {
    if (line) {
      mx[0]=0;
      mx2[0]=0;
      mx3[0]=0;
    } else {
      mx[i]=getRandomInt(-3,4);
      mx2[i]=getRandomInt(-3,4);
      if ((mx[i]+mx2[i])%2==0) {
	mx3[i]=randomEvenNZ();
      } else {
	mx3[i]=randomOdd();
      }
    }
    my[i]=getRandomInt(-3,4);
    my2[i]=getRandomInt(-3,4);
    if ((my[i]+my2[i])%2==0) {
      my3[i]=randomOdd();
    } else {
      my3[i]=randomEven();
    }
  }
  const getX=(i,t)=>{ return Math.cos(mx[i]*t)*Math.cos(mx2[i]*t)*Math.sin(mx3[i]*t); }
  const getY=(i,t)=>{ return Math.cos(my[i]*t)*Math.cos(my2[i]*t)*Math.cos(my3[i]*t); }
  generatePoints(getX,getY,c);
//console.log(mx[0]+" "+mx2[0]+" "+mx3[0]);
//console.log(my[0]+" "+my2[0]+" "+my3[0]);
}

const setPointsCCCS_CSSS=(line)=>{
  let mx=[], mx2=[], mx3=[], mx4=[];
  let my=[], my2=[], my3=[], my4=[];
  let c=line?1:getRandomInt(1,5);
// if sum mx is even then sum my is odd, vice versa is 2nd type
  for (let i=0; i<c; i++) {
    if (line) {
      mx[0]=0, mx2[0]=0, mx3[0]=0, mx4[0]=0;
    } else {
      mx[i]=getRandomInt(-4,5);
      mx2[i]=getRandomInt(-4,5);
      mx3[i]=getRandomInt(-4,5);
      if ((mx[i]+mx2[i]+mx3[i])%2==0) {
        mx4[i]=randomEvenNZ();
      } else {
        mx4[i]=randomOdd();
      }
    }
    my[i]=getRandomInt(-4,5);
    my2[i]=getRandomInt(-4,5);
    if (my2[i]==0) my2[i]=2;
    my3[i]=getRandomInt(-4,5);
    if (my3[i]==0) my3[i]=2;
    if ((my[i]+my2[i]+my3[i])%2==0) {
      my4[i]=randomOdd();
    } else {
      my4[i]=randomEvenNZ();
    }
  }
  const gx=(i,t)=>{ 
    return Math.cos(mx[i]*t)*Math.cos(mx2[i]*t)*Math.cos(mx3[i]*t)*Math.sin(mx4[i]*t);
  }
  const gy=(i,t)=>{ 
    return Math.cos(my[i]*t)*Math.sin(my2[i]*t)*Math.sin(my3[i]*t)*Math.sin(my4[i]*t);
  }
  generatePoints(gx,gy,c);
//console.log(mx[0]+" "+mx2[0]+" "+mx3[0]+" "+mx4[0]);
//console.log(my[0]+" "+my2[0]+" "+my3[0]+" "+my4[0]);
}

const setPointsCCCS_CCSS=(line)=>{
  let mx=[], mx2=[], mx3=[], mx4=[];
  let my=[], my2=[], my3=[], my4=[];
// sum of my must be odd, 2 types: even mx sums, or odd mx sums
  let c=line?1:getRandomInt(1,5);
  for (let i=0; i<c; i++) {
    if (line) {
      mx[0]=0, mx2[0]=0, mx3[0]=0, mx4[0]=0;
    } else {
      mx[i]=getRandomInt(-4,5);
      mx2[i]=getRandomInt(-4,5);
      mx3[i]=getRandomInt(-4,5);
      if ((mx[i]+mx2[i]+mx3[i])%2==0) {
        mx4[i]=randomEvenNZ();
      } else {
        mx4[i]=randomOdd();
      }
    }
    my[i]=getRandomInt(-4,5);
    my2[i]=getRandomInt(-4,5);
    my3[i]=getRandomInt(-4,5);
    if (my3[i]==0) my3[i]=2;
    if ((my[i]+my2[i]+my3[i])%2==0) {
      my4[i]=randomOdd();
    } else {
      my4[i]=randomEvenNZ();
    } 
  }
  const gx=(i,t)=>{ 
    return Math.cos(mx[i]*t)*Math.cos(mx2[i]*t)*Math.cos(mx3[i]*t)*Math.sin(mx4[i]*t);
  }
  const gy=(i,t)=>{ 
    return Math.cos(my[i]*t)*Math.cos(my2[i]*t)*Math.sin(my3[i]*t)*Math.sin(my4[i]*t);
  }
  generatePoints(gx,gy,c);
//console.log(mx[0]+" "+mx2[0]+" "+mx3[0]+" "+mx4[0]);
//console.log(my[0]+" "+my2[0]+" "+my3[0]+" "+my4[0]);
}

var setPointsCCCS_CCCS=(line)=>{
  setPointsCCCS_CCCS.type=0;
  let mx=[], mx2=[], mx3=[], mx4=[];
  let my=[], my2=[], my3=[], my4=[];
// one type: sum x even, sum y odd, type2: sum x odd, sum y even
  let c=line?1:getRandomInt(1,5);
  for (let i=0; i<c; i++) {
    if (line) {
      mx[0]=0, mx2[0]=0, mx3[0]=0, mx4[0]=0;
    } else {
      mx[i]=randomAny();
      mx2[i]=randomAny();
      mx3[i]=randomAny();
      if ((mx[i]+mx2[i]+mx3[i])%2==0) {
        mx4[i]=randomEvenNZ();
      } else {
        mx4[i]=randomOdd();
      }
    }
    my[i]=randomAny();
    my2[i]=randomAny();
    my3[i]=randomAny();
    if ((my[i]+my2[i]+my3[i])%2==0) {
      my4[i]=randomOdd();
    } else {
      my4[i]=randomEvenNZ();
    } 
  }
  const gx=(i,t)=>{ 
    return Math.cos(mx[i]*t)*Math.cos(mx2[i]*t)*Math.cos(mx3[i]*t)*Math.sin(mx4[i]*t);
  }
  const gy=(i,t)=>{ 
    return Math.cos(my[i]*t)*Math.cos(my2[i]*t)*Math.cos(my3[i]*t)*Math.sin(my4[i]*t);
  }
  generatePoints(gx,gy,c);
}

var setPointsCCCS_CCCC=(line)=>{
  let mx=[], mx2=[], mx3=[], mx4=[];
  let my=[], my2=[], my3=[], my4=[];
  let c=line?1:getRandomInt(1,10);
// guess: sum of x either even or odd by type, sum of y always odd
  for (let i=0; i<c; i++) {
    if (line) {
      mx[0]=0, mx2[0]=0, mx3[0]=0, mx4[0]=0;
    } else {
      mx[i]=randomAny();
      mx2[i]=randomAny();
      mx3[i]=randomAny();
      if ((mx[i]+mx2[i]+mx3[i])%2==0) {
        if (type==0)  mx4[i]=randomEvenNZ();
        else mx4[i]=randomOdd();
      } else {
        if (type==0) mx4[i]=randomOdd();
        else mx4[i]=randomEvenNZ();
      }
    }
    my[i]=randomAny();
    my2[i]=randomAny();
    my3[i]=randomAny();
    if (my3[i]==0) my3[i]=2;
    if ((my[i]+my2[i]+my3[i])%2==0) {
      my4[i]=randomOdd();
    } else {
      my4[i]=randomEvenNZ();
    } 
  }
  const gx=(i,t)=>{ 
    return Math.cos(mx[i]*t)*Math.cos(mx2[i]*t)*Math.cos(mx3[i]*t)*Math.sin(mx4[i]*t);
  }
  const gy=(i,t)=>{ 
    return Math.cos(my[i]*t)*Math.cos(my2[i]*t)*Math.cos(my3[i]*t)*Math.cos(my4[i]*t);
  }
  generatePoints(gx,gy,c);
//console.log(mx[0]+" "+mx2[0]+" "+mx3[0]+" "+mx4[0]);
//console.log(my[0]+" "+my2[0]+" "+my3[0]+" "+my4[0]);
}

var curves=[new Curve(),new Curve()];

var ctx=canvas.getContext("2d");
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=3;
ctx.lineJoin="round";
//ctx.font="50px monospace";
//ctx.fillStyle="#AAD";
ctx.fillStyle="hsla(200,90%,80%,0.2)";
//ctx.fillStyle='hsla(0,100%,100%,.8)';
ctx.strokeStyle="black";

function cFrac() {
  let f1=.2;
  let f2=.8;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

const Z=400;
const I=TP/Z;

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.beginPath();
  let c1=curves[ps%2];
  let c2=curves[(ps+1)%2];
  let j=0;
  let f=fracs[0];
  //let x=(1-f)*c2.cs*c2.pts[0].x+f*c1.cs*c1.pts[0].x;
  //let y=(1-f)*c2.cs*c2.pts[0].y+f*c1.cs*c1.pts[0].y;
  let x=(1-f)*c2.X(0)+f*c1.X(0);
  let y=(1-f)*c2.Y(0)+f*c1.Y(0);
  ctx.moveTo(x,y);
  for (let i=1; i<Z; i+=1) {
    //let j=(i+100)%Z/2;
    j=(fracFactor*i)%Z;
    //let j=i;
    if (j<Z/2) f=fracs[j];
    else f=fracs[Z-1-j];
    //x=scale*((1-f)*c2.pts[i].x+f*c1.pts[i].x);
    //y=scale*((1-f)*c2.pts[i].y+f*c1.pts[i].y);
    x=(1-f)*c2.X(i)+f*c1.X(i);
    y=(1-f)*c2.Y(i)+f*c1.Y(i);
    ctx.lineTo(x,y);
  }
  x=(1-f)*c2.X(0)+f*c1.X(0);
  y=(1-f)*c2.Y(0)+f*c1.Y(0);
  ctx.lineTo(x,y);
  j=0;
  f=fracs[j];
  y=(1-f)*c2.X(0)+f*c1.X(0);
  x=(1-f)*c2.Y(0)+f*c1.Y(0);
  ctx.moveTo(x,y);
  for (let i=1; i<Z; i+=1) {
    j=(fracFactor*i)%Z;
    if (j<Z/2) f=fracs[j];
    else f=fracs[Z-1-j];
    ctx.lineTo((1-f)*c2.Y(i)+f*c1.Y(i),(1-f)*c2.X(i)+f*c1.X(i));
  }
  ctx.closePath();
ctx.lineWidth=12;
ctx.strokeStyle="#222";
  ctx.stroke();

  ctx.beginPath();
  j=0;
  f=fracs[j];
  x=(1-f)*c2.X(0)+f*c1.X(0);
  y=(1-f)*c2.Y(0)+f*c1.Y(0);
  ctx.moveTo(x,y);
  for (let i=1; i<Z; i+=1) {
    j=(fracFactor*i)%Z;
    if (j<Z/2) f=fracs[j];
    else f=fracs[Z-1-j];
    x=(1-f)*c2.X(i)+f*c1.X(i);
    y=(1-f)*c2.Y(i)+f*c1.Y(i);
    ctx.lineTo(x,y);
  }
  x=(1-f)*c2.X(0)+f*c1.X(0);
  y=(1-f)*c2.Y(0)+f*c1.Y(0);
  ctx.lineTo(x,y);
  j=0;
 f=fracs[j];
  y=(1-f)*c2.X(0)+f*c1.X(0);
  x=(1-f)*c2.Y(0)+f*c1.Y(0);
  ctx.moveTo(x,y);
  for (let i=1; i<Z; i+=1) {
    j=(fracFactor*i)%Z;
    if (j<Z/2) f=fracs[j];
    else f=fracs[Z-1-j];
    ctx.lineTo((1-f)*c2.Y(i)+f*c1.Y(i),(1-f)*c2.X(i)+f*c1.X(i));
  }
  ctx.closePath();
  ctx.lineWidth=2;
  ctx.strokeStyle="hsl(0,80%,50%)";
  ctx.stroke();

//  ctx.fill("evenodd");
}

const setPoints=()=>{
  const sp=[setPointsC_S,setPointsCS_CS,setPointsCS_CC,setPointsCCS_CSS,setPointsCCS_CCS,setPointsCCS_CCC,setPointsCCCS_CSSS,setPointsCCCS_CCSS,setPointsCCCS_CCCS,setPointsCCCS_CCCC];
  if (state%2==0) sp[state/2].call();
  else sp[(state-1)/2].call(null,true);
}

const transit=()=>{
  ps++;
  if (state%2==1) {
    //state=[CS_CSL,CCS_CSSL][getRandomInt(0,2)];
    state=[C_SL,CS_CSL,CS_CCL,CCS_CSSL,CCS_CCSL,CCS_CCCL,CCCS_CSSSL,CCCS_CCSSL,CCCS_CCCSL,CCCS_CCCCL][getRandomInt(0,10)];
//state=CCCS_CCCCL;
//state=CCS_CCCL;
    setPoints();
type=[0,1][getRandomInt(0,2)];
    state--;
    ps++;
  } else {
    if (Math.random()<0.3) {
    //if (Math.random()<-0.05) {
      state++;
    }
  }
  setPoints();
}

var step=0;
const start=()=>{
  if (step==Infinity && stx==0) { 
    step=0;
    transit();
    requestAnimationFrame(animate);
  } else {
    step=Infinity;
  }
}

var pauseTS=1400;
var pause=(ts)=>{
  //if (true) {
  if (step==Infinity) {
    draw(true);
    return;
  }
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    transit();
    fracFactor=[2,4][getRandomInt(0,2)];
    requestAnimationFrame(animate);
  }
}

var fracFactor=2;
var stx=0;
var frac=0;
var stxs=[];
var duration=4000;
var durF=1600;
var fCount=200;
var fracs=(()=>{
  let f=[];
  for (let i=0; i<fCount; i++) f[i]=1;
  return f; 
})();
var animate=(ts)=>{
  if (!stx) {
    stx=ts;
    for (let i=0; i<fCount; i++) {
      stxs[i]=ts+i*12;  // (duration-durF)/fCount
    }
  }
  for (let i=0; i<fCount; i++) {
    let pgs=ts-stxs[i];
    if (pgs<0) {
      fracs[i]=0;
    } else if (pgs<durF) {
      fracs[i]=pgs/durF; 
    } else {
      fracs[i]=1;
    }
  }
  let progress=ts-stx;
  if (progress<duration) {
    frac=progress/duration;
    draw();
/*
    if (!fade) fade=ts;
    if (ts-fade>60) {
      ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
      fade=0;
    }
*/ 
    requestAnimationFrame(animate);
  } else {
    draw();
    stx=0;
    if (step==Infinity) {
      draw(true);
      return;
    }
    //pauseTS=performance.now()+600;
    pauseTS=performance.now()+6;	// randomize?, no pause on line
    requestAnimationFrame(pause);
  }
}

transit();
transit();

onresize();
draw();
requestAnimationFrame(pause);
