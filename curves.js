"use strict"; // Paul Slaymaker, paul25882@gmail.com
const EM=location.href.endsWith("em");
const CSIZE=400;

var canvas=document.querySelector('#cta');
onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

var ctx=canvas.getContext('2d');
ctx.translate(CSIZE,CSIZE);
ctx.rotate(-Math.PI/2);
ctx.lineWidth=3;

ctx.fillStyle='hsla(0,0%,0%,.01)';

const animateDuration=16000;
var cycleSet=7;
var complexDamper=4;
var complexDamperCurveFactor=1.4;
var curveCount=2;

function getRandomArrayValue(ar, skew) {
  if (skew==undefined) {
    skew=1;
  }
  return ar[Math.floor(ar.length*Math.pow(Math.random(),skew))];
}

var primes=[2,3,5,7,11,13,17,19];

function getCycleArray(n) {
  let a=new Set();
  for (let p of primes) {
    if (n%p==0) {
      let cycsets2={
	2:[8,16],
	3:[9],
	5:[5],
	7:[7],
	11:[11],
	13:[13],
	17:[17],
	19:[19]
      };
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
    this.radiiCount=1;
    this.type1=-1;
    this.type2=-1;
    this.type3=-1;
    this.c0=getCycle0Match(complexDamper);
    this.c1=7;
    this.c2=7;
    this.c3=7;
    this.r1=0;
    this.r2=0;
    this.r3=0;
    this.r4=0;
  }
  this.pts=this.zeroData();
}

Roulette.prototype.zeroData=function() {
  let zd=[[0,0]];
  for (var z=.01, counter=1; z<2*Math.PI; z+=.01) {
    zd[counter++]=[0,0];
  }
  return zd;
}

Roulette.prototype.softCycle=function(sk) {
  let ic=[this.c1,this.c2,this.c3];
  this.c1=this.setMatchingCycles(sk);
  this.c2=this.setMatchingCycles(sk);
  this.c3=this.setMatchingCycles(sk);
  let pc=[this.c1,this.c2,this.c3];
  let sc=0;
  for (let i=0; i<this.radiiCount; i++) {
    if (ic[i]!=pc[i]) {
      sc++;
      break;
    }
  }
  return sc;
}
 
Roulette.prototype.setMatchingCycles=function(sk) {
  switch (cycleSet) {
    case 6: 
    case 12: 
    case 18: 
      return [6,12,18][Math.floor(3*Math.pow(Math.random(),sk))];
    case 7: 
    case 14: 
      return [7,14][Math.floor(2*Math.pow(Math.random(),sk))];
    case 8: 
    case 16: 
      return [8,16][Math.floor(2*Math.pow(Math.random(),sk))];
    case 9: 
      return [9,18][Math.floor(2*Math.pow(Math.random(),sk))];
  }
  return cycleSet;
}

Roulette.prototype.randomizeCycles=function() {  // rename this
  this.c1=this.setMatchingCycles(complexDamper);
  this.c2=this.setMatchingCycles(complexDamper);
  this.c3=this.setMatchingCycles(complexDamper);
  //this.c0=getCycle0Match();
}

Roulette.prototype.randomizeRadii=function() {
  let cDev=16;
  if (this.radiiCount==1) {
    this.r1=CSIZE/2+cDev*(1-2*Math.random());
    this.r2=(CSIZE-this.r1);
    this.r3=0;
    this.r4=0;
  } else if (this.radiiCount==2) {
    if (this.c1==this.c2) {
      this.r1=CSIZE/4+cDev*(1-2*Math.random());
      this.r2=CSIZE/2+cDev*(1-2*Math.random());
      this.r3=this.r2-this.r1+cDev*(1-2*Math.random());
    } else {
      if (Math.random()<0.5) {
        this.r1=CSIZE/2+cDev*(1-2*Math.random());
        this.r2=CSIZE/4+cDev*(1-2*Math.random());
        this.r3=this.r1-this.r2+cDev*(1-2*Math.random());
      } else {
        this.r1=CSIZE/4+cDev*(1-2*Math.random());
        this.r2=CSIZE/4+cDev*(1-2*Math.random());
        this.r3=this.r1+this.r2+cDev*(1-2*Math.random());
      }
    }
    this.r4=0;
//if (this.r3<0) { debugger; }
  } else if (this.radiiCount==3) {
    if (this.c1==this.c2 && this.c1==this.c3) {
      this.r1=CSIZE/4+cDev*(1-2*Math.random());
      this.r2=CSIZE/4+cDev*(1-2*Math.random());
      this.r3=CSIZE/4+cDev*(1-2*Math.random());
      this.r4=this.r1+this.r2-this.r3+cDev*(1-2*Math.random());
    } else if (this.c1==this.c2) {
      this.r1=CSIZE/6+cDev*(1-2*Math.random());
      this.r2=CSIZE/6+cDev*(1-2*Math.random());
      this.r3=CSIZE/6+cDev*(1-2*Math.random());
      this.r4=this.r1+this.r2-this.r3+cDev*(1-2*Math.random());
    } else if (this.c2==this.c3) {
      this.r1=CSIZE/2+cDev*(1-2*Math.random());
      this.r2=CSIZE/6+cDev*(1-2*Math.random());
      this.r3=60+cDev*(1-2*Math.random());
      this.r4=this.r1-this.r2-this.r3+cDev*(1-2*Math.random());
    } else {
      this.r1=100+cDev*(1-2*Math.random());
      this.r2=100+cDev*(1-2*Math.random());
      this.r3=100+cDev*(1-2*Math.random());
      this.r4=this.r1+this.r2-this.r3+cDev*(1-2*Math.random());
    }
//if (this.r4<0) { debugger; }
  } 
}

Roulette.prototype.randomizeRadiiCount=function(sk) {
  let rc=[1,2,3][Math.floor(3*Math.pow(Math.random(),sk))];
  let rt=this.radiiCount!=rc?1:0;
  //this.radiiCount=[1,2,3][Math.floor(3*Math.pow(Math.random(),1.2))];
  this.radiiCount=rc;
  return rt;
}

Roulette.prototype.randomizeTypes=function() {
  let rt=0;
  switch (this.radiiCount) {
    case 3:
      if (this.type3==-1) {
        if (Math.random()<0.3) { this.type3=1; rt++; }
      } else {
        this.type3=-1; rt++;
      }
    case 2:
      if (this.type2==-1) {
        if (Math.random()<0.3) { this.type2=1; rt++; }
      } else {
        this.type2=-1; rt++;
      }
    case 1:
      if (this.type1==-1) {
        if (Math.random()<0.3) { this.type1=1; rt++; }
      } else {
        //if (Math.random()<0.7) { this.type1=-1; rt++; }
        this.type1=-1; rt++;
      }
  }
  return rt;
}

Roulette.prototype.simpleRandomizeCurve=function() {
  this.randomizeRadiiCount(complexDamper);
  this.softCycle(complexDamper);
  this.randomizeTypes();
  this.randomizeRadii();
  this.setCurve();
//setTable();
}

Roulette.prototype.randomizeCurve=function(assureSweep) {
  let counter=0;
  let sweep=0;
  do {
    sweep=this.randomizeRadiiCount(Math.max(1,complexDamper-counter));
    if (!sweep) {
      sweep+=this.softCycle(Math.max(1,complexDamper-counter));
    }
    if (!sweep) {
       sweep+=this.randomizeTypes();
    }
    counter++
    // assurance only for transiting Roulettes?
  } while (sweep==0 && assureSweep);  
  this.randomizeRadii();
  this.setCurve();
//setTable();
  return this;
}

Roulette.prototype.setCurve=function() {
  let offset=0;
  let x,y;
  //let R=CSIZE;
  switch (this.radiiCount) {
    case 1:
      var f1=1+(this.type1*this.c1)/this.c0;
      x=this.r1*Math.cos(offset)+this.r2*Math.cos(f1*offset);
      y=this.r1*Math.sin(offset)+this.r2*Math.sin(f1*offset);
      this.pts[0]=[x,y];
      var counter=1;
      for (let z=.01*this.c0+offset; z<2*Math.PI*this.c0+offset; z+=.01*this.c0) {
	x=this.r1*Math.cos(z)+this.r2*Math.cos(f1*z);
	y=this.r1*Math.sin(z)+this.r2*Math.sin(f1*z);
	this.pts[counter++]=[x,y];
//R=Math.min(R, Math.pow(x*x+y*y,0.5));
      }
      break;
    case 2:
      var f1=1+(this.type1*this.c1)/this.c0;
      var f2=1+(this.type1*this.c1+this.type2*this.c2)/this.c0;
      x=this.r1*Math.cos(offset)+this.r2*Math.cos(f1*offset)+this.r3*Math.cos(f2*offset);
      y=this.r1*Math.sin(offset)+this.r2*Math.sin(f1*offset)+this.r3*Math.sin(f2*offset)
      this.pts[0]=[x,y];
      var counter=1;
      for (let z=.01*this.c0+offset; z<2*Math.PI*this.c0+offset; z+=.01*this.c0) {
	x=this.r1*Math.cos(z)+this.r2*Math.cos(f1*z)+this.r3*Math.cos(f2*z);
	y=this.r1*Math.sin(z)+this.r2*Math.sin(f1*z)+this.r3*Math.sin(f2*z);
	this.pts[counter++]=[x,y];
//R=Math.min(R, Math.pow(x*x+y*y,0.5));
      }
      break;
   case 3:
      var f1=1+(this.type1*this.c1)/this.c0;
      var f2=1+(this.type1*this.c1+this.type2*this.c2)/this.c0;
      var f3=1+(this.type1*this.c1+this.type2*this.c2+this.type3*this.c3)/this.c0;
      x=this.r1*Math.cos(0)+this.r2*Math.cos(0)+this.r3*Math.cos(0)+this.r4*Math.cos(0);
      y=this.r1*Math.sin(0)+this.r2*Math.sin(0)+this.r3*Math.sin(0)+this.r4*Math.sin(0)
      this.pts[0]=[x,y];
      var counter=1;
      for (let z=.01*this.c0; z<2*Math.PI*this.c0; z+=.01*this.c0) {
	x=this.r1*Math.cos(z)+this.r2*Math.cos(f1*z)+this.r3*Math.cos(f2*z)+this.r4*Math.cos(f3*z);
	y=this.r1*Math.sin(z)+this.r2*Math.sin(f1*z)+this.r3*Math.sin(f2*z)+this.r4*Math.sin(f3*z)
	this.pts[counter++]=[x,y];
//R=Math.min(R, Math.pow(x*x+y*y,0.5));
      }
      break;
  }
}

var Curve=function() {
  this.active=false;
  this.fromRo=new Roulette();
  this.toRo=new Roulette();
  this.fromHue=0;
  this.toHue=0;
  this.dStart=0;
  this.dDuration=animateDuration*(0.7+0.3*Math.random());
  this.dFrac=1;
  this.getHue=function() {
    //let midHue=C2.hFrac*(this.toHue-this.fromHue)+this.fromHue;
    let midHue=hueFrac*(this.toHue-this.fromHue)+this.fromHue;
    return Math.round(midHue%360);
  }
  this.transit=function() {
    Object.assign(this.fromRo, this.toRo);
    this.toRo=new Roulette(this.fromRo);
    //this.toRo.transitRandomizeCurve();
    this.sweepRandomize();
    this.dDuration=animateDuration*(0.7+0.3*Math.random());
  }
}

Curve.prototype.sweepFactor=function() {
  let sf=0;
  if (this.fromRo.radiiCount!=this.toRo.radiiCount) {
    sf++;
  }
  let ic=[this.fromRo.c1,this.fromRo.c2,this.fromRo.c3];
  let pc=[this.toRo.c1,this.toRo.c2,this.toRo.c3];
  let it=[this.fromRo.type1,this.fromRo.type2,this.fromRo.type3];
  let pt=[this.toRo.type1,this.toRo.type2,this.toRo.type3];
  // not reliable
  for (let i=0; i<this.toRo.radiiCount; i++) {
    if (ic[i]!=pc[i]) {
      sf++;
    }
    if (it[i]!=pt[i]) {
      sf++;
    }
  }
  return sf;
}

Curve.prototype.sweepRandomize=function() {
  this.toRo.simpleRandomizeCurve();
  let counter=0;
  do {
    counter++
    this.toRo.randomizeRadiiCount(Math.max(1,complexDamper/counter));
    this.toRo.softCycle(Math.max(1,complexDamper/counter));
    this.toRo.randomizeTypes();
  } while (this.sweepFactor()<1 && counter<10);
  this.toRo.randomizeRadii();
  this.toRo.setCurve();
}

const C2={
  fromHue:0,
  toHue:Math.round(Math.random()*360),
  cStart:0,
  cycleDurationFactor:0.625,
  //cDuration:0.625*animateDuration,
  cFrac:1,
  cTrans:'N',
  RX:120,
  hStart:0,
  //hDuration:3.5*animateDuration,
  //hueDurationFactor:3.5,
  hFrac:1,
  getHue:function() {
    //return C2.hFrac*(this.toHue-this.fromHue)+this.fromHue;
    return hueFrac*(this.toHue-this.fromHue)+this.fromHue;
  },
  getCurveHue:function(n) {
    curves[n].getHue();
  },
  transitCycle:function() {
    if (C2.cTrans=='N') {
	// TODO, increase with C0 mean or sum
      if (Math.random()<0.2) {	// publish @ 0.1
        C2.cTrans='T';
        C2.RX=180+100*(1-2*Math.random());
      }
    } else if (C2.cTrans=='T') {
      C2.cTrans='R';
      cycleSet=6+Math.floor(14*Math.pow(Math.random(),complexDamper));
      for (let i=0; i<curveCount; i++) {
        let c=curves[i];
        c.toRo.randomizeCycles();
        c.toRo.c0=getCycle0Match(complexDamper);
        c.toRo.simpleRandomizeCurve();
        Object.assign(c.fromRo, c.toRo);
        c.toRo.randomizeCycles();
        c.toRo.c0=getCycle0Match(complexDamper);
        c.sweepRandomize();
      }
    } else if (C2.cTrans=='R') {
      C2.cTrans='N';
    }
  },
  transitHue:function() {
    C2.fromHue=C2.toHue;
    C2.toHue=Math.round(Math.random()*360);
    for (let i=0; i<curveCount; i++) {
      curves[i].fromHue=curves[i].toHue;
      let hueDiff=360/(curveCount+1)*(1+i%curveCount);
      curves[i].toHue=Math.round((C2.toHue+hueDiff+60/(curveCount+1)*(1-2*Math.random()))%360);
    }
  },
  draw:function(curve) {
    ctx.beginPath();
    let x=cbLoc(curve.fromRo.pts[0][0],curve.toRo.pts[0][0],curve.dFrac);
    let y=cbLoc(curve.fromRo.pts[0][1],curve.toRo.pts[0][1],curve.dFrac);
    if (C2.cTrans=='T') {
//let o=0.01*(1-C2.cFrac)+0.05*C2.cFrac;
//ctx.fillStyle='hsla(0,0%,0%,'+o+')';
      let z=0;
      let fae=Math.pow(cyFrac,3);
      //ctx.moveTo(x*(1-C2.cFrac)+C2.RX*Math.cos(z)*C2.cFrac,y*(1-C2.cFrac));
      ctx.moveTo(x*(1-fae)+C2.RX*Math.cos(z)*fae,y*(1-fae));
      for (var i=1; i<629; i++) {
        z=i*Math.PI*2/629*curve.toRo.c0;
	x=cbLoc(curve.fromRo.pts[i][0],curve.toRo.pts[i][0],curve.dFrac);
	y=cbLoc(curve.fromRo.pts[i][1],curve.toRo.pts[i][1],curve.dFrac);
        //ctx.lineTo(x*(1-C2.cFrac)+C2.RX*Math.cos(z)*C2.cFrac,y*(1-C2.cFrac)+C2.RX*Math.sin(z)*C2.cFrac);
        ctx.lineTo(x*(1-fae)+C2.RX*Math.cos(z)*fae,y*(1-fae)+C2.RX*Math.sin(z)*fae);
      }
    } else if (C2.cTrans=='R') {
//let o=0.1*(1-C2.cFrac)+0.05*C2.cFrac;
//ctx.fillStyle='hsla(0,0%,0%,'+o+')';
      let z=0;
      let fae=Math.pow(1-cyFrac,3);
      ctx.moveTo(x*(1-fae)+C2.RX*Math.cos(z)*fae,y*(1-fae)+C2.RX*Math.sin(z)*fae);
      for (var i=1; i<629; i++) {
        z=i*Math.PI*2/629*curve.toRo.c0;
	x=cbLoc(curve.fromRo.pts[i][0],curve.toRo.pts[i][0],curve.dFrac);
	y=cbLoc(curve.fromRo.pts[i][1],curve.toRo.pts[i][1],curve.dFrac);
        ctx.lineTo(x*(1-fae)+C2.RX*Math.cos(z)*fae,y*(1-fae)+C2.RX*Math.sin(z)*fae);
      }
    } else { 
      ctx.moveTo(x,y);
      for (var i=1; i<629; i++) {
	x=cbLoc(curve.fromRo.pts[i][0],curve.toRo.pts[i][0],curve.dFrac);
	y=cbLoc(curve.fromRo.pts[i][1],curve.toRo.pts[i][1],curve.dFrac);
	ctx.lineTo(x,y);
      }
    }
    ctx.closePath();
    //ctx.strokeStyle=getGradient(Math.round(curve.getHue(C2.hFrac)));
    ctx.strokeStyle=getGradient(Math.round(curve.getHue()));
    ctx.stroke();
  },
  addCurve:function(idx) {
    //Object.assign(C2.curves[2], C2.curves[1]);
    curves[idx].fromRo=new Roulette(curves[idx-1].fromRo);
    curves[idx].toRo=new Roulette(curves[idx-1].toRo);
    curves[idx].fromRo.setCurve();
    curves[idx].toRo.setCurve();
    curves[idx].fromHue=curves[idx-1].fromHue;
    curves[idx].toHue=Math.round((C2.toHue+90+20*(1-2*Math.random()))%360);
    curves[idx].dStart=curves[idx-1].dStart;
    curves[idx].dDuration=curves[idx-1].dDuration;
    curves[idx].dFrac=curves[idx-1].dFrac;
    curves[idx].active=true;
    curveCount=idx+1;
//setTable();
  },
  removeCurve:function(idx) {
    curves[idx].active=false;
    curveCount=idx;
//setTable();
  },
}

const curves=[new Curve(), new Curve(), new Curve(), new Curve(), new Curve()];

const changeCurveCount=()=>{
  if (curveCount==2) {
    if (Math.random()<0.8) {
      C2.addCurve(2);
      complexDamper*=complexDamperCurveFactor;
    }
  } else if (curveCount==3) {
    if (Math.random()<0.4) {
      C2.addCurve(3);
      complexDamper*=complexDamperCurveFactor;
    } else if (Math.random()<0.2) {
      C2.removeCurve(2);
      complexDamper/=complexDamperCurveFactor;
    }
  } else if (curveCount==4) {
    if (Math.random()<0.3) {
      C2.removeCurve(3);
      complexDamper/=complexDamperCurveFactor;
    } else if (Math.random()<0.3) {
      C2.addCurve(4);
      complexDamper*=complexDamperCurveFactor;
    }
  } else if (curveCount==5) {
    if (Math.random()<0.5) {
      C2.removeCurve(4);
      complexDamper/=complexDamperCurveFactor;
    }
  } else {
    debugger;
  }
}

function getGradient(hue) {
  let grad=ctx.createRadialGradient(0,0,0, 0,0,CSIZE);
  grad.addColorStop(0,  'hsl('+C2.getHue()+',100%,80%)');
  grad.addColorStop(0.3,'hsla('+hue+',90%,70%,0.7)'); 
  grad.addColorStop(0.7,'hsla('+hue+',90%,70%,0.3)'); 
  grad.addColorStop(1,  'hsla(0,0%,0%,0)');
  return grad;
}

function getCycle0Match(damper) {
  let cd=2*damper;
  switch (cycleSet) {
    case 2:
    case 4:
    case 8:
    case 16:
      return getRandomArrayValue([1,3,5,7,9,11],cd);
    case 3:
    case 9:
      return getRandomArrayValue([1,2,4,5,7,8,10,11],cd);
    case 5:
      return getRandomArrayValue([1,2,3,4,6,7,8,9,11,12],cd);
    case 6:
    case 12:
    case 18:
      return getRandomArrayValue([1,5,7,11],cd);
    case 7:
      return getRandomArrayValue([1,2,3,4,5,6,8,9,10,11,12],cd);
    case 10:
      return getRandomArrayValue([1,3,7,9,11],cd);
    case 11:
      return getRandomArrayValue([1,2,3,4,5,6,7,8,9,10,12],cd);
    case 13:
      return getRandomArrayValue([1,2,3,4,5,6,7,8,9,10,11,12],cd);
    case 14: 
      return getRandomArrayValue([1,3,5,9,11],cd);
    case 15: 
      return getRandomArrayValue([1,2,4,7,8,11],cd);
    case 17: 
      return getRandomArrayValue([1,2,3,4,5,6,7,8,9,10,11,12],cd);
    case 19: 
      return getRandomArrayValue([1,2,3,4,5,6,7,8,9,10,12],cd);
  }
  return false;
}

function cbLoc(p1,p2,frac) {
  //return p1*(1-frac)+p2*frac;
  var f1=.2;
  var f2=.8;
  var e1=Math.pow(1-frac,3)*p1;
  var e2=3*frac*Math.pow(1-frac,2)*(p1+(p2-p1)*f1);
  var e3=3*(1-frac)*Math.pow(frac,2)*(p1+(p2-p1)*f2);
  var e4=Math.pow(frac,3)*p2;
  return e1+e2+e3+e4;
}

var stopped=true;
var cyTime=0;
var cyFrac=0;
var hueTime=0;
var hueFrac=0;
var fadeTime=0;
const animate=(ts)=>{ 
  if (stopped) return;
  for (let c of curves) {
    if (c.active) {
      if (!c.dStart) c.dStart=ts;
      let dProg=ts-c.dStart;
      if (dProg<c.dDuration) {
	c.dFrac=dProg/(c.dDuration);
        C2.draw(c);
	//c.draw();
      } else {
	c.dStart=0;
	c.dFrac=0;
	c.transit();
      }
    }
  }
  if (!cyTime) cyTime=ts;
  let cyProg=ts-cyTime;
  if (cyProg<10000) {
    cyFrac=cyProg/10000;
  } else {
    cyTime=0;
    cyFrac=0;
    C2.transitCycle();
    if (EM) stopped=true;
  }
  if (!hueTime) hueTime=ts;
  let hProg=ts-hueTime;
  if (hProg<animateDuration) {
    hueFrac=hProg/animateDuration;
  } else {
    C2.transitHue();
    changeCurveCount();
    hueFrac=0;
    hueTime=0;
  }
  if (!fadeTime) fadeTime=ts;
  if (ts-fadeTime>60) {
    ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    fadeTime=0;
  }
  requestAnimationFrame(animate);
}

const init=()=>{
  ctx.canvas.addEventListener("click", start, false);
  curveCount=3;
  for (let i=0; i<curveCount; i++) {
    let c0=getCycle0Match(complexDamper);
    curves[i].fromRo.c0=c0;
    curves[i].toRo.c0=c0;
    curves[i].fromRo.simpleRandomizeCurve();
    curves[i].sweepRandomize();
    curves[i].fromHue=Math.round((C2.toHue+120+20*(1-2*Math.random()))%360);
    curves[i].toHue=Math.round((C2.toHue+120+20*(1-2*Math.random()))%360);
    curves[i].active=true;
  }
  start();
}

const resetTimes=()=>{
  for (let c of curves) {
    if (c.active) {
      if (c.dFrac>0) {
        c.dStart=performance.now()-c.dFrac*c.dDuration;
      } else {
        c.dStart=0;
      }
    }
  }
  if (cyFrac>0) {
    cyTime=performance.now()-cyFrac*10000;
  } else {
    cyTime=0;
  }
  if (hueFrac>0) {
    hueTime=performance.now()-hueFrac*animateDuration;
  } else {
    hueTime=0;
  }
}

function start() {
  if (stopped) {
    stopped=false;
    resetTimes();
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}

onresize();
init();
