"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
body.style.margin="0";

const TP=2*Math.PI;
const CSIZE=500;

const ctx=(()=>{
  let c=document.createElement("canvas");
  c.width="1000";
  c.height="1000";
  c.style.display="block";
  body.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=3;
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight); 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}
onresize();

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const PT=function(a,rp) {
  //this.x=r*(Math.cos(a)+Math.cos(3*a))/2;
  //this.y=r*(Math.sin(a)-Math.sin(3*a))/2;
  //this.x=r*Math.cos(a);
  //this.y=r*Math.sin(a);
  this.a=a;
  this.ax=[-5,-3,3,5][getRandomInt(0,4)];
  this.fa=0.3*Math.random();
  //this.fx=()=>{ return rp*(7*Math.cos(this.a)+3*Math.cos(this.ax*this.a))/10; }
  this.fx=()=>{ return rp*(this.fa*Math.cos(this.a)+(1-this.fa)*Math.cos(this.ax*this.a)); }
  this.fy=()=>{ return rp*(this.fa*Math.sin(this.a)+(1-this.fa)*Math.sin(this.ax*this.a)); }
  this.x=this.fx(a);
  this.y=this.fy(a);
  this.lines=[];
  this.maxr=CSIZE-rp;
  this.r=CSIZE-rp;
  //this.motion=0.001*(1-2*Math.random())*(CSIZE/rp);
  this.motion=0.0005*([-1,1][getRandomInt(0,2)])*(CSIZE/rp);
  this.move=()=>{
    this.a+=this.motion;
    this.x=this.fx();
    this.y=this.fy();
  }
}

const LN=function(pt1,pt2) {
  this.pt1=pt1;
  this.pt2=pt2;
  this.setd=()=>{
    this.d=Math.pow(Math.pow(pt1.x-pt2.x,2)+Math.pow(pt1.y-pt2.y,2),0.5);
  }
  this.setd();
}

var Color=function(op) {
  this.hx=getRandomInt(0,360);
  this.hue=this.hx;
  if (op) {
    //this.sat=80+20*Math.random();
    //this.lum=60+20*Math.random();
    this.sat=90+10*Math.random();
    this.lum=70+10*Math.random();
  } else {
    this.sat=50+20*Math.random();
    this.lum=50+20*Math.random();
  }
  this.getHSL=()=>{ return this.hsl; }
  this.getHSLA=(op)=>{ 
    return"hsla("+Math.floor(this.hue)%360+","+this.sat+"%,"+this.lum+"%,"+op+")";
  }
}

const randomColor=()=>{
  return "hsl("+getRandomInt(0,360)+","
                +(50+20*Math.random())+"%,"
                +(50+20*Math.random())+"%)";
}
var hues=[];
for (let i=0; i<60; i++) { hues.push(new Color()); }

var draw=()=>{
  ctx.fillStyle="hsla(0,0%,0%,0.03)";
  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
if (frac<1) {
  for (let i=0; i<points.length; i++) {
      for (let j=0; j<4; j++) {
//    if (points[i].lines[0].d<10) {
	ctx.beginPath();
	ctx.moveTo(points[i].lines[j].pt1.x,points[i].lines[j].pt1.y);
	ctx.lineTo(points[i].lines[j].pt2.x,points[i].lines[j].pt2.y);
	ctx.closePath();
        //ctx.lineWidth=Math.min(points[i].lines[0].pt1.r,points[i].lines[0].pt2.r)-points[i].lines[0].d/100;
        ctx.strokeStyle=hues[i%hues.length].getHSLA((1-frac)*(4-j)/20);
	ctx.stroke();
//    }
      }
  }
}

  if (frac>0) {
    for (let i=0; i<points.length; i++) {
      ctx.beginPath();
      ctx.arc(points[i].x,points[i].y,points[i].r,0,TP);
      ctx.closePath();
      ctx.strokeStyle=hues[i%hues.length].getHSLA(0.5*frac);
      ctx.stroke();
  //    ctx.fillStyle=hues[i%hues.length];
  //    ctx.fill();
    }
  }
}

var S=0;
var t=0;
var ct=0;
var stopped=true;
var frac=0;
var animate=(ts)=>{
  if (stopped) return;
  t+=0.004;
  if (S==0) {
    if (Math.random()<0.001)  {
      if (frac==0) S=1;
      else S=-1;
    }
  } else {
    frac+=S*0.01;
    if (frac<0) { frac=0; S=0; }
    else if (frac>1) { frac=1; S=0; }
  }
  //if (Math.random()<0.05) { addPoint(); }
  //for (let i in points) points[i].move();
  //let ct=1+Math.floor(points.length*Math.pow(Math.sin(t),2));
  for (let i=0; i<points.length; i++) points[i].move();
  recalcLines();
  resetLines();
  draw();
  requestAnimationFrame(animate);
}

const radius=20;
var points=[];
var lines=[];
var addPoint=()=>{
  let pt=new PT(TP*Math.random(),(CSIZE-radius)*(0.05+0.95*Math.random()));
  //let pt=new PT(TP*Math.random(),(CSIZE-radius)*Math.random());
  //let pt=new PT(TP*Math.random(),(CSIZE-radius));
//  let pt=new PT(i*TP/PC);
  for (let j=0; j<points.length; j++) {
    let ln=new LN(pt,points[j]);
    pt.nnln=ln;
    if (points[j].nnln==undefined) {
      points[j].nnln=ln;
    } else if (points[j].nnln.d>ln.d) {
      points[j].nnln=ln;
    }
    lines.push(ln);
    pt.lines.push(ln);
    points[j].lines.push(ln);
    if (points[j].r>ln.d/2) { points[j].r=ln.d/2; }  // adjust for radii
    if (pt.r>ln.d/2) { pt.r=ln.d/2; }
  }
  points.push(pt);
//draw();
}

var recalcLines=()=>{
  for (let i=0; i<lines.length; i++) lines[i].setd();
}

var resetLines=()=>{
  for (let i=0; i<points.length; i++) {
    points[i].lines.sort((a,b)=>{ return a.d-b.d; })
    points[i].r=Math.min(points[i].maxr,points[i].lines[0].d/2);
  }
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

for (let i=0; i<getRandomInt(60,100); i++) addPoint();

start();
