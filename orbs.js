var CSIZE=300;
var stopped=true;

var canvas=document.querySelector('#cta');
var ctx=canvas.getContext('2d');
ctx.translate(CSIZE,CSIZE);
ctx.rotate(-Math.PI/2);
ctx.fillStyle='hsl(90,80%,80%)';
onresize=function() {
  canvas.style.maxHeight=window.innerHeight-20+'px';
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
    this.spMin=10;
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
    let z=rself.dz*(rotFrac+pointFrac)*rself.c0*2*Math.PI;
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
    debugger;
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
    rself.radiiCount=2+Math.round(3*Math.random());
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
//log('SP '+name+' exceed');
        return;
      }
    } while (sp<rself.spMin || sp>rself.spMax);
//log('SP'+name+' '+count);
  }
}


var C=2;
var R_to_N=3;

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
  setSpeed:function(sf) { 
    this.duration=5000/sf;
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
//setTable();

  },
  animate:function(ts) {
    if (stopped) {
      return;
    }
    if (!path.start) {
      path.start=ts;
    }
    let progress=ts-path.start;
    if (progress<path.duration) {
      path.frac=progress/path.duration;
    } else {
      path.transit();
      path.start=0;
      path.frac=0;
    }
    requestAnimationFrame(path.animate);
  }
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

var orbs={
  fromOrb:new Orb(),
  toOrb:new Orb(),
  //radius:8,
  start:0,
  frac:0,
  points:getRandomInt(12,40),
  duration:60000,
  startO:0,
  fracO:0,
  durationO:6000,
  //atten:0.1,
  ocTrans:'N',   // N,D,H
/*
  setPoints:function(cycleSet) {
    this.points=getRandomInt(12,40);
    let ct=0;
    do {
      ct=Math.round(12+40*Math.random());
    } while (ct%ro.c1==0);
  },
*/
  getDuration:function() {
    return df*this.duration;
  },
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
    for (let i=0; i<orbs.points; i++) {
      ctx.beginPath();
/*
if (orbs.ocTrans=='D') {
  if (i%2==1) {
    var pFrac=(Math.pow(1-rotFrac,5)+i)/orbs.points;
  } else {
    var pFrac=i/orbs.points;
  }
} else if (orbs.ocTrans=='H') {
  if (i%2==1) {
    var pFrac=(Math.pow(rotFrac,5)+i)/orbs.points;
    //var pFrac=(Math.pow(rotFrac,0.2)+i)/orbs.points;
  } else {
    var pFrac=i/orbs.points;
  }
} else {
  var pFrac=i/orbs.points;
}
*/
var pFrac=i/orbs.points;

      //let metrics=path.getMetrics(rotFrac, i/orbs.points);
      let metrics=path.getMetrics(rotFrac, pFrac);

      if (orbs.ocTrans=='T') {
        let tz=Math.pow(orbs.fracO,5);
	let x=(metrics.x)*(1-tz);
	let y=(metrics.y)*(1-tz);
        ctx.arc(x,y,orbs.getRadius(metrics.oFrac, rotFrac),0,2*Math.PI);
      } else if (orbs.ocTrans=='R') {
        let tz=Math.pow(1-orbs.fracO,5);
	let x=(metrics.x)*(1-tz);
	let y=(metrics.y)*(1-tz);
        ctx.arc(x,y,orbs.getRadius(metrics.oFrac, rotFrac),0,2*Math.PI);
      } else {
        ctx.arc(metrics.x,metrics.y, 
          orbs.getRadius(metrics.oFrac, rotFrac),0,2*Math.PI);
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
    //if (ribbonsRanger.lock) return;
    if (orbs.ocTrans=='N') {
      if (Math.random()<0.7) {
        orbs.ocTrans='T';
      }
    } else if (orbs.ocTrans=='T') {
      orbs.points=getRandomInt(12,120,2);
      orbs.ocTrans='R';
//setTable();
      orbsRanger.setValue(orbs.points);
      orbs.transit();
      orbs.start=0;
      orbs.frac=0;
    } else if (orbs.ocTrans=='R') {
      orbs.ocTrans='N';
    }
  },
  transit:function() {
    Object.assign(this.fromOrb, this.toOrb);
    this.toOrb=new Orb(this.fromOrb);
    //if (Math.random()<0.7) { this.toOrb.randomizeRadiusMode(); }
    this.toOrb.radius=4+8*Math.random();
    this.toOrb.randomizeRadiusMode();
    this.toOrb.hue=getRandomInt(0,360);
    this.toOrb.huediff=getRandomInt(0,180);

/*
    if (!orbsRanger.lock) {
      if (orbs.ocTrans=='N' || orbs.ocTrans=='D') {
	if (orbs.points>90) {
	  orbs.ocTrans='H';
	} else if (orbs.points<10) {
	  orbs.points*=2;
	  orbsRanger.setValue(orbs.points);
	  orbs.ocTrans='D';
	} else {
	  if (orbs.points%2!=0) {
	    orbs.points*=2;
	    orbsRanger.setValue(orbs.points);
	    orbs.ocTrans='D';
          } else {
	    if (Math.random()>0.5) {
	      orbs.points*=2;
	      orbsRanger.setValue(orbs.points);
	      orbs.ocTrans='D';
	    } else {
	      orbs.ocTrans='H';
	    }
          }
	}
      } else if (orbs.ocTrans=='H') {
	orbs.points/=2;
	orbsRanger.setValue(orbs.points);
	orbs.ocTrans='N';
      }
    }
*/

/*
if (!speedRanger.lock) {
  let spd=20+20*Math.random();
  orbs.setSpeed(spd/30);
//path.setSpeed(spd/30);
  speedRanger.setValue(spd);
}
*/

    if (!attenuationRanger.lock) {
      //orbs.toOrb.atten=0.01+0.3*Math.random();
      orbs.toOrb.atten=0.01+0.3*powerRandom(2);
      attenuationRanger.setValue(orbs.toOrb.atten);
    }
  },
  animate:function(ts) {
    if (stopped) {
      return;
    }
    if (!orbs.start) {
      orbs.start=ts;
    }
    let progress=ts-orbs.start;
    if (progress<orbs.duration) {
      orbs.frac=progress/orbs.duration;
    } else {
      orbs.transit();
      orbs.start=0;
      orbs.frac=0;
    }
    if (!orbs.startO) {
      orbs.startO=ts;
    }
    let progO=ts-orbs.startO;
    if (progO<orbs.durationO) {
      orbs.fracO=progO/orbs.durationO;
    } else {
      orbs.transitCount();
      orbs.startO=0;
      orbs.fracO=0;
    }

    orbs.draw(orbs.frac);
    requestAnimationFrame(orbs.animate);
  },
  setSpeed:function(sf) {
    orbs.duration=60000/sf;
    path.toRo.spMin=sf*10;
    path.toRo.spMax=sf*30;
  }
}

onresize();
function start() {
  if (stopped) {
    orbs.start=0;
    requestAnimationFrame(orbs.animate);
    requestAnimationFrame(path.animate);
    stopped=false;
    document.querySelector('#ss').textContent='Stop';
  } else {
    stopped=true;
    document.querySelector('#ss').textContent='Start';
  }
}
canvas.addEventListener("click", start, false);
start();

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
      orbsRanger.report();
      attenuationRanger.report();
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
  label:'Speed',
  min:1,
  max:100,
  step:1,
  value:30,
  oninput:function(val) {
    let sf=val/30;
    //orbs.duration=60000/sf;
    orbs.setSpeed(sf);
  },
  lockInput:function() { }
});

var orbsRanger=new Ranger({
  label:'Orbs',
  min:1,
  max:200,
  step:1,
  value:50,
  oninput:function(val) {
    orbs.points=parseInt(val);
  },
  lockInput:function(isLocked) { 
    if (isLocked) {
      orbs.ocTrans='N';
    }
  }
});
orbsRanger.setValue(orbs.points);

var attenuationRanger=new Ranger({
  label:'Trail attenuation',
  min:0.01,
  max:0.3,
  step:0.01, 
  value:0.1,
  oninput:function(val) {
    orbs.fromOrb.atten=val;
    orbs.toOrb.atten=val;
  },
  lockInput:function() { }
});


/*ZZZ*/

/*
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
    //if (!menu.open) {
      obj.oc(sself.fromTD,sself.toTD);
    //}
  }
}
var srs=[
  new SR({
    label:'c0',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.c0;
      tt.textContent=path.toRo.c0;
    }
  }),
  new SR({
    label:'c1',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.c1;
      tt.textContent=path.toRo.c1;
    }
  }),
  new SR({
    label:'c2',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.c2;
      tt.textContent=path.toRo.c2;
    }
  }),
  new SR({
    label:'c3',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.c3;
      tt.textContent=path.toRo.c3;
    }
  }),
  new SR({
    label:'c4',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.c4;
      tt.textContent=path.toRo.c4;
    }
  }),
  new SR({
    label:'dz',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.dz;
      tt.textContent=path.toRo.dz;
    }
  }),
  new SR({
    label:'radii',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.radiiCount;
      tt.textContent=path.toRo.radiiCount;
    }
  }),
  new SR({
    label:'type1',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.type1;
      tt.textContent=path.toRo.type1;
    }
  }),
  new SR({
    label:'type2',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.type2;
      tt.textContent=path.toRo.type2;
    }
  }),
  new SR({
    label:'type3',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.type3;
      tt.textContent=path.toRo.type3;
    }
  }),
  new SR({
    label:'type4',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.type4;
      tt.textContent=path.toRo.type4;
    }
  }),
*/
/*
  new SR({
    label:'r1',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.r1.toFixed(0);
      tt.textContent=path.toRo.r1.toFixed(0);
    }
  }),
  new SR({
    label:'r2',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.r2.toFixed(0);
      tt.textContent=path.toRo.r2.toFixed(0);
    }
  }),
  new SR({
    label:'r3',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.r3.toFixed(0);
      tt.textContent=path.toRo.r3.toFixed(0);
    }
  }),
  new SR({
    label:'r4',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.r4.toFixed(0);
      tt.textContent=path.toRo.r4.toFixed(0);
    }
  }),
  new SR({
    label:'r5',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.r5.toFixed(0);
      tt.textContent=path.toRo.r5.toFixed(0);
    }
  }),
*/
/*
  new SR({
    label:'oRadius',
    oc:function(ft,tt) {
      ft.textContent=orbs.fromOrb.radius.toFixed(0);
      tt.textContent=orbs.toOrb.radius.toFixed(0);
    }
  }),
  new SR({
    label:'rMode',
    oc:function(ft,tt) {
      ft.textContent=orbs.fromOrb.radiusMode;
      tt.textContent=orbs.toOrb.radiusMode;
    }
  }),
  new SR({
    label:'SP',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.getSP();
      tt.textContent=path.toRo.getSP();
    }
  }),
];
*/

/*
function setTable() {
  for (let sr of srs) {
    sr.report();
  }
}
setTable();
*/

var logging=false;	// publish @ false
function log(e) {
  if (logging) {
    console.log(Date().substring(16,25)+e);
  }
}
