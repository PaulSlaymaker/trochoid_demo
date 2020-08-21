"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
const PUBLISH=false;
const TP=2*Math.PI;

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
const scale=30;

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
    curve1.setPoints();
    draw();
  }
  this.multCall=(inp)=>{ 
    this.mult=parseInt(inp.value); 
    this.mult=parseInt(inp.value); 
    curve1.setPoints();
    draw();
  }
  this.polTypeCall=(inp)=>{ 
    this.polType=parseInt(inp.value);
    curve1.setPoints();
    draw();
  }
  this.setControl=()=>{ 
  }
//  this.randomizeFactor=()=>{ this.factor=[0.4,0.3,0.2,0.1,0][getRandomInt(0,5,true)]; }
//  this.randomizeMultiplier=()=>{ this.mult=[3,1,5,7,9,11,13][getRandomInt(0,7,true)]; }
  this.copyValues=(term)=>{
    if (term instanceof Term) { 
      term.factor=this.factor;
      term.sign=this.sign;
      term.polType=this.polType;
      term.mult=this.mult;
    }
  }
}

var counter=0;

var Curve=function(c) {
  this.pts=[];
  this.tx1=new Term(0,1,0);
  this.tx3=new Term(0,3,0);
  this.tx5=new Term(0,5,0);
  this.tx7=new Term(0,7,9);
  this.tx9=new Term(0,9,0);
  this.ty1=new Term(1,1,0);
  this.ty3=new Term(1,3,0);
  this.ty5=new Term(1,5,0);
  this.ty7=new Term(1,7,0);
  this.ty9=new Term(1,9,9);
  this.xTerms=[this.tx1,this.tx3,this.tx5,this.tx7,this.tx9];
  this.yTerms=[this.ty1,this.ty3,this.ty5,this.ty7,this.ty9];
  this.terms=[this.tx1,this.tx3,this.tx5,this.tx7,this.tx9,
              this.ty1,this.ty3,this.ty5,this.ty7,this.ty9];
  this.randomize=()=>{ 
    counter++;
    if (counter%8==0) {
      this.tx9.factor=this.tx5.factor=this.tx3.factor=this.tx1.factor=0;
      this.ty7.factor=this.ty5.factor=this.ty3.factor=0;
      this.tx7.factor=10;
      this.ty1.factor=getRandomInt(0,11);
      this.ty9.factor=10-this.ty1.factor;
      return;
    } else if (counter%7==0) {
      this.tx7.factor=this.tx5.factor=this.tx3.factor=0;
      this.ty7.factor=this.ty5.factor=this.ty3.factor=0;
      if (Math.random()<0.5) {
	this.tx9.factor=getRandomInt(0,10);
	this.ty9.factor=getRandomInt(0,10);
	this.tx1.factor=0;
	this.ty1.factor=0;
      } else {
	this.tx1.factor=getRandomInt(0,10);
	this.ty1.factor=getRandomInt(0,10);
	this.tx9.factor=0;
	this.ty9.factor=0;
      }
      return;
    } else if (counter%6==0) {
      this.tx7.factor=this.tx5.factor=this.tx3.factor=0;
      this.ty7.factor=this.ty5.factor=this.ty3.factor=0;
      this.tx1.factor=getRandomInt(4,7);
      this.tx9.factor=10-this.tx1.factor;
      this.ty1.factor=getRandomInt(4,7);
      this.ty9.factor=10-this.ty1.factor;
      this.tx9.mult=this.ty9.mult=[9,11,13,15][getRandomInt(0,4)];
      return;
    } else {

    for (let i in this.xTerms) {
      if (Math.random()<0.3+i/10) {
	this.xTerms[i].factor=0;
      } else {
	this.xTerms[i].factor=[1,2,3,4,5][getRandomInt(0,5)]; 
      }
      if (Math.random()<0.07) { this.xTerms[i].sign*=-1; }
    }
    for (let i in this.yTerms) {
      if (Math.random()<0.3+i/10) {
	this.yTerms[i].factor=0;
      } else {
	this.yTerms[i].factor=[1,2,3,4,5][getRandomInt(0,5)]; 
      }
      if (Math.random()<0.07) { this.yTerms[i].sign*=-1; }
    }
    let ex=this.tx1.factor+this.tx3.factor+this.tx5.factor+this.tx7.factor+this.tx9.factor;
    if (ex<1) {
      this.xTerms[getRandomInt(0,5)].factor=9;
    } else if (ex<2) {
      this.xTerms.forEach((te)=>{ te.factor*=8; });
    } else if (ex<3) {
      this.xTerms.forEach((te)=>{ te.factor*=4; });
    } else if (ex<4) {
      this.xTerms.forEach((te)=>{ te.factor*=2; });
    } else if (ex<5) {
      this.xTerms.forEach((te)=>{ if (te.factor>0) te.factor+=2; });
    } else if (ex<6) {
      this.xTerms.forEach((te)=>{ if (te.factor>0) te.factor+=1; });
    } else if (ex>16) {
      for (let i=0; i<6; i++) { if (this.terms[i].factor>1) this.terms[i].factor-=2; }
    } else if (ex>12) {
      for (let i=0; i<6; i++) { if (this.terms[i].factor>0) this.terms[i].factor-=1; }
    }
    let ey=this.ty1.factor+this.ty3.factor+this.ty5.factor+this.ty7.factor+this.ty9.factor;
    if (ey<1) {
      this.terms[getRandomInt(5,10)].factor=9;
    } else if (ey<2) {
      for (let i=5; i<10; i++) { this.terms[i].factor*=8; }
    } else if (ey<3) {
      for (let i=5; i<10; i++) { this.terms[i].factor*=4; }
    } else if (ey<4) {
      for (let i=5; i<10; i++) { this.terms[i].factor*=2; }
    } else if (ey<5) {
      this.yTerms.forEach((te)=>{ if (te.factor>0) te.factor+=2; });
    } else if (ey<6) {
      this.yTerms.forEach((te)=>{if (te.factor>0) te.factor+=1; });
    } else if (ey>16) {
      for (let i=5; i<10; i++) { if (this.terms[i].factor>1) this.terms[i].factor-=2; }
    } else if (ey>12) {
      for (let i=5; i<10; i++) { if (this.terms[i].factor>0) this.terms[i].factor-=1; }
    }
  }
  }
  this.getX=(t)=>{ 
    return this.tx1.getValue(t)
          +this.tx3.getValue(t)
          +this.tx5.getValue(t)
          +this.tx7.getValue(t) 
          +this.tx9.getValue(t);
  }
  this.getY=(t)=>{ 
    return this.ty1.getValue(t)
          +this.ty3.getValue(t)
          +this.ty5.getValue(t)
          +this.ty7.getValue(t)
          +this.ty9.getValue(t);
  }
  this.setPoints=()=>{
    this.pts=[];
    for (let i=0; i<Z; i+=1) {
      let t=i*TP/Z;
      this.pts.push({x:this.getX(t),y:this.getY(t)});
    }
  }
}

var curve1=new Curve();
var curve2=new Curve();

var ctx=canvas.getContext("2d");
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=3;
ctx.lineJoin="round";
//ctx.font="50px monospace";
ctx.fillStyle="#AAD";
//ctx.fillStyle='hsla(0,100%,100%,.8)';
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
  this.write=()=>{
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
        for (let i=0; i<5; i++) {  
          if (curve1.xTerms[i].factor!=0) {
            if (curve1.xTerms[i].sign<0) {
              xl.append("-");
            } else {
              if (!init) xl.append("+"); 
            }
            init=false;
            xl.append(parametric(curve1.xTerms[i]));
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
        for (let i=5; i<10; i++) {  
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

function cFrac() {
  let f1=.2;
  let f2=.8;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

const Z=400;

var draw=(fin)=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  if (fin) {
    drawCH();
    equation.write();
  }
  ctx.beginPath();
  let j=q%Z;
  let f=fracs[j];
  let x=(1-f)*curve2.pts[0].x+f*curve1.pts[0].x;
  let y=(1-f)*curve2.pts[0].y+f*curve1.pts[0].y;
  ctx.moveTo(scale*x,scale*y);
  for (let i=1; i<Z; i+=1) {
//let j=(i+100)%Z/2;
j=(fracFactor*i+q)%Z;
//let j=i;
    if (j<Z/2) {
      f=fracs[j];
    } else {
      f=fracs[Z-1-j];
    }
    x=(1-f)*curve2.pts[i].x+f*curve1.pts[i].x;
    y=(1-f)*curve2.pts[i].y+f*curve1.pts[i].y;
    ctx.lineTo(scale*x,scale*y);
  }
  ctx.closePath();
  ctx.stroke();
}

var transit=()=>{
/*
  for (let i in curve1.terms) {  // deprecate
    curve1.terms[i].copyValues(curve2.terms[i]);
  }
*/
for (let i in curve1.pts) {
  curve2.pts[i]={x:curve1.pts[i].x,y:curve1.pts[i].y};
}
  curve1.randomize();
  curve1.setPoints();
if (!PUBLISH) { setControls(); }
}

var step=0;
const start=()=>{
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
    draw(true);
    return;
  }
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    transit();
    q=[0,fCount][getRandomInt(0,2)];
    fracFactor=[2,4,1,3][getRandomInt(0,4,true)];
    requestAnimationFrame(animate);
  }
}

var q=0;
var fracFactor=2;
var stx=0;
var frac=0;
var stxs=[];
var duration=4000;
var durF=1600;
var fCount=200;
var fracs=(()=>{
  let f=[];
  for (let i=0; i<fCount; i++) f[i]=1;
  return f; 
})();
var animate=(ts)=>{
  if (!stx) {
    stx=ts;
    for (let i=0; i<fCount; i++) {
      stxs[i]=ts+i*12;  // (duration-durF)/fCount
    }
  }
  for (let i=0; i<fCount; i++) {
    let pgs=ts-stxs[i];
    if (pgs<0) {
      fracs[i]=0;
    } else if (pgs<durF) {
      fracs[i]=pgs/durF; 
    } else {
      fracs[i]=1;
    }
  }
  let progress=ts-stx;
  if (progress<duration) {
    frac=progress/duration;
    draw();
/*
    if (!fade) fade=ts;
    if (ts-fade>60) {
      ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
      fade=0;
    }
*/ 
    requestAnimationFrame(animate);
  } else {
    draw();
    stx=0;
    if (step==Infinity) {
      draw(true);
      return;
    }
    pauseTS=performance.now()+600;
    //pauseTS=performance.now()+1800;
    requestAnimationFrame(pause);
    //requestAnimationFrame(animate);
  }
}

if (!PUBLISH) {
var control=(term)=>{
  let getStdRange=(min,max,step)=>{
    let sr=document.createElement("input");
    sr.type="range";
    sr.min=min;
    sr.max=max;
    sr.step=step;
    sr.style.height="12px";
    return sr;
  }
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
          +"("+term.mult+"t)";
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
	  let r=getStdRange(1,21,1);
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
    control(curve1.ty1),
    control(curve1.ty3),
    control(curve1.ty5),
    control(curve1.ty7),
    control(curve1.ty9),
  );
  return c;
})());
}
const setControls=()=>{
  for (let tc of curve1.xTerms) tc.setControl();
  for (let tc of curve1.yTerms) tc.setControl();
}

curve1.setPoints();
curve2.setPoints();
//transit();

if (!PUBLISH) setControls();

onresize();
draw();
requestAnimationFrame(pause);
