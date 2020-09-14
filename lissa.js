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
const C_SR=0, C_SL=1, CS_CSR=2, CS_CSL=3, CS_CCR=4, CS_CCL=5, CCS_CSSR=6, CCS_CSSL=7;
var state=6;

var Curve=function() {
  this.cs=1;	// curve scale
  this.sp=[setPointsC_S,setPointsCS_CS,setPointsCS_CC,setPointsCCS_CSS];
  this.setPoints=()=>{
    if (state%2==0) {
      this.sp[state/2].call();
    } else {
      this.sp[(state-1)/2].call(null,true);
    }
  }
/*
if (state<6) {	// temporary
} else {
    if (state==CCS_CSSR) {
      setPointsCCS_CSS();
    } else if (state==CS_CSR) {
      setPointsCS_CS();
    } else if (state==C_SR) {
      setPointsC_S();
    } else if (state==CS_CCR) {
      setPointsCS_CC();
    } else if (state==C_SL) {
setPointsC_S.call(null,true);
//      setPointsC_S(true);
    } else if (state==CS_CCL) {
      setPointsCS_CC(true);
    } else if (state==CS_CSL) {
      setPointsCS_CS(true);
    } else if (state==CCS_CSSL) {
      setPointsCCS_CSS(true);
    } else {
      debugger;
    }
}
*/
  this.X=(idx)=>{ return scale*this.cs*this.pts[idx].x; }
  this.Y=(idx)=>{ return scale*this.cs*this.pts[idx].y; }
}

const setPointsC_S2=(line)=>{	// inefficient
  let mux={}, muy={};
  let c=getRandomInt(1,10);
  for (let i=0; i<c; i++) {
    let m=2*getRandomInt(-3,3)+1;
    if (mux.hasOwnProperty(m)) mux[m]++;
    else mux[m]=1;
    if (ps%3==0) {  	// variety
      m=2*getRandomInt(-3,3)+1;
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

const setPointsC_S=(line)=>{
  let mx=[];
  let my=[];
  let c=getRandomInt(1,10);
  for (let i=0; i<c; i++) {
    mx[i]=2*getRandomInt(-3,3)+1;
    if (ps%3==0) {  	// variety
      my[i]=2*getRandomInt(-3,3)+1;
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

const generatePoints=(xf,yf,c)=>{
  let pointSet=ps%2;
  curves[pointSet].pts=[];
  curves[pointSet].cs=1;
  let maxs=0;
  for (let i=0, t=0; i<Z; i+=1, t=i*I) {
    let x=xf(t);
    maxs=Math.max(maxs,x);
    let y=yf(t);
    maxs=Math.max(maxs,y);
    curves[pointSet].pts.push({"x":x,"y":y});
  }
  curves[pointSet].cs=1/(maxs<0.01?1:maxs);
}

const setPointsCS_CS=(line)=>{
  let mx=[], mx2=[];
  let my=[], my2=[];
  let c=line?1:getRandomInt(1,8);
  if (line) {
    my[0]=0;
    my2[0]=0;
    mx[0]=2*getRandomInt(-3,4);
    if (mx[0]%2==0) mx2[0]=2*getRandomInt(-2,2)+1;
    else mx2[0]=2*getRandomInt(-2,3);
//      mx2[0]=mx[0]+2*getRandomInt(-2,2)+1;
  } else {
    for (let i=0; i<c; i++) {
      mx[i]=getRandomInt(-3,4);
      if (mx[i]%2==0) mx2[i]=2*getRandomInt(-2,2)+1;
      else mx2[i]=2*getRandomInt(-2,3); // test for 0 in if
//      mx2[i]=mx[i]+2*getRandomInt(-2,2)+1;  // test even odd, rather than add
      if (mx2[i]==0) mx2[i]=2;
      my[i]=getRandomInt(-3,4);
      //my[i]=mx[i];
      if (my[i]%2==0) my2[i]=2*getRandomInt(-2,3);
      else my2[i]=2*getRandomInt(-2,2)+1; // test for 0 in if
//      my2[i]=my[i]+2*getRandomInt(-2,3);  // test even odd, rather than add
      if (my2[i]==0) my2[i]=2;
    }
  }
  var getXM=(t)=>{ 
    let v=0;
    for (let i=0; i<c; i++) v+=Math.cos(mx[i]*t)*Math.sin(mx2[i]*t);
    return v;
  }
  var getYM=(t)=>{ 
    let v=0;
    for (let i=0; i<c; i++) v+=Math.cos(my[i]*t)*Math.sin(my2[i]*t);
    return v;
  }
  generatePoints(getXM,getYM,c);
}

const setPointsCS_CC=(line)=>{
  let mx=[], mx2=[];
  let my=[], my2=[];
  let c=line?1:getRandomInt(1,8);
  if (line) {
    mx[0]=0;
    mx2[0]=0;
    my2[0]=0;
    my[0]=2*getRandomInt(-2,3);
    if (my[0]%2==0) my2[0]=2*getRandomInt(-2,2)+1;
    else my2[0]=2*getRandomInt(-2,3);
  } else {
    for (let i=0; i<c; i++) {
      mx[i]=getRandomInt(-3,4);
      if (mx[i]%2==0) mx2[i]=2*getRandomInt(-2,2)+1;
      else mx2[i]=2*getRandomInt(-2,3);
//      mx2[i]=mx[i]+2*getRandomInt(-2,3);
      if (mx2[i]==0) mx2[i]=2;
      my[i]=getRandomInt(-3,4);
      if (my[i]%2==0) my2[i]=2*getRandomInt(-2,2)+1;
      else my2[i]=2*getRandomInt(-2,3);
    //my2[i]=my[i]+2*getRandomInt(-2,2)+1;
    }
  }
  const getX=(t)=>{ 
    let v=0;
    for (let i=0; i<c; i++) v+=Math.cos(mx[i]*t)*Math.sin(mx2[i]*t);
    return v;
  }
  const getY=(t)=>{ 
    let v=0;
    for (let i=0; i<c; i++) v+=Math.cos(my[i]*t)*Math.cos(my2[i]*t);
    return v;
  }
  generatePoints(getX,getY,c);
}

const setPointsCCS_CSS=(line)=>{
  let mx=[], mx2=[], mx3=[];
  let my=[], my2=[], my3=[];
  let c=line?1:getRandomInt(1,5);
  if (line) {
    mx[0]=0;  // untested
    mx2[0]=0;
    mx3[0]=0;
    my[0]=2*getRandomInt(-2,3);
    my2[0]=2*getRandomInt(-3,4);
    if (my2[0]==0) my2[0]=2;
    my3[0]=2*getRandomInt(-3,3)+1;
/*
    my[0]=0;
    my2[0]=0;
    my3[0]=0;
    mx[0]=2*getRandomInt(-2,3);
    //mx[0]=0;
    mx2[0]=2*getRandomInt(-3,4);
    mx3[0]=2*getRandomInt(-3,3)+1;
*/
  } else {
    for (let i=0; i<c; i++) {
      mx[i]=getRandomInt(-3,4);
      mx2[i]=getRandomInt(-3,4);
      if ((mx2[i]-mx[i])%2==0) {
	mx3[i]=2*getRandomInt(-3,3)+1;
      } else {
	mx3[i]=2*getRandomInt(-2,3);
	if (mx3[i]==0) mx3[i]=2;  // less needed as c increases, test it
      }
      my[i]=getRandomInt(-3,4);
      my2[i]=getRandomInt(-3,4);
      if (my2[i]==0) my2[i]=1;
      if ((my2[i]-my[i])%2==0) {
	my3[i]=2*getRandomInt(-3,3)+1;
      } else {
	my3[i]=2*getRandomInt(-3,4);
	if (my3[i]==0) my3[i]=2;  // less needed as c increases, test it
      }
    }
  }
  const getXT=(t)=>{ 
    let v=0;
    for (let i=0; i<c; i++) v+=Math.cos(mx[i]*t)*Math.cos(mx2[i]*t)*Math.sin(mx3[i]*t);
    return v;
  }
  const getYT=(t)=>{ 
    let v=0;
    for (let i=0; i<c; i++) v+=Math.cos(my[i]*t)*Math.sin(my2[i]*t)*Math.sin(my3[i]*t);
    return v;
  }
  generatePoints(getXT,getYT,c);
/*
  let pointSet=ps%2;
  curves[pointSet].pts=[];
  curves[pointSet].cs=1;
  let maxs=0;
  for (let i=0, t=0; i<Z; i+=1, t=i*I) {
    let x=getXT(t)/c; 
    maxs=Math.max(maxs,x);
    let y=getYT(t)/c;
    maxs=Math.max(maxs,y);
    curves[pointSet].pts.push({"x":x,"y":y});
  }
  curves[pointSet].cs=1/(maxs<0.01?1:maxs);
*/
}

const setPointsCCS_CCS=(line)=>{
  let mx=[], mx2=[], mx3=[];
  let my=[], my2=[], my3=[];
  let c=line?1:getRandomInt(1,5);
  if (line) {
    mx[0]=0;
    mx2[0]=0;
    mx3[0]=0;
    my[0]=2*getRandomInt(-2,3);
    my2[0]=2*getRandomInt(-3,4);
    if (my2[0]==0) my2[0]=2;
    my3[0]=2*getRandomInt(-3,3)+1;
  } else {
    for (let i=0; i<c; i++) {
      mx[i]=getRandomInt(-3,4);
      mx2[i]=getRandomInt(-3,4);
      if ((mx2[i]-mx[i])%2==0) {
	mx3[i]=2*getRandomInt(-3,3)+1;
      } else {
	mx3[i]=2*getRandomInt(-2,3);
	if (mx3[i]==0) mx3[i]=2;  // less needed as c increases, test it
      }
      my[i]=getRandomInt(-3,4);
      my2[i]=getRandomInt(-3,4);
      if (my2[i]==0) my2[i]=1;
      if ((my2[i]-my[i])%2==0) {
	my3[i]=2*getRandomInt(-3,3)+1;
      } else {
	my3[i]=2*getRandomInt(-3,4);
	if (my3[i]==0) my3[i]=2;  // less needed as c increases, test it
      }
    }
  }
}

var curve1=new Curve();
var curve2=new Curve();
var curves=[curve1,curve2];

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
//ctx.lineWidth=10;
//ctx.strokeStyle="red";
  ctx.stroke();

/*
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
  ctx.lineWidth=4;
  ctx.strokeStyle="blue";
  ctx.stroke();
*/

//  ctx.fill("evenodd");
}

const transit=()=>{
  ps++;
  if (state%2==1) {
    //state=[CS_CSL,CCS_CSSL][getRandomInt(0,2)];
    state=[C_SL,CS_CSL,CS_CCL,CCS_CSSL][getRandomInt(0,4)];
    curves[ps%2].setPoints();
    state--;
    ps++;
  } else {
    //if (Math.random()<0.3) {
    if (Math.random()<0.5) {
      state++;
    }
  }
  curves[ps%2].setPoints();
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

curve1.setPoints();
curve2.setPoints();
transit();

onresize();
draw();
requestAnimationFrame(pause);
