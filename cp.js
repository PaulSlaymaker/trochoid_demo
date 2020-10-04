"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
const TP=Math.PI*2;
const DCOUNT=49; // 7*7
const SCOUNT=63; // (7+SPACE)*7
const CWORD=9;  // 7+SPACE
const SPACE=2;

var XD=0;
var YD=0;
onresize=function() {
  XD=window.innerWidth/2;
  YD=window.innerHeight/2; 
  divs.forEach((d)=>{ 
    d.div.style.left=XD+"px"; 
    d.div.style.top=YD+"px"; 
    d.div.style.width=XD/20+"px"; 
    d.div.style.height=XD/20+"px"; 
  });


}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const colors=(()=>{
  let c=[];
  for (let i=0; i<7; i++) c[i]=getRandomInt(0,360);
  return c;
})();

const getSE=(n)=>{
  let el=document.createElementNS("http://www.w3.org/2000/svg", "svg");
  el.setAttribute("viewBox","0 0 100 100");
//  el.setAttribute("stroke","hsl("+colors[n]+",70%,70%)");
  el.setAttribute("fill","none");
  el.setAttribute("stroke-width","12.8");
  el.setAttribute("stroke-linecap","round");
  el.setAttribute("stroke-linejoin","round");
  let p=document.createElementNS("http://www.w3.org/2000/svg", "path");
  let c=[
    "M75 30c-5.2-5.2-12-8-20-8c-20 0-28 12-28 28s12 28 28 28c8 0 14.8-3.2 20-8",
    "M6 65l44 29.2l44-29.3v-29.6l-44-29.2l-44 29.2v29.6z M94 65l-44 -29.6l-44 29.6 M6 35.3l44 29.2 l44-29.2 M50 7v29.2 M50 65v29.2",
    "M75 50c0 16-12 28-28 28h-20V22h20  c0 0 28 0 28 28z",
    "M68 22h-36v56h36M56 50h-24",
    "M32 53h24c8.8 0 15-7.2 16-16s-7.2-16-16-16h-24v56 ",
    "M68 22h-36v56h36M56 50h-24",
    "M29 76 V20 l44 56V20"
  ];
  p.setAttribute("d",c[n]);
  el.append(p);
  return el;
}

const divs=(()=>{
  let d=[];
  for (let i=0; i<DCOUNT; i++) {
    let co=document.createElement("div");
//    co.style.width="32px";
//    co.style.height="32px";
    let svg=getSE(i%7);
    co.append(svg);
//    co.style.top="400px";  // fix with onresize
//    co.style.left="600px";
    body.append(co);
    d.push({"div":co,"svg":svg});
  }
  return d;
})();

var Curve=function() {
  this.sf=1;
  this.m=[];
  this.f=[];
  this.c=1;
  this.randomize=(init)=>{
    //this.sf=[1,1+0.4*Math.random(),2][getRandomInt(0,2)];
    //this.sf=[1,1.5,2][getRandomInt(0,2,true)];
    //this.sf=1.1-0.2*Math.random();
    this.m=[];
    this.c=getRandomInt(1,10);
    for (let i=0; i<this.c; i++) {
      this.f[i]=[-1,1][getRandomInt(0,2)];
      this.m[i]=[-6,-5,-4,-3,-2,-1,1,2,3,4,5,6][getRandomInt(0,12)];
    }
  }
  this.getX=(t)=>{ return Math.sin(this.sf*t); }
  this.getY=(t)=>{ 
    let v=0;
    for (let i=0; i<this.c; i++) v+=this.f[i]*Math.cos(this.m[i]*t);
    return v/this.c;
  }
  this.getZ=(t)=>{ return Math.cos(this.sf*t); }
}
var curve=[new Curve(),new Curve()];

var points=[[],[]];
const setPoints=()=>{
  let pointSet=ps%2;
  points[pointSet]=[];
  let inc=TP/SCOUNT;
  let j=(ps+1)%2;
  let k=ps%2;
  for (let i=0, d=0; i<SCOUNT; i++) {
    if (i%CWORD<7) {
      let m=t+i*inc;
      let x=(1-frac)*curve[j].getX(m)+frac*curve[k].getX(m);
      let y=(1-frac)*curve[j].getY(m)+frac*curve[k].getY(m);
      let z=(1-frac)*curve[j].getZ(m)+frac*curve[k].getZ(m);
      points[pointSet][i]={"x":x,"y":y,"z":z};
    } else i+=SPACE-1;
  }
}

const setDivs=()=>{
  let pointSet=ps%2;
  let inc=TP/SCOUNT;
  for (let i=0, d=0; i<SCOUNT; i++) {
    if (i%CWORD<7) {
      //let ty=120*points[pointSet][i].y;
      //let tx=360*points[pointSet][i].x;
      let ty=YD/4*points[pointSet][i].y;
      let tx=XD/2*points[pointSet][i].x;
      let tz=(XD+YD)/8*points[pointSet][i].z;
      let translate="translate3d("+tx+"px,"+ty+"px,"+tz+"px)";
      divs[d].div.style.zIndex=Math.floor(500*points[pointSet][i].z);
      //let zt=1+0.5*points[pointSet][i].z;
      //let scale="scale("+zt+","+zt+")";
      //let r=Math.PI/2-TP*points[pointSet][i].z/16;
      //let r=(TP*points[pointSet][i].x/4);
      //let r=(TP*Math.pow(points[pointSet][i].x,2)/30);
      //let r=i*inc+(t%TP)
      //let rotate="rotateY("+r+"rad)";
      //divs[d].svg.style.transform=rotate;
      //let rotateZ="rotateZ("+zt+"rad)";
      //divs[d].div.style.transform=rotate+" "+translate;
      //divs[i].firstElementChild.style.transform=rotate;
      divs[d].div.style.transform=translate;
      let dark=70*(0.33+(points[pointSet][i].z+1)/3);
      divs[d].svg.firstElementChild.setAttribute("stroke","hsl("+colors[d%7]+",70%,"+dark+"%)");
      d++;
    } else {
      i+=SPACE-1;
    }
  }
}

var ps=1;
var t=0;
var time=0;
var stopped=true;
var frac=0;
var duration=10000;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) { time=ts; }
  let progress=ts-time;
  if (progress<duration) {
    frac=progress/duration;
  } else {
    time=0;
    frac=0;
    ps++;
    curve[ps%2].randomize();
  }
  t-=0.003;
  setPoints();
  setDivs();
  requestAnimationFrame(animate);
}


var start=()=>{
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

onresize();
curve[0].randomize(true);
curve[1].randomize(true);
start();
