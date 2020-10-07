"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
const TP=Math.PI*2;
const DCOUNT=180;

var D=0;
var XD=0;
var YD=0;
onresize=function() {
  XD=window.innerWidth/2;
  YD=window.innerHeight/2*0.9;
  D=2*Math.min(XD,YD)-40; 
  cd1.setDimensions();
  cd2.setDimensions();
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const getX=(t)=>{ return Math.pow(Math.sin(t),3); }
const getY=(t)=>{ 
  return -0.8125*Math.cos(t)+0.3125*Math.cos(2*t)+0.125*Math.cos(3*t)+0.0625*Math.cos(4*t);
}

var HS=function(rd,color) {
  this.el=document.createElement("div");
  this.el.style.top="0px";
  this.el.style.left="0px";
  this.el.style.background=color;
  body.append(this.el);
  this.setDimensions=()=>{
  this.el.style.width=2*XD-8+"px";
  this.el.style.height=window.innerHeight-8+"px";
  let polygon="polygon(";
  for (let i=0; i<100; i++) {
    let z=i*TP/100;
    polygon+=XD+16+D*rd*getX(z)+"px "+(YD+D*rd*1.1*getY(z))+"px";
    if (i<99) polygon+=",";
  }
  polygon+=")";
  this.el.style.clipPath=polygon;
  }
}

const cd1=new HS(0.53,"#CC1111");
const cd2=new HS(0.50,"black");

onresize();

const divs=(()=>{
  let d=[];
  for (let i=0; i<DCOUNT; i++) {
    let co=document.createElement("div");
    co.innerHTML="&#9829";
    let red=getRandomInt(-20,20);
    body.append(co);
    let rot=TP/DCOUNT*i;
    //let rad=D/2.3*(0.2+0.8*Math.pow(Math.random(),0.2));
    let rad=D/2.3*Math.pow(Math.random(),0.3);
    //d.push({"el":co,"time":ti,"frac":0,"ce":ce,"rot":rot});
    let dir=(0.003+0.005*Math.random())*[-1,1][i%2];
    let ce=Math.random()<0.03?1:0;
    d.push({"el":co,"rad":rad,"rot":rot,"dir":dir,"ce":ce,"red":red});
  }
  return d;
})();

const setDivs=()=>{
  for (let i=0; i<DCOUNT; i++) {
    let cet=divs[i].ce%3;
    let rad=cet==1?divs[i].rad*(1-divs[i].frac):cet==2?divs[i].frac*divs[i].rad:divs[i].rad;
    let m=divs[i].rot;
    let y=getY(m);
    let ty=YD+rad*y;
    let x=getX(m);
    let tx=XD+rad*x;
    divs[i].el.style.top=ty+"px";
    divs[i].el.style.left=tx+"px";
//let f=(divs[i].ce)?divs[i].frac:1-divs[i].frac;
//divs[i].el.style.fontSize=20+divs[i].rad*2.3/D*50*(Math.abs(x)+Math.abs(y));
    divs[i].el.style.fontSize=5+rad*2.3/D*60*(Math.abs(x)+Math.abs(y));
    let rf=rad/(D/2.3)*40+20;
    divs[i].el.style.color="hsl("+divs[i].red+",90%,"+rf+"%)";
  }
}

var stopped=true;
var duration=6000;
var animate=(ts)=>{
  if (stopped) return;
  divs.forEach((d)=>{ 
    if (d.ce%3!=0) {
      if (!d.time) d.time=ts;
      let progress=ts-d.time;
      if (progress<duration) {
	d.frac=progress/duration;
      } else {
	d.time=0;
	d.frac=0;
	d.ce++; 
      }
    } else {
      if (Math.random()<0.001) d.ce++;
    }
    d.rot+=d.dir;
  });
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

start();
