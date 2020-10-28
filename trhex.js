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

const randomColor=()=>{
/*
  let bh=getRandomInt(0,360);
  //bh=(bh+getRandomInt(60,120))%360;
  //bh=(bh++)%360;
  //bh=getRandomInt(-50,50);
*/
  return "hsla("+getRandomInt(0,360)+","
                +(50+20*Math.random())+"%,"
                +(50+20*Math.random())+"%,0.85)";
}
var hues=[];
const COLCOUNT=W/2;   // need only W/2 for now
for (let i=0; i<COLCOUNT; i++) {
  if (i%17==0) hues.push("transparent");
  else hues.push(randomColor());
}

var Curve=function() {
  this.type=4;
  this.getX=(z)=>{ /*debugger;*/ return 0; }
  this.getY=(z)=>{ /*debugger;*/ return 0; }
  this.setHeart=()=>{
    this.getX=(z)=>{ return 0.95*Math.pow(Math.sin(z),3); }
    this.getY=(z)=>{ 
      return 0.95*(-0.8125*Math.cos(z)+0.3125*Math.cos(2*z)+0.125*Math.cos(3*z)+0.0625*Math.cos(4*z)); 
    }
  }
  this.setSimpleCircle=()=>{
    this.getX=(z)=>{ return Math.sin(z); }
    this.getY=(z)=>{ return -Math.cos(z); }
  }
  this.setPerimeter=()=>{
    let fx=(z)=>{
      if (z<TP/8)        return SS*Math.sin(z);
      else if (z<3*TP/8) return 1;
      else if (z<5*TP/8) return SS*Math.sin(z);
      else if (z<7*TP/8) return -1;
      else               return SS*Math.sin(z);
    }
    let fy=(z)=>{
      if (z<TP/8)        return -1;
      else if (z<3*TP/8) return -SS*Math.cos(z);
      else if (z<5*TP/8) return 1;
      else if (z<7*TP/8) return -SS*Math.cos(z);
      else               return -1;
    }
    let gr=1; let gdx=1; let gdy=-1;
/*
    let gr=[0,Math.random(),1][getRandomInt(0,3)];
    let inv=getRandomInt(0,2);
    let gdx=[1,-1][inv];
    let gdy=[-1,1][inv];
*/
    this.getX=(z)=>{ return gr*fx(z)+gdx*(1-gr)*fy(z); }
    this.getY=(z)=>{ return gr*fy(z)+gdy*(1-gr)*fx(z); }
  }
  this.randomizeStar=()=>{
    let a=[3,5][getRandomInt(0,2)];
    let b=[3,5][getRandomInt(0,2)];
    let c=[3,5][getRandomInt(0,2)];
    let d=[3,5][getRandomInt(0,2)];
    let cx1=[0,Math.random(),1][getRandomInt(0,3)];
    let cx2=[0,Math.random(),1][getRandomInt(0,3)];
    let cy1=[0,Math.random(),1][getRandomInt(0,3)];
    let cy2=[0,Math.random(),1][getRandomInt(0,3)];

    let sfxs=(z)=>{ return cx1*Math.sin(z)+(1-cx1)*Math.pow(Math.sin(z),a); }
    let sfxc=(z)=>{ return cx2*Math.cos(z)+(1-cx2)*Math.pow(Math.cos(z),b); }
    let sfyc=(z)=>{ return cy1*Math.cos(z)+(1-cy1)*Math.pow(Math.cos(z),c); }
    let sfys=(z)=>{ return cy2*Math.sin(z)+(1-cy2)*Math.pow(Math.sin(z),d); }

    let gr=[1,Math.random(),0][getRandomInt(0,3,true)];
    //let gr=1;
    let inv=getRandomInt(0,2);
    let gdx=[1,-1][inv];
    let gdy=[-1,1][inv];
    this.getX=(z)=>{ return gr*sfxs(z)+gdx*(1-gr)*sfxc(z); }
    this.getY=(z)=>{ return -(gr*sfyc(z)+gdy*(1-gr)*sfys(z)); }
  }
  this.randomizeCircles=()=>{
    let ry1=[1,1,1-(CSIZE-30)/CSIZE*Math.random()][getRandomInt(0,3)];  // need ZP for 50
    //let ry1=[1,Math.random()][getRandomInt(0,2)];
    let gr=[0,Math.random(),1][getRandomInt(0,3)];
    let gd=[1,-1][getRandomInt(0,2)];
    this.getX=(z)=>{ return gr*Math.sin(z)+gd*(1-gr)*Math.cos(z); }
    this.getY=(z)=>{ return -gr*ry1*Math.cos(z)+ry1*gd*(1-gr)*Math.sin(z); }
  }

  this.randomizeFactors=()=>{
    let gx=0.8+0.2*Math.random();
    let gy=0.8+0.2*Math.random();
    let inv=getRandomInt(0,2);
    let gdx=[1,-1][inv];
    let gdy=-gdx;
    let xf=[3,5,7][getRandomInt(0,3,true)];
    let yf=[3,5,7][getRandomInt(0,3,true)];
    let procx=(z)=>{ return gx*Math.sin(z)+gdx*(1-gx)*Math.sin(xf*z); }
    let procy=(z)=>{ return -gy*(Math.cos(z)+gdy*(1-gy)*Math.cos(yf*z)); }
    //let gx2=0.7+0.3*Math.random();
    //let inv2=getRandomInt(0,2);
    let gx2=getRandomInt(0,2);
    let inv3=getRandomInt(0,2);
    let gdx2=[1,-1][inv3];
    let procx2=(z)=>{ return (gx2*procx(z)-gdx*(1-gx2)*procy(z)); }
    let procy2=(z)=>{ return (gx2*procy(z)+gdx*(1-gx2)*procx(z)); }
    let sf=(()=>{
      let maxp=0;
      for (let i=0; i<C*(W+1); i++) {
	let z=TP/C*i;
	maxp=Math.max(maxp,Math.abs(procx2(z)));
	maxp=Math.max(maxp,Math.abs(procy2(z)));
      }
      return 1/(maxp<0.01?1:maxp);
    })();
    this.getX=(z)=>{ return sf*procx2(z); }
    this.getY=(z)=>{ return sf*procy2(z); }
  }
/*
  this.randomizeFactorsO=()=>{
    let mx=[];
    let my=[];
    let fx=[];
    let fy=[];
    let cx=1;
    let cy=1;
    cx=getRandomInt(1,8);
    cy=getRandomInt(1,8);
    //let multipliers=[-1,1,-2,2,-3,3,-4,4,-5,5];
    let multipliers=[1,1];
    for (let i=0; i<cx; i++) {
      fx[i]=[1,1][getRandomInt(0,2)];
      mx[i]=multipliers[getRandomInt(0,2,true)];
    }
    for (let i=0; i<cy; i++) {
      fy[i]=[-1,-1][getRandomInt(0,2)];
      my[i]=multipliers[getRandomInt(0,2,true)];
    }
    let procx=(z)=>{
      let v=0;
      for (let i=0; i<cx; i++) v+=fx[i]*Math.sin(mx[i]*z);
      return v;
    }
    let procy=(z)=>{
      let v=0;
      for (let i=0; i<cy; i++) v+=fy[i]*Math.cos(my[i]*z);
      return v;
    }
    let sf=(()=>{
      let maxp=0;
      for (let i=0; i<C*(W+1); i++) {
	let z=TP/C*i;
	maxp=Math.max(maxp,Math.abs(procx(z)));
	maxp=Math.max(maxp,Math.abs(procy(z)));
      }
      return 1/(maxp<0.01?1:maxp);
    })();
    this.getX=(z)=>{ return sf*procx(z); }
    this.getY=(z)=>{ return sf*procy(z); }
  }
*/
  this.randomize=()=>{
    this.type=[0,0,0,0,0,1,1,1,1,2,4,4,5,5][getRandomInt(0,14)];
    //this.type=[0,1,1,3,4,5][getRandomInt(0,6)];
    //this.type=[0,0,4][getRandomInt(0,3)];
    if (this.type==0) this.randomizeFactors();
    else if (this.type==1) this.randomizeCircles();
    else if (this.type==2) this.setHeart();
    else if (this.type==3) this.setSimpleCircle();
    else if (this.type==4) this.setPerimeter();
    else if (this.type==5) this.randomizeStar();
//    else debugger;
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

var getPointX=(z,u)=>{ return (1-u)*getCurve1X(z)+u*getCurve2X(z); 
/*
  if (u<0) {
    return (u+1)*getCurve2X(z)-u*getCurve1X(z); 
  } else {
//    return (-u/2)*getCurve2X(z); 
  }
*/
}

var getPointY=(z,u)=>{ return (1-u)*getCurve1Y(z)+u*getCurve2Y(z); 
/*
  if (u<0) {
    return (1-u)*getCurve2Y(z)+u*getCurve1Y(z); 
  } else {
//    return (-u/2)*getCurve2Y(z); 
  }
*/
}

var ZP=30;	// randomize?
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
      let th=TP/C*c+sk[w%4];  // hex skews
      q[w].push({"x":M*getPointX(th,qw),"y":M*getPointY(th,qw),"b":b});
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
      if (q[w+1][0].b) { 
if (!q[w2][0].b) hues[w%COLCOUNT]=randomColor();
continue; 
}
      //if (q[w][0].b || q[w+1][0].b) continue;
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

var transitCurve2=()=>{
  curveSet2b=curveSet2;
  curveSet2=++curveSet2%2;
  curve2[curveSet2].randomize();
  cFrac2=0;
}

var transitCurve1=()=>{
  curveSet1b=curveSet1;
  curveSet1=++curveSet1%2;
  curve1[curveSet1].randomize();
  cFrac1=0;
}

var SH=3;
var SHP=false;
var SH1=false;
var SH2=false;
var t=0;
var perimSet=1;
var pTime=0;
var pFrac=0;
var cTime1=0;
var cTime2=0;
var cFrac1=0;
var cFrac2=0;
var stopped=true;
var duration=4000;
var animate=(ts)=>{
  if (stopped) return;
//  t=0.0003*ts;
//  t+=0.005;
  t+=0.004;

  if (SHP || Math.random()<0.0002) {
    if (!SHP) SHP=true;
    if (!pTime) { pTime=ts; }
    let progress=ts-pTime;
    if (progress<duration) {
      pFrac=progress/duration;
    } else {
      perimSet=++perimSet%2;
      pFrac=0;
      pTime=0;
      SHP=false;
      if (EM) stopped=true;
    }
  }
  if (SH2 || Math.random()<0.01) {
    if (!SH2) SH2=true;
    if (!cTime2) { cTime2=ts; 
//console.log("C2 "+curve2[curveSet2b].type+" "+curve2[curveSet2].type);
}
    let progress=ts-cTime2;
    if (progress<duration) {
      cFrac2=progress/duration;
    } else {
      transitCurve2();
      cTime2=0;
      SH2=false;
      if (EM) stopped=true;
    }
  }
  if (SH1 || Math.random()<0.01) {
    if (!SH1) SH1=true;
    if (!cTime1) { cTime1=ts; 
//console.log("C1 "+curve1[curveSet1b].type+" "+curve2[curveSet1].type);
}
    let progress1=ts-cTime1;
    if (progress1<duration) {
      cFrac1=progress1/duration;
    } else {
      transitCurve1();
      cTime1=0;
      SH1=false;
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
    else if (cFrac1>0) cTime1=performance.now()-cFrac1*duration;
    else if (cFrac2>0) cTime2=performance.now()-cFrac2*duration;
    requestAnimationFrame(animate);
  } else {
    frame=!frame;
    stopped=true;
  }
}
body.addEventListener("click", start, false);

onresize();
transitCurve1();
//curve1[0].type=4;
//curve1[1].type=4;
transitCurve2();
setPoints();
//draw();
start();
