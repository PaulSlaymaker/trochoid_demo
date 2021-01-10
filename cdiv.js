"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
const EM=location.href.endsWith("em");

const TP=2*Math.PI;

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const PT=function(x,y) {
  this.x=x;
  this.y=y;
}

const W=12;
const W2=144;
const C=12;  // 1.3
//const W=5;
//const C=8;  // 1.3

var width=window.innerWidth/C;
var height=window.innerHeight/W;
var X0=window.innerWidth/2;
var Y0=window.innerHeight/2;
var D=100;
onresize=()=>{ 
  D=Math.min(window.innerWidth,window.innerHeight)/2/W; 
  width=window.innerWidth/C;
  height=window.innerHeight/W;
  X0=window.innerWidth/2;
  Y0=window.innerHeight/2;
}

const randomColor=()=>{  // Div fct?
  return "hsl("+getRandomInt(0,360)+","
               +(70+20*Math.random())+"%,"
               +(50+20*Math.random())+"%)";
}

var hues=[]
var setColors=()=>{
  hues=[];
  for (let i=0; i<W; i++) hues.push(randomColor());
}
setColors();

const cFrac=(frac)=>{
  let f1=.1;
  let f2=.9;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var Div=function(pt1,pt2,pt3,pt4,w) {
  this.time=0;
  this.pt1=pt1;
  this.pt2=pt2;
  this.pt3=pt3;
  this.pt4=pt4;
  this.w=w;
  this.el=document.createElement("div");
  this.el.style.background=hues[w];
  body.append(this.el);
  this.set=()=>{
    let minx=Infinity;
    let maxx=-Infinity;
    let miny=Infinity;
    let maxy=-Infinity;
    for (let i=0,p=[this.pt1,this.pt2,this.pt3,this.pt4]; i<4; i++) {
      if (minx>p[i].x) minx=p[i].x;
      if (maxx<p[i].x) maxx=p[i].x;
      if (miny>p[i].y) miny=p[i].y;
      if (maxy<p[i].y) maxy=p[i].y;
    }
    let diffx=maxx-minx;
    let diffy=maxy-miny;
    this.el.style.top=Y0+D*miny+"px";
    this.el.style.left=X0+D*minx+"px";
    this.el.style.width=D*(diffx)+"px";
    this.el.style.height=D*(diffy)+"px";
this.el.style.opacity=1-(Math.pow(this.pt1.x,2)+Math.pow(this.pt1.y,2))/W2;
    let poly="polygon("
      poly+=100*((this.pt1.x-minx)/diffx)+"% "+100*((this.pt1.y-miny)/diffy)+"%,"
           +100*((this.pt2.x-minx)/diffx)+"% "+100*((this.pt2.y-miny)/diffy)+"%,"
           +100*((this.pt3.x-minx)/diffx)+"% "+100*((this.pt3.y-miny)/diffy)+"%,"
           +100*((this.pt4.x-minx)/diffx)+"% "+100*((this.pt4.y-miny)/diffy)+"%)"
    this.el.style.clipPath=poly;
//  this.el.style.clipPath="circle("+(16+w/W*20)+"%)";
  }
/*
  this.setPTs=()=>{
    for (let i=0,p=[this.pt1,pt2,pt3,pt4]; i<4; i++) {
      body.append((()=>{
	let sp=document.createElement("span");
	sp.style.position="fixed";
	sp.style.color="white";
	sp.style.fontSize="16px";
	sp.style.top=Y0+D*p[i].y+"px";
	sp.style.left=X0+D*p[i].x+"px";
	sp.style.margin="0";
        sp.textContent="pt"+(i+1);
	return sp;
      })());
    }
  }
*/
  this.setBackground=()=>{ this.el.style.background=hues[this.w]; }
}

//var getCurveX=()=>{}

var pts=[[],[]];
var points;
(()=>{
  //let sk=[TP/C/4,-TP/C/4];
  //let sk=[0,-TP/C/2];
  const sk=[TP/C/2,0];
  points=[];
  pts[0]=[];
  pts[1]=[];
  for (let w=0; w<=W; w++) {
    let o=0.5+0.5*Math.random(); 
    points[w]=[];
    pts[0][w]=[];
    pts[1][w]=[];
    for (let c=0; c<=C; c++) {
      let z=c*TP/C+sk[w%2];
      let x=(w*o)*Math.cos(z);
      let y=(w*o)*Math.sin(z);
      points[w].push(new PT(0,0));
      pts[0][w].push(new PT(0,0));
      pts[1][w].push(new PT(x,y));
    }
  }
})();

const divs=[];
for (let w=0; w<W-1; w++) {
  for (let c=0; c<C; c++) {
    if (w%2==0) {
      divs.push(new Div(points[w][c],points[w+1][c+1],points[w+2][c],points[w+1][c],w));
    } else {
      divs.push(new Div(points[w][c],points[w+1][c],points[w+2][c],points[w+1][(C+c-1)%C],w));
    }
  }
}

var setPoints=()=>{
  let f=cFrac(frac);
  let ps2=(pointSet+1)%2;
  for (let w=0; w<=W; w++) {
    for (let c=0; c<=C; c++) {
      points[w][c].x=(1-f)*pts[pointSet][w][c].x+f*pts[ps2][w][c].x;
      points[w][c].y=(1-f)*pts[pointSet][w][c].y+f*pts[ps2][w][c].y;
    }
  }
}

var ct=0;
var wt=0;
var pointSet=0;
var transit=()=>{
  let ps2=(pointSet+1)%2;
  for (let w=0; w<=W; w++) {
    for (let c=0; c<=C; c++) {
      pts[pointSet][w][c].x=pts[ps2][w][c].x;
      pts[pointSet][w][c].y=pts[ps2][w][c].y;
    }
  }
  pointSet=(pointSet+1)%2;
  ps2=(pointSet+1)%2;
  const sk=[TP/C/2,0];
  wt+=2;
  if (Math.random()<0.1) ct+=1-2*Math.random();
  for (let w=0; w<=W; w++) {
    let o=[1,0.2+0.8*Math.random()][getRandomInt(0,2)]; 
    let wz=(w+wt)%(W+1);
    for (let c=0; c<=C; c++) {
      let z=(c+ct)*TP/C+sk[w%2];
      if (cShift==1) {
	pts[ps2][w][c].x=4*Math.cos(z);
	pts[ps2][w][c].y=4*Math.sin(z);
      } else {
	pts[ps2][w][c].x=(wz*o)*Math.cos(z);
	pts[ps2][w][c].y=(wz*o)*Math.sin(z);
      }
    }
  }
  if (cShift==1) cShift++;
  else if (cShift==2) {
    cShift=0;
    setColors();
    for (let i=0; i<divs.length; i++) { divs[i].setBackground(); }
  }
}

var draw=()=>{ for (let i=0; i<divs.length; i++) { divs[i].set(); } }

var stopped=true;
var frac=0;
var time=0;
var duration=2400;
var cShift=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  let progress=ts-time;
  if (progress<duration) {
    frac=progress/duration;
  } else {
    if (Math.random()<0.05) cShift=1;
    transit();
    frac=0;
    time=0;
  }
  setPoints();
  draw();
  requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    stopped=false;
    if (frac>0) time=performance.now()-frac*duration;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

onresize();

setPoints();
//draw();
start();
