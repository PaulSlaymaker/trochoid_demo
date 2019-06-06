var CSIZE=300;
var canvas=document.querySelector('#cta');
onresize=function() {
  canvas.style.maxHeight=window.innerHeight-20+'px';
}
var ctx=canvas.getContext('2d');
ctx.translate(CSIZE,CSIZE);

//ctx.fillStyle='hsla(0,0%,0%,.01)';
//ctx.fillStyle='hsla(0,80%,80%,.3)';
ctx.fillStyle='hsla(10,80%,50%,1)';
ctx.strokeStyle='hsl(120,100%,60%)';
ctx.lineJoin='round';

var mode='EACH';

var atten=0.04;

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

var stopped=true;
var stopNow=false;
var lock=false;

var cycleSet=3;

function getCycle0Match() {
  switch (cycleSet) {
    case 2:
      return [1,3,5,7,9,11,13,15,17,19][getRandomInt(0,10,4)];
    case 3:
      return [1,2,4,5,7,8,10,11,13,14,16,17,19][getRandomInt(0,13,4)];
    case 4:
      return [1,3,5,7,9,11,13,15,17,19][getRandomInt(0,10,4)];
///////////////////////////
    case 5:
      return [1,2,3,4,6,7,8,9,11,12,13,14,16,17,18][getRandomInt(0,15,3)];
    case 7:
      return [1,2,3,4,5,6,8,9,10,11,12,13,15,16,17,18][getRandomInt(0,16,3)];
    case 8:
      return [1,3,5,7,9,11,13,15,17][getRandomInt(0,9,3)];
    case 9:
      return [1,2,4,5,7,8,10,11,13,14,16,17][getRandomInt(0,12,3)];
    case 10:
      return [1,3,7,9,11,13,17][getRandomInt(0,7,2)];
    case 11:
      return [1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18][getRandomInt(0,17,2)];
    case 6:
    case 12:
      return [1,5,7,11,13,17][getRandomInt(0,6,2)];
    case 13:
      return [1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18][getRandomInt(0,17,2)];
    case 14:
      return [1,3,5,9,11,13,15,17][getRandomInt(0,8)];
    case 15:
      return [1,2,4,7,8,11,13,14,16,17][getRandomInt(0,10)];
    case 16:
      return [1,3,5,7,9,11,13,15,17][getRandomInt(0,9)];
    case 17:
      return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18][getRandomInt(0,17)];
    case 18:
      return [1,5,7,11,13,17][getRandomInt(0,6)];
    case 19:
      return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18][getRandomInt(0,18)];
  }
  debugger;
  return false;
}

var Roulette=function(ro) {
  if (ro instanceof Roulette) {
/*
    for (var attr in ro) {
      if (ro.hasOwnProperty(attr)) this[attr]=ro[attr];
    }
*/
    Object.assign(this, ro);
  } else {
    this.dz=1;
    this.type=-1;
    this.type2=-1;
    this.type3=-1;
    this.type4=-1;
    this.c0=2;
    this.c1=3;
    this.c2=3;
    this.c3=3;
    this.c4=3;
    this.r1=60;
    this.r2=80;
    this.r3=40;
    this.r4=20;
    this.r5=10;
    this.radiiCount=2;
//    this.central=true;
  }
  let rself=this;
  this.randomizeCycles=function() {
    cycleSet=getRandomInt(4,20);
    rself.c1=rself.setCycles();
    rself.c2=rself.setCycles();
    rself.c3=rself.setCycles();
    rself.c4=rself.setCycles();
    rself.c0=getCycle0Match();
  }
  this.setCycles=function() {
    if (cycleSet==5) {
      return [5,10,15][getRandomInt(0,3)];
    } else if (cycleSet==6) {
      return [6,12,18][getRandomInt(0,3)];
    } else if (cycleSet==8) {
      return [2,4,8,16][getRandomInt(0,4)];
    } else if (cycleSet==9) {
      return Math.random()<0.5?3:9;
    } else if (cycleSet==10) {
      //return Math.random()<0.05?5:10;
      return [5,10][getRandomInt(0,2)];
    } else if (cycleSet==12) {
      //return Math.random()<0.1?6:12;
      return [6,12,18][getRandomInt(0,3)];
    } else if (cycleSet==14) {
      //return Math.random()<0.2?7:14;
      return Math.random()<0.5?7:14;
    } else if (cycleSet==16) {
      //return Math.random()<.3?Math.random()<.1?4:8:16;
      return [2,4,8,16][getRandomInt(0,4)];
    } else {
      return cycleSet;
    }
  }
  this.randomCentralRadii=function() {
    //rself.radiiCount=Math.random()<.5?2:3;
    rself.radiiCount=[2,3,4,5][getRandomInt(0,4)];
    if (rself.radiiCount==5) {
      rself.r1=60-10*Math.random();
      rself.r2=60-10*Math.random();
      rself.r3=60-10*Math.random();
      rself.r4=60-10*Math.random();
      rself.r5=60-10*Math.random();
    } else if (rself.radiiCount==4) {
      rself.r1=70-20*Math.random();
      rself.r2=70-20*Math.random();
      rself.r3=70-20*Math.random();
      rself.r4=70-20*Math.random();
      rself.r5=0;
    } else if (rself.radiiCount==3) {
      rself.r1=90-30*Math.random();
      rself.r2=90-30*Math.random();
      rself.r3=90-30*Math.random();
      rself.r4=0;
      rself.r5=0;

/*
  let rr=210+70*Math.random();  // sum of radii from 210-280
  let rx=rr/2+(20-40*Math.random());
  if (rx<rr/2) {
    rself.r1=rx;
    rself.r2=(rr-rx)*Math.random();
  } else {
    rself.r1=rx*Math.random();
    rself.r2=rx-rself.r1;
  }
  rself.r3=rr-rself.r2-rself.r1;
*/

    } else {
      rself.r3=0;
      rself.r4=0;
      rself.r5=0;
//      if (rself.central) {
	let rr=210+70*Math.random();  // sum of radii from 210-280
	let rd=30-60*Math.random();
	rself.r1=(rd+rr)/2;
	rself.r2=(rr-rd)/2;
/*
      } else {
	let rr=160+80*Math.random();  // sum of radii from 160-240
	//rself.r1=rr*Math.random();
	rself.r1=(rr+rr*Math.random())/2;
	rself.r2=rr-rself.r1;
      }
*/
    }
  }

  this.getMetrics=function(frac, n) {
    let z=rself.dz*frac*2*Math.PI+n*2*Math.PI/orb.pts;
    let f1=1+(rself.type*rself.c1)/rself.c0;
    let f2=rself.radiiCount>2
      ?1+(rself.type*rself.c1+rself.type2*rself.c2)/rself.c0
      :1;
    let f3=rself.radiiCount>3
      ?1+(rself.type*rself.c1+rself.type2*rself.c2+rself.type3*rself.c3)/rself.c0
      :1;
    let f4=1;
    var x,y,ofrac;
    switch (rself.radiiCount) {
      case 2:
	x=rself.r1*Math.cos(z)+rself.r2*Math.cos(f1*z);
	y=rself.r1*Math.sin(z)+rself.r2*Math.sin(f1*z);
	ofrac=Math.pow(x*x+y*y,0.5)/(rself.r1+rself.r2);
	//return {x:x,y:y,fracRad:ofrac};
        break;
      case 3:
        //f2=1+(rself.type*rself.c1+rself.type2*rself.c2)/rself.c0;
	x=rself.r1*Math.cos(z)+rself.r2*Math.cos(f1*z)+rself.r3*Math.cos(f2*z);
	y=rself.r1*Math.sin(z)+rself.r2*Math.sin(f1*z)+rself.r3*Math.sin(f2*z);
	ofrac=Math.pow(x*x+y*y,0.5)/(rself.r1+rself.r2+rself.r3);
        break;
      case 4:
        //f2=1+(rself.type*rself.c1+rself.type2*rself.c2)/rself.c0;
        //f3=1+(rself.type*rself.c1+rself.type2*rself.c2+rself.type3*rself.c3)/rself.c0;
	x=rself.r1*Math.cos(z)+rself.r2*Math.cos(f1*z)+rself.r3*Math.cos(f2*z)+rself.r4*Math.cos(f3*z);
	y=rself.r1*Math.sin(z)+rself.r2*Math.sin(f1*z)+rself.r3*Math.sin(f2*z)+rself.r4*Math.sin(f3*z);
	ofrac=Math.pow(x*x+y*y,0.5)/(rself.r1+rself.r2+rself.r3+rself.r4);
        break;
      case 5:
        //f2=1+(rself.type*rself.c1+rself.type2*rself.c2)/rself.c0;
        //f3=1+(rself.type*rself.c1+rself.type2*rself.c2+rself.type3*rself.c3)/rself.c0;
        f4=1+(rself.type*rself.c1+rself.type2*rself.c2+rself.type3*rself.c3+rself.type4*rself.c4)/rself.c0;
        x=rself.r1*Math.cos(z)+rself.r2*Math.cos(f1*z)+rself.r3*Math.cos(f2*z)+rself.r4*Math.cos(f3*z)+rself.r5*Math.cos(f4*z);
        y=rself.r1*Math.sin(z)+rself.r2*Math.sin(f1*z)+rself.r3*Math.sin(f2*z)+rself.r4*Math.sin(f3*z)+rself.r5*Math.sin(f4*z);
	ofrac=Math.pow(x*x+y*y,0.5)/(rself.r1+rself.r2+rself.r3+rself.r4+rself.r5);
        break;
      default:
        debugger;
    }
    return {x:x,y:y,fracRad:ofrac};
  }
}

Roulette.prototype.randomizeTypes=function() {
  this.type=[-1,1][getRandomInt(0,2)];
  this.type2=[-1,1][getRandomInt(0,2)];
  this.type3=[-1,1][getRandomInt(0,2)];
  this.type4=[-1,1][getRandomInt(0,2)];
}

var roul=new Roulette({});

function getDur2(or) {
  if (transition.path=='C') {
    return 600;
  } else if (transition.path=='N_to_R') {
    return 0.7*or.duration;
  } else if (transition.path=='R_to_N') {
    return 0.7*or.duration;
  } else {
    return or.duration;
  }
}

var Orb=function(or) {
  if (or instanceof Orb) {
/*
    for (var attr in or) {
      if (or.hasOwnProperty(attr)) this[attr]=or[attr];
    }
*/
    Object.assign(this, or);
  } else {
    this.pts=20;
    this.maxPoints=50;
    this.radius=20;
    this.radiusMode='EXP';  // expand, contract, none, TODO, etc.
    this.hue=10;
    this.huediff=10;
    this.duration=40000;
    //this.dur=2000;
//sqrt
    this.dur=9000;
//erif
    //this.dur=1600;
    this.start=0;
  }
  let pself=this;
  this.getDur=function() {
    if (transition.path=='C') {
      return 600;
//let x=pself.pts*pself.dur/(0.012+.0095*roul.c0-.0019*roul.c1);
//return pself.pts*pself.dur/(0.012+.0095*roul.c0-.0019*roul.c1);
    } else if (transition.path=='N_to_R') {
/*
      if (pself.frac>0.7) {
        return 0.3*pself.duration;
      } else {
        return 0.7*pself.duration;
      }
*/
      return 0.7*pself.duration;
      //return Math.pow(1-pself.frac,2)*pself.duration;
/*
      if (Math.abs(pself.frac-.5)<0.48) {
        return (1-pself.frac)*pself.duration+pself.frac*4000;
      } else {
        return pself.duration;
      }
*/
    } else if (transition.path=='R_to_N') {
        //return 0.7*pself.pts*pself.dur;
//return 0.7*Math.pow(pself.pts,0.5)*pself.dur;
      return 0.7*pself.duration;
      //return pself.frac*pself.duration+(1-pself.frac)*5000;
    } else {
        //return pself.pts*pself.dur*(0.012+.0095*roul.c0-.0019*roul.c1);
//return pself.pts*pself.dur;
//return Math.pow(pself.pts,0.5)*pself.dur;
      return pself.duration;
    }
  }
  this.draw=function() {
    if (mode=='EACH') {
      pself.drawEach(0,1);
    } else {
      pself.drawAll(1);
    }
  }
  this.setDuration=function() {
    pself.duration=Math.pow(pself.pts,0.5)*pself.dur;
  }
  this.setPoints=function(ro) {
    let ct=0;
    do {
      //ct=Math.round((12+10*Math.random())/ro.c0);
      //ct=Math.round((10+(maxPoints-10)*Math.random())/ro.c0);
      let pmin=Math.round(pself.maxPoints/4);
      ct=Math.round((pmin+(pself.maxPoints-pmin)*Math.random())/ro.c0);
      //ct=Math.round((+(maxPoints-10)*Math.random())/ro.c0);

      //ct=Math.round((10+20*Math.random())/ro.c0);
    } while (ct%ro.c1==0);
    pself.pts=ct;
    pself.setDuration();
    return ct;
  }
  this.randomizeRadius=function(ro) {
    pself.radiusMode=['EXP','EXP','CON','CON',''][getRandomInt(0,5)];
    if (pself.radiusMode=='EXP') {
      let d=Math.abs(ro.r1-ro.r2);
      pself.radius=d>24?24:d<12?12:d;
      //pself.radius=Math.max(Math.abs(ro.r1-ro.r2), 10);
    } else if (pself.radiusMode=='CON') {
      pself.radius=Math.max(0.7*Math.abs(ro.r1-ro.r2), 10);
    } else {
      //pself.radius=Math.max(Math.abs(ro.r1-ro.r2), 8);
      pself.radius=4+10*Math.random();
    }
  }
  this.getRadius=function(fracRad) {
    if (pself.radiusMode=='EXP') {
      //let f=Math.max(0,Math.sin(fracRad*Math.PI/2));
      let f=Math.max(0,1-Math.cos(fracRad*Math.PI/2));
      return f*pself.radius;
      //return pself.radius*fracRad;  // zero min
    } else if (pself.radiusMode=='CON') {
      //let f=Math.max(0,1-fracRad);
      let f=Math.max(0,Math.cos(fracRad*Math.PI/2));
      //return Math.max(0,pself.radius*(1-fracRad));
      return f*pself.radius;
    } else {
      return pself.radius;  // zero min
    }
  }
  this.getHue=function(fracRad) {
      // trig?
    return (pself.huediff*fracRad+pself.hue)%360;
  }
  this.getLum=function(fracRad) {
      // trig?
    if (pself.radiusMode=='EXP') {
      //return 95*(1-fracRad);
      return 95*Math.pow(1-fracRad,0.5);
    } else {
      return 50+45*(1-fracRad);
    }
  }
  this.getOpacity=function(fracRad) {
    if (pself.radiusMode=='EXP') {
      return Math.pow(1-fracRad,0.5);
    } else {
      return 1;
    }
  }

// this one is used
  this.drawEach=function(ts, frac) {
    //ctx.fillStyle='hsla(0,0%,0%,.024)';
    if (stopped) {
      ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    } else {
      ctx.fillStyle='hsla(0,0%,0%,'+atten+')';
      ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    }
    let pointCount=pself.pts*roul.c0;
    for (let i=0; i<pointCount; i++) {
      ctx.beginPath();
      let metrics=transition.getMetricsX(ts, frac, i);
      let oradius=transition.getRadius(metrics.fracRad, frac);
if (oradius>50) {
  log('orad: '+oradius);
  oradius=50;
}
      ctx.arc(metrics.x,metrics.y,oradius,0,2*Math.PI);
      ctx.fillStyle='hsla('+
        transition.getHue(metrics.fracRad, frac)+',90%,'+
        transition.getLum(metrics.fracRad, frac)+'%,'+
        transition.getOpacity(metrics.fracRad, frac)+')';
      ctx.fill();
      ctx.closePath();
    }
  }

/*
  this.drawEachO=function(ts, frac) {
//    ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    //ctx.fillStyle='hsla(0,0%,0%,.01)';
    ctx.fillStyle='hsla(0,0%,0%,.015)';
    ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    //let z=frac*2*Math.PI;
    //let inc=2*Math.PI/pself.pts;
    //for (let i=0; i<pself.pts; i++) {
//let dir=1;
    let pointCount=pself.pts*roul.c0;
    for (let i=0; i<pointCount; i++) {
      //let x=roul.r1*Math.cos(z)+roul.r2*Math.cos(f1*z);
      //let y=roul.r1*Math.sin(z)+roul.r2*Math.sin(f1*z);
//      for (let ro of rouls) {
      ctx.beginPath();
      let metrics=transition.getMetricsX(ts, frac, i);
let oradius=transition.getRadius(metrics.fracRad, frac);
        ctx.arc(metrics.x,metrics.y,oradius,0,2*Math.PI);
	ctx.fillStyle='hsla('+transition.getHue(metrics.fracRad, frac)+',90%,'+
          transition.getLum(metrics.fracRad, frac)+'%,'+transition.getOpacity(metrics.fracRad, frac)+')';
        ctx.fill();
        ctx.closePath();
    }
  }
  this.drawAll=function(frac) {
    ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//ctx.fillStyle='hsla(0,0%,0%,.01)';
//ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    let f1=1+(roul.type*roul.c1)/roul.c0;
    let z=frac*2*Math.PI;
    let inc=2*Math.PI/pself.pts;
      ctx.beginPath();
    for (let i=0; i<pself.pts*roul.c0; i++) {
      z+=inc;
      let x=roul.r1*Math.cos(z)+roul.r2*Math.cos(f1*z);
      let y=roul.r1*Math.sin(z)+roul.r2*Math.sin(f1*z);
      ctx.moveTo(x+pself.radius,y);
      ctx.arc(x,
	//roul.r1*Math.cos(z)+roul.r2*Math.cos(f1*z),
	roul.r1*Math.sin(z)+roul.r2*Math.sin(f1*z),
        pself.radius,
        0,2*Math.PI
      );
    }
    ctx.closePath();
//ctx.fillStyle='hsla(10,80%,50%,1)';
    ctx.fill('evenodd');
    //ctx.stroke();
  }
*/
}

var transition={
  active:false,  // deprecate, always active, use NOOP
  start:0,
  toRo:new Roulette({}),
  toOrb:new Orb({}),
  tDur:6000,
  frac:0,
  path:'N_to_N',
  enter:function(ts) {
    if (!this.start) {
      this.start=ts;
      this.startTransition();
    }
    let progress=ts-this.start;
    if (progress<this.getDuration()) {
      this.frac=progress/this.getDuration();
    } else {
      this.start=0;
      this.endTransition();
    }
  },
  startTransition:function() {
//log('start');
    this.toRo=new Roulette(roul);
    this.toOrb=new Orb(orb);
//checkRoul('pre new set');
    if (this.path=='N_to_N') {
      if (Math.random()<0.6) {
//stack();
        this.setNtoR();
      } else {
        this.setNtoN();
      }
    } else if (this.path=='N_to_R') {
      this.setC();  // actual set C
    } else if (this.path=='C') {
      this.setNtoN();
      this.path='R_to_N';
    } else if (this.path=='R_to_N') {
      this.setNtoN();
    }
    this.active=true;
setTable();
  },
  setNtoN:function() {
log('N_to_N');
    this.toRo.dz=[-1,1][getRandomInt(0,2)];
    this.toRo.randomizeTypes();
    //if (Math.random()<0.7) this.toRo.central=!this.toRo.central;
    this.toRo.randomCentralRadii();
    this.toOrb.randomizeRadius(this.toRo);
    this.toOrb.hue=getRandomInt(0,360);
    this.toOrb.huediff=getRandomInt(0,180);
    this.path='N_to_N';
  },
  setNtoR:function() {
log('N_to_R');
    this.toRo.dz=[-1,1][getRandomInt(0,2)];
    this.toRo.randomizeTypes();
    this.toRo.r1=80+160*Math.random();
    this.toRo.r2=0;
    this.toRo.r3=0;
    this.toRo.r4=0;
    this.toRo.r5=0;
    this.toOrb.radiusMode='';
    this.toOrb.radius=2+(this.toRo.r1-40)/20;
    this.path='N_to_R';
  },
  setC:function() {
log('C');
    this.toRo.randomizeCycles();
    //this.toRo.randomCentralRadii();
    this.toOrb.setPoints(this.toRo);
/*
    this.toOrb.hue=getRandomInt(0,360);
    this.toOrb.huediff=getRandomInt(0,180);
*/
    this.path='C';
  },
  endTransition:function() {
//log('end trans');
    Object.assign(roul, this.toRo);
    Object.assign(orb, this.toOrb);
    //setControls();
    setTable();
    this.active=false;
    this.start=0;
//checkRoul('out');
  },
  isDone:function(ts) {
    if (this.start==0) return true;
    let progress=ts-this.start;
    if (progress>this.getDuration()) return true;
    return false;
  },
  getDuration:function() {
/*
    if (this.path=='C') {
      return this.tDur/50;
    } else {
      return this.tDur;
    }
*/
    //return orb.pts*roul.c0/roul.c1*1900;
    return 0.95*orb.getDur();
  },
  getMetrics:function(dcFrac, tFrac, n) {
    if (this.active) {
      let fromMetrics=roul.getMetrics(dcFrac, n);
      let toMetrics=this.toRo.getMetrics(dcFrac, n);
      return {
        x:tFrac*toMetrics.x+(1-tFrac)*fromMetrics.x,
        y:tFrac*toMetrics.y+(1-tFrac)*fromMetrics.y,
        fracRad:tFrac*toMetrics.fracRad+(1-tFrac)*fromMetrics.fracRad,
      }
    } else {
      return roul.getMetrics(dcFrac, n);
    }
  },

  getMetricsX:function(ts, cfrac, n) {
    if (this.active) {
      if (!this.start) {
        this.start=ts;
      }
      let progress=ts-this.start;
      if (progress<this.getDuration()) {
	var frac=progress/this.getDuration();
        let fromMetrics=roul.getMetrics(cfrac, n);
        let toMetrics=this.toRo.getMetrics(cfrac, n);
	return {
	  x:frac*toMetrics.x+(1-frac)*fromMetrics.x,
	  y:frac*toMetrics.y+(1-frac)*fromMetrics.y,
	  fracRad:frac*toMetrics.fracRad+(1-frac)*fromMetrics.fracRad,
	}
      } else {
        return this.toRo.getMetrics(cfrac, n);
      }
    } else {
      return roul.getMetrics(cfrac, n);
    }
  },

  getRadius:function(fracRad, frac) {
    if (this.active) {
      let fromRad=orb.getRadius(fracRad);
      let toRad=this.toOrb.getRadius(fracRad);
      return Math.max(0,frac*toRad+(1-frac)*fromRad);
    } else {
      return orb.getRadius(fracRad);
    }
  },

  getHue:function(fracRad, frac) {
    if (this.active) {
      let hdiff=frac*this.toOrb.huediff+(1-frac)*orb.huediff;
      let midHue=frac*(this.toOrb.hue-orb.hue)+orb.hue;
      return (hdiff*fracRad+midHue)%360;
/*
      let fromHue=orb.getHue(fracRad);
      let toHue=this.toOrb.getHue(fracRad);
      let hd=frac*(toHue-fromHue);
      return (fromHue+hd)%360;
*/
      //return (frac*this.toOrb.getHue(fracRad)+(1-frac)*orb.getHue(fracRad))%360;
    } else {
      return orb.getHue(fracRad);
    }
  },
  getLum:function(fracRad, frac) {
    if (this.active) {
      return (frac*this.toOrb.getLum(fracRad)+(1-frac)*orb.getLum(fracRad))%360;
    } else {
      return orb.getLum(fracRad);
    }
  },
  getOpacity:function(fracRad, frac) {
    if (this.active) {
      return (frac*this.toOrb.getOpacity(fracRad)+(1-frac)*orb.getOpacity(fracRad))%360;
    } else {
      return orb.getOpacity(fracRad);
    }
  },
  drawEach:function(ts, dcFrac) {
    if (this.active) {
/*
      if (!this.start) {
	this.start=ts;
      }
      let progress=ts-this.start;
      if (progress<this.getDuration()) {
	var tFrac=progress/this.getDuration();
*/
	ctx.fillStyle='hsla(0,0%,0%,.04)';
	ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
	let pointCount=orb.pts*roul.c0;
	for (let i=0; i<pointCount; i++) {
	  ctx.beginPath();
	  let metrics=this.getMetrics(this.frac, dcFrac, i);
	  let oradius=this.getRadius(metrics.fracRad, dcFrac);
          ctx.arc(metrics.x,metrics.y,oradius,0,2*Math.PI);
          ctx.fillStyle='hsla('+ this.getHue(metrics.fracRad, dcFrac)+',90%,'+ this.getLum(metrics.fracRad, this.frac)+'%,'+ this.getOpacity(metrics.fracRad, this.frac)+')';
          ctx.fill();
          ctx.closePath();
        }
/*
      } else {
        this.endTransition();
        this.startTransition();
        this.start=0;
this.drawEach(ts,dcFrac);
      }
*/
    } else {
      this.startTransition();
log('Dubious');
      orb.drawEachNT(dcFrac);
    }
return;

  }
}

function setControls() {
  //curveTypeRanger.setValue(roul.type);
  //cycle0Ranger.setValue(roul.c0);
  //cycle1Ranger.setValue(roul.c1);
  //cycle2Ranger.setValue(roul.c2);
  //cycle3Ranger.setValue(roul.c3);
  //radius1Ranger.setValue(roul.r1);
  //radius2Ranger.setValue(roul.r2);
  //radius3Ranger.setValue(roul.r3);
  //radius4Ranger.setValue(roul.r4);
  //vertexCountRanger.setValue(orb.pts);
  //radiusCRanger.setValue(orb.radius);
}

function setTable() {
  for (let sr of srs) {
    sr.report();
  }
}

function randomizeTo() {
if (lock) return;
  transition.toRo.dz=[-1,1][getRandomInt(0,2)];
  transition.toRo.randomizeTypes();
  transition.toRo.randomizeCycles();
  transition.toRo.randomCentralRadii();
  transition.toOrb.hue=getRandomInt(0,360);
  transition.toOrb.huediff=getRandomInt(0,180);
  transition.toOrb.setPoints(roul);
  transition.toOrb.randomizeRadius(roul);
  //setControls();
  setTable();
}

function randomizeFrom() {
if (lock) return;
  roul.dz=[-1,1][getRandomInt(0,2)];
  roul.randomizeTypes();
  roul.randomizeCycles();
  roul.randomCentralRadii();
  orb.hue=getRandomInt(0,360);
  orb.huediff=getRandomInt(0,180);
  orb.setPoints(roul);
  orb.randomizeRadius(roul);
  //setControls();
  setTable();
}

var TEST=false;

function animate(ts) {
  if (stopNow) {
    stopped=true;
    return;
  }
  if (!orb.start) {
    orb.start=ts;
  }
  let progress=ts-orb.start;
  //let dur=orb.pts*roul.c0*600;
  //let dur=orb.pts*roul.c0/roul.c1*2000;
  let dur=orb.getDur();
//let dur=getDur2(transition.toOrb);
  if (progress<dur) {
  //if (progress<10000) {   // hacked quick transition
    var frac=progress/dur;
orb.frac=frac;
    orb.drawEach(ts, frac);
  } else {
//rReport();
    if (!transition.active) {
//      transition.startTransition();
    } else {
/*
if (transition.isDone(ts)) {
  transition.endTransition();
  transition.startTransition();
}
*/

if (TEST) {
} else {

      if (transition.start!=0) {
        transition.endTransition();
      }
      transition.startTransition();
}

    }
    orb.start=0;
  }
  requestAnimationFrame(animate);
}

function st() {
  if (stopped) {
    orb.start=0;
    stopped=false;
    stopNow=false;
    requestAnimationFrame(animate);
    document.querySelector('#ss').textContent='Stop';
  } else {
    stopNow=true;
    stopped=true;
    document.querySelector('#ss').textContent='Start';
  }
}
canvas.addEventListener("click", st, false);

var orb=new Orb({});

/*ZZZ*/
var SR=function(obj) {
  let row=document.createElement('tr');
  let label=document.createElement('td');
  label.textContent=obj.label;
  row.appendChild(label);
  this.fromTD=document.createElement('td');
  row.appendChild(this.fromTD);
  this.toTD=document.createElement('td');
  row.appendChild(this.toTD);
  document.querySelector('#reptable').appendChild(row);
  this.oc=obj.oc;
  let sself=this;
  this.report=function(s) {
    if (!menu.open) {
      obj.oc(sself.fromTD,sself.toTD);
    }
  }
}
var srs=[
  new SR({
    label:'c0',
    oc:function(ft,tt) {
      ft.textContent=roul.c0;
      tt.textContent=transition.toRo.c0;
    }
  }),
  new SR({
    label:'c1',
    oc:function(ft,tt) {
      ft.textContent=roul.c1;
      tt.textContent=transition.toRo.c1;
    }
  }),
  new SR({
    label:'c2',
    oc:function(ft,tt) {
      ft.textContent=roul.c2;
      tt.textContent=transition.toRo.c2;
    }
  }),
  new SR({
    label:'c3',
    oc:function(ft,tt) {
      ft.textContent=roul.c3;
      tt.textContent=transition.toRo.c3;
    }
  }),
  new SR({
    label:'c4',
    oc:function(ft,tt) {
      ft.textContent=roul.c4;
      tt.textContent=transition.toRo.c4;
    }
  }),
  new SR({
    label:'dz',
    oc:function(ft,tt) {
      ft.textContent=roul.dz;
      tt.textContent=transition.toRo.dz;
    }
  }),
  new SR({
    label:'radii',
    oc:function(ft,tt) {
      ft.textContent=roul.radiiCount;
      tt.textContent=transition.toRo.radiiCount;
    }
  }),
  new SR({
    label:'type1',
    oc:function(ft,tt) {
      ft.textContent=roul.type;
      tt.textContent=transition.toRo.type;
    }
  }),
  new SR({
    label:'type2',
    oc:function(ft,tt) {
      ft.textContent=roul.type2;
      tt.textContent=transition.toRo.type2;
    }
  }),
  new SR({
    label:'type3',
    oc:function(ft,tt) {
      ft.textContent=roul.type3;
      tt.textContent=transition.toRo.type3;
    }
  }),
  new SR({
    label:'type4',
    oc:function(ft,tt) {
      ft.textContent=roul.type4;
      tt.textContent=transition.toRo.type4;
    }
  }),
  new SR({
    label:'r1',
    oc:function(ft,tt) {
      ft.textContent=roul.r1.toFixed(0);
      tt.textContent=transition.toRo.r1.toFixed(0);
    }
  }),
  new SR({
    label:'r2',
    oc:function(ft,tt) {
      ft.textContent=roul.r2.toFixed(0);
      tt.textContent=transition.toRo.r2.toFixed(0);
    }
  }),
  new SR({
    label:'r3',
    oc:function(ft,tt) {
      ft.textContent=roul.r3.toFixed(0);
      tt.textContent=transition.toRo.r3.toFixed(0);
    }
  }),
  new SR({
    label:'r4',
    oc:function(ft,tt) {
      ft.textContent=roul.r4.toFixed(0);
      tt.textContent=transition.toRo.r4.toFixed(0);
    }
  }),
  new SR({
    label:'orbs',
    oc:function(ft,tt) {
      ft.textContent=orb.pts*roul.c0;
      tt.textContent=transition.toOrb.pts*transition.toRo.c0;
    }
  }),
  new SR({
    label:'radius',
    oc:function(ft,tt) {
      ft.textContent=orb.radius.toFixed(0);
      tt.textContent=transition.toOrb.radius.toFixed(0);
    }
  }),
  new SR({
    label:'rMode',
    oc:function(ft,tt) {
      ft.textContent=orb.radiusMode;
      tt.textContent=transition.toOrb.radiusMode;
    }
  }),
];

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

var Ranger=function(obj, rangeInput) {
  this.box=document.createElement('div');
  this.box.className='mb';
  document.querySelector('#ctl').appendChild(this.box);
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
    rself.box.children[2].classList.add('infoc');
    rself.slider.style.opacity=1;
  }
  this.input.onblur=function() {
    rself.box.children[2].classList.remove('infoc');
    rself.slider.style.opacity=0;
  }
  this.input.oninput=function() {
    rself.report();
    if (obj.hasOwnProperty('oninput')) {
      obj.oninput(rself.input.value);
    }
    if (stopped) {
      orb.draw();
    }
  }
}

var speedRanger=new Ranger({
  label:'Speed',
  min:1,
  max:15,
  step:1,
  value:6,
  oninput:function(val) {
    let ndur=60000/parseInt(val);
    transition.toOrb.dur=ndur;
    transition.toOrb.setDuration();
    orb.dur=ndur;
    orb.setDuration();
transition.endTransition();
transition.startTransition();
  }
});

var vertexCountRanger=new Ranger({
  label:'Maximum orbs',
  min:12,
  max:100,
  step:1,
  value:50,
  oninput:function(val) {
    transition.toOrb.maxPoints=parseInt(val);
    orb.maxPoints=transition.toOrb.maxPoints;
    transition.endTransition();
    transition.startTransition();
  }
});

var attenuationRanger=new Ranger({
  label:'Trail attenuation',
  min:0.01,
  max:0.2,
  step:0.005,
  value:0.04,
  oninput:function(val) {
    atten=val;
  }
});

/*
var vertexCountRanger=new Ranger({
  label:'vertices',
  min:2,
  max:60,
  step:1,
  value:20,
  oninput:function(val) {
    orb.pts=parseInt(val);
  }
});

var curveTypeRanger=new Ranger({
  label:'type',
  min:-1,
  max:1,
  step:2,
  value:1,
  oninput:function(val) {
    roul.type=parseInt(val);
  }
});
*/

/*
var cycle0Ranger=new Ranger({
  label:'C0',
  min:1,
  max:20,
  step:1,
  value:2,
  oninput:function(val) {
    roul.c0=parseInt(val);
  }
});

var cycle1Ranger=new Ranger({
  label:'C1',
  min:1,
  max:20,
  step:1,
  value:3,
  oninput:function(val) {
    roul.c1=parseInt(val);
  }
});

var cycle2Ranger=new Ranger({
  label:'C2',
  min:1,
  max:20,
  step:1,
  value:3,
  oninput:function(val) {
    roul.c2=parseInt(val);
  }
});

var cycle3Ranger=new Ranger({
  label:'C3',
  min:1,
  max:20,
  step:1,
  value:3,
  oninput:function(val) {
    roul.c3=parseInt(val);
  }
});

var radius1Ranger=new Ranger({
  label:'R1',
  min:1,
  max:300,
  step:1,
  value:60,
  oninput:function(val) {
    roul.r1=parseInt(val);
  }
});

var radius2Ranger=new Ranger({
  label:'R2',
  min:0,
  max:300,
  step:1,
  value:80,
  oninput:function(val) {
    roul.r2=parseInt(val);
  }
});

var radius3Ranger=new Ranger({
  label:'R3',
  min:0,
  max:300,
  step:1,
  value:80,
  oninput:function(val) {
    roul.r3=parseInt(val);
  }
});

var radius4Ranger=new Ranger({
  label:'R4',
  min:0,
  max:300,
  step:1,
  value:80,
  oninput:function(val) {
    roul.r4=parseInt(val);
  }
});

var radiusCRanger=new Ranger({
  label:'RC',
  min:0,
  max:300,
  step:1,
  value:40,
  oninput:function(val) {
    orb.radius=parseInt(val);
  }
});
*/

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
      vertexCountRanger.report();
      attenuationRanger.report();
      //vertexCountRanger.report();
      //curveTypeRanger.report();
      //cycle0Ranger.report();
      //cycle1Ranger.report();
      //cycle2Ranger.report();
      //cycle3Ranger.report();
      //radius1Ranger.report();
      //radius2Ranger.report();
      //radius3Ranger.report();
      //radiusCRanger.report();
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
}();
/*ZZZ*/

onresize();
if (TEST) {
} else {
randomizeFrom();
transition.startTransition();
}

/*
var I=0;
TEST
Object.assign(roul, stores[I][0]);
Object.assign(orb, stores[I][1]);
*/

//setControls();

st();

function rep() {
  console.log(roul);
}

var logging=true;	// publish @ false
function log(e) {
  if (logging) {
    console.log(Date().substring(16,25)+e);
  }
}

/*
var monitor=function(ts) {
  if (Math.round(ts)%10000<20) {
    log(transition.frac);
  }
  requestAnimationFrame(monitor);
}
requestAnimationFrame(monitor);
*/


function checkRoul(s) {
  if (transition.toRo.type!=roul.type) {
    debugger;
  }
  if (transition.toRo.c0!=roul.c0) {
    debugger;
  }
  if (transition.toRo.c1!=roul.c1) {
    debugger;
  }
}

function rReport() {
  let data={
    'to r1':transition.toRo.r1,'roul.r1':roul.r1
  };
  console.table(data);
}

menu.mbut.onclick();
setTable();

var store=[];

function mark(sp) {
  if (sp==undefined) return;
  //store.push(JSON.stringify([sp, roul, orb]));
  if (roul.r1==0) {
    return 'Zero';
  } else {
    store.push(JSON.stringify([sp, new Roulette(roul), new Orb(orb)]));
    return 'ok';
  }
}

function stack() {
  store.push([new Roulette(roul), new Orb(orb)]);
  if (store.length>10) debugger;
}
