var MAX_COUNT=4;

function resize() {
  document.getElementById('asvg').style.maxHeight=window.innerHeight-20+'px';
}
onresize=resize;

var curves=[
  {'rc':2,'ct':[-1,-1,-1],'c0':1,'c1':3,'c2':3,'c3':3,'r':[0,0,0,0],'fdata':getZeroData().slice(),'tdata':getZeroData().slice(),dur:7,start:null,active:false,zs:false,'reset':true},
  {'rc':1,'ct':[-1,-1,-1],'c0':2,'c1':3,'c2':3,'c3':3,'r':[0,0,0,0],'fdata':getZeroData().slice(),'tdata':getZeroData().slice(),dur:7,start:null,active:false,zs:false,'reset':true},
  {'rc':3,'ct':[-1,-1,-1],'c0':4,'c1':3,'c2':3,'c3':3,'r':[0,0,0,0],'fdata':getZeroData().slice(),'tdata':getZeroData().slice(),dur:7,start:null,active:false,zs:false,'reset':true},
  {'rc':1,'ct':[-1,-1,-1],'c0':5,'c1':3,'c2':3,'c3':3,'r':[0,0,0,0],'fdata':getZeroData().slice(),'tdata':getZeroData().slice(),dur:7,start:null,active:false,zs:false,'reset':true}
];

var stopped;
var halts={
  stop:false,
  cycleChange:false,
  durationChange:false,
  pause:false,
  gradient:false,
}

var animateDuration=10;
var rotationFactor=.15;
var pause=0;
var curveCount=3;
var curveCountChangeRate=.3;
var curveCountLock=false;
var cycleSet=3;

//////
var cycleChangeRate=.35;
//////
var cycleLock=false;
var curveTypeChangeRate=.7;
var fillHueChangeRate=.3;
var curveChangeRate=.15;

function getZeroData() {
  var zd=[[0,0]];
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

var fillColor={
  fromFillHSL:[40,60,60],
  toFillHSL:[40,60,60],
  hueDiff:0,
  duration:animateDuration,
  lock:true,
  start:null,
  active:false,
  randomize:function() {
    this.fromFillHSL=this.toFillHSL.slice();
    this.hueDiff=fillHueChangeRate*(180-Math.round(360*Math.random()));
    if (this.fromFillHSL[0]+this.hueDiff>360 || this.fromFillHSL[0]+this.hueDiff<0) { 
      this.hueDiff*=-1;
    }
    this.toFillHSL[0]=this.fromFillHSL[0]+Math.round(this.hueDiff);
    var col=this.getHSLString();
    document.querySelectorAll('.fillCol').forEach(function(hdiv) {
      hdiv.style.backgroundColor=col;
    });
    document.getElementById('hueRep').textContent=this.toFillHSL[0];
    document.getElementById('hueSel').value=this.toFillHSL[0];
  },
  getHSLString:function() {
    return 'hsl('+this.toFillHSL[0]+','+this.toFillHSL[1]+'%,'+this.toFillHSL[2]+'%)'; 
  }
};
//path.style.fill=fillColor.getHSLString();
path.style.fill='url(#phsRG)';

var lineColor={
  fromLineHSL:[220,100,80],
  toLineHSL:[220,100,80],
  hueDiff:0,
  duration:animateDuration,
  lock:true,
  start:null,
  active:false,
  fillOffset:90,
  randomize:function() {
    this.fromLineHSL=this.toLineHSL.slice();
    if (Math.random()<.3) {
      this.fillOffset=[90,180,240][getRandomInt(0,3)]; 
    }
    var lineHue=(fillColor.toFillHSL[0]+this.fillOffset)%360;
    this.hueDiff=lineHue-this.toLineHSL[0];
    if (this.fromLineHSL[0]+this.hueDiff>360 || this.fromLineHSL[0]+this.hueDiff<0) { 
      this.hueDiff*=-1;
    }
    this.toLineHSL[0]=lineHue;
    var col=this.getHSLString();
      document.querySelectorAll('.lineCol').forEach(function(hdiv) {
      hdiv.style.backgroundColor=col;
    });
    document.getElementById('lineHueRep').textContent=this.toLineHSL[0];
    document.getElementById('lineHueSel').value=this.toLineHSL[0];
  },
  getHSLString:function() {
    return 'hsl('+this.toLineHSL[0]+','+this.toLineHSL[1]+'%,'+this.toLineHSL[2]+'%)'; 
  },
  getHSLAString:function() {
    //return 'hsla('+this.toLineHSL[0]+','+this.toLineHSL[1]+'%,'+this.toLineHSL[2]+'%,'+lineWO.toOpacity+')'; 
    return 'hsl('+this.toLineHSL[0]+','+this.toLineHSL[1]+'%,'+this.toLineHSL[2]+'%)'; 
  }
};
//path.style.stroke=lineColor.getHSLString();

var duration={
  factor:1,
  reset:true,
  changeSpeed:function(si) {
    this.factor=1/Math.pow((parseInt(si.value)+2)/6,2);
    this.reset=true;
  },
  change:function() {
    if (this.reset) {
      this.reset=false;
    }
  },
  setDuration:function(anime,s) {
    anime.setAttribute('dur',s*this.factor+'s');
    this.reset=true;
  },
  set:function(anime,d) {
    anime.setAttribute('dur',d);
    this.reset=true;
  }
};

var zoom={
  fromScale:1,
  toScale:1,
  duration:animateDuration,
  lock:false,
  start:null,
  active:false,
  randomize:function() {
    this.fromScale=this.toScale;
    var zf=(curveCount+cycleSet-7)/10;
    //this.toScale=1+zf*Math.random();
this.toScale=1+zf*Math.random()+.2;
    document.getElementById('zoomRep').textContent=(this.toScale*100).toFixed(0)+'%';
    document.getElementById('zoomSel').value=this.toScale;
  }
}

var Stop=function(number,oArr) {
  this.number=number
  this.el=document.createElementNS("http://www.w3.org/2000/svg", "stop");
  this.el.setAttribute('offset',oArr[0]);
  this.el.setAttribute('stop-opacity',oArr[1]);
  this.fromOffset=oArr[0];
  this.toOffset=oArr[0];
  this.oLock=true;
  this.oTime=0;
  this.oActive=false;
  this.fromHSL=[40,90,80];
  this.toHSL=[getRandomInt(0,360),90,80];
  this.fromHSL[0]=this.toHSL[0];
  this.el.setAttribute('stop-color',this.getHSLString());
  this.cLock=true;
  this.cTime=0;
  this.cActive=false;
  this.hueDiff=0;
  this.fromOpacity=oArr[1];
  this.toOpacity=oArr[1];
  this.state='';
  if (oArr[0]==0) {
    this.state='zero';
  } else if (oArr[0]==1) {
    this.state='black';
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
  this.setRandomColor=function() {
    this.hueDiff=0;
    this.toHSL[0]=Math.round(360*Math.random());
    this.fromHSL[0]=this.toHSL[0];
    this.el.setAttribute('stop-color',this.getHSLString());
  }
  this.randomize=function() {
    this.fromOffset=this.toOffset;
    this.toOffset=so[this.number][0];
    this.fromOpacity=this.toOpacity;
    this.toOpacity=so[this.number][1];
  }

  this.randomizeDuration=function() {
    this.animateDuration=duration*(.3+.7*Math.random());
  }
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
  //let fos=cbLoc(this.fromOffset,this.toOffset,frac);
  let fos=this.toOffset*frac+this.fromOffset*(1-frac);
  this.el.setAttribute('offset',fos);
}

Stop.prototype.setMidFade=function(frac) {
  //this.el.setAttribute('stop-opacity',1-frac);
  let op=this.toOpacity*frac+this.fromOpacity*(1-frac);
  this.el.setAttribute('stop-opacity',op);
}

Stop.prototype.setMidColor=function(frac) {
  if (this.state=='fade') {
    var fill='hsl('+this.fromHSL[0]+','+this.toHSL[1]+'%,'+this.toHSL[2]*(1-frac)+'%)';
  } else {
    let hue=(this.fromHSL[0]+Math.round(this.hueDiff*frac)+360)%360;
    var fill='hsl('+hue+','+this.toHSL[1]+'%,'+this.toHSL[2]+'%)';
  }
  this.el.setAttribute('stop-color',fill);
}

Stop.prototype.inactivate=function() {
  if (this.state=='active' || this.state=='fade') {
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

function changeCurveCount(cc) {
  switch(cc) {
    case 1:
      switch (curveCount) {
	case 2:
	  curves[1].tdata=getZeroData().slice();
          break;
	case 3:
	  curves[1].tdata=getZeroData().slice();
	  curves[2].tdata=getZeroData().slice();
          break;
	case 4:
	  curves[1].tdata=getZeroData().slice();
	  curves[2].tdata=getZeroData().slice();
	  curves[3].tdata=getZeroData().slice();
          break;
      }
      curveCount=1;
      break;
    case 2:
      switch (curveCount) {
	case 1:
          randomizeCurve(1);
	  break;
	case 3:
	  curves[2].tdata=getZeroData().slice();
	  break;
	case 4:
	  curves[2].tdata=getZeroData().slice();
	  curves[3].tdata=getZeroData().slice();
	  break;
      }
      curveCount=2;
      break;
    case 3:
      switch (curveCount) {
	case 1:
          randomizeCurve(1);
          randomizeCurve(2);
	  break;
	case 2:
          randomizeCurve(2);
	  break;
	case 4:
	  curves[3].tdata=getZeroData().slice();
	  break;
      }
      curveCount=3;
      break;
    case 4:
      switch (curveCount) {
	case 1:
          randomizeCurve(1);
          randomizeCurve(2);
          randomizeCurve(3);
	  break;
	case 2:
          randomizeCurve(2);
          randomizeCurve(3);
	  break;
        case 3:
          randomizeCurve(3);
          break;
      }
      curveCount=4;
      break;
  }
  document.getElementById('ccRep').textContent=curveCount;
  document.getElementById('ccRange').value=curveCount;
  drawCurves();
}

function switchCurveCount(cc) {
  switch(cc) {
    case 1:
      switch (curveCount) {
	case 2:
	  curves[1].zs=true;
	  reduce=true;
	  break;
	case 3:
	  curves[1].zs=true;
	  curves[2].zs=true;
	  reduce=true;
	  break;
	case 4:
	  curves[1].zs=true;
	  curves[2].zs=true;
	  curves[3].zs=true;
	  reduce=true;
	  break;
      }
      curveCount=1;
      break;
    case 2:
      switch (curveCount) {
	case 1:
	  curves[1].active=true;
	  break;
	case 3:
	  curves[2].zs=true;
	  reduce=true;
	  break;
	case 4:
	  curves[2].zs=true;
	  curves[3].zs=true;
	  reduce=true;
          break;
      }
      curveCount=2;
      break;
    case 3:
      switch (curveCount) {
	case 1:
	  curves[1].active=true;
	  curves[2].active=true;
	  break;
	case 2:
	  curves[2].active=true;
	  break;
	case 4:
	  curves[3].zs=true;
	  reduce=true;
	  break;
      }
      curveCount=3;
      break;
    case 4:
      switch (curveCount) {
	case 1:
	  curves[1].active=true;
	case 2:
	  curves[2].active=true;
	case 3:
	  curves[3].active=true;
      }
      curveCount=4;
      break;
  }
}

function randomCurveCountChange(inloop) {
  var rate=inloop?curveCountChangeRate/curveCount:curveCountChangeRate;
  if (Math.random()>rate) {
    return false;
  }
  var sel=powerRandom(cycleSet/13);
  var reduce=false;
  if (sel<.05) { 
    switchCurveCount(1);
  } else if (sel<.2) { 
    switchCurveCount(2);
  } else if (sel<.8) { 
    switchCurveCount(3);
  } else {
    switchCurveCount(4);
  }
  document.getElementById('ccRep').textContent=curveCount;
  document.getElementById('ccRange').value=curveCount;
}

function setCurve(cn) {
  var offset=function() {
    if (Math.random()<rotationFactor) {
      return offset=Math.random()*Math.PI;
    } else {
      return 0;
    } 
  }();
  var d;
  var r1=curves[cn].r[0];
  var r2=curves[cn].r[1];
  var r3=curves[cn].r[2];
  var r4=curves[cn].r[3];
  var c0=curves[cn].c0;
  var c1=curves[cn].c1;
  var c2=curves[cn].c2;
  var c3=curves[cn].c3;
  switch (curves[cn].rc) {
    case 1:
      var f1=1+(curves[cn].ct[0]*c1)/c0;
      var x=r1*Math.cos(offset)+r2*Math.cos(f1*offset);
      var y=r1*Math.sin(offset)+r2*Math.sin(f1*offset);
      curves[cn].tdata[0]=[x,y];
      var counter=1;
      for (var z=.01*c0+offset; z<2*Math.PI*c0+offset; z+=.01*c0) {
	x=r1*Math.cos(z)+r2*Math.cos(f1*z);
	y=r1*Math.sin(z)+r2*Math.sin(f1*z);
	curves[cn].tdata[counter++]=[x,y];
      }
      break;
    case 2:
      var f1=1+(curves[cn].ct[0]*c1)/c0;
      var f2=1+(curves[cn].ct[0]*c1+curves[cn].ct[1]*c2)/c0;
      var x=r1*Math.cos(offset)+r2*Math.cos(f1*offset)+r3*Math.cos(f2*offset);
      var y=r1*Math.sin(offset)+r2*Math.sin(f1*offset)+r3*Math.sin(f2*offset);
      curves[cn].tdata[0]=[x,y];
      var counter=1;
      for (var z=.01*c0+offset; z<2*Math.PI*c0+offset; z+=.01*c0) {
	x=r1*Math.cos(z)+r2*Math.cos(f1*z)+r3*Math.cos(f2*z);
	y=r1*Math.sin(z)+r2*Math.sin(f1*z)+r3*Math.sin(f2*z);
        curves[cn].tdata[counter++]=[x,y];
      }
      break;
    case 3:
      var f1=1+(curves[cn].ct[0]*c1)/c0;
      var f2=1+(curves[cn].ct[0]*c1+curves[cn].ct[1]*c2)/c0;
      var f3=1+(curves[cn].ct[0]*c1+curves[cn].ct[1]*c2+curves[cn].ct[2]*c3)/c0;
      var x=r1*Math.cos(offset)+r2*Math.cos(f1*offset)+r3*Math.cos(f2*offset)+r4*Math.cos(f3*offset);
      var y=r1*Math.sin(offset)+r2*Math.sin(f1*offset)+r3*Math.sin(f2*offset)+r4*Math.sin(f3*offset);
      curves[cn].tdata[0]=[x,y];
      var counter=1;
      for (var z=.01*c0+offset; z<2*Math.PI*c0+offset; z+=.01*c0) {
	x=r1*Math.cos(z)+r2*Math.cos(f1*z)+r3*Math.cos(f2*z)+r4*Math.cos(f3*z);
	y=r1*Math.sin(z)+r2*Math.sin(f1*z)+r3*Math.sin(f2*z)+r4*Math.sin(f3*z);
        curves[cn].tdata[counter++]=[x,y];
      }
      break;
  }
  d+='z';
  return d;
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
  curves[0].c1=cycleSet;
  curves[0].c2=cycleSet;
  curves[0].c3=cycleSet;
  curves[0].c4=cycleSet;
  curves[0].c0=getCycle0Match();
  for (var cn=1; cn<MAX_COUNT; cn++) {
    if (cycleSet==10) {
      curves[cn].c1=Math.random()<.05?5:10;
      curves[cn].c2=Math.random()<.05?5:10;
      curves[cn].c3=Math.random()<.05?5:10;
      curves[cn].c4=Math.random()<.05?5:10;
    } else if (cycleSet==12) {
      curves[cn].c1=Math.random()<.1?6:12;
      curves[cn].c2=Math.random()<.1?6:12;
      curves[cn].c3=Math.random()<.1?6:12;
      curves[cn].c4=Math.random()<.1?6:12;
    } else if (cycleSet==14) {
      curves[cn].c1=Math.random()<.2?7:14;
      curves[cn].c2=Math.random()<.2?7:14;
      curves[cn].c3=Math.random()<.2?7:14;
      curves[cn].c4=Math.random()<.2?7:14;
    } else if (cycleSet==16) {
      curves[cn].c1=Math.random()<.3?Math.random()<.1?4:8:16;
      curves[cn].c2=Math.random()<.3?Math.random()<.1?4:8:16;
      curves[cn].c3=Math.random()<.3?Math.random()<.1?4:8:16;
      curves[cn].c4=Math.random()<.3?Math.random()<.1?4:8:16;
    } else {
      curves[cn].c1=cycleSet;
      curves[cn].c2=cycleSet;
      curves[cn].c3=cycleSet;
      curves[cn].c4=cycleSet;
    }
    curves[cn].c0=getCycle0Match();
  }
}

function randomizeCycles() {
  var goodArray=function() {
    switch (curveCount) {
      case 1: return [17,16,15,14,13,12,11,10,9,8,7,6];
      case 2: return [14,15,13,16,12,17,11,10,9,8,7,6];
      case 3: return [10,11,9,12,8,13,7,14,6,15,16,17];
    }
    return [6,7,8,9,10,11,12,13,14,15,16,17];
  }
  cycleSet=goodArray()[getRandomInt(0,12,4)];
  resetCycleSet();
  document.getElementById('cvRep').textContent=cycleSet;
  document.getElementById('cvRange').value=cycleSet;
}

function centralFactor(cn) {
  var cf=curves[cn].r[0]; 
  for (var j=1; j<curves[cn].rc+1; j++) {
    cf-=curves[cn].r[j];
    cf=Math.abs(cf);
  }
  return cf;
}

function curveComplexity() {
  var comp=0;
  for (var cn=0; cn<curveCount; cn++) {
    comp+=curves[cn].rc;
  }
  return comp/curveCount;
}

function randomTen() {
  return 10-20*Math.random();
}

function randomizeRadii(cn) {
  var f1=80/(curves[cn].rc+1);
  var f2=2*curves[cn].rc*f1;
  for (var i=0; i<curves[cn].rc+1; i++) {
    curves[cn].r[i]=f1+f2*Math.random();
  }
  if (curves[cn].rc==1) {
    var cFactor=centralFactor(cn);
    if (cFactor>20) {
      curves[cn].r[1]=curves[cn].r[0]+randomTen();
    }
  }
  var maxC=function() {
    var maxr=0;
    for (var i=0; i<curves[cn].rc+1; i++) {
      maxr+=curves[cn].r[i];
    }
    return maxr;
  }();
  var fac=zoom.toScale*200/maxC;
  if (cn==0) {
    for (var i=0; i<curves[cn].rc+1; i++) {
      curves[cn].r[i]*=fac;
    }
  } else if (maxC>zoom.toScale*200) {
    for (var i=0; i<curves[cn].rc+1; i++) {
      curves[cn].r[i]*=fac;
    }
  }
}

function randomizeCurve(cn,initial) {
  curves[cn].fdata=curves[cn].tdata.slice();
  if (initial || Math.random()<.7) {
    curves[cn].rc=[1,2,3][getRandomInt(0,3,curveCount/1.2 /*TODO include cycleSet*/)];
    for (var j=0; j<curves[cn].rc; j++) {
      if (Math.random()<.05) {
	curves[cn].ct[j]=1;
      } else {
	curves[cn].ct[j]=-1;
      }
    }
  }
  randomizeRadii(cn);
  setCurve(cn);
  curves[cn].dur=animateDuration*(.3+.7*Math.random());
}

function isAnimationActive() {
  for (var i=0; i<curveCount; i++) {
    if (curves[i].active) {
      return true;
    }
  }
  if (fillColor.active) { 
    return true; 
  }
  for (let stop of stops) {
    if (stop.state=='active' || stop.state=='fade') {
      return true; 
    }
  }
/*
  if (zoom.active) {
    return true;
  }
  if (rotation.active) { 
    return true; 
  }
  if (lineColor.active) { 
    return true; 
  }
  if (lineWO.active) { 
    return true; 
  }
  if (pauseTS) {
    return true;
  }
*/
  return false;
}

function drawCurves() {
  var d='';
  for (var cn=0; cn<curveCount; cn++) {
    d+='M'+curves[cn].tdata[0][0]+' '+curves[cn].tdata[0][1];
    for (var i=1; i<629; i++) {
      d+='L'+curves[cn].tdata[i][0]+' '+curves[cn].tdata[i][1];
    }
    d+='z';
  }
  path.setAttribute('d',d);
}

function drawCurve(cn) {
  var d='';
  d+='M'+curves[cn].tdata[0][0]+' '+curves[cn].tdata[0][1];
  for (var i=1; i<629; i++) {
    d+='L'+curves[cn].tdata[i][0]+' '+curves[cn].tdata[i][1];
  }
  d+='z';
  path.setAttribute('d',d);
}

function lineCurve(cn) {
  if (curves[cn].tdata[0][0]==0 && curves[cn].tdata[0][1]==0) {
    return '';
  }
  var d='';
  d+='M'+curves[cn].tdata[0][0]+' '+curves[cn].tdata[0][1];
  for (var i=1; i<629; i++) {
    d+='L'+curves[cn].tdata[i][0]+' '+curves[cn].tdata[i][1];
  }
  d+='z';
  return d;
}

function isLineActive() {
  for (var i=0; i<curveCount; i++) {
    if (curves[i].active) {
      return true;
    }
  }
  return false;
}

function cbLoc(p1,p2,frac) {
  var f1=.1;
  var f2=.9;
  var e1=Math.pow(1-frac,3)*p1;
  var e2=3*frac*Math.pow(1-frac,2)*(p1+(p2-p1)*f1);
  var e3=3*(1-frac)*Math.pow(frac,2)*(p1+(p2-p1)*f2);
  var e4=Math.pow(frac,3)*p2;
  return e1+e2+e3+e4;
}

function animate(ts) {
  for (let stop of stops) {
    //if (stop.oActive) {
    if (stop.state=='active' || stop.state=='fade') {
      if (!stop.oTime) {
        stop.oTime=ts;
      }
      var progress=ts-stop.oTime;
      if (progress<stop.animateDuration*1000) {
        let frac=progress/(stop.animateDuration*1000);
        stop.setMidOffset(frac);
        stop.setMidFade(frac);
//        active=true;
      } else {
        stop.oTime=0;
        //if (halts.stop || halts.gradient) {
        if (halts.stop || halts.cycleChange || halts.pause || halts.durationChange) {
          stop.inactivate();
        } else {
	  if (stop.state=='fade') {
	    stop.state='black';
stop.el.setAttribute('offset',1);
stop.el.setAttribute('stop-opacity',0);
//report('faded');
	    insertStop();
	    deleteStop();
	    randomizeStops();
	  } else {
	    stop.el.setAttribute('offset',stop.toOffset);
	    stop.el.setAttribute('stop-opacity',stop.toOpacity);
//	    if (stop.state=='active') {
	      stop.randomize();
//	    }
	  }
        }
      }
    }
  }

  var endMove=false;
  var d='';
  for (var cn=0; cn<MAX_COUNT; cn++) {
    if (curves[cn].active) {
      if (!curves[cn].start) {
	curves[cn].start=ts;
      }
      var progress=ts-curves[cn].start;
      if (progress<curves[cn].dur*1000) {
	var frac=progress/(curves[cn].dur*1000);
	d+='M';
        d+=cbLoc(curves[cn].fdata[0][0],curves[cn].tdata[0][0],frac);
        d+=' ';
        d+=cbLoc(curves[cn].fdata[0][1],curves[cn].tdata[0][1],frac);
	for (var i=1; i<629; i++) {
	  d+='L';
	  d+=cbLoc(curves[cn].fdata[i][0],curves[cn].tdata[i][0],frac);
	  d+=' ';
	  d+=cbLoc(curves[cn].fdata[i][1],curves[cn].tdata[i][1],frac);
	}
        d+='z';
      } else {
	if (curves[cn].zs) {
	    curves[cn].fdata=curves[cn].tdata.slice();
	    curves[cn].tdata=getZeroData().slice();
	    curves[cn].zs=false;
	    curves[cn].active=true;
	    curves[cn].start=false;
        } else if (halts.stop || halts.cycleChange || halts.pause || halts.durationChange) {
          curves[cn].active=false;
        } else {
          if (cn<curveCount) {
            if (!curveCountLock) {
	      randomCurveCountChange(true);
            }
	    if (Math.random()<.15) {
	      curves[cn].c0=getCycle0Match();
	    }
	    if (Math.random()<cycleChangeRate/curveCount && !cycleLock) {
	      halts.cycleChange=true;
	    }
	    randomizeCurve(cn);
	    curves[cn].start=ts;
	    if (Math.random()<.2/curveCount) {
	      if (!fillColor.active && !fillColor.lock) {
		fillColor.randomize();
                if (!lineColor.lock) {
		  lineColor.randomize();
                }
		fillColor.active=true;
		fillColor.start=false;
	      }
	    }
	    if (Math.random()<.05 && !zoom.lock) {
	      if (!zoom.active) {
		zoom.randomize();
		//zoom.active=true;
		//zoom.start=false;
	      }
	    }
          } else {
            // clean up zeroed curves
	    curves[cn].active=false; 
          }
        }
	endMove=true;
      }
    } else {
      d+=lineCurve(cn);
    }
  }

/* turn off line and color
  if (fillColor.active) {
    if (!fillColor.start) {
      fillColor.start=ts;
    }
    var progress=ts-fillColor.start;
    if (progress<animateDuration*1000) {
      var frac=progress/(animateDuration*1000);
      var fhue=(fillColor.fromFillHSL[0]+Math.round(fillColor.hueDiff*frac)+360)%360;
      var fill='hsl('+fhue+','+fillColor.toFillHSL[1]+'%,'+fillColor.toFillHSL[2]+'%)'; 
      path.style.fill=fill;
      var lhue=(lineColor.fromLineHSL[0]+Math.round(lineColor.hueDiff*frac)+360)%360;
      var stroke='hsl('+lhue+','+lineColor.toLineHSL[1]+'%,'+lineColor.toLineHSL[2]+'%)'; 
      path.style.stroke=stroke;
    } else {
      fillColor.active=false;
    }
  }
*/

  if (!endMove) {
    path.setAttribute('d',d);
  }

/*
  if (isLineActive()) {
    requestAnimationFrame(animate);
  } else {
*/

    // TODO nonlineactive
    if (isAnimationActive()) {
      requestAnimationFrame(animate);
    } else {
      if (halts.stop) {
	stopped=true;
      } else {
        for (let stop of stops) {
          stop.randomize();
          stop.activate();
        }
        stops[stops.length-2].state='fade';
	if (halts.cycleChange) {
	  randomizeCycles();
//console.log(new Date()+'C1');
	  halts.cycleChange=false;
	} else if (Math.random()<cycleChangeRate && !cycleLock) {
	  randomizeCycles();
	}
	for (var cn=0; cn<curveCount; cn++) {
	  randomizeCurve(cn);
	  curves[cn].active=true;
	  curves[cn].start=false;
	}
	requestAnimationFrame(animate);
      }
    }
//  }
}

function start() {
  stopped=false;
  halts.stop=false;
  for (let stop of stops) {
    stop.activate();
  }
  for (var cn=0; cn<curveCount; cn++) {
    randomizeCurve(cn,true);
    curves[cn].active=true;
    curves[cn].start=false;
  }
  if (!fillColor.lock) {
    fillColor.randomize();
    lineColor.randomize();
    fillColor.active=true;
    fillColor.start=false;
  }
  requestAnimationFrame(animate);
}

function stop() {
  halts.stop=true;
}

function hideCurve2(ts) {
  var z=document.querySelector('.c2show');
  if (z==null) {
  } else {
    z.className="c2hide";
    requestAnimationFrame(hideCurve2);
  }
}
function showCurve2(ts) {
  var z=document.querySelector('.c2hide');
  if (z==null) {
  } else {
    z.className="c2show";
    requestAnimationFrame(showCurve2);
  }
}

function changeDuration(si) {
/*
  if (isAnimationActive()) {
    halts.durationChange=true;
  } else {
    animateDuration=si.value;
  }
*/
    animateDuration=si.value;
  document.getElementById('durRep').textContent=si.value+'s';
}

function changeRotation(si) {
  rotationFactor=si.value;
  document.getElementById('rotRep').textContent=(si.value*100).toFixed(0)+'%';
}

function changePause(si) {
  pause=si.value;
}

function changeDamp(si) {
  curveChangeRate=si.value;
}

function inputCurveCount(si) {
  document.getElementById('ccRep').textContent=si.value;
  if (isAnimationActive()) {
    document.getElementById('kCount').checked=true;
    curveCountLock=true;
    switchCurveCount(parseInt(si.value));
  } else {
    changeCurveCount(parseInt(si.value));
  }
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
  if (isAnimationActive()) {
    cycleLock=true;
    document.getElementById('kCycle').checked='checked';
  } else {
    for (var cn=0; cn<curveCount; cn++) {
      setCurve(cn);
    }
    drawCurves();
  }
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
  if (isAnimationActive()) {
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

function changeFillSaturation(inp) {
  fillColor.toFillHSL[1]=parseInt(inp.value);
  document.getElementById('satRep').textContent=inp.value+'%';
  var col=fillColor.getHSLString();
  document.querySelectorAll('.fillCol').forEach(function(hdiv) {
    hdiv.style.backgroundColor=col;
  });
  ctx.fillStyle=fillColor.getHSLString();
  if (isAnimationActive()) {
  } else {
    drawCurves();
  }
}

function changeFillLuminosity(inp) {
  fillColor.toFillHSL[2]=parseInt(inp.value);
  document.getElementById('lumRep').textContent=inp.value+'%';
  var col=fillColor.getHSLString();
  document.querySelectorAll('.fillCol').forEach(function(hdiv) {
    hdiv.style.backgroundColor=col;
  });
  ctx.fillStyle=fillColor.getHSLString();
  if (isAnimationActive()) {
  } else {
    drawCurves();
  }
}

function inputLineWidth(inp) {
  path.style.setProperty('stroke-width',inp.value,'');
  document.getElementById('widthRep').textContent=parseFloat(inp.value).toFixed(1);
}

function changeLineHue(inp) {	// immediate
  lineColor.toLineHSL[0]=parseInt(inp.value);
  document.getElementById('lineHueRep').textContent=inp.value;
  var col=lineColor.getHSLString();
  document.querySelectorAll('.lineCol').forEach(function(hdiv) {
    hdiv.style.backgroundColor=col;
  });
  path.style.stroke=lineColor.getHSLAString();
  if (isAnimationActive()) {
    document.getElementById('kLineHue').checked=true;
    lineColor.lock=true;
    lineColor.active=false;
  } else {
    drawCurves();
  }
}

function lockLineHue(cb) {
  if (cb.checked) {
    lineColor.lock=true;
  } else {
    lineColor.lock=false;
    halts.durationChange=true;  // no change, just resync
  }
}

function changeLineSaturation(inp) {
  lineColor.toLineHSL[1]=parseInt(inp.value);
  document.getElementById('lineSatRep').textContent=inp.value;
  var col=lineColor.getHSLString();
  document.querySelectorAll('.lineCol').forEach(function(hdiv) {
    hdiv.style.backgroundColor=col;
  });
  path.style.stroke=lineColor.getHSLAString();
  if (isAnimationActive()) {
  } else {
    drawCurves();
  }
}

function changeLineLuminosity(inp) {	// immediate
  lineColor.toLineHSL[2]=parseInt(inp.value);
  document.getElementById('lineLumRep').textContent=inp.value;
  var col=lineColor.getHSLString();
  document.querySelectorAll('.lineCol').forEach(function(hdiv) {
    hdiv.style.backgroundColor=col;
  });
  path.style.stroke=lineColor.getHSLAString();
  if (isAnimationActive()) {
  } else {
    drawCurves();
  }
}

function resetScale() {
  var rescale=zoom.toScale/zoom.fromScale;
  for (var cn=0; cn<curveCount; cn++) {
    for (var i=0; i<curves[cn].rc+1; i++) {
      curves[cn].r[i]*=rescale;
    }
    setCurve(cn);
  }
  drawCurves();
}

function inputZoom(inp) {
  zoom.fromScale=zoom.toScale;
  zoom.toScale=parseFloat(inp.value);
  document.getElementById('zoomRep').textContent=(inp.value*100).toFixed(0)+'%';
  //sgroup.style.transform='scale('+inp.value+')';
  zoom.active=false;
  if (isAnimationActive()) {
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

//////////

function randomizeStops() {
  for (let i=1; i<stops.length-1; i++) {
    stops[i].randomize();
    //stops[i].randomizeDuration();
  }
  //stops[stops.length-2].setOffset(1);
  stops[stops.length-2].state='fade';
}

var gradient=document.querySelector('#phsRG');

function getSO(count) {
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

var so=getSO(3);
var fadeOffset=so[so.length-2];
var stops=[];

for (let i in so) {
  let stopx=new Stop(i,so[i]);
  if (so[i][0]==1) {
    //stopx.el.setAttribute('stop-opacity',0);
    stopx.el.setAttribute('stop-color','#333');
  }
  if (so[i]==fadeOffset) {
    stopx.state='fade';
  }
  stops.push(stopx);
  gradient.appendChild(stopx.el);
}

function insertStop() {
  stops.unshift(new Stop(0,[0,1]));
  stops[0].state='zero';
  stops[1].state='active';  // maybe 'rest'
  stops[1].oActive=true;
  gradient.insertBefore(stops[0].el, gradient.firstChild);
  for (let i in stops) {
    stops[i].number=i;
  }
  // set position flags here
}

function deleteStop() {
  gradient.removeChild(gradient.lastElementChild);
  stops.pop();
}

function increaseStops() {
so=getSO(4); insertStop(); fadeOffset=so[so.length-2];
}


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
    mdata.divstyle.width=Math.min(180+frac*(mdata.wd-180), mdata.wd) + 'px';
  } else {
    mdata.divstyle.height=mdata.ht-Math.min(frac*mdata.ht, mdata.ht) + 'px';
    var mWidth=mdata.wd-(mdata.wd-180)*frac;
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
    checkMenus();
  } else {
    mdata.open=show;
    requestAnimationFrame(function(ts) { menuAnimate(ts,mdata); });
    setMenu(menu,show);
  }
}

resize();

start();

function report(l) {
  let s='';
  for (let stop of stops) { 
    s+=' '+stop.state;
  }
  console.log(l+' '+s);
  let rep=''
  let ss=gradient.getElementsByTagName('stop');
  for (let ele of ss) {
    //rep+=' '+parseFloat(ele.getAttribute('offset')).toFixed(3);
    rep+=' '+ele.getAttribute('stop-color');
    rep+=' '+ele.getAttribute('stop-opacity');
  }
  console.log(rep);

}
