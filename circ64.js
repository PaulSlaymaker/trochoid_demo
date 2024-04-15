"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;

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
  const CBASE=160;
  const CT=255-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*(this.fr*Math.cos(this.RK2+t/this.RK1)+(1-this.fr)*Math.cos(t/this.RK3)));
    let grn=Math.round(CBASE+CT*(this.fg*Math.cos(this.GK2+t/this.GK1)+(1-this.fg)*Math.cos(t/this.GK3)));
    let blu=Math.round(CBASE+CT*(this.fb*Math.cos(this.BK2+t/this.BK1)+(1-this.fb)*Math.cos(t/this.BK3)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomizeF=()=>{
    this.RK3=1+5*Math.random();
    this.GK3=1+5*Math.random();
    this.BK3=1+5*Math.random();
    this.fr=1-Math.pow(0.9*Math.random(),3);
    this.fg=1-Math.pow(0.9*Math.random(),3);
    this.fb=1-Math.pow(0.9*Math.random(),3);
  }
  this.randomize=()=>{
    this.RK1=40+40*Math.random();
    this.GK1=40+40*Math.random();
    this.BK1=40+40*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.randomizeF();
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
if (EM && t%200==0) stopped=true;
  requestAnimationFrame(animate);
}

const getHexPath=(spath)=>{
  const dm1=new DOMMatrix([0.5,0.866,-0.866,0.50,0,0]);
  const dm2=new DOMMatrix([-0.5,0.866,-0.866,-0.50,0,0]);
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  let p=new Path2D(spath);
  p.addPath(p,dmy);
  p.addPath(p,dmx);
  let hpath=new Path2D(p);
  hpath.addPath(p,dm1);
  hpath.addPath(p,dm2);
  return hpath;
}

var getDistance=(x1,y1,x2,y2)=>{
  let dx=x2-x1;
  let dy=y2-y1;
  return Math.pow(dx*dx+dy*dy,0.5);
}

onresize();

function Circle(pc) {
  this.KA=(400+400*Math.random())*[-1,1][getRandomInt(0,2)];
  this.KAo=TP*Math.random();
  this.KB=(200+200*Math.random())*[-1,1][getRandomInt(0,2)];
  this.KBo=TP*Math.random();
  this.setLocation=()=>{
    this.lr=CSIZE/2+CSIZE/2*Math.sin(this.KAo+t/this.KA);
    this.la=TP/24*Math.sin(this.KBo+t/this.KB);
    this.x=this.lr*Math.cos(this.la);
    this.y=this.lr*Math.sin(this.la);
  }
  this.setLocation();
  this.getPath=()=>{
    let p=new Path2D();
    if (this.r<0) return p;
    let mx=this.r*Math.cos(this.a);
    let my=this.r*Math.sin(this.a);
    p.moveTo(this.x+mx,this.y+my);
    p.ellipse(this.x,this.y,this.r,this.r2,this.a,0,TP);
    return p;
  }
  this.getLimits=(x,y)=>{
    let a=Math.atan2(y-this.y,x-this.x);
    let d=getDistance(this.x,this.y,x,y)-this.r2;
    if (pc) {
      let ara=pc.getLimits(x,y);
      ara.push({"a":a,"d":d});
      return ara;
    } else return [{"a":a,"d":d}];
  }
  this.setRadius=()=>{
    let lan=[
      {"a":Math.PI,"d":this.x}, 
//      {"a":3*Math.PI/2,"d":this.y}, 
      {"a":0,"d":CSIZE-this.x}, 
//      {"a":Math.PI/2,"d":CSIZE-this.y}, 
      //{"a":5*Math.PI/6,"d":this.lr*Math.sin(TP/12-this.la)}, 
//      {"a":10*Math.PI/6,"d":this.lr*Math.sin(Math.PI/6-this.la)}, 
//      {"a":TP-10*Math.PI/6,"d":this.lr*Math.sin(Math.PI/6+this.la)}, 
      {"a":7*Math.PI/12,"d":this.lr*Math.sin(Math.PI/12-this.la)}, 
      {"a":TP-7*Math.PI/12,"d":this.lr*Math.sin(Math.PI/12+this.la)}, 
//      {"a":10*Math.PI/12,"d":this.lr*Math.sin(Math.PI/12-this.la)}, 
//      {"a":TP-10*Math.PI/12,"d":this.lr*Math.sin(Math.PI/12+this.la)}, 
    ];
    if (pc) { 
      lan.push(...pc.getLimits(this.x,this.y));
    }
    lan.sort((a,b)=>{ return a.d-b.d; });
//console.log(lan);
    this.r=lan[0].d; //Math.min(...la);
    this.a=lan[0].a;
    this.r2=lan[1].d;
  }
}

var ca=new Array();
ca.push(new Circle());
ca.push(new Circle(ca[0]));
ca.push(new Circle(ca[1]));
ca.push(new Circle(ca[2]));

ctx.lineWidth=2;
ctx.globalAlpha=0.8;

var draw=()=>{
  for (let i=0; i<ca.length; i++) ca[i].setLocation();
  for (let i=0; i<ca.length; i++) ca[i].setRadius();
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let pth=new Path2D();
  for (let i=0; i<ca.length; i++) {
    pth.addPath(ca[i].getPath());
  }
  let pth2=new Path2D();
  const dm1=new DOMMatrix([0.259,0.966,-0.966,0.259,0,0]);
  pth2.addPath(pth,dm1);
  let pth3=getHexPath(pth2);
  ctx.strokeStyle=color.getRGB();
  ctx.lineWidth=2;
  ctx.stroke(pth3);
  ctx.strokeStyle="#00000010";
  ctx.lineWidth=8;
  ctx.stroke(pth3);
}

start();

