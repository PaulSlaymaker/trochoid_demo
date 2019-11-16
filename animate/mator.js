"use strict"; // Paul Slaymaker, paul25882@gmail.com
var body=document.getElementsByTagName("body").item(0);

var styleSheet=(()=>{
  let tag=document.createElement("style");
  tag.type="text/css";
  body.append(tag);
  let ss=document.styleSheets[document.styleSheets.length-1];
  ss.insertRule(".cicon { border:1px solid silver; background:white; }",0);
  ss.insertRule(".cicon:hover { border:1px solid blue; }",0);
  return ss;
})();

var grid=(()=>{
  let g=document.createElement("div");
  g.style.display="grid";
  g.style.gridTemplateColumns="100px auto auto 1fr";
  g.style.textAlign="center";
  body.append(g);
  return g;
})();

/*
var request={};
var execute=(req)=>{
console.log("req "+req[shape]);
  request={};
}
*/

body.onclick=(event)=>{
  if (event.srcElement.classList.contains("cicon")) {
   let ic=event.srcElement;
if (!PUBLISH)  console.log(ic.name+" click ct "+ic.rc);
    if (ic.rc==0) {
      ic.shape.transit();
      ic.set2Value();
      ic.curve.an.beginElement();
    } else {
      //ic.rc=20;
    }
    return;
  } else {
if (!PUBLISH) console.log("out click");
  }
}

var PUBLISH=true;
const expos=["?","\u00B9","\u00B2","\u00B3","\u2074","\u2075"];
const PolarType=[Math.sin,Math.cos];
const SCALE=300;
var ICONSIZE=80;

var Icon=function(curve) {
  let c=document.createElement("div");
  c.className="icon";
  c.append((()=>{
    let sd=document.createElementNS("http://www.w3.org/2000/svg", "svg");
    sd.setAttribute("xmlns","http://www.w3.org/2000/svg");
    // export w/h
    sd.setAttribute("width","100");
    sd.setAttribute("height","100");
    sd.style.width=ICONSIZE+"px";
    sd.style.height=ICONSIZE+"px";
sd.style.pointerEvents="none";
    sd.append((()=>{
      let g=document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", "translate("+ICONSIZE/2+","+ICONSIZE/2+") scale("+ICONSIZE/800+","+ICONSIZE/800+")");
      if (typeof curve == "object") {
        g.append(curve);
      }
      c.setSize=(full)=>{
	//let ww2=full?window.innerHeight-24:ICONSIZE;
	let ww2=full?window.innerHeight-40:ICONSIZE;
	sd.style.width=ww2+"px";
	sd.style.height=ww2+"px";
	g.setAttribute("transform", "translate("+ww2/2+","+ww2/2+") scale("+ww2/800+","+ww2/800+")");
      }
      return g; 
    })());
    return sd;	// svg element
  })());
  c.curve=curve;
  c.setIconShape=(shpe)=>{
    c.shape=shpe;
    c.curve.style.fill=shpe.stdColor;
    c.curve.style.stroke=shpe.stdColor;
    //curve.an.setAttribute("dur",shpe.dur+"s");
  }
  c.showSize=()=>{
console.log("res:"+RES.toFixed(2)+"  size:"+c.innerHTML.length);
  }
  c.set2Value=()=>{
    c.curve.setValues(c.shape.dString2+" ; "+c.shape.dString1);
    // need to change keySplines?
  }
  c.draw3=()=>{
    let vals=c.shape.dString1+" ; "+c.shape.dString2+" ; "+c.shape.dString1;
    c.curve.setValues(vals);
  }
  //c.dra2=()=>{ c.setPath(c.shape.dString1); }
/*
  c.getDisplayIcon=(shpe)=>{  // take this out
    let di=new DisplayIcon(shpe);
    return di;
  }
*/
  return c;
}

var Curve=function() {
  let c=document.createElementNS("http://www.w3.org/2000/svg", "path");
  c.setAttribute("d","");
  c.append((()=>{
    let a=document.createElementNS("http://www.w3.org/2000/svg", "animate");
    a.setAttribute("attributeName","d");
    a.setAttribute("dur","0.4s");
    a.setAttribute("begin","indefinite");
    a.setAttribute("repeatCount","10");
// take next 2 out
    a.setAttribute("calcMode","spline");
    a.setAttribute("keySplines","0.2 0 0.8 1; 0.2 0 0.8 1");
    c.an=a;
    c.setAnimation=(on)=>{
      if (on) {
        a.beginElement();
      } else {
        a.endElement();
      }
    }
    c.setValues=(v)=>{ a.setAttribute("values",v); }
    c.setTF=(t,f)=>{ 
      a.setAttribute("to",t); 
      a.setAttribute("from",f); 
    }
    c.setDuration=(ds)=>{ a.setAttribute("dur",ds); }
    return a;
  })());
  c.setPath=(v)=>{ c.setAttribute("d",v); }
  return c;
}

var getStdRange=(min,max,step)=>{
  let sr=document.createElement("input");
  sr.type="range";
  sr.min=min;
  sr.max=max;
  sr.step=step;
  sr.style.height="12px";
  return sr;
}

var Control=function(name,term) {
  this.tx=term;
  let c=document.createElement("div");
  c.style.display="grid";
  c.style.gridTemplateColumns="auto auto auto auto";
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
           (this.tx.factor<0?" ":" \u00A0")
          +this.tx.factor.toFixed(1)
          +" "
          +PolarType[this.tx.calc.polType].name 
          //+this.tx.calc.exp
          //+expos[this.tx.calc.exp]
          //+"("+this.tx.calc.mult+"t)"
        ;
        r.append(this.getExp(this.tx));
        r.append("("+this.tx.calc.mult+"t)");
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
	  let rV=getStdRange(-1.2,1.2,0.1);
          rV.title="factor";
	  rV.oninput=(event)=>{
	    this.tx.factorCall(rV); 
	    c.setReport();
            this.df();
	  }
	  c.setFactorSlider=()=>{ rV.value=this.tx.factor; }
	  return rV;
	})(),
	(()=>{
	  let r=getStdRange(1,12,1);
	  r.oninput=(event)=>{
	    this.tx.multCall(r); 
	    c.setReport();
            this.df();
	  }
	  c.setMultSlider=()=>{ r.value=this.tx.calc.mult; }
	  return r;
	})(),
	(()=>{
	  let r=getStdRange(0,1,1);
	  r.oninput=(event)=>{
	    this.tx.polTypeCall(r); 
	    c.setReport();
            this.df();
	  }
	  c.setPolTypeSlider=()=>{ r.value=this.tx.calc.polType; }
	  return r;
	})(),
	(()=>{
	  let r=getStdRange(1,9,1); // no entity for 7
	  r.oninput=(event)=>{
	    this.tx.expCall(r); 
	    c.setReport();
            this.df();
	  }
	  c.setExpSlider=()=>{ r.value=this.tx.calc.exp; }
	  return r;
	})(),
      );  
      return rs;
    })(),
  );
  c.setControlTerm=(tt,df)=>{
    if (tt instanceof Term) { 
      this.tx=tt;
      this.df=df;
    } else {
if (!PUBLISH) debugger;
    }
  }
  c.setControlX=()=>{
    c.setReport();
    c.setFactorSlider();
    c.setMultSlider();
    c.setPolTypeSlider();
    c.setExpSlider();
  }
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
    return Math.pow(PolarType[this.polType](this.mult*t),this.exp);
  }
  this.eq=(calc2)=>{
    return this.polType==calc2.polType && this.mult==calc2.mult && this.exp==calc2.exp;
  }
}

var Shape=function(t1,t2,t3,t4) {
  this.t1=t1;
  this.t2=t2;
  this.t3=t3;
  this.t4=t4;
  this.t1save=new Term(new Calc(t1.calc.polType,t1.calc.mult,t1.calc.exp));
  this.t2save=new Term(new Calc(t2.calc.polType,t2.calc.mult,t2.calc.exp));
  this.t3save=new Term(new Calc(t3.calc.polType,t3.calc.mult,t3.calc.exp));
  this.t4save=new Term(new Calc(t4.calc.polType,t4.calc.mult,t4.calc.exp));
  //this.x=[];  // 3 to 8
  this.dString1="";
  this.dString2="";
  this.fillRule="";
  this.getX=(t)=>{ return this.t1.getValue(t)+this.t2.getValue(t); }
  this.getY=(t)=>{ return this.t3.getValue(t)+this.t4.getValue(t); }
  this.getXs=(t)=>{ return this.t1save.getValue(t)+this.t2save.getValue(t); }
  this.getYs=(t)=>{ return this.t3save.getValue(t)+this.t4save.getValue(t); }
  this.copyTerms=()=>{
    this.t1.copyValues(this.t1save);
    this.t2.copyValues(this.t2save);
    this.t3.copyValues(this.t3save);
    this.t4.copyValues(this.t4save);
  }
/*
  this.transit=()=>{
    dString2=dString1;
    this.t1.copyValues(this.t1save);
    this.t2.copyValues(this.t2save);
    this.t3.copyValues(this.t3save);
    this.t4.copyValues(this.t4save);
  }
*/
}

var Term=function(calc,factor) {
  // single calc start, move to calc*calc*...
  this.calc=calc;
  this.factori=factor;
  this.factor=factor;
  this.getValue=(t)=>{ return this.factor*this.calc.getCalc(t); }
  this.factorCall=(inp)=>{ 
    this.factor=parseFloat(inp.value); 
//adjustFactors();
    // set dStrings 
/*
    if (state!=EXPLORE) {
      repeatCount=0;
      draw(1);
    }
*/
  }
  this.multCall=(inp)=>{ 
    this.calc.mult=parseInt(inp.value); 
  }
  this.polTypeCall=(inp)=>{ 
    //this.calc.polType=[Math.sin,Math.cos][parseInt(inp.value)];
    this.calc.polType=parseInt(inp.value);
    //draw(1);
  }
  this.expCall=(inp)=>{ 
    this.calc.exp=parseInt(inp.value); 
    //draw(1);
  }
  this.randomizeFactor=()=>{
    this.factor=(10-2*getRandomInt(0,11))/10;
  }
  this.randomizeCalc=()=>{
//if (true) { // sscc only, vert symmetry, make shape property
    this.calc.polType=[0,1][getRandomInt(0,2)];
//}
    //this.calc.exp=[1,3,5][getRandomInt(0,3,true)];
    this.calc.exp=[1,3,5][getRandomInt(0,2,true)]; // 1,3 for low res
    //this.calc.mult=getRandomInt(1,7,true);
    this.calc.mult=getRandomInt(1,11,true);
  }
  this.randomize=()=>{
    this.randomizeFactor();
    this.randomizeCalc();
    //this.factor=(10-2*getRandomInt(0,11))/10;
/*
    //this.calc.exp=[1,3,5][getRandomInt(0,3,true)];
    this.calc.exp=[1,3,5][getRandomInt(0,2,true)];
    //this.calc.mult=getRandomInt(1,7,true);
    this.calc.mult=getRandomInt(1,6,true);
*/
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
if (!PUBLISH) debugger;
    }
  }
}

var curveAN=(()=>{
  let c=new Curve();
c.an.setAttribute("fill","freeze");
c.an.setAttribute("repeatCount",0);
c.an.setAttribute("dur",0);
  return c;
})();

grid.append("\u00A0");

var srep=(s)=>{
  let sr=document.createElement("span");
  sr.append(s);
  return s;
}

var DisplayIcon=function(shpe) {
  let di=new Icon(new Curve());
  di.setIconShape(shpe);
  di.id="phs"+new Date().getTime();
  di.style.border="1px solid transparent";
  di.curve.style.fill=shpe.color;
  di.curve.style.fillRule=shpe.fillRule;
  di.curve.stroke=shpe.color;
  di.curve.an.setAttribute("fill","freeze");
  di.curve.an.setAttribute("repeatCount", "6");
  di.curve.an.setAttribute("dur", shpe.dur*(5-0.5*Math.random()));
  di.curve.an.setAttribute("onend", "DisplayIcon.prototype.rmv("+di.id+")");
  di.draw3();
  di.curve.an.setAttribute("begin","0s");
if (!PUBLISH) di.append(srep(shpe.mString1+","+shpe.mString2));
  di.astart=0;
  di.animateIn=(ts)=>{
    if (!di.astart) { di.astart=ts; }
    let progress=ts-di.astart;
    if (progress<200) {
      let frac=progress/200;
      let mt=ICONSIZE*(frac-1);
      di.style.marginTop=mt+"px";
      requestAnimationFrame(di.animateIn);
    } else {
      di.style.marginTop="0px";
      di.astart=0;
    }
  } 
  di.animateOut=(ts)=>{
    if (!di.astart) { di.astart=ts; }
    let progress=ts-di.astart;
    if (progress<200) {
      let frac=progress/200;
      //let mt=ICONSIZE*(frac);
      di.style.opacity=1-frac;
      requestAnimationFrame(di.animateOut);
    } else {
      di.remove();
    }
  }
  return di;
}

DisplayIcon.prototype.rmv=function(wd) {
  requestAnimationFrame(wd.animateOut);
}

var ControlIcon=function(name) {
  let ci=new Icon(new Curve());
  ci.name=name;
  ci.classList.add("cicon");
  ci.curve.an.setAttribute("fill","freeze");
  ci.curve.an.setAttribute("repeatCount","1");
  ci.curve.an.setAttribute("keySplines","0.2 0 0.8 1");
  ci.rc=0;
  ci.cycle=()=>{
    if (ci.rc++>3) {
      ci.rc=0;
      return;
    }
    if (displayCol.count()<4) {
      //displayCol.add(ci.getDisplayIcon(ci.shape));  // use constructor, not get
      displayCol.add(new DisplayIcon(ci.shape));
    } else {
      ci.rc=0;
      return;
    }
    ci.shape.transit();
    ci.set2Value();
    ci.curve.an.beginElement();
  }
  ci.stopAnimation=()=>{ ci.rc=20; }
  ci.setSliders=()=>{ 
ci.curve.an.remove();
    sliders.setSliders(ci); 
  }
  ci.draw=()=>{ 
ci.curve.an.setAttribute("values","");
    ci.shape.dString1=getSVGPath(1,ci.shape);
    ci.curve.setPath(ci.shape.dString1);
    //ci.set2Value(); 
    //ci.draw3(); 
  }
  return ci;
}

var randomIcon=(()=>{
  let ri=new ControlIcon("random");
  ri.curve.style.fillRule="evenodd";
  ri.curve.an.setAttribute("onend","randomIcon.repeat()");
  ri.repeat=()=>{
if (!PUBLISH) console.log("rnd cyc "+ri.rc);
    ri.cycle();
  }
  return ri;
})();

var heartIcon=(()=>{
  let hi=new ControlIcon("heart");
  hi.curve.an.setAttribute("onend","heartIcon.repeat()");
  hi.repeat=()=>{
if (!PUBLISH) console.log("ht cyc "+hi.rc);
    hi.cycle();
  }
  return hi;
})();

var starIcon=(()=>{
  let si=new ControlIcon("star");
  si.curve.an.setAttribute("onend","starIcon.repeat()");
  si.repeat=()=>{
if (!PUBLISH) console.log("star cyc "+si.rc);
    si.cycle();
  }
  return si;
})();

var rouletteIcon=(()=>{
  let ri=new ControlIcon();
  ri.curve.style.fillRule="evenodd";
  ri.curve.an.setAttribute("onend","rouletteIcon.repeat()");
  ri.repeat=()=>{
if (!PUBLISH) console.log("ro cyc "+ri.rc);
    ri.cycle();
  }
  return ri;
})();

grid.append((()=>{
  let icons=document.createElement("div");
  icons.style.display="grid";
  icons.style.gridTemplateColumns="auto";
  icons.style.gridTemplateRows="auto auto auto auto 1fr";
//  icons.style.background="silver";
  icons.append(heartIcon);
  icons.append(starIcon);
  icons.append(rouletteIcon);
  icons.append(randomIcon);
  icons.append((()=>{
    let space=document.createElement("div");
    space.style.background="white";
    return space;
  })());
  return icons;
})());

var displayContainer=(()=>{
  let c=document.createElement("div");
  c.style.gridTemplateColumns="auto";
  c.style.background="white";
  c.style.padding="0 40px";
  grid.append(c);
  return c;
})();

var displayCol={
  count:()=>{
    return displayContainer.children.length;
  },
  add:(as)=>{
//    as.id="phs"+new Date().getTime();
    let an=as.getElementsByTagName("animate")[0];

//    an.setAttribute("onend","displayCol.remove('"+as.id+"')");

    as.style.marginTop=-ICONSIZE+"px";
    displayContainer.insertBefore(as,displayContainer.firstElementChild);
    //displayContainer.append(as);
    //requestAnimationFrame(displayCol.animate);
    requestAnimationFrame(as.animateIn);
    return true;
  },
  remove:(id)=>{ document.getElementById(id).remove(); },
  clear:()=>{ 
    document.querySelectorAll("[id^='phs']").forEach((d)=>{ d.remove(); });
  },
  astart:0,
/*
  animateZ:(ts)=>{
    if (!displayCol.astart) {
      displayCol.astart=ts;
    }
    let progress=ts-displayCol.astart;
    if (progress<200) {
      let frac=progress/200;
      let mt=ICONSIZE*(frac-1);
      displayContainer.firstElementChild.style.marginTop=mt+"px";
      requestAnimationFrame(displayCol.animate);
    } else {
      displayContainer.firstElementChild.style.marginTop="0px";
      displayCol.astart=0;
    }
  }
*/
}

onresize=function() {
  ICONSIZE=Math.trunc((window.innerHeight-40)/32)*8;
  document.querySelectorAll(".icon").forEach((i)=>{ 
    i.setSize(false);
  });
}

var cbLoc=(p1,p2,frac)=>{
  var f1=.2;
  var f2=.8;
  var e1=Math.pow(1-frac,3)*p1;
  var e2=3*frac*Math.pow(1-frac,2)*(p1+(p2-p1)*f1);
  var e3=3*(1-frac)*Math.pow(frac,2)*(p1+(p2-p1)*f2);
  var e4=Math.pow(frac,3)*p2;
  return e1+e2+e3+e4;
}

var RES300=0.02;
var RES100=Math.PI/50;
var RES80=Math.PI/40;
var RES60=Math.PI/30;
var RES40=Math.PI/20;
var RES30=Math.PI/15;  // min for 60x60
var RES20=Math.PI/10;
var RES10=Math.PI/5;
var RES8=Math.PI/4;
var RES6=Math.PI/3;
var RES4=Math.PI/2;
var RES2=Math.PI;
var RES=RES80;

var getSVGPath=(frac,shp)=>{
  let data="M";
  let scale=SCALE;
  let x=scale*cbLoc(shp.getXs(0),shp.getX(0),frac);
  let y=scale*cbLoc(shp.getYs(0),shp.getY(0),frac);
//if (isNaN(x)) { debugger; }
  data+=(Math.floor(x)+" "+Math.floor(y));
  for (let t=0; t<=Math.PI*2; t+=RES) {
    x=scale*cbLoc(shp.getXs(t),shp.getX(t),frac);
    y=scale*cbLoc(shp.getYs(t),shp.getY(t),frac);
    data+=("L"+Math.floor(x)+" "+Math.floor(y));
  }
  data+="z";
  return data;
}

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

var setRandomShape=()=>{  // beauty filter construction
  let t1=randomShape.t1;
  let t2=randomShape.t2;
  let t3=randomShape.t3;
  let t4=randomShape.t4;
  let bt=0;
  id="";
  if (t1.factor==0 && t2.factor==0) {
  //  id+="line";
    return -1;;
  }
  if (t3.factor==0 && t4.factor==0) {
   // id+="line";
    return -1;;
  }
  let sumEvenX=(t1.calc.mult+t2.calc.mult)%2==0;
  let sumEvenY=(t3.calc.mult+t4.calc.mult)%2==0;
  let sumOddX=!sumEvenX;
  let sumOddY=!sumEvenY;
  let sumEven=sumEvenX && sumEvenY;
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
  return bt;
}

var adjustFactors=(shpe)=>{
  let t1=shpe.t1;
  let t2=shpe.t2;
  let t3=shpe.t3;
  let t4=shpe.t4;
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
}

var randomize=()=>{
  let ctr2=0;
  do {  // unique terms will filter some good shapes
    let ctr=0;
    let termIds={};
    randomShape.t1.randomize();
    termIds[randomShape.t1.getId()]=true;
    do {
      randomShape.t2.randomize();
      ctr++;
    } while (termIds[randomShape.t2.getId()]);
    termIds[randomShape.t2.getId()]=true;
    ctr=0;
    do {
      randomShape.t3.randomize();
      ctr++;
    } while (termIds[randomShape.t3.getId()] && ctr<10);
    termIds[randomShape.t3.getId()]=true;
    ctr=0;
    do {
      randomShape.t4.randomize();
      ctr++;
    } while (termIds[randomShape.t4.getId()] && ctr<10);
if (!PUBLISH && ctr>10) debugger;
  } while (setRandomShape()<0 && ctr2<100);
  //} while (setRandomShape()!=10);
  //} while (false);
if (!PUBLISH) if (ctr2>20) console.log("ctr2 "+ctr2);
if (!PUBLISH && ctr2>200) debugger;

  adjustFactors(randomShape);

//if (!PUBLISH) if (id.startsWith("line")) debugger;
}

var randomShape=(()=>{
  let s=new Shape(
    new Term(new Calc(0,1,1),0.5),
    new Term(new Calc(0,2,1),0.5),
    new Term(new Calc(1,1,1),0.5),
    new Term(new Calc(1,3,1),0.5)
  );
  s.stdColor="hsl(240,40%,70%)";
  s.color=s.stdColor;
  s.dur=1;
s.fillRule="evenodd";
  s.symmetry=1;  // just going with setRandomShape and bilateral for now
//  s.randomize=()=>{ randomize(); }
  s.biset=false;
  s.randomizeBilateral=()=>{
    s.t1.factor=1;
    s.t2.factor=0;
    s.t3.factor=1;
    s.t4.factor=0;
    s.t1.calc.exp=[1,3,5][getRandomInt(0,3)];
    s.t3.calc.exp=[1,3,5][getRandomInt(0,3)];
    //s.t1.calc.mult=getRandomInt(1,7);
    //s.t1.calc.mult=[1,3,5][getRandomInt(0,3)];
    if (Math.random()<0.1) s.biset=!s.biset;
    if (s.biset) {
      s.t1.calc.mult=[2,4,6,8][getRandomInt(0,4)];
      s.t3.calc.mult=s.t1.calc.mult+[1,3][getRandomInt(0,2)];
    } else {
      s.t1.calc.mult=[1,3,5,7][getRandomInt(0,4)];
      s.t3.calc.mult=s.t1.calc.mult+[2,4][getRandomInt(0,2)];
    }
//    if (s.t1.calc.mult%2==0) { } else { }
/*
      s.t1.calc.eq(s.t3.calc)
      || (s.t1.calc.mult%2==1 && (s.t1.calc.mult-s.t3.calc.mult)%2!=0)
      || (s.t1.calc.mult%2==0 && (s.t1.calc.mult-s.t3.calc.mult)%2==0)
*/
  }
  s.transit=()=>{
if (!PUBLISH) s.mString2=s.mString1;
    s.copyTerms();
    //if (s.symmetry==1) {
    if (Math.random()<0.9) {
      s.randomizeBilateral();
if (!PUBLISH) {
s.mString1="B";
s.mString1+=s.t1.calc.mult+" "+s.t3.calc.mult;
}
    } else {
      if (Math.random()<0.8) {
	s.t1.randomizeFactor();
	s.t2.randomizeFactor();
	s.t3.randomizeFactor();
	s.t4.randomizeFactor();
	adjustFactors(s);
      } else {
	randomize();
      }
if (!PUBLISH) {
s.mString1="R";
s.mString1+=s.t1.calc.mult+" "+s.t2.calc.mult+" "+s.t3.calc.mult+" "+s.t4.calc.mult;
}
    }
    s.dString2=s.dString1;
    s.dString1=getSVGPath(1,s);
    s.color="hsl("+getRandomInt(0,360)+",70%,60%)";
  }
  return s;
})();
randomShape.transit();
randomShape.transit(); // wipe out non-random construction
//randomIcon.shape=randomShape;
randomIcon.setIconShape(randomShape);
randomIcon.curve.setPath(randomShape.dString1);

//need dynamic shape connection
// controls
if (!PUBLISH) {
//grid.append((()=>{
var sliders=(()=>{
  let c=document.createElement("div");
  let cX1=new Control("X1",randomShape.t1);
  let cX2=new Control("X2",randomShape.t2);
  let cY1=new Control("Y1",randomShape.t3);
  let cY2=new Control("Y2",randomShape.t4);
  c.append(cX1,cX2,cY1,cY2);
  c.setSliders=(icon)=> {
    cX1.setControlTerm(icon.shape.t1,icon.draw);
    cX1.setControlX();
    cX2.setControlTerm(icon.shape.t2,icon.draw);
    cX2.setControlX();
    cY1.setControlTerm(icon.shape.t3,icon.draw);
    cY1.setControlX();
    cY2.setControlTerm(icon.shape.t4,icon.draw);
    cY2.setControlX();
//    c.shape=shpe;
  }
  grid.append(c);
  return c;
})();

}

var heartShape=(()=>{
  let s=new Shape(
    new Term(new Calc(0,1,3),1),
    new Term(new Calc(0,1,1),0),
    new Term(new Calc(1,1,1),-0.8),
    new Term(new Calc(1,2,1),0.4),
  );
  s.t5=new Term(new Calc(1,3,1),0.1);
  s.t1save=new Term(new Calc(0,1,3),1);
  s.t2save=new Term(new Calc(0,1,1),0);
  s.t3save=new Term(new Calc(1,1,1),-0.8);
  //s.t4save=new Term(new Calc(1,2,1),0.5);
  s.t4save=new Term(new Calc(1,2,1),0.4);
  //s.t5save=new Term(new Calc(1,3,1),0.1);
  s.stdColor="hsl(0,70%,80%)";
  s.color=s.stdColor;
  s.dur=0.4;
  s.beat=1;
  s.getY=(t)=>{ 
    return s.t3.getValue(t)+s.t4.getValue(t)+s.t5.getValue(t); 
  }
  s.getYs=(t)=>{ 
    return s.t3save.getValue(t)+s.t4save.getValue(t)+s.t5.getValue(t); 
  }
  s.randomize=()=>{
    s.t1.factor=s.t1.factori*(1-0.3*s.beat*Math.random());
    s.t3.factor=s.t3.factori*(1-0.3*s.beat*Math.random());
    s.t4.factor=s.t4.factori*(1-0.3*s.beat*Math.random());
    //s.t5.factor=s.t5.factori*(1-0.4*Math.random());
    s.color="hsl("+((320+getRandomInt(0,80))%360)+",100%,70%)";
    s.beat*=-1;
  }
  s.transit=(copy)=>{
    s.copyTerms();
    //s.t5.copyValues(s.t5save);
    if (!copy) s.randomize();
    s.dString2=s.dString1;
    s.dString1=getSVGPath(1,s);
  }
  s.transit(true);
  return s;
})();
heartIcon.setIconShape(heartShape);
heartIcon.curve.setPath(heartShape.dString1);
heartShape.transit();

var starShape=(()=>{
  let s=new Shape(
    new Term(new Calc(0,1,3),1),
    new Term(new Calc(0,1,1),0),
    new Term(new Calc(1,1,3),1),
    new Term(new Calc(1,1,1),0),
  );
  s.stdColor=s.color="hsl(51,80%,70%)";
  //s.color=s.stdColor;
  s.dur=1;
  s.randomize=()=>{
    s.t1.calc.exp=[5,7,9,3][getRandomInt(0,4,true)];
    s.t3.calc.exp=[7,5,3,9][getRandomInt(0,4,true)];
    //s.t3.calc.exp=s.t1.calc.exp;
    s.t1.factor=s.t1.factori*(1-0.5*Math.random());
    s.t3.factor=s.t3.factori*(1-0.5*Math.random());
    s.color="hsl("+(getRandomInt(0,360)%360)+",90%,70%)";
  }
  s.transit=(copy)=>{
    s.copyTerms();
    if (!copy) s.randomize();
    s.dString2=s.dString1;
    s.dString1=getSVGPath(1,s);
  }
  s.transit(true);
  return s;
})();
starIcon.setIconShape(starShape);
starIcon.curve.setPath(starShape.dString1);
starShape.transit();

var rouletteShape=(()=>{
   // sscc
   // f1==f3 f2==f4, m1=m3=1, m2=m4>4, all e=1
  let s=new Shape(
    new Term(new Calc(0,1,1),0.5),
    new Term(new Calc(0,7,1),0.5),
    new Term(new Calc(1,1,1),0.5),
    new Term(new Calc(1,7,1),0.5),
  );
  s.stdColor="#D88";
  s.color="#D88";
  s.dur=1;
  s.fillRule="evenodd";
/*
  s.rp={
    "3":[[1,4],[1,7],[1,10],[2,5],[4,7],[5,8],[5,11],[8,11]],
    "4":[[1,5],[1,9],[3,7],[3,11],[5,9],[7,11]],
    "5":[[1,6],[1,11],[2,7],[2,12],[3,8],[4,9],[6,11],[7,12]]
  };
*/
  s.rp={
    "3a":[[1,4],[1,7],[1,10],[4,7]],
    "3b":[[2,5],[5,8],[5,11],[8,11]],
    "4" :[[1,5],[1,9],[3,7],[3,11],[5,9],[7,11]],
    "5a":[[1,6],[1,11],[6,11]],
    "5b":[[2,7],[2,12],[7,12]]
  };
  s.cset="4";
  //s.pairs=[[1,8],[2,9],[3,10],[4,11],[5,12]]; // 7 set -5
  s.transit=()=>{
    s.copyTerms();
//if (Math.random()<0.8) {
    if (Math.random()<0.1) {
      s.cset=["3a","3b","4","5a","5b"][getRandomInt(0,5)];
    }
    //let pair=s.pairs[getRandomInt(0,s.pairs.length)];
    let pair=s.rp[s.cset][getRandomInt(0,s.rp[s.cset].length)];
    if (Math.random()<0.5) {
      s.t1.calc.mult=pair[0];
      s.t3.calc.mult=pair[0];
      s.t2.calc.mult=pair[1];
      s.t4.calc.mult=pair[1];
    } else {
      s.t1.calc.mult=pair[1];
      s.t3.calc.mult=pair[1];
      s.t2.calc.mult=pair[0];
      s.t4.calc.mult=pair[0];
    }
//}
    s.t1.factor=s.t1.factori*(1.2-0.6*Math.random());
    s.t3.factor=s.t1.factor;
    s.t2.factor=1-Math.abs(s.t1.factor);
    s.t4.factor=s.t2.factor;
/*
    s.t1.randomizeFactor();
    s.t3.factor=s.t1.factor;
    s.t2.factor=1-Math.abs(s.t1.factor);
    s.t4.factor=s.t2.factor;
*/
    s.dString2=s.dString1;
    s.dString1=getSVGPath(1,s);
    s.color="hsl("+(getRandomInt(0,360)%360)+",80%,60%)";
if (!PUBLISH) {
s.mString2=s.mString1;
s.mString1=""+s.t1.calc.mult+s.t2.calc.mult+s.t3.calc.mult+s.t4.calc.mult;
}
  }
  s.transit();
  s.getId=()=>{
    return ""+s.t1.calc.mult+s.t2.calc.mult+s.t3.calc.mult+s.t4.calc.mult;
  }
  return s;
})();
rouletteIcon.setIconShape(rouletteShape);
rouletteShape.transit();
rouletteIcon.curve.setPath(rouletteShape.dString1);

let i=[heartIcon,starIcon,rouletteIcon,randomIcon][getRandomInt(0,4)];
//let i=rouletteIcon;
i.set2Value(); 
i.curve.an.setAttribute("begin","0s"); // sharts animation

onresize();

