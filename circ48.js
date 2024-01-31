"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
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
ctx.globalCompositeOperation="destination-over";

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
    this.fr=1-Math.pow(0.9*Math.random(),4);
    this.fg=1-Math.pow(0.9*Math.random(),4);
    this.fb=1-Math.pow(0.9*Math.random(),4);
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
//if (EM && t%300==0) stopped=true;
  if (t%100==0) {
    var L=ca.length;
    for (let i=0; i<L; i++) ca[i].split();
  }
  if (t>KT-50) ctx.canvas.style.opacity=(KT-t)/50;
  if (t==KT) {
ca=[new Circle()];
ca[0].randomize();
      //randomizeCircles();
      initRadius=100*Math.random();
      color.randomize();
      ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
      ctx.canvas.style.opacity=1;
      t=0;
  }
  draw();
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

const getQuadPath=(spath)=>{
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  let p=new Path2D(spath);
  p.addPath(p,dmy);
  p.addPath(p,dmx);
  return p;
}

var initRadius=100*Math.random();

var Circle=function() { 
  this.randomize=()=>{
    let a=TP*Math.random();
    this.x=1.5*CSIZE*Math.cos(a);
    this.y=1.5*CSIZE*Math.sin(a);
/*
    if (Math.random()<0.5) {
      this.x=CSIZE+20;
      this.y=CSIZE*Math.random();
    } else {
      this.x=CSIZE*Math.random();
      this.y=CSIZE+20;
    }
*/
    this.dx=this.x/400;
    this.dy=this.y/400;
    this.ka=TP*Math.random();	// initital rotation
    //this.et=(100+200*Math.random())*[-1,1][getRandomInt(0,2)];
//this.et=(40+160*Math.random())*[-1,1][getRandomInt(0,2)];
this.et=(30+50*Math.random())*[-1,1][getRandomInt(0,2)];
    this.erk=1+3*Math.random();		// vary
  }
//  this.randomize();
  this.move=()=>{
    this.x-=this.dx;
    this.y-=this.dy;
  }
  this.getPath=()=>{
    let r=initRadius*(1-t/KT);
    let p=new Path2D();
    p.moveTo(this.x+r*Math.cos(this.ka+t/this.et),this.y+r*Math.sin(this.ka+t/this.et));
    p.ellipse(this.x,this.y,r,r/this.erk,this.ka+t/this.et,0,TP);
    return p;
  }
  this.split=()=>{
    let ga=Math.atan2(-this.dy,-this.dx);
    let sa=Math.PI+Math.PI/2*Math.random(); //TP/4*Math.random();
    let r=Math.pow(this.dx*this.dx+this.dy*this.dy,0.5);
    let a1=ga+sa;
    let a2=ga-sa;
    this.dx=r*Math.cos(a1);
    this.dy=r*Math.sin(a1);
    let c=this.duplicate();
    c.dx=r*Math.cos(a2);
    c.dy=r*Math.sin(a2);
    ca.push(c);
  }
  this.duplicate=()=>{
    let c=new Circle();
    c.x=this.x;
    c.y=this.y;
    c.ka=this.ka;	// initial rotation
    c.et=this.et;
    c.erk=this.erk;
    return c; 
  }
}
var ca=[new Circle()];
ca[0].randomize();

/*
var count=getRandomInt(2,8);

var randomizeCircles=()=>{
  ca=[];
  count=1; //getRandomInt(2,6);
//console.log("count "+count);
  for (let i=0; i<count; i++) {
    let circ=new Circle();
    circ.randomize();
    ca.push(circ);
  }
}
randomizeCircles();
*/

const KT=900; 
//ctx.setLineDash([20,40]);

var draw=()=>{
//ctx.lineDashOffset=t;
  let p=new Path2D();
  let r=CSIZE*(Math.sin(TP*t/KT));
  for (let i=0; i<ca.length; i++) {
     ca[i].move();
     p.addPath(ca[i].getPath());
  }
  let p2=getHexPath(p);
  ctx.setTransform(1,0,0,1,CSIZE-2,CSIZE+2);
  ctx.lineWidth=10; //Math.min(r,8);
  ctx.strokeStyle="#00000014";
  ctx.stroke(p2);
  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  ctx.lineWidth=2; //Math.min(r,2);
  ctx.strokeStyle=color.getRGB();
  ctx.stroke(p2);
}

onresize();

start();

