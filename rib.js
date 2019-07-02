var CSIZE=400;

var canvas=document.querySelector('#cta');
onresize=function() {
  canvas.style.maxHeight=window.innerHeight-20+'px';
}

var ctx=canvas.getContext('2d');
ctx.translate(CSIZE,CSIZE);
ctx.rotate(-Math.PI/2);
ctx.lineWidth=4;

ctx.strokeStyle='hsl(180,90%,80%)';
ctx.fillStyle='hsla(0,0%,0%,0.05)';

onresize();

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

var colsets={
  2:[2,4,6,8],
  3:[3,6,9],
  5:[5],
  7:[7]
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
      for (let f of cycsets[p]) {
        a.add(f);
      }
    }
  }
  return Array.from(a);
}

function getColorArray(n) {
  let a=[];
  for (let i=2; i<10; i++) {
    if (n%i==0) {
      a.push(i);
    }
  }
  if (a.length==0) {
    return [2];
  } else {
    return a;
  }
/*
  let a=new Set();
  for (let i=0; i<4; i++) {
    if (n%primes[i]==0) {
      for (let f of colsets[primes[i]]) {
        a.add(f);
      }
    }
  }
  return Array.from(a);
*/
}

var Roulette=function(ro) {
  if (ro instanceof Roulette) {
    Object.assign(this, ro);
  } else {
    this.dz=-1;
    this.type1=-1;
    this.type2=-1;
    this.type3=-1;
    this.c0=1;
    this.c1=8;
    this.c2=16;
    this.c3=4;
    this.cycleSet=8;
    this.r1=100;
    this.r2=80;
    this.r3=40;
    this.r4=40;
    this.radiiCount=2;
  }
  let rself=this;
  this.getMetrics=function(rotFrac,n) {
    t=rself.dz*(rotFrac+n/(ribbons.rCount*2))*rself.c0*2*Math.PI;
    let f1=1+(rself.type1*rself.c1)/rself.c0;
    var x,y;
    if (rself.radiiCount==2) {
      x=rself.r1*Math.cos(t)+rself.r2*Math.cos(f1*t);
      y=rself.r1*Math.sin(t)+rself.r2*Math.sin(f1*t);
    } else if (rself.radiiCount==3) {
      let f2=1+(rself.type1*rself.c1+rself.type2*rself.c2)/rself.c0
      x=rself.r1*Math.cos(t)+rself.r2*Math.cos(f1*t)+rself.r3*Math.cos(f2*t);
      y=rself.r1*Math.sin(t)+rself.r2*Math.sin(f1*t)+rself.r3*Math.sin(f2*t);
    } else if (rself.radiiCount==4) {
      let f2=1+(rself.type1*rself.c1+rself.type2*rself.c2)/rself.c0
      let f3=1+(rself.type1*rself.c1+rself.type2*rself.c2+rself.type3*rself.c3)/rself.c0;
      x=rself.r1*Math.cos(t)+rself.r2*Math.cos(f1*t)+rself.r3*Math.cos(f2*t)+rself.r4*Math.cos(f3*t);
      y=rself.r1*Math.sin(t)+rself.r2*Math.sin(f1*t)+rself.r3*Math.sin(f2*t)+rself.r4*Math.sin(f3*t);
    } else {
      debugger;
    }
    return {x:x,y:y};
  }
  this.softCycle=function() {
    rself.c1=rself.setCycles();
    rself.c2=rself.setCycles();
    rself.c3=rself.setCycles();
    //rself.c4=rself.setCycles();
  }
  this.getCycle0Match=function() {
    return getRandomInt(1,19,4);
/*
    switch (rself.cycleSet) {
      case 2:
	return [1,3,5,7,9,11,13,15,17,19][getRandomInt(0,10,3)];
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
	return [1,3,5,9,11,13,15,17,19][getRandomInt(0,9,2)];
      case 15:
	return [1,2,4,7,8,11,13,14,16,17,19][getRandomInt(0,11,2)];
      case 16:
	return [1,3,5,7,9,11,13,15,17,19][getRandomInt(0,10,2)];
      case 17:
	return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,19][getRandomInt(0,18,2)];
      case 18:
	return [1,5,7,11,13,17,19][getRandomInt(0,7,2)];
      case 19:
	return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18][getRandomInt(0,18,2)];
    }
    debugger;
    return false;
*/
  }

  this.setCycles=function() {
    if (Math.random()<0.7) {  // put symmetry control here
      let ca=getFactors(this.cycleSet);
      if (ca.length==0) {
	return this.cycleSet;
      }
      return ca[getRandomInt(0,ca.length)];
    } else if (Math.random()<0.7) {  // put symmetry control here
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
  }

  this.setCyclesX=function() {
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
      return [3,4,6,12,18][getRandomInt(0,5)];
    } else if (this.cycleSet==14) {
      return [7,14][getRandomInt(0,2)];
    } else if (this.cycleSet==15) {
      return [3,5,15][getRandomInt(0,3)];
    } else if (this.cycleSet==16) {
      return [2,4,8,16][getRandomInt(0,4)];
    } else if (this.cycleSet==18) {
      return [2,3,6,9,18][getRandomInt(0,5)];
    } else {
      return this.cycleSet;
    }
  }

  this.randomizeRadiiCount=function() {
    rself.radiiCount=2+Math.round(2*Math.random());
  }
  this.randomizeRadii=function() {
    if (rself.radiiCount==4) {
      rself.r1=70-20*Math.random();
/*
      rself.r2=70-20*Math.random();
      rself.r3=70-20*Math.random();
      rself.r4=70-20*Math.random();
*/
//      rself.r1=20+160*Math.random();
      rself.r2=20+(240-rself.r1)*Math.random();
      rself.r3=20+(280-rself.r1-rself.r2)*Math.random();
      rself.r4=280-rself.r1-rself.r2-rself.r3;
    } else if (rself.radiiCount==3) {
      rself.r1=90-30*Math.random();
/*
      rself.r2=90-30*Math.random();
      rself.r3=90-30*Math.random();
*/
//      rself.r1=20+160*Math.random();
      rself.r2=20+(240-rself.r1)*Math.random();
      rself.r3=(280-rself.r1-rself.r2);
      rself.r4=0;
    } else if (rself.radiiCount==2) {
      let rr=210+70*Math.random();  // sum of radii from 210-280
      let rd=30-60*Math.random();
      rself.r1=(rd+rr)/2;
      rself.r2=(rr-rd)/2;
/*
      rself.r1=20+160*Math.random();
      rself.r2=280-rself.r1;
      rself.r3=0;
      rself.r4=0;
*/
    } else {
      debugger;
    }
  }
  this.randomizeCycles=function() {
    rself.cycleSet=ribbons.goodCycleSet();
/*
    if (ribbons.rCount<20) {
// match ribbons.rCount
      rself.cycleSet=ribbons.rCount;
    } else {
      rself.cycleSet=getRandomInt(4,20,2);
    }
    rself.cycleSet=getRandomInt(4,20,2);
*/
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
/*
    rself.type4=[-1,1][getRandomInt(0,2)];
*/
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
      default:
	return 0;
    }
  }
  this.controlledCycleChange=function(mod) {
    let count=0;
    let sMax=30;
    let sMin=10;
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

var path={
  fromRo:new Roulette(),
  toRo:new Roulette(),
  start:0,
  frac:0,
  //duration:20000,
  duration:5000,
  //duration:2000,
  getMetrics:function(rotFrac,n) {
    let fromMet=this.fromRo.getMetrics(rotFrac,n);
    let toMet=this.toRo.getMetrics(rotFrac,n);
    return {
      //x:this.frac*toMet.x+(1-this.frac)*fromMet.x,
      //y:this.frac*toMet.y+(1-this.frac)*fromMet.y,
      x:cbLoc(fromMet.x,toMet.x,this.frac),
      y:cbLoc(fromMet.y,toMet.y,this.frac)
    }
  },
  mf:0.3,
  transit:function() {
    Object.assign(this.fromRo, this.toRo);
    this.toRo=new Roulette(this.toRo);
    let lf=0.1;
    //let mf=0.3;
    let hf=0.7;
    if (Math.random()<this.mf) {
      this.toRo.randomizeCycles();
      //this.toRo.controlledCycleChange(this.toRo.randomizeCycles, 'cyc');
    } else { 
      if (Math.random()<this.mf) {
	//this.toRo.c0=this.toRo.getCycle0Match();
        this.toRo.controlledCycleChange(this.toRo.getCycle0Match);
      }
      if (Math.random()<this.mf) {
	//this.toRo.softCycle();
        this.toRo.controlledCycleChange(this.toRo.softCycle);
      }
    }
    if (Math.random()<this.mf) {
      //this.toRo.randomizeRadiiCount();
      this.toRo.controlledCycleChange(this.toRo.randomizeRadiiCount);
    }
    if (Math.random()<this.mf) {
      this.toRo.randomizeTypes();
    }
    if (Math.random()<this.mf/4) {
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

var fade={
  start:0,
  animate:function(ts) {
    if (stopped) {
      return;
    }
    if (!fade.start) {
      fade.start=ts;
    }
    let progress=ts-fade.start;
    if (progress>40) {
      ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
      fade.start=0;
    }
    requestAnimationFrame(fade.animate);
  }
}

var ribbons={
  rCount:4+Math.round(40*Math.pow(Math.random(),1.7)),
  DS:0, // rotational increment to next line
  //DSinc:0.0002,
  //DSinc:0.00015,
  DSinc:0.0002,
  rcTrans:'N',   // N,D,H
  colorCount:2,
  hStart:0,
  hDuration:24000,
  hFrac:0,
  XT1:120*(1-2*Math.random()),
  YT1:120*(1-2*Math.random()),
  tStart:0,
  tDuration:8000,
  tFrac:0,
  fromHues:[Math.round(Math.random()*360)],
  toHues:[Math.round(Math.random()*360)],
  goodCycleSet:function() {
    //let ca=getCycleArray(ribbons.rCount);
    let ca=getFactors(ribbons.rCount);
    if (ca.length==0) {
      return getRandomInt(4,20,2);
    }
    return ca[getRandomInt(0,ca.length)];
/*
    switch (ribbons.rCount) {
      case 4:
      case 8:
      case 16:
      case 32:
        return [4,8,16][getRandomInt(0,3)];  // 12 sec
      case 5:
        return 5; // 10,15 sec
      case 6:
        return [6,12,18][getRandomInt(0,3)];
      case 7:
        return 7;  // 14
      case 10:
        return [5,10][getRandomInt(0,2)];
      case 12:
	return [4,6,12][getRandomInt(0,3)]; // etc 
      case 14:
      case 28:
        return [7,14][getRandomInt(0,2)];
      case 15:
        return [5,15][getRandomInt(0,2)];
      case 18:
	return [6,9,18][getRandomInt(0,3)]; // etc 
      case 20:
        return [4,5,10][getRandomInt(0,2)];  // 8,16
      case 21:
        return 7;
      case 22:
        return 11;
      case 24:
	return [4,6,8,12][getRandomInt(0,4)]; // etc 
      case 25:
        return 5;
      case 26:
        return 13;
      case 27:
        return 9;
      case 30:
        return [5,6,10,15][getRandomInt(0,4)];
      case 33:
        return 11;
      case 34:
        return 17;
      case 35:
        return [5,7][getRandomInt(0,2)];
      case 36:
        return [4,6,9,12,18][getRandomInt(0,5)];
      case 38:
        return 19;
      case 39:
        return 13;
      case 40:
        return [4,5,8,10][getRandomInt(0,4)];
    }
    if (ribbons.rCount<20) {
      return ribbons.rCount;
    } else {
      if (ribbons.rCount%4==0) { 
	return 4;
      } else if (ribbons.rCount%5==0) { 
        return 5;
      } else if (ribbons.rCount%7==0) { 
        return 7;
      } else {
        return getRandomInt(4,20,2);
      }
    }
*/
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
/*
    let ca=getColorArray(ribbons.rCount);
    //if (ca.length==0) { return 2; }
    return ca[getRandomInt(0,ca.length)];
*/
/*
    switch (ribbons.rCount) {
      case 4:
	return [2,4][Math.round(Math.random())];
      case 5:
	return 5;
      case 6:
	return [2,3,6][getRandomInt(0,3)];
      case 7:
	return 7;
      case 8:
      case 16:
      case 32:
	return [2,4,8][getRandomInt(0,3)];
      case 9:
      case 18:
	return [3,9][Math.round(Math.random())];
      case 10:
      case 20:
	return [2,5][Math.round(Math.random())];
      case 12:
      case 24:
	return [2,3,4,6][getRandomInt(0,4)];
      case 14:
      case 28:
	return [2,7][Math.round(Math.random())];
      case 15:
	return [3,5][Math.round(Math.random())];
      case 21:
	return [3,7][Math.round(Math.random())];
      case 25:
	return 5;
      case 30:
	return [2,3,5][getRandomInt(0,3)];
      case 35:
	return [5,7][Math.round(Math.random())];
      case 36:
	return [2,3,4,6][getRandomInt(0,4)];
      case 40:
	return [2,4,5,8][getRandomInt(0,4)];
      default:
	if (ribbons.rCount%2==0) { 
	  return 2;
	} else if (ribbons.rCount%3==0) { 
	  return 3;
	} else if (ribbons.rCount%5==0) { 
	  return 5;
	} else if (ribbons.rCount%7==0) { 
	  return 7;
	} else {
	  return 2+Math.round(Math.random());
	}
    }
    debugger;
*/
  },
  randomizeHues:function() {
    //ribbons.colorCount=ribbons.goodColorCount();
    ribbons.fromHues[0]=Math.round(Math.random()*360);
ribbons.fromHues[0]=0;
//    ribbons.toHues[0]=Math.round(Math.random()*360);
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
    //if (colorCountRanger.lock) return;
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
  randomize:function() {
    ribbons.rCount=4+Math.round(55*Math.pow(Math.random(),1.7));
    while ([11,13,17,19,23,29].includes(ribbons.rCount)) {
      ribbons.rCount=4+Math.round(55*Math.pow(Math.random(),1.7));
    }
    //if (colorCountRanger!=undefined && colorCountRanger.lock) return;
    ribbons.colorCount=ribbons.goodColorCount();
    ribbons.randomizeHues();
  },
  transitCount:function() {
    if (ribbonsRanger.lock) return;
    if (ribbons.rcTrans=='N') {
      if (Math.random()<path.mf) {
        ribbons.XT1=120*(1-2*Math.random());
        ribbons.YT1=120*(1-2*Math.random());
        ribbons.rcTrans='T';
      }
    } else if (ribbons.rcTrans=='T') {
      ribbons.randomize();
      path.fromRo.randomizeCycles();
      path.toRo.randomizeCycles();
      ribbons.rcTrans='R';
//setTable();
ribbonsRanger.setValue(ribbons.rCount);
//colorCountRanger.setValue(ribbons.colorCount);
    } else if (ribbons.rcTrans=='R') {
      ribbons.rcTrans='N';
    }
/*
    if (ribbons.rcTrans=='N' || ribbons.rcTrans=='D') {
      if (ribbons.rCount>80) {
        ribbons.rcTrans='H';
      } else if (ribbons.rCount<8) {
	ribbons.rCount*=2;
        ribbons.rcTrans='D';
      } else {
	if (ribbons.rCount%2!=0) {
	  ribbons.rCount*=2;
	  ribbons.rcTrans='D';
        } else {
	  if (Math.random()>0.5) {
	    ribbons.rCount*=2;
	    ribbons.rcTrans='D';
	  } else {
	    ribbons.rcTrans='H';
	  }

	}

      }
    } else if (ribbons.rcTrans=='H') {
      ribbons.rCount/=2;
      ribbons.rcTrans='N';
    }
*/
  },
  draw:function(ts) {
    for (let i=0; i<2*ribbons.rCount; i+=2) {
/*
if (ribbons.rcTrans=='D') {
  if (i/2%2==1) {
    //var pFrac=(Math.pow(1-rotFrac,5)+2*i)/ribbons.rCount;
    var pFrac=(1-ribbons.hFrac+i/2)/ribbons.rCount;
  } else {
    var pFrac=i/2/ribbons.rCount;
  }
} else if (ribbons.rcTrans=='H') {
  if (i/2%2==1) {
    var pFrac=(1-ribbons.hFrac+i/2)/ribbons.rCount;
    //var pFrac=(Math.pow(rotFrac,0.2)+2*i)/orbs.points;
  } else {
    var pFrac=i/2/ribbons.rCount;
  }
} else {
  var pFrac=i/2/ribbons.rCount;
}
*/

      let xy1=path.getMetrics(ribbons.DS,i);
      let xy2=path.getMetrics(ribbons.DS,i+1);
      ctx.beginPath();

      if (ribbons.rcTrans=='T') {
let tz=Math.pow(ribbons.tFrac,5);
	let x1=(xy1.x)*(1-tz)+tz*ribbons.XT1;//*Math.cos(tz*Math.PI*2);
	let y1=(xy1.y)*(1-tz)+tz*ribbons.YT1;//*Math.sin(ribbons.DS*Math.PI*2);
	let x2=(xy2.x)*(1-tz)+tz*(-ribbons.XT1);//*Math.cos(ribbons.DS*Math.PI*2);
	let y2=(xy2.y)*(1-tz)+tz*(-ribbons.YT1);//*Math.sin(ribbons.DS*Math.PI*2);
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
      } else if (ribbons.rcTrans=='R') {
let tz=Math.pow(1-ribbons.tFrac,5);
	let x1=(xy1.x)*(1-tz)+(tz)*ribbons.XT1;
	let y1=(xy1.y)*(1-tz)+(tz)*ribbons.YT1;
	let x2=(xy2.x)*(1-tz)+(tz)*(-ribbons.XT1);
	let y2=(xy2.y)*(1-tz)+(tz)*(-ribbons.YT1);
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
      } else {
	ctx.moveTo(xy1.x,xy1.y);
	ctx.lineTo(xy2.x,xy2.y);
      }
      //let hue=hues[(i/2)%colorCount];
      let hue=ribbons.getHue(i/2);
      ctx.strokeStyle='hsl('+hue+',100%,60%)';
      //ctx.strokeStyle='hsl(10,95%,70%)';
      ctx.stroke();
      ctx.closePath();
    }
    ribbons.DS+=ribbons.DSinc;
    if (!ribbons.hStart) {
      ribbons.hStart=ts;
    }
    let hProg=ts-ribbons.hStart;
    if (hProg<ribbons.hDuration) {
      ribbons.hFrac=hProg/ribbons.hDuration;
    } else {
      ribbons.transitColor();
      ribbons.hStart=0;
      ribbons.hFrac=0;
    }
    if (!ribbons.tStart) {
      ribbons.tStart=ts;
    }
    let tProg=ts-ribbons.tStart;
    if (tProg<ribbons.tDuration) {
      ribbons.tFrac=tProg/ribbons.tDuration;
    } else {
      ribbons.transitCount();
      ribbons.tStart=0;
      ribbons.tFrac=0;
    }
    if (!stopped) {
      requestAnimationFrame(ribbons.draw);
    }
  }
}

function getR(x,y) {
  return Math.pow((Math.pow(x,2)+Math.pow(y,2)),0.5);
}
/*
while ([11,13,17,19,23].includes(ribbons.rCount)) {
//if (ribbons.rCount==11 || ribbons.rCount==13) {
  ribbons.rCount=4+Math.round(40*Math.pow(Math.random(),1.8));
}
ribbons.colorCount=ribbons.goodColorCount();
*/
ribbons.randomize();
ribbons.randomizeHues();

/*
var hues=[Math.round(Math.random()*360)];
//var colorCount=2+Math.round(RC/6*Math.random());
for (let i=1; i<colorCount; i++) {
  hues.push((hues[i-1]+360/colorCount)%360);
}
*/

function getLum(rFrac) {
  return 50+45*(1-rFrac);
}

var stopped=true;
function start() {
  if (stopped) {
    stopped=false;
    ribbons.draw();
    path.animate();
    fade.animate();
    document.querySelector('#ss').textContent='Stop';
  } else {
    stopped=true;
    document.querySelector('#ss').textContent='Start';
  }
}
canvas.addEventListener("click", start, false);

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
      rotateSpeedRanger.report();
      curveSpeedRanger.report();
      ribbonsRanger.report();
      //colorCountRanger.report();
      changeRateRanger.report();
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

var rotateSpeedRanger=new Ranger({
  label:'Rotational speed',
/*
  min:0.0001,
  max:0.01,
  step:0.0001,
  value:0.0002,
*/
  min:1,
  max:10,
  step:1,
  value:5,
  oninput:function(val) {
    //ribbons.DSinc=val*0.000025;
    ribbons.DSinc=val*0.00005-0.000045;
  },
});

var curveSpeedRanger=new Ranger({
  label:'Curve speed',
  min:1,
  max:10,
  step:1,
  value:5,
  oninput:function(val) {
    path.duration=50000/val-4500;
  },
});

var ribbonsRanger=new Ranger({
  label:'Ribbons',
  min:1,
  max:200,
  step:1,
  value:50,
  oninput:function(val) {
    ribbons.rCount=parseInt(val);
  },
  lockInput:function(isLocked) { 
    ribbons.rcTrans='N';
  }
});
ribbonsRanger.setValue(ribbons.rCount);

/*
var colorCountRanger=new Ranger({
  label:'Color count',
  min:1,
  max:100,
  step:1,
  value:5,
  oninput:function(val) {
    ribbons.colorCount=parseInt(val);
    ribbons.randomizeHues();
  },
  lockInput:function(isLocked) { }
});
colorCountRanger.setValue(ribbons.colorCount);
*/

var changeRateRanger=new Ranger({
  label:'Change rate',
  min:1,
  max:10,
  step:1,
  value:3,
  oninput:function(val) {
    path.mf=val/10;
  }
});

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
*/

/*
var srs=[
  new SR({
    label:'rib',
    oc:function(ft,tt) {
      ft.textContent=ribbons.rCount;
      //tt.textContent=path.toRo.getSP();
    }
  }),
  new SR({
    label:'cc',
    oc:function(ft,tt) {
      ft.textContent=ribbons.colorCount;
      //tt.textContent=path.toRo.getSP();
    }
  }),
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
*/
/*
  new SR({
    label:'c4',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.c4;
      tt.textContent=path.toRo.c4;
    }
  }),
*/
/*
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
*/
/*
  new SR({
    label:'type4',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.type4;
      tt.textContent=path.toRo.type4;
    }
  }),
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

start();
