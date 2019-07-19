var CSIZE=400;

var canvas=document.querySelector('#cta');
onresize=function() {
  canvas.style.maxHeight=window.innerHeight-20+'px';
}

var ctx=canvas.getContext('2d');
ctx.translate(CSIZE,CSIZE);
ctx.rotate(-Math.PI/2);
ctx.lineWidth=3;

ctx.fillStyle='hsla(0,0%,0%,.01)';

var animateDuration=16000;
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

Roulette.prototype.randomizeRadiiGeneral=function() {
  let cDev=16;
  // TODO paramterize distances from CSIZE
  if (this.radiiCount==1) {
    this.r1=CSIZE/2+cDev*(1-2*Math.random());
    this.r2=(CSIZE-this.r1);
    this.r3=0;
    this.r4=0;
  } else if (this.radiiCount==2) {
    if (Math.random()<0.5) {
      this.r1=100+cDev*(1-2*Math.random());
      if (Math.random()<0.5) {
        this.r2=190+cDev*(1-2*Math.random());
        this.r3=this.r1-this.r2+cDev*(1-2*Math.random());
      } else {
        this.r2=100+cDev*(1-2*Math.random());
        this.r3=this.r1+this.r2+cDev*(1-2*Math.random());
      }
    } else {
      this.r1=190+cDev*(1-2*Math.random());
      this.r2=100+cDev*(1-2*Math.random());
      this.r3=this.r1-this.r2+cDev*(1-2*Math.random());
    }
    this.r4=0;
//if (this.r3<0) { debugger; }
  } else if (this.radiiCount==3) {
    if (Math.random()<0.5) {
      this.r1=100+cDev*(1-2*Math.random());
      this.r2=100+cDev*(1-2*Math.random());
      this.r3=100+cDev*(1-2*Math.random());
      this.r4=this.r1+this.r2-this.r3+cDev*(1-2*Math.random());
    } else {
      if (Math.random()<0.5) {
        this.r1=60+cDev*(1-2*Math.random());
        this.r2=60+cDev*(1-2*Math.random());
        this.r3=60+cDev*(1-2*Math.random());
        this.r4=this.r1+this.r2+this.r3+cDev*(1-2*Math.random());
      } else {
        this.r1=190+cDev*(1-2*Math.random());
        this.r2=60+cDev*(1-2*Math.random());
        this.r3=60+cDev*(1-2*Math.random());
        this.r4=this.r1-this.r2-this.r3+cDev*(1-2*Math.random());
      }
    }
  }
}

Roulette.prototype.randomizeRadii=function() {
  let cDev=16;
  // TODO paramterize distances from CSIZE
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

/*
Roulette.prototype.transitRandomizeCurve=function() {
  let counter=0;
  let sweep=0;
  do {
    counter++;
    sweep=this.randomizeRadiiCount(Math.max(1,complexDamper/counter));
    if (!sweep) {
      sweep+=this.softCycle(Math.max(1,complexDamper/counter));
    }
    if (!sweep) {
       sweep+=this.randomizeTypes();
    }
  } while (sweep==0);  
if (counter>2) {
log('CCC '+counter);
}
  this.randomizeRadii();
  this.setCurve();
setTable();
  return this;
}
*/

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
/*
if (counter>2) {
log('RRR '+counter);
}
*/
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

/*
if (this.radiiCount==3) {
Rarray.push({
  c0:this.c0,
  c1:this.c1,
  c2:this.c2,
  c3:this.c3,
  rc:this.radiiCount,
  type1:this.type1,
  type2:this.type2,
  type3:this.type3,
  r1:this.r1,
  r2:this.r2,
  r3:this.r3,
  r4:this.r4,
  patternr:''+Math.round(this.r1)+Math.round(this.r2)+Math.round(this.r3)+Math.round(this.r4),
  R:R
});
}
if (Rarray.length>200) stopped=true;
*/

}

var Curve=function(con,name) {
  this.aname=name;
  this.active=false;
  this.fromRo=new Roulette();
  this.toRo=new Roulette();
  this.fromHue=0;
  this.toHue=0;
  this.dStart=0;
  this.dDuration=animateDuration*(0.7+0.3*Math.random());
  this.dFrac=1;
  this.getHue=function(frac) {
    let midHue=con.hFrac*(this.toHue-this.fromHue)+this.fromHue;
    return Math.round(midHue%360);
  }
  this.transit=function() {
    Object.assign(this.fromRo, this.toRo);
    this.toRo=new Roulette(this.fromRo);
    //this.toRo.transitRandomizeCurve();
this.sweepRandomize();
    this.dDuration=animateDuration*(0.7+0.3*Math.random());
  }
  this.draw=function() {
    con.draw(this);
  }
  let cSelf=this;
  this.animate=function(ts) {
    if (stopped) { return; }
    if (cSelf.active) {
      if (!cSelf.dStart) {
	cSelf.dStart=ts;
      }
      var dProg=ts-cSelf.dStart;
      if (dProg<cSelf.dDuration) {
	cSelf.dFrac=dProg/(cSelf.dDuration);
	cSelf.draw();
      } else {
	cSelf.dStart=0;
	cSelf.dFrac=0;
	cSelf.transit();
      }
    }
    requestAnimationFrame(cSelf.animate);
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
/*
if (counter>2) {
log('ZZZ '+counter);
}
*/
  this.toRo.randomizeRadii();
  this.toRo.setCurve();
//setTable();
}

var C2={
  curveCountLock:false,
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
  hueDurationFactor:3.5,
  hFrac:1,
  getHue:function() {
    return C2.hFrac*(this.toHue-this.fromHue)+this.fromHue;
  },
  transitCycle:function() {
    if (C2.cTrans=='N') {
	// TODO, increase with C0 mean or sum
      if (Math.random()<0.2) {	// publish @ 0.1
        C2.cTrans='T';
        C2.RX=120+100*(1-2*Math.random());
      }
    } else if (C2.cTrans=='T') {
      C2.cTrans='R';
      cycleSet=6+Math.floor(14*Math.pow(Math.random(),complexDamper));
      for (let i=0; i<curveCount; i++) {
        let c=C2.curves[i];
        c.toRo.randomizeCycles();
        c.toRo.c0=getCycle0Match(complexDamper);
        c.toRo.simpleRandomizeCurve();
        Object.assign(c.fromRo, c.toRo);
        c.toRo.randomizeCycles();
        c.toRo.c0=getCycle0Match(complexDamper);
        c.sweepRandomize();
/*
let counter=0;
do {
  c.toRo.simpleRandomizeCurve();
  counter++;
} while (c.sweepFactor()<1);
if (counter>1) {
log('SSS '+counter);
}
*/
      }
    } else if (C2.cTrans=='R') {
//ctx.fillStyle='hsla(0,0%,0%,.01)';
      C2.cTrans='N';
    }
  },
  transitHue:function() {
    C2.fromHue=C2.toHue;
    C2.toHue=Math.round(Math.random()*360);
    for (let i=0; i<curveCount; i++) {
      C2.curves[i].fromHue=C2.curves[i].toHue;
      if (curveCount==2) {
        let hueDiff=120+120*(i%2);
        C2.curves[i].toHue=Math.round((C2.toHue+hueDiff+20*(1-2*Math.random()))%360);
      } else if (curveCount==3) {
        let hueDiff=90+90*(i%3);
        C2.curves[i].toHue=Math.round((C2.toHue+hueDiff+15*(1-2*Math.random()))%360);
      } else if (curveCount==4) {
        let hueDiff=72+72*(i%4);
        C2.curves[i].toHue=Math.round((C2.toHue+hueDiff+12*(1-2*Math.random()))%360);
      } else {
        debugger;
      }
      //C2.curves[i].randomizeHue(i);
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
      let fae=Math.pow(C2.cFrac,3);
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
      let fae=Math.pow(1-C2.cFrac,3);
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
    ctx.strokeStyle=getGradient(Math.round(curve.getHue(C2.hFrac)));
    ctx.stroke();
  },
  changeCurveCount() {
    if (C2.curveCountLock) return;
    if (curveCount==2) {
      if (Math.random()<0.8) {
        C2.addCurve(2);
complexDamper*=complexDamperCurveFactor;
//log('add curve 3');
      }
    } else if (curveCount==3) {
      if (Math.random()<0.4) {
        C2.addCurve(3);
complexDamper*=complexDamperCurveFactor;
//log('add curve 4');
      } else if (Math.random()<0.2) {
        C2.removeCurve(2);
complexDamper/=complexDamperCurveFactor;
//log('remove curve 3');
      }
    } else if (curveCount==4) {
      if (Math.random()<0.3) {
        C2.removeCurve(3);
complexDamper/=complexDamperCurveFactor;
//log('remove curve 4');
      }
    } else {
      debugger;
    }
    curveCountRanger.setValue(curveCount);
  },
  animate:function(ts) {
    if (stopped) { return; }
    if (!C2.cStart) {
      C2.cStart=ts;
    }
    var cProg=ts-C2.cStart;
    //if (cProg<C2.cDuration) {
    if (cProg<C2.cycleDurationFactor*animateDuration) {
      C2.cFrac=cProg/(C2.cycleDurationFactor*animateDuration);
    } else {
      C2.cStart=0;
      C2.cFrac=0;
      C2.transitCycle();
    }
    if (!C2.hStart) {
      C2.hStart=ts;
    }
    var hProg=ts-C2.hStart;
    if (hProg<C2.hueDurationFactor*animateDuration) {
      C2.hFrac=hProg/(C2.hueDurationFactor*animateDuration);
    } else {
    //  if (Math.random()<0.1) {
        C2.transitHue();
//      }
      C2.changeCurveCount();
      C2.hFrac=0;
      C2.hStart=0;
    }
    requestAnimationFrame(C2.animate);
  },
  addCurve(idx) {
    //Object.assign(C2.curves[2], C2.curves[1]);
    C2.curves[idx].fromRo=new Roulette(C2.curves[idx-1].fromRo);
    C2.curves[idx].toRo=new Roulette(C2.curves[idx-1].toRo);
    C2.curves[idx].fromRo.setCurve();
    C2.curves[idx].toRo.setCurve();
    C2.curves[idx].fromHue=C2.curves[idx-1].fromHue;
    C2.curves[idx].toHue=Math.round((C2.toHue+90+20*(1-2*Math.random()))%360);
    C2.curves[idx].dStart=C2.curves[idx-1].dStart;
    C2.curves[idx].dDuration=C2.curves[idx-1].dDuration;
    C2.curves[idx].dFrac=C2.curves[idx-1].dFrac;
    C2.curves[idx].active=true;
    curveCount=idx+1;
//setTable();
  },
  removeCurve(idx) {
    C2.curves[idx].active=false;
    curveCount=idx;
//setTable();
  },
  setCurveCount:function(n) {
    switch (n-curveCount) {
      case 0: return;
      case 1:
        C2.addCurve(curveCount);
        break;
      case 2:
        C2.addCurve(3);
        C2.addCurve(4);
        break;
      case -1:
        C2.removeCurve(curveCount-1);
        break;
      case -2:
        C2.removeCurve(4);
        C2.remvoeCurve(3);
        C2.addCurve(curveCount-1);
        break;
    }
  }
}
C2.curves=[new Curve(C2,'one'), new Curve(C2,'two'), new Curve(C2,'tre'), new Curve(C2,'qua')];

var stopped=true;

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

var fade={
  start:0,
  animate:function(ts) {
    if (stopped) {
      return;
    }
    if (!fade.start) {
      fade.start=ts;
    }
    if (ts-fade.start>60) {
      ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
      fade.start=0;
    }
    requestAnimationFrame(fade.animate);
  }
}

function init() {
  canvas.addEventListener("click", start, false);
  let c0=getCycle0Match(complexDamper);
  C2.curves[0].fromRo.c0=c0;
  C2.curves[0].toRo.c0=c0;
  c0=getCycle0Match(complexDamper);
  C2.curves[1].fromRo.c0=c0;
  C2.curves[1].toRo.c0=c0;
  C2.curves[0].fromRo.simpleRandomizeCurve();
  C2.curves[1].fromRo.simpleRandomizeCurve();
/*
do {
  C2.curves[0].toRo.randomizeCurve(false);
} while (C2.curves[0].sweepFactor()<1);
do {
  C2.curves[1].toRo.randomizeCurve(false);
} while (C2.curves[1].sweepFactor()<1);
*/
  C2.curves[0].sweepRandomize();
  C2.curves[1].sweepRandomize();
  C2.curves[0].fromHue=Math.round((C2.toHue+120+20*(1-2*Math.random()))%360);
  C2.curves[0].toHue=Math.round((C2.toHue+120+20*(1-2*Math.random()))%360);
  C2.curves[1].fromHue=Math.round((C2.toHue+240+20*(1-2*Math.random()))%360);
  C2.curves[1].toHue=Math.round((C2.toHue+240+20*(1-2*Math.random()))%360);
  C2.curves[0].active=true;
  C2.curves[1].active=true;
  curveCount=2;
//setTable();
  start();
}

function start() {
  if (stopped) {
    stopped=false;
    document.querySelector('#ss').textContent='Stop';
    requestAnimationFrame(C2.curves[0].animate);
    requestAnimationFrame(C2.curves[1].animate);
    requestAnimationFrame(C2.curves[2].animate);
    requestAnimationFrame(C2.curves[3].animate);
    requestAnimationFrame(C2.animate);
    requestAnimationFrame(fade.animate);
  } else {
    stopped=true;
    document.querySelector('#ss').textContent='Start';
  }
}

function bmov(btn) {
  btn.parentNode.parentNode.style.color='blue';
}

function bmou(btn) {
  btn.parentNode.parentNode.style.color='black';
}

function btnFocus(ctl) {
  ctl.parentNode.parentNode.className='mb infoc';
}

function btnBlur(ctl) {
  ctl.parentNode.parentNode.className='mb';
}

var Ranger=function(obj) {
  this.box=document.createElement('div');
  this.box.className='mb';
  //document.querySelector('#ctl').appendChild(this.box);
  document.querySelector('#ctl').insertBefore(this.box,document.querySelector('#ql'));
  let spacer=document.createElement('div');
  spacer.className='pholder';
  this.box.appendChild(spacer);
  this.slider=document.createElement('div');
  this.slider.className='slider';
  this.box.appendChild(this.slider);
  this.displayDiv=document.createElement('div');
  this.displayDiv.className='rtext';
  this.box.appendChild(this.displayDiv);
  let labeldiv=document.createElement('div');
  labeldiv.className='rlabel';
  labeldiv.textContent=obj.label;
  this.displayDiv.appendChild(labeldiv);
  this.valueDiv=document.createElement('div');
  this.valueDiv.className='rep';
  this.displayDiv.appendChild(this.valueDiv);
  this.units=' ';
  this.input=document.createElement('input');
  this.input.type='range';
  this.input.className='range';
  //if (obj.hasOwnProperty('value')) { }
  this.input.min=obj.min;
  this.input.max=obj.max;
  this.input.step=obj.step;
  this.input.value=obj.value;
  let inputdiv=document.createElement('div');
  inputdiv.className='inputdiv';
  inputdiv.appendChild(this.input);
  this.box.appendChild(inputdiv);
  this.max=parseFloat(this.input.max);
  this.min=parseFloat(this.input.min);
  let rself=this;
  if (obj.hasOwnProperty('lockInput')) {
    let lockdiv=document.createElement('div');
    lockdiv.className='rep lockdiv';
    inputdiv.appendChild(lockdiv);
    this.lockRep=document.createElement('div');
    this.lockRep.className='locksym';
    this.lockRep.innerHTML='&#128275';
    lockdiv.appendChild(this.lockRep);
    this.lockCB=document.createElement('input');
    this.lockCB.type='checkbox';
    this.lockCB.className='cb';
    this.lockCB.onmouseover=function() {
      rself.lockRep.style.color='blue';
    }
    this.lockCB.onmouseout=function() {
      rself.lockRep.style.color='black';
    }
    this.lockCB.onfocus=function() {
      lockdiv.classList.add('infoc');
    }
    this.lockCB.onblur=function() {
      lockdiv.classList.remove('infoc');
    }
    this.lockCB.onclick=function() {
      rself.lock=rself.lockCB.checked;
      rself.lockRep.innerHTML=rself.lock?'&#128274':'&#128275';
      obj.lockInput(rself.lock);
    }
    lockdiv.appendChild(this.lockCB);
  }
  this.setValue=function(v) {
    rself.input.value=v;
    rself.report();
  }
  this.report=function() {
    if (!menu.open) {
      rself.slider.style.width=8+148*(rself.input.value-rself.min)/(rself.max-rself.min)+'px';
      rself.valueDiv.textContent=rself.input.value+rself.units;
    }
  }
  this.input.onmouseover=function() {
    rself.slider.style.opacity=1;
    rself.displayDiv.style.color='blue';
  }
  this.input.onmouseout=function() {
    if (document.activeElement!=rself.input) {
      rself.slider.style.opacity=0;
    }
    rself.displayDiv.style.color='black';
  }
  this.input.onfocus=function() {
    inputdiv.classList.add('infoc');
    rself.slider.style.opacity=1;
  }
  this.input.onblur=function() {
    inputdiv.classList.remove('infoc');
    rself.slider.style.opacity=0;
  }
  this.input.oninput=function() {
    rself.report();
    if (obj.hasOwnProperty('oninput')) {
      obj.oninput(rself.input.value);
    }
    if (stopped) {
      orbs.draw(1);
    }
  }
}

var speedRanger=new Ranger({
  label:'Animation speed',
  min:1,
  max:10,
  step:1,
  value:3,
  oninput:function(val) {
    animateDuration=48000/val;
    for (let i=0; i<curveCount; i++) {
      C2.curves[i].dDuration=animateDuration*(0.7+0.3*Math.random());
    }
  },
});

var curveCountRanger=new Ranger({
  label:'Curve count',
  min:2,
  max:4,
  step:1,
  value:2,
  oninput:function(val) {
    C2.setCurveCount(val);
  },
  lockInput:function(isLocked) { 
    C2.curveCountLock=isLocked;
  }
});

var menu=new function() {
  this.fdr=document.querySelectorAll('.bgfade');
  this.mbut=document.querySelector('#pmenu');
  this.mrep=document.querySelector('#pmrep');
  this.xrep=this.mbut.children[0];
  this.open=true;
  this.cdiv=document.querySelector('#ctl');
  let ms=this;
  this.mbut.onclick=function() {
    if (ms.open) {
      ms.open=false;
      ms.cdiv.style.display='block';
      speedRanger.report();
      curveCountRanger.report();
    } else {
      ms.open=true;
    }
    requestAnimationFrame(ms.animate);
  }
  this.animate=function(ts) {
    if (!ms.start) ms.start=ts;
    let progress=ts-ms.start;
    if (progress<400) {
      let frac=progress/400;
      if (ms.open) {
	for (let x of ms.fdr) {
	  x.style.background='hsl(0,0%,'+(1-frac)*96+'%)';
	}
	ms.mrep.style.opacity=frac*0.8+(1-frac)*0.001;
	ms.xrep.style.opacity=(1-frac)*0.8+frac*0.001;
	ms.cdiv.style.opacity=(1-frac)*0.8+frac*0.001;
      } else {
	for (let x of ms.fdr) {
	  x.style.background='hsl(0,0%,'+frac*96+'%)';
	}
	ms.mrep.style.opacity=0.001;
	ms.xrep.style.opacity=0.8;
	ms.cdiv.style.opacity=0.8;
      }
      requestAnimationFrame(ms.animate);
    } else {
      if (ms.open) {
        ms.cdiv.style.display='none';
      } else {
	ms.cdiv.style.opacity=1;
      }
      ms.start=0;
    }
  }
}

onresize();

/*
var logging=true;	// publish @ false
function log(e) {
  if (logging) {
    console.log(Date().substring(16,25)+e);
  }
}
var SR=function(obj) {
  let row=document.createElement('tr');
  let label=document.createElement('td');
  label.textContent=obj.label;
  row.appendChild(label);
  document.querySelector('#reptable').appendChild(row);
  this.tds=[
    {
      from:row.appendChild(document.createElement('td')),
      to:row.appendChild(document.createElement('td'))
    },
    {
      from:row.appendChild(document.createElement('td')),
      to:row.appendChild(document.createElement('td'))
    },
    {
      from:row.appendChild(document.createElement('td')),
      to:row.appendChild(document.createElement('td'))
    },
    {
      from:row.appendChild(document.createElement('td')),
      to:row.appendChild(document.createElement('td'))
    }
  ];
  if (obj.hasOwnProperty('text1')) {
    for (let i=0; i<this.tds.length; i++) {
      this.tds[i].from.textContent=obj.text1;
    }
  }
  if (obj.hasOwnProperty('text2')) {
    for (let i=0; i<this.tds.length; i++) {
      this.tds[i].to.textContent=obj.text2;
    }
  }
  let sself=this;
  if (obj.hasOwnProperty('oc')) {
    this.report=function() {
      for (let i=0; i<4; i++) {
      if (i>=curveCount) {
	  sself.tds[i].from.style.display='none';
	  sself.tds[i].to.style.display='none';
	} else {
	  sself.tds[i].from.style.display='table-cell';
	  sself.tds[i].to.style.display='table-cell';
	  obj.oc(sself.tds,i);
	}
      }
    }
  } 
}
var srs=[
  new SR({
    text1:'from',
    text2:'to',
    oc:function(tds, idx) {
    }
  }),
  new SR({
    label:'c0',
    oc:function(tds, idx) {
      tds[idx].from.textContent=C2.curves[idx].fromRo.c0;
      tds[idx].to.textContent=C2.curves[idx].toRo.c0;
    }
  }),
  new SR({
    label:'c1',
    oc:function(tds, idx) {
        tds[idx].from.textContent=C2.curves[idx].fromRo.c1;
        tds[idx].to.textContent=C2.curves[idx].toRo.c1;
    }
  }),
  new SR({
    label:'c2',
    oc:function(tds, idx) {
      tds[idx].from.textContent=C2.curves[idx].fromRo.c2;
      tds[idx].to.textContent=C2.curves[idx].toRo.c2;
    }
  }),
  new SR({
    label:'c3',
    oc:function(tds, idx) {
      tds[idx].from.textContent=C2.curves[idx].fromRo.c3;
      tds[idx].to.textContent=C2.curves[idx].toRo.c3;
    }
  }),
  new SR({
    label:'radc',
    oc:function(tds, idx) {
      tds[idx].from.textContent=C2.curves[idx].fromRo.radiiCount+1;
      tds[idx].to.textContent=C2.curves[idx].toRo.radiiCount+1;
    }
  }),
  new SR({
    label:'type1',
    oc:function(tds, idx) {
      tds[idx].from.textContent=C2.curves[idx].fromRo.type1;
      tds[idx].to.textContent=C2.curves[idx].toRo.type1;
    }
  }),
  new SR({
    label:'type2',
    oc:function(tds, idx) {
      tds[idx].from.textContent=C2.curves[idx].fromRo.type2;
      tds[idx].to.textContent=C2.curves[idx].toRo.type2;
    }
  }),
  new SR({
    label:'type3',
    oc:function(tds, idx) {
      tds[idx].from.textContent=C2.curves[idx].fromRo.type3;
      tds[idx].to.textContent=C2.curves[idx].toRo.type3;
    }
  }),
  new SR({
    label:'r1',
    oc:function(tds, idx) {
      tds[idx].from.textContent=C2.curves[idx].fromRo.r1.toFixed(0);
      tds[idx].to.textContent=C2.curves[idx].toRo.r1.toFixed(0);
    }
  }),
  new SR({
    label:'r2',
    oc:function(tds, idx) {
      tds[idx].from.textContent=C2.curves[idx].fromRo.r2.toFixed(0);
      tds[idx].to.textContent=C2.curves[idx].toRo.r2.toFixed(0);
    }
  }),
  new SR({
    label:'r3',
    oc:function(tds, idx) {
      tds[idx].from.textContent=C2.curves[idx].fromRo.r3.toFixed(0);
      tds[idx].to.textContent=C2.curves[idx].toRo.r3.toFixed(0);
    }
  }),
  new SR({
    label:'r4',
    oc:function(tds, idx) {
      tds[idx].from.textContent=C2.curves[idx].fromRo.r4.toFixed(0);
      tds[idx].to.textContent=C2.curves[idx].toRo.r4.toFixed(0);
    }
  }),
  new SR({
    label:'dur',
    oc:function(tds, idx) {
      tds[idx].to.textContent=C2.curves[idx].dDuration.toFixed(0);
    }
  }),
  new SR({
    label:'sf',
    oc:function(tds, idx) {
      tds[idx].to.textContent=C2.curves[idx].sweepFactor();
    }
  }),
  new SR({
    label:'hue',
    oc:function(tds, idx) {
      tds[idx].from.textContent=C2.curves[idx].fromHue;
      tds[idx].to.textContent=C2.curves[idx].toHue;
    }
  }),
  new SR({
    label:'color',
    oc:function(tds, idx) {
      let col='hsl('+C2.curves[idx].getHue()+',90%,70%)';
      tds[idx].from.style.backgroundColor=col;
      tds[idx].to.style.backgroundColor=col;
    }
  }),
];
function setTable() {
  for (let sr of srs) {
    sr.report();
  }
}
Rarray=[];
*/

init();

