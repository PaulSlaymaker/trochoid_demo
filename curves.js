var CSIZE=400;

var canvas=document.querySelector('#cta');
onresize=function() {
  canvas.style.maxHeight=window.innerHeight-20+'px';
}

var ctx=canvas.getContext('2d');
ctx.translate(CSIZE,CSIZE);
ctx.rotate(-Math.PI/2);
ctx.lineWidth=3;

ctx.fillStyle='hsla(0,0%,0%,.01)';

var animateDuration=16000;
var cycleSet=7;
var complexDamper=5;
var curveCount=3;

function getRandomArrayValue(ar, skew) {
  if (skew==undefined) {
    skew=1;
  }
  return ar[Math.floor(ar.length*Math.pow(Math.random(),skew))];
}

var Roulette=function(ro) {
  if (ro instanceof Roulette) {
    Object.assign(this, ro);
  } else {
    this.radiiCount=1;
    this.type1=-1;
    this.type2=-1;
    this.type3=-1;
    this.c0=getCycle0Match();
    this.c1=7;
    this.c2=7;
    this.c3=7;
    this.r1=0;
    this.r2=0;
    this.r3=0;
    this.r4=0;
  }
  this.pts=this.zeroData();
}

Roulette.prototype.zeroData=function() {
  let zd=[[0,0]];
  for (var z=.01, counter=1; z<2*Math.PI; z+=.01) {
    zd[counter++]=[0,0];
  }
  return zd;
}

var primes=[2,3,5,7,11,13,17,19];

function getCycleArray(n) {
  let a=new Set();
  for (let p of primes) {
    if (n%p==0) {
      let cycsets2={
	2:[8,16],
	3:[9],
	5:[5],
	7:[7],
	11:[11],
	13:[13],
	17:[17],
	19:[19]
      };
      for (let f of cycsets2[p]) {
        a.add(f);
      }
    }
  }
  return Array.from(a);
}

Roulette.prototype.softCycle=function() {
  let ic=[this.c1,this.c2,this.c3];
  this.c1=this.setMatchingCycles();
  this.c2=this.setMatchingCycles();
  this.c3=this.setMatchingCycles();
  //this.c4=this.setMatchingCycles();
  let pc=[this.c1,this.c2,this.c3];
  let sc=0;
  for (let i=0; i<this.radiiCount; i++) {
    if (ic[i]!=pc[i]) {
      sc++;
      break;
    }
  }
  return sc;
}
 
Roulette.prototype.setMatchingCycles=function() {
  switch (cycleSet) {
    case 6: 
    case 12: 
    case 18: 
      return [6,12,18][Math.floor(3*Math.pow(Math.random(),complexDamper))];
    case 7: 
    case 14: 
      return [7,14][Math.floor(2*Math.pow(Math.random(),complexDamper))];
    case 8: 
    case 16: 
      return [8,16][Math.floor(2*Math.pow(Math.random(),complexDamper))];
    case 9: 
      return [9,18][Math.floor(2*Math.pow(Math.random(),complexDamper))];
  }
  return cycleSet;
}

Roulette.prototype.randomizeCycles=function() {  // rename this
  this.c1=this.setMatchingCycles();
  this.c2=this.setMatchingCycles();
  this.c3=this.setMatchingCycles();
  //this.c4=this.setMatchingCycles();
  //this.c0=getCycle0Match();
}

Roulette.prototype.randomizeRadiiGeneral=function() {
  let cDev=16;
  // TODO paramterize distances from CSIZE
  if (this.radiiCount==1) {
    this.r1=CSIZE/2+cDev*(1-2*Math.random());
    this.r2=(CSIZE-this.r1);
    this.r3=0;
    this.r4=0;
  } else if (this.radiiCount==2) {
    if (Math.random()<0.5) {
      this.r1=100+cDev*(1-2*Math.random());
      if (Math.random()<0.5) {
        this.r2=190+cDev*(1-2*Math.random());
        this.r3=this.r1-this.r2+cDev*(1-2*Math.random());
      } else {
        this.r2=100+cDev*(1-2*Math.random());
        this.r3=this.r1+this.r2+cDev*(1-2*Math.random());
      }
    } else {
      this.r1=190+cDev*(1-2*Math.random());
      this.r2=100+cDev*(1-2*Math.random());
      this.r3=this.r1-this.r2+cDev*(1-2*Math.random());
    }
    this.r4=0;
//if (this.r3<0) { debugger; }
  } else if (this.radiiCount==3) {
    if (Math.random()<0.5) {
      this.r1=100+cDev*(1-2*Math.random());
      this.r2=100+cDev*(1-2*Math.random());
      this.r3=100+cDev*(1-2*Math.random());
      this.r4=this.r1+this.r2-this.r3+cDev*(1-2*Math.random());
    } else {
      if (Math.random()<0.5) {
        this.r1=60+cDev*(1-2*Math.random());
        this.r2=60+cDev*(1-2*Math.random());
        this.r3=60+cDev*(1-2*Math.random());
        this.r4=this.r1+this.r2+this.r3+cDev*(1-2*Math.random());
      } else {
        this.r1=190+cDev*(1-2*Math.random());
        this.r2=60+cDev*(1-2*Math.random());
        this.r3=60+cDev*(1-2*Math.random());
        this.r4=this.r1-this.r2-this.r3+cDev*(1-2*Math.random());
      }
    }
//if (this.r4<0) { debugger; }
  } //else { debugger; }
}

Roulette.prototype.randomizeRadii=function() {
  let cDev=16;
  // TODO paramterize distances from CSIZE
  if (this.radiiCount==1) {
    this.r1=CSIZE/2+cDev*(1-2*Math.random());
    this.r2=(CSIZE-this.r1);
    this.r3=0;
    this.r4=0;
  } else if (this.radiiCount==2) {
    if (this.c1==this.c2) {
      this.r1=CSIZE/4+cDev*(1-2*Math.random());
      this.r2=190+cDev*(1-2*Math.random());
      this.r3=this.r2-this.r1+cDev*(1-2*Math.random());
    } else {
      if (Math.random()<0.5) {
        this.r1=CSIZE/2+cDev*(1-2*Math.random());
        this.r2=100+cDev*(1-2*Math.random());
        this.r3=this.r1-this.r2+cDev*(1-2*Math.random());
      } else {
        this.r1=100+cDev*(1-2*Math.random());
        this.r2=100+cDev*(1-2*Math.random());
        this.r3=this.r1+this.r2+cDev*(1-2*Math.random());
      }
    }
    this.r4=0;
//if (this.r3<0) { debugger; }
  } else if (this.radiiCount==3) {
    if (this.c1==this.c2 && this.c1==this.c3) {
      this.r1=100+cDev*(1-2*Math.random());
      this.r2=100+cDev*(1-2*Math.random());
      this.r3=100+cDev*(1-2*Math.random());
      this.r4=this.r1+this.r2-this.r3+cDev*(1-2*Math.random());
    } else if (this.c1==this.c2) {
      this.r1=60+cDev*(1-2*Math.random());
      this.r2=60+cDev*(1-2*Math.random());
      this.r3=60+cDev*(1-2*Math.random());
      this.r4=this.r1+this.r2-this.r3+cDev*(1-2*Math.random());
    } else if (this.c2==this.c3) {
      this.r1=190+cDev*(1-2*Math.random());
      this.r2=60+cDev*(1-2*Math.random());
      this.r3=60+cDev*(1-2*Math.random());
      this.r4=this.r1-this.r2-this.r3+cDev*(1-2*Math.random());
    } else {
      this.r1=100+cDev*(1-2*Math.random());
      this.r2=100+cDev*(1-2*Math.random());
      this.r3=100+cDev*(1-2*Math.random());
      this.r4=this.r1+this.r2-this.r3+cDev*(1-2*Math.random());
    }
//if (this.r4<0) { debugger; }
  } //else { debugger; }
}

Roulette.prototype.randomizeRadiiCount=function() {
  let rc=[1,2,3][Math.floor(3*Math.pow(Math.random(),complexDamper))];
  let rt=this.radiiCount!=rc?1:0;
  //this.radiiCount=[1,2,3][Math.floor(3*Math.pow(Math.random(),1.2))];
  this.radiiCount=rc;
  return rt;
}

Roulette.prototype.randomizeTypes=function() {
  let rt=0;
  switch (this.radiiCount) {
    case 1:
      if (Math.random()<0.7) { this.type1*=-1; rt++; }
      break;
    case 2:
      if (Math.random()<0.7) { this.type1*=-1; rt++; }
      if (Math.random()<0.7) { this.type2*=-1; rt++; }
      break;
    case 3:
      if (Math.random()<0.7) { this.type1*=-1; rt++; }
      if (Math.random()<0.7) { this.type2*=-1; rt++; }
      if (Math.random()<0.7) { this.type3*=-1; rt++; }
      break;
  }
  return rt;
}

Roulette.prototype.randomizeTypesO=function() {
  let rt=0;
  for (var j=0; j<this.radiiCount; j++) {
    let it=this.curveTypes[j];
    //if (Math.random()<0.1) {
    if (Math.random()<0.5) {
      this.curveTypes[j]=1;
    } else {
      this.curveTypes[j]=-1;
    }
    if(it!=this.curveTypes[j]) rt++;
  }
  return rt;
}

Roulette.prototype.randomizeCurve=function() {
let counter=0;
  let sweep=0;
  do {
    sweep=this.randomizeRadiiCount();
    if (!sweep) {
      sweep+=this.softCycle();
    }
    if (!sweep) {
       sweep+=this.randomizeTypes();
    }
//counter++
  } while (sweep==0);
//if (counter>3) {
//log('CCC '+counter);
//log('sweep '+sweep);
//}
  this.randomizeRadii();
  this.setCurve();
//setTable();
  return this;
}

Roulette.prototype.setCurve=function() {
  let offset=0;
  let x,y;
  let R=CSIZE;
  switch (this.radiiCount) {
    case 1:
      var f1=1+(this.type1*this.c1)/this.c0;
      x=this.r1*Math.cos(offset)+this.r2*Math.cos(f1*offset);
      y=this.r1*Math.sin(offset)+this.r2*Math.sin(f1*offset);
      this.pts[0]=[x,y];
      var counter=1;
      for (let z=.01*this.c0+offset; z<2*Math.PI*this.c0+offset; z+=.01*this.c0) {
	x=this.r1*Math.cos(z)+this.r2*Math.cos(f1*z);
	y=this.r1*Math.sin(z)+this.r2*Math.sin(f1*z);
	this.pts[counter++]=[x,y];
//R=Math.min(R, Math.pow(x*x+y*y,0.5));
      }
      break;
    case 2:
      var f1=1+(this.type1*this.c1)/this.c0;
      var f2=1+(this.type1*this.c1+this.type2*this.c2)/this.c0;
      x=this.r1*Math.cos(offset)+this.r2*Math.cos(f1*offset)+this.r3*Math.cos(f2*offset);
      y=this.r1*Math.sin(offset)+this.r2*Math.sin(f1*offset)+this.r3*Math.sin(f2*offset)
      this.pts[0]=[x,y];
      var counter=1;
      for (let z=.01*this.c0+offset; z<2*Math.PI*this.c0+offset; z+=.01*this.c0) {
	x=this.r1*Math.cos(z)+this.r2*Math.cos(f1*z)+this.r3*Math.cos(f2*z);
	y=this.r1*Math.sin(z)+this.r2*Math.sin(f1*z)+this.r3*Math.sin(f2*z);
	this.pts[counter++]=[x,y];
//R=Math.min(R, Math.pow(x*x+y*y,0.5));
      }
      break;
   case 3:
      var f1=1+(this.type1*this.c1)/this.c0;
      var f2=1+(this.type1*this.c1+this.type2*this.c2)/this.c0;
      var f3=1+(this.type1*this.c1+this.type2*this.c2+this.type3*this.c3)/this.c0;
      x=this.r1*Math.cos(0)+this.r2*Math.cos(0)+this.r3*Math.cos(0)+this.r4*Math.cos(0);
      y=this.r1*Math.sin(0)+this.r2*Math.sin(0)+this.r3*Math.sin(0)+this.r4*Math.sin(0)
      this.pts[0]=[x,y];
      var counter=1;
      for (let z=.01*this.c0; z<2*Math.PI*this.c0; z+=.01*this.c0) {
	x=this.r1*Math.cos(z)+this.r2*Math.cos(f1*z)+this.r3*Math.cos(f2*z)+this.r4*Math.cos(f3*z);
	y=this.r1*Math.sin(z)+this.r2*Math.sin(f1*z)+this.r3*Math.sin(f2*z)+this.r4*Math.sin(f3*z)
	this.pts[counter++]=[x,y];
//R=Math.min(R, Math.pow(x*x+y*y,0.5));
      }
      break;
  }

/*
if (this.radiiCount==3) {
Rarray.push({
  c0:this.c0,
  c1:this.c1,
  c2:this.c2,
  c3:this.c3,
  rc:this.radiiCount,
  type1:this.type1,
  type2:this.type2,
  type3:this.type3,
  r1:this.r1,
  r2:this.r2,
  r3:this.r3,
  r4:this.r4,
  patternr:''+Math.round(this.r1)+Math.round(this.r2)+Math.round(this.r3)+Math.round(this.r4),
  R:R
});
}
if (Rarray.length>200) stopped=true;
*/

}

var Curve=function(con,name) {
  this.aname=name;
  this.active=false;
  this.fromRo=new Roulette();
  this.toRo=new Roulette();
  this.fromHue=0;
  this.toHue=0;
  this.dStart=0;
  this.dDuration=animateDuration;
  this.dFrac=1;
/*
  this.randomizeHue=function(n) {
    if (C2.curves.length==1) {
      let hueDiff=120+120*(n%2);
      this.toHue=Math.round((con.toHue+hueDiff+20*(1-2*Math.random()))%360);
    } else {
debugger;
    } 
  }
*/
  this.getHue=function(frac) {
    let midHue=con.hFrac*(this.toHue-this.fromHue)+this.fromHue;
    return Math.round(midHue%360);
  }
  this.transit=function() {
    Object.assign(this.fromRo, this.toRo);
    this.toRo=new Roulette(this.fromRo);
    this.toRo.randomizeCurve();
    this.dDuration=animateDuration*(0.7+0.3*Math.random());
  }
  this.draw=function() {
    con.draw(this);
  }
  let cSelf=this;
  this.animate=function(ts) {
    if (stopped) { return; }
//if (cSelf.aname=='tre') { log('tre'); }
if (cSelf.active) {
    if (!cSelf.dStart) {
      cSelf.dStart=ts;
    }
    var dProg=ts-cSelf.dStart;
    if (dProg<cSelf.dDuration) {
      cSelf.dFrac=dProg/(cSelf.dDuration);
      cSelf.draw();
    } else {
      cSelf.dStart=0;
      cSelf.dFrac=0;
      cSelf.transit();
    }
}
    requestAnimationFrame(cSelf.animate);
  }
  this.sweepFactor=function() {
    let sf=0;
    if (cSelf.fromRo.radiiCount!=cSelf.toRo.radiiCount) {
      sf++;
    }
    let ic=[cSelf.fromRo.c1,cSelf.fromRo.c2,cSelf.fromRo.c3];
    let pc=[cSelf.toRo.c1,cSelf.toRo.c2,cSelf.toRo.c3];
    let it=[cSelf.fromRo.type1,cSelf.fromRo.type2,cSelf.fromRo.type3];
    let pt=[cSelf.toRo.type1,cSelf.toRo.type2,cSelf.toRo.type3];
    // not reliable
    for (let i=0; i<cSelf.toRo.radiiCount; i++) {
      if (ic[i]!=pc[i]) {
        sf++;
      }
      if (it[i]!=pt[i]) {
        sf++;
      }
    }
    return sf;
  }
}

var C2={
  fromHue:0,
  toHue:Math.round(Math.random()*360),
  //curves:[],
  cStart:0,
  cDuration:8000,
  cFrac:1,
  cTrans:'N',
  RX:120,
  hStart:0,
  hDuration:56000,
  hFrac:1,
  getHue:function() {
    return C2.hFrac*(this.toHue-this.fromHue)+this.fromHue;
  },
  transitCycle:function() {
    if (C2.cTrans=='N') {
      if (Math.random()<0.1) {	// publish @ 0.1
        C2.cTrans='T';
        C2.RX=120+100*(1-2*Math.random());
      }
    } else if (C2.cTrans=='T') {
      C2.cTrans='R';
      //cycleSet=getRandomInt(6,20,2);
      cycleSet=6+Math.floor(14*Math.pow(Math.random(),complexDamper));
      //for (let c of C2.curves) {
      for (let i=0; i<curveCount; i++) {
        let c=C2.curves[i];
        c.toRo.randomizeCycles();
        c.toRo.c0=getCycle0Match();
        c.toRo.randomizeCurve();
        Object.assign(c.fromRo, c.toRo);
        c.toRo.randomizeCycles();
        c.toRo.c0=getCycle0Match();
        c.toRo.randomizeCurve();
      }
//      C2.cStart=0;  //move
//      C2.cFrac=0;   // move?
    } else if (C2.cTrans=='R') {
//ctx.lineWidth=1;
//ctx.fillStyle='hsla(0,0%,0%,.01)';
      C2.cTrans='N';
    }
  },
  transitHue:function() {
    C2.fromHue=C2.toHue;
    C2.toHue=Math.round(Math.random()*360);
    //for (let i in C2.curves) {
    for (let i=0; i<curveCount; i++) {
      C2.curves[i].fromHue=C2.curves[i].toHue;
      if (curveCount==2) {
        let hueDiff=120+120*(i%2);
        C2.curves[i].toHue=Math.round((C2.toHue+hueDiff+20*(1-2*Math.random()))%360);
      } else if (curveCount==3) {
        let hueDiff=90+90*(i%3);
        C2.curves[i].toHue=Math.round((C2.toHue+hueDiff+20*(1-2*Math.random()))%360);
//log(i+' '+C2.curves[i].toHue);
      } else {
        debugger;
      }

      //C2.curves[i].randomizeHue(i);
    }

  },
  draw:function(curve) {
    ctx.beginPath();
    let x=cbLoc(curve.fromRo.pts[0][0],curve.toRo.pts[0][0],curve.dFrac);
    let y=cbLoc(curve.fromRo.pts[0][1],curve.toRo.pts[0][1],curve.dFrac);
    if (C2.cTrans=='T') {
//ctx.lineWidth=1-C2.cFrac+0.1*C2.cFrac;
//let o=0.01*(1-C2.cFrac)+0.05*C2.cFrac;
//ctx.fillStyle='hsla(0,0%,0%,'+o+')';
      let z=0;
      let fae=Math.pow(C2.cFrac,3);
      //ctx.moveTo(x*(1-C2.cFrac)+C2.RX*Math.cos(z)*C2.cFrac,y*(1-C2.cFrac));
      ctx.moveTo(x*(1-fae)+C2.RX*Math.cos(z)*fae,y*(1-fae));
      for (var i=1; i<629; i++) {
        z=i*Math.PI*2/629*curve.toRo.c0;
	x=cbLoc(curve.fromRo.pts[i][0],curve.toRo.pts[i][0],curve.dFrac);
	y=cbLoc(curve.fromRo.pts[i][1],curve.toRo.pts[i][1],curve.dFrac);
        //ctx.lineTo(x*(1-C2.cFrac)+C2.RX*Math.cos(z)*C2.cFrac,y*(1-C2.cFrac)+C2.RX*Math.sin(z)*C2.cFrac);
        ctx.lineTo(x*(1-fae)+C2.RX*Math.cos(z)*fae,y*(1-fae)+C2.RX*Math.sin(z)*fae);
      }
    } else if (C2.cTrans=='R') {
//ctx.lineWidth=0.1*(1-C2.cFrac)+C2.cFrac;
//let o=0.1*(1-C2.cFrac)+0.05*C2.cFrac;
//ctx.fillStyle='hsla(0,0%,0%,'+o+')';
      let z=0;
      let fae=Math.pow(1-C2.cFrac,3);
      ctx.moveTo(x*(1-fae)+C2.RX*Math.cos(z)*fae,y*(1-fae)+C2.RX*Math.sin(z)*fae);
      for (var i=1; i<629; i++) {
        z=i*Math.PI*2/629*curve.toRo.c0;
	x=cbLoc(curve.fromRo.pts[i][0],curve.toRo.pts[i][0],curve.dFrac);
	y=cbLoc(curve.fromRo.pts[i][1],curve.toRo.pts[i][1],curve.dFrac);
        ctx.lineTo(x*(1-fae)+C2.RX*Math.cos(z)*fae,y*(1-fae)+C2.RX*Math.sin(z)*fae);
      }
    } else { 
      ctx.moveTo(x,y);
      for (var i=1; i<629; i++) {
	x=cbLoc(curve.fromRo.pts[i][0],curve.toRo.pts[i][0],curve.dFrac);
	y=cbLoc(curve.fromRo.pts[i][1],curve.toRo.pts[i][1],curve.dFrac);
	ctx.lineTo(x,y);
      }
    }
    ctx.closePath();
    //ctx.strokeStyle=getGradient(curve.toHue);
    ctx.strokeStyle=getGradient(Math.round(curve.getHue(C2.hFrac)));
    ctx.stroke();
  },
  changeCurveCount() {
    if (curveCount==2) {
      if (Math.random()<0.5) {
        C2.addCurve3();
complexDamper*=2;
log('add curve');
      }
    } else {
      if (Math.random()<0.5) {
        C2.curves[2].active=false;
        curveCount=2;
complexDamper/=2;
log('remove curve');
      }
    }
  },
  animate:function(ts) {
    if (stopped) { return; }
    if (!C2.cStart) {
      C2.cStart=ts;
    }
    var cProg=ts-C2.cStart;
    if (cProg<C2.cDuration) {
      C2.cFrac=cProg/C2.cDuration;
    } else {
      C2.cStart=0;
      C2.cFrac=0;
      C2.transitCycle();
    }
    if (!C2.hStart) {
      C2.hStart=ts;
    }
    var hProg=ts-C2.hStart;
    if (hProg<C2.hDuration) {
      C2.hFrac=hProg/C2.hDuration;
    } else {
    //  if (Math.random()<0.1) {
        C2.transitHue();
//      }

      C2.changeCurveCount();
      C2.hFrac=0;
      C2.hStart=0;
    }
    requestAnimationFrame(C2.animate);
  },

  addCurve3() {
    //Object.assign(C2.curves[2], C2.curves[1]);
    C2.curves[2].fromRo=new Roulette(C2.curves[1].fromRo);
    C2.curves[2].toRo=new Roulette(C2.curves[1].toRo);
    C2.curves[2].fromRo.setCurve();
    C2.curves[2].toRo.setCurve();
    C2.curves[2].toRo.setCurve();
    C2.curves[2].fromHue=C2.curves[1].fromHue;
    C2.curves[2].toHue=Math.round((C2.toHue+90+20*(1-2*Math.random()))%360);
/*
    C2.curves[2].fromHue=C2.curves[1].getHue();
    C2.curves[2].toHue=Math.round((C2.toHue+90+20*(1-2*Math.random()))%360);
*/
    C2.curves[2].dStart=C2.curves[1].dStart;
    C2.curves[2].dDuration=C2.curves[1].dDuration;
    C2.curves[2].dFrac=C2.curves[1].dFrac;
    C2.curves[2].active=true;
    curveCount=3;
//setTable();
  },
  removeCurve3() {
    C2.curves[2].active=false;
    curveCount=2;
complexDamper/=2;
  },

  addCurve() {
    let nc=new Curve(C2,'add');
    Object.assign(nc, C2.curves[1]);
    nc.fromRo=new Roulette(C2.curves[1].fromRo);
    nc.toRo=new Roulette(C2.curves[1].toRo);
    nc.fromRo.setCurve();
    nc.toRo.setCurve();
    C2.curves.push(nc);
    requestAnimationFrame(C2.curves[2].animate);
    //C2.curves[2].animate();
//setTable();
  }

}
C2.curves=[new Curve(C2,'one'), new Curve(C2,'two'), new Curve(C2,'tre')];

var stopped=true;

function getGradient(hue) {
  let grad=ctx.createRadialGradient(0,0,0, 0,0,CSIZE);
  grad.addColorStop(0,  'hsl('+C2.getHue()+',100%,80%)');
  grad.addColorStop(0.5,'hsl('+hue+',90%,70%)'); 
  grad.addColorStop(1,  'hsl(0,0%,0%)');
  return grad;
}

function getCycle0Match() {
  let cd=3*complexDamper;
  switch (cycleSet) {
    case 2:
    case 4:
    case 8:
    case 16:
      return getRandomArrayValue([1,3,5,7,9,11,13,15,17,19],cd);
    case 3:
    case 9:
      return getRandomArrayValue([1,2,4,5,7,8,10,11,13,14,16,17,19],cd);
    case 5:
      return getRandomArrayValue([1,2,3,4,6,7,8,9,11,12,13,14,16,17,18,19],cd);
    case 6:
    case 12:
    case 18:
      return getRandomArrayValue([1,5,7,11,13,17,19],cd);
    case 7:
      return getRandomArrayValue([1,2,3,4,5,6,8,9,10,11,12,13,15,16,17,18,19],cd);
    case 10:
      return getRandomArrayValue([1,3,7,9,11,13,17,19],cd);
    case 11:
      return getRandomArrayValue([1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19],cd);
    case 13:
      return getRandomArrayValue([1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19],cd);
    case 14: 
      return getRandomArrayValue([1,3,5,9,11,13,15,17,19],cd);
    case 15: 
      return getRandomArrayValue([1,2,4,7,8,11,13,14,16,17,19],cd);
    case 17: 
      return getRandomArrayValue([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,19],cd);
    case 19: 
      return getRandomArrayValue([1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18],cd);
  }
  return false;
}

/*
function getSOL(count) {
  // [offset,opacity,sat,lum]
  let sa=[[0,1,90,80]];
  if (count==1) {
    return sa;
  } else if (count==2) {
    sa.push([1,1,90,80]);
    return sa;
  } else if (count==3) {
    sa.push([.8,0,0,0]);
    sa.push([1,0,0,0]);
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
*/

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
    if (progress>60) {
      ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
      fade.start=0;
    }
    requestAnimationFrame(fade.animate);
  }
}

function init() {
  canvas.addEventListener("click", start, false);
  let c0=getCycle0Match();
  C2.curves[0].fromRo.c0=c0;
  C2.curves[0].toRo.c0=c0;
  c0=getCycle0Match();
  C2.curves[1].fromRo.c0=c0;
  C2.curves[1].toRo.c0=c0;
  C2.curves[0].fromRo.randomizeCurve();
  C2.curves[1].fromRo.randomizeCurve();
  //C2.curves[2].fromRo.randomizeCurve();
  C2.curves[0].toRo.randomizeCurve();
  C2.curves[1].toRo.randomizeCurve();
  C2.curves[0].fromHue=Math.round((C2.toHue+120+20*(1-2*Math.random()))%360);
  C2.curves[0].toHue=Math.round((C2.toHue+120+20*(1-2*Math.random()))%360);
  C2.curves[1].fromHue=Math.round((C2.toHue+240+20*(1-2*Math.random()))%360);
  C2.curves[1].toHue=Math.round((C2.toHue+240+20*(1-2*Math.random()))%360);
  //C2.curves[2].toRo.randomizeCurve();
  C2.curves[0].active=true;
  C2.curves[1].active=true;
  //C2.curves[2].active=true;
  curveCount=2;
//setTable();
  start();
}

function start() {
  if (stopped) {
    stopped=false;
    document.querySelector('#ss').textContent='Stop';
    requestAnimationFrame(C2.curves[0].animate);
    requestAnimationFrame(C2.curves[1].animate);
    requestAnimationFrame(C2.curves[2].animate);
    //C2.curves[0].animate();
    //C2.curves[1].animate();
    //C2.curves[2].animate();
    //requestAnimationFrame(C2.curves[1].animate);
    //C2.curves[2].animate();
    //C2.animate();
    requestAnimationFrame(C2.animate);
    requestAnimationFrame(fade.animate);
  } else {
    stopped=true;
    document.querySelector('#ss').textContent='Start';
  }
}

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

var Ranger=function(id, label, rangeProps, rangeInput, lockInput) {
  this.box=document.querySelector('#'+id);
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
  labeldiv.textContent=label;
  this.displayDiv.appendChild(labeldiv);
  this.valueDiv=document.createElement('div');
  this.valueDiv.className='rep';
  this.displayDiv.appendChild(this.valueDiv);
  this.units=' ';
  this.input=document.createElement('input');
  this.input.type='range';
  this.input.className='range';
  this.input.min=rangeProps[0];
  this.input.max=rangeProps[1];
  this.input.step=rangeProps[2];
  this.input.value=rangeProps[3];
  let inputdiv=document.createElement('div');
  inputdiv.className='inputdiv';
  inputdiv.appendChild(this.input);
  this.box.appendChild(inputdiv);
  this.max=parseFloat(this.input.max);
  this.min=parseFloat(this.input.min);
  if (lockInput) {
    let lockdiv=document.createElement('div');
    lockdiv.className='rep lockdiv';
    this.box.children[3].appendChild(lockdiv);
    this.lockRep=document.createElement('div');
    this.lockRep.className='locksym';
    this.lockRep.innerHTML='&#128275';
    lockdiv.appendChild(this.lockRep);
    this.lockCB=document.createElement('input');
    this.lockCB.type='checkbox';
    this.lockCB.className='cb';
    lockdiv.appendChild(this.lockCB);
  }
  let rself=this;
  this.setValue=function(v) {
    rself.input.value=v;
    rself.report();
  }
  this.report=function() {
    //log('cc change to '+curveCount);
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
    rangeInput(rself.input.value);
  }
  if (lockInput) {
    this.lockCB.onmouseover=function() {
      rself.lockRep.style.color='blue';
    }
    this.lockCB.onmouseout=function() {
      rself.lockRep.style.color='black';
    }
    this.lockCB.onfocus=function() {
      rself.box.children[3].children[1].classList.add('infoc');
    }
    this.lockCB.onblur=function() {
      rself.box.children[3].children[1].classList.remove('infoc');
    }
    //this.setLock=function() { }
    this.lockCB.onclick=function() {
      if(rself.lockCB.checked) {
        rself.lock=true;
        rself.lockRep.innerHTML='&#128274';
        //return true;
      } else {
        rself.lock=false;
        rself.lockRep.innerHTML='&#128275';
        //return false;
      }
      lockInput(rself.lock);
    }
  }
}

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
      //cycleRanger.report();
      //widthRanger.report();
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
}

onresize();

var logging=false;	// publish @ false
function log(e) {
  if (logging) {
    console.log(Date().substring(16,25)+e);
  }
}
/*
var SR=function(obj) {
  let row=document.createElement('tr');
  let label=document.createElement('td');
  label.textContent=obj.label;
  row.appendChild(label);
  this.fromTD1=document.createElement('td');
  row.appendChild(this.fromTD1);
  this.toTD1=document.createElement('td');
  row.appendChild(this.toTD1);
  this.fromTD2=document.createElement('td');
  row.appendChild(this.fromTD2);
  this.toTD2=document.createElement('td');
  row.appendChild(this.toTD2);
  this.fromTD3=document.createElement('td');
  row.appendChild(this.fromTD3);
  this.toTD3=document.createElement('td');
  row.appendChild(this.toTD3);
  document.querySelector('#reptable').appendChild(row);
  this.oc=obj.oc;
  let sself=this;
  this.report=function(s) {
    obj.oc(sself.fromTD1,sself.toTD1,
           sself.fromTD2,sself.toTD2,
           sself.fromTD3,sself.toTD3
    );
  }
}
var srs=[
  new SR({
    label:'c0',
    oc:function(fr1,to1,fr2,to2,fr3,to3) {
      fr1.textContent=C2.curves[0].fromRo.c0;
      to1.textContent=C2.curves[0].toRo.c0;
      fr2.textContent=C2.curves[1].fromRo.c0;
      to2.textContent=C2.curves[1].toRo.c0;
      if (curveCount==3) {
        fr3.textContent=C2.curves[2].fromRo.c0;
        to3.textContent=C2.curves[2].toRo.c0;
      } else {
        fr3.textContent='';
        to3.textContent='';
      }
    }
  }),
  new SR({
    label:'c1',
    oc:function(fr1,to1,fr2,to2,fr3,to3) {
      fr1.textContent=C2.curves[0].fromRo.c1;
      to1.textContent=C2.curves[0].toRo.c1;
      fr2.textContent=C2.curves[1].fromRo.c1;
      to2.textContent=C2.curves[1].toRo.c1;
      if (curveCount==3) {
        fr3.textContent=C2.curves[2].fromRo.c1;
        to3.textContent=C2.curves[2].toRo.c1;
      } else {
        fr3.textContent='';
        to3.textContent='';
      }
    }
  }),
  new SR({
    label:'c2',
    oc:function(fr1,to1,fr2,to2,fr3,to3) {
      fr1.textContent=C2.curves[0].fromRo.c2;
      to1.textContent=C2.curves[0].toRo.c2;
      fr2.textContent=C2.curves[1].fromRo.c2;
      to2.textContent=C2.curves[1].toRo.c2;
      if (curveCount==3) {
        fr3.textContent=C2.curves[2].fromRo.c2;
        to3.textContent=C2.curves[2].toRo.c2;
      } else {
        fr3.textContent='';
        to3.textContent='';
      }
    }
  }),
  new SR({
    label:'c3',
    oc:function(fr1,to1,fr2,to2,fr3,to3) {
      fr1.textContent=C2.curves[0].fromRo.c3;
      to1.textContent=C2.curves[0].toRo.c3;
      fr2.textContent=C2.curves[1].fromRo.c3;
      to2.textContent=C2.curves[1].toRo.c3;
      if (curveCount==3) {
        fr3.textContent=C2.curves[2].fromRo.c3;
        to3.textContent=C2.curves[2].toRo.c3;
      } else {
        fr3.textContent='';
        to3.textContent='';
      }
    }
  }),
  new SR({
    label:'radc',
    oc:function(fr1,to1,fr2,to2,fr3,to3) {
      fr1.textContent=(C2.curves[0].fromRo.radiiCount+1);
      to1.textContent=(C2.curves[0].toRo.radiiCount+1);
      fr2.textContent=(C2.curves[1].fromRo.radiiCount+1);
      to2.textContent=(C2.curves[1].toRo.radiiCount+1);
      if (curveCount==3) {
        fr3.textContent=C2.curves[2].fromRo.radiiCount+1;
        to3.textContent=C2.curves[2].toRo.radiiCount+1;
      } else {
        fr3.textContent='';
        to3.textContent='';
      }
    }
  }),
  new SR({
    label:'type1',
    oc:function(fr1,to1,fr2,to2,fr3,to3) {
      fr1.textContent=C2.curves[0].fromRo.type1;
      to1.textContent=C2.curves[0].toRo.type1;
      fr2.textContent=C2.curves[1].fromRo.type1;
      to2.textContent=C2.curves[1].toRo.type1;
      if (curveCount==3) {
        fr3.textContent=C2.curves[2].fromRo.type1;
        to3.textContent=C2.curves[2].toRo.type1;
      } else {
        fr3.textContent='';
        to3.textContent='';
      }
    }
  }),
  new SR({
    label:'type2',
    oc:function(fr1,to1,fr2,to2,fr3,to3) {
      fr1.textContent=C2.curves[0].fromRo.type2;
      to1.textContent=C2.curves[0].toRo.type2;
      fr2.textContent=C2.curves[1].fromRo.type2;
      to2.textContent=C2.curves[1].toRo.type2;
      if (curveCount==3) {
        fr3.textContent=C2.curves[2].fromRo.type2;
        to3.textContent=C2.curves[2].toRo.type2;
      } else {
        fr3.textContent='';
        to3.textContent='';
      }
    }
  }),
  new SR({
    label:'type3',
    oc:function(fr1,to1,fr2,to2,fr3,to3) {
      fr1.textContent=C2.curves[0].fromRo.type3;
      to1.textContent=C2.curves[0].toRo.type3;
      fr2.textContent=C2.curves[1].fromRo.type3;
      to2.textContent=C2.curves[1].toRo.type3;
      if (curveCount==3) {
        fr3.textContent=C2.curves[2].fromRo.type3;
        to3.textContent=C2.curves[2].toRo.type3;
      } else {
        fr3.textContent='';
        to3.textContent='';
      }
    }
  }),
  new SR({
    label:'r1',
    oc:function(fr1,to1,fr2,to2,fr3,to3) {
      fr1.textContent=C2.curves[0].fromRo.r1.toFixed(0);
      to1.textContent=C2.curves[0].toRo.r1.toFixed(0);
      fr2.textContent=C2.curves[1].fromRo.r1.toFixed(0);
      to2.textContent=C2.curves[1].toRo.r1.toFixed(0);
      if (curveCount==3) {
        fr3.textContent=C2.curves[2].fromRo.r1.toFixed(0);
        to3.textContent=C2.curves[2].toRo.r1.toFixed(0);
      } else {
        fr3.textContent='';
        to3.textContent='';
      }
    }
  }),
  new SR({
    label:'r2',
    oc:function(fr1,to1,fr2,to2,fr3,to3) {
      fr1.textContent=C2.curves[0].fromRo.r2.toFixed(0);
      to1.textContent=C2.curves[0].toRo.r2.toFixed(0);
      fr2.textContent=C2.curves[1].fromRo.r2.toFixed(0);
      to2.textContent=C2.curves[1].toRo.r2.toFixed(0);
      if (curveCount==3) {
        fr3.textContent=C2.curves[2].fromRo.r2.toFixed(0);
        to3.textContent=C2.curves[2].toRo.r2.toFixed(0);
      } else {
        fr3.textContent='';
        to3.textContent='';
      }
    }
  }),
  new SR({
    label:'r3',
    oc:function(fr1,to1,fr2,to2,fr3,to3) {
      fr1.textContent=C2.curves[0].fromRo.r3.toFixed(0);
      to1.textContent=C2.curves[0].toRo.r3.toFixed(0);
      fr2.textContent=C2.curves[1].fromRo.r3.toFixed(0);
      to2.textContent=C2.curves[1].toRo.r3.toFixed(0);
      if (curveCount==3) {
        fr3.textContent=C2.curves[2].fromRo.r3.toFixed(0);
        to3.textContent=C2.curves[2].toRo.r3.toFixed(0);
      } else {
        fr3.textContent='';
        to3.textContent='';
      }
    }
  }),
  new SR({
    label:'r4',
    oc:function(fr1,to1,fr2,to2) {
      fr1.textContent=C2.curves[0].fromRo.r4.toFixed(0);
      to1.textContent=C2.curves[0].toRo.r4.toFixed(0);
      fr2.textContent=C2.curves[1].fromRo.r4.toFixed(0);
      to2.textContent=C2.curves[1].toRo.r4.toFixed(0);
    }
  }),
  new SR({
    label:'dur',
    oc:function(fr1,to1,fr2,to2,fr3,to3) {
      to1.textContent=C2.curves[0].dDuration.toFixed(0);
      to2.textContent=C2.curves[1].dDuration.toFixed(0);
      if (curveCount==3) {
        to2.textContent=C2.curves[2].dDuration.toFixed(0);
      } else {
        to3.textContent='';
      }
    }
  }),
  new SR({
    label:'sf',
    oc:function(fr1,to1,fr2,to2,fr3,to3) {
      to1.textContent=C2.curves[0].sweepFactor();
      to2.textContent=C2.curves[1].sweepFactor();
      if (curveCount==3) {
        to3.textContent=C2.curves[2].sweepFactor();
      } else {
        to3.textContent='';
      }
    }
  }),
  new SR({
    label:'hue',
    oc:function(fr1,to1,fr2,to2,fr3,to3) {
      fr1.textContent=C2.curves[0].fromHue;
      to1.textContent=C2.curves[0].toHue;
      fr2.textContent=C2.curves[1].fromHue;
      to2.textContent=C2.curves[1].toHue;
      if (curveCount==3) {
        fr3.textContent=C2.curves[2].fromHue;
        to3.textContent=C2.curves[2].toHue;
      } else {
        fr3.textContent='';
        to3.textContent='';
      }
    }
  }),
];
function setTable() {
  for (let sr of srs) {
    sr.report();
  }
}
*/

//Rarray=[];

init();

