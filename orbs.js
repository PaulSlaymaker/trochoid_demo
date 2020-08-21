const CSIZE=300;
const TP=2*Math.PI;
const EM=location.href.endsWith("em");

const ctx=document.querySelector("#cta").getContext("2d");
ctx.translate(CSIZE,CSIZE);
ctx.rotate(-Math.PI/2);
ctx.fillStyle='hsl(90,80%,80%)';
onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
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

var CS=getRandomInt(4,20);

var Roulette=function(ro) {
  if (ro instanceof Roulette) {
    Object.assign(this, ro);
  } else {
    this.dz=1;
    this.type1=-1;
    this.type2=-1;
    this.type3=-1;
    this.type4=-1;
    this.cycleSet=CS;
    this.c0=1;
    this.c1=8;
    this.c2=16;
    this.c3=2;
    this.c4=4;
    this.r1=100;
    this.r2=80;
    this.r3=40;
    this.r4=40;
    this.r5=20;
    this.radiiCount=2;
    //this.spMin=10;
    this.spMin=12;
    this.spMax=30;
  }
  let rself=this;
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
  this.getMetrics=function(rotFrac, pointFrac){
    //let z=(rotFrac+pointFrac)*2*Math.PI;
    //let z=(rotFrac+pointFrac*rself.c0)*2*Math.PI;
    //let z=(rotFrac+pointFrac)*rself.c0*2*Math.PI;
    let z=rself.dz*(rotFrac+pointFrac)*rself.c0*TP;
    let f1=1+(rself.type1*rself.c1)/rself.c0;
    let f2=rself.radiiCount>2
      ?1+(rself.type1*rself.c1+rself.type2*rself.c2)/rself.c0
      :1;
    let f3=rself.radiiCount>3
      ?1+(rself.type1*rself.c1+rself.type2*rself.c2+rself.type3*rself.c3)/rself.c0
      :1;
    var x,y,oFrac;
    switch(rself.radiiCount) { 
      case 2:
        x=rself.r1*Math.cos(z)+rself.r2*Math.cos(f1*z);
        y=rself.r1*Math.sin(z)+rself.r2*Math.sin(f1*z);
	oFrac=Math.pow(x*x+y*y,0.5)/(rself.r1+rself.r2);
        break;
      case 3:
	x=rself.r1*Math.cos(z)+rself.r2*Math.cos(f1*z)+rself.r3*Math.cos(f2*z);
	y=rself.r1*Math.sin(z)+rself.r2*Math.sin(f1*z)+rself.r3*Math.sin(f2*z);
	oFrac=Math.pow(x*x+y*y,0.5)/(rself.r1+rself.r2+rself.r3);
        break;
      case 4:
	x=rself.r1*Math.cos(z)+rself.r2*Math.cos(f1*z)+rself.r3*Math.cos(f2*z)+rself.r4*Math.cos(f3*z);
	y=rself.r1*Math.sin(z)+rself.r2*Math.sin(f1*z)+rself.r3*Math.sin(f2*z)+rself.r4*Math.sin(f3*z);
	oFrac=Math.pow(x*x+y*y,0.5)/(rself.r1+rself.r2+rself.r3+rself.r4);
        break;
      case 5:
        f4=1+(rself.type1*rself.c1+rself.type2*rself.c2+rself.type3*rself.c3+rself.type4*rself.c4)/rself.c0;
        x=rself.r1*Math.cos(z)+rself.r2*Math.cos(f1*z)+rself.r3*Math.cos(f2*z)+rself.r4*Math.cos(f3*z)+rself.r5*Math.cos(f4*z);
        y=rself.r1*Math.sin(z)+rself.r2*Math.sin(f1*z)+rself.r3*Math.sin(f2*z)+rself.r4*Math.sin(f3*z)+rself.r5*Math.sin(f4*z);
	oFrac=Math.pow(x*x+y*y,0.5)/(rself.r1+rself.r2+rself.r3+rself.r4+rself.r5);
        break;
      default:
    }
    return {x:x,y:y,oFrac:oFrac}
  }
  this.setCycles=function() {
    if (this.cycleSet==4) {
      return [2,4,8,16][getRandomInt(0,4)];
    } else if (this.cycleSet==5) {
      return [5,10,15][getRandomInt(0,3)];
    } else if (this.cycleSet==6) {
      return [6,12,18][getRandomInt(0,3)];
    } else if (this.cycleSet==8) {
      return [2,4,8,16][getRandomInt(0,4)];
    } else if (this.cycleSet==9) {
      return Math.random()<0.5?3:9;
    } else if (this.cycleSet==10) {
      return [5,10][getRandomInt(0,2)];
    } else if (this.cycleSet==12) {
      return [6,12,18][getRandomInt(0,3)];
    } else if (this.cycleSet==14) {
      return [7,14][getRandomInt(0,2)];
    } else if (this.cycleSet==16) {
      return [2,4,8,16][getRandomInt(0,4)];
    } else {
      return this.cycleSet;
    }
  }
  this.softCycle=function() {
    rself.c1=rself.setCycles();
    rself.c2=rself.setCycles();
    rself.c3=rself.setCycles();
    rself.c4=rself.setCycles();
  }
  this.setCycle0Match=function() {
    rself.c0=rself.getCycle0Match();
  }
  this.getCycle0Match=function() {
    switch (rself.cycleSet) {
      case 2:
	return [1,3,5,7,9,11,13,15,17,19][getRandomInt(0,10,4)];
      case 3:
	return [1,2,4,5,7,8,10,11,13,14,16,17,19][getRandomInt(0,13,4)];
      case 4:
	return [1,3,5,7,9,11,13,15,17,19][getRandomInt(0,10,4)];
      case 5:
	return [1,2,3,4,6,7,8,9,11,12,13,14,16,17,18,19][getRandomInt(0,16,3)];
      case 7:
	return [1,2,3,4,5,6,8,9,10,11,12,13,15,16,17,18,19][getRandomInt(0,17,3)];
      case 8:
	return [1,3,5,7,9,11,13,15,17,19][getRandomInt(0,10,3)];
      case 9:
	return [1,2,4,5,7,8,10,11,13,14,16,17,19][getRandomInt(0,13,3)];
      case 10:
	return [1,3,7,9,11,13,17,19][getRandomInt(0,8,2)];
      case 11:
	return [1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19][getRandomInt(0,18,2)];
      case 6:
      case 12:
	return [1,5,7,11,13,17,19][getRandomInt(0,7,2)];
      case 13:
	return [1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19][getRandomInt(0,18,2)];
      case 14:
	return [1,3,5,9,11,13,15,17,19][getRandomInt(0,9)];
      case 15:
	return [1,2,4,7,8,11,13,14,16,17,19][getRandomInt(0,11)];
      case 16:
	return [1,3,5,7,9,11,13,15,17,19][getRandomInt(0,10)];
      case 17:
	return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,19][getRandomInt(0,18)];
      case 18:
	return [1,5,7,11,13,17,19][getRandomInt(0,7)];
      case 19:
	return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18][getRandomInt(0,18)];
    }
    return false;
  }
  this.randomizeCycles=function() {
    rself.cycleSet=getRandomInt(4,20,2);
    rself.c1=rself.setCycles();
    rself.c2=rself.setCycles();
    rself.c3=rself.setCycles();
    rself.c4=rself.setCycles();
    rself.c0=rself.getCycle0Match();
  }
  this.randomizeTypes=function() {
    rself.type1=[-1,1][getRandomInt(0,2)];
    rself.type2=[-1,1][getRandomInt(0,2)];
    rself.type3=[-1,1][getRandomInt(0,2)];
    rself.type4=[-1,1][getRandomInt(0,2)];
  }
  this.randomizeRadiiCount=function() {
    //rself.radiiCount=[2,3,4,5][getRandomInt(0,4,2)];
    //rself.radiiCount=2+Math.round(3*Math.random());
    rself.radiiCount=getRandomInt(2,6);
  }
  this.randomizeRadii=function() {
    //rself.r1=80+160*Math.random();
    if (rself.radiiCount==3) {
      rself.r1=90-30*Math.random();
      rself.r2=90-30*Math.random();
      rself.r3=90-30*Math.random();
      rself.r4=0;
      rself.r5=0;
    } else if (rself.radiiCount==4) {
      rself.r1=70-20*Math.random();
      rself.r2=70-20*Math.random();
      rself.r3=70-20*Math.random();
      rself.r4=70-20*Math.random();
      rself.r5=0;
    } else if (rself.radiiCount==5) {
      rself.r1=60-10*Math.random();
      rself.r2=60-10*Math.random();
      rself.r3=60-10*Math.random();
      rself.r4=60-10*Math.random();
      rself.r5=60-10*Math.random();
    } else {
      rself.r3=0;
      let rr=210+70*Math.random();  // sum of radii from 210-280
      let rd=30-60*Math.random();
      rself.r1=(rd+rr)/2;
      rself.r2=(rr-rd)/2;
      rself.r3=0;
      rself.r4=0;
      rself.r5=0;
    }
  }
  this.controlledCycleChange=function(mod, name) {
    let count=0;
    do {
      mod();
      var sp=rself.getSP();
      if (count++>10) {
//console.log('SP '+name+' exceed');
        return;
      }
    } while (sp<rself.spMin || sp>rself.spMax);
//if (count>5) console.log('SP '+sp+' '+count);
  }
//  this.setPoints=()=>{ this.pts=[]; }
}

var path={
  cycleSet:CS,
  fromRo:new Roulette(),
  toRo:new Roulette(),
  start:0,
  frac:0,
  duration:5000,
  syFactor:1,
  getMetrics:function(rotFrac, pointFrac) {
    let fromMet=this.fromRo.getMetrics(rotFrac, pointFrac);
    let toMet=this.toRo.getMetrics(rotFrac, pointFrac);
    return {
      x:this.frac*toMet.x+(1-this.frac)*fromMet.x,
      y:this.frac*toMet.y+(1-this.frac)*fromMet.y,
      oFrac:this.frac*toMet.oFrac+(1-this.frac)*fromMet.oFrac
    }
  },
  transit:function() {
    Object.assign(this.fromRo, this.toRo);
    this.toRo=new Roulette(this.toRo);
    //let lf=Math.pow(0.1, Math.pow(this.syFactor,2)); //0-5?
    //let mf=Math.pow(0.3, Math.pow(this.syFactor,2)); //0-5?
    //let hf=Math.pow(0.7, Math.pow(this.syFactor,2)); //0-5?
    let lf=0.17;
    let mf=0.4;
    let hf=0.7;

    if (Math.random()<lf) {
      //this.toRo.randomizeCycles();
      this.toRo.controlledCycleChange(this.toRo.randomizeCycles, 'cyc');
    } else { 
      if (Math.random()<mf) {
	//this.toRo.c0=this.toRo.getCycle0Match();
        this.toRo.controlledCycleChange(this.toRo.setCycle0Match, 'c0');
      }
      if (Math.random()<mf) {
	//this.toRo.softCycle();
        this.toRo.controlledCycleChange(this.toRo.softCycle, 'ss');
      }
    }
    if (Math.random()<mf) {
      //this.toRo.randomizeRadiiCount();
      this.toRo.controlledCycleChange(this.toRo.randomizeRadiiCount, 'rrc');
    }
    if (Math.random()<hf) {
      this.toRo.randomizeTypes();
    }
    if (Math.random()<lf) {
      this.toRo.dz=[-1,1][getRandomInt(0,2)];
    }
    this.toRo.randomizeRadii();
  },
}

var Orb=function(or) {
  if (or instanceof Orb) {
    Object.assign(this, or);
  } else {
    this.radius=4+8*Math.random();
    this.radiusMode='';
    this.hue=getRandomInt(0,360);
    this.huediff=getRandomInt(0,180);
    this.atten=0.1;
  }
  this.getRadius=function(fracRad) {
    if (this.radiusMode=='EXP') {
      //let f=Math.max(0,Math.sin(fracRad*Math.PI/2));
      let f=Math.max(0,1-Math.cos(fracRad*Math.PI/2));
      return 1+f*this.radius;
    } else if (this.radiusMode=='CON') {
      //let f=Math.max(0,1-fracRad);
      let f=Math.max(0,Math.cos(fracRad*Math.PI/2));
      //return Math.max(0,pself.radius*(1-fracRad));
      return f*this.radius;
    } else {
      return this.radius;
    }
  }
  this.getLum=function(oFrac, rotFrac) {
    return 50+45*(1-oFrac);
  }
  this.getOpacity=function(oFrac) {
    if (this.radiusMode=='EXP') {
      return Math.pow(1-oFrac,0.5);
    } else {
      return 1;
    }
  }
  this.randomizeRadiusMode=function() {
    this.radiusMode=['EXP','CON',''][getRandomInt(0,3)];
  }
}

const orbs={
  fromOrb:new Orb(),
  toOrb:new Orb(),
  frac:0,
  count:getRandomInt(12,40),
  duration:60000,
  startO:0,
  fracO:0,
  durationO:6000,
  ocTrans:'N',   // N,D,H
  getRadius:function(oFrac, rotFrac) {
    return rotFrac*orbs.toOrb.getRadius(oFrac)+(1-rotFrac)*orbs.fromOrb.getRadius(oFrac);
  },
  getHue:function(oFrac, rotFrac) {
    let hdiff=rotFrac*orbs.toOrb.huediff+(1-rotFrac)*orbs.fromOrb.huediff;
    let midHue=rotFrac*(orbs.toOrb.hue-orbs.fromOrb.hue)+orbs.fromOrb.hue;
    return (hdiff*oFrac+midHue)%360;
  },
  getLum:function(oFrac) {
    //return (rotFrac*orbs.toOrb.getLum(oFrac)+(1-rotFrac)*orbs.fromOrb.getLum(oFrac))%360;
    return 50+45*(1-oFrac);
  },
  getOpacity:function(oFrac, rotFrac) {
    // both orbital and transitional
    return rotFrac*this.toOrb.getOpacity(oFrac)+(1-rotFrac)*this.fromOrb.getOpacity(oFrac);
  },
  getAttenuation:function(rotFrac) {
    return rotFrac*this.toOrb.atten+(1-rotFrac)*this.fromOrb.atten;
  },
  draw:function(rotFrac) {
    //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    //ctx.fillStyle='hsla(0,0%,0%,'+orbs.toOrb.atten+')';
    ctx.fillStyle='hsla(0,0%,0%,'+orbs.getAttenuation(rotFrac)+')';
    ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    for (let i=0; i<orbs.count; i++) {
      ctx.beginPath();
      var pFrac=i/orbs.count;
      //let metrics=path.getMetrics(rotFrac, i/orbs.points);
      let metrics=path.getMetrics(rotFrac, pFrac);
      if (orbs.ocTrans=='T') {
        let tz=Math.pow(orbs.fracO,5);
	let x=(metrics.x)*(1-tz);
	let y=(metrics.y)*(1-tz);
        ctx.arc(x,y,orbs.getRadius(metrics.oFrac, rotFrac),0,TP);
      } else if (orbs.ocTrans=='R') {
        let tz=Math.pow(1-orbs.fracO,5);
	let x=(metrics.x)*(1-tz);
	let y=(metrics.y)*(1-tz);
        ctx.arc(x,y,orbs.getRadius(metrics.oFrac, rotFrac),0,TP);
      } else {
        ctx.arc(metrics.x,metrics.y,orbs.getRadius(metrics.oFrac, rotFrac),0,2*Math.PI);
      }
      ctx.fillStyle='hsla('+
        orbs.getHue(metrics.oFrac, rotFrac)+',90%,'+
        orbs.getLum(metrics.oFrac)+'%,'+
        (stopped?1:orbs.getOpacity(metrics.oFrac, rotFrac))+')';
      ctx.fill();
      ctx.closePath();
    }
  },
  transitCount:function() {
    if (orbs.ocTrans=='N') {
      if (Math.random()<0.7) {
        orbs.ocTrans='T';
      }
    } else if (orbs.ocTrans=='T') {
      orbs.count=getRandomInt(12,120,2);
      orbs.ocTrans='R';
      orbs.transit();
      //orbs.start=0;
      orbs.frac=0;
    } else if (orbs.ocTrans=='R') {
      orbs.ocTrans='N';
    }
  },
  transit:function() {
    Object.assign(this.fromOrb, this.toOrb);
    this.toOrb=new Orb(this.fromOrb);
    this.toOrb.radius=4+8*Math.random();
    this.toOrb.randomizeRadiusMode();
    this.toOrb.hue=getRandomInt(0,360);
    this.toOrb.huediff=getRandomInt(0,180);
    orbs.toOrb.atten=0.01+0.3*powerRandom(2);
  }
}

const resetTimes=()=>{
  if (path.frac>0) {
    pathTime=performance.now()-path.frac*path.duration;
  } else {
    pathTime=0;
  }
  if (path.frac>0) {
    orbsTime=performance.now()-orbs.frac*orbs.duration;
  } else {
    orbsTime=0;
  }
  if (path.frac>0) {
    countTime=performance.now()-orbs.fracO*orbs.durationO;
  } else {
    countTime=0;
  }
}

var pathTime=0;
var orbsTime=0;
var countTime=0;
const animate=(ts)=>{
  if (stopped) return;
  if (!pathTime) pathTime=ts;
  let pProg=ts-pathTime;
  if (pProg<path.duration) {
    path.frac=pProg/path.duration;
  } else {
    path.transit();
    pathTime=0;
    path.frac=0;
if (EM) stopped=true; 
  }
  if (!orbsTime) orbsTime=ts;
  let oProg=ts-orbsTime;
  if (oProg<orbs.duration) {
    orbs.frac=oProg/orbs.duration;
  } else {
    orbs.transit();
    orbsTime=0;
    orbs.frac=0;
  }
  if (!countTime) countTime=ts;
  let cProg=ts-countTime;
  if (cProg<orbs.durationO) {
    orbs.fracO=cProg/orbs.durationO;
  } else {
    orbs.transitCount();
    countTime=0;
    orbs.fracO=0;
  }
  orbs.draw(orbs.frac);
  requestAnimationFrame(animate);
}

var stopped=true;
const start=()=>{
  if (stopped) {
    stopped=false;
    resetTimes();
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);
onresize();
start();
