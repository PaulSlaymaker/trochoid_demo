"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
const PUBLISH=false;

if (PUBLISH) {
var styleSheet=(()=>{
  let tag=document.createElement("style");
  tag.type="text/css";
  body.append(tag);
  let ss=document.styleSheets[document.styleSheets.length-1];
  ss.insertRule("body { background:#444; }",0);
  return ss;
})();
}

var grid=(()=>{
  let g=document.createElement("div");
  g.style.display="grid";
if (!PUBLISH) {
  g.style.gridTemplateColumns="auto 1fr";
}
  g.style.textAlign="center";
  body.append(g);
  return g;
})();

var canvas=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  c.onclick=()=>start();
  let co=document.createElement("div");
  co.append(c);
  grid.append(co);
  return c;
})();

onresize=function() {
  canvas.style.maxHeight=window.innerHeight-20+'px';
}

const CSIZE=400;
const PolarType=[Math.sin,Math.cos];
const SCALE=30;

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var Term=function(polType,mult,factor) {
  this.mult=mult;
  this.polType=polType;
  this.factor=factor;
  this.sign=1;
  this.getValue=(t)=>{ 
    //return this.factor*this.calc.getCalc(t); 
    //return this.factor*PolarType[this.polType](this.calc.mult*t);
    return this.sign*this.factor*PolarType[this.polType](this.mult*t);
  }
  this.factorCall=(inp)=>{ 
    let f=parseFloat(inp.value); 
    if (f<0) {
      this.sign=-1;
      this.factor=-f;
    } else {
      this.sign=1;
      this.factor=f;
    }
    draw(1);
  }
  this.multCall=(inp)=>{ 
    this.mult=parseInt(inp.value); 
    this.mult=parseInt(inp.value); 
    draw(1);
  }
  this.polTypeCall=(inp)=>{ 
    this.polType=parseInt(inp.value);
    draw(1);
  }
  this.setControl=()=>{ 
  }
  this.randomizeFactor=()=>{ this.factor=[0.4,0.3,0.2,0.1,0][getRandomInt(0,5,true)]; }
  this.randomizeMultiplier=()=>{ this.mult=[3,1,5,7,9,11,13][getRandomInt(0,7,true)]; }
  this.copyValues=(term)=>{
    if (term instanceof Term) { 
      term.factor=this.factor;
      term.sign=this.sign;
      term.polType=this.polType;
      term.mult=this.mult;
    } else {
if (!PUBLISH)  debugger;
    }
  }
}

var Curve2=function(c) {
  this.tx1=new Term(0,1,0);
  this.tx3=new Term(0,3,0);
  this.tx5=new Term(0,5,0);
  this.tx7=new Term(0,7,9);
  this.tx9=new Term(0,9,0);
  this.tx11=new Term(0,11,0);
  this.ty1=new Term(1,1,0);
  this.ty3=new Term(1,3,0);
  this.ty5=new Term(1,5,0);
  this.ty7=new Term(1,7,0);
  this.ty9=new Term(1,9,9);
  this.ty11=new Term(1,11,0);
  this.xTerms=[this.tx1,this.tx3,this.tx5,this.tx7,this.tx9,this.tx11];
  this.yTerms=[this.ty1,this.ty3,this.ty5,this.ty7,this.ty9,this.ty11];
  this.terms=[this.tx1,this.tx3,this.tx5,this.tx7,this.tx9,this.tx11,
              this.ty1,this.ty3,this.ty5,this.ty7,this.ty9,this.ty11];
  this.randomize=()=>{ 
    for (let i in this.xTerms) {
if (Math.random()<0.4) {
      if (Math.random()<0.3+i/10) {
	this.xTerms[i].factor=0;
      } else {
	this.xTerms[i].factor=[1,2,3,4,5][getRandomInt(0,5)]; 
      }
      if (Math.random()<0.07) { this.xTerms[i].sign*=-1; }
}
    }
    for (let i in this.yTerms) {
if (Math.random()<0.4) {
      if (Math.random()<0.3+i/10) {
	this.yTerms[i].factor=0;
      } else {
	this.yTerms[i].factor=[1,2,3,4,5][getRandomInt(0,5)]; 
      }
      if (Math.random()<0.07) { this.yTerms[i].sign*=-1; }
}
    }
    let ex=this.tx1.factor+this.tx3.factor+this.tx5.factor+this.tx7.factor
           +this.tx9.factor+this.tx11.factor;
    if (ex<1) {
      this.xTerms[getRandomInt(0,6)].factor=9;
    } else if (ex<2) {
      this.xTerms.forEach((te)=>{ te.factor*=8; });
    } else if (ex<3) {
      this.xTerms.forEach((te)=>{ te.factor*=4; });
    } else if (ex<4) {
      this.xTerms.forEach((te)=>{ te.factor*=2; });
    } else if (ex>16) {
      for (let i=0; i<6; i++) { if (this.terms[i].factor>1) this.terms[i].factor-=2; }
    } else if (ex>12) {
      for (let i=0; i<6; i++) { if (this.terms[i].factor>0) this.terms[i].factor-=1; }
    }
    let ey=this.ty1.factor+this.ty3.factor+this.ty5.factor+this.ty7.factor
          +this.ty9.factor+this.ty11.factor;
    if (ey<1) {
      this.terms[getRandomInt(6,12)].factor=9;
    } else if (ey<2) {
      for (let i=6; i<12; i++) { this.terms[i].factor*=8; }
    } else if (ey<3) {
      for (let i=6; i<12; i++) { this.terms[i].factor*=4; }
    } else if (ey<4) {
      for (let i=6; i<12; i++) { this.terms[i].factor*=2; }
    } else if (ey>16) {
      for (let i=6; i<12; i++) { if (this.terms[i].factor>1) this.terms[i].factor-=2; }
    } else if (ey>12) {
      for (let i=6; i<12; i++) { if (this.terms[i].factor>0) this.terms[i].factor-=1; }
    }
console.log(ex+"\t"+ey);
  }
  this.getX=(t)=>{ 
    return this.tx1.getValue(t)
          +this.tx3.getValue(t)
          +this.tx5.getValue(t)
          +this.tx7.getValue(t) 
          +this.tx9.getValue(t)
          +this.tx11.getValue(t); 
  }
  this.getY=(t)=>{ 
    return this.ty1.getValue(t)
          +this.ty3.getValue(t)
          +this.ty5.getValue(t)
          +this.ty7.getValue(t)
          +this.ty9.getValue(t)
          +this.ty11.getValue(t); 
  }
}

var curve1=new Curve2();
var curve2=new Curve2();

var equation=(()=>{
  this.div=(()=>{
    let e=document.createElement("div");
    e.style.position="absolute";
    e.style.top="20px";
    e.style.left="20px";
    e.style.fontSize="24px";
    e.style.fontFamily="monospace";
    e.style.fontWeight="bold";
if (PUBLISH) {
    e.style.background="#444";
    e.style.color="white";
} else {
    e.style.background="white";
}
    body.append(e);
    return e;
  })();
  this.clear=()=>{ while (div.firstChild) div.removeChild(div.firstChild); }
  this.getArg=(term)=>{
    if (term.mult==1) {
      return "(t)";
    } else {
      return "("+term.mult+"t)";
    }
  }
  this.write2=()=>{
    let parametric=(term)=>{
      return ""
	+(term.factor!=1?term.factor+"\u00B7":"")
	+(PolarType[term.polType].name)
	+(term.mult==1?"(t)":"("+term.mult+"t)")
    }
    this.clear();
    this.div.append(  // x line
      (()=>{
        let xl=document.createElement("div");
        xl.textContent=("x=");
        let init=true;
        for (let i=0; i<6; i++) {  
          if (curve1.terms[i].factor!=0) {
            if (curve1.terms[i].sign<0) {
              xl.append("-");
            } else {
              if (!init) xl.append("+"); 
            }
            init=false;
            xl.append(parametric(curve1.terms[i]));
          }
        }
        return xl;
      })()
    );
    this.div.append(  // y line
      (()=>{
        let xl=document.createElement("div");
        xl.textContent=("y=");
        let init=true;
        for (let i=6; i<12; i++) {  
          if (curve1.terms[i].factor!=0) {
            if (curve1.terms[i].sign<0) {
              xl.append("-");
            } else {
              if (!init) xl.append("+"); 
            }
            init=false;
            xl.append(parametric(curve1.terms[i]));
          }
        }
        return xl;
      })()
    );
  }
  return this;
})();

var ctx=canvas.getContext('2d');
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=3;
ctx.font="50px monospace";
ctx.fillStyle="#AAD";
if (PUBLISH) {
  ctx.strokeStyle="hsl(60,90%,80%)";
} else {
  ctx.strokeStyle="black";
}

var drawCH=()=>{
  ctx.save();
  ctx.lineWidth=1;
  ctx.strokeStyle="#BBB";
  ctx.beginPath();
  ctx.moveTo(-CSIZE,0);
  ctx.lineTo(CSIZE,0);
  ctx.moveTo(0,-CSIZE);
  ctx.lineTo(0,CSIZE);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

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

var draw=(frac, fin)=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  if (fin) {
    drawCH();
    equation.write2();
  }
  ctx.beginPath();
  let scale=SCALE;
  let x=cbLoc(curve2.getX(0),curve1.getX(0),frac);
  let y=cbLoc(curve2.getY(0),curve1.getY(0),frac);
  ctx.moveTo(scale*x,scale*y);
  for (let t=0; t<=Math.PI*2; t+=Math.PI/500) {
    x=cbLoc(curve2.getX(t),curve1.getX(t),frac);
    y=cbLoc(curve2.getY(t),curve1.getY(t),frac);
    ctx.lineTo(scale*x,scale*y);
  }
  ctx.closePath();
  //ctx.fill();
  ctx.stroke();
//ctx.fill('evenodd');
}

var randomize=()=>{
  curve1.randomizeFactors();
  curve1.randomizeSign();
  curve1.randomizeMultipliers();
  let ex=curve1.tx1.factor+curve1.tx2.factor+curve1.tx3.factor;
  if (ex<0.2) {
    curve1.tx1.factor=0.8;
  } else if (ex<0.6) {
    curve1.tx1.factor*=2;
    curve1.tx2.factor*=2;
    curve1.tx3.factor*=2;
  }
  let ey=curve1.ty1.factor+curve1.ty2.factor+curve1.ty3.factor;
  if (ey<0.2) {
    curve1.ty1.factor=0.8;
  } else if (ey<0.6) {
    curve1.ty1.factor*=2;
    curve1.ty2.factor*=2;
    curve1.ty3.factor*=2;
  }
}

var transit=()=>{
  for (let i in curve1.terms) {
    curve1.terms[i].copyValues(curve2.terms[i]);
  }
  curve1.randomize();
if (!PUBLISH) { setControls(); }
}

var step=0;
var start=()=>{
  if (step==Infinity && stx==0) { 
    equation.clear();
    step=0;
    transit();
    requestAnimationFrame(animate);
  } else {
    step=Infinity;
  }
}

var pauseTS=1400;
var pause=(ts)=>{
  if (step==Infinity) {
    draw(1,true);
    return;
  }
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
  if (progress<4000) {
    let frac=progress/4000;
    draw(frac);
    requestAnimationFrame(animate);
  } else {
    draw(1);
    //draw(1,true);
    stx=0;
    if (step==Infinity) {
      draw(1,true);
      return;
    }
    pauseTS=performance.now()+60;
    //pauseTS=performance.now()+1800;
    requestAnimationFrame(pause);
    //transit();
    //requestAnimationFrame(animate);
    //requestAnimationFrame(fade.animate);
  }
}

//ZZZ

if (!PUBLISH) {
var getStdRange=(min,max,step)=>{
  let sr=document.createElement("input");
  sr.type="range";
  sr.min=min;
  sr.max=max;
  sr.step=step;
  sr.style.height="12px";
  return sr;
}
var control=(term)=>{
  let c=document.createElement("div");
  c.style.display="grid";
  c.style.gridTemplateColumns="auto auto auto";
  c.style.padding="10px";
  c.append(
    (()=>{
      let r=document.createElement("div");
      r.style.fontFamily="monospace";
      r.style.fontWeight="bold";
      r.style.fontSize="16px";
      r.style.borderBottom="1px solid silver";
      c.setReport=()=>{
        r.textContent=
           //(term.factor<0?" ":" \u00A0")
           (term.sign<0?"-":"")
          +term.factor.toFixed(1)
          +" "
          +PolarType[term.polType].name 
          +"("+term.mult+"t)"
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
	  let rV=getStdRange(-10,10,1);
          rV.title="factor";
	  rV.oninput=(event)=>{
	    term.factorCall(rV); 
	    c.setReport();
	  }
	  c.setFactorSlider=()=>{ rV.value=term.factor*term.sign; }
	  return rV;
	})(),
	(()=>{
	  let r=getStdRange(1,15,1);
	  r.oninput=(event)=>{
	    term.multCall(r); 
	    c.setReport();
	  }
	  c.setMultSlider=()=>{ r.value=term.mult; }
	  return r;
	})(),
	(()=>{
	  let r=getStdRange(0,1,1);
	  r.oninput=(event)=>{
	    term.polTypeCall(r); 
	    c.setReport();
	  }
	  c.setPolTypeSlider=()=>{ r.value=term.polType; }
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
  }
  term.control=c;
  return c;
}
grid.append((()=>{
  let c=document.createElement("div");
  c.append(
    control(curve1.tx1),
    control(curve1.tx3),
    control(curve1.tx5),
    control(curve1.tx7),
    control(curve1.tx9),
    control(curve1.tx11),
    control(curve1.ty1),
    control(curve1.ty3),
    control(curve1.ty5),
    control(curve1.ty7),
    control(curve1.ty9),
    control(curve1.ty11),
  );
  return c;
})());
var setControls=()=>{
  for (let tc of curve1.terms) {
    tc.setControl();
  }
}
}

//ZZZ

if (!PUBLISH) { setControls(); }
onresize();
draw(1);
requestAnimationFrame(pause);
