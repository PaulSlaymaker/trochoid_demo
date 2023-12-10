"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;

/*
const [ctx,ctx2]=(()=>{
  let d=document.createElement("div");
  d.style.margin="0 auto";
  d.style.position="relative";
  body.append(d);
  let c2=document.createElement("canvas");
c2.style.outline="1px dotted white";
  c2.width=c2.height=800;
  c2.style.position="absolute";
  c2.style.top=c2.style.left="0px";
  d.append(c2);
  let c=document.createElement("canvas");
c.style.outline="0.1px dotted yellow";
  c.width=c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top=c.style.left="0px";
  d.append(c);
  return [c.getContext("2d"),c2.getContext("2d")];
})();
ctx.translate(CSIZE,CSIZE);
ctx.globalCompositeOperation="destination-over";
ctx2.translate(CSIZE,CSIZE);
ctx2.globalCompositeOperation="destination-over";
onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.parentElement.style.width=D+"px";
  ctx.canvas.parentElement.style.height=D+"px";
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
  ctx2.canvas.style.width=ctx2.canvas.style.height=D+"px";
}
*/

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
  this.advance=()=>{
    this.RK2-=1;
    this.GK2-=1;
    this.BK2-=1;
    this.fr=1-Math.pow(Math.random(),2);
    this.fg=1-Math.pow(Math.random(),2);
    this.fb=1-Math.pow(Math.random(),2);
  }
}

var colors=[new Color(),new Color()];

/*
var CircleO=function(k1) { 
  this.randomize=()=>{
    this.maxr=20+60*Math.random();
    //this.ka=(60+120*Math.random())*[-1,1][getRandomInt(0,2)];
    this.ka=(80+160*Math.random())*[-1,1][getRandomInt(0,2)];
    //this.alpha=TP*Math.random();
    this.alpha=TP/8-TP/4*Math.random();
    this.er=1+3*Math.pow(Math.random(),4);
    this.erk=(20+100*Math.random())*[-1,1][getRandomInt(0,2)];
  }
  this.randomize();
  this.getPath=()=>{
    let p=new Path2D();
    //p.arc(this.x,this.y,Math.max(1,this.r-1),0,TP);
    let rr=Math.max(0,this.r);
    p.ellipse(this.x,this.y,rr,rr/this.er,t/this.erk,0,TP);
    return p;
  }
  this.extend=()=>{
    if (this.cc) {
      let ccz=this.alpha+t/this.ka;
      let cx=Math.min((CSIZE-this.r),this.x+this.r*Math.cos(ccz));
      let cy=Math.min((CSIZE-this.r),this.y+this.r*Math.sin(ccz));
      let d=Math.pow(cx*cx+cy*cy,0.5);
      //let cr=Math.min(this.maxr*(2*d)/CSIZE,this.maxr,CSIZE-Math.abs(cx),CSIZE-Math.abs(cy));
let cr=Math.min(d,this.maxr,CSIZE-Math.abs(cx)-this.r,CSIZE-Math.abs(cy)-this.r);
      this.cc.x=this.x+(this.r+cr/2)*Math.cos(this.alpha+t/this.ka);
      this.cc.y=this.y+(this.r+cr/2)*Math.sin(this.alpha+t/this.ka);
      this.cc.r=cr/2;
      this.cc.extend();
    }
  }
  this.move=()=>{
    let z=TP*t/KT;
    this.x=(CSIZE-this.maxr-40)*(Math.cos(k1+z)+Math.cos(k1+3*z))/2;
    this.y=(CSIZE-this.maxr-40)*(Math.sin(k1+z)-Math.sin(k1+3*z))/2;
    let d=Math.pow(this.x*this.x+this.y*this.y,0.5);
    //this.r=Math.min(Math.abs(this.x),Math.abs(this.y),CSIZE-Math.abs(this.x),CSIZE-Math.abs(this.y),maxr); 
    //this.r=Math.min(d,CSIZE-d,maxr);
    //this.r=Math.min(this.maxr*(2*d)/CSIZE,this.maxr);
    //this.r=Math.min(this.maxr*(2*d)/CSIZE,this.maxr,CSIZE-Math.abs(this.x),CSIZE-Math.abs(this.y));
//let rf=(1-Math.cos(d*TP/CSIZE/2))/2;
    //this.r=Math.min(this.maxr*rf,this.maxr,CSIZE-Math.abs(this.x),CSIZE-Math.abs(this.y));
this.r=Math.min(d,this.maxr,CSIZE-Math.abs(this.x),CSIZE-Math.abs(this.y));
    this.extend();
  }
}
*/

const DMX=new DOMMatrix([-1,0,0,1,0,0]);
const DMY=new DOMMatrix([1,0,0,-1,0,0]);

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var t=0;
//var KTD=KT/8;
var animate=(ts)=>{
  if (stopped) return;
  t++;
/*
  ca[0].move();
  if (t>KTD-100)   ctx.canvas.style.opacity=(KTD-t)/100;
  if (t%KTD==0) {
    ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    colors.forEach((c)=>{ c.randomize(); });
    ca.forEach((circ)=>{ circ.randomize(); });
    ctx.canvas.style.opacity=1;
    t=0;
report();
  }
if (EM && t%400==0) stopped=true;
*/
  draw();
if (t>KT/5-100)   ctx.canvas.style.opacity=(KT/5-t)/100;
if (t>KT/5) {
  //if (Math.random()<0.5) 
  randomizePoints();
  colors.forEach((c)=>{ c.randomize(); });
D=8*Math.random();
D2=8*Math.random();
//  colors.forEach((c)=>{ c.advance(); });
//  pts.forEach((pt)=>{ pt.x+=6; pt.y-=6; });

ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
ctx.canvas.style.opacity=1;
/*
if (ctxa==ctx) {
//  ctx2.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.canvas.parentElement.appendChild(ctx2.canvas)
  ctxa=ctx2;
} else {
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.canvas.parentElement.appendChild(ctx.canvas)
  ctxa=ctx;
}
*/
  t=0;
//for (let i=0; i<pts.length; i++) { ctx.fillRect(pts[i].x-4,pts[i].y-4,8,8); }
}
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

var Circle=function() { 
  this.randomize=()=>{
    let z=TP*Math.random();
    let r=CSIZE*Math.random();
    this.x=r*Math.cos(z);
    this.y=r*Math.sin(z);
    this.ka=TP*Math.random();		// vary
    this.et=(100+200*Math.random())*[-1,1][getRandomInt(0,2)];
    this.erk=1+2*Math.random();		// vary
  }
  this.randomize();
}
var ca=[new Circle()];

var pts=[];
var count=getRandomInt(2,8);
console.log("count "+count);

var randomizePoints=()=>{
//  pts=[];
  ca=[];
  count=getRandomInt(2,8);
console.log("count "+count);
  for (let i=0; i<count; i++) {
    let z=TP*Math.random();
    let r=CSIZE*Math.random();
    let x=r*Math.cos(z);
    let y=r*Math.sin(z);
  /*
    let z=TP*i/count;
    let x=CSIZE*(Math.cos(z)/2+Math.cos(3*z)/2);
    let y=CSIZE*(Math.sin(z)/2-Math.sin(3*z)/2);
  */
    //pts.push({"x":0.707*CSIZE*(1-2*Math.random()),"y":0.707*CSIZE*(1-2*Math.random())});
//    pts.push({"x":x,"y":y});
ca.push(new Circle());
    //pts.push({"x":0,"y":0});
  }
//  pts[0].x=CSIZE;
//  pts[1].y=0;
}
randomizePoints();

const KT=4000; 

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);

ctx.fillStyle="#00000044";
//ctx2.fillStyle="#00000044";
let KA=TP*Math.random();
let D=8*Math.random();
let D2=8*Math.random();

var draw=()=>{
  //let pa=[new Path2D(),new Path2D()];
  let p=new Path2D();
  //let r=t/KT;
  let r=CSIZE*(Math.sin(TP*t/KT));
  for (let i=0; i<ca.length; i++) {
    p.moveTo(ca[i].x+r*Math.cos(ca[i].ka+t/ca[i].et),ca[i].y+r*Math.sin(ca[i].ka+t/ca[i].et));
    //p.arc(pts[i].x,pts[i].y,r,0,TP);
    p.ellipse(ca[i].x,ca[i].y,r,r/ca[i].erk,ca[i].ka+t/ca[i].et,0,TP);
/*
let rr=Math.pow(pts[i].x*pts[i].x+pts[i].y*pts[i].y,0.5);
if (rr>CSIZE/2) {
    pa[0].moveTo(pts[i].x+r,pts[i].y);
    pa[0].arc(pts[i].x,pts[i].y,r,0,TP);
} else {
    pa[1].moveTo(pts[i].x+r,pts[i].y);
    pa[1].arc(pts[i].x,pts[i].y,r,0,TP);
}
*/
  }
ctx.setLineDash([D*r,D2*r]);

//  p.addPath(p,dmx);
//  p.addPath(p,dmy);
  let p2=getHexPath(p);
//for (let i=0; i<pa.length; i++) {

  ctx.setTransform(1,0,0,1,CSIZE-1,CSIZE+1);
//ctx.lineWidth=8;
  ctx.lineWidth=Math.min(r,8);
// only inner circle?  
  ctx.strokeStyle="#00000014";
  ctx.stroke(p2);

  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  ctx.lineWidth=Math.min(r,2);
  ctx.strokeStyle=colors[0].getRGB();
  ctx.stroke(p2);
//}

}

onresize();
var ctxa=ctx;

start();

//ctx.fillStyle = "rgba(0,0,0,1)"; // (Drawing with 0 alpha pretty much means doing nothing)
//ctx.globalCompositeOperation = "destination-out";

//ctx.canvas.parentElement.appendChild(ctx1/2.canvas)
