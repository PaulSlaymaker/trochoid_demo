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
	return [1,3,5,9,11,13,15,17,19][getRandomInt(0,9,2)];
      case 15:
	return [1,2,4,7,8,11,13,14,16,17,19][getRandomInt(0,11,2)];
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
      rself.r2=70-20*Math.random();
      rself.r3=70-20*Math.random();
      rself.r4=70-20*Math.random();
    } else if (rself.radiiCount==3) {
      rself.r1=90-30*Math.random();
      rself.r2=90-30*Math.random();
      rself.r3=90-30*Math.random();
      rself.r4=0;
    } else if (rself.radiiCount==2) {
      let rr=210+70*Math.random();  // sum of radii from 210-280
      let rd=30-60*Math.random();
      rself.r1=(rd+rr)/2;
      rself.r2=(rr-rd)/2;
      rself.r3=0;
      rself.r4=0;
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
}

var path={
  fromRo:new Roulette(),
  toRo:new Roulette(),
  start:0,
  frac:0,
  duration:5000,
  getMetrics:function(rotFrac,n) {
    let fromMet=this.fromRo.getMetrics(rotFrac,n);
    let toMet=this.toRo.getMetrics(rotFrac,n);
    return {
      x:this.frac*toMet.x+(1-this.frac)*fromMet.x,
      y:this.frac*toMet.y+(1-this.frac)*fromMet.y,
    }
  },
  transit:function() {
    Object.assign(this.fromRo, this.toRo);
    this.toRo=new Roulette(this.toRo);
    let lf=0.1;
    let mf=0.3;
    let hf=0.7;
    if (Math.random()<lf) {
      this.toRo.randomizeCycles();
      //this.toRo.controlledCycleChange(this.toRo.randomizeCycles, 'cyc');
    } else { 
      if (Math.random()<mf) {
	this.toRo.c0=this.toRo.getCycle0Match();
        //this.toRo.controlledCycleChange(this.toRo.getCycle0Match, 'c0');
      }
      if (Math.random()<mf) {
	this.toRo.softCycle();
        //this.toRo.controlledCycleChange(this.toRo.softCycle, 'ss');
      }
    }
    if (Math.random()<mf) {
      this.toRo.randomizeRadiiCount();
      //this.toRo.controlledCycleChange(this.toRo.randomizeRadiiCount, 'rrc');
    }
    if (Math.random()<hf) {
      this.toRo.randomizeTypes();
    }
    if (Math.random()<lf) {
      this.toRo.dz=[-1,1][getRandomInt(0,2)];
    }
    this.toRo.randomizeRadii();
    setTable();
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
  rCount:4+Math.round(40*Math.pow(Math.random(),1.8)),
  DS:0, // rotational increment to next line
  rcTrans:'N',   // N,D,H
  colorCount:2,
  hStart:0,
  hDuration:24000,
  hFrac:0,
  XT1:280*(1-2*Math.random()),
  YT1:280*(1-2*Math.random()),
  tStart:0,
  tDuration:8000,
  tFrac:0,
  fromHues:[Math.round(Math.random()*360)],
  toHues:[Math.round(Math.random()*360)],
  goodCycleSet:function() {
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
        return [5,10][getRandomInt(0,2)];  // 8,16
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
  },
  goodColorCount:function() {
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
	return [2,3,4,6,8][getRandomInt(0,5)];
      case 40:
	return [2,4,5,8][getRandomInt(0,4)];
      default:
	if (ribbons.rCount%2==0) { 
	  return 2;
	} else if (ribbons.rCount%3==0) { 
	  return 3;
	} else {
	  return 2+Math.round(Math.random());
	}
    }
    debugger;
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
    ribbons.fromHues=ribbons.toHues.slice();
    ribbons.toHues=[];
if (ribbons.colorCount==2) {
ribbons.toHues[0]=(ribbons.fromHues[0]+Math.random()*120)%360;
} else {
ribbons.toHues[0]=(ribbons.fromHues[0]+Math.random()*360/ribbons.colorCount)%360;
}
//    ribbons.toHues[0]=(ribbons.fromHues[0]+Math.random()*360/ribbons.colorCount)%360;
    for (let i=1; i<ribbons.colorCount; i++) {
      ribbons.toHues.push((ribbons.toHues[i-1]+360/ribbons.colorCount)%360);
    }
  },
  randomize:function() {
    ribbons.rCount=4+Math.round(50*Math.pow(Math.random(),1.8));
    while ([11,13,17,19,23].includes(ribbons.rCount)) {
      ribbons.rCount=4+Math.round(50*Math.pow(Math.random(),1.8));
    }
    ribbons.colorCount=ribbons.goodColorCount();
    ribbons.randomizeHues();
  },
  transitCount:function() {
    if (ribbons.rcTrans=='N') {
      if (Math.random()<0.1) {
        ribbons.XT1=280*(1-2*Math.random());
        ribbons.YT1=280*(1-2*Math.random());
        ribbons.rcTrans='T';
      }
    } else if (ribbons.rcTrans=='T') {
      ribbons.randomize();
      path.fromRo.randomizeCycles();
      path.toRo.randomizeCycles();
      ribbons.rcTrans='R';
setTable();
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
    ribbons.DS+=0.0002;
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
/*
while ([11,13,17,19,23].includes(ribbons.rCount)) {
//if (ribbons.rCount==11 || ribbons.rCount==13) {
  ribbons.rCount=4+Math.round(40*Math.pow(Math.random(),1.8));
}
ribbons.colorCount=ribbons.goodColorCount();
*/
ribbons.randomize();
ribbons.randomizeHues();

path.toRo.randomizeCycles();
path.fromRo.randomizeCycles();

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
  } else {
    stopped=true;
  }
}
canvas.addEventListener("click", start, false);

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
/*
  new SR({
    label:'c4',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.c4;
      tt.textContent=path.toRo.c4;
    }
  }),
*/
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
  new SR({
    label:'SP',
    oc:function(ft,tt) {
      ft.textContent=path.fromRo.getSP();
      tt.textContent=path.toRo.getSP();
    }
  }),
*/
];

function setTable() {
  for (let sr of srs) {
    sr.report();
  }
}
setTable();

start();
