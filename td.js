var MAX_CURVE_COUNT=4;

onresize=function() {
  document.getElementById('asvg').style.maxHeight=window.innerHeight-20+'px';
}

var ZERO=0, TOZERO=1, STD=2, TOEQ=3, EQUAL=4;
var Curve=function(is, rc, cyc) {
  this.radiiCount=rc;
  this.curveTypes=[-1,-1,-1];
  this.radii=[0,0,0,0];
  this.cycles=cyc;
  this.fromData=this.zeroData();
  this.toData=this.zeroData();
  this.duration=animateDuration;
  this.start=0;
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
  //return this.toData[0]==[0,0];
}

Curve.prototype.lineCurve=function() {
  //if (this.toData[0][0]==0 && this.toData[0][1]==0) {
  if (this.isZero()) {
    return '';
  }
  var d='';
  d+='M'+this.toData[0][0]+' '+this.toData[0][1];
  for (var i=1; i<629; i++) {
    d+='L'+this.toData[i][0]+' '+this.toData[i][1];
  }
  d+='z';
  return d;
}

Curve.prototype.setCurve=function() {
  let offset=(()=>
  {
    if (curveTransition.synced) {
      return 0;
    }
    if (Math.random()<rotationFactor*(1-curveComplexity())) {
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

Curve.prototype.getMidCurve=function(frac) {
  let d='M';
  d+=cbLoc(this.fromData[0][0],this.toData[0][0],frac);
  d+=' ';
  d+=cbLoc(this.fromData[0][1],this.toData[0][1],frac);
  for (var i=1; i<629; i++) {
    d+='L';
    d+=cbLoc(this.fromData[i][0],this.toData[i][0],frac);
    d+=' ';
    d+=cbLoc(this.fromData[i][1],this.toData[i][1],frac);
  }
  d+='z';
  return d;
}

Curve.prototype.randomizeRadii=function() {
  // 80 tied to 200 radius container 
  let f1=200/(this.radiiCount+1);
//  let f2=2*this.radiiCount*f1;
    this.radii[0]=f1+f1*Math.random();
    if (this.radiiCount==1) {
      this.radii[1]=this.radii[0]+randomTwenty();
    } else if (this.radiiCount==2) {
      this.radii[1]=f1+f1*Math.random();
      this.radii[2]=Math.abs(this.radii[0]-this.radii[1])+randomTwenty();
    } else if (this.radiiCount==3) {
      // complicated to centralize, just random radii
      this.radii[1]=f1+f1*Math.random();
      this.radii[2]=f1+f1*Math.random();
      this.radii[3]=f1+f1*Math.random();
    } //else { debugger; }
//console.log('ctr '+ctr+' cent '+centralFactor(this));

/*
if (this.radiiCount==1) {
  let rd=this.radii[0]-this.radii[1];
  if (Math.abs(rd)>10) {
    if (rd<0) {
      this.radii[1]-=Math.abs(rd)+randomFive();
    } else {
      this.radii[0]-=Math.abs(rd)+randomFive();
    }
  }
}
*/
/*
  if (this.radiiCount==1) {
    let cFactor=((c)=>{
      let cf=c.radii[0]; 
      for (let j=1; j<c.radiiCount+1; j++) {
	cf-=c.radii[j];
	cf=Math.abs(cf);
      }
      return cf;
    })(this);
    // 20 tied to 200 radius
    if (cFactor>20) {
this.radii[0]/=2;
      this.radii[1]=this.radii[0]+randomTen();
    }
  }
*/
  let maxC=((c)=>{
    let maxr=0;
    for (let j=0; j<c.radiiCount+1; j++) {
      maxr+=c.radii[j];
    }
    return maxr;
  })(this);
  //let fac=zoom.scale*200/maxC;
  let fac=(zoom.scale*200/maxC)/(this.radiiCount+1);
  for (let i=0; i<this.radiiCount+1; i++) {
    this.radii[i]*=fac;
  }       
/*
  if (this.anchor) {
    for (let i=0; i<this.radiiCount+1; i++) {
      this.radii[i]*=fac;
    }       
  } else if (maxC>zoom.scale*200) {
    for (let i=0; i<this.radiiCount+1; i++) {
      this.radii[i]*=fac;
    }       
  }
*/
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

function getMaxTS() {
  let mts=0;
  for (let c of curves) {
    if (c.active) {
      mts=Math.max(mts,c.start);
    }
  }
  return mts;
}

Curve.prototype.randomizeCurve=function() {
  if (this.cstate==STD) {
    this.fromData=this.toData.slice();
    if (Math.random()<.7) {
      let p35=1+curveComplexity();
      //this.radiiCount=[1,2,3][getRandomInt(0,3,curveCount/1.2)]; //TODO include cycleSet
      this.radiiCount=[1,2,3][getRandomInt(0,3,1+p35)];
      for (var j=0; j<this.radiiCount; j++) {
	if (Math.random()<.05) {
	  this.curveTypes[j]=1;
	} else {
	  this.curveTypes[j]=-1;
	}
      }
    }
    this.randomizeRadii();
    this.setCurve();
    if (curveTransition.synced) {
      this.duration=animateDuration*transDurationFactor;
    } else {
//console.log('maxts '+getMaxTS());
      if (fillColor.fstate==TOSOLID || fillColor.fstate==SOLID) {
        //this.duration=animateDuration*transDurationFactor;
        //this.duration*=.7;
        this.duration=Math.max(1000, this.duration*.3);
//console.log('lesser dur');
      } else {
        this.duration=animateDuration*(.3+.7*Math.random());
      }
    }
  } else {
    // manual changes get here
//debugger;
  }
}

Curve.prototype.copyParameters=function(c) {
  this.radiiCount=c.radiiCount;
  this.curveTypes=c.curveTypes;
  this.radii=c.radii;
  this.cycles=c.cycles;
}

Curve.prototype.toSTD=function() {  // only called from cc change, internalize it?
  if (this.anchor) {
    return false;
  }
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
// TODO set in ctl
log('non-sync to '+cycleSet);
}

//if (Math.random()<.2) {
/*
if (true) {
  // todo reset ctl
  switch (cycleSet) {
    case 6: cycleSet=12; break;
    case 7: cycleSet=14; break;
    case 8: cycleSet=16; break;
    case 12: cycleSet=6; break;
    case 14: cycleSet=7; break;
    case 16: cycleSet=8; break;
  }
  this.setCycles();
log('non-sync to '+cycleSet);
}
*/

  this.cstate=STD;
  this.randomizeCurve();
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

Curve.prototype.anchorMatch=function() {
  if (this.radiiCount!=anchorCurve.radiiCount) {
    return false;
  }
  for (let i in this.cycles) {
    if (this.cycles[i]!=anchorCurve.cycles[i]) {
      return false;
    }
  }
}

Curve.prototype.lineFromData=function() { // debug
  if (this.isZero()) {
    return '';
  }
  var d='';
  d+='M'+this.fromData[0][0]+' '+this.fromData[0][1];
  for (var i=1; i<629; i++) {
    d+='L'+this.fromData[i][0]+' '+this.fromData[i][1];
  }
  d+='z';
  return d;
}

var curves=[
  new Curve(STD,2,[1,6,6,6]), 
  new Curve(STD,1,[5,6,6,6]), 
  new Curve(STD,3,[7,6,6,6]),
  new Curve(ZERO,1,[1,6,6,6]),
];
curves[0].anchor=true;
var anchorCurve=curves[0];

/*
// debug
for (let i=0; i<MAX_CURVE_COUNT; i++) {
  curves[i].cn=i;
}
*/

var UNS=0, SYNC=1, TOSYNC=2; 
var curveTransition={
  //ctState:UNS,
  synced:false,
  //toEqual:false,
  equal:false,
  syncTS:0,
  ctCount:0	// cycle transition count
}

var stopped=true;
var halts={
  stop:false,
  sync:false,
  stopNow:false,
  //durationChange:false,
  //pause:false,
  halting:function() {
    return stop || sync;
  }
}

var animateDuration=15000;  // publish @ 15000?
var transDurationFactor=.5;

var rotationFactor=.15;
////
var curveCount=3;
////
var curveCountChangeRate=.3;
////
var curveCountLock=false;
var cycleSet=6;
//////
var cycleChangeRate=.3;  // publish @ .3
//////
var cycleLock=false;
var curveTypeChangeRate=.7;
var fillHueChangeRate=.3;
var curveChangeRate=.15;

function curvesInTransition() { // no halts set
  for (c of curves) {
    if (c.cstate==TOZERO) {
      return true;
    } 
  }
  return false;
}

/*
function curvesCyclesEqual() {
  for (c of curves) {
    for (let i in c.cycles) {
      if (c.cycles[i]!=anchorCurve.cycles[i]) {
        return false;
      }
    } 
  }
  return true;
}
*/

var matchCurves=[];
function setCurvesMatchingAnchor() {
  matchCurves=[];
  for (let c of curves) {
    if (c.anchor) continue;
    if (c.anchorMatch()) {
      matchCurves.push(c);
    }
  }
}

function getZeroData() {
  let zd=[[0,0]];
  for (var z=.01, counter=1; z<2*Math.PI; z+=.01) {
    zd[counter++]=[0,0];
  }
  return zd;
}

function getZeroCurve() {
  var d='M0 0';
  for (var z=.01; z<2*Math.PI; z+=.01) {
    d+='L0 0';
  }
  d+='z';
  return d;
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

var path=document.getElementById('rpath');
//var sgroup=document.getElementById('roid');
var sgroup=document.getElementById('pcontrol');

var SOLID=0, GRAD=1, TOSOLID=2, TOGRAD=3, FADEIN=4;
var fillColor={
  fromFillHSL:[40,90,80],
  toFillHSL:[40,90,80],
  hueDiff:0,
  fillDuration:animateDuration/5,
  lock:false,
  start:null,
  active:false,
  fstate:FADEIN,
  randomize:function() {
    this.fromFillHSL=this.toFillHSL.slice();
    this.hueDiff=fillHueChangeRate*(180-Math.round(360*Math.random()));
    if (this.fromFillHSL[0]+this.hueDiff>360 || this.fromFillHSL[0]+this.hueDiff<0) { 
      this.hueDiff*=-1;
    }
    this.toFillHSL[0]=this.fromFillHSL[0]+Math.round(this.hueDiff);
    var col=this.getHSLString();
/*
    document.querySelectorAll('.fillCol').forEach(function(hdiv) {
      hdiv.style.backgroundColor=col;
    });
    document.getElementById('hueRep').textContent=this.toFillHSL[0];
    document.getElementById('hueSel').value=this.toFillHSL[0];
*/
  },
  getHSLString:function() {
    return 'hsl('+this.toFillHSL[0]+','+this.toFillHSL[1]+'%,'+this.toFillHSL[2]+'%)'; 
  },
  switchToSolid:function() {
    this.type=SOLID;
    this.fstate=SOLID;
/*
    this.fromFillHSL[0]=stops[0].toHSL[0];
    this.toFillHSL[0]=stops[0].toHSL[0];
    path.style.fill=this.getHSLString();
*/

    this.active=false;

log('to solid done');
//this.fillDuration=animateDuration;
  },
  switchToGradient:function() {
    this.type=GRAD;
    this.fstate=GRAD;
    this.active=true;
log('to grad done');
zoom.randomize();
this.fillDuration=animateDuration;
  }
};
//path.style.fill=fillColor.getHSLString();
path.style.fill='url(#phsRG)';

var SMALL=.9;
var zoom={
  scale:1,
  duration:animateDuration,
  lock:false,
  randomize:function() {
    if (this.lock) return;
//let z=this.scale;
    if (fillColor.fstate==GRAD || fillColor.fstate==TOGRAD || fillColor.fstate==FADEIN) {
      //var zf=(curveCount+cycleSet-7)/10;
var old=(curveCount+cycleSet-7)/10;
      var zf=(curveCount-1)/4;
//console.log('zfac '+old+' -> '+zf);
      this.scale=2+zf*Math.random();
    } else { 
      this.scale=SMALL;
/*
      if (curveTransition.synced) {
	this.scale=SMALL;
      } else if (Math.random()<.7) {
	this.scale=SMALL;
      } else {
	var zf=(curveCount+cycleSet-7)/10;
	this.scale=1+zf*Math.random();
      }
*/
    }
//console.log('rescale '+z+' to '+this.scale);
/*
    document.getElementById('zoomRep').textContent=(this.scale*100).toFixed(0)+'%';
    document.getElementById('zoomSel').value=this.scale;
*/
  },
  setZoom:function(z) {
    // set controls?
    this.scale=z;
  }
}

var Stop=function(number,oArr) {
  this.number=number
  this.el=document.createElementNS("http://www.w3.org/2000/svg", "stop");
  this.el.setAttribute('offset',oArr[0]);
  this.el.setAttribute('stop-opacity',oArr[1]);
  this.fromOffset=oArr[0];
  this.toOffset=oArr[0];
  this.oLock=true;	//
  this.oTime=0;
  this.fromHSL=[40,90,80];	//
  this.toHSL=[getRandomInt(0,360),90,80];
  this.fromHSL[0]=this.toHSL[0];
  this.el.setAttribute('stop-color',this.getHSLString());
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
  this.shiftProperties=function() {
    this.fromOpacity=this.toOpacity;
    if (fillColor.fstate==TOSOLID) {
    // getSO
    } else {
      this.toOpacity=getSO(stops.length)[this.number][1];
    }
// check for mismatch here
    this.fromOffset=this.toOffset;
    this.toOffset=getSO(stops.length)[this.number][0];
    //this.toOffset=so[this.number][0];
  }
/*
  this.setRandomColor=function() {
    this.hueDiff=0;
    this.toHSL[0]=Math.round(360*Math.random());
    this.fromHSL[0]=this.toHSL[0];
    this.el.setAttribute('stop-color',this.getHSLString());
  }
  this.randomizeDuration=function() {  // unused
    this.animateDuration=duration*(.3+.7*Math.random());
  }
*/
}

Stop.prototype.setOffset=function(offset) {
  this.fromOffset=this.toOffset;
  this.toOffset=offset;
//console.log('** %f %f %f',offset,this.fromOffset,this.toOffset);
}

Stop.prototype.changeHue=function(inp) {
  this.fromHSL[0]=this.toHSL[0];
  this.toHSL[0]=parseFloat(inp.value);
  this.el.setAttribute('stop-color',this.getHSLString());
}

Stop.prototype.getHSLString=function() {
  return 'hsl('+this.toHSL[0]+','+this.toHSL[1]+'%,'+this.toHSL[2]+'%)';
}

Stop.prototype.setMidOffset=function(frac) {
  let fos=this.toOffset*frac+this.fromOffset*(1-frac);
  this.el.setAttribute('offset',fos);
}

Stop.prototype.setMidFade=function(frac) {
  //this.el.setAttribute('stop-opacity',1-frac);
  let op=this.toOpacity*frac+this.fromOpacity*(1-frac);
  this.el.setAttribute('stop-opacity',op);
}

/*
Stop.prototype.setMidColor=function(frac) {
  if (this.state=='fade') {
    var fill='hsl('+this.fromHSL[0]+','+this.toHSL[1]+'%,'+this.toHSL[2]*(1-frac)+'%)';
  } else {
    let hue=(this.fromHSL[0]+Math.round(this.hueDiff*frac)+360)%360;
    var fill='hsl('+hue+','+this.toHSL[1]+'%,'+this.toHSL[2]+'%)';
  }
  this.el.setAttribute('stop-color',fill);
}
*/

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

function getRandomInt(min, max, low) {
  min=Math.ceil(min);
  max=Math.floor(max);
  if (low) {
    return Math.floor(powerRandom(low)*(max-min))+min; 
  } else {
    return Math.floor(Math.random()*(max-min))+min; //The maximum is exclusive and the minimum is inclusive
  }
}

function centralRandom(r) {
  if (r==undefined) { return 0; }
  return r-2*r*Math.random();
}

/*
function randomColor() {
  var rgb=[160,160,160];
  var sel1=getRandomInt(0,3);
  var sel2=(sel1+getRandomInt(1,3))%3;
  var sel3=3-(sel1+sel2);
  rgb[sel1]=getRandomInt(32,256);
  rgb[sel2]=getRandomInt(32,256);
  var rm=rgb[sel1]+rgb[sel2];
  if (rm<100) { 
    rgb[sel3]=255 
  } else if (rm<355) {
    rgb[sel3]=getRandomInt(335-rm,256);
  } else if (rm>510) {
    rgb[sel3]=getRandomInt(0,700-rm);
  } else {
    rgb[sel3]=getRandomInt(0,256);
  }
  var col='#';
  for (var i=0; i<3; i++) {
    var cs=rgb[i].toString(16);
    if (cs.length==1) { cs='0'+cs; }
    col+=cs;
  }
  return col;
}
*/

function changeCurveCount(cc) {
/*
if (cc===curveCount) {
  debugger;
}
*/
  if (cc==1) {
    for (let c of curves) {
      if (c.anchor) {
      } else {
        c.zeroFromData();
        c.zeroToData();
        c.active=false;
	c.cstate=ZERO;
      }
    }
  } else if (cc==2) {
    let cct=0;
    for (let c of curves) {
      if (c.anchor) {
      } else {
        if (cct++>0) {
          c.zeroFromData();
          c.zeroToData();
          c.active=false;
	  c.cstate=ZERO;
        } else {
          // check STD & non-STD
	  c.cstate=STD;
          c.randomizeCurve();
          c.fromData=c.toData.slice();
          c.randomizeCurve();
          c.active=stopped?false:true;
        }
      }
    }
  } else if (cc==3) {
    let cct=0;
    for (let c of curves) {
      if (c.anchor) {
      } else {
        if (cct++>1) {
          c.zeroFromData();
          c.zeroToData();
          c.active=false;
	  c.cstate=ZERO;
        } else {
	  c.cstate=STD;
          c.randomizeCurve();
          c.fromData=c.toData.slice();
          c.randomizeCurve();
          c.active=stopped?false:true;
        }
      }
    }
  } else if (cc==4) {
    for (let c of curves) {
      if (c.anchor) {
      } else {
	c.cstate=STD;
        c.randomizeCurve();
        c.fromData=c.toData.slice();
        c.active=stopped?false:true;
      }
    }
  }
  //curveCount=cc;
  drawCurves();
}

function reportCurveCount() {
//log('cc change to '+curveCount);
  document.getElementById('ccRep').textContent=curveCount;
  document.getElementById('ccRange').value=curveCount;
}

function randomCurveCountChange(curve) {
  if (curveCountLock) {
    return false;
  }
  if (zoom.scale==SMALL) {
    return false;
  }
  let p35=.35-curveComplexity();  // .35 desirable level
  let cdel=curveCountChangeRate+Math.abs(p35);
//let skew=p35/.35;
//console.log('cc check skew '+p35+' '+skew);
  if (Math.random()<cdel) {
    switch (curveCount) {
      case 1:
        for (c of curves) {
          if (c==curve) {
            continue;
          }
          if (c.toSTD()) {
            curveCount++;
            reportCurveCount();
            return true;
          }
        }
        return false;
      case 2:
//console.log('one p '+(.9+p35));
        if (Math.random()<(.9+p35)) { // add
	  for (c of curves) {
	    if (c==curve) {
	      continue;
	    }
            if (c.toSTD()) {
              curveCount++;
              reportCurveCount();
              return true;
            }
          }
        } else {
          if (curve.toZERO()) {
            return true;
          }
        }
        return false;
      case 3:
        if (Math.random()<(.1+p35)) {
          for (c of curves) {
	    if (c==curve) {
	      continue;
	    }
            if (c.toSTD()) {
              curveCount++;
              reportCurveCount();
              return true;
            }
          }
        } else {
          if (curve.toZERO()) {
            return true;
          }
        }
        return false;
      case 4:
        if (curve.toZERO()) {
          return true;
        }
    }
    return false;
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

function resetCycleSet() {
  for (let c of curves) {
    c.setCycles();
  }
//  setCurvesMatchingAnchor();
}

function softRecycle() {
  for (let c of curves) {
    c.cycles[0]=getCycle0Match();
  }
log('soft cycle');
}

function randomizeCycles() {
/*
  if (Math.random()<.1) {
    // soft symmetric, move out
    for (let c of curves) {
      c.cycles[0]=getCycle0Match();
    }
log('soft recycle');
  } else {
*/
let yx=cycleSet;
    // 10 cycles demoted
    cycleSet=(()=>{
      switch (curveCount) {
	case 1: return [17,16,15,14,13,12,11,9,10,8,7,6];
	case 2: return [14,15,13,16,12,17,11,9,10,8,7,6];
	case 3: return [11,10,9,12,8,13,7,14,6,15,16,17];
      }
      return [6,7,8,9,11,10,12,13,14,15,16,17];
    })()[getRandomInt(0,12,3)];
    resetCycleSet();
if (yx!=cycleSet) {
    curveTransition.ctCount++;
}
    document.getElementById('cvRep').textContent=cycleSet;
    document.getElementById('cvRange').value=cycleSet;
log('maj '+yx+' to '+cycleSet);
//  }
}

function randomizeCurves() {
  for (c of curves) {
    if (c.cstate==STD) {
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
  comp1=(comp1-1)/22;
  let comp2=(cycleSet-2)/30;
  return comp1+comp2;
}

function randomTwenty() {
  return 20-40*Math.random();
}

function randomTen() {
  return 10-20*Math.random();
}

function randomFive() {
  return 5-10*Math.random();
}

function isAActive() {
  for (let c of curves) {
    if (c.active) {
      return true; 
    }
  }
/*
  for (var i=0; i<curveCount; i++) {
    if (curves[i].active) {
      return true;
    }
  }
*/
  if (fillColor.active) { 
    return true; 
  }
  return false;
}

function drawCurve() {
  let d='';
  for (let i=0; i<arguments.length; i++) {
    d+=arguments[i].lineCurve();
  }
  path.setAttribute('d',d);
}

function drawCurves() {
  var d='';
  for (c of curves) {
    //if (c.active) {
    //if (c.cstate==STD) {
    if (c.cstate!=ZERO) {
      d+='M'+c.toData[0][0]+' '+c.toData[0][1];
      for (var i=1; i<629; i++) {
	d+='L'+c.toData[i][0]+' '+c.toData[i][1];
      }
      d+='z';
      c.start=0;
    }
  }
  path.setAttribute('d',d);
  // set state
}

function cbLoc(p1,p2,frac) {
  let f1=.1;
  let f2=.9;
  var e1=Math.pow(1-frac,3)*p1;
  var e2=3*frac*Math.pow(1-frac,2)*(p1+(p2-p1)*f1);
  var e3=3*(1-frac)*Math.pow(frac,2)*(p1+(p2-p1)*f2);
  var e4=Math.pow(frac,3)*p2;
  return e1+e2+e3+e4;
}

function animate(ts) {
  if (halts.stopNow) {
    park();
    return;
  }
  var endMove=false;
  var d='';
  for (var cx of curves) {
    if (cx.active) {
      if (cx.start==0) {
	cx.start=ts;
      }
      var progress=ts-cx.start;
      if (progress<cx.duration) {
	var frac=progress/(cx.duration);
        d+=cx.getMidCurve(frac);
      } else {
        cx.start=0;
	if (cx.cstate==TOZERO) {
	  cx.cstate=ZERO;
          curveCount--;
          reportCurveCount();
	  cx.active=false;
	//} else if (cx.cstate==TOSTD) { cx.cstate=STD;
	}
        if (curvesInTransition()) {
          if (cx.cstate==STD) {
            cx.randomizeCurve();
          }
        } else {
          if (halts.stop || halts.sync) {
            cx.active=false;
          } else {
	    if (curveTransition.synced) {
//log('cycle stop or cont '+!cycleSet%2);
	      if (!(cycleSet%2) && Math.random()<.8 && curveTransition.ctCount<1) {
		for (let c of curves) {
		  c.cycles[0]=getCycle0Match();
c.duration=animateDuration/2;
		}
log('soft cycle2');
	      } else {
		// exit synchrony 
		curveTransition.synced=false;
		fillColor.active=true;  // TODO unless locked
		fillColor.start=0;
curveTransition.syncTS=0;
log('cycle off');
	      }
	    } else {
	      if (randomCurveCountChange(cx)) {
	      } else {
		if (!cycleLock && !curveTransition.synced && zoom.scale==SMALL && fillColor.fstate==SOLID && curveTransition.ctCount<1) {
log('change cycle');
		  halts.sync=true;
		}
	      }
            }
            if (cx.cstate==STD) {
              cx.randomizeCurve();
            }
          }
        }
	//if (Math.random()<.3 && CT!='cycle' && !halts.sync) {
	if (Math.random()<.3 && !curveTransition.synced && !halts.sync) {
	  zoom.randomize();
	}
	endMove=true;
      }
    } else {
      d+=cx.lineCurve();
    }
  } // curve loop

  if (!endMove) {
    path.setAttribute('d',d);
  }

  if (fillColor.fstate==SOLID) {
    if (fillColor.active) {  // remove ?
       if (halts.stop || halts.sync) {
	 fillColor.active=false;
       } else {
	 if (curveTransition.ctCount>0 && !curveTransition.synced) {
	   fillColor.fstate=TOGRAD;
  /*
	   for (let stop of stops) {
	     stop.fromHSL[0]=fillColor.toFillHSL[0];
	     stop.toHSL[0]=fillColor.toFillHSL[0];
	     // the following 4 not necessary?
	     stop.fromOpacity=1;
	     stop.toOpacity=1;
	     stop.el.setAttribute('stop-color',fillColor.getHSLString());
	     stop.el.setAttribute('stop-opacity',1);
	   }
  */
  //	 path.style.fill='url(#phsRG)';
log('to grad start');
  fillColor.fillDuration=animateDuration*.1;
  //console.log('filldur '+fillColor.fillDuration);
  curveTransition.ctCount=0;
zoom.randomize();
	 } 
       }
    }
  } else { // gradient or transitions
    for (let stop of stops) {
      //if (stop.state=='active' || stop.state=='fade') {
      if (stop.state=='active') {
	if (!stop.oTime) {
	  stop.oTime=ts;
	}
	var progress=ts-stop.oTime;
	if (progress<fillColor.fillDuration) {
	  let frac=progress/fillColor.fillDuration;
	  stop.setMidOffset(frac);
	  stop.setMidFade(frac);
	} else {
	  // all stops done
	  stop.oTime=0;
	  stop.inactivate();
	  if (stopsInactive()) {
	    if (halts.stop || halts.sync) {
	      fillColor.active=false;
	    } else {
	      shiftStops();
	    }
	    if (fillColor.fstate==GRAD) {
  //log('Cyc '+cycleChangeRate*(.5+Math.abs(cycleSet-9)/16));
	      if (Math.random()<cycleChangeRate*(.5+Math.abs(cycleSet-9)/16)) {
		fillColor.fillDuration=animateDuration*.2;
		fillColor.fstate=TOSOLID;
		zoom.setZoom(SMALL);
  log('to solid start');
	      }
	    } else if (fillColor.fstate==TOSOLID) {
	      if (stops[stops.length-1].toHSL[0]==stops[stops.length-2].toHSL[0] && stops[stops.length-2].toOffset==1) {
		fillColor.switchToSolid();
	      }
	    } else if (fillColor.fstate==TOGRAD) {
	      if (stops[stops.length-1].toHSL[0]!=stops[stops.length-2].toHSL[0]) {
		  fillColor.switchToGradient();
		}
  /*
	    } else if (fillColor.fstate==FADEIN) {
	      if (stops[stops.length-1].signal) {
		 fillColor.fillDuration=animateDuration;
		 fillColor.fstate=GRAD;
	      }
  */
	    }
	    activateStops();
	  }
	}
      }  // active stops
    }  // stop loop
  }

  if (isAActive()) {
    requestAnimationFrame(animate);
  } else { // all stop inflection, mostly for cycle changes?
    if (halts.stop) { // synchronized stop
      park();
    } else {
      if (halts.sync) {
/*
        if (true) {
          anchorCurve.randomizeCurve();
          for (let c of curves) {
            if (c.anchor) {
              c.active=true;
              continue;
            } else {
	      if (c.cstate==STD) {
		c.fromData=c.toData.slice();
		c.copyParameters(anchorCurve);
		for (var i=0; i<c.radiiCount; i++) {
		  c.radii[i]=anchorCurve.radii[i]+centralRandom(1);
		}
		c.setCurve();
                c.active=true;
	      }
            }
          }
*/
/*
        if (true) {
          for (let c of curves) {
            if (c.cstate==STD) {
              c.radiiCount=(c.radiiCount%3)+1
              c.fromData=c.toData.slice();
              c.setCurve();
              c.active=true;
            }
          }
        } else {
        if (true) {
          for (let c of curves) {
            if (c.cstate==STD) {
              for (var i=0; i<c.radiiCount; i++) {
	        if (Math.random()<.5) {
	          c.curveTypes[i]*=-1;
	        }
              }
              c.fromData=c.toData.slice();
              c.setCurve();
              c.active=true;
            }
          }
*/
        if((()=>{ 
            if (cycleSet%2) { return false; }
            if (Math.random()<.4) { return false; }
            for (let c of curves) {
	      if (c.cstate==STD) {
                for (let i=1; i<c.cycles.length; i++) {
                  if (c.cycles[i]!=cycleSet) {
                    return false;
                  }
                }
              }
            }
          // check for non-cycleSet cycles
            return true;
          })()) {
          softRecycle();
          randomizeCurves();
        } else {
	  randomizeCycles();
	  halts.sync=false;
          randomizeCurves();
        }
        curveTransition.synced=true;
//} else {
//debugger;
      }
/*
      for (let c of curves) {
	if (c.cstate==STD) {
	  c.randomizeCurve();
	  c.active=true;
	}
      }
*/
      requestAnimationFrame(animate);
    }
  }
}

function init() {
  zoom.randomize();
  shiftStops();
  randomizeCurves();
/*
  for (c of curves) {
    if (c.cstate==STD) {
      c.randomizeCurve();
    }
  }
*/
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
      if (c.cstate==STD) {
        c.randomizeCurve();
        c.active=true;
        c.start=0;
      }
    }
    document.querySelector('#ss').textContent='Stop';
    document.querySelector('#onoff').innerHTML='&#10679;';
    requestAnimationFrame(animate);
  } else {
    if (halts.stop) {
      halts.stopNow=true;
    } else {
      halts.stop=true;
      document.querySelector('#ss').textContent='Stopping';
    }
  }
}

function park() {
  stopped=true;
  document.querySelector('#ss').textContent='Start';
  document.querySelector('#onoff').innerHTML='&#10687;';
}

function changeDuration(si) {
  animateDuration=si.value*1000;
  document.getElementById('durRep').textContent=si.value+'s';
}

function changeRotation(si) {
  rotationFactor=si.value;
  document.getElementById('rotRep').textContent=(si.value*100).toFixed(0)+'%';
}

/*
function changeDamp(si) {
  curveChangeRate=si.value;
}
*/

function inputCurveCount(si) {
  document.getElementById('ccRep').textContent=si.value;
  if (isAActive()) {
    document.getElementById('kCount').checked=true;
    curveCountLock=true;
//    switchCurveCount(parseInt(si.value));
  } else {
//    changeCurveCount(parseInt(si.value));
  }
  changeCurveCount(parseInt(si.value));
}

function lockCurveCount(cb) {
  if (cb.checked) {
    curveCountLock=true;
  } else {
    curveCountLock=false;
  }
}

function inputCurveCycles(si) {
  document.getElementById('cvRep').textContent=si.value;
  cycleSet=parseInt(si.value);
  resetCycleSet();
  if (isAActive()) {
    if (fillColor.fstate==GRAD || fillColor.fstate==TOGRAD) {
      cycleLock=true;
      document.getElementById('kCycle').checked='checked';
    }
  }
  for (c of curves) {
//    if (c.cstate!=ZERO) {
    c.setCurve();
    c.fromData=c.toData.slice();
    if (c.cstate==STD) {
//      c.setCurve();
//      c.fromData=c.toData.slice();
      c.randomizeCurve();
    }
  }
  drawCurves();
}

function lockCurveCycles(cb) {
  if (cb.checked) {
    cycleLock=true;
  } else {
    cycleLock=false;
  }
}

function changeFillHue(inp) {
  fillColor.toFillHSL[0]=parseInt(inp.value);
  document.getElementById('hueRep').textContent=inp.value;
  var col=fillColor.getHSLString();
  document.querySelectorAll('.fillCol').forEach(function(hdiv) {
    hdiv.style.backgroundColor=col;
  });
  path.style.fill=fillColor.getHSLString();
  if (isAActive()) {
    document.getElementById('kHue').checked=true;
    fillColor.lock=true;
    fillColor.active=false;
  } else {
///
    drawCurves();
  }
}

function lockHue(cb) {
  if (cb.checked) {
    fillColor.lock=true;
    fillColor.active=false;
  } else {
    fillColor.lock=false;
    fillColor.active=true;
  }
}

/*
function resetScale() {
  var rescale=zoom.scale/zoom.fromScale;
  for (var cn=0; cn<curveCount; cn++) {
    for (var i=0; i<curves[cn].radiiCount+1; i++) {
      curves[cn].radii[i]*=rescale;
    }
    curves[cn].setCurve();
  }
  drawCurves();
}

function inputZoom(inp) {
  zoom.fromScale=zoom.scale;
  zoom.scale=parseFloat(inp.value);
  document.getElementById('zoomRep').textContent=(inp.value*100).toFixed(0)+'%';
  zoom.active=false;
  if (isAActive()) {
    document.getElementById('kScale').checked=true;
    zoom.lock=true;
  } else {
    resetScale();
  }
}

function lockScale(cb) {
  if (cb.checked) {
    zoom.lock=true;
  } else {
    zoom.lock=false;
  }
}
*/

//////////

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
//checkToStops();
  insertStop();
  deleteStop();
  for (let i in stops) {
    stops[i].number=i;
    stops[i].shiftProperties();
    if (i==stops.length-1) {
//      if (fillColor.fstate==FADEIN) {
      if (stops[i].signal) {
        fillColor.fstate=GRAD;
        fillColor.fillDuration=animateDuration;
        stops[i].signal=false;
      }
    }
  }
if (fillColor.fstate==TOSOLID) {
  fillColor.fillDuration=Math.max(500, fillColor.fillDuration*.7);
} else if (fillColor.fstate==TOGRAD) {
  fillColor.fillDuration=Math.min(animateDuration, fillColor.fillDuration/.7);
}
//checkFromStops();
//log('shift stops');
}

var gradient=document.querySelector('#phsRG');

function getSO(count) {
  let sa=[[0,1]];
  if (count==1) {
    return sa;
  } else if (count==2) {
    sa.push([1,1]);
    return sa;
  } else if (count==3) {
    sa.push([.5,.5]);
    sa.push([1,0]);
    return sa;
  } else {
    let seg=1/(count-2);
    for (let i=1; i<count-2; i++) {
      let nos=0.18*Math.pow(seg*i,2)+0.85*seg*i;
      sa.push([nos,1-Math.pow(seg*i,5)]);
    }
    sa.push([1,0]);
    sa.push([1,0]);
  }
  return sa;
}

function getSOX(count) {
  let sa=[[0,1]];
  let seg=1/(count-1);
  for (let i=1; i<count-1; i++) {
    let nos=0.18*Math.pow(seg*i,2)+0.85*seg*i;
    sa.push([nos,1-Math.pow(seg*i,5)]);
  }
  sa.push([1,0]);
  sa.push([1,0]);
  return sa;
}

var MAX_STOP_COUNT=5;
var so=getSO(MAX_STOP_COUNT);
var stops=[];

for (let i in so) {
  let stopx=new Stop(i,[so[i][0],0]);
  stops.push(stopx);
  gradient.appendChild(stopx.el);
}
stops[0].signal=true;

function insertStop() {
  stops.unshift(new Stop(0,[0,1]));
  stops[0].state='zero';
  stops[1].state='active';  // maybe 'rest'
  gradient.insertBefore(stops[0].el, gradient.firstChild);
  if (fillColor.fstate==TOSOLID) {
    stops[0].fromHSL=stops[1].fromHSL;
    stops[0].toHSL=stops[1].toHSL;
    stops[0].el.setAttribute('stop-color',stops[1].getHSLString());
  }
  // set position flags here
}

function deleteStop() {
//log('deleting stop');
  gradient.removeChild(gradient.lastElementChild);
  stops.pop();
}

function increaseStops() { }

//////////

function setMenu(menu,on) {
  if(on) {
    menu.dataset.state='1';
    menu.title='hide';
  } else {
    menu.dataset.state='0';
    menu.title='show';
  }
  menu.childNodes.forEach(function(n) {
    if (n.tagName=='SPAN') {
      if (on) {
        n.style.transform='rotate(90deg)';
      } else {
        n.style.transform='rotate(0deg)';
      }
    }
  });
}

function checkMenus() {
  var stat=0;
  var props=document.querySelectorAll('.pmenu');
  props.forEach(function(m) {
    stat+=parseInt(m.dataset.state);
  });
  if (stat==0) {
    setMenu(document.getElementById('mainmenu'),false);
  } else if (stat==3) {
    setMenu(document.getElementById('mainmenu'),true);
  }
}

function menuAnimate(timestamp, mdata) {
  if (!mdata.start) mdata.start=timestamp;
  var progress = timestamp - mdata.start;
  var frac=progress/400;
  if (mdata.open) {
    mdata.divstyle.height=Math.min(frac*mdata.ht, mdata.ht) + 'px';
    mdata.divstyle.width=Math.min(120+frac*(mdata.wd-120), mdata.wd) + 'px';
  } else {
    mdata.divstyle.height=mdata.ht-Math.min(frac*mdata.ht, mdata.ht) + 'px';
    var mWidth=mdata.wd-(mdata.wd-120)*frac;
    mdata.divstyle.width=mWidth+'px';
  }
  if (progress<400) {
    requestAnimationFrame(function(ts) { menuAnimate(ts,mdata); });
  } 
}

function togAll(tb) {
  var props=document.querySelectorAll('.pmenu');
  if (tb.dataset.state=='0') {
    props.forEach(function(m) {
      if (m.dataset.state=='0') {
        togMenu(m,true);
      }
    });
    setMenu(tb,true);
  } else {
    props.forEach(function(m) {
      if (m.dataset.state=='1') {
        togMenu(m,false);
      }
    });
    setMenu(tb,false);
  }
}

function togMenu(menu,show) {
  var cd=document.getElementById('cdiv'+menu.dataset.con);
  var ti=document.getElementById('props'+menu.dataset.con);
  var ww=window.innerWidth;
  var mdata={"start":null,"divstyle":cd.style,"ht":ti.offsetHeight,"wd":ti.offsetWidth,"ww":ww};
  if (arguments.length==1) {
    if (menu.dataset.state=='0') { 
      mdata.open=true;
      requestAnimationFrame(function(ts) { menuAnimate(ts,mdata); });
      setMenu(menu,true);
    } else {
      mdata.open=false;
      requestAnimationFrame(function(ts) { menuAnimate(ts,mdata); });
      setMenu(menu,false);
    }
    //checkMenus();
  } else {
    mdata.open=show;
    requestAnimationFrame(function(ts) { menuAnimate(ts,mdata); });
    setMenu(menu,show);
  }
}

onresize();

init();

function crep() {
  let s={'active':[],'cycles':[],'state':[],'radcnt':[],'radii':[]};
  let u='';
  for (let cur of curves) { 
    s.active.push(cur.active);
    s.cycles.push(cur.cycles.toString());
    s.state.push(['ZERO','TOZERO','STD'][cur.cstate]);
    s.radcnt.push(cur.radiiCount);
    s.radii.push(((c)=>{
      let rint=[];
      for (let i=0; i<c.radiiCount+1; i++) {
        rint.push(c.radii[i].toFixed(0));
      }
      return rint.toString();
    })(cur));
  }
  console.table(s);
}

function srep2(c) {
  if (c !=undefined) {
    console.log('from '+c)
  }
  let s='';
  let to='';
  let fr='';
  let ops=''
  for (let i in stops) { 
    s+=' '+stops[i].state;
    let tv=parseFloat(stops[i].toOpacity).toFixed(3);
    to+=' '+tv;
    let fo=parseFloat(stops[i].fromOpacity).toFixed(3);
    fr+=' '+fo;
    let op=parseFloat(stops[i].el.getAttribute('stop-opacity')).toFixed(3);
    ops+=' '+op
  }
  console.log('stop - '+s);
  console.log('  to - '+to);
  console.log('from - '+fr);
  console.log('elop - '+ops);
  ops='';
  let ss=gradient.getElementsByTagName('stop');
  for (let ele of ss) {
    let rep=parseFloat(ele.getAttribute('stop-opacity')).toFixed(3);
    ops+=' '+rep;
  }
  console.log('elem - '+ops);
}

function srep(c) {
  if (c !=undefined) {
    console.log('from '+c)
  }
  let s='';
  let o='';
  let x='';
  for (let stop of stops) { 
    s+=' '+stop.state;
    o+=' '+stop.toOpacity;
    x+=' '+stop.toOffset;
  }
  console.log(' '+s);
  console.log('**toOpacity** '+o);
  console.log('**toOffset ** '+x);
  let col=''
  let ops=''
  let rep=''
  let ss=gradient.getElementsByTagName('stop');
  for (let ele of ss) {
    //rep+=' '+parseFloat(ele.getAttribute('offset')).toFixed(3);
    col+=' '+ele.getAttribute('stop-color');
    ops+=' '+ele.getAttribute('stop-opacity');
    rep+=' '+ele.getAttribute('offset');
  }
  console.log('- '+col);
  console.log('- '+ops);
  console.log('- '+rep);
}

function checkFromStops() {
  let log='FOX';
  let mismatch=false;
  for (let i in stops) {
    let d=Math.abs(stops[i].fromOpacity-stops[i].el.getAttribute('stop-opacity'));
    if (d>.01) {
      console.log('fromis '+i+' ele: '+stops[i].el.getAttribute('stop-opacity')+' stop: '+stops[i].fromOpacity);
      mismatch=true;
    }
  }
  if (mismatch) {
    srep2();
//console.log('BAD');
    debugger;
  }
}

function checkSOStops() {
  for (let i=0; i<stops.length; i++) {
    if (stops[i].toOpacity!=so[i][1]) {
alert('so');
    }
  }
}

function checkToStops() {
  let ss=gradient.getElementsByTagName('stop');
  let log='TT';
  let mismatch=false;
  for (let i=0; i<stops.length; i++) {
    let d=Math.abs(stops[i].toOpacity-ss.item(i).getAttribute('stop-opacity'));
    if (d>.01) {
      console.log('tomisp '+i+' ele: '+ss.item(i).getAttribute('stop-opacity')+' stop: '+stops[i].toOpacity);
      mismatch=true;
    }
    log+=' '+stops[i].toOpacity;
  }
  console.log(log);
  if (mismatch) {
    srep2();
    debugger;
  }
}

function checkFromCurves() {
  let cd='';
  for (let c of curves) {
    if (c.active) {
      cd+=c.lineFromData();
    }
  }
  let ad=path.getAttribute('d');
  if (cd!==ad) {
    debugger;
  }
}

var logging=false;	// publish @ false
function log(e) {
  if (logging) {
    console.log(e);
  }
}
