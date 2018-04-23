var LOW=true;

function resize() {
  document.getElementById('asvg').style.maxHeight=window.innerHeight-20+'px';
}
onresize=resize;

var ET='epitrochoid';
var HT='hypotrochoid';
var EET='epiepitrochoid';
var HET='hypoepitrochoid';
var EHT='epihypotrochoid';
var HHT='hypohypotrochoid';
var HHHT='h3trochoid';
var curves=[
  {'type':ET,'c1':3,'c2':3,'c3':3,'r3':0,'r4':20,'reset':true},
  {'type':HT,'c1':3,'c2':3,'r3':0,'reset':true},
  {'type':HT,'c1':3,'c2':3,'r1':50,'r2':50,'r3':0,'reset':true}
];
var rotationFactor=1;
var pause=0;
var transition;
var color='random';
var symmetry=3; // 1:permit 2-cycle, 2:3-cycle, 3:4 and up
var curveChangeRate=.15;
var ONE=0;
var TWO=1;
var THREE=2;
var curveCount=TWO;

function getZeroCurve() {
  var d='M0 0';
  for (var z=.01; z<2*Math.PI; z+=.01) {
    d+='L0 0';
  }
  d+='z';
  return d;
}

var path=document.getElementById('rpath');
var a2=document.createElementNS("http://www.w3.org/2000/svg", "animate");
a2.setAttribute('attributeName','d');
a2.setAttribute('to',getZeroCurve()+' '+getZeroCurve());
a2.setAttribute('fill','freeze');
a2.setAttribute('begin','indefinate');
a2.setAttribute('restart','whenNotActive');
a2.setAttribute("calcMode", "spline");
a2.setAttribute("keyTimes", "0;1");
a2.setAttribute("keySplines", ".4 0 .6 1");
path.appendChild(a2);

var qcol=document.createElementNS("http://www.w3.org/2000/svg", "animate");
qcol.setAttribute('attributeName','fill');
qcol.setAttribute('to','white');
qcol.setAttribute('from','white');
qcol.setAttribute('dur','1ms');
qcol.setAttribute('fill','freeze');
path.appendChild(qcol);

var acol=document.createElementNS("http://www.w3.org/2000/svg", "animate");
acol.setAttribute('attributeName','fill');
acol.setAttribute('to','white');
acol.setAttribute('from','white');
acol.setAttribute('fill','freeze');
path.appendChild(acol);

var duration={
  factor:1,
  reset:true,
  changeSpeed:function(si) {
    duration.factor=1/Math.pow((parseInt(si.value)+2)/6,2);
    duration.reset=true;
  },
  change:function() {
    if (duration.reset) {
      a2.setAttribute('dur',4*duration.factor+'s');
      acol.setAttribute('dur',4*duration.factor+'s');
      duration.reset=false;
    }
  },
  setDuration:function(anime,s) {
    anime.setAttribute('dur',s*duration.factor+'s');
    duration.reset=true;
  },
  set:function(anime,d) {
    anime.setAttribute('dur',d);
    duration.reset=true;
  }
};

function getRandomInt(min, max, low) {
  min=Math.ceil(min);
  max=Math.floor(max);
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min; 
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

function getCurve(cn) {
  var offset=rotationFactor*Math.random()*Math.PI;
  var d;
  var r1=curves[cn].r1;
  var r2=curves[cn].r2;
  var r3=curves[cn].r3;
  var c0=curves[cn].c0;
  var c1=curves[cn].c1;
  var c2=curves[cn].c2;
  switch (curves[cn].type) {
    case HT:
      var f1=c1/c0-1;
      var x=r1*Math.cos(offset)+r2*Math.cos(f1*offset);
      var y=r1*Math.sin(offset)-r2*Math.sin(f1*offset);
      d='M'+x+' '+y;
      for (var z=.01*c0+offset; z<2*Math.PI*c0+offset; z+=.01*c0) {
	d+='L';
	x=r1*Math.cos(z)+r2*Math.cos(f1*z);
	d+=x+' ';
	y=r1*Math.sin(z)-r2*Math.sin(f1*z);
	d+=y;
      }
      break;
    case EHT:
      var f1=c1/c0-1;
      var f2=(c2-c1)/c0+1;
      var x=r1*Math.cos(offset)+r2*Math.cos(f1*offset)+r3*Math.cos(f2*offset);
      var y=r1*Math.sin(offset)-r2*Math.sin(f1*offset)+r3*Math.sin(f2*offset);
      d='M'+x+' '+y;
      for (var z=.01*c0+offset; z<2*Math.PI*c0+offset; z+=.01*c0) {
	d+='L';
	x=r1*Math.cos(z)+r2*Math.cos(f1*z)+r3*Math.cos(f2*z);
	d+=x+' ';
	y=r1*Math.sin(z)-r2*Math.sin(f1*z)+r3*Math.sin(f2*z);
	d+=y;
      }
      break;
    case HHT:
      var f1=c1/c0-1;
      var f2=(c2+c1)/c0-1;
      var x=r1*Math.cos(offset)+r2*Math.cos(f1*offset)+r3*Math.cos(f2*offset);
      var y=r1*Math.sin(offset)-r2*Math.sin(f1*offset)-r3*Math.sin(f2*offset);
      d='M'+x+' '+y;
      for (var z=.01*c0+offset; z<2*Math.PI*c0+offset; z+=.01*c0) {
	d+='L';
	x=r1*Math.cos(z)+r2*Math.cos(f1*z)+r3*Math.cos(f2*z);
	d+=x+' ';
	y=r1*Math.sin(z)-r2*Math.sin(f1*z)-r3*Math.sin(f2*z);
	d+=y;
      }
      break;
    case EET:
      var f1=c1/c0+1;
      var f2=(c1+c2)/c0+1;
      var x=r1*Math.cos(offset)+r2*Math.cos(f1*offset)+r3*Math.cos(f2*offset);
      var y=r1*Math.sin(offset)+r2*Math.sin(f1*offset)+r3*Math.sin(f2*offset);
      d='M'+x+' '+y;
      for (var z=.01*c0+offset; z<2*Math.PI*c0+offset; z+=.01*c0) {
	d+='L';
	x=r1*Math.cos(z)+r2*Math.cos(f1*z)+r3*Math.cos(f2*z);
	d+=x+' ';
	y=r1*Math.sin(z)+r2*Math.sin(f1*z)+r3*Math.sin(f2*z);
	d+=y;
      }
      break
    case HET:
      var f1=c1/c0+1;
      var f2=(c2-c1)/c0-1;
      var x=r1*Math.cos(offset)+r2*Math.cos(f1*offset)+r3*Math.cos(f2*offset);
      var y=r1*Math.sin(offset)+r2*Math.sin(f1*offset)-r3*Math.sin(f2*offset);
      d='M'+x+' '+y;
      for (var z=.01*c0+offset; z<2*Math.PI*c0+offset; z+=.01*c0) {
	d+='L';
	x=r1*Math.cos(z)+r2*Math.cos(f1*z)+r3*Math.cos(f2*z);
	d+=x+' ';
	y=r1*Math.sin(z)+r2*Math.sin(f1*z)-r3*Math.sin(f2*z);
	d+=y;
      }
      break;
    case ET:
      var f1=c1/c0+1;
      var x=r1*Math.cos(offset)+r2*Math.cos(f1*offset);
      var y=r1*Math.sin(offset)+r2*Math.sin(f1*offset);
      d='M'+x+' '+y;
      for (var z=.01*c0+offset; z<2*Math.PI*c0+offset; z+=.01*c0) {
	d+='L';
	x=r1*Math.cos(z)+r2*Math.cos(f1*z);
	d+=x+' ';
	y=r1*Math.sin(z)+r2*Math.sin(f1*z);
	d+=y;
      }
      break;
  }
  d+='z';
  return d;
}      

function randomizeRadii() {
  [[0],[0,1],[0,1,2]][curveCount].forEach(function(cn) {
    if (curves[cn].type==ET || curves[cn].type==HT) { 
      if (curves[cn].r1Keep==undefined) {
	curves[cn].r1=45+90*Math.random();
      }
      if (curves[cn].drawKeep==undefined) {
	curves[cn].r2=45+90*Math.random();
      }
    } else {
      if (curves[cn].r1Keep==undefined) {
	curves[cn].r1=30+60*Math.random();
      }
      if (curves[cn].drawKeep==undefined) {
	curves[cn].r2=30+60*Math.random();
      }
      if (curves[cn].r3Keep==undefined) {
	curves[cn].r3=30+60*Math.random();
      }
    }
  });
}

function getMatchingCycle(cycle) {
  switch (cycle) {
    case 2:
     return 2*getRandomInt(1,7);
    case 3:
     return 3*getRandomInt(1,5);
    case 4:
    case 8:
    case 12:
     if (symmetry<2) {
       return 2*getRandomInt(1,7);
     } else {
       return 4*getRandomInt(1,4);
     }
    case 5:
    case 10:
    case 15:
     return 5*getRandomInt(1,4);
    case 7:
     return 7*getRandomInt(1,3);
    case 9:
     if (symmetry<3) {
       return 3*getRandomInt(1,4);
     } else {
       return 9;
     }
    default:
     return cycle;
  }
}

function getLowMatchingCycle(cycle) {
  switch (cycle) {
    case 2:
     return 2*getRandomInt(1,7,LOW);
    case 3:
     return 3*getRandomInt(1,5,LOW);
    case 4:
    case 8:
    case 12:
     if (symmetry<2) {
       return 2*getRandomInt(1,7,LOW);
     } else {
       return 4*getRandomInt(1,4,LOW);
     }
    case 5:
    case 10:
    case 15:
     return 5*getRandomInt(1,4,LOW);
    case 7:
     return 7*getRandomInt(1,3,LOW);
    case 9:
     if (symmetry<3) {
       return 3*getRandomInt(1,4,LOW);
     } else {
       return 9;
     }
    default:
     return cycle;
  }
}

function setCycles(cn) {
  var crv=curves[cn];
  var s=(ET==crv.type || HT==crv.type);
  [2,3,5].forEach(function(f) {	// 10 cycles max
    if (s) {
      //while (crv.c0%f==0 && crv.c1%f==0 && crv.c1>2) {
      while (crv.c0%f==0 && crv.c1%f==0) {
	crv.c0/=f;
	crv.c1/=f;
      }
    } else {
      //while (crv.c0%f==0 && crv.c1%f==0 && crv.c2%f==0 && crv.c1>2 && crv.c2>2) {
      while (crv.c0%f==0 && crv.c1%f==0 && crv.c2%f==0) {
	crv.c0/=f;
	crv.c1/=f;
	crv.c2/=f;
      }
    }
  });
}

function reduceable2(cn) {
  var crv=curves[cn];
  return ([2,3,5,7,11,13].some(function(f) {	
    return (crv.c0%f==0 && crv.c1%f==0);
  }));
}

function reduceable3(cn3) {
  var crv=curves[cn3];
  return ([2,3,5,7,11,13].some(function(f) {
    return (crv.c0%f==0 && crv.c1%f==0 && crv.c2%f==0);
  }));
}

function getLowC1() {
  switch(symmetry) {
    case 1:
      return 2;
    case 2:
      return 3;
    case 3:
      return 4;
  }
  return 3;
}

function get222Set() {
  var lowC1=getLowC1();
  do {
    do { 
      curves[0].c1=getRandomInt(lowC1,16);
      curves[1].c1=curves[0].c1;
      curves[2].c1=curves[0].c1;
    } while (curves[0].c1==curves[0].c0 || curves[0].c1==curves[1].c0 || curves[2].c1==curves[0].c0 || curves[2].c1==curves[1].c0);
  } while (reduceable2(0) || reduceable2(1) || reduceable2(2));
}

function get223Set(cn3) {
  var cn2a;
  var cn2b;
  if (cn3==0) {
    cn2a=1;
    cn2b=2;
  } else if (cn3==1) {
    cn2a=0;
    cn2b=2;
  } else {
    cn2a=0;
    cn2b=1;
  }
  var lowC1=getLowC1();
  do {
    curves[0].c1=getRandomInt(lowC1,16,LOW);
    curves[1].c1=getLowMatchingCycle(curves[0].c1);
    curves[2].c1=getLowMatchingCycle(curves[0].c1);
    curves[cn3].c2=getLowMatchingCycle(curves[0].c1);
  } while (reduceable2(cn2a) || reduceable2(cn2b) || reduceable3(cn3));
}

function get233Set(cn2) {
  var cn3a;
  var cn3b;
  if (cn2==0) {
    cn3a=1;
    cn3b=2;
  } else if (cn2==1) {
    cn3a=0;
    cn3b=2;
  } else {
    cn3a=0;
    cn3b=1;
  }
  var lowC1=getLowC1();
  do {
    curves[0].c1=getRandomInt(lowC1,16);
    curves[1].c1=getLowMatchingCycle(curves[0].c1);
    curves[2].c1=getLowMatchingCycle(curves[0].c1);
    curves[cn3a].c2=getLowMatchingCycle(curves[0].c1);
    curves[cn3b].c2=getLowMatchingCycle(curves[0].c1);
  } while (reduceable2(cn2) || reduceable3(cn3a) || reduceable3(cn3b));
}

function get333Set() {
  var lowC1=getLowC1();
  do {
    curves[0].c1=getRandomInt(lowC1,16,LOW);
    curves[1].c1=getLowMatchingCycle(curves[0].c1);
    curves[2].c1=getLowMatchingCycle(curves[0].c1);
    curves[0].c2=getLowMatchingCycle(curves[0].c1);
    curves[1].c2=getLowMatchingCycle(curves[0].c1);
    curves[2].c2=getLowMatchingCycle(curves[0].c1);
  } while (reduceable3(0) || reduceable3(1) || reduceable3(2));
}

function get22Set() {
  var lowC1=getLowC1();
  do {
    do { 
      curves[0].c1=getRandomInt(lowC1,16);
      curves[1].c1=curves[0].c1;
    } while (curves[0].c1==curves[0].c0 || curves[0].c1==curves[1].c0);
  } while (reduceable2(0) || reduceable2(1));
}

function get23Set(cn3) {
  var cn2=cn3==1?0:1;
  var lowC1=getLowC1();
  do {
    curves[0].c1=getRandomInt(lowC1,16);
    curves[1].c1=getMatchingCycle(curves[0].c1);
    curves[cn3].c2=getMatchingCycle(curves[0].c1);
  } while (reduceable2(cn2) || reduceable3(cn3));
}

function get33Set() {
  var lowC1=getLowC1();
  do {
    curves[1].c0=getRandomInt(1,16);
    curves[0].c1=getRandomInt(lowC1,16);
    curves[1].c1=getMatchingCycle(curves[0].c1);
    curves[0].c2=getMatchingCycle(curves[0].c1);
    curves[1].c2=getMatchingCycle(curves[0].c1);
  } while (reduceable3(0) || reduceable3(1));
}

function getPreferredRandomCurve(curve) {
  var sel=Math.random();
  if (sel<.09) {
    curve.type=EET;
  } else if (sel<.21) {
    curve.type=ET;
  } else if (sel<.36) {
    curve.type=HET;
  } else if (sel<.55) {
    curve.type=EHT;
  } else if (sel<.76) {
    curve.type=HHT;
  } else {
    curve.type=HT;
  }
}
function getRandomCurve(cn) {
  curves[cn].type=[ET,EET,HET,HT,EHT,HHT][getRandomInt(0,6)];
}

function randomizeSym1Curve() {
  if (Math.random()<curveChangeRate) {
    if (curves[0].typeKeep==undefined) {
      getRandomCurve(0);
    }
    if (curves[0].c0Keep==undefined) {
      curves[0].c0=getRandomInt(1,16,LOW);
    }
    var lowC1=getLowC1();
    if (curves[0].type==ET || curves[0].type==HT) { 
      do {
	curves[0].c1=getRandomInt(lowC1,16);
      } while (curves[0].c1==curves[0].c0 || reduceable2(0));
    } else {
      do {
	curves[0].c1=getRandomInt(lowC1,16);
	curves[0].c2=getMatchingCycle(curves[0].c1);
      } while (curves[0].c1==curves[0].c0 || reduceable3(0));
    }
  }
  randomizeRadii();
}

function randomizeSym3Curves() {
  var reset=false;
  var change=Math.random()<curveChangeRate;
  curves.forEach(function(curve) {
    if (change || curve.reset) {
      if (curve.typeKeep==undefined) {
	getPreferredRandomCurve(curve);
      }
      if (curve.c0Keep==undefined) {
	curve.c0=getRandomInt(1,16,LOW);
      }
      reset=true;
    }
    curve.reset=false;
  });
  if (reset) {
    [0,1,2].forEach(function(cn) {
      if (curves[0].type==ET || curves[0].type==HT) { 
	if (curves[1].type==ET || curves[1].type==HT) { 
	  if (curves[2].type==ET || curves[2].type==HT) { 
            get222Set();
          } else {
	    get223Set(2);
          }
	} else {
	  if (curves[2].type==ET || curves[2].type==HT) { 
	    get223Set(1);
          } else {
	    get233Set(0);
          }
	}
      } else {
	if (curves[1].type==ET || curves[1].type==HT) { 
	  if (curves[2].type==ET || curves[2].type==HT) { 
	    get223Set(0);
          } else {
	    get233Set(1);
          }
	} else {
	  if (curves[2].type==ET || curves[2].type==HT) { 
	    get233Set(2);
          } else {
	    get333Set();
          }
	}
      }
    });
  }
  randomizeRadii();
}

function randomizeSym2Curves() {
  var reset=false;
  var change=Math.random()<curveChangeRate;
  curves.forEach(function(curve) {
    if (change || curve.reset) {
      if (curve.typeKeep==undefined) {
	getPreferredRandomCurve(curve);
      }
      if (curve.c0Keep==undefined) {
	curve.c0=getRandomInt(1,16,LOW);
      }
      reset=true;
    }
    curve.reset=false;
  });
  if (reset) {
    [0,1].forEach(function(cn) {
      if (curves[0].type==ET || curves[0].type==HT) { 
	if (curves[1].type==ET || curves[1].type==HT) { 
	  get22Set();
	} else {
	  get23Set(1);
	}
      } else {
	if (curves[1].type==ET || curves[1].type==HT) { 
	  get23Set(0);
	} else {
	  get33Set();
	}
      }
    });
  }
  randomizeRadii();
}

function scaleToFit() {
  if ([[0],[0,1],[0,1,2]][curveCount].every(function(cn) {
     return curves[cn].drawKeep==undefined && curves[cn].r1Keep==undefined && curves[cn].r3Keep==undefined;
  })) {
    var maxC=1;
    [[0],[0,1],[0,1,2]][curveCount].forEach(function(cn) {
      if (ET==curves[cn].type || HT==curves[cn].type) {
	maxC=Math.max(curves[cn].r1+curves[cn].r2,maxC);
      } else {
	maxC=Math.max(curves[cn].r1+curves[cn].r2+curves[cn].r3,maxC);
      }
    });
    var scale=200/maxC;
    [[0],[0,1],[0,1,2]][curveCount].forEach(function(cn) {
      curves[cn].r1*=scale;
      curves[cn].r2*=scale;
      curves[cn].r3*=scale;
    });
  } 
}

function randomizeCurves() {
  [[0],[0,1],[0,1,2]][curveCount].forEach(function(cn) {
    if (curves[cn].reset || Math.random()<curveChangeRate) {
      if (curves[cn].typeKeep==undefined) {
	getRandomCurve(cn);
      }
      if (curves[cn].c0Keep==undefined) {
	curves[cn].c0=getRandomInt(1,16);
      }
      if (curves[cn].c1Keep==undefined) {
	curves[cn].c1=getRandomInt(1,16);
      }
      if (curves[cn].c2Keep==undefined) {
	curves[cn].c2=getRandomInt(1,16);
      }
      if (curves[cn].c0Keep==undefined && curves[cn].c1Keep==undefined && curves[cn].c2Keep==undefined) {
	setCycles(cn);
      }
      curves[cn].reset=false;
    }
  });
  randomizeRadii();
}

function quickFill() {
  if ("fixed"==color) {
    var selcolor=document.getElementById('colorSel').value;
    qcol.setAttribute('from',acol.getAttribute('to'));
    qcol.setAttribute('to',selcolor);
    acol.setAttribute('to',selcolor);
    acol.setAttribute('from',selcolor);
  } else if ("random"==color) {
    var col=randomColor(false);
    qcol.setAttribute('from',acol.getAttribute('to'));
    qcol.setAttribute('to',col);
    acol.setAttribute('to',col);
  }
  qcol.beginElement();
}

var pauseId;
function redraw() {
  if (pause==0) {
    doTransition();
  } else {
    pauseId=setTimeout(doTransition, pause*1000);
  }
}

function report() {
  for (var cn=0; cn<=curveCount; cn++) {
    document.getElementById('curveSel'+cn).value=curves[cn].type;
    document.getElementById('rad1-'+cn).textContent=curves[cn].r1.toFixed(1);
    document.getElementById('rad1Sel'+cn).value=curves[cn].r1.toFixed(1);
    document.getElementById('rad2-'+cn).textContent=curves[cn].r2.toFixed(1);
    document.getElementById('rad2Sel'+cn).value=curves[cn].r2.toFixed(1);
    document.getElementById('rad3Sel'+cn).value=curves[cn].r3.toFixed(1);
    document.getElementById('c0-'+cn).textContent=curves[cn].c0;
    document.getElementById('c0Sel'+cn).value=curves[cn].c0;
    document.getElementById('c1-'+cn).textContent=curves[cn].c1;
    document.getElementById('c1Sel'+cn).value=curves[cn].c1;
    if (ET==curves[cn].type || HT==curves[cn].type) {
      document.getElementById('rad3-'+cn).textContent='N/A';
      document.getElementById('c2-'+cn).textContent='N/A';
    } else {
      document.getElementById('rad3-'+cn).textContent=curves[cn].r3.toFixed(1);
      document.getElementById('c2-'+cn).textContent=curves[cn].c2;
      document.getElementById('c2Sel'+cn).value=curves[cn].c2;
    }
  }
}

function get1Curve(rand) {
  if (rand) {
    if (symmetry==0) {
      randomizeCurves();
    } else {
      // temporary condition
      if (curves[0].c1Keep==undefined && curves[0].c2Keep==undefined) {
	randomizeSym1Curve();
      } else {
	randomizeCurves();
      }
    }
    scaleToFit();
  }
  return getCurve(0);
}

function get2Curves(rand) {
  if (rand) {
    //saveCurves();
    if (symmetry==0) {
      randomizeCurves();
    } else {
      // temporary condition
      if (curves[0].c1Keep==undefined && curves[0].c2Keep==undefined && curves[1].c1Keep==undefined && curves[1].c2Keep==undefined) {
	randomizeSym2Curves();
      } else {
	randomizeCurves();
      }
    }
    scaleToFit();
  }
  return getCurve(0)+' '+getCurve(1);
}

function get3Curves(rand) {
  if (rand) {
    //saveCurves();
    if (symmetry==0) {
      randomizeCurves();
    } else {
      // temporary condition
      if (curves[0].c1Keep==undefined && curves[0].c2Keep==undefined && curves[1].c1Keep==undefined && curves[1].c2Keep==undefined && curves[2].c1Keep==undefined && curves[2].c2Keep==undefined) {
	randomizeSym3Curves();
      } else {
	randomizeCurves();
      }
    }
    scaleToFit();
  }
  return getCurve(0)+' '+getCurve(1)+' '+getCurve(2);
}

function changeCurveCount() {
  if (Math.random()<curveChangeRate/2) {
    if (curveCount==TWO) {
      if (curves[TWO].keep==undefined) {
	if (Math.random()<.5) {
	  switchCurve(TWO);
          return true;
	} else {
	  if (curves[THREE].keep==undefined) {
	    switchCurve(THREE);
            return true;
	  }
	}
      } else {
	if (curves[THREE].keep==undefined) {
	  switchCurve(THREE);
          return true;
	}
      }
    } else if (curveCount==ONE) {
      if (curves[TWO].keep==undefined) {
	switchCurve(TWO);
        return true;
      }
    } else if (curveCount==THREE) {
      if (curves[THREE].keep==undefined) {
	switchCurve(THREE);
        return true;
      }
    }
  }
  return false;
}

function doTransition() {
  if (changeCurveCount() && transition=='step') {
    return;
  }
  a2.setAttribute('from',a2.getAttribute('to'));
  duration.change();
  if (curveCount==ONE) {
    a2.setAttribute('to',get1Curve(true));
  } else if (curveCount==THREE) {
    a2.setAttribute('to',get3Curves(true));
  } else {
    a2.setAttribute('to',get2Curves(true));
  }
  report();
  setFill();
  a2.beginElement();
}

function start() {
  if (transition=='animate') {
    return;
  }
  a2.setAttribute("onend", "redraw()");
  transition='animate';
  doTransition();
}

function step() {
  a2.setAttribute("onend", "");
  if (transition=='animate') {
  } else {
    a2.endElement();
    doTransition();
  }
  transition='step';
}

function stop() {
  clearTimeout(pauseId);
  a2.setAttribute("onend", "");
  transition='step';
}

function quickChange() {
  duration.set(a2,'1ms');
  a2.setAttribute('from',a2.getAttribute('to'));
  if (curveCount==ONE) {
    a2.setAttribute('to',get1Curve(false));
  } else if (curveCount==THREE) {
    a2.setAttribute('to',get3Curves(false));
  } else {
    a2.setAttribute('to',get2Curves(false));
  }
  a2.beginElement();
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

function hideCurve3(ts) {
  var z=document.querySelector('.c3show');
  if (z==null) {
  } else {
    z.className="c3hide";
    requestAnimationFrame(hideCurve3);
  }
}
function showCurve3(ts) {
  var z=document.querySelector('.c3hide');
  if (z==null) {
  } else {
    z.className="c3show";
    requestAnimationFrame(showCurve3);
  }
}

function switchTwoToThree() {
  curveCount=THREE;
  var cd =document.getElementById('cdivcurv');
  if (cd.offsetHeight!=0) {
    cd.style.height='auto';
  }
  showCurve3();
  document.getElementById('c2btn').style.visibility='hidden';
  document.getElementById('c3btn').textContent='remove';
  a2.setAttribute('from',getZeroCurve()+' '+getZeroCurve()+' '+getZeroCurve());
  curves[1].reset=true;
  a2.setAttribute('to',get3Curves(false));
  if (transition=='step') {
    a2.setAttribute("onend", "");
  } else {
    a2.setAttribute("onend", "redraw()");
  }
  report();
  a2.beginElement();
}

function switchThreeToTwo() {
  curveCount=TWO;
  var cd=document.getElementById('cdivcurv');
  if (cd.offsetHeight!=0) {
    cd.style.height='auto';
  }
  hideCurve3();
  document.getElementById('c3btn').textContent='add';
  document.getElementById('c2btn').style.visibility='visible';
  a2.setAttribute('from',getZeroCurve()+' '+getZeroCurve());
  a2.setAttribute('to',get2Curves(false));
  if (transition=='step') {
    a2.setAttribute("onend", "");
  } else {
    a2.setAttribute("onend", "redraw()");
  }
  report();
  a2.beginElement();
}

function switchOneToTwo() {
  curveCount=TWO;
  var cd=document.getElementById('cdivcurv');
  if (cd.offsetHeight!=0) {
    cd.style.height='auto';
  }
  showCurve2();
  document.getElementById('c2btn').textContent='remove';
  document.getElementById('c3tr').style.display='table-row';
  a2.setAttribute('from',getZeroCurve()+' '+getZeroCurve());
  curves[1].reset=true;
  a2.setAttribute('to',get2Curves(false));
  if (transition=='step') {
    a2.setAttribute("onend", "");
  } else {
    a2.setAttribute("onend", "redraw()");
  }
  report();
  a2.beginElement();
}

function switchToOne() {
  curveCount=ONE;
  var cd=document.getElementById('cdivcurv');
  if (cd.offsetHeight!=0) {
    cd.style.height='auto';
  }
  hideCurve2();
  document.getElementById('c2btn').textContent='add';
  document.getElementById('c3tr').style.display='none';
  a2.setAttribute('from',getZeroCurve());
  a2.setAttribute('to',get1Curve(false));
  if (transition=='step') {
    a2.setAttribute("onend", "");
  } else {
    a2.setAttribute("onend", "redraw()");
  }
  report();
  a2.beginElement();
}

function toZero(cc) {
  a2.setAttribute('from',a2.getAttribute('to'));
  if (curveCount==ONE) {
    a2.setAttribute('to',getZeroCurve());
    a2.setAttribute("onend", "switchOneToTwo()");
  } else if (curveCount==TWO) {
    a2.setAttribute('to',getZeroCurve()+' '+getZeroCurve());
    if (cc==THREE) {
      a2.setAttribute("onend", "switchTwoToThree()");
    } else {
      a2.setAttribute("onend", "switchToOne()");
    }
  } else {
    a2.setAttribute('to',getZeroCurve()+' '+getZeroCurve()+' '+getZeroCurve());
    a2.setAttribute("onend", "switchThreeToTwo()");
  } 
  duration.setDuration(a2,1);
  duration.reset=true;
  a2.beginElement();
}

function switchCurve(cc) {
  if (transition=='step') {
    toZero(cc);
  } else {
    a2.setAttribute('onend', 'toZero('+cc+')');
  }
}

function addRemoveCurve(cc) {
  if (transition=='step') {
    toZero(cc);
  } else {
    a2.setAttribute('onend', 'toZero('+cc+')');
  }
}

function keepCurve(cb,cn) {
 if (cb.checked) {
    curves[cn].keep=true;
  } else {
    curves[cn].keep=undefined;
  }
}

function keepType(cb,cn) {
  if (cb.checked) {
    curves[cn].typeKeep=curves[cn].type;
  } else {
    curves[cn].typeKeep=undefined;
  }
}

function changeType(sel,cn) {
  curves[cn].type=sel.value;
  if (ET==curves[cn].type || HT==curves[cn].type) {
    document.getElementById('rad3-'+cn).textContent='N/A';
    document.getElementById('c2-'+cn).textContent='N/A';
  } else {
    document.getElementById('rad3-'+cn).textContent=curves[cn].r3.toFixed(1);
    document.getElementById('c2-'+cn).textContent=curves[cn].c2;
    document.getElementById('c2Sel'+cn).value=curves[cn].c2;
  }
  if ('animate'==transition) {
    document.getElementById('kCurve'+cn).checked='checked';
    curves[cn].typeKeep=curves[cn].type;
  } else {
    quickChange();
  }
}

function keepR1(cb,cn) {
  if (cb.checked) {
    document.getElementById('rad1Sel'+cn).value=curves[cn].r1.toFixed(0);
    curves[cn].r1Keep=curves[cn].r1;
  } else {
    curves[cn].r1Keep=undefined;
  }
}
function changeR1(inp,cn) {
  curves[cn].r1=parseFloat(inp.value);
  document.getElementById('rad1-'+cn).textContent=curves[cn].r1.toFixed(1);
  if ('animate'==transition) {
    document.getElementById('kR0-'+cn).checked='checked';
    curves[cn].r1Keep=curves[cn].r1;
  } else {
    quickChange();
  }
}

function keepR2(cb,cn) {
  if (cb.checked) {
    curves[cn].drawKeep=curves[cn].r2;
  } else {
    curves[cn].drawKeep=undefined;
  }
}
function changeR2(inp,cn) {
  curves[cn].r2=parseFloat(inp.value);
  document.getElementById('rad2-'+cn).textContent=curves[cn].r2.toFixed(1);
  if ('animate'==transition) {
    document.getElementById('kR1-'+cn).checked='checked';
    curves[cn].drawKeep=curves[cn].r2;
  } else {
    quickChange();
  }
}
function keepR3(cb,cn) {
  if (cb.checked) {
    curves[cn].r3Keep=curves[cn].r3;
  } else {
    curves[cn].r3Keep=undefined;
  }
}
function changeR3(inp,cn) {
  curves[cn].r3=parseFloat(inp.value);
  if (!(ET==curves[cn].type || HT==curves[cn].type)) {
    document.getElementById('rad3-'+cn).textContent=curves[cn].r3.toFixed(1);
  }
  if ('animate'==transition) {
    document.getElementById('kR3-'+cn).checked='checked';
    curves[cn].r3Keep=curves[cn].r3;
  } else {
    quickChange();
  }
}

function keepC0(cb,cn) {
  if (cb.checked) {
    curves[cn].c0Keep=curves[cn].c0;
  } else {
    curves[cn].c0Keep=undefined;
  }
}
function changeC0(inp,cn) {
  curves[cn].c0=parseInt(inp.value);
  document.getElementById('c0-'+cn).textContent=curves[cn].c0;
  if ('animate'==transition) {
    document.getElementById('kC0-'+cn).checked='checked';
    curves[cn].c0Keep=curves[cn].c0;
  } else {
    quickChange();
  }
}

function keepC1(cb,cn) {
  if (cb.checked) {
    curves[cn].c1Keep=curves[cn].c1;
  } else {
    curves[cn].c1Keep=undefined;
  }
}
function changeC1(inp,cn) {
  curves[cn].c1=parseInt(inp.value);
  document.getElementById('c1-'+cn).textContent=curves[cn].c1;
  if ('animate'==transition) {
    document.getElementById('kC1-'+cn).checked='checked';
    curves[cn].c1Keep=curves[cn].c1;
  } else {
    quickChange();
  }
}

function keepC2(cb,cn) {
  if (cb.checked) {
    curves[cn].c2Keep=curves[cn].c2;
  } else {
    curves[cn].c2Keep=undefined;
  }
}
function changeC2(inp,cn) {
  curves[cn].c2=parseInt(inp.value);
  if (!(ET==curves[cn].type || HT==curves[cn].type)) {
    document.getElementById('c2-'+cn).textContent=curves[cn].c2
  }
  if ('animate'==transition) {
    document.getElementById('kC2-'+cn).checked='checked';
    curves[cn].c2Keep=curves[cn].c2;
  } else {
    quickChange();
  }
}

function changeSymmetry(si) {
  symmetry=parseInt(si.value);
  curves[0].reset=true;
}

function changeRotation(si) {
  rotationFactor=si.value;
}

function changePause(si) {
  pause=si.value;
}

function changeDamp(si) {
  curveChangeRate=si.value;
}

function setFill() {
  if ('none'==color || 'fixed'==color) {
    return;
  } else if ('random'==color) {
    acol.setAttribute('from',acol.getAttribute('to'));
    var col=randomColor(false);
    acol.setAttribute('to',col);
    document.getElementById('colorSel').value=col;
  } else if ('startFixed'==color) {
    var selcolor=document.getElementById('colorSel').value;
    acol.setAttribute('from',acol.getAttribute('to'));
    acol.setAttribute('to',selcolor);
    color='fixed';
  }
  acol.beginElement();
}

function changeFill(cb) {
  if (cb.checked) {
    switch (cb.id) {
      case 'nofill':
	color='none';
        path.style.setProperty('fill-opacity','0',''); // set opacity 100%
	break;
      case 'colfill':
        path.style.setProperty('fill-opacity','1','');
        if (transition=='step') {
          color='fixed';
          quickFill();
        } else {
	  color='startFixed';
        }
	break;
      default:
	color='random';
        path.style.setProperty('fill-opacity','1','');
        if (transition=='step') {
          quickFill();
        }
    }
  }
}

function changeFillColor(inp) {
  document.getElementById('colfill').checked=true;
  path.style.setProperty('fill-opacity','1','');
  if (transition=='step') {
    color='fixed';
    quickFill();
  } else {
    color='startFixed';
  }
}

function changeLineWidth(inp) {
  path.style.setProperty('stroke-width',inp.value,'');
}

function changeLineWidth(inp) {
  path.style.setProperty('stroke-width',inp.value,'');
}

function changeLineColor(inp) {
  path.style.setProperty('stroke',inp.value,'');
}

function changeBackground(inp) {
  document.getElementById('asbox').style.setProperty('fill',inp.value,'');
}

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
