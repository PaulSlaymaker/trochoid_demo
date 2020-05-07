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

const CSIZE=400;

const canvas=document.querySelector("#cta");
const ctx=canvas.getContext("2d");
ctx.translate(CSIZE,CSIZE);
ctx.rotate(-Math.PI/2);
ctx.fillStyle="hsla(0,0%,0%,0.05)";
onresize=()=>{ canvas.style.maxHeight=window.innerHeight-20+"px"; }
var stopped=true;
const PUBLISH=false;

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
  let pts=()=>{ return getRandomInt(60,320); }
  let p=pts();
  while (true) {
    //if (p==33 || p==34 || p==38 || p==39) { p=pts(); } 
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
  //for (let f of getRandomVList()) {
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
    let z=pointFrac*2*Math.PI;
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
/*
    rself.r1=200-80*Math.random();
    rself.r2=200-80*Math.random();
    rself.r3=200-80*Math.random();
*/
  }
}

//var vertexArray=[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37];
var vertexArray=[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27];

var portal=[];

var Path=function(durOffset) {
  this.ro1=new Roulette();
  this.ro2=new Roulette();
  this.start=0;
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
    if (!no_report) { setTable(); }
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

//var path=new Path(0);
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
  durationC:10000,
  getRadius:(oFrac,pFrac)=>{
//    return orbs.frac*orbs.toOrb.getRadius(oFrac)+(1-orbs.frac)*orbs.fromOrb.getRadius(oFrac);
    return Math.sin(pFrac*Math.PI)*orbs.toOrb.getRadius(oFrac)+Math.sin((1-pFrac)*Math.PI)*orbs.fromOrb.getRadius(oFrac);
  },
  getHue:(oFrac)=>{
    let hdiff=orbs.frac*orbs.toOrb.huediff+(1-orbs.frac)*orbs.fromOrb.huediff;
    let midHue=orbs.frac*(orbs.toOrb.hue-orbs.fromOrb.hue)+orbs.fromOrb.hue;
    return (hdiff*oFrac+midHue)%360;
  },
  draw:(rotFrac)=>{
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
          rf*orbs.getRadius(metrics.oFrac, paths[0].frac),0,2*Math.PI);
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      let metrics2=paths[1].getMetrics(pFrac);
      ctx.arc(metrics2.x,metrics2.y, 
	  rf*orbs.getRadius(metrics2.oFrac, paths[1].frac),0,2*Math.PI);
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      let metrics3=paths[2].getMetrics(pFrac);
      ctx.arc(metrics3.x,metrics3.y, 
	  rf*orbs.getRadius(metrics3.oFrac, paths[2].frac),0,2*Math.PI);
      ctx.fill();
      ctx.closePath();

//      ctx.fill();
//      ctx.closePath();
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
//if (!PUBLISH) console.log("state "+orbs.state);

    Object.assign(this.fromOrb, this.toOrb);
    this.toOrb=new Orb(this.fromOrb);
    this.toOrb.hue=getRandomInt(0,360);
    this.toOrb.huediff=getRandomInt(0,180);
if (!PUBLISH) console.log("orb transit");
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
    //if (progress>40) {
    if (progress>4) {
      //ctx.fillStyle="hsla(0,0%,0%,0.03)";
      ctx.fillStyle="hsla(0,0%,0%,0.1)";
      ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
      fade.start=0;
//ctx.putImageData(ctx.getImageData(0,0,2*CSIZE,2*CSIZE),-1,0);
    }
    requestAnimationFrame(fade.animate);
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

onresize();
function start() {
  if (stopped) {
//    reset();
    requestAnimationFrame(orbs.animate);
    for (let p of paths) {
      requestAnimationFrame(p.animate);
    }
//    requestAnimationFrame(fade.animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
canvas.addEventListener("click", start, false);
reset();
start();

var reptable=document.querySelector('#reptable');
var GR=function(obj) {
  let row=(()=>{ 
    return document.createElement('tr');
  })();
  row.append((()=>{
    let label=document.createElement('td');
    label.textContent=obj.label;
    return label;
  })());
  this.td=document.createElement('td');
  this.td.setAttribute("colspan","4");
  this.td.style.textAlign="center";
  row.append(this.td);
  reptable.append(row);
  this.oc=obj.oc;
  let gself=this;
  this.report=()=>{
    obj.oc(gself.td);
  }
}
var SR=function(obj) {
  let row=(()=>{ 
    return document.createElement('tr');
  })();
  reptable.append(row);
  let label=document.createElement('td');
  label.textContent=obj.label;
  row.append(label);
  this.tds=[];
  for (let i=0; i<4; i++) {
    this.tds[i]=document.createElement('td');
    row.append(this.tds[i]);
  }
  let sself=this;
  this.report=()=>{
    obj.oc(sself.tds);
  }
}
var grs=[
  new GR({
    label:'points',
    oc:(td)=>{
      td.textContent=POINTS;
    }
  }),
  new GR({
    label:'cset',
    oc:(td)=>{
      td.textContent=cSet[0];
    }
  }),
  new GR({
    label:'cset count',
    oc:(td)=>{
      td.textContent=cSet.length;
    }
  }),
  new GR({
    label:'state',
    oc:(td)=>{
      td.textContent=orbs.state;
    }
  })
];
reptable.append((()=>{ 
  let tdl=(s)=>{ 
    let td=document.createElement('td');
    td.textContent=s;
    return td;
  }
  let tr=document.createElement('tr');
  tr.append(
    document.createElement('td'),
    tdl("from"),
    tdl("to"),
    tdl("from"),
    tdl("to")
  );
  return tr;
})());
var srs=[
/*
  new SR({
    label:'points',
    oc:(tds)=>{
      tds[2].textContent=POINTS;
    }
  }),
  new SR({
    label:'cset',
    oc:function(tds) {
      tds[0].textContent=cSet[0];
      tds[2].textContent=cSet.length;
    }
  }),
*/
  new SR({
    label:'m1',
    oc:function(tds) {
      tds[0].textContent=paths[0].ro1.m1;
      tds[1].textContent=paths[0].ro2.m1;
      tds[2].textContent=paths[1].ro1.m1;
      tds[3].textContent=paths[1].ro2.m1;
    }
  }),
  new SR({
    label:'m2',
    oc:function(tds) {
      tds[0].textContent=paths[0].ro1.m2;
      tds[1].textContent=paths[0].ro2.m2;
      tds[2].textContent=paths[1].ro1.m2;
      tds[3].textContent=paths[1].ro2.m2;
    }
  }),
  new SR({
    label:'m3',
    oc:(tds)=>{
      tds[0].textContent=paths[0].ro1.m3;
      tds[1].textContent=paths[0].ro2.m3;
      tds[2].textContent=paths[1].ro1.m3;
      tds[3].textContent=paths[1].ro2.m3;
    }
  }),
  new SR({
    label:'r1',
    oc:(tds)=>{
      tds[0].textContent=paths[0].ro1.r1.toFixed(0);
      tds[1].textContent=paths[0].ro2.r1.toFixed(0);
      tds[2].textContent=paths[1].ro1.r1.toFixed(0);
      tds[3].textContent=paths[1].ro2.r1.toFixed(0);
    }
  }),
/*
  new SR({
    label:'oRadius',
    oc:function(ft,tt) {
      ft.textContent=orbs.fromOrb.radius.toFixed(0);
      tt.textContent=orbs.toOrb.radius.toFixed(0);
    }
  }),
*/
];

function setTable() {
  for (let gr of grs) gr.report();
  for (let sr of srs) sr.report();
}
setTable();
