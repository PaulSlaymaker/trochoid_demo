"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/details/YzyaqyP
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const EM=location.href.endsWith("em");
const CSIZE=400;

const canvas=document.querySelector("#cta");
const ctx=canvas.getContext("2d");
ctx.translate(CSIZE,CSIZE);
ctx.rotate(-Math.PI/2);
ctx.fillStyle="hsla(0,0%,0%,0.05)";
onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}
var stopped=true;
const PUBLISH=true;

var getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var coprime=(a,b)=>{
  const primes=[2,3,5,7,9,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107]; 
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
  let FMAX=108;
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
  //let pts=()=>{ return getRandomInt(18,224,getRandomInt(1,3)); }
  let pts=()=>{ return getRandomInt(64,330); }
  let p=pts();
  while (true) {
    if (
	p%3==0 ||
	p%4==0 ||
	p%5==0 ||
	p%6==0 ||
	p%7==0 ||
	p%9==0 ||
	p%11==0 ||
        p%13==0 ||
        p%17==0 ||
        p%19==0 ||
        p%23==0 ||
        p%29==0 ||
        p%31==0
    ) return p;
    p=pts();
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
  vertexArray.push(vertexArray.shift());
  for (let f of vertexArray) {
    if (POINTS%f>0) continue;  // vertex f not usable
    if (f==v) continue;	// vertex not different from current
    if ((trip[1]-trip[0])%f==0 && (trip[1]-trip[0])/f>0
     && (trip[2]-trip[1])%f==0 && (trip[2]-trip[1])/f>0) {
//if (!PUBLISH) console.log("f="+f+" k="+trip[0]%f);
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
    let z=pointFrac*TP;
    var y,oFrac;
    var	x=fSet[0]*rself.r1*Math.cos(rself.m1*z)
         +fSet[1]*rself.r2*Math.cos(rself.m2*z)
         +fSet[2]*rself.r3*Math.cos(rself.m3*z);
	y=fSet[3]*rself.r1*Math.sin(rself.m1*z)
         +fSet[4]*rself.r2*Math.sin(rself.m2*z)
         +fSet[5]*rself.r3*Math.sin(rself.m3*z);
	//oFrac=Math.pow(x*x+y*y,0.5)/(rself.r1+rself.r2+rself.r3);
	oFrac=Math.pow(x*x+y*y,0.5)/CSIZE;
    return {x:x,y:y,oFrac:oFrac}
  }
  this.randomizeCycles=(cset2)=>{
if (!PUBLISH) if (cset2==null) { debugger; }
      let multiplierSet=cset2[getRandomInt(0,cset2.length)];
      rself.m1=multiplierSet[0];
      rself.m2=multiplierSet[1];
      rself.m3=multiplierSet[2];
  }
  this.randomizeRadii=()=>{
    rself.r1=400-200*Math.random();
    rself.r2=400-200*Math.random();
    rself.r3=400-200*Math.random();
  }
}

//var vertexArray=[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37];
var vertexArray=[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27];

var portal=[];

var Path=function(durOffset) {
  this.ro1=new Roulette();
  this.ro2=new Roulette();
  this.time=0;
  this.frac=0;
  this.duration=7700+durOffset;
  this.transitCount=0;
  this.getMetrics=(pointFrac)=>{
    let ro1Met=this.ro1.getMetrics(pointFrac);
    let ro2Met=this.ro2.getMetrics(pointFrac);
    return {
      x:0.5*(this.frac*ro2Met.x+(1-this.frac)*ro1Met.x),
      y:0.5*(this.frac*ro2Met.y+(1-this.frac)*ro1Met.y),
      oFrac:this.frac*ro2Met.oFrac+(1-this.frac)*ro1Met.oFrac
    }
  }
  this.setCSet=()=>{ 
    vertexArray.push(vertexArray.shift());
    for (let f of vertexArray) {
      if (POINTS%f==0) {
        if (f==3) {
          return generateMultipliers([1,2][getRandomInt(0,2)],3);
        } else if (f==4) {
          return generateMultipliers([1,3][getRandomInt(0,2)],4);
        } else if (f==5) {
          return generateMultipliers([1,2,3,4][getRandomInt(0,4)],5);
        } else if (f==6) {
          return generateMultipliers([1,5][getRandomInt(0,2)],6);
        } else if (f==7) {
          return generateMultipliers([1,2,3,4,5,6][getRandomInt(0,6)],7);
        } else if (f==8) {
          return generateMultipliers([1,3,5,7][getRandomInt(0,4)],8);
        } else if (f==9) {
          return generateMultipliers([1,2,4,5,7,8][getRandomInt(0,6)],9);
        } else if (f==10) {
          return generateMultipliers([1,3,7,9][getRandomInt(0,4)],10);
        } else if (f==11) {
          return generateMultipliers([1,2,3,4,5,6,7,8,9,10][getRandomInt(0,10)],11);
        } else if (f==12) {
          return generateMultipliers([1,5,7,11][getRandomInt(0,4)],12);
        } else if (f==13) {
          return generateMultipliers([1,2,3,4,5,6,7,8,9,10,11,12][getRandomInt(0,12)],13);
        } else if (f==14) {
          return generateMultipliers([1,3,5,9,11,13][getRandomInt(0,6)],14);
        } else if (f==15) {
          return generateMultipliers([1,2,4,7,8,11,13,14][getRandomInt(0,8)],15);
        } else if (f==16) {
          return generateMultipliers([1,3,5,7,9,11,13,16][getRandomInt(0,8)],16);
        } else if (f==17) {
          return generateMultipliers([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16][getRandomInt(0,16)],17);
        } else if (f==18) {
          return generateMultipliers([1,5,7,11,13,17][getRandomInt(0,6)],18);
        } else if (f==19) {
          return generateMultipliers([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18][getRandomInt(0,18)],19);
        } else if (f==20) {
          return generateMultipliers([1,3,7,9,11,13,17,19][getRandomInt(0,8)],20);
        } else if (f==21) {
          return generateMultipliers([1,2,4,5,8,10,11,13,16,17,19,20][getRandomInt(0,12)],21);
        } else if (f==22) {
          return generateMultipliers([1,3,5,7,9,13,15,17,19,21][getRandomInt(0,10)],22);
        } else if (f==23) {
          return generateMultipliers([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22][getRandomInt(0,22)],23);
        } else if (f==24) {
          return generateMultipliers([1,5,7,11,13,17,19,23][getRandomInt(0,8)],24);
        } else if (f==25) {
          return generateMultipliers([1,2,3,4,6,7,8,9,11,12,13,14,16,17,18,19,21,22,23,24][getRandomInt(0,20)],25);
        } else if (f==26) {
          return generateMultipliers([1,3,5,7,9,11,15,17,19,21,23,25][getRandomInt(0,12)],26);
        } else if (f==27) {
          return generateMultipliers([1,2,4,5,7,8,10,11,13,14,16,17,19,20,22,23,25,26][getRandomInt(0,18)],27);
/*
        } else if (f==28) {
          return generateMultipliers([1,3,5,9,11,13,15,17,19,23,25,27][getRandomInt(0,12)],28);
        } else if (f==29) {
          return generateMultipliers([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28][getRandomInt(0,28)],29);
        } else if (f==30) {
          return generateMultipliers([1,7,11,13,17,19,23,29][getRandomInt(0,8)],30);
        } else if (f==31) {
          return generateMultipliers([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30][getRandomInt(0,30)],31);
        } else if (f==32) {
          return generateMultipliers([1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31][getRandomInt(0,16)],32);
        } else if (f==33) {
          return generateMultipliers([1,2,4,5,7,8,10,13,14,16,17,19,20,23,25,26,28,29,31,32][getRandomInt(0,20)],33);
        } else if (f==34) {
          return generateMultipliers([1,3,5,7,9,11,13,15,19,21,23,25,27,29,31,33][getRandomInt(0,16)],34);
        } else if (f==35) {
          return generateMultipliers([1,2,3,4,6,8,9,11,12,13,16,17,18,19,22,23,24,26,27,29,31,32,33,34][getRandomInt(0,24)],35);
        } else if (f==36) {
          return generateMultipliers([1,5,7,11,13,17,19,23,25,29,31,35][getRandomInt(0,12)],36);
        } else if (f==37) {
          return generateMultipliers([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36][getRandomInt(0,36)],37);
*/
        } else {
if (!PUBLISH) debugger;
          return this.setCSet();
        }
      }
    }
if (!PUBLISH) debugger;
  }
  this.randomizeCycles=(ro)=>{
if (!PUBLISH) if (cSet==null) { debugger; }
    let trip=cSet[getRandomInt(0,cSet.length)];
    if (orbs.state=="contract") {
      ro.m1=trip[0];
      ro.m2=trip[1];
      ro.m3=trip[2];
    } else {
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
  }
  this.transit=(no_report)=>{
    Object.assign(this.ro1, this.ro2);
    this.ro2=new Roulette(this.ro1);
    this.randomizeCycles(this.ro2);
    this.ro2.randomizeRadii();
/*
    Object.assign(this.ro1, this.ro2);
    Object.assign(this.ro2, this.ro3);
    this.ro3=new Roulette(this.ro2);
    this.randomizeCycles(this.ro3);
    this.ro3.randomizeRadii();
*/
  }
}

var paths=[new Path(0), new Path(-800), new Path(800)];

var Orb=function(or) {
  if (or instanceof Orb) {
    Object.assign(this, or);
  } else {
    this.radius=3+4*Math.random();
    this.hue=getRandomInt(0,360);
    this.huediff=getRandomInt(0,180);
  }
  this.getRadius=(fracRad)=>{
    let f=Math.max(0,Math.sin(fracRad*Math.PI));
    return f*this.radius;
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
//  durationC:10000,
  getRadius:(oFrac,pFrac)=>{
//    return orbs.frac*orbs.toOrb.getRadius(oFrac)+(1-orbs.frac)*orbs.fromOrb.getRadius(oFrac);
    return Math.sin(pFrac*Math.PI)*orbs.toOrb.getRadius(oFrac)+Math.sin((1-pFrac)*Math.PI)*orbs.fromOrb.getRadius(oFrac);
  },
  getHue:(oFrac)=>{
    let hdiff=orbs.frac*orbs.toOrb.huediff+(1-orbs.frac)*orbs.fromOrb.huediff;
    let midHue=orbs.frac*(orbs.toOrb.hue-orbs.fromOrb.hue)+orbs.fromOrb.hue;
    return (hdiff*oFrac+midHue)%360;
  },
  draw:()=>{
    ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    for (let i=0; i<POINTS; i++) {
      var pFrac=i/POINTS;
      let rf=(()=>{
	switch(orbs.state) {
	  case "steady": return 1; break;
	  case "contract": return 1-Math.pow(orbs.frac,4); break;
	  case "expand": return 1-Math.pow(1-orbs.frac,4); break;
	}
	return 1;
      })();
      let metrics=paths[0].getMetrics(pFrac);
      ctx.fillStyle='hsla('+
        orbs.getHue(metrics.oFrac, orbs.frac)+',90%,60%,0.9';
//        orbs.getLum(metrics.oFrac)+'%,'+
//        (stopped?1:rf*orbs.getOpacity(metrics.oFrac, orbs.frac))+')';
      ctx.beginPath();
      ctx.arc(metrics.x,metrics.y, 
          rf*orbs.getRadius(metrics.oFrac, paths[0].frac),0,TP);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      let metrics2=paths[1].getMetrics(pFrac);
      ctx.arc(metrics2.x,metrics2.y, 
	  rf*orbs.getRadius(metrics2.oFrac, paths[1].frac),0,TP);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      let metrics3=paths[2].getMetrics(pFrac);
      ctx.arc(metrics3.x,metrics3.y, 
	  rf*orbs.getRadius(metrics3.oFrac, paths[2].frac),0,TP);
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
    Object.assign(this.fromOrb, this.toOrb);
    this.toOrb=new Orb(this.fromOrb);
    this.toOrb.hue=getRandomInt(0,360);
    this.toOrb.huediff=getRandomInt(0,180);
  },
  transitVertices:()=>{
    if (portal!=null && portal.length==0) {
      orbs.transitCount++;
      if (orbs.transitCount>7) {
        portal=null;
      }
    } else {
      orbs.transitCount=0;
      if (portal!=null) {
	//if (paths[0].ro2.m1==portal[0] && paths[1].ro2.m1==portal[0]) {
	if (paths[0].ro2.m1==portal[0]) {  // only slightly less asymmetric
if (!PUBLISH) console.log("portal reset");    
	  cSet=cSet2;
	  portal=[];
	}
      }
    }
  }
}

var reset=()=>{
  do {
    POINTS=generatePoints();
    cSet=paths[0].setCSet();
  } while(cSet.length<6);
  for (let p of paths) {
    p.transit(true);
    p.transit(true);
    p.transit(true);
  }
  fSet=fSets[["p","n"][getRandomInt(0,2)]][getRandomInt(0,6)];
  portal=[];
  orbs.transitCount=0;
  orbs.start=0;
  let f=5/4-POINTS/500;
  orbs.fromOrb.radius=f*(3+4*Math.random());
  orbs.toOrb.radius=f*(3+4*Math.random());
}

var orbsTime=0;
var vertexTime=0;
const animate=(ts)=>{
  if (stopped) return;
  if (!orbsTime) orbsTime=ts;
  let progress=ts-orbsTime;
  if (progress<orbs.duration) {
    orbs.frac=progress/orbs.duration;
  } else {
    orbs.transit();
    orbs.frac=0;
    orbsTime=0;
    if (EM) stopped=true;
  }
  if (!vertexTime) vertexTime=ts;
  progress=ts-vertexTime;
  if (progress<orbs.durationV) {
    orbs.fracV=progress/orbs.durationV;
  } else {
    orbs.transitVertices();
    orbs.fracV=0;
    vertexTime=0;
  }
  for (let p of paths) {
    if (!p.time) p.time=ts;
    let progress=ts-p.time;
    if (progress<p.duration) {
      p.frac=progress/p.duration;
    } else {
      p.transit();
      p.time=0;
      p.frac=0;
    }
  }
  orbs.draw();
  requestAnimationFrame(animate);
}

const resetTimes=()=>{
  for (let p of paths) {
    if (p.frac>0) {
      p.time=performance.now()-p.frac*p.duration;
    } else {
      p.time=0;
    }
  }
  if (orbs.frac>0) {
    orbsTime=performance.now()-orbs.frac*orbs.duration;
  } else {
    orbsTime=0;
  }
  if (orbs.fracV>0) {
    vertexTime=performance.now()-orbs.fracV*orbs.durationV;
  } else {
    vertexTime=0;
  }
}

function start() {
  if (stopped) {
    resetTimes();
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
canvas.addEventListener("click", start, false);
onresize();
reset();
start();
