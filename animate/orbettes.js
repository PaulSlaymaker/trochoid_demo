"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
var styleSheet=(()=>{
  let tag=document.createElement("style");
  tag.type="text/css";
  body.append(tag);
  let ss=document.styleSheets[document.styleSheets.length-1];
  ss.insertRule("body { background:#000; }",0);
  return ss;
})();

const CSIZE=300;

const canvas=document.querySelector("#cta");
const ctx=canvas.getContext("2d");
ctx.translate(CSIZE,CSIZE);
ctx.rotate(-Math.PI/2);
ctx.fillStyle="hsla(0,0%,0%,0.05)";
onresize=()=>{ canvas.style.maxHeight=window.innerHeight-20+"px"; }
var stopped=true;
const PUBLISH=true;

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

var coprime=(a,b)=>{
  const primes=[2,3,5,7,9,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79];
  if (a==1 || b==1) return true;
  let mm=Math.max(a,b)/2;
  for (var h=0; primes[h]<mm; h++) {
    if (a%primes[h]==0 && b%primes[h]==0) {
      return false;
    }
  }
  return true;
}

var generateMultipliers=(K,V)=>{
  let FMAX=80;
  let m=[];
  let END=FMAX-2*V;
  for (var i=K; i<END; i+=V) {
    for (var j=i+V; j<END+V; j+=V) {
      if (coprime(i,j)) {
	for (var k=j+V; k<END+2*V; k+=V) {
	  //if (coprime(i,j) && coprime(i,k) && coprime(j,k)) {
	  if (coprime(i,k) && coprime(j,k)) {
	    m.push([i,j,k]);
	  }
	}
      }
    }
  }
  return m;
}

var generatePoints=()=>{
  let p=getRandomInt(40,220);
  while (true) {
    if (
	p%4==0 ||
	p%5==0 ||
	p%6==0 ||
	p%7==0 ||
	p%9==0 ||
	p%11==0 ||
        p%13==0 ||
        p%15==0 ||
        p%17==0 ||
        p%19==0
    ) return p;
    p=getRandomInt(40,220);
  } 
  return p;
}

var POINTS=generatePoints();

var cSet=null;
var cSet2=null;

var fSets={
    "p":[
/*
      [ 0,+1,+1, 0,+1,+1],
      [ 0,-1,-1, 0,-1,-1],
      [+1, 0,+1,+1, 0,+1],
      [-1, 0,-1,-1, 0,-1],
      [+1,+1, 0,+1,+1, 0],
      [-1,-1, 0,-1,-1, 0],
*/
      [+1,+1,+1,+1,+1,+1],
      [-1,-1,-1,-1,-1,-1],
      [+1,-1,+1,+1,-1,+1],
      [-1,+1,-1,-1,+1,-1],
      [+1,+1,-1,+1,+1,-1],
      [-1,-1,+1,-1,-1,+1],
    ],
    "n":[
/*
      [+1, 0,+1,-1, 0,-1],
      [-1, 0,-1,+1, 0,+1],
      [ 0,+1,+1, 0,-1,-1],
      [ 0,-1,-1, 0,+1,+1],
      [+1,-1, 0,-1,+1, 0],
      [-1,+1, 0,+1,-1, 0],
*/
      [+1,-1,+1,-1,+1,-1],
      [-1,+1,-1,+1,-1,+1],
      [+1,+1,+1,-1,-1,-1],
      [-1,-1,-1,+1,+1,+1],
      [+1,-1,+1,-1,+1,-1],
      [-1,+1,-1,+1,-1,+1],
    ]
}
var fSet=fSets[["p","n"][getRandomInt(0,2)]][getRandomInt(0,6)];

var isPortalMult=(trip)=>{
  let v=cSet[0][1]-cSet[0][0];
  for (let f of [10,9,11,8,12,7,13,6,14,15,5,16,4,17,18,19]) {
    if (POINTS%f>0) continue;
    if (f==v) continue;
    if ((trip[1]-trip[0])%f==0 && (trip[1]-trip[0])/f>0
     && (trip[2]-trip[1])%f==0 && (trip[2]-trip[1])/f>0) {
if (!PUBLISH) console.log("f="+f+" k="+trip[0]%f);
      cSet2=generateMultipliers(trip[0]%f,f);
if (!PUBLISH) console.log("next cset "+cSet2[0]);
      return true;
    }
  }
  return false;
}

var Roulette=function(ro) {
  if (ro instanceof Roulette) {
    Object.assign(this, ro);
  } else {
    this.m1=8;
    this.m2=16;
    this.m3=2;
    this.r1=100;
    this.r2=80;
    this.r3=40;
    this.r4=40;
    this.spMin=10;
    this.spMax=30;
  }
  let rself=this;
  this.getMetrics=(pointFrac)=>{
    let z=pointFrac*2*Math.PI;
    var y,oFrac;
    var	x=fSet[0]*rself.r1*Math.cos(rself.m1*z)
         +fSet[1]*rself.r2*Math.cos(rself.m2*z)
         +fSet[2]*rself.r3*Math.cos(rself.m3*z);
	y=fSet[3]*rself.r1*Math.sin(rself.m1*z)
         +fSet[4]*rself.r2*Math.sin(rself.m2*z)
         +fSet[5]*rself.r3*Math.sin(rself.m3*z);
	oFrac=Math.pow(x*x+y*y,0.5)/(rself.r1+rself.r2+rself.r3);
    return {x:x,y:y,oFrac:oFrac}
  }
  this.randomizeCycles=(cset2)=>{
if (!PUBLISH) if (cset2==null) { debugger; }
      let trip=cset2[getRandomInt(0,cset2.length)];
      rself.m1=trip[0];
      rself.m2=trip[1];
      rself.m3=trip[2];
  }
  this.randomizeRadii=()=>{
    rself.r1=120-40*Math.random();
    rself.r2=120-40*Math.random();
    rself.r3=120-40*Math.random();
  }
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

var portal=[];

var Path=function(durOffset) {
  this.ro1=new Roulette();
  this.ro2=new Roulette();
  this.ro3=new Roulette();
  this.start=0;
  this.frac=0;
  this.duration=2700+durOffset;
  this.transitCount=0;
  this.getMetrics=(pointFrac)=>{
    let ro1Met=this.ro1.getMetrics(pointFrac);
    let ro2Met=this.ro2.getMetrics(pointFrac);
    let ro3Met=this.ro3.getMetrics(pointFrac);
    return {
      x:0.5*(this.frac*ro3Met.x+ro2Met.x+(1-this.frac)*ro1Met.x),
      y:0.5*(this.frac*ro3Met.y+ro2Met.y+(1-this.frac)*ro1Met.y),
      oFrac:this.frac*ro2Met.oFrac+(1-this.frac)*ro1Met.oFrac
    }
  },
  this.setCSet=()=>{ 
    let cs=null;
    if (POINTS%10==0) {
      cs=generateMultipliers([1,3,7,9][getRandomInt(0,4)],10);
    } else if (POINTS%9==0) {
      cs=generateMultipliers([1,2,4,5,7,8][getRandomInt(0,6)],9);
    } else if (POINTS%11==0) {
      cs=generateMultipliers([1,2,3,4,5,6,7,8,9,10][getRandomInt(0,10)],11);
    } else if (POINTS%8==0) {
      cs=generateMultipliers([1,3,5,7][getRandomInt(0,4)],8);
    } else if (POINTS%12==0) {
      cs=generateMultipliers([1,5,7,11][getRandomInt(0,4)],12);
    } else if (POINTS%7==0) {
      cs=generateMultipliers([1,2,3,4,5,6][getRandomInt(0,6)],7);
    } else if (POINTS%13==0) {
      cs=generateMultipliers([1,2,3,4,5,6,7,8,9,10,11,12][getRandomInt(0,12)],13);
    } else if (POINTS%6==0) {
      cs=generateMultipliers([1,5][getRandomInt(0,2)],6);
    } else if (POINTS%17==0) {
      cs=generateMultipliers([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16][getRandomInt(0,16)],17);
    } else if (POINTS%5==0) {
      cs=generateMultipliers([1,2,3,4][getRandomInt(0,4)],5);
    } else if (POINTS%4==0) {
      cs=generateMultipliers([1,3][getRandomInt(0,2)],4);
    } else if (POINTS%19==0) {
      cs=generateMultipliers([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18][getRandomInt(0,18)],19);
    } else if (POINTS%3==0) {
      return generateMultipliers([1,2][getRandomInt(0,2)],3);
    } else {
if (!PUBLISH) debugger;
    }
    return cs;
  }
  this.randomizeCycles=(ro)=>{
if (!PUBLISH) if (cSet==null) { debugger; }
    let trip=cSet[getRandomInt(0,cSet.length)];
    if (portal==null) {
      if (isPortalMult(trip)) { 
if (!PUBLISH) console.log("found first "+JSON.stringify(trip)); 
        portal=trip;
      }
      ro.m1=trip[0];
      ro.m2=trip[1];
      ro.m3=trip[2];
    } else if (portal.length==0) {
      ro.m1=trip[0];
      ro.m2=trip[1];
      ro.m3=trip[2];
    } else {
      ro.m1=portal[0];
      ro.m2=portal[1];
      ro.m3=portal[2];
    }
  }
  this.transit=(no_report)=>{
    Object.assign(this.ro1, this.ro2);
    Object.assign(this.ro2, this.ro3);
    this.ro3=new Roulette(this.ro2);
    //this.ro3.randomizeCycles(this.cset);
    this.randomizeCycles(this.ro3);
    this.ro3.randomizeRadii();
//    if (!no_report) { setTable(); }
  },
  this.animate=(ts)=>{
    if (stopped) return;
    if (!this.start) {
      this.start=ts;
    }
    let progress=ts-this.start;
    if (progress<this.duration) {
      this.frac=progress/this.duration;
    } else {
      this.transit();
      this.start=0;
      this.frac=0;
    }
    requestAnimationFrame(this.animate);
  }
}

var path=new Path(0);
var path2=new Path(150);
var paths=[path,path2];

var Orb=function(or) {
  if (or instanceof Orb) {
    Object.assign(this, or);
  } else {
    this.radius=3+4*Math.random();
    this.radiusMode='CON';
    this.hue=getRandomInt(0,360);
    this.huediff=getRandomInt(0,180);
    this.atten=0.1;
  }
  this.getRadius=(fracRad)=>{
    let f=Math.max(0,Math.cos(fracRad*Math.PI/2));
    return f*this.radius;
  }
  this.getLum=function(oFrac, rotFrac) {
    return 50+45*(1-oFrac);
  }
  this.getOpacity=function(oFrac) {
    return Math.pow(1-oFrac,0.5);
  }
}

var orbs={
  fromOrb:new Orb(),
  toOrb:new Orb(),
  start:0,
  frac:0,
  oCount:0,
  duration:10000,
  transitCount:0,
  startV:0,
  fracV:0,
  durationV:1000,
  state:"steady", // contract,expand
  startC:Infinity,
  fracC:0,
  durationC:10000,
  getRadius:(oFrac)=>{
    return orbs.frac*orbs.toOrb.getRadius(oFrac)+(1-orbs.frac)*orbs.fromOrb.getRadius(oFrac);
  },
  getHue:(oFrac)=>{
    let hdiff=orbs.frac*orbs.toOrb.huediff+(1-orbs.frac)*orbs.fromOrb.huediff;
    let midHue=orbs.frac*(orbs.toOrb.hue-orbs.fromOrb.hue)+orbs.fromOrb.hue;
    return (hdiff*oFrac+midHue)%360;
  },
  getLum:(oFrac)=>{
    //return (rotFrac*orbs.toOrb.getLum(oFrac)+(1-rotFrac)*orbs.fromOrb.getLum(oFrac))%360;
    return 50+45*(1-oFrac);
  },
  getOpacity:(oFrac, rotFrac)=>{
    // both orbital and transitional
    return orbs.frac*orbs.toOrb.getOpacity(oFrac)+(1-orbs.frac)*orbs.fromOrb.getOpacity(oFrac);
  },
  draw:function(rotFrac) {
    //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    for (let i=0; i<POINTS; i++) {
      ctx.beginPath();
      var pFrac=i/POINTS;
      let metrics=path.getMetrics(pFrac);
      let rf=(()=>{
	switch(orbs.state) {
	  case "steady": return 1; break;
	  case "contract": return 1-Math.pow(orbs.frac,9); break;
	  case "expand": return 1-Math.pow(1-orbs.frac,9); break;
	}
	return 1;
      })();
      ctx.arc(metrics.x,metrics.y, 
          rf*orbs.getRadius(metrics.oFrac, orbs.frac),0,2*Math.PI);

let metrics2=path2.getMetrics(pFrac);
ctx.arc(metrics2.x,metrics2.y, 
    rf*orbs.getRadius(metrics2.oFrac, orbs.frac),0,2*Math.PI);

      ctx.fillStyle='hsla('+
        orbs.getHue(metrics.oFrac, orbs.frac)+',90%,'+
        orbs.getLum(metrics.oFrac)+'%,'+
        (stopped?1:rf*orbs.getOpacity(metrics.oFrac, orbs.frac))+')';
      ctx.fill();
      ctx.closePath();
    }
  },
  transit:function() {
    orbs.oCount++;
    if (orbs.state=="steady") {
      if (orbs.oCount%5==0) {
        orbs.state="contract";
      }
    } else if (orbs.state=="contract") {
      reset();
      orbs.state="expand";
    } else if (orbs.state=="expand") {
      orbs.state="steady";
    }
if (!PUBLISH) console.log("state "+orbs.state);

    Object.assign(this.fromOrb, this.toOrb);
    this.toOrb=new Orb(this.fromOrb);
    let f=9/8-POINTS/320;
    this.toOrb.radius=f*(3+4*Math.random());
    this.toOrb.hue=getRandomInt(0,360);
    this.toOrb.huediff=getRandomInt(0,180);
  },
  //transitVertices:function() {
  transitVertices:()=>{
    if (portal!=null && portal.length==0) {
      orbs.transitCount++;
      if (orbs.transitCount>7) {
        portal=null;
      }
    } else {
      orbs.transitCount=0;
      if (portal!=null) {
	if (path.ro2.m1==portal[0] && path2.ro2.m1==portal[0]) {
if (!PUBLISH) console.log("resetting..");    
	  cSet=cSet2;
	  portal=[];
	}
      }
    }
//console.log("check portal sync "+this.transitCount);
  },
  animate:(ts)=>{
    if (stopped) { return; }
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
    if (!orbs.startV) {
      orbs.startV=ts;
    }
    let progV=ts-orbs.startV;
    if (progV<orbs.durationV) {
      orbs.fracV=progV/orbs.durationV;
    } else {
      orbs.transitVertices();
      orbs.startV=0;
      orbs.fracV=0;
    }
    orbs.draw(orbs.frac);
    requestAnimationFrame(orbs.animate);
  },
}

var fade={
  start:0,
  animate:(ts)=>{
    if (stopped) return;
    if (!fade.start) {
      fade.start=ts;
    }
    let progress=ts-fade.start;
    if (progress>40) {
      ctx.fillStyle="hsla(0,0%,0%,0.03)";
      ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
      fade.start=0;
    }
    requestAnimationFrame(fade.animate);
  }
}

/*
var rndPath=()=>{
  for (let p of paths) {
    p.ro1.m1=getRandomInt(1,50);
    p.ro1.m2=getRandomInt(1,50);
    p.ro1.m3=getRandomInt(1,50);
    p.ro2.m1=getRandomInt(1,50);
    p.ro2.m2=getRandomInt(1,50);
    p.ro2.m3=getRandomInt(1,50);
    p.ro3.m1=getRandomInt(1,50);
    p.ro3.m2=getRandomInt(1,50);
    p.ro3.m3=getRandomInt(1,50);
  }
}
*/

var reportMult=()=>{
  for (let p of paths) {
    console.log(cSet[0]);
    console.log([p.ro1.m1,p.ro1.m2,p.ro1.m3]);
    console.log([p.ro2.m1,p.ro2.m2,p.ro2.m3]);
    console.log([p.ro3.m1,p.ro3.m2,p.ro3.m3]);
  }
  console.log("--");
}

var reset=()=>{
  POINTS=generatePoints();
  cSet=path.setCSet();
  for (let p of paths) {
    p.transit(true);
    p.transit(true);
    p.transit(true);
  }
  fSet=fSets[["p","n"][getRandomInt(0,2)]][getRandomInt(0,6)];
  portal=[];
  orbs.transitCount=0;
  orbs.start=0;
}

onresize();
function start() {
  if (stopped) {
    reset();
    requestAnimationFrame(orbs.animate);
    requestAnimationFrame(path.animate);
    requestAnimationFrame(path2.animate);
    requestAnimationFrame(fade.animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
canvas.addEventListener("click", start, false);
start();

// ZZZZ

/*
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
      //speedRanger.report();
      //orbsRanger.report();
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
      orbs.draw();
    }
  }
}

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
    label:'points',
    oc:function(ft,tt) {
      ft.textContent=POINTS;
      tt.textContent=POINTS;
    }
  }),
  new SR({
    label:'cset',
    oc:function(ft,tt) {
      ft.textContent=cSet[0];
      tt.textContent=cSet[0];
    }
  }),
  new SR({
    label:'m1',
    oc:function(ft,tt) {
      ft.textContent=path.ro1.m1;
      tt.textContent=path.ro2.m1;
    }
  }),
  new SR({
    label:'m2',
    oc:function(ft,tt) {
      ft.textContent=path.ro1.m2;
      tt.textContent=path.ro2.m2;
    }
  }),
  new SR({
    label:'m3',
    oc:function(ft,tt) {
      ft.textContent=path.ro1.m3;
      tt.textContent=path.ro2.m3;
    }
  }),
];

function setTable() {
  for (let sr of srs) {
    sr.report();
  }
}
setTable();
*/
