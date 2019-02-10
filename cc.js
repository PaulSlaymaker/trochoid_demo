var CSIZE=400;

var canvas=document.getElementById('cta');
onresize=function() {
  canvas.style.maxHeight=window.innerHeight-20+'px';
}

var ctx=canvas.getContext('2d');
ctx.translate(CSIZE,CSIZE);
ctx.rotate(-Math.PI/2);
ctx.lineWidth=.5;

//ctx.strokeStyle='hsl(120,100%,60%)';
ctx.fillStyle='hsla(0,0%,0%,.01)';

var animateDuration=15000;
var transDurationFactor=1;
var curveCount=3;
var curveCountLock=false;
var cycleSet=7;
var cycleChangeRate=.2;  // publish @ .2?
var softCycleRate=.4;
var cycleLock=false;
var curveCountChangeRate=.7;

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

function getZeroData() {
  var zd=[[0,0]];
  counter=1; 
  for (var z=.01; z<2*Math.PI; z+=.01) {
    zd[counter++]=[0,0];
  }
  return zd;
}

var UNS=0, SYNC=1, TOSYNC=2; 
var curveTransition={
  synced:false,
  ctCount:0,	// cycle transition count
  ctState:'async_steady' // 'sync_soft'  and 2 transitions?
}

var SMALL=.8;
var zoom={
  scale:1,
  duration:animateDuration,
  lock:false,  // presently unused
  randomize:function() {
    if (this.lock) return;
    if (curveTransition.ctState=='to_small') {
      this.scale=SMALL;
    } if (curveTransition.synced) {
      this.scale=1;
    } else if (curveTransition.ctState=='async_soft') {
      this.scale=1;
    } else if (fillColor.fstate==GRAD || fillColor.fstate==TOGRAD) {
/*
      var zf=(curveCount-1)/4;
      this.scale=.7+zf*Math.random();
*/
      var zf=.1*curveCount;
      this.scale=2+zf*Math.random();
    } else { 
      this.scale=SMALL;
    }
  },
  setZoom:function(z) {
    this.scale=z;
  }
}

var ZERO=0, TOZERO=1, STD=2, TOORB=3, TOSMALL=4, CSMALL=5;
var Curve=function(is, rc, cyc) {
  this.radiiCount=rc;
  this.curveTypes=[-1,-1,-1];
  this.cycles=cyc;
  this.radii=[0,0,0,0];
  this.fromData=this.zeroData();
  this.toData=this.zeroData();
  this.duration=animateDuration;
  this.cscale=zoom.scale;
  this.start=null;
  this.active=false;
  this.cstate=is;
  this.anchor=false;
}

Curve.prototype.zeroData=function() {
  let zd=[[0,0]];
  for (var z=.01, counter=1; z<2*Math.PI; z+=.01) {
    zd[counter++]=[0,0];
  }
  return zd;
}

Curve.prototype.zeroFromData=function() {
  this.fromData=this.zeroData();
}

Curve.prototype.zeroToData=function() {
  this.toData=this.zeroData();
}

Curve.prototype.isZero=function() {
  return this.toData[0][0]==0 && this.toData[0][1]==0;
}

Curve.prototype.lineCurve=function() {
  if (this.isZero()) {
    return '';
  }
  ctx.moveTo(this.toData[0][0],this.toData[0][1]);
  for (var i=1; i<629; i++) {
    ctx.lineTo(this.toData[i][0],this.toData[i][1]);
  }
}

var mixedCycles=true;
Curve.prototype.setCycles=function() {
  for (let i in this.cycles) {
    if (i==0) {
      this.cycles[0]=getCycle0Match()
    } else {
      if (mixedCycles) {
	if (cycleSet==10) {
	  this.cycles[i]=Math.random()<.05?5:10;
	} else if (cycleSet==12) {
	  this.cycles[i]=Math.random()<.1?6:12;
	} else if (cycleSet==14) {
	  this.cycles[i]=Math.random()<.2?7:14;
	} else if (cycleSet==16) {
	  this.cycles[i]=Math.random()<.3?Math.random()<.1?4:8:16;
	} else {
	  this.cycles[i]=cycleSet;
	}
      } else {
	this.cycles[i]=cycleSet;
      }
    }
  }
}

Curve.prototype.randomizeRadii=function() {
  let f1=CSIZE/(2*this.radiiCount+1);
  //this.radii[0]=f1+f1*Math.random();
  this.radii[0]=f1+randomTwenty();
  if (this.radiiCount==1) {
    this.radii[1]=this.radii[0]+randomTwenty();
  } else if (this.radiiCount==2) {
    this.radii[1]=f1+f1*Math.random();
    this.radii[2]=Math.abs(this.radii[0]-this.radii[1])+randomTwenty();
    //this.radii[2]=Math.abs(Math.abs(this.radii[0])-Math.abs(this.radii[1]))+randomTwenty();
  } else if (this.radiiCount==3) {
    // complicated to centralize, just random radii
    this.radii[1]=f1+f1*Math.random();
    this.radii[2]=f1+f1*Math.random();
    this.radii[3]=f1+f1*Math.random();
  } //else { debugger; }
  let fac=1;
  if (this.cstate==TOSMALL || this.cstate==CSMALL) {
    fac=SMALL;
  } else {
    fac=zoom.scale;
  }
  for (let i=0; i<this.radiiCount+1; i++) {
    this.radii[i]*=fac;
  }       
}

Curve.prototype.randomizeRadiiCount=function() {
  let p35=1+curveComplexity();
  this.radiiCount=[1,2,3][getRandomInt(0,3,p35)];
}

Curve.prototype.randomizeCurve=function() {
  if (this.cstate==STD || this.cstate==TOSMALL || this.cstate==CSMALL) {
    this.fromData=this.toData.slice();
    if (curveTransition.ctState=='async_soft') {
      this.cycles[0]=getCycle0Match();
      this.randomizeRadiiCount();
    } else {
      if (Math.random()<.7) {
	this.randomizeRadiiCount();
	for (var j=0; j<this.radiiCount; j++) {
          if (Math.random()<.1) {
	    this.curveTypes[j]=1;
	  } else {
	    this.curveTypes[j]=-1;
	  }
	}
      }
    }
    this.randomizeRadii();
    this.setCurve();
    if (curveTransition.ctState=='to_sync') {
      this.duration=Math.max(animateDuration/5, this.duration*.6);
    } else if (curveTransition.ctState=='async_soft') {
      this.duration=animateDuration*(.6+.4*Math.random());
    } else if (curveTransition.ctState=='sync_soft') {
      this.duration=Math.max(animateDuration/5, this.duration*.9);
    } else if (curveTransition.synced) {
      this.duration=animateDuration*transDurationFactor;
    } else {
      if (fillColor.fstate==TOSOLID || fillColor.fstate==SOLID) {
/****sol****/
        this.duration=animateDuration;
/****sol****
        //this.duration=Math.max(animateDuration/5, this.duration*.3);
        this.duration=Math.max(animateDuration/10, this.duration*.3);
*/
      } else {
        //this.duration=animateDuration*(.3+.7*Math.random());
        this.duration=animateDuration*(.6+.4*Math.random());
      }
    }
  } else {
    // manual changes get here
  }
}

Curve.prototype.setCurve=function() {
  let offset=(()=>
  {
    if (curveTransition.ctState=='async_soft') {
      return 0;
    }
    if (curveTransition.synced) {
      return 0;
    }
    if (Math.random()<rotation.factor*(1-curveComplexity())) {
      return Math.random()*Math.PI;
    } else {
      return 0;
    } 
  })();
  let r1=this.radii[0];
  let r2=this.radii[1];
  let r3=this.radii[2];
  let r4=this.radii[3];
  let c0=this.cycles[0];
  let c1=this.cycles[1];
  let c2=this.cycles[2];
  let c3=this.cycles[3];
  switch (this.radiiCount) {
    case 1:
      var f1=1+(this.curveTypes[0]*c1)/c0;
      this.toData[0]=[
        r1*Math.cos(offset)+r2*Math.cos(f1*offset),
        r1*Math.sin(offset)+r2*Math.sin(f1*offset)
      ];
      var counter=1;
      for (let z=.01*c0+offset; z<2*Math.PI*c0+offset; z+=.01*c0) {
	this.toData[counter++]=[
	  r1*Math.cos(z)+r2*Math.cos(f1*z),
	  r1*Math.sin(z)+r2*Math.sin(f1*z)
        ];
      }
      break;
    case 2:
      var f1=1+(this.curveTypes[0]*c1)/c0;
      var f2=1+(this.curveTypes[0]*c1+this.curveTypes[1]*c2)/c0;
      this.toData[0]=[
        r1*Math.cos(offset)+r2*Math.cos(f1*offset)+r3*Math.cos(f2*offset),
        r1*Math.sin(offset)+r2*Math.sin(f1*offset)+r3*Math.sin(f2*offset)
      ];
      var counter=1;
      for (let z=.01*c0+offset; z<2*Math.PI*c0+offset; z+=.01*c0) {
	this.toData[counter++]=[
	  r1*Math.cos(z)+r2*Math.cos(f1*z)+r3*Math.cos(f2*z),
	  r1*Math.sin(z)+r2*Math.sin(f1*z)+r3*Math.sin(f2*z)
        ];
      }
      break;
   case 3:
      var f1=1+(this.curveTypes[0]*c1)/c0;
      var f2=1+(this.curveTypes[0]*c1+this.curveTypes[1]*c2)/c0;
      var f3=1+(this.curveTypes[0]*c1+this.curveTypes[1]*c2+this.curveTypes[2]*c3)/c0;
      this.toData[0]=[
        r1*Math.cos(offset)+r2*Math.cos(f1*offset)+r3*Math.cos(f2*offset)+r4*Math.cos(f3*offset),
        r1*Math.sin(offset)+r2*Math.sin(f1*offset)+r3*Math.sin(f2*offset)+r4*Math.sin(f3*offset)
      ];
      var counter=1;
      for (let z=.01*c0+offset; z<2*Math.PI*c0+offset; z+=.01*c0) {
	this.toData[counter++]=[
	  r1*Math.cos(z)+r2*Math.cos(f1*z)+r3*Math.cos(f2*z)+r4*Math.cos(f3*z),
	  r1*Math.sin(z)+r2*Math.sin(f1*z)+r3*Math.sin(f2*z)+r4*Math.sin(f3*z)
	];
      }
      break;
  }
}

Curve.prototype.toSTD=function() {
/*
  if (this.anchor) {
    return false;
  }
  if (this.cstate!=ZERO || this.cstate!=CSMALL) {
*/
  if (this.cstate!=ZERO) {
    return false;
  }

if (!cycleLock && (()=>{
    if (Math.random()<.2) {
      switch (cycleSet) {
	case 6: cycleSet=12; return true;
	case 7: cycleSet=14; return true;
	case 8: cycleSet=16; return true;
	case 12: cycleSet=6; return true;
	case 14: cycleSet=7; return true;
	case 16: cycleSet=8; return true;
      }
      return false;
    } else {
      return false;
    }
  })()) {
    this.setCycles();
//log('non-sync to '+cycleSet);
  }
  this.cstate=STD;
  this.randomizeCurve();
for (let i in this.radiiCount) {
  this.radii[i]/=3;
}
//this.duration=animateDuration*2;
  this.active=true;
  this.start=0;
  return true;
}

Curve.prototype.toZERO=function() {
  if (this.anchor) {
    return false;
  }
  if (this.cstate!=STD) {
    return false;
  }
  this.cstate=TOZERO;
  this.fromData=this.toData.slice();
  this.zeroToData();
  this.active=true;
  this.start=0;
  return true;
}

Curve.prototype.toORB=function() {
  if (this.anchor) {
    return false;
  }
  if (this.cstate!=STD) {
    return false;
  }
  this.cstate=TOORB;
  this.fromData=this.toData.slice();
  this.radii[0]=CSIZE*2;
  for (let i=1; i<this.radiiCount+1; i++) {
    this.radii[i]=0;
  }
  this.setCurve();
  this.active=true;
  this.start=0;
  return true;
}

/*
Curve.prototype.toSMALL=function() {
  if (this.cstate!=STD) {
    return false;
  }
  this.cstate=TOSMALL;
  this.randomizeCurve();
  this.active=true;
  this.start=0;
  return true;
}
*/

var curves=[
  new Curve(STD,2,[1,7,7,7]), 
  new Curve(STD,1,[2,7,7,7]), 
  new Curve(STD,3,[5,7,7,7]),
  new Curve(ZERO,1,[4,7,7,7]),
  new Curve(ZERO,1,[8,7,7,7]),
];
curves[0].anchor=true;
var anchorCurve=curves[0];

var stopped=true;
var halts={
  stop:false,
  sync:false,
  stopNow:false,
}

var rotation={
  factor:.3,
  //factor:.1,
};

var SOLID=0, GRAD=1, TOSOLID=2, TOGRAD=3;
var fillColor={
  fromFillHSL:[40,90,80],
  toFillHSL:[40,90,80],
  hueDiff:0,
  fillDuration:animateDuration/5,
  lock:false,
  start:null,
  active:false,
  fstate:GRAD,
  switchToSolid:function() {
    //this.type=SOLID;
    this.fstate=SOLID;
    this.active=false;
log('to solid done');
  },
  switchToGradient:function() {
    //this.type=GRAD;
    this.fstate=GRAD;
    this.active=true;
log('to grad done');
    zoom.randomize();
    this.fillDuration=animateDuration;
  }
};

var Stop=function(number,oArr) {
  this.number=number
  this.fromOffset=oArr[0];
  this.toOffset=oArr[0];
  this.midOffset=oArr[0];
  this.oLock=true;	//
  this.oTime=0;
  this.fromHSL=[40,oArr[2],oArr[3]];
  this.toHSL=[getRandomInt(0,360),oArr[2],oArr[3]];
  //this.fromHSL=[40,90,80];
  //this.toHSL=[getRandomInt(0,360),90,80];
  this.fromHSL[0]=this.toHSL[0];
  this.midLum=this.toHSL[2];
  this.cLock=true;	//
  this.hueDiff=0;
  this.fromOpacity=oArr[1];
  this.toOpacity=oArr[1];
  this.state='';
  this.signal;
  if (oArr[0]==0) {
    this.state='zero';
  } else {
    this.state='active';
  }
  this.animateDuration=animateDuration;
  this.randomizeColor=function() {
    this.fromHSL=this.toHSL.slice();
    this.hueDiff=180-Math.round(360*Math.random());
    if (this.fromHSL[0]+this.hueDiff>360 || this.fromHSL[0]+this.hueDiff<0) {
      this.hueDiff*=-1;
    }
    this.toHSL[0]=this.fromHSL[0]+Math.round(this.hueDiff);
  }

  this.shiftPropertiesL=function() {
    //this.fromHSL[1]=this.toHSL[1];
    this.fromHSL[2]=this.toHSL[2];
    if (fillColor.fstate==TOSOLID) {
    } else {
      //this.toHSL[1]=getSOL(stops.length)[this.number][2];
      this.toHSL[2]=getSOL(stops.length)[this.number][3];
    }
    this.fromOffset=this.toOffset;
    this.toOffset=getSOL(stops.length)[this.number][0];
  }
}

Stop.prototype.setOffset=function(offset) {
  this.fromOffset=this.toOffset;
  this.toOffset=offset;
}

Stop.prototype.getHSLString=function() {
  return 'hsl('+this.toHSL[0]+','+this.toHSL[1]+'%,'+this.midLum+'%)';
}

Stop.prototype.setMidOffset=function(frac) {
  this.midOffset=this.toOffset*frac+this.fromOffset*(1-frac);
}

Stop.prototype.setMidColor=function(frac) {
  this.midLum=this.toHSL[2]*frac+this.fromHSL[2]*(1-frac);
}

Stop.prototype.inactivate=function() {
  if (this.state=='active') {
    this.state='rest';
  }
}

Stop.prototype.activate=function() {
  if (this.state=='rest') {
    this.state='active';
  }
}

function activateStops() {
  for (stop of stops) {
    stop.activate();
  }
}

function stopsInactive() {
  for (stop of stops) {
    if (stop.state=='active') {
      return false;
    }
  }
  return true;
}

function shiftStops() {
  insertStop();
  deleteStop();
  for (let i in stops) {
    stops[i].number=i;
    stops[i].shiftPropertiesL();
    if (i==stops.length-1) {
      if (stops[i].signal) {
        fillColor.fstate=GRAD;
        fillColor.fillDuration=animateDuration;
        stops[i].signal=false;
      }
    }
  }
  if (fillColor.fstate==TOSOLID) {
    fillColor.fillDuration=Math.max(1000, fillColor.fillDuration*.8);
  } else if (fillColor.fstate==TOGRAD) {
    fillColor.fillDuration=Math.min(animateDuration/5, fillColor.fillDuration*2);
  }
}

var MAX_STOP_COUNT=4;
var so=getSOL(MAX_STOP_COUNT);
var stops=[];

for (let i=0; i<so.length; i++) {
  let op=(i==0)?1:(i==1)?.8:0;
  let stopx=new Stop(i,[so[i][0],op,so[i][2],so[i][3]]);
  stops.push(stopx);
}
stops[0].signal=true;

function insertStop() {
  stops.unshift(new Stop(0,[0,1,90,80]));
  stops[0].state='zero';
  stops[1].state='active';  // maybe 'rest'
  if (fillColor.fstate==TOSOLID) {
    stops[0].fromHSL=stops[1].fromHSL.slice();
    stops[0].toHSL=stops[1].toHSL.slice();
  }
  // set position flags here
}

function deleteStop() {
  stops.pop();
}

function getGradient() {
  let grad=ctx.createRadialGradient(0,0,0, 0,0,CSIZE);
  for (let stop of stops) {
    grad.addColorStop(stop.midOffset, stop.getHSLString());
  }
  return grad;
}

function curvesInTransition() { // no halts set
  for (c of curves) {
    if (c.cstate==TOZERO || c.cstate==TOORB) {
      return true;
    } 
  }
  return false;
}

function isAActive() {
  for (let c of curves) {
    if (c.active) {
      return true; 
    }
  }
  if (fillColor.active) { 
    return true; 
  }
  return false;
}

function getCycle0Match() {
  switch (cycleSet) {
    case 2:
      return [1,3,5,7,9,11,13,15,17][getRandomInt(0,9,6)];
    case 3:
      return [1,2,4,5,7,8,10,11,13,14,16,17][getRandomInt(0,12,5)];
    case 4:
      return [1,3,5,7,9,11,13,15,17][getRandomInt(0,9,5)];
    case 5:
      return [1,2,3,4,6,7,8,9,11,12,13,14,16,17][getRandomInt(0,14,4)];
    case 7:
      return [1,2,3,4,5,6,8,9,10,11,12,13,15,16,17][getRandomInt(0,15,4)];
    case 8:
      return [1,3,5,7,9,11,13,15,17][getRandomInt(0,9,3)];
    case 9:
      return [1,2,4,5,7,8,10,11,13,14,16,17][getRandomInt(0,12,3)];
    case 10:
      return [1,3,7,9,11,13,17][getRandomInt(0,7,3)];
    case 11:
      return [1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17][getRandomInt(0,16,2)];
    case 6:
    case 12:
      return [1,5,7,11,13,17][getRandomInt(0,6,2)];
    case 13:
      return [1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17][getRandomInt(0,16,2)];
    case 14:
      return [1,3,5,9,11,13,15,17][getRandomInt(0,8)];
    case 15:
      return [1,2,4,7,8,11,13,14,16,17][getRandomInt(0,10)];
    case 16:
      return [1,3,5,7,9,11,13,15,17][getRandomInt(0,9)];
    case 17:
      return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16][getRandomInt(0,16)];
  }
  return false;
}

function randomTwenty() {
  return 20-40*Math.random();
}

function resetCycleSet() {
  for (let c of curves) {
    c.setCycles();
  }
}

function softRecycle() {
  for (let c of curves) {
    c.cycles[0]=getCycle0Match();
  }
log('soft cycle');
}

function randomizeCycles() {
  let yx=cycleSet;
    cycleSet=(()=>{
      // 10 cycles demoted
      switch (curveCount) {
	case 1: return [17,16,15,14,13,12,11,9,10,8,7,6];
	case 2: return [14,15,13,16,12,17,11,9,10,8,7,6];
	case 3: return [11,10,9,12,8,13,7,14,6,15,16,17];
	case 4: return [8,9,7,11,6,10,12,13,14,15,16,17];
      }
      return [6,7,8,9,11,10,12,13,14,15,16,17];
    })()[getRandomInt(0,12,2)];
    resetCycleSet();
if (yx!=cycleSet) {
    curveTransition.ctCount++;
}

ctx.lineWidth=0.2+0.03*(18-cycleSet);

log('maj '+yx+' to '+cycleSet);
  return yx;
}

function randomizeCurves() {
  for (c of curves) {
    if (c.cstate==STD || c.cstate==CSMALL) {
      c.randomizeCurve();
      c.active=true;
    }
  }
}

function curveComplexity() {
  let comp1=0;	// combine radii count with curve count
  for (let c of curves) {
    if (c.cstate!=ZERO) {
      comp1+=c.radiiCount;
    }
  }
  // need to change if max curve goes>4 or max cycle>17
  comp1=(comp1-1)/28;
  let comp2=(cycleSet-2)/30;
  return comp1+comp2;
}

function randomTen() {
  return 10-20*Math.random();
}

function randomCurveCountChange(curve) {
  if (curveCountLock) {
    return false;
  }
if (fillColor.fstate==TOSOLID || fillColor.fstate==SOLID) {
  return false;
}
/*
if (curvesInState(TOSMALL)) {
  return false;
}
  if (zoom.scale==SMALL) {
    return false;
  }
*/
  let p41=1.5*(.41-curveComplexity());  // .41 desirable level
  let cdel=curveCountChangeRate+Math.abs(p41);
//log('cc check '+cdel);
  if (Math.random()<cdel) {
    switch (curveCount) {
      case 1:
        for (c of curves) {
          if (c==curve) {
            continue;
          }
          if (c.toSTD()) {
            curveCount++;
            return true;
          }
        }
        return false;
      case 2:
//log('add 3 <'+(1+p41));
        if (Math.random()<(1+p41)) { // add
	  for (c of curves) {
	    if (c==curve) {
	      continue;
	    }
            if (c.toSTD()) {
              curveCount++;
              return true;
            }
          }
        } else {
          if (curve.toORB()) {
            return true;
          }
        }
        return false;
      case 3:
//log('add 4 <'+(.6+p41));
        if (Math.random()<(.5+p41)) {
          for (c of curves) {
	    if (c==curve) {
	      continue;
	    }
            if (c.toSTD()) {
              curveCount++;
              return true;
            }
          }
        } else {
          if (curve.toORB()) {
            return true;
          }
        }
        return false;
      case 4:
//log('add 5 <'+(.4+p41));
        if (Math.random()<(.4+p41)) {
          for (c of curves) {
	    if (c==curve) {
	      continue;
	    }
            if (c.toSTD()) {
              curveCount++;
              return true;
            }
          }
        } else {
          if (curve.toORB()) {
            return true;
          }
        }
        return false;
      case 5:
        if (curve.toORB()) {
          return true;
        }
    }
    return false;
  }
  return false;
}

function getSOL(count) {
  let sa=[[0,1,90,80]];
  if (count==1) {
    return sa;
  } else if (count==2) {
    sa.push([1,1,90,80]);
    return sa;
  } else if (count==3) {
    sa.push([.5,.5,70,70]);
    sa.push([1,0,0,20]);
    return sa;
  } else {
    let seg=1/(count-2);
    for (let i=1; i<count-2; i++) {
      let nos=0.18*Math.pow(seg*i,2)+0.85*seg*i;
//console.log(i+' '+seg+' '+seg*i);
      let lum=80-60*Math.pow(i*seg,4);
      // not used?
      let sat=90*(1-Math.pow(i*seg,4));
      sa.push([nos,1-Math.pow(seg*i,5), sat, lum]);
    }
    sa.push([1,0,0,0]);
    sa.push([1,0,0,0]);
  }
  return sa;
}

function isLineActive() {
  for (var i=0; i<curveCount; i++) {
    if (curves[i].active) {
      return true;
    }
  }
  return false;
}

function cbLoc(p1,p2,frac) {
  return p1*(1-frac)+p2*frac;
/*
  var f1=.1;
  var f2=.9;
  var e1=Math.pow(1-frac,3)*p1;
  var e2=3*frac*Math.pow(1-frac,2)*(p1+(p2-p1)*f1);
  var e3=3*(1-frac)*Math.pow(frac,2)*(p1+(p2-p1)*f2);
  var e4=Math.pow(frac,3)*p2;
  return e1+e2+e3+e4;
*/
}

function curvesInState(st) {
  for (let c of curves) {
    if (c.cstate==ZERO) continue;
    if (c.cstate!=CSMALL) {
log('check small '+['ZERO','TOZERO','STD','TOORB','TOSMALL','CSMALL'][c.cstate]);
      return false;
    }
  }
  return true;
}

function setCurvesSmall() {
  for (let c of curves) {
    if (c.cstate==TOORB) {
       return false;
    }
  }
  for (let c of curves) {
    if (c.cstate==ZERO) continue;
    c.cstate=TOSMALL;
  }
  return true;
log('set small');
}

function setCurvesStd() {
  for (let c of curves) {
    if (c.cstate==ZERO) continue;
    c.cstate=STD;
  }
}

function animate(ts) {
if (halts.stopNow) {
  stopped=true;
  return;
}
  var endMove=false;
  ctx.beginPath();
  for (var cx of curves) {
    if (cx.active) {
      if (!cx.start) {
	cx.start=ts;
      }
      var progress=ts-cx.start;
      if (progress<cx.duration) {
	var frac=progress/(cx.duration);
	ctx.moveTo(cbLoc(cx.fromData[0][0],cx.toData[0][0],frac),cbLoc(cx.fromData[0][1],cx.toData[0][1],frac));
	for (var i=1; i<629; i++) {
	  ctx.lineTo(cbLoc(cx.fromData[i][0],cx.toData[i][0],frac),cbLoc(cx.fromData[i][1],cx.toData[i][1],frac));
	}
	ctx.closePath();
      } else {
        cx.start=0;
	if (cx.cstate==TOZERO || cx.cstate==TOORB) {
          if (cx.cstate==TOORB) {
            cx.zeroToData();
            cx.zeroFromData();
cx.radii[0]=0;
          }
	  cx.cstate=ZERO;
          curveCount--;
	  cx.active=false;
	} else if (cx.cstate==TOSMALL) {
if (cx.radii[0]<CSIZE/2) {
	  cx.cstate=CSMALL;
} else {
log('small reset');
}
        }
        if (halts.stop || halts.sync) {
          cx.active=false;
	} else {
	  if (curveTransition.synced) {
	    if (!(cycleSet%2) && Math.random()<softCycleRate && curveTransition.ctCount<1) {
               cx.cycles[0]=getCycle0Match();
log('soft cycle2');
            } else {
	      // exit synchrony 
//	      curveTransition.ctState='async_steady';
	      curveTransition.synced=false;
//curveTransition.ctCount=0;
	      fillColor.active=true;  // TODO unless locked
	      fillColor.start=0;
log('cycle off');
            }
          } else {
	    // unsynced
	    if (randomCurveCountChange(cx)) {
	    } else {
/****sol****/
	      if (curveTransition.ctState=='to_small') {
		if (curvesInState(CSMALL)) {
		  if (fillColor.fstate==SOLID) {
		    if (cycleSet%2==0 && Math.random()<softCycleRate) {
log('async soft from '+curveTransition.ctState);
		      curveTransition.ctState='async_soft';
		    } else {
		      if (fillColor.fstate==SOLID) {
			if (curveTransition.ctCount<1) {
log('change cycle');
			  halts.sync=true;
			  curveTransition.ctState='to_sync';
			}
		      }
		    }
		  }
		}
	      } else {
		if (curveTransition.ctState!='to_small' && Math.random()<cycleChangeRate*(.5+Math.abs(cycleSet-9)/16) && !curveCountLock) {
		  //if (curveTransition.ctState=='async_steady') {
		  if (fillColor.fstate==GRAD) {
                    if (setCurvesSmall()) {
		      curveTransition.ctState='to_small';
		      fillColor.fstate=TOSOLID;
log('to small start');
                    }
		  } else {

if (curveTransition.ctState=='async_soft') {
  if (Math.random()<.1) {
      halts.sync=true;
      curveTransition.ctState='to_sync';
  }
}

                  }
		}
	      }

/****sol****
	      if (fillColor.fstate==SOLID) {
                if (curvesInState(CSMALL)) {
		  if (cycleSet%2==0 && Math.random()<softCycleRate) {
  log('async soft from '+curveTransition.ctState);
		    curveTransition.ctState='async_soft';
		  } else {
		    if (curveTransition.ctCount<1) {
  //if (curvesOnScale(SMALL)) {
  //log('on scale '+fillColor.fstate);
  log('change cycle');
		      halts.sync=true;
		      curveTransition.ctState='to_sync';
		    }
		  }
                }
              }
*/
            }
          }
          cx.randomizeCurve();
        }
	if (Math.random()<.3 && !curveTransition.synced && !halts.sync) {
	  zoom.randomize();
	}
	endMove=true;
      }
    } else {
      cx.lineCurve();
    }
  }

  if (fillColor.fstate==SOLID) {
    if (fillColor.active) {  // remove ?
      if (halts.stop || halts.sync) {
        fillColor.active=false;
      } else {
        if (curveTransition.ctCount>0 && !curveTransition.synced) {
   	  fillColor.fstate=TOGRAD;
log('to grad start');
 	  fillColor.fillDuration=animateDuration/2;
 	  curveTransition.ctCount=0;
          curveTransition.ctState='async_steady';
          setCurvesStd();
 	  zoom.randomize();
        } 
      }
    }
  } else { // gradient or transitions
    for (let stop of stops) {
      if (stop.state=='active') {
	if (!stop.oTime) {
	  stop.oTime=ts;
	}
	var progress=ts-stop.oTime;
	if (progress<fillColor.fillDuration) {
	  let frac=progress/fillColor.fillDuration;
	  stop.setMidOffset(frac);
          stop.setMidColor(frac);
	} else {
	  stop.oTime=0;
	  stop.inactivate();
	  if (stopsInactive()) {
	    // all stops done
	    if (halts.stop || halts.sync) {
	      fillColor.active=false;
	    } else {
	      shiftStops();
	      if (fillColor.fstate==GRAD) {

/****sol****/
//if (curveTransition.ctState=='to_small') { }
/*
if (Math.random()<cycleChangeRate*(.5+Math.abs(cycleSet-9)/16 && !curveCountLock)) {
setCurvesSmall();
log('to small start');
}
*/

/****sol****
		if (Math.random()<cycleChangeRate*(.5+Math.abs(cycleSet-9)/16) && !curveCountLock) {
		  fillColor.fillDuration=animateDuration*.2;
		  fillColor.fstate=TOSOLID;
		  zoom.setZoom(SMALL);  // now redundant?
                  setCurvesSmall();              
log('to solid start');
                }
*/

	      } else if (fillColor.fstate==TOSOLID) {
		if (stops[stops.length-1].toHSL[0]==stops[stops.length-2].toHSL[0] && stops[stops.length-2].toOffset==1) {
		  fillColor.switchToSolid();
		}
	      } else if (fillColor.fstate==TOGRAD) {
		if (stops[stops.length-1].toHSL[0]!=stops[stops.length-2].toHSL[0]) {
		  fillColor.switchToGradient();
		}
              }
	      activateStops();
            }
          }
        }
      }
    }
  }

  if (!endMove) {
    //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//    ctx.fill('evenodd');
/*
if (curveTransition.ctState=='sync_trans') {
ctx.lineWidth=.03;
} else {
ctx.lineWidth=.2;
}
*/
    ctx.strokeStyle=getGradient();
    ctx.stroke();
  }

  if (isAActive()) {
    requestAnimationFrame(animate);
  } else {
    if (halts.stop) {
      stopped=true;
    } else {
      if (halts.sync) {
        if((()=>{ 
            if (cycleSet%2) { return false; }
            if (Math.random()<softCycleRate) { 
	      for (let c of curves) {
		if (c.cstate==STD || c.cstate==CSMALL) {
		  for (let i=1; i<c.cycles.length; i++) {
		    if (c.cycles[i]!=cycleSet) {
		      return false;
		    }
		  }
		}
	      }
              return true;
            }
            return false;
          })()) {
          softRecycle();
          curveTransition.ctState='sync_soft';
        } else {
          if (!cycleLock) {
	    randomizeCycles();
          } else {
            curveTransition.ctCount=1;
          }
          curveTransition.ctState='sync_trans';
	}
        zoom.randomize();
        randomizeCurves();
        curveTransition.synced=true;
        halts.sync=false;
	requestAnimationFrame(animate);
      } //else { debugger; }
    }
  }
}

function init() {
  zoom.randomize();
if (stops.length>2) {
  stops[1].fromHSL[1]/=2;
  stops[1].toHSL[1]/=2;
  stops[1].fromHSL[2]=20;
  stops[1].toHSL[2]=20;
  stops[2].fromHSL[1]=0;
  stops[2].toHSL[1]=0;
  stops[2].fromHSL[2]=0;
  stops[2].toHSL[2]=0;
}
  randomizeCurves();
  start();
}

function start() {
  if (stopped) {
    stopped=false;
    halts.stop=false;
    halts.stopNow=false;
    activateStops();
    fillColor.active=true;
    for (c of curves) {
      if (c.cstate==ZERO) continue;
//      if (c.cstate==STD) {
        c.randomizeCurve();
        c.active=true;
        c.start=0;
//      }
    }
    requestAnimationFrame(animate);
  } else {
      halts.stopNow=true;
      halts.stop=true;
/*
    if (halts.stop) {
      halts.stopNow=true;
    } else {
      halts.stop=true;
    }
*/
  }
}

function touch() {
  start();
}

canvas.addEventListener("click", touch, false);

onresize();

init();

var logging=true;	// publish @ false
function log(e) {
  if (logging) {
    console.log(e);
  }
}

function fillState() {
  console.log(['SOLID','GRAD','TOSOLID','TOGRAD'][fillColor.fstate]);
}

function crep() {
  let s={'active':[],'cycles':[],'state':[],'radcnt':[],'radii':[],'dur':[]};
  for (let cur of curves) { 
    s.active.push(cur.active);
    s.cycles.push(cur.cycles.toString());
    s.state.push(['ZERO','TOZERO','STD','TOORB','TOSMALL','CSMALL'][cur.cstate]);
    s.radcnt.push(cur.radiiCount);
    s.radii.push(((c)=>{
      let rint=[];
      for (let i=0; i<c.radiiCount+1; i++) {
        rint.push(c.radii[i].toFixed(0));
      }
      return rint.toString();
    })(cur));
    s.dur.push(cur.duration.toFixed(0));
  }
  console.table(s);
}

function srep() {
  let s=[];
  for (let sto of stops) { 
    s.push(((st2)=>{
      return { 
        'state':st2.state, 
        'from offset':Math.round(st2.fromOffset*10)/10,
        'to offset':st2.toOffset, 
        'hue':st2.toHSL[0],
        'from sat':st2.fromHSL[1],
        'to sat':st2.toHSL[1],
        'from lum':st2.fromHSL[2],
        'to lum':st2.toHSL[2],
      }
    })(sto));
  }
  console.table(s);
}
