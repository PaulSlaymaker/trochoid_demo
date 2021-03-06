"use strict";
var body=document.getElementsByTagName("body").item(0);
body.append((()=>{
  let ss=document.createElement("style");
  ss.type="text/css";
  ss.title="ss";
    return ss;
})());

var grid=(()=>{
  let g=document.createElement("div");
  g.style.display="grid";
  g.style.gridTemplateColumns="auto 1fr";
  g.style.textAlign="center";
  body.append(g);
  return g;
})();

var canvas=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  c.onclick=()=>{ 
if (!STEPPER) {
  //  randomize();
    //draw(1);
    if (step==Infinity) { 
      start(); 
    } else {
      step=Infinity;
    }
}
  }
  grid.append(c);
  return c;
})();


const CSIZE=400;
const expos=["?","\u00B9","\u00B2","\u00B3","\u2074","\u2075"];
const PolarType=[Math.sin,Math.cos];
const SCALE=280;	// 2 terms, ~CSIZE/2

var getStdRange=(min,max,step)=>{
  let sr=document.createElement("input");
  sr.type="range";
  sr.min=min;
  sr.max=max;
  sr.step=step;
  sr.style.height="12px";
  return sr;
}

var control=(name, term)=>{
  let c=document.createElement("div");
  c.style.display="grid";
  c.style.gridTemplateColumns="auto auto auto";
  c.style.padding="10px";
  c.append(
    (()=>{
      let r=document.createElement("div");
      r.textContent=name;
      return r;
    })(),
    (()=>{
      let r=document.createElement("div");
      r.style.fontFamily="monospace";
      r.style.fontWeight="bold";
      r.style.fontSize="16px";
      r.style.borderBottom="1px solid silver";
      c.setReport=()=>{
        r.textContent=
           (term.factor<0?" ":" \u00A0")
          +term.factor.toFixed(1)
          +" "
          +PolarType[term.calc.polType].name 
          //+term.calc.exp
          +expos[term.calc.exp]
          +"("+term.calc.mult+"t)"
        ;
      }
      return r;
    })(),
    (()=>{
      let rs=document.createElement("div");
      rs.style.display="grid";
      rs.style.gridTemplateColumns="auto";
      rs.style.borderBottom="1px solid silver";
      rs.append(
	(()=>{
	  let rV=getStdRange(-1,1,0.1);
          rV.title="factor";
	  rV.oninput=(event)=>{
	    term.factorCall(rV); 
	    c.setReport();
	  }
	  c.setFactorSlider=()=>{ rV.value=term.factor; }
	  return rV;
	})(),
	(()=>{
	  let r=getStdRange(1,10,1);
	  r.oninput=(event)=>{
	    term.multCall(r); 
	    c.setReport();
	  }
	  c.setMultSlider=()=>{ r.value=term.calc.mult; }
	  return r;
	})(),
	(()=>{
	  let r=getStdRange(0,1,1);
	  r.oninput=(event)=>{
	    term.polTypeCall(r); 
	    c.setReport();
	  }
	  c.setPolTypeSlider=()=>{ r.value=term.calc.polType; }
	  return r;
	})(),
	(()=>{
	  let r=getStdRange(1,5,2); // no entity for 7
	  r.oninput=(event)=>{
	    term.expCall(r); 
	    c.setReport();
	  }
	  c.setExpSlider=()=>{ r.value=term.calc.exp; }
	  return r;
	})(),
      );  
      return rs;
    })(),
  );
  term.setControl=()=>{
    c.setReport();
    c.setFactorSlider();
    c.setMultSlider();
    c.setPolTypeSlider();
    c.setExpSlider();
  }
  term.control=c;
  return c;
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var Calc=function(polType,mult,exp) {
  this.polType=polType;
  this.mult=mult;
  this.exp=exp;
  this.getCalc=(t)=>{
    //return Math.pow(this.polType(this.mult*t),this.exp);
    return Math.pow(PolarType[this.polType](this.mult*t),this.exp);
  }
  this.eq=(calc2)=>{
    return this.polType==calc2.polType && this.mult==calc2.mult && this.exp==calc2.exp;
  }
/*
  this.eqs=()=>{
    let ct=0;
    // set up opposite terms, now only called by t1, or take out of Calc
    [t3,t4].forEach(()=>{
      this.polType==calc2.polType && this.mult==calc2.mult;
    });
    
    return ct;
  }
*/
}

var Term=function(calc) {
  // single calc start, move to calc*calc*...
  this.calc=calc;
  this.factor=0;
  this.getValue=(t)=>{ return this.factor*this.calc.getCalc(t); }
  this.factorCall=(inp)=>{ 
    this.factor=parseFloat(inp.value); 
//adjustFactors();
    draw(1);
  }
  this.multCall=(inp)=>{ 
    this.calc.mult=parseInt(inp.value); 
    draw(1);
  }
  this.polTypeCall=(inp)=>{ 
    //this.calc.polType=[Math.sin,Math.cos][parseInt(inp.value)];
    this.calc.polType=parseInt(inp.value);
    draw(1);
  }
  this.expCall=(inp)=>{ 
    this.calc.exp=parseInt(inp.value); 
    draw(1);
  }
  this.setControl=()=>{ 
//console.log("in pro"); 
  }
  this.randomizeFactor=()=>{
    this.factor=(10-2*getRandomInt(0,11))/10;
  }
  this.randomize=()=>{
    //this.factor=[-1,-0.5,0,0.5,1][getRandomInt(0,5)];
    //this.factor=[-1,-0.5,0.5,1][getRandomInt(0,4)];
    this.factor=(10-2*getRandomInt(0,11))/10;
if (!PUBLISH) {
    this.calc.polType=[0,1][getRandomInt(0,2)];
}
    this.calc.exp=[1,3,5][getRandomInt(0,3,true)];
    //this.calc.mult=getRandomInt(1,7,true);
    this.calc.mult=getRandomInt(1,4,true);
    this.setControl();
  }
  this.getId=()=>{
    return ["s","c"][this.calc.polType]+this.calc.mult;
  }
  this.copyValues=(term)=>{
    if (term instanceof Term) { 
      term.factor=this.factor;
      term.calc.polType=this.calc.polType;
      term.calc.mult=this.calc.mult;
      term.calc.exp=this.calc.exp;
    } else {
if (!PUBLISH)  debugger;
    }
  }
}

let t1=new Term(new Calc(0,1,1));
let t2=new Term(new Calc(0,2,1));
let t3=new Term(new Calc(1,1,1));
let t4=new Term(new Calc(1,3,1));

/*
t1.calc.mult*=OFFSET;
t2.calc.mult*=OFFSET;
t3.calc.mult*=OFFSET;
t4.calc.mult*=OFFSET;
t1.getValue=(t)=>{ return t1.factor*t1.calc.getCalc(t*OFFSET); }
t2.getValue=(t)=>{ return t2.factor*t2.calc.getCalc(t*OFFSET); }
t3.getValue=(t)=>{ return t3.factor*t3.calc.getCalc(t*OFFSET); }
t4.getValue=(t)=>{ return t4.factor*t4.calc.getCalc(t*OFFSET); }
*/

let PUBLISH=false;

if (!PUBLISH) {

/*
var curve=(()=>{
  let c=document.createElementNS("http://www.w3.org/2000/svg", "path");
  //c.setAttribute("d","M0 0L50 50z");
  c.setAttribute("d","");
  c.style.stroke="#000";
  c.style.fill="#AAD";
  c.append((()=>{
    let a=document.createElementNS("http://www.w3.org/2000/svg", "animate");
    a.setAttribute("attributeName","d");
//    a.setAttribute("keyTimes","0;0.5;1");
    a.setAttribute("from","");
    a.setAttribute("to","");
    a.setAttribute("dur","3s");
    a.setAttribute("repeatCount","indefinite");
    return a;
  })());
  return c;
})();
grid.append((()=>{
  //let sd=document.createElement("svg");
  let sd=document.createElementNS("http://www.w3.org/2000/svg", "svg");
  sd.setAttribute("width","800");
  sd.setAttribute("height","800");
  sd.style.width="200px";
  sd.style.height="200px";
  sd.style.border="1px solid red";
  //sd.style.transform="translate("+CSIZE+","+CSIZE+")";
  sd.append((()=>{
    let g=document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform","translate("+CSIZE/4+","+CSIZE/4+") scale(0.25,0.25)");
    g.append(curve);
    return g;
  })());
  return sd;
})());
*/

var bPlus={};
var bMinus={};
grid.append((()=>{
  let c=document.createElement("div");
  c.append((()=>{
    let assess=document.createElement("div");
    assess.style.borderBottom="1px solid silver";

    assess.append((()=>{
      let plus=document.createElement("button");
      plus.append(
        "plus"
      );
      plus.onclick=()=>{
        if (bPlus[id]) { bPlus[id]++; } else { bPlus[id]=1; }
        start();
      }
      return plus;
    })());

    assess.append((()=>{
      let plus=document.createElement("button");
      plus.append(
        "minus"
      );
      plus.onclick=()=>{
        if (bMinus[id]) { bMinus[id]++; } else { bMinus[id]=1; }
        start();
      }
      return plus;
    })());
    return assess;
  })());
  c.append(control("X1",t1));
  c.append(control("X2",t2));
  c.append(control("Y1",t3));
  c.append(
    control("Y2",t4),
    (()=>{
      return document.createElement("div");
    })()
  );
  return c;
})());
}

//var canvas=document.querySelector('#cta');
onresize=function() {
  canvas.style.maxHeight=window.innerHeight-20+'px';
}

var ctx=canvas.getContext('2d');
ctx.translate(CSIZE,CSIZE);
//ctx.scale(3,3);
ctx.lineWidth=3;
ctx.font="50px monospace";
ctx.fillStyle="#AAD";

var equation=(()=>{
  this.div=(()=>{
    let e=document.createElement("div");
    e.style.position="absolute";
    e.style.top="20px";
    e.style.left="20px";
    e.style.fontSize="12px";
    e.style.fontFamily="monospace";
    e.style.background="white";
    body.append(e);
    return e;
  })();
  this.clear=()=>{ while (div.firstChild) div.removeChild(div.firstChild); }
  this.getExp=(term)=>{
    if (term.calc.exp==1) {
      return "";
    } else {
      let sup=document.createElement("sup");
      sup.style.fontSize="8px";
      sup.style.fontWeight="bold";
      sup.textContent=term.calc.exp;
      return sup;
    }
  }
  this.getArg=(term)=>{
    if (term.calc.mult==1) {
      return "(t)";
    } else {
      return "("+term.calc.mult+"t)";
    }
  }
/*
  this.writeTerm=(term)=>{
    let f=Math.floor(10*term.factor);
    if (f!=0) { div.append(f+"\u00B7"); }
    div.append(
      PolarType[term.calc.polType].name,
          //expos[term.calc.exp],
      getExp(term),
      getArg(term),
    );
  }
*/
  this.write=()=>{
    this.clear();
    div.append(  // x line
      (()=>{
        let xl=document.createElement("div");
        xl.textContent=("x=");
        let f=Math.floor(10*t1.factor);
        if (f!=0) {
	  if (f!=1) { xl.append(f+"\u00B7"); }
	  xl.append(
	    PolarType[t1.calc.polType].name,
	    getExp(t1),
	    getArg(t1)
	  );
	  if (t2.factor>0) { xl.append("+"); }
        }

        f=Math.floor(10*t2.factor);
        if (f!=0) {
	  if (f!=1) { xl.append(f+"\u00B7"); }
	  xl.append(
	    //Math.floor(10*t2.factor),
	    PolarType[t2.calc.polType].name,
	    getExp(t2),
	    getArg(t2)
	  );
        }

        return xl;
      })()
    );
    div.append(  // y line
      (()=>{
        let xl=document.createElement("div");
        xl.textContent=("y=");
        let f=Math.floor(10*t3.factor);
        if (f!=0) {
          if (f!=1) { xl.append(f+"\u00B7"); }
	  xl.append(
	    PolarType[t3.calc.polType].name,
	    getExp(t3),
	    getArg(t3)
	  );
	  if (t4.factor>0) { xl.append("+"); }
        }
        f=Math.floor(10*t4.factor);
        if (f!=0) {
	  if (f!=1) { xl.append(f+"\u00B7"); }
	  xl.append(
	    PolarType[t4.calc.polType].name,
	    getExp(t4),
	    getArg(t4)
	  );
        }
        return xl;
      })()
    );
    //writeTerm(t2);
  }
  return this;
})();


var drawCH=()=>{
  ctx.beginPath();
  ctx.moveTo(-CSIZE,0);
  ctx.lineTo(CSIZE,0);
  ctx.moveTo(0,-CSIZE);
  ctx.lineTo(0,CSIZE);
  ctx.strokeStyle="#EEE";
  ctx.stroke();
  ctx.closePath();
}
//ctx.fillStyle='hsla(0,0%,0%,0.05)';

var cbLoc=(p1,p2,frac)=>{
  //return p1*(1-frac)+p2*frac;
  var f1=.2;
  var f2=.8;
  var e1=Math.pow(1-frac,3)*p1;
  var e2=3*frac*Math.pow(1-frac,2)*(p1+(p2-p1)*f1);
  var e3=3*(1-frac)*Math.pow(frac,2)*(p1+(p2-p1)*f2);
  var e4=Math.pow(frac,3)*p2;
  return e1+e2+e3+e4;
}

var MULT=false;
var RES300=0.02;
var RES100=Math.PI/50;
var RES30=Math.PI/15;
var RES20=Math.PI/10;
var RES10=Math.PI/5;
var RES6=Math.PI/3;
var RES4=Math.PI/2;
var RES2=Math.PI;
var RES=RES100;

var draw=(frac)=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  if (frac==1) {
    drawCH();
    setShape();
//if (!PUBLISH) ctx.fillText(id, 0, -CSIZE+100); 
if (!PUBLISH) {
  ctx.strokeStyle="#777";
  ctx.strokeText(id, 0, -CSIZE+100); 
}
    equation.write();
  }
  if (frac==0) {
    equation.clear();
  }

  ctx.beginPath();
  let scale=SCALE;
if (MULT) {
  scale=3*SCALE;
  let x0=t1save.getValue(0)*t2save.getValue(0);
  let x1=t1.getValue(0)*t2.getValue(0);
  let y0=t3save.getValue(0)*t4save.getValue(0);
  let y1=t3.getValue(0)*t4.getValue(0);
  ctx.moveTo(
    scale*cbLoc(t1save.getValue(0),x1,frac),
    scale*cbLoc(y0,y1,frac)
  );
} else {
  let x0=t1save.getValue(0)+t2save.getValue(0);
  let x1=t1.getValue(0)+t2.getValue(0);
  let y0=t3save.getValue(0)+t4save.getValue(0);
  let y1=t3.getValue(0)+t4.getValue(0);
  ctx.moveTo(scale*cbLoc(x0,x1,frac),scale*cbLoc(y0,y1,frac));
}

  //ctx.moveTo(scale*(x0*(1-frac)+x1*frac),scale*(y0*(1-frac)+y1*frac));
  //for (let t=0; t<Math.PI*2.02; t+=0.02) {
  //for (let t=0; t<=Math.PI*2.02; t+=0.02) {
  for (let t=0; t<=Math.PI*2; t+=RES) {
if (MULT) {
    let x=cbLoc((t1save.getValue(t)*t2save.getValue(t)),(t1.getValue(t)*t2.getValue(t)),frac);
    let y=cbLoc(t3save.getValue(t)*t4save.getValue(t),t3.getValue(t)*t4.getValue(t),frac);
    ctx.lineTo(scale*x,scale*y);
} else {
    let x=cbLoc((t1save.getValue(t)+t2save.getValue(t)),(t1.getValue(t)+t2.getValue(t)),frac);
    let y=cbLoc(t3save.getValue(t)+t4save.getValue(t),t3.getValue(t)+t4.getValue(t),frac);
    ctx.lineTo(scale*x,scale*y);
}

  }
  ctx.closePath();
  ctx.strokeStyle="black";
  //ctx.fill();
  ctx.stroke();
}

var drawMot=(frac)=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.beginPath();
  let scale=SCALE;
  let x0=t1save.getValue(0)+t2save.getValue(0);
  let x1=t1.getValue(0)+t2.getValue(0);
  let y0=t3save.getValue(0)+t4save.getValue(0);
  let y1=t3.getValue(0)+t4.getValue(0);
  ctx.moveTo(scale*cbLoc(x0,x1,frac),scale*cbLoc(y0,y1,frac));
  for (let t=0; t<=Math.PI*2; t+=RES) {
    //let x=(1+0.5*Math.sin(2*Math.PI*3*frac)) * (t1.getValue(t)+t2.getValue(t));
    let x=(1+a1.getValue(frac*Math.PI*2+1)) * (t1.getValue(t)+t2.getValue(t));
    let y=(1+0.2*Math.sin(2*Math.PI*2*frac)) * (t3.getValue(t)+t4.getValue(t));
    ctx.lineTo(scale*x,scale*y);
  }
  ctx.closePath();
  ctx.strokeStyle="black";
  ctx.stroke();
ctx.fill();
}

onresize();

var id="text";

var m={};
var termsEqual=()=>{
  let ct=0;
  m={};
  [t1.getId(),t2.getId(),t3.getId(),t4.getId()].forEach((tid)=>{
    if (m[tid]) {
      ct++;
    } else {
      m[tid]=true;
    }
  });
  return ct;
}

var setShape=()=>{  // beauty filter construction
  let bt=0;
  id="";
  if (t1.factor==0 && t2.factor==0) {
    id+="line";
    return -1;;
  }
  if (t3.factor==0 && t4.factor==0) {
    id+="line";
    return -1;;
  }
/*  
  if (t1.factor+t2.factor==0 && t1.calc.eq(t2.calc)) {
    //should not get here due to unique Calcs
    id+="line";
    return -1;;
  }
  if (t3.factor+t4.factor==0 && t3.calc.eq(t4.calc)) {
    id+="line";
    return -1;;
  }
*/
  let sumEvenX=(t1.calc.mult+t2.calc.mult)%2==0;
  let sumEvenY=(t3.calc.mult+t4.calc.mult)%2==0;
  let sumOddX=!sumEvenX;
  let sumOddY=!sumEvenY;
  let sumEven=sumEvenX && sumEvenY;
  //let sumEvenOdd=sumEvenX && sumOddY;
  //let sumEvenOdd=sumEvenX && sumOddY;
  let sumOdd=sumOddX && sumOddY;
  let sumOorE=!sumEven && !sumOdd;

  let eachEvenX=(t1.calc.mult*t2.calc.mult)%2==0;
  let eachEvenY=(t3.calc.mult*t4.calc.mult)%2==0;
  let allEven=eachEvenX && eachEvenY;
  let allOdd=!eachEvenX && !eachEvenY;
  let oddOrEven=!allEven && !allOdd;

  if (t1.calc.polType+t2.calc.polType==0) {
    if (t3.calc.polType+t4.calc.polType==0) {
      // check oe
      id+="ssss";
      if ((t1.calc.mult+t2.calc.mult)%2==0
       && (t3.calc.mult+t4.calc.mult)%2==0) {
        bt=1;
      } else if ((t1.calc.mult+t2.calc.mult)%2==1
       && (t3.calc.mult+t4.calc.mult)%2==1) {
        bt=-1;
      } else {
        bt=-1;
      }
    } else if (t3.calc.polType+t4.calc.polType==1) {
      // filter out
      id+="one c";
      if (sumEven) {
      }
      bt=-1;
    } else {
      id+="sscc";
      bt=1;
    }
  } else if (t1.calc.polType+t2.calc.polType==1) {
    // filter out
    if (t3.calc.polType+t4.calc.polType==0) {
      id+="one c";
      bt=-1;
    } else if (t3.calc.polType+t4.calc.polType==1) {
      id+="mixed";
/*
      if ((t1.calc.mult+t2.calc.mult)%2==0
       && (t3.calc.mult+t4.calc.mult)%2==0) {
        bt=1;
      } else if ((t1.calc.mult+t2.calc.mult)%2==1
       && (t3.calc.mult+t4.calc.mult)%2==1) {
        bt=1;
      } else {
        bt=-1;
      }
*/
      bt=-1;
    } else {
      id+="three c";
      bt=-1;
    }
  } else {
    if (t3.calc.polType+t4.calc.polType==0) {
      id+="ccss";
      bt=1;
    } else if (t3.calc.polType+t4.calc.polType==1) {
      // filter out
      id+="one s";  // some good?
      bt=-1;
    } else {
      // filter out, none good
      id+="cccc";
      bt=-1;
    }
  }

  if ((t1.calc.mult+t2.calc.mult)%2==0) {
    id+=" e";
  } else {
    id+=" o";
  }
  if ((t3.calc.mult+t4.calc.mult)%2==0) {
    id+="e";
  } else {
    id+="o";
  }

if (id.endsWith("ee")) {
  if (!sumEven) debugger;
} else if (id.endsWith("oo")) {
  if (!sumOdd) debugger;
} else {
  if (!sumOorE) debugger;
}

  if ((t1.calc.mult*t2.calc.mult)%2==0) {
    id+=" e";
  } else {
    id+=" o";
  }
  if ((t3.calc.mult*t4.calc.mult)%2==0) {
    id+="e";
  } else {
    id+="o";
  }

if (id.endsWith("ee")) {
  if (!allEven) debugger;
} else if (id.endsWith("oo")) {
  if (!allOdd) debugger;
} else {
  if (!oddOrEven) debugger;
}

  return bt;
}

/*
var setShapeO=()=>{  // beauty filter construction
  let bt=0;
  id="";
  if (t1.calc.eq(t3.calc)) {
    id="line";
    bt=-1;
  } else if (t1.calc.polType+t3.calc.polType==2) {
    id+="disc1";
    bt=-1;
  } else if (t1.calc.polType+t3.calc.polType==0) {
    if ((t1.calc.mult+t3.calc.mult)%2==0) {
      id+="disc2";
      bt=-1;
    } else {
      id+="shape-ss";
      bt=1;
    }
  } else if (t1.calc.polType+t3.calc.polType==1) {
    //if ((t1.calc.polType*t1.calc.mult+t3.calc.polType*t3.calc.mult)%2==0) {
    //if ((t1.calc.mult+t3.calc.mult)%2==0) {
    if (t1.calc.polType==0) {
      if (t3.calc.mult%2==1) {
        id+="shape1";
        bt=1;
      } else {
        id+="disc3";
        bt=-1;
      }
    } else {
      if (t3.calc.mult%2==0) {
        id+="shape2";
        bt=1;
      } else {
        id+="disc4"; // contains shapes ?with points
        bt=-1;
      }
    }
  } else {
    debugger;
  }
  return bt;
}
*/
var adjustFactors=()=>{
  // need to re-report
  let w=Math.abs(t1.factor)+Math.abs(t2.factor);
  if (w>0) {
    let sm=1/w;
    t1.factor*=sm;
    t2.factor*=sm;
  }
  let h=Math.abs(t3.factor)+Math.abs(t4.factor);
  if (h>0) {
    let sm=1/h;
    t3.factor*=sm;
    t4.factor*=sm;
  }
[t1,t2,t3,t4].forEach((t)=>{
  t.setControl();
});

}

var randomize=()=>{
  let ctr2=0;
  do {
    let ctr=0;
    let termIds={};
    t1.randomize();
    termIds[t1.getId()]=true;
    do {
      t2.randomize();
      ctr++;
    } while (termIds[t2.getId()]);
    termIds[t2.getId()]=true;
    ctr=0;
    do {
      t3.randomize();
      ctr++;
    } while (termIds[t3.getId()] && ctr<10);
    termIds[t3.getId()]=true;
    ctr=0;
    do {
      t4.randomize();
      ctr++;
    } while (termIds[t4.getId()] && ctr<10);
if (!PUBLISH && ctr>10) debugger;
  } while (setShape()<0 && ctr2<100);
  //} while (setShape()!=10);
  //} while (false);
//if (!PUBLISH && ctr2>20) console.log("ctr2 "+ctr2);
if (ctr2>20) console.log("ctr2 "+ctr2);
if (!PUBLISH && ctr2>200) debugger;

  adjustFactors();

if (id.startsWith("line")) debugger;
}

//var step=PUBLISH?performance.now():Infinity;

var STEPPER=false;
var step=STEPPER?0:Infinity;
var start=()=>{
if (!STEPPER) {
  //step=performance.now();
  step=0;
}
  transit();
  requestAnimationFrame(animate);
}

let t1save=new Term(new Calc(0,1,1));
let t2save=new Term(new Calc(0,2,1));
let t3save=new Term(new Calc(1,1,1));
let t4save=new Term(new Calc(1,3,1));
var transit=()=>{
  t1.copyValues(t1save);
  t2.copyValues(t2save);
  t3.copyValues(t3save);
  t4.copyValues(t4save);
  if (Math.random()<0.8) {
    t1.randomizeFactor();
    t2.randomizeFactor();
    t3.randomizeFactor();
    t4.randomizeFactor();
    adjustFactors();
  } else {
    randomize();
  }
}

var pauseTS=10000;
var pause=(ts)=>{
  if (step==Infinity) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    transit();
    requestAnimationFrame(animate);
  }
}

var stx=0;
var animate=(ts)=>{
  if (!stx) {
    stx=ts;
  }
  let progress=ts-stx;
  if (progress<1000) {
    let frac=progress/1000;
    draw(frac);
    requestAnimationFrame(animate);
  } else {
    draw(1);
    stx=0;
if (STEPPER) {
  return;
}
    if (step==Infinity) {
if (!STEPPER) {
      step=0;
}
      return;
    }
    pauseTS=performance.now()+2000;
    requestAnimationFrame(pause);
//    transit();
//    requestAnimationFrame(animate);
  }
}

randomize();
//transit();
draw(1);
if (PUBLISH) requestAnimationFrame(pause);

var a1=new Term(new Calc(0,1,1));
a1.factor=0.3*Math.random();
var a2=new Term(new Calc(0,2,1));
a2.factor=0.3*Math.random();

var mot=0;
var motctr=0;
var animateShape=(ts)=>{
  if (!mot) {
    mot=ts;
  }
  let progress=ts-mot;
  if (progress<2000) {
    let frac=progress/2000;
    drawMot(frac);
  } else {
    draw(1);
    mot=0;
    motctr++;
  }
  if (motctr<5) requestAnimationFrame(animateShape);
}
