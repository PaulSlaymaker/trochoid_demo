"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);

var styleSheet=(()=>{
  let tag=document.createElement("style");
  tag.type="text/css";
  body.append(tag);
  let ss=document.styleSheets[document.styleSheets.length-1];
  ss.insertRule(".cicon { border:1px solid silver; background:white; }",0);
  ss.insertRule(".cicon:hover { border:1px solid blue; }",0);
  ss.insertRule(".dicon { border:1px solid transparent; }",0);
  ss.insertRule(".dicon:hover { border:1px dotted #DDD; }",0);
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
      ic.shape.resetSel();
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
      if (di.cIcon.shape.hueSel==undefined) {
        di.selectControl();

/*
var displays=document.querySelectorAll("[id^='phs']");
console.log(displays);
*/

        di.cIcon.shape.transit();
        displayCol.clear();      
        di.cIcon.curve.an.beginElement();
      } else {
        di.curve.an.beginElement();
      }
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
    let vals=c.dString1+" ; "
            +c.dString2+" ; "
            +c.dString3+" ; "
            +c.dString1;
            //+c.shape.dString2+" ; "
            //+c.shape.dString3+" ; "
            //+c.shape.dString1;
    c.curve.setValues(vals);
  }
  return c;
}

var Path=function() {
  let c=document.createElementNS("http://www.w3.org/2000/svg", "path");
  c.setAttribute("d","");
  c.style.fillRule="evenodd";
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

var Shape=function() {
  this.tx1=new Term(new Calc(0,1,1),0.5);
  this.tx2=new Term(new Calc(0,7,1),0.5);
  this.tx3=new Term(new Calc(0,1,1),0.3);
  this.ty1=new Term(new Calc(1,1,1),0.5);
  this.ty2=new Term(new Calc(1,7,1),0.5);
  this.ty3=new Term(new Calc(1,1,1),0.3);
  this.dString1="";
  this.dString2="";
  this.dString3="";
  this.mString1="";
  this.mString2="";
  this.mString3="";
//  this.fillRule="";
  this.res=RES30;
  this.getX=(t)=>{ 
    //return this.tx1.getValue(t)+this.tx2.getValue(t); 
//if (isNaN((this.tx1.getValue(t)+this.tx2.getValue(t)+this.tx3.getValue(t)))) debugger; 
    return this.tx1.getValue(t)+this.tx2.getValue(t)+this.tx3.getValue(t); 
  }
  this.getY=(t)=>{ 
//if (isNaN((this.ty1.getValue(t)+this.ty2.getValue(t)+this.ty3.getValue(t)))) debugger; 
    //return this.ty1.getValue(t)+this.ty2.getValue(t); 
    return this.ty1.getValue(t)+this.ty2.getValue(t)+this.ty3.getValue(t); 
  }
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

var RouletteShape=function() {
  // sscc
  // f1==f3 f2==f4, m1=m3=1, m2=m4>4, all e=1
  let s=new Shape();
  s.res=RES8;
  s.hue=getRandomInt(0,360)%360;
  s.dur=6;
  s.csetSel=undefined;
  s.hueSel=undefined;
  s.duoSel=undefined;
  s.fp2={
    "p":[
      [ 0,+1,+1, 0,+1,+1],
      [+1,+1,+1,+1,+1,+1],
      [ 0,-1,-1, 0,-1,-1],
      [-1,-1,-1,-1,-1,-1],
      [+1, 0,+1,+1, 0,+1],
      [+1,-1,+1,+1,-1,+1],
      [-1, 0,-1,-1, 0,-1],
      [-1,+1,-1,-1,+1,-1],
      [+1,+1, 0,+1,+1, 0],
      [+1,+1,-1,+1,+1,-1],
      [-1,-1, 0,-1,-1, 0],
      [-1,-1,+1,-1,-1,+1],
    ],
    "n":[
      [+1, 0,+1,-1, 0,-1],
      [+1,-1,+1,-1,+1,-1],
      [-1, 0,-1,+1, 0,+1],
      [-1,+1,-1,+1,-1,+1],
      [ 0,+1,+1, 0,-1,-1],
      [+1,+1,+1,-1,-1,-1],
      [ 0,-1,-1, 0,+1,+1],  // *
      [-1,-1,-1,+1,+1,+1],
      [+1,-1, 0,-1,+1, 0],
      [+1,-1,+1,-1,+1,-1],
      [-1,+1, 0,+1,-1, 0],
      [-1,+1,-1,+1,-1,+1],
    ]
  }
  s.fp={
    "p":[[+1,+1,+1,+1],[-1,-1,-1,-1],[+1,-1,+1,-1],[-1,+1,-1,+1]],
    "n":[[+1,+1,-1,-1],[-1,-1,+1,+1],[+1,-1,-1,+1],[-1,+1,+1,-1]]
  }
  s.fset=s.fp[["p","n"][getRandomInt(0,2)]];
  s.rp={}
  s.transit=()=>{
/*
s.t1.calc.exp=
s.t2.calc.exp=
s.t3.calc.exp=
s.t4.calc.exp=9; //[1,3,5][getRandomInt(0,2)]; // 1,3 for low res
*/
    let setkeys=Object.keys(s.rp);
    //s.cset=setkeys[getRandomInt(0,setkeys.length)];
/*
s.cset="5d";
if (!setkeys.includes(s.cset)) return;
*/
    if (typeof s.csetSel=="string") {
      s.cset=s.csetSel;
    } else {
      s.cset=setkeys[getRandomInt(0,setkeys.length)];
    }
    var sk=0;
    var sz=s.rp[s.cset].length;
    if (s.cset.startsWith("7")) {
      let vc=7*getRandomInt(3,9,true);
      if (vc<=28 && s.cset=="7a") {
        sk=2
      }
      if (vc==21 && RegExp("7[b-e]").test(s.cset)) {
        sk=1;
      }
      s.res=2*Math.PI/vc;
    } else if (s.cset==("5a")) {
      let vc=5*getRandomInt(3,13,true);
      if (vc==25) {
        sk=1;
      } else if (vc==20) {
        sk=2;
      } else if (vc==15) {
        sk=4;
      }
      s.res=2*Math.PI/vc;
    } else if (s.cset==("5b")) {
      let vc=5*getRandomInt(3,13,true);
      if (vc==25) {
        sk=1;
      } else if (vc==20) {
        sk=2;
      } else if (vc==15) {
        sk=4;
      }
      s.res=2*Math.PI/vc;
    } else if (s.cset==("5c")) {
      let vc=5*getRandomInt(3,13,true);
      if (vc==25) {
        sk=1;
      } else if (vc==20) {
        sk=2;
      } else if (vc==15) {
        sk=4;
      }
      s.res=2*Math.PI/vc;
    } else if (s.cset==("5d")) {
      let vc=5*getRandomInt(4,13,true);
      s.res=2*Math.PI/vc;
    } else if (s.cset=="4a") {
      if (s.duoSel || Math.random()<0.5) {
        let vc=8*getRandomInt(2,7,true);
        s.res=2*Math.PI/vc;
        s.duo=true;
        sz=6;
      } else {
        let vc=4*getRandomInt(4,16,true);
        s.res=2*Math.PI/vc;
        s.duo=false;
      }
    } else if (s.cset=="4b") {
      if (s.duoSel || Math.random()<0.5) {
        let vc=8*getRandomInt(2,7,true);
        s.res=2*Math.PI/vc;
        s.duo=true;
        sz=2;
      } else {
        let vc=4*getRandomInt(4,16,true);
        s.res=2*Math.PI/vc;
        s.duo=false;
      }
    } else if (s.cset=="3a") {
      if (s.duoSel || Math.random()<0.5) {
        let vc=6*getRandomInt(3,10,true);
        s.res=2*Math.PI/vc;
        s.duo=true;
        sz=10;
      } else {
        let vc=3*getRandomInt(5,20,true);
        s.res=2*Math.PI/vc;
        s.duo=false;
      }
    } else if (s.cset=="3b") {
      if (s.duoSel || Math.random()<0.5) {
        let vc=6*getRandomInt(3,10,true);
        s.res=2*Math.PI/vc;
        s.duo=true;
        sz=8;
      } else {
        let vc=3*getRandomInt(5,20,true);
        s.res=2*Math.PI/vc;
        s.duo=false;
      }
    } else if (s.cset=="11a") {
      s.res=Math.PI/(11*getRandomInt(1,3,true));
    } else if (s.cset.startsWith("11")) {
      let vc=11*getRandomInt(2,5,true);
      s.res=2*Math.PI/vc;
    } else if (s.cset.startsWith("13")) {
      s.res=Math.PI/(13*getRandomInt(1,2,true));
    } else if (s.cset.startsWith("17")) {
      s.res=Math.PI/(17*getRandomInt(1,2,true));
    } else if (s.cset.startsWith("19")) {
      s.res=Math.PI/(19*getRandomInt(1,2,true));
    } else {
if (!PUBLISH) debugger;
    }
if (s.cset.startsWith("3") || s.cset.startsWith("4"))  {
//if (false) {
    s.fset=s.fp2[["p","n"][getRandomInt(0,2)]];
} else {


if (Math.random()<0.5) {
    s.fset=s.fp[["p","n"][getRandomInt(0,2)]];
}



}
    s.rMult=[];
    for (let i=0; i<3; i++) {  // 3 shape animation
      if (s.cset.startsWith("3") || s.cset.startsWith("4"))  {
      //if (false) {
	var sp=getRandomInt(0,sz,true);
	s.rMult.push(sp);
	let trip=s.rp[s.cset][sp];
	//let trip=s.rp[s.cset][getRandomInt(0,s.rp[s.cset].length)];
	s.tx1.calc.mult=trip[0];
	s.ty1.calc.mult=trip[0];
	s.tx2.calc.mult=trip[1];
	s.ty2.calc.mult=trip[1];
	s.tx3.calc.mult=trip[2];
	s.ty3.calc.mult=trip[2];
	s.tx1.factor=s.tx1.factori*(1.2-0.6*Math.random());
	s.ty1.factor=s.tx1.factor;
	s.tx2.factor=s.tx2.factori*(1.2-0.6*Math.random());
	s.ty2.factor=s.tx2.factor;
	s.tx3.factor=1-Math.abs(s.tx1.factor+s.tx2.factor);
	s.ty3.factor=s.tx3.factor;
	let ff=s.fset[getRandomInt(0,12)];
	s.tx1.factor*=ff[0];
	s.tx2.factor*=ff[1];
	s.tx3.factor*=ff[2];
	s.ty1.factor*=ff[3];
	s.ty2.factor*=ff[4];
	s.ty3.factor*=ff[5];
      } else {
	var sp=getRandomInt(sk,s.rp[s.cset].length,true)
	s.rMult.push(sp);
	let pair=s.rp[s.cset][sp];
	//let pair=s.rp[s.cset][getRandomInt(0,s.rp[s.cset].length)];
	if (Math.random()<0.5) {
	  s.tx1.calc.mult=pair[0];
	  s.ty1.calc.mult=pair[0];
	  s.tx2.calc.mult=pair[1];
	  s.ty2.calc.mult=pair[1];
	} else {
	  s.tx1.calc.mult=pair[1];
	  s.ty1.calc.mult=pair[1];
	  s.tx2.calc.mult=pair[0];
	  s.ty2.calc.mult=pair[0];
	}
	s.tx1.factor=s.tx1.factori*(1.2-0.6*Math.random());
	s.ty1.factor=s.tx1.factor;
	s.tx2.factor=1-Math.abs(s.tx1.factor);
	s.ty2.factor=s.tx2.factor;
	let ff=s.fset[getRandomInt(0,4)];
	s.tx1.factor*=ff[0];
	s.tx2.factor*=ff[1];
	s.ty1.factor*=ff[2];
	s.ty2.factor*=ff[3];
      }

/*
      s.t1.factor=s.t1.factori*(1.2-0.6*Math.random())
*[-1,1][getRandomInt(0,2)]
;
      s.t3.factor=s.t1.factor;
      s.t2.factor=1-Math.abs(s.t1.factor);
      s.t4.factor=s.t2.factor;
*/

//s.shapes.push([new Term(new Calc(),s.t1.factor),new Term()]);
      s.transitPaths();
if (!PUBLISH) {
s.mString3=s.mString2;
s.mString2=s.mString1;
//s.mString1=""+s.t1.calc.mult+s.t2.calc.mult+s.t3.calc.mult+s.t4.calc.mult;
if (s.cset.startsWith("3") || s.cset.startsWith("4"))  {
  s.mString1=""+s.tx1.calc.mult+s.tx2.calc.mult+s.tx3.calc.mult+s.ty1.calc.mult+s.ty2.calc.mult+s.ty3.calc.mult;
} else {
  s.mString1=""+s.tx1.calc.mult+s.tx2.calc.mult+s.ty1.calc.mult+s.ty2.calc.mult;
}
//s.mString1=""+s.t1.calc.exp+s.t2.calc.exp+s.t3.calc.exp+s.t4.calc.exp;
}
    }
    if (Number.isInteger(s.hueSel)) {
      //s.hue=getRandomInt(s.hueSel+270,180)%360;
      s.hue=(getRandomInt(0,180)+s.hueSel+270)%360;
    } else {
      s.hue=getRandomInt(0,360)%360;
    }
  }
  s.resetSel=()=>{
    s.csetSel=undefined;
    s.hueSel=undefined;
    s.duoSel=false;
  }
  s.report=()=>{ 
    //return (Math.PI*2/s.res).toFixed(0)+" "+s.cset+" "+s.mString1+" "+s.mString2+" "+s.mString3; 
    return (Math.PI*2/s.res).toFixed(0)+" "+s.cset+" "+s.rMult+" "+s.duo;
  }
  return s;
}

grid.append("\u00A0");

var srep=(s)=>{
  let sr=document.createElement("span");
  sr.classList.add("srep");
  sr.style.position="absolute";
  sr.style.top="0";
  sr.style.left="0";
  sr.style.fontSize="10px";
  sr.style.color="#777";
  sr.style.display="none";
  sr.append(s);
  return sr;
}

var DisplayIcon=function(cIcon) {
  let di=new Icon(new Path());
  di.cIcon=cIcon;
  di.id="phs"+new Date().getTime();
  if (cIcon.shape.hueSel==undefined) {
    di.classList.add("dicon");
  } else {
    di.style.border="1px solid transparent";
  }
  di.style.position="relative"; // for report child
  di.curve.style.fill="hsl("+cIcon.shape.hue+",80%,40%)";
  di.curve.style.stroke=di.curve.style.fill;
  di.curve.an.setAttribute("fill","freeze");
  di.curve.an.setAttribute("repeatCount", "3");
  di.curve.an.setAttribute("dur", (cIcon.shape.dur*(1+0.2*Math.random())).toFixed(1));
  di.dString1=cIcon.shape.dString1;
  di.dString2=cIcon.shape.dString2;
  di.dString3=cIcon.shape.dString3;
  di.cset=cIcon.shape.cset;
  di.hue=cIcon.shape.hue;
  di.duo=cIcon.shape.duo;
  di.rMult=cIcon.shape.rMult;
  //di.curve.an.setAttribute("onend", "DisplayIcon.prototype.rmv("+di.id+")");
  di.curve.an.setAttribute("onend", "DisplayIcon.prototype.setS("+di.id+")");
  di.set4Value();
  di.curve.an.setAttribute("begin","0s");
  di.onmouseover=()=>{
    di.curve.an.beginElement();
  }
if (!PUBLISH) {
  di.append(srep(cIcon.shape.report()));
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
  di.selectControl=()=>{
    cIcon.shape.csetSel=di.cset;
    cIcon.shape.hueSel=di.hue;
    cIcon.shape.duoSel=di.duo;
  }
  return di;
}

DisplayIcon.prototype.rmv=function(wd) {
  requestAnimationFrame(wd.animateOut);
}

DisplayIcon.prototype.setS=function(wd) {
//  wd.curve.an.setAttribute("dur","600ms");
  wd.curve.an.setAttribute("repeatCount", "1");
}

var ControlIcon=function(shpe) {
  let ci=new Icon(new Path());
  ci.classList.add("cicon");
  ci.curve.style.fill="hsl("+getRandomInt(0,360)%360+",80%,40%)";
  ci.curve.style.stroke=ci.curve.style.fill;
  ci.curve.an.setAttribute("fill","freeze");
  ci.curve.an.setAttribute("repeatCount","1");
  ci.curve.an.setAttribute("keySplines","0.2 0 0.8 1");
  ci.shape=shpe;
  ci.rc=0;
  ci.cycle=()=>{
    if (ci.rc++>DCOUNT-1) {
      ci.rc=0;
      return;
    }
    if (displayCol.count()<DCOUNT) {
      displayCol.add(new DisplayIcon(ci));
/*
if (ci.shape.hueSel==undefined) {
      displayCol.add(new DisplayIcon(ci));
} else {
      displayCol.replace(new DisplayIcon(ci));
}
*/
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
    ci.shape.getSVGPath();
    ci.curve.setPath(ci.shape.dString1);
  }
  return ci;
}

var rouletteIcon=(()=>{
  let ri=new ControlIcon();
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
  ri.curve.an.setAttribute("dur","100ms");
  ri.curve.an.setAttribute("onend","rouletteIcon5.repeat()");
  ri.repeat=()=>{
//if (!PUBLISH) console.log("ro cyc "+ri.rc);
    ri.cycle();
  }
  return ri;
})();

var rouletteIcon7=(()=>{
  let ri=new ControlIcon(rouletteShape7);
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
  ids:[],
  add:(as)=>{
//    as.id="phs"+new Date().getTime();
//    let an=as.getElementsByTagName("animate")[0];
//    an.setAttribute("onend","displayCol.remove('"+as.id+"')");

/*
    as.style.marginTop=-ICONSIZE+"px";
    displayContainer.insertBefore(as,displayContainer.firstElementChild);
*/
    displayContainer.append(as);
    displayCol.ids.push(as.id);
    //requestAnimationFrame(displayCol.animate);
    requestAnimationFrame(as.animateIn);
    return true;
  },
  replace:(dispIcon)=>{ 
    let dcid=displayCol.ids.pop();
    if (dcid==undefined) return false;
    displayContainer.replaceChild(displayIcon, document.getElementById(dcid));
  },
  remove:(id)=>{ document.getElementById(id).remove(); },
  clear:()=>{ 
    displayCol.ids=[];
    document.querySelectorAll("[id^='phs']").forEach((d)=>{ d.remove(); });
  },
  astart:0,
}

if (!PUBLISH) {
grid.append(
  (()=>{
    let g=document.createElement("button");
    g.on=false;
    g.onclick=()=>{
      document.querySelectorAll(".srep").forEach((d)=>{ 
        if (g.on) {
          d.style.display="none";
        } else {
          d.style.display="inline";
        }
      });
      g.on=!g.on;
    }
    return g;
  })()
);
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

/*
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
*/

/*
var CCurve=function(t1,t2,t3,t4) {
  this.t1=t1;
  this.t2=t2;
  this.t3=t3;
  this.t4=t4;
  this.getX=(t)=>{ return this.t1.getValue(t)+this.t2.getValue(t); }
  this.getY=(t)=>{ return this.t3.getValue(t)+this.t4.getValue(t); }
}
*/

var rouletteShape=(()=>{
  let s=new RouletteShape();
s.tx3.factori=s.tx3.factor=0;
s.ty3.factori=s.ty3.factor=0;
  s.rp={
    "11a":[[12,23],[1,23],[1,12]],
    "11b":[[2,13],[13,24]],
    "11c":[[3,25],[14,25],[3,14]],
    "11d":[[4,15],[15,26]],
    "11e":[[5,16],[5,27],[16,27]],
    "11f":[[6,17],[17,28]],
    "11g":[[7,18],[7,29],[18,29]],
    "11h":[[8,19]],
    "11i":[[9,20]],
    "11j":[[10,21]],
    "13a":[[1,14],[1,27],[14,27]],
    "13b":[[2,15],[15,28]],
    "13c":[[3,16],[3,29],[16,29]],
    "13d":[[4,17]],
    "13e":[[5,18]],
    "13f":[[6,19]],
    "13g":[[7,20]],
    "13h":[[8,21]],
    "13i":[[9,22]],
    "13j":[[10,23]],
    "13k":[[11,24]],
    "13l":[[12,25]],
    "17a":[[1,18]],
    "17b":[[2,19]],
    "17c":[[3,20]],
    "17d":[[4,21]],
    "17e":[[5,22]],
    "17f":[[6,23]],
    "19a":[[1,20]],
    "19b":[[2,21]],
    "19c":[[3,22]],
    "19d":[[4,23]]
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
    "3a":[[1,7,13],[1,7,19],[1,7,25],[1,13,19],[1,13,25],[1,19,25],[7,13,19],[7,13,25],[7,19,25],[13,19,25],[1,4,7],[1,4,13],[1,4,19],[1,4,25],[1,7,10],[1,7,16],[1,7,22],[1,10,13],[1,10,19],[1,13,16],[1,13,22],[1,16,19],[1,16,25],[1,19,22],[1,19,28],[1,22,25],[1,25,28],[4,7,13],[4,7,19],[4,7,25],[4,13,19],[4,13,25],[4,19,25],[7,10,13],[7,10,19],[7,13,16],[7,13,22],[7,16,19],[7,16,25],[7,19,22],[10,13,19],[13,16,19],[13,16,25],[13,19,22],[13,19,28],[13,25,28],[16,19,25],[19,22,25],[19,25,28]],
    "3b":[[5,11,17],[5,11,23],[5,11,29],[5,17,23],[5,17,29],[11,17,23],[11,17,29],[17,23,29],[2,5,11],[2,5,17],[2,5,23],[2,5,29],[2,11,17],[2,11,23],[2,11,29],[2,17,23],[2,17,29],[5,8,11],[5,8,17],[5,8,23],[5,8,29],[5,11,14],[5,11,26],[5,14,17],[5,14,23],[5,14,29],[5,17,26],[8,11,17],[8,11,23],[8,11,29],[8,17,23],[8,17,29],[11,14,17],[11,14,29],[11,17,20],[11,17,26],[11,20,23],[11,20,29],[14,17,23],[14,17,29],[17,20,23],[17,20,29],[17,23,26],[17,26,29],[20,23,29]],
  }
  s.duo=false;
  s.duoIdx={ "3a":10, "3b":4 }
  return s;
})();
rouletteIcon3.setIconShape(rouletteShape3);
rouletteShape3.transit();
rouletteShape3.transit();
rouletteIcon3.curve.setPath(rouletteShape3.dString1);

var rouletteShape4=(()=>{
  let s=new RouletteShape();
  s.rp={
    "4a":[[1,9,17],[1,9,25],[1,17,25],[5,13,21],[5,13,29],[9,17,25],[1,5,9],[1,5,13],[1,5,17],[1,5,21],[1,5,29],[1,9,13],[1,9,29],[1,13,17],[1,13,21],[1,13,25],[1,13,29],[1,17,21],[1,17,29],[1,21,25],[1,21,29],[5,9,13],[5,9,17],[5,9,29],[5,13,17],[5,17,21],[5,17,29],[9,13,17],[9,13,25],[9,13,29],[9,17,29],[13,17,21],[13,17,25],[13,17,29],[17,21,25],[17,21,29],[21,25,29]],
    "4b":[[3,11,19],[7,15,23],[3,7,11],[3,7,19],[3,7,23],[3,11,23],[3,19,23],[7,11,15],[7,11,19],[7,11,23],[7,15,19],[7,15,27],[7,19,23],[7,19,27],[11,15,19],[11,15,23],[15,19,23]],
  };
  return s;
})();
rouletteIcon4.setIconShape(rouletteShape4);
rouletteShape4.transit();
rouletteShape4.transit();
rouletteIcon4.curve.setPath(rouletteShape4.dString1);

var rouletteShape5=(()=>{
  let s=new RouletteShape();
s.tx3.factori=s.tx3.factor=0;
s.ty3.factori=s.ty3.factor=0;
  s.rp={
    "5a":[[1,26],[1,21],[1,16],[11,26],[11,21],[1,11],[16,21],[11,16],[6,11],[1,6]],
    "5b":[[2,27],[7,27],[7,22],[2,17],[17,27],[7,17],[22,27],[12,17],[7,12],[2,7]],
    "5c":[[3,28],[3,23],[13,28],[8,23],[13,23],[3,13],[23,28],[18,23],[13,18],[8,13],[3,8]],
    "5d":[[9,19],[19,24],[14,19],[9,14],[4,9]],
  };
  return s;
})();
rouletteIcon5.setIconShape(rouletteShape5);
rouletteShape5.transit();
rouletteShape5.transit();
rouletteIcon5.curve.setPath(rouletteShape5.dString1);

var rouletteShape7=(()=>{
  let s=new RouletteShape();
s.tx3.factori=s.tx3.factor=0;
s.ty3.factori=s.ty3.factor=0;
  s.rp={
    "7a":[[1,29],[1,22],[15,29],[1,15],[22,29],[15,22],[8,15],[1,8]],
    "7b":[[2,23],[9,23],[16,23],[9,16],[2,9]],
    "7c":[[3,17],[17,24],[10,17],[3,10]],
    "7d":[[4,25],[11,25],[18,25],[11,18],[4,11]],
    "7e":[[5,26],[5,19],[19,26],[12,19],[5,12]],
    "7f":[[13,20],[13,27],[6,13]],
  };
  return s;
})();
rouletteIcon7.setIconShape(rouletteShape7);
rouletteShape7.transit();
rouletteShape7.transit();
rouletteIcon7.curve.setPath(rouletteShape7.dString1);

let icons=[rouletteIcon3,rouletteIcon4,rouletteIcon5,rouletteIcon7];
icons.forEach((i)=>{
  i.set2Value(); 
  i.curve.an.setAttribute("begin","0s"); // sharts animation
});

onresize();
