"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/bPozZQ
const EM=location.href.endsWith("em");
const CSIZE=400;

const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
body.style.margin="20";

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=4;
ctx.fillStyle="hsla(0,0%,0%,0.05)";

onresize=function() { 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

function powerRandom(p) {
  function rec(p,r) {
    --p;
    if (p<=0) {
      return r;
    } else {
      r*=Math.random();
      return rec(p,r);
    }
  }
  p=Math.round(p);
  return rec(p,Math.random());
}

function getRandomInt(min, max, low) {
  var p=low?low:1;
  min=Math.ceil(min);
  max=Math.floor(max);
  return Math.floor(powerRandom(p)*(max-min))+min;
}

var primes=[2,3,5,7,11,13,17,19];

/*
var cycsets={
  2:[2,4,6,8,10,12,14,16,18],
  3:[3,6,9,12,15,18],
  5:[5,10,15],
  7:[7,14],
  11:[11],
  13:[13],
  17:[17],
  19:[19]
};
*/

var cycsets2={
  2:[2,4,8,16],
  3:[3,9],
  5:[5],
  7:[7],
  11:[11],
  13:[13],
  17:[17],
  19:[19]
};

function getFactors(n) {
  let a=[];
  for (let p of primes) {
    if (n%p==0) {
      a.push(p);
    }
  }
  return a;
}

function getCycleArray(n) {
  let a=new Set();
  for (let p of primes) {
    if (n%p==0) {
      for (let f of cycsets2[p]) {
        a.add(f);
      }
    }
  }
  return Array.from(a);
}

var Roulette=function(ro) {
  if (ro instanceof Roulette) {
    Object.assign(this, ro);
  } else {
    this.dz=-1;
    this.type1=-1;
    this.type2=-1;
    this.type3=-1;
    this.type4=-1;
    this.c0=1;
    this.c1=8;
    this.c2=16;
    this.c3=4;
    this.c4=4;
    this.cycleSet=8;
/*
this.radii=[100,80,40,40,40];
    this.r1=this.radii[0];
    this.r2=this.radii[1];
    this.r3=this.radii[2];
    this.r4=this.radii[3];
    this.r5=this.radii[4];
*/
    this.r1=100;
    this.r2=80;
    this.r3=40;
    this.r4=40;
    this.r5=40;
    this.radiiCount=2;
  }
  let rself=this;
  this.getMetrics=function(rotFrac,n) {
    let t=rself.dz*(rotFrac+n/(ribbons.rCount))*rself.c0*2*Math.PI;
    let f1=1+(rself.type1*rself.c1)/rself.c0;
    var x,y;
    if (rself.radiiCount==2) {
      x=rself.r1*Math.cos(t)+rself.r2*Math.cos(f1*t);
      y=rself.r1*Math.sin(t)+rself.r2*Math.sin(f1*t);
    } else if (rself.radiiCount==3) {
      let f2=1+(rself.type1*rself.c1+rself.type2*rself.c2)/rself.c0;
      x=rself.r1*Math.cos(t)+rself.r2*Math.cos(f1*t)+rself.r3*Math.cos(f2*t);
      y=rself.r1*Math.sin(t)+rself.r2*Math.sin(f1*t)+rself.r3*Math.sin(f2*t);
    } else if (rself.radiiCount==4) {
      let f2=1+(rself.type1*rself.c1+rself.type2*rself.c2)/rself.c0;
      let f3=1+(rself.type1*rself.c1+rself.type2*rself.c2+rself.type3*rself.c3)/rself.c0;
      x=rself.r1*Math.cos(t)+rself.r2*Math.cos(f1*t)+rself.r3*Math.cos(f2*t)+rself.r4*Math.cos(f3*t);
      y=rself.r1*Math.sin(t)+rself.r2*Math.sin(f1*t)+rself.r3*Math.sin(f2*t)+rself.r4*Math.sin(f3*t);
    } else if (rself.radiiCount==5) {
      let f2=1+(rself.type1*rself.c1+rself.type2*rself.c2)/rself.c0;
      let f3=1+(rself.type1*rself.c1+rself.type2*rself.c2+rself.type3*rself.c3)/rself.c0;
      let f4=1+(rself.type1*rself.c1+rself.type2*rself.c2+rself.type3*rself.c3+rself.type4*rself.c4)/rself.c0;
      x=rself.r1*Math.cos(t)+rself.r2*Math.cos(f1*t)+rself.r3*Math.cos(f2*t)+rself.r4*Math.cos(f3*t)+rself.r5*Math.cos(f4*t);
      y=rself.r1*Math.sin(t)+rself.r2*Math.sin(f1*t)+rself.r3*Math.sin(f2*t)+rself.r4*Math.sin(f3*t)+rself.r5*Math.sin(f4*t);
    } else {
    }
    return {x:x,y:y};
  }
  this.softCycle=function() {
    rself.c1=rself.setCycles();
    rself.c2=rself.setCycles();
    rself.c3=rself.setCycles();
    rself.c4=rself.setCycles();
  }
  this.setCycle0Match=function() {
    rself.c0=getRandomInt(1,19,4);
  }
  this.getCycle0Match=function() {
    return getRandomInt(1,19,4);
  }

  this.setCycles=function() {
    //if (Math.random()<0.3) {  // put symmetry control here
      //let ca=getFactors(this.cycleSet);
      let ca=getCycleArray(this.cycleSet);
      if (ca.length==0) {
	return this.cycleSet;
      }
      return ca[getRandomInt(0,ca.length)];
/*
    } else if (Math.random()<0.3) {  // put symmetry control here
      let ca=getFactors(ribbons.rCount);
      if (ca.length==0) {
	return this.cycleSet;
      }
      return ca[getRandomInt(0,ca.length)];
    } else {
      let ca=getCycleArray(ribbons.rCount);
      if (ca.length==0) {
	return this.cycleSet;
      }
      return ca[getRandomInt(0,ca.length)];
    }
*/
  }
  this.randomizeRadiiCount=()=>{ this.radiiCount=getRandomInt(2,6); }
  this.randomizeRadii=function() {
    let rx=(()=>{
      let rxa=[];
      for (let i=0; i<rself.radiiCount; i++) {
        rxa.push(30-60*Math.random());
      }
      rxa.push(0);
      return rxa;
    })();
    let CX=CSIZE/rself.radiiCount-20;
    rself.r1=CX+rx[0];
    if (rself.radiiCount==5) {
      rself.r2=CX+rx[1]-rx[0];
      rself.r3=CX+rx[2]-rx[1];
      rself.r4=CX+rx[3]-rx[2];
      rself.r5=CX-rx[3];
    } else if (rself.radiiCount==4) {
      rself.r2=CX+rx[1]-rx[0];
      rself.r3=CX+rx[2]-rx[1];
      rself.r4=CX-rx[2];
      rself.r5=0;
    } else if (rself.radiiCount==3) {
      rself.r2=CX+rx[1]-rx[0];
      rself.r3=CX-rx[1];
      rself.r4=0;
      rself.r5=0;
    } else if (rself.radiiCount==2) {
      rself.r2=CX-rx[0];
      rself.r3=0;
      rself.r4=0;
      rself.r5=0;
    }
  }

/*
  this.randomizeRadiiO=function() {
    if (rself.radiiCount==5) {
      rself.r1=70-20*Math.random();
      rself.r2=20+(160-rself.r1)*Math.random();
      rself.r3=20+(200-rself.r1-rself.r2)*Math.random();
      rself.r4=20+(240-rself.r1-rself.r2-rself.r3)*Math.random();
      rself.r5=280-rself.r1-rself.r2-rself.r3-rself.r4;
    } else if (rself.radiiCount==4) {
      rself.r1=70-20*Math.random();
      rself.r2=20+(200-rself.r1)*Math.random();
      rself.r3=20+(240-rself.r1-rself.r2)*Math.random();
      rself.r4=280-rself.r1-rself.r2-rself.r3;
      rself.r5=0;
    } else if (rself.radiiCount==3) {
      rself.r1=90-30*Math.random();
      rself.r2=20+(240-rself.r1)*Math.random();
      rself.r3=(280-rself.r1-rself.r2);
      rself.r4=0;
      rself.r5=0;
    } else if (rself.radiiCount==2) {
      let rr=210+70*Math.random();  // sum of radii from 210-280
      let rd=30-60*Math.random();
      rself.r1=(rd+rr)/2;
      rself.r2=(rr-rd)/2;
      rself.r3=0;
      rself.r4=0;
      rself.r5=0;
    }
  }
*/

  this.randomizeCycles=function() {
    rself.cycleSet=ribbons.goodCycleSet();
    rself.c1=rself.setCycles();
    rself.c2=rself.setCycles();
    rself.c3=rself.setCycles();
    rself.c4=rself.setCycles();
    rself.c0=getRandomInt(1,19,4);
  }
  this.randomizeTypes=function() {
    rself.type1=[-1,1][getRandomInt(0,2)];
    rself.type2=[-1,1][getRandomInt(0,2)];
    rself.type3=[-1,1][getRandomInt(0,2)];
    rself.type4=[-1,1][getRandomInt(0,2)];
  }
  this.getSP=function() {
    let sp=this.c0+this.c1;
    switch(this.radiiCount) {
      case 2:
	return sp;
      case 3:
	return sp+=this.c2;
      case 4:
	return sp+=(this.c2+this.c3);
      case 5:
	return sp+=(this.c2+this.c3+this.c4);
      default:
	return 0;
    }
  }
  this.controlledCycleChange=function(mod) {
    let count=0;
/*
    let sMax=24;
    let sMin=15;
*/
    let sMax=20;
    let sMin=12;
    do {
      mod();
      var sp=rself.getSP();
      if (count++>10) {
        return;
      }
    //} while (sp<rself.spMin || sp>rself.spMax);
    } while (sp>sMax++ || sp<sMin--);
  }
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

function cFrac(frac) {
  let f1=.2;
  let f2=.8;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var path={
  fromRo:new Roulette(),
  toRo:new Roulette(),
  fromRoX:new Roulette(),
  toRoX:new Roulette(),
  time:0,
//  frac:0,
  cFrac:0,
  duration:5000,
  getMetrics:function(rotFrac,n) {
    let fromMet=this.fromRo.getMetrics(rotFrac,n);
    let toMet=this.toRo.getMetrics(rotFrac,n);
    let fromMetX=this.fromRoX.getMetrics(rotFrac,n);
    let toMetX=this.toRoX.getMetrics(rotFrac,n);
    return {
      x:this.cFrac*toMet.x+(1-this.cFrac)*fromMet.x,
      y:this.cFrac*toMet.y+(1-this.cFrac)*fromMet.y,
      xX:this.cFrac*toMetX.x+(1-this.cFrac)*fromMetX.x,
      yX:this.cFrac*toMetX.y+(1-this.cFrac)*fromMetX.y,
      //x:cbLoc(fromMet.x,toMet.x,this.frac),
      //y:cbLoc(fromMet.y,toMet.y,this.frac),
      //xX:cbLoc(fromMetX.x,toMetX.x,this.frac),
      //yX:cbLoc(fromMetX.y,toMetX.y,this.frac)
    }
  },
  mf:0.3,
  transit:function() {
    Object.assign(this.fromRo, this.toRo);
    Object.assign(this.fromRoX, this.toRoX);
    this.toRo=new Roulette(this.fromRo);
    this.toRoX=new Roulette(this.fromRoX);
    if (Math.random()<this.mf) {
      //this.toRo.randomizeCycles();
    } else { 
      if (Math.random()<this.mf) {
        this.toRo.controlledCycleChange(this.toRo.setCycle0Match);
        //this.toRo.c0=this.toRo.getCycle0Match();
        //this.toRoX.c0=this.toRoX.getCycle0Match();
        this.toRoX.c0=this.toRo.c0;
      }
      if (Math.random()<this.mf) {
        this.toRo.controlledCycleChange(this.toRo.softCycle);
	//this.toRo.softCycle();
        this.toRoX.c1=this.toRo.c1;
        this.toRoX.c2=this.toRo.c2;
        this.toRoX.c3=this.toRo.c3;
        this.toRoX.c4=this.toRo.c4;
      }
    }
    if (Math.random()<this.mf) {
      this.toRo.controlledCycleChange(this.toRo.randomizeRadiiCount);
      this.toRoX.radiiCount=this.toRo.radiiCount;
    }
    if (Math.random()<this.mf) {
      this.toRo.randomizeTypes();
      this.toRoX.type1=this.toRo.type1;
      this.toRoX.type2=this.toRo.type2;
      this.toRoX.type3=this.toRo.type3;
      this.toRoX.type4=this.toRo.type4;
    }
    if (Math.random()<this.mf/4) {
      this.toRo.dz=[-1,1][getRandomInt(0,2)];
      this.toRoX.dz=this.toRo.dz;
    }
//    if (this.mf>0) {
      this.toRo.randomizeRadii();
      this.toRoX.randomizeRadii();
//    }
  }
}

var ribbons={
  rCount:4+Math.round(40*Math.pow(Math.random(),1.6)),
  DS:0, // rotational increment to next line
  //DSinc:0.00015,
  DSinc:0.0002,
  rcTrans:'N',   // N,D,H
  colorCount:2,
  hTime:0,
  hDuration:24000,
  hFrac:0,
  XT1:120*(1-2*Math.random()),
  YT1:120*(1-2*Math.random()),
  tTime:0,
  tDuration:8000,
  tFrac:0,
  fromHues:[getRandomInt(0,360)],
  toHues:[getRandomInt(0,360)],
  revY:false,
  goodCycleSet:function() {
    let ca=getCycleArray(ribbons.rCount);
    //let ca=getFactors(ribbons.rCount);
    if (ca.length==0) {
      if (ribbons.rCount<20) {
        return ribbons.rCount;
      } else {
        return getRandomInt(4,20,2);
      }
    }
    return ca[getRandomInt(0,ca.length)];
  },
  goodColorCount:function() {
    let a=[];
    for (let i=2; i<10; i++) {
      if (ribbons.rCount%i==0) {
	a.push(i);
      }
    }
    if (a.length==0) {
      return 2;
    }
    return a[getRandomInt(0,a.length)];
  },
  randomizeHues:function() {
//    ribbons.fromHues[0]=Math.round(Math.random()*360);
    //ribbons.fromHues[0]=getRandomInt(0,360);
    ribbons.fromHues[0]=0;
    if (ribbons.colorCount==2) {
      ribbons.toHues[0]=(ribbons.fromHues[0]+Math.random()*120)%360;
    } else {
      ribbons.toHues[0]=(ribbons.fromHues[0]+Math.random()*360/ribbons.colorCount)%360;
    }
    for (let i=1; i<ribbons.colorCount; i++) {
      ribbons.fromHues.push((ribbons.fromHues[i-1]+360/ribbons.colorCount)%360);
      ribbons.toHues.push((ribbons.toHues[i-1]+360/ribbons.colorCount)%360);
    }
  },
  getHue:function(n) {
    //return ribbons.toHues[n%ribbons.colorCount];
    return (ribbons.hFrac*ribbons.toHues[n%ribbons.colorCount]+(1-ribbons.hFrac)*ribbons.fromHues[n%ribbons.colorCount])/2%360;
  },
  transitColor:function() {
    ribbons.fromHues=ribbons.toHues.slice();
    ribbons.toHues=[];
    if (ribbons.colorCount==2) {
      ribbons.toHues[0]=(ribbons.fromHues[0]+Math.random()*120)%360;
    } else {
      ribbons.toHues[0]=(ribbons.fromHues[0]+Math.random()*360/ribbons.colorCount)%360;
    }
    for (let i=1; i<ribbons.colorCount; i++) {
      ribbons.toHues.push((ribbons.toHues[i-1]+360/ribbons.colorCount)%360);
    }
  },
  randomizeCount:function() {
    do {
      let dct=1-Math.pow(2*Math.random(),0.3);    
      if (dct<0) {
	ribbons.rCount=Math.round(4+16*(1+dct));
      } else {
	ribbons.rCount=Math.round(20+40*dct);
      }
    } while ([11,13,17,19,23,29].includes(ribbons.rCount));
      //ribbons.rCount=4+Math.round(55*Math.pow(Math.random(),1.6));
  },
  randomize:function() {
    ribbons.randomizeCount();
    ribbons.colorCount=ribbons.goodColorCount();
    ribbons.randomizeHues();
    ribbons.revY=Math.random()<0.2;
  },
  transitCount:function() {
    if (ribbons.rcTrans=='N') {
      //if (Math.random()<path.mf) {
if (Math.random()<0.2) {
        ribbons.XT1=120*(1-2*Math.random());
        ribbons.YT1=120*(1-2*Math.random());
        ribbons.rcTrans='T';
      }
    } else if (ribbons.rcTrans=='T') {
      ribbons.randomize();
      path.fromRo.randomizeCycles();
      path.toRo.randomizeCycles();
      path.fromRoX=new Roulette(path.fromRo);
      path.toRoX=new Roulette(path.toRo);
      ribbons.rcTrans='R';
    } else if (ribbons.rcTrans=='R') {
      ribbons.rcTrans='N';
    }
  },
  draw:function(ts) {
    for (let i=0; i<ribbons.rCount; i++) {
      let xy1=path.getMetrics(ribbons.DS,i);
      //let xy2=path.getMetrics(ribbons.DS,i+1);
      //let xy2=path.getMetrics(ribbons.DS,i+1);
      let xx1=xy1.x;
      let xx2=xy1.xX;
      let yy1=(ribbons.revY)?xy1.yX:xy1.y;
      let yy2=(ribbons.revY)?xy1.y:xy1.yX;
/*
      if (ribbons.revY) {
        yy1=xy1.yX;
        yy2=xy1.y;
      } else {
        yy1=xy1.y;
        yy2=xy1.yX;
      }
*/
      ctx.beginPath();
      if (ribbons.rcTrans=='T') {
        let tz=Math.pow(ribbons.tFrac,5);
	let x1=(xx1)*(1-tz)+tz*ribbons.XT1;
	let y1=(yy1)*(1-tz)+tz*ribbons.YT1;
	let x2=(xx2)*(1-tz)+tz*(-ribbons.XT1);
	let y2=(yy2)*(1-tz)+tz*(-ribbons.YT1);
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
      } else if (ribbons.rcTrans=='R') {
        let tz=Math.pow(1-ribbons.tFrac,5);
	let x1=(xx1)*(1-tz)+(tz)*ribbons.XT1;
	let y1=(yy1)*(1-tz)+(tz)*ribbons.YT1;
	let x2=(xx2)*(1-tz)+(tz)*(-ribbons.XT1);
	let y2=(yy2)*(1-tz)+(tz)*(-ribbons.YT1);
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
      } else {
	ctx.moveTo(xx1,yy1);
	ctx.lineTo(xx2,yy2);
      }
      let hue=ribbons.getHue(i);
      ctx.strokeStyle='hsl('+hue+',100%,60%)';
      ctx.stroke();
      ctx.closePath();
    }
  },
}

var fTime=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!path.time) path.time=ts;
  let pProg=ts-path.time;
  if (pProg<path.duration) {
    //path.frac=pProg/path.duration;
    //path.cFrac=cFrac(path.frac);
    path.cFrac=cFrac(pProg/path.duration);
  } else {
    path.transit();
    path.time=0;
    //path.frac=0;
    path.cFrac=0;
//if (EM && !MO) stopped=true;
if (EM) {
  stopped=true;
}
  }
  ribbons.DS+=ribbons.DSinc;
  if (!ribbons.hTime) {
    ribbons.hTime=ts;
  }
  let hProg=ts-ribbons.hTime;
  if (hProg<ribbons.hDuration) {
    ribbons.hFrac=hProg/ribbons.hDuration;
  } else {
    ribbons.transitColor();
    ribbons.hTime=0;
    ribbons.hFrac=0;
  }
  if (!ribbons.tTime) ribbons.tTime=ts;
  let tProg=ts-ribbons.tTime;
  if (tProg<ribbons.tDuration) {
    ribbons.tFrac=tProg/ribbons.tDuration;
  } else {
    ribbons.transitCount();
    ribbons.tTime=0;
    ribbons.tFrac=0;
  }
  if (!fTime) fTime=ts;
  let fProg=ts-fTime;
  if (fProg>40) {
    ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    fTime=0;
  }
  ribbons.draw();
  requestAnimationFrame(animate);
}

var stopped=true;
function start() {
  if (stopped) {
    stopped=false;
    if (path.cFrac>0) {
      path.time=performance.now()-path.cFrac*path.duration;
    } else {
      path.time=0;
    }
    if (ribbons.hFrac>0) {
      ribbons.hTime=performance.now()-ribbons.hFrac*ribbons.hDuration;
    } else {
      ribbons.hTime=0;
    }
    if (ribbons.tFrac>0) {
      ribbons.tTime=performance.now()-ribbons.tFrac*ribbons.tDuration;
    } else {
      ribbons.tTime=0;
    }
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

onresize();
path.transit();
ribbons.randomize();
ribbons.randomizeHues();
if (EM) path.transit();
start();
