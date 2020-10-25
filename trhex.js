"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");

const TP=2*Math.PI;
const CSIZE=400;
const SS=Math.pow(2,0.5);

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=1.3;

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

var C=40;
var W=100;   // 4-multiple

var q=[];
for (let w=0; w<=W; w++) q[w]=new Array(C+1);

//ctx.strokeStyle="hsl("+getRandomInt(0,360)+",70%,60%)";
var hues=[];
const COLCOUNT=W/2;   // need only W/2 for now
for (let i=0; i<COLCOUNT; i++) {
  let bh=getRandomInt(0,360);
  //bh=(bh+getRandomInt(60,120))%360;
  //bh=(bh++)%360;
  //bh=getRandomInt(-50,50);
  let sat=50+20*Math.random();
  let lum=50+20*Math.random();
  //hues.push("hsl("+bh+",70%,60%)");  // fill
  //hues.push("hsl("+bh+","+sat+"%,"+lum+"%)");  // fill
if (i==0) hues.push("transparent");
else 
  hues.push("hsla("+bh+","+sat+"%,"+lum+"%,0.85)");
  //hues.push(bh);  // fill
}

/*
const getPerimeterX=(t)=>{ 
  if (t<TP/8)        return SS*Math.sin(t);
  else if (t<3*TP/8) return 1;
  else if (t<5*TP/8) return SS*Math.sin(t);
  else if (t<7*TP/8) return -1;
  else               return SS*Math.sin(t);
}
const getPerimeterY=(t)=>{ 
  if (t<TP/8)        return -1;
  else if (t<3*TP/8) return -SS*Math.cos(t);
  else if (t<5*TP/8) return 1;
  else if (t<7*TP/8) return -SS*Math.cos(t);
  else               return -1;
}
*/

var Curve=function() {
  this.type=3;
  this.mx=[];  // roulette multipliers
  this.my=[];
  this.px=0;	// x process function for getX
  this.py=0;
  this.fx=[];
  this.fy=[];
  this.cx=1;
  this.cy=1;
  this.sf=1;
  this.setSizeFactor=()=>{
    this.sf=1;
    let maxp=0;
    for (let i=0; i<C*(W+1); i++) {
      let z=TP/C*i;
      maxp=Math.max(maxp,Math.abs(this.getX(z)));
      maxp=Math.max(maxp,Math.abs(this.getY(z)));
    }
    this.sf=1/(maxp<0.01?1:maxp);
  }
  this.setPerimeter=()=>{
    this.px=(t)=>{
      if (t<TP/8)        return SS*Math.sin(t);
      else if (t<3*TP/8) return 1;
      else if (t<5*TP/8) return SS*Math.sin(t);
      else if (t<7*TP/8) return -1;
      else               return SS*Math.sin(t);
    }
    this.py=(t)=>{
      if (t<TP/8)        return -1;
      else if (t<3*TP/8) return -SS*Math.cos(t);
      else if (t<5*TP/8) return 1;
      else if (t<7*TP/8) return -SS*Math.cos(t);
      else               return -1;
    }
//    this.px=(t)=>{ return getPerimeterX(t); };
//    this.py=(t)=>{ return getPerimeterY(t); };
  }
  this.randomizeStar=()=>{
    let a=[3,1,5][getRandomInt(0,3,true)];
    let b=[3,1,5][getRandomInt(0,3,true)];
    let gr=[0,Math.random(),1][getRandomInt(0,3)];
    this.px=(t)=>{ return gr*Math.pow(Math.sin(t),a)+(1-gr)*Math.pow(Math.cos(t),a); }
    this.py=(t)=>{ return -(gr*Math.pow(Math.cos(t),b)-(1-gr)*Math.pow(Math.sin(t),b)); }
  }
  this.randomizeCircles=()=>{
    //let rx1=[0,Math.pow(Math.random(),2),1][getRandomInt(0,3)];
    let ry1=1-50/CSIZE*Math.random();  // need ZP for 50
/*
    let rx2=Math.pow(Math.random(),2);
    let ry1=[0,Math.pow(Math.random(),2),1][getRandomInt(0,3)];
    let ry2=Math.pow(Math.random(),2);
    let dfx1=[-1,1][getRandomInt(0,2)];
    let dfx2=[-1,1][getRandomInt(0,2)];
    let dfy1=[-1,1][getRandomInt(0,2)];
    let dfy2=[-1,1][getRandomInt(0,2)];
*/
    //let gx=[Math.random()/2,1][gr];
    //let gx=[Math.random(),Math.random()][gr];
    let gr=[0,Math.random(),1][getRandomInt(0,3)];
//let gr=1;
//console.log(gx.toFixed(3)+" "+gy);
    //this.px=(t)=>{ return gr*(rx1+(1-rx1)*Math.sin(t))-(1-gr)*(rx1+(1-rx1)*Math.cos(t)); }
    //this.px=(t)=>{ return gr*(rx1*Math.sin(t))-(1-gr)*(rx1)*Math.cos(t); }
    this.px=(t)=>{ return gr*Math.sin(t)+(1-gr)*Math.cos(t); }
    this.py=(t)=>{ return -gr*ry1*Math.cos(t)+ry1*(1-gr)*Math.sin(t); }
    //this.px=(t)=>{ return (1-gx)*Math.cos(t)+gx*Math.sin(t); }
    //this.py=(t)=>{ return -((1-gy)*Math.cos(t)+gy*Math.sin(t)); }
    //this.px=(t)=>{ return (1-gx)*(rx1+(1-rx1)*Math.cos(t))+gx*(rx2+(1-rx2)*Math.sin(t)); }
    //this.py=(t)=>{ return (1-gy)*(ry1+(1-ry1)*Math.cos(t))+gy*(ry2+(1-ry2)*Math.sin(t)); }
    //this.px=(t)=>{ return (1-gx)*dfx1*(rx1+(1-rx1)*Math.cos(t))+gx*dfx2*(rx2+(1-rx2)*Math.sin(t)); }
    //this.py=(t)=>{ return (1-gy)*dfy1*(ry1+(1-ry1)*Math.cos(t))+gy*dfy2*(ry2+(1-ry2)*Math.sin(t)); }
  }
  this.randomizeFactors=()=>{
    this.mx=[];
    this.my=[];
    this.cx=getRandomInt(1,8);
    this.cy=getRandomInt(1,8);
    let multipliers=[-1,1,-2,2,-3,3,-4,4,-5,5];
    for (let i=0; i<this.cx; i++) {
      this.fx[i]=[-1,1][getRandomInt(0,2)];
      this.mx[i]=multipliers[getRandomInt(0,8,true)];
    }
    for (let i=0; i<this.cy; i++) {
      this.fy[i]=[-1,1][getRandomInt(0,2)];
      this.my[i]=multipliers[getRandomInt(0,8,true)];
    }
    this.setSizeFactor();
  }
  this.randomize=()=>{
    this.type=[0,2,3,4,5,6,6,6][getRandomInt(0,8)];
    //this.type=[3,6,6][getRandomInt(0,3)];
//this.type=2;
//console.log(this.type);
    if (this.type<2) this.randomizeFactors();
    else if (this.type==4) this.setPerimeter();
    else if (this.type==5) this.randomizeStar();
    else if (this.type==6) this.randomizeCircles();
  }
  this.getX=(t)=>{ 
    if (this.type>3) return this.px.call(null,t);
    if (this.type==3) return Math.sin(t);
    if (this.type==2) return getHeartX(t)*0.95;
    let v=0;
    if (this.type==1) for (let i=0; i<this.cx; i++) v+=this.fx[i]*Math.cos(this.mx[i]*t);
    else for (let i=0; i<this.cx; i++) v+=this.fx[i]*Math.sin(this.mx[i]*t);
    return v*this.sf;
  }
  this.getY=(t)=>{ 
    if (this.type>3) return this.py.call(null,t);
    if (this.type==3) return -Math.cos(t);
    if (this.type==2) return getHeartY(t)*0.95;
    let v=0;
    if (this.type==1) for (let i=0; i<this.cy; i++) v+=this.fy[i]*Math.sin(this.my[i]*t);
    else for (let i=0; i<this.cy; i++) v+=this.fy[i]*Math.cos(this.my[i]*t);
    return v*this.sf;
  }
  this.randomize();
}
var curveSet1=0;
var curveSet1b=1;
var curveSet2=0;
var curveSet2b=1;
var curve1=[new Curve(), new Curve()];  // destination for hex flow
var curve2=[new Curve(), new Curve()];  // source for hex flow

//const getSquareX=(t)=>{ return (11*Math.sin(t)+1.3*Math.sin(3*t))/10; }
//const getSquareY=(t)=>{ return (11*Math.cos(t)-1.3*Math.cos(3*t))/10; }

const getHeartX=(t)=>{ return Math.pow(Math.sin(t),3); }
const getHeartY=(t)=>{ 
  return -0.8125*Math.cos(t)+0.3125*Math.cos(2*t)+0.125*Math.cos(3*t)+0.0625*Math.cos(4*t);
}

var getCurve1X=(t)=>{ 
  if (cFrac1==0) return curve1[curveSet1b].getX(t);
  else return (1-cFrac1)*curve1[curveSet1b].getX(t)+cFrac1*curve1[curveSet1].getX(t); 
}
var getCurve1Y=(t)=>{ 
  if (cFrac1==0) return curve1[curveSet1b].getY(t);
  return (1-cFrac1)*curve1[curveSet1b].getY(t)+cFrac1*curve1[curveSet1].getY(t); 
}
var getCurve2X=(t)=>{ 
  if (cFrac2==0) return curve2[curveSet2b].getX(t);
  return (1-cFrac2)*curve2[curveSet2b].getX(t)+cFrac2*curve2[curveSet2].getX(t); 
}
var getCurve2Y=(t)=>{ 
  if (cFrac2==0) return curve2[curveSet2b].getY(t);
  return (1-cFrac2)*curve2[curveSet2b].getY(t)+cFrac2*curve2[curveSet2].getY(t); 
}

var getPointX=(t,u)=>{ return (1-u)*getCurve1X(t)+u*getCurve2X(t); }
var getPointY=(t,u)=>{ return (1-u)*getCurve1Y(t)+u*getCurve2Y(t); }

var ZP=50;	// randomize?
const perimeter=[ZP,CSIZE];

var setPoints=()=>{
  let zp=(1-pFrac)*perimeter[perimSet]+pFrac*perimeter[(perimSet+1)%2];
  let rp=(1-pFrac)*perimeter[(perimSet+1)%2]+pFrac*perimeter[perimSet];
  q=[];
  for (let w=0; w<=W; w++) {
    q[w]=[];
    let M=zp;
    let b=false;
    let r=w*TP/W+t;
    if (Math.cos(r)<0) {
      M=(rp-zp+(rp-zp)*Math.sin(r))/2+zp;
    } else {
      b=true;
      if (Math.sin(r)<0) M=zp;
      else M=rp;
    }
    let qw=(Math.sin(r)+1)/2; // proportion of layer associated with "inner/outer" curve; 
    let sk=[0,-TP/C/2,-TP/C/2,0];
    for (let c=0; c<C+2; c++) {
      let t=TP/C*c+sk[w%4];
      q[w].push({"x":M*getPointX(t,qw),"y":M*getPointY(t,qw),"b":b});
    }
  }
}

var frame=false;
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let w=0; w<W; w++) {
    if (w%2==0) {
      let w1=(w+1)%W;
      let w2=(w+2)%W;
      //let wm1=(W+w-1)%W;
      //let wm2=(W+w-2)%W;
      //if (q[w][0].b && q[w+1][0].b && q[w2][0].b) continue;
      //if (q[w][0].b && q[w+1][0].b && q[wm1][0].b) continue;
      //if (q[w][0].b && q[w+1][0].b && q[wm2][0].b && q[wm1][0].b && q[wm2][0].b) continue;
      //if (q[w][0].b && q[w+1][0].b && q[wm1][0].b) continue;
      //if (q[w][0].b && q[w+1][0].b) continue;
      if (q[w+1][0].b) continue;
      //if (q[w][0].b || q[w+1][0].b) continue;
      //let w2=(w+2)%W;
      let w3=(w+3)%W;
      for (let c=0; c<C; c++) {
	let cm=(w%4==0)?c:(C+c-1)%C;
	let cp=(w%4==0)?c+1:c;
	ctx.beginPath();
	ctx.moveTo(q[w][c].x,q[w][c].y);
	ctx.lineTo(q[w+1][cm].x,q[w+1][cm].y);
	ctx.lineTo(q[w2][cm].x,q[w2][cm].y);
	ctx.lineTo(q[w3][c].x,q[w3][c].y);
	ctx.lineTo(q[w2][cp].x,q[w2][cp].y);
	ctx.lineTo(q[w+1][cp].x,q[w+1][cp].y);
	ctx.closePath();
	ctx.stroke();
	if (frame) {
	} else {
	  //ctx.fillStyle=hues[(w+3*c%2)%COLCOUNT];
	  ctx.fillStyle=hues[(w+c%2)%COLCOUNT];
	  //ctx.fillStyle=hues[w/2];
	  ctx.fill();
	}
      }
    }
  }
}

var SH=0;
var t=0;
var perimSet=1;
var pTime=0;
var pFrac=0;
var cTime=0;
var cFrac1=0;
var cFrac2=0;
var stopped=true;
var duration=7000;  // fit in time window, slower than t unit, faster than modulus
var animate=(ts)=>{
  if (stopped) return;
//  t=0.0003*ts;
  t+=0.005;
  if (SH==0) if (Math.floor(t)%2==0) { SH=[1,2,2,2,3,3,3][getRandomInt(0,7)]; }
  if (SH==1) {
    if (!pTime) { pTime=ts; }
    let progress=ts-pTime;
    if (progress<duration) {
      pFrac=progress/duration;
    } else {
      perimSet=++perimSet%2;
      pFrac=0;
      pTime=0;
      SH=0;
      if (EM) stopped=true;
    }
  }
  if (SH>1) {
    if (!cTime) { 
      cTime=ts; 
console.log(curve1[curveSet1].type+" "+curve2[curveSet2].type);
    }
    let progress=ts-cTime;
    if (progress<duration) {
      if (SH==2) cFrac1=progress/duration;
      else cFrac2=progress/duration;
    } else {
      if (SH==3) {
        curveSet2b=curveSet2;
	curveSet2=++curveSet2%2;
	curve2[curveSet2].randomize();
	cFrac2=0;
      } else {
        curveSet1b=curveSet1;
	curveSet1=++curveSet1%2;
	curve1[curveSet1].randomize();
	cFrac1=0;
      }
      cTime=0;
      SH=0;
      if (EM) stopped=true;
    }
  }
  setPoints();
  draw();
  requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    stopped=false;
    if (frame) ctx.strokeStyle="hsl("+getRandomInt(0,360)+",70%,60%)";
    else ctx.strokeStyle="#444";
    if (pFrac>0) pTime=performance.now()-pFrac*duration;
    else if (cFrac1>0) cTime=performance.now()-cFrac1*duration;
    else if (cFrac2>0) cTime=performance.now()-cFrac2*duration;
    requestAnimationFrame(animate);
  } else {
    frame=!frame;
    stopped=true;
  }
}
body.addEventListener("click", start, false);

onresize();
setPoints();
start();
