"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
const TP=Math.PI*2;
const DCOUNT=28; // 7*4
const SCOUNT=48; // (7+4)*4+4

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const getSE=(n)=>{
  let el=document.createElementNS("http://www.w3.org/2000/svg", "svg");
  el.setAttribute("viewBox","0 0 100 100");
  el.setAttribute("stroke","hsl("+getRandomInt(0,360)+",70%,70%)");
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
if (c[n]==undefined) debugger;
  p.setAttribute("d",c[n]);
  el.append(p);
  return el;
}

var el=document.createElementNS("http://www.w3.org/2000/svg", "svg");
el.setAttribute("viewBox","0 0 100 100");
//el.setAttribute("transform","translate(50%,50%)");
el.setAttribute("stroke","navy");
el.setAttribute("fill","none");
el.setAttribute("stroke-width","12.8");
el.setAttribute("stroke-linecap","round");
el.setAttribute("stroke-linejoin","round");
//el.style.width="100%";
//el.style.height="100%";
//viewBox="0 0 100 100" fill="none" stroke="#000" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" 
//body.append(el);
var p=document.createElementNS("http://www.w3.org/2000/svg", "path");
//p.setAttribute("d","M6 64l44 29.2l44-29.3v-29.6l-44-29.2l-44 29.2v29.6z M94 64l-44 -29.6l-44 29.6 M6 34.3l44 29.2 l44-29.2 M50 6v29.2 M50 64v29.2");
p.setAttribute("d","M75 30c-5.2-5.2-12-8-20-8c-20 0-28 12-28 28s12 28 28 28c8 0 14.8-3.2 20-8");
  //<path id="px" d="M75 57c0 16-12 28-28 28h-20V13h20  c0 0 28 0 28 28z"/>
  //<path id="px" d="M68 22h-36v56h36M56 50h-24"/>
//<path d="M32 53h24c8.8 0 15-7.2 16-16s-7.2-16-16-16h-24v56 "/>
//<path d="M29 76 V20 l44 56V20 "/>
el.append(p);

const divs=(()=>{
  let d=[];
  //for (let i=0; i<SCOUNT; i++) {
  for (let i=0; i<DCOUNT; i++) {
    let co=document.createElement("div");
//if (i%7<6) {
    co.style.width="44px";  // to css
    co.style.height="44px";
    let svg=getSE(i%7);
    co.append(svg);
/*
} else {
let ch=getRandomInt(9500,10300);
//co.textContent=String.fromCharCode(ch);
let s=document.createElement("div");
//s.style.fontSize="10px";
//s.textContent=ch;
s.textContent=String.fromCharCode(ch);
co.append(s);
}
*/

    //co.style.position="absolute";  // to cxx
    co.style.top="400px";  // fix with onresize
    co.style.left="600px";
    body.append(co);
    //d.push(co);
    d.push({"div":co,"svg":svg});
  }
  return d;
})();

var Curve=function() {
  this.sf=1;
  this.m=[1,1,1,-2];
  this.f=[];
  this.c=1;
  this.randomize=(init)=>{
    //this.sf=[1,1+0.4*Math.random(),2][getRandomInt(0,2)];
    //this.sf=[1,1.5,2][getRandomInt(0,2,true)];
    this.m=[];
    this.c=getRandomInt(1,4);
    for (let i=0; i<this.c; i++) {
      this.f[i]=[-1,1][getRandomInt(0,2)];
      this.m[i]=[-6,-5,-4,-3,-2,-1,1,2,3,4,5,6][getRandomInt(0,12)];
      //this.m[i]=[-3,-2,-1,1,2,3][getRandomInt(0,6)];
      //this.m[i]=[-1,1,2,3,4][getRandomInt(0,5)];
      //this.m[i]=[1,3][getRandomInt(0,2)];
//this.m[i]=3-6*Math.random();
    }
  }
  this.getX=(t)=>{ return Math.sin(this.sf*t); }
  //this.getX=(t)=>{ return (3*Math.sin(this.sf*t)+Math.sin(2*this.sf*t))/4; }
  this.getY=(t)=>{ 
    let v=0;
    for (let i=0; i<this.c; i++) v+=this.f[i]*Math.cos(this.m[i]*t);
    return v/this.c;
  }
  //this.getZ=(t)=>{ return (3*Math.cos(this.sf*t)+Math.cos(2*this.sf*t))/4; }
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
let d=0;
  for (let i=0; i<SCOUNT; i++) {
if (i%12<7) {
    let m=t+i*inc;
    //let y=(Math.cos(M1*m)+Math.cos(-8*m)+Math.cos(5*m))/3;
    let x=(1-frac)*curve[j].getX(m)+frac*curve[k].getX(m);
    let y=(1-frac)*curve[j].getY(m)+frac*curve[k].getY(m);
    let z=(1-frac)*curve[j].getZ(m)+frac*curve[k].getZ(m);
    points[pointSet][i]={"x":x,"y":y,"z":z};
    //points[pointSet][i]={"x":x,"y":y};
}
  }
}

const setDivs=()=>{
  let pointSet=ps%2;
  let inc=TP/SCOUNT;
  for (let i=0, d=0; i<SCOUNT; i++) {
    if (i%12<7) {
      let ty=100*points[pointSet][i].y;
      let tx=320*points[pointSet][i].x;
      let tz=88*points[pointSet][i].z;
      //let translate="translate("+tx+"px,"+ty+"px)";
      let translate="translate3d("+tx+"px,"+ty+"px,"+tz+"px)";
      divs[d].div.style.zIndex=Math.floor(500*points[pointSet][i].z);
      let zt=1+0.5*points[pointSet][i].z;
      let scale="scale("+zt+","+zt+")";
      //let r=Math.PI/2-TP*points[pointSet][i].z/16;
      let r=(TP/4-TP*points[pointSet][i].z/4);
      let rotate="rotateY("+r+"rad)";
      //let rotate="rotate3D(0,1,0,"+r+"rad)";
      let rotateZ="rotateZ("+zt+"rad)";
      //divs[i].style.transform=rotateZ+" "+rotate+" "+translate;
      //divs[i].style.transform=rotate+" "+scale;
      //divs[i].style.transform=rotate+" "+translate;
      //divs[i].firstElementChild.style.transform=rotate;
      divs[d].div.style.transform=translate;
  // color
      d++;
    } else {
      i+=4;
    }
  }
}

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
    transit();
  }
  //t+=0.004;
  t-=0.003;
  setPoints();
  setDivs();
  requestAnimationFrame(animate);
}

var ps=1;

const SD=200;

const transit=()=>{
  ps++;
  curve[ps%2].randomize();
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

curve[0].randomize(true);
curve[1].randomize(true);
start();


