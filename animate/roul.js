"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);

var styleSheet=(()=>{
  let tag=document.createElement("style");
  tag.type="text/css";
  body.append(tag);
  let ss=document.styleSheets[document.styleSheets.length-1];
  ss.insertRule(".cicon { border:1px solid silver; background:white; }",0);
  ss.insertRule(".cicon:hover { border:1px solid blue; }",0);
  ss.insertRule("svg { transform:rotate(180deg); }",0);
  return ss;
})();

var grid=(()=>{
  let g=document.createElement("div");
  g.style.display="grid";
  g.style.gridTemplateColumns="80px auto auto 1fr";
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
      displayCol.clear();      
      ic.shape.transit();
      ic.set2Value();
      ic.curve.an.setAttribute("dur","200ms");
      ic.curve.an.beginElement();
    } else {
      //ic.rc=20;
    }
    return;
  } else {
    if (event.srcElement.id.startsWith("phs")) {
      let di=event.srcElement;
      di.curve.an.beginElement();
    } else {
if (!PUBLISH) console.log("out click");
    }
  }
}

var PUBLISH=true;
const SCALE=280;
var ICONSIZE=80;
const DCOUNT=25;

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
    c.curve.style.fillRule=shpe.fillRule;
    //curve.an.setAttribute("dur",shpe.dur+"s");
  }
  c.showSize=()=>{
console.log("res:"+RES.toFixed(2)+"  size:"+c.innerHTML.length);
  }
  c.set2Value=()=>{
    c.curve.setValues(c.shape.dString2+" ; "+c.shape.dString1);
    // need to change keySplines?
  }
  c.set3Value=()=>{
    let vals=c.shape.dString1+" ; "+c.shape.dString2+" ; "+c.shape.dString1;
    c.curve.setValues(vals);
  }
  c.set4Value=()=>{
    let vals=c.shape.dString1+" ; "
            +c.shape.dString2+" ; "
            +c.shape.dString3+" ; "
            +c.shape.dString1;
    c.curve.setValues(vals);
  }
  return c;
}

var Path=function() {
  let c=document.createElementNS("http://www.w3.org/2000/svg", "path");
  c.setAttribute("d","");
  c.append((()=>{
    let a=document.createElementNS("http://www.w3.org/2000/svg", "animate");
    a.setAttribute("attributeName","d");
    a.setAttribute("dur","200ms");
    a.setAttribute("begin","indefinite");
    a.setAttribute("repeatCount","10");
// take next 2 out
    a.setAttribute("calcMode","spline");
    //a.setAttribute("keySplines","0.2 0 0.8 1; 0.2 0 0.8 1");
    a.setAttribute("keySplines","0.2 0 0.8 1; 0.2 0 0.8 1; 0.2 0 0.8 1");
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
    const pType=[Math.sin,Math.cos];
    return Math.pow(pType[this.polType](this.mult*t),this.exp);
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
  this.dString1="";
  this.dString2="";
  this.dString3="";
  this.mString1="";
  this.mString2="";
  this.mString3="";
  this.fillRule="";
  this.res=RES30;
  this.getX=(t)=>{ return this.t1.getValue(t)+this.t2.getValue(t); }
  this.getY=(t)=>{ return this.t3.getValue(t)+this.t4.getValue(t); }
  this.getSVGPath=()=>{
    let data="M";
    let scale=SCALE;
    let x=scale*this.getX(0);
    let y=scale*this.getY(0);
    data+=(Math.floor(x)+" "+Math.floor(y));
    for (let t=0; t<=Math.PI*2; t+=this.res) {
      x=scale*this.getX(t);
      y=scale*this.getY(t);
      data+=("L"+Math.floor(x)+" "+Math.floor(y));
    }
    data+="z";
    return data;
  }
  this.transitPaths=()=>{
    this.dString3=this.dString2;
    this.dString2=this.dString1;
    //this.dString1=getSVGPath(1,this);
    this.dString1=this.getSVGPath();
  }
  this.report=()=>{ return ""; }
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
  }
  this.expCall=(inp)=>{ 
    this.calc.exp=parseInt(inp.value); 
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
  let c=new Path();
c.an.setAttribute("fill","freeze");
c.an.setAttribute("repeatCount",0);
c.an.setAttribute("dur",0);
  return c;
})();

grid.append("\u00A0");

var srep=(s)=>{
  let sr=document.createElement("span");
  sr.style.position="absolute";
  sr.style.top="0";
  sr.style.left="0";
  sr.style.fontSize="11px";
  sr.style.color="#777";
  sr.append(s);
  return sr;
}

var DisplayIcon=function(shpe) {
  let di=new Icon(new Path());
  di.setIconShape(shpe);
  di.id="phs"+new Date().getTime();
  di.style.border="1px solid transparent";
  di.style.position="relative"; // for report child
  di.curve.style.fill=shpe.color;
  di.curve.style.fillRule=shpe.fillRule;
  di.curve.style.stroke=shpe.color;
  di.curve.an.setAttribute("fill","freeze");
  di.curve.an.setAttribute("repeatCount", "8");
  di.curve.an.setAttribute("dur", shpe.dur*(1+0.2*Math.random()));
  //di.curve.an.setAttribute("onend", "DisplayIcon.prototype.rmv("+di.id+")");
  //di.curve.an.setAttribute("onend", "DisplayIcon.prototype.setS("+di.id+")");
  di.set4Value();
  di.curve.an.setAttribute("begin","0s");
if (!PUBLISH) {
  //di.append(srep(shpe.mString1+","+shpe.mString2));
  di.append(srep(shpe.report()));
  //di.title=shpe.mString1+"\n"+shpe.mString2);
}
di.title=di.innerHTML.length;
  di.astart=0;
  di.animateIn=(ts)=>{
    if (!di.astart) { di.astart=ts; }
    let progress=ts-di.astart;
    if (progress<200) {
      let frac=progress/200;
      di.style.opacity=frac;
      requestAnimationFrame(di.animateIn);
    } else {
      di.style.opacity=1;
      di.astart=0;
    }
  } 
/*
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
*/

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

DisplayIcon.prototype.setS=function(wd) {
  wd.curve.an.setAttribute("repeatCount", "1");
}

var ControlIcon=function(name,duration) {
  let ci=new Icon(new Path());
  ci.name=name;
  ci.classList.add("cicon");
  ci.curve.an.setAttribute("fill","freeze");
  ci.curve.an.setAttribute("repeatCount","1");
  ci.curve.an.setAttribute("keySplines","0.2 0 0.8 1");
  ci.rc=0;
  ci.cycle=()=>{
    if (ci.rc++>DCOUNT-1) {
      ci.rc=0;
      return;
    }
    if (displayCol.count()<DCOUNT) {
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
    //ci.shape.dString1=getSVGPath(1,ci.shape);
    ci.shape.getSVGPath();
    ci.curve.setPath(ci.shape.dString1);
  }
  return ci;
}

/*
var heartIcon=(()=>{
  let hi=new ControlIcon("heart");
  hi.curve.an.setAttribute("dur","700ms");
  hi.curve.an.setAttribute("onend","heartIcon.repeat()");
  hi.repeat=()=>{
if (!PUBLISH) console.log("ht cyc "+hi.rc);
    hi.cycle();
  }
  return hi;
})();
*/

var rouletteIcon=(()=>{
  let ri=new ControlIcon();
  ri.curve.style.fillRule="evenodd";
  ri.curve.an.setAttribute("dur","100ms");
  ri.curve.an.setAttribute("onend","rouletteIcon.repeat()");
  ri.repeat=()=>{
//if (!PUBLISH) console.log("ro cyc "+ri.rc);
    ri.cycle();
  }
  return ri;
})();

var rouletteIcon3=(()=>{
  let ri=new ControlIcon();
  ri.curve.style.fillRule="evenodd";
  ri.curve.an.setAttribute("dur","100ms");
  ri.curve.an.setAttribute("onend","rouletteIcon3.repeat()");
  ri.repeat=()=>{
//if (!PUBLISH) console.log("ro cyc "+ri.rc);
    ri.cycle();
  }
  return ri;
})();

var rouletteIcon4=(()=>{
  let ri=new ControlIcon();
  ri.curve.style.fillRule="evenodd";
  ri.curve.an.setAttribute("dur","100ms");
  ri.curve.an.setAttribute("onend","rouletteIcon4.repeat()");
  ri.repeat=()=>{
//if (!PUBLISH) console.log("ro cyc "+ri.rc);
    ri.cycle();
  }
  return ri;
})();

var rouletteIcon5=(()=>{
  let ri=new ControlIcon();
  ri.curve.style.fillRule="evenodd";
  ri.curve.an.setAttribute("dur","100ms");
  ri.curve.an.setAttribute("onend","rouletteIcon5.repeat()");
  ri.repeat=()=>{
//if (!PUBLISH) console.log("ro cyc "+ri.rc);
    ri.cycle();
  }
  return ri;
})();

var rouletteIcon7=(()=>{
  let ri=new ControlIcon();
  ri.curve.style.fillRule="evenodd";
  ri.curve.an.setAttribute("dur","100ms");
  ri.curve.an.setAttribute("onend","rouletteIcon7.repeat()");
  ri.repeat=()=>{
//if (!PUBLISH) console.log("ro cyc "+ri.rc);
    ri.cycle();
  }
  return ri;
})();

grid.append((()=>{
  let icons=document.createElement("div");
  icons.style.display="grid";
  icons.style.gridTemplateColumns="auto";
  icons.style.gridTemplateRows="auto auto auto auto 1fr";
  icons.append(rouletteIcon4);
  icons.append(rouletteIcon3);
  icons.append(rouletteIcon5);
  icons.append(rouletteIcon7);
  icons.append(rouletteIcon);
  //icons.append(heartIcon);
  //icons.append(rosIcon);
  icons.append((()=>{
    let space=document.createElement("div");
    space.style.background="white";
    return space;
  })());
  return icons;
})());

var displayContainer=(()=>{
  let c=document.createElement("div");
  c.style.display="grid";
  c.style.gridTemplateColumns="auto auto auto auto auto";
  //c.style.gridTemplateRows="auto auto auto auto";
  //c.style.gridTemplateRows=ICONSIZE+"px auto auto auto";
  c.style.gridTemplateRows="1fr 1fr 1fr 1fr 1fr";
  c.style.background="white";
  c.style.padding="0 40px";

  c.setSize=()=>{
    c.style.gridTemplateRows=ICONSIZE+"px auto auto auto";
  }

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

/*
    as.style.marginTop=-ICONSIZE+"px";
    displayContainer.insertBefore(as,displayContainer.firstElementChild);
*/
    displayContainer.append(as);
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
  //ICONSIZE=Math.trunc((window.innerHeight-40)/32)*8;
  ICONSIZE=Math.trunc((window.innerHeight-40)/40)*8;
  document.querySelectorAll(".icon").forEach((i)=>{ 
    i.setSize(false);
  });
}

var RES300=0.02;
var RES420=Math.PI/210;
var RES100=Math.PI/50;
var RES80=Math.PI/40;
var RES60=Math.PI/30;
var RES40=Math.PI/20;
var RES30=Math.PI/15;  
var RES24=Math.PI/12;
var RES20=Math.PI/10;
var RES18=Math.PI/9;
var RES12=Math.PI/6;  // good for 3 vtx 
var RES10=Math.PI/5;
var RES8=Math.PI/4;
var RES6=Math.PI/3;
var RES4=Math.PI/2;
var RES2=Math.PI;
var RES=RES30;

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

var CCurve=function(t1,t2,t3,t4) {
  this.t1=t1;
  this.t2=t2;
  this.t3=t3;
  this.t4=t4;
  this.getX=(t)=>{ return this.t1.getValue(t)+this.t2.getValue(t); }
  this.getY=(t)=>{ return this.t3.getValue(t)+this.t4.getValue(t); }
}

var RouletteShape=function() {
  // sscc
  // f1==f3 f2==f4, m1=m3=1, m2=m4>4, all e=1
  let s=new Shape(
    new Term(new Calc(0,1,1),0.5),
    new Term(new Calc(0,7,1),0.5),
    new Term(new Calc(1,1,1),0.5),
    new Term(new Calc(1,7,1),0.5),
  );
  s.res=RES8;
  s.stdColor="hsl("+(getRandomInt(0,360)%360)+",80%,40%)";
  s.color=s.stdColor;
  s.dur=6;
  s.fillRule="evenodd";
  s.rp={
    "3a":[[1,19],[7,19],[1,13],[10,19],[7,16],[4,13],[1,10],[13,19],[7,13],[1,7],[16,19],[13,16],[10,13],[7,10],[4,7],[1,4]],
    "3b":[[8,17],[5,17],[11,20],[5,14],[2,11],[11,17],[5,11],[17,20],[14,17],[11,14],[8,11],[5,8],[2,5]],
    "4a":[[1,17],[9,17],[5,13],[1,9],[13,17],[9,13],[5,9],[1,5]],
    "4b":[[3,19],[11,19],[7,15],[3,11],[15,19],[7,11],[3,7]],
    "5a":[[1,16],[1,11],[11,16],[6,11],[1,6]],
    "5b":[[3,13],[13,18],[8,13],[3,8]],
    "5c":[[2,17],[7,17],[12,17],[7,12],[2,7]],
    "5d":[[9,19],[14,19],[9,14],[4,9]],
    "7a":[[1,15],[8,15],[1,8]],
    "7b":[[9,16],[2,9]],
    "7c":[[3,17],[10,17],[3,10]],
    "7d":[[11,18],[4,11]],
    "7e":[[5,19],[12,19],[5,12]],
    "7f":[[13,20],[6,13]],
    "11a":[[1,12]],
    "11b":[[2,13]],
    "11c":[[3,14]],
    "11d":[[4,15]],
    "11e":[[5,16]],
    "11f":[[6,17]],
    "11g":[[7,18]],
    "11h":[[8,19]],
    "11i":[[9,20]],
    "13a":[[1,14]],
    "13b":[[2,15]],
    "13c":[[3,16]],
    "13d":[[4,17]],
    "13e":[[5,18]],
    "13f":[[6,19]],
    "13g":[[7,20]],
    "17a":[[1,18]],
    "17b":[[2,19]],
    "17c":[[3,20]]
  };
  s.transit=()=>{

/*
s.t1.calc.exp=
s.t2.calc.exp=
s.t3.calc.exp=
s.t4.calc.exp=9; //[1,3,5][getRandomInt(0,2)]; // 1,3 for low res
*/

    let setkeys=Object.keys(s.rp);
    s.cset=setkeys[getRandomInt(0,setkeys.length)];

/*
s.cset="5d";
if (!setkeys.includes(s.cset)) return;
*/

    var sk=0;
    if (s.cset.startsWith("13")) {
      s.res=Math.PI/(13*getRandomInt(1,2,true));
    } else if (s.cset.startsWith("11")) {
      s.res=Math.PI/(11*getRandomInt(1,2,true));
    } else if (s.cset.startsWith("7")) {
      s.res=Math.PI/(7*getRandomInt(2,3));
    } else if (s.cset.startsWith("5")) {
      s.res=Math.PI/(5*getRandomInt(2,5,true));
    } else if (s.cset.startsWith("4")) {
      s.res=Math.PI/(4*getRandomInt(3,6,true));
    } else if (s.cset=="3a") {
      //let vc=2*3*getRandomInt(2,7,true);
      let vc=3*getRandomInt(5,16,true);
      if (vc==18) {
        sk=1;
      } else if (vc==12) {
        sk=3;
      } else if (vc==9) {
        sk=7;
      }
      s.res=2*Math.PI/vc;
    } else if (s.cset=="3b") {
      let vc=3*getRandomInt(5,16,true);
      if (vc==12) {
        sk=2;
      } else if (vc==9) {
        sk=5;
      }
      s.res=2*Math.PI/vc;
      //s.res=Math.PI/(3*getRandomInt(2,7,true));
      //s.res=Math.PI/(3*getRandomInt(2,7,true));
    } else if (s.cset.startsWith("17")) {
      s.res=Math.PI/(17*getRandomInt(1,2,true));
    } else if (s.cset.startsWith("19")) {
      s.res=Math.PI/(19*getRandomInt(1,2,true));
    } else {
if (!PUBLISH) debugger;
    }
    for (let i=0; i<3; i++) {  // 3 shape animation

	let pair=s.rp[s.cset][getRandomInt(sk,s.rp[s.cset].length,true)];
	//let pair=s.rp[s.cset][getRandomInt(0,s.rp[s.cset].length)];
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
	s.t1.factor=s.t1.factori*(1.2-0.6*Math.random())
*[-1,1][getRandomInt(0,2)]
;
	s.t3.factor=s.t1.factor;
	s.t2.factor=1-Math.abs(s.t1.factor);
	s.t4.factor=s.t2.factor;
	s.transitPaths();
if (!PUBLISH) {
s.mString3=s.mString2;
s.mString2=s.mString1;
//s.mString1=""+s.t1.calc.mult+s.t2.calc.mult+s.t3.calc.mult+s.t4.calc.mult;
s.mString1=""+s.t1.calc.mult+s.t2.calc.mult+s.t3.calc.mult+s.t4.calc.mult;
//s.mString1=""+s.t1.calc.exp+s.t2.calc.exp+s.t3.calc.exp+s.t4.calc.exp;
//s.mString1=s.cset;
//s.report=()=>{ return s.cset; }
}
    }
    s.color="hsl("+(getRandomInt(0,360)%360)+",80%,40%)";
  }

  s.report=()=>{ return Math.PI*2/s.res+" "+s.cset+" "+s.mString1+" "+s.mString2+","+s.mString3; }
  //s.report=()=>{ return s.cset+" "+s.mString1+","+s.mString2+","+s.mString3; }
  s.transit();
  return s;
}

var rouletteShape=(()=>{
  let s=new RouletteShape();
  s.rp={
    "11a":[[1,12]],
    "11b":[[2,13]],
    "11c":[[3,14]],
    "11d":[[4,15]],
    "11e":[[5,16]],
    "11f":[[6,17]],
    "11g":[[7,18]],
    "11h":[[8,19]],
    "11i":[[9,20]],
    "13a":[[1,14]],
    "13b":[[2,15]],
    "13c":[[3,16]],
    "13d":[[4,17]],
    "13e":[[5,18]],
    "13f":[[6,19]],
    "13g":[[7,20]],
    "17a":[[1,18]],
    "17b":[[2,19]],
    "17c":[[3,20]],
    "19" :[[1,20]]
  };
  return s;
})();
rouletteIcon.setIconShape(rouletteShape);
rouletteShape.transit();
rouletteShape.transit();
rouletteIcon.curve.setPath(rouletteShape.dString1);

var rouletteShape3=(()=>{
  let s=new RouletteShape();
  s.rp={
    "3a":[[1,19],[7,19],[1,13],[10,19],[7,16],[4,13],[1,10],[13,19],[7,13],[1,7],[16,19],[13,16],[10,13],[7,10],[4,7],[1,4]],
    "3b":[[8,17],[5,17],[11,20],[5,14],[2,11],[11,17],[5,11],[17,20],[14,17],[11,14],[8,11],[5,8],[2,5]],
  };
  return s;
})();
rouletteIcon3.setIconShape(rouletteShape3);
rouletteShape3.transit();
rouletteShape3.transit();
rouletteIcon3.curve.setPath(rouletteShape3.dString1);

var rouletteShape4=(()=>{
  let s=new RouletteShape();
  s.rp={
    "4a":[[1,17],[9,17],[5,13],[1,9],[13,17],[9,13],[5,9],[1,5]],
    "4b":[[3,19],[11,19],[7,15],[3,11],[15,19],[7,11],[3,7]],
  };
  return s;
})();
rouletteIcon4.setIconShape(rouletteShape4);
rouletteShape4.transit();
rouletteShape4.transit();
rouletteIcon4.curve.setPath(rouletteShape4.dString1);

var rouletteShape5=(()=>{
  let s=new RouletteShape();
  s.rp={
    "5a":[[1,16],[1,11],[11,16],[6,11],[1,6]],
    "5b":[[3,13],[13,18],[8,13],[3,8]],
    "5c":[[2,17],[7,17],[12,17],[7,12],[2,7]],
    "5d":[[9,19],[14,19],[9,14],[4,9]],
  };
  return s;
})();
rouletteIcon5.setIconShape(rouletteShape5);
rouletteShape5.transit();
rouletteShape5.transit();
rouletteIcon5.curve.setPath(rouletteShape5.dString1);

var rouletteShape7=(()=>{
  let s=new RouletteShape();
  s.rp={
    "7a":[[1,15],[8,15],[1,8]],
    "7b":[[9,16],[2,9]],
    "7c":[[3,17],[10,17],[3,10]],
    "7d":[[11,18],[4,11]],
    "7e":[[5,19],[12,19],[5,12]],
    "7f":[[13,20],[6,13]],
  };
  return s;
})();
rouletteIcon7.setIconShape(rouletteShape7);
rouletteShape7.transit();
rouletteShape7.transit();
rouletteIcon7.curve.setPath(rouletteShape7.dString1);

let icons=[rouletteIcon,rouletteIcon3,rouletteIcon4, rouletteIcon5, rouletteIcon7];
icons.forEach((i)=>{
  i.set2Value(); 
  i.curve.an.setAttribute("begin","0s"); // sharts animation
});

onresize();
