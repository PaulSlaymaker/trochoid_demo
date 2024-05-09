"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=360;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=154;
  const CT=255-CBASE;
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(o+this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(o+this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(o+this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=400+400*Math.random();
    this.GK1=400+400*Math.random();
    this.BK1=400+400*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  draw();
if (EM && t%100==0) stopped=true
  requestAnimationFrame(animate);
}

function Dist(v,dir) {
  //this.KA=(100+100*Math.random())*[-1,1][getRandomInt(0,2)];
  this.KA=240+120*v;
if (v%2) this.KA=-this.KA;
//if (dir) this.KA=-this.KA;
  //this.KB=0; //v/12; //TP*Math.random();
  //this.KB=TP*Math.random();
  this.getLocation=()=>{ return CSIZE/2+CSIZE/2*Math.sin(t/this.KA); }
}

var getPath=(x1,y1,x2,y2)=>{
  let p=new Path2D();
  let mx=x1/2+x2/2;
  let my=y1/2+y2/2;
  p.moveTo(x2,my);
  p.ellipse(mx,my,(x2-x1)/2,(y2-y1)/2,0,0,TP);
  return p;
}

var distxa=new Array();
for (let i=0; i<10; i++) distxa.push(new Dist(i));
var distya=new Array();
for (let i=0; i<10; i++) distya.push(new Dist(i,true));

var draw=()=>{
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  let xa=new Array();
  for (let i=0; i<distxa.length; i++) xa.push(distxa[i].getLocation());
  xa.sort((a,b)=>{ return a-b; });
  xa.unshift(0);
  let ya=new Array();
  for (let i=0; i<distya.length; i++) ya.push(distya[i].getLocation());
  ya.sort((a,b)=>{ return a-b; });
  ya.unshift(0);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<xa.length-2; i++) { 
    for (let j=0; j<ya.length-2; j++) { 
      let pth=getPath(xa[i],ya[j],xa[i+1],ya[j+1]);
      pth.addPath(pth,dmx);
      pth.addPath(pth,dmy);
      //let cf=(xa[i+1]-xa[i])*(ya[j+1]-ya[j]);
      let cf=Math.pow((xa[i+1]-xa[i])*(ya[j+1]-ya[j]),0.3);
//if (1-cf/36<0) debugger;
//maxcf=Math.max(maxcf,cf);
      ctx.fillStyle=color.getRGB(cf/2);
      ctx.fill(pth);
    }
  }
}

var maxcf=0;

onresize();

start();

