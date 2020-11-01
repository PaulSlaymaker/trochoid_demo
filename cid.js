"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");

const TP=2*Math.PI;

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const W=10;
const C=13;  // 1.3

var width=window.innerWidth/C;
var height=window.innerHeight/W;
onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
//  ctx.canvas.style.width=D+"px";
//  ctx.canvas.style.height=D+"px";
}

const randomColor=()=>{  // Div fct?
  return "hsl("+getRandomInt(0,360)+","
               +(50+20*Math.random())+"%,"
               +(50+20*Math.random())+"%)";
}
const hues=[randomColor(),randomColor()];

const cFrac=(frac)=>{
  let f1=.1;
  let f2=.9;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var Div=function(w,c) {
  this.time=0;
  this.w1=w;
  this.c1=c;
  this.w2=w;
  this.c2=c+1;
  this.el=document.createElement("div");
  this.el.style.position="absolute"; // to css?
  this.el.style.width=width+"px";	// to onresize?
  this.el.style.height=height+"px";
  //this.el.style.background=randomColor();
  this.el.style.background=hues[w%2];
//  this.el.style.clipPath="circle()";
  //this.el.style.clipPath="inset(0% 1% 1% 98%)";
  this.el.style.clipPath="inset(1%)";
  body.append(this.el);
  this.frac=0;
  this.seek=()=>{
    let fc=()=>{
      let cs=[[-1,1],[1,-1]][getRandomInt(0,2)];
      for (let i=0; i<2; i++) {
        let nc=this.c1+cs[i];
        if (nc<0 || nc>C-1) continue;
        if (points[this.w1][nc]!=undefined) continue;
        this.c2=nc; 
        this.w2=this.w1;
        return true;
      }
      return false;
    }
    let fw=()=>{
      let ws=[[-1,1],[1,-1]][getRandomInt(0,2)];
      for (let i=0; i<2; i++) {
        let nw=this.w1+ws[i];
	if (nw<0 || nw>W-1) continue;
        if (points[nw][this.c1]!=undefined) continue;
	this.w2=nw;
	this.c2=this.c1;
	return true;
      }
      return false; 
    }
    if (Math.random()<0.5) {
      return fc() || fw();
    } else {
      return fw() || fc();
    }
  }
  
  this.transit=(t)=>{
    if (this.time>0 || Math.random()<0.05) {
      if (this.time==0) {
        if (this.seek()) {
          points[this.w2][this.c2]=this;
          this.time=t;
        } else return;
      }
      let progress=t-this.time;
      if (progress<100) {
	this.frac=cFrac(progress/100);
      } else {
        points[this.w1][this.c1]=undefined;
        this.w1=this.w2;
        this.c1=this.c2;
        points[this.w1][this.c1]=this;
        this.frac=0;
        this.time=0;
      }
    }
    this.set();
  }
  //this.transit=()=>{ }
  this.set=()=>{
    this.el.style.top=((1-this.frac)*this.w1+this.frac*this.w2)*height+"px";
    this.el.style.left=((1-this.frac)*this.c1+this.frac*this.c2)*width+"px";
//    co.style.width=width+"px";
//    co.style.height=height+"px";
  }
  this.set();
}

const divs=[];
const points=[];

(()=>{
  for (let w=0,i=0; w<W; w++) {
    let col=[];
    for (let c=0; c<C; c++,i++) {
/*
if (i%11==0) {
      let co=new Div(w,c);
      divs.push(co);
      col.push(co);
} else {
      col.push(undefined);
}
*/
    }
      col.push(undefined);
    points.push(col);
  }
})();

var createDiv=()=>{
  let w=getRandomInt(0,W);
  if (points[w][0]==undefined) {
    let co=new Div(w,0);
    divs.push(co);
    points[w][0]=co;
if (divs.length==W*C) stopped=true;
  }
}

var createDiv2=()=>{
  let w=getRandomInt(0,W);
  let c=getRandomInt(0,C);
  if (points[w][c]==undefined) {
//console.log("create");
    let co=new Div(w,c);
    divs.push(co);
    points[w][c]=co;
if (divs.length==W*C) stopped=true;
  }
}

var stopped=true;
var animate=(ts)=>{
  if (stopped) return;
//if (Math.random()<0.03) {
  createDiv();
//}
  for (let i=0; i<divs.length; i++) { divs[i].transit(ts); }
  requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    stopped=false;
/*
    if (pFrac>0) pTime=performance.now()-pFrac*duration;
    else if (cFrac1>0) cTime=performance.now()-cFrac1*duration;
    else if (cFrac2>0) cTime=performance.now()-cFrac2*duration;
*/
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

start();
