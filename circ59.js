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
//c.style.outline="1px dotted gray";
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
//if (EM && t%300==0) stopped=true;
  draw();
  if (t==DUR) {
    reset();
    DO2=TP*Math.random();
    //DT2=1000+1000*Math.random();
    DT2=400+1200*Math.random();
    color.randomize();
    t=-240;
//stopped=true;
  }
  requestAnimationFrame(animate);
}

let R=80;

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var KA=new Array(12);
KA.fill(0);
var KB=new Array(12);
KB.fill(100);

var FA=new Array(12);
FA.fill(false);

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const SQ3=Math.pow(3,0.5);	// 2*Math.sin(TP/6)

//ctx.lineJoin="round";
var DUR=1000;
var dash1,dash2,maxDash=120;;
//const DO1=0; //TP*Math.random();
var DO2=TP*Math.random();
const DT1=DUR;
var DT2=400+2000*Math.random();

var reset=(test)=>{
if (!test) for (let i in KA) KA[i]=TP*Math.random();
  //for (let i in KB) KB[i]=100+100*Math.random();
  for (let i in KB) KB[i]=(100+100*Math.random())*[-1,1][getRandomInt(0,2)];
  for (let i in FA) FA[i]=Math.random()<0.5;
  maxDash=(0.3+0.2*Math.random())*R*Math.PI;
}
reset(true);

var getDistance=(x1,y1,x2,y2)=>{
  let dx=x2-x1;
  let dy=y2-y1;
  return Math.pow(dx*dx+dy*dy,0.5);
}

var draw=()=>{
  if (t<0) return;
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let p=new Path2D();
  let x1=R+R*Math.sin(KA[0]+t/KB[0]);
  let y1=0;
  //let r=R*Math.pow((1+1*Math.sin(t/KB[0]))/2,0.2);
  let r1=x1/2; //Math.min(x1,R);
  //p.moveTo(x1-r1,0);
  //p.arc(x1,y1,r1,TP/2,0);
  if (FA[0]) {
    p.moveTo(x1-r1,0);
    p.arc(x1,y1,r1,TP/2,0,true);
  } else {
    p.moveTo(x1+r1,0);
    p.arc(x1,y1,r1,0,TP/2);
  }

  let rm=(SQ3-1)*R;
  let x2=0;
  let y2=SQ3*R+R*Math.sin(t/KB[1]);
  //let r2=rm+(R/2-rm/2)+(R/2-rm/2)*Math.sin(t/KB[1]);
  let r2=rm/2+R/2+(R/2-rm/2)*Math.sin(t/KB[1]);
  let d=getDistance(x1,y1,x2,y2);
  if (d<r1+r2) r2=d-r1;
  //let r2=(SQ3-1)*R;
  if (FA[1]) {
    p.moveTo(0,y2-r2);
    p.arc(0,y2,r2,3*TP/4,TP/4);
  } else {
    p.moveTo(0,y2+r2);
    p.arc(0,y2,r2,TP/4,3*TP/4,true);
  }
//  p.moveTo(0,y2-r2);
//  p.arc(0,y2,r2,3*TP/4,TP/4,true);

  let x3=2*R+R*Math.sin(KA[2]+t/KB[2]);
  let y3=SQ3*R+R*Math.sin(KA[3]+t/KB[3]);
  let d2=getDistance(x1,y1,x3,y3);
  let d3=getDistance(x2,y2,x3,y3);
  let r3=rm/2+R/2+(R/2-rm/2)*Math.sin(KA[3]+t/KB[3]);
  //let ad=Math.atan2(SQ3,2);
  r3=Math.min(r3,d2-r1,d3-r2);
  r3=Math.max(0,r3);
  //let ad=Math.PI+Math.atan2(y3,x3);
  //let ad=Math.atan2(y3,x3);
  //let r3=Math.min(R,d2-r1,d3-r2);
//if (FA[2]) {
//if (true) {
  let ad=(FA[2]?Math.PI:0)+Math.atan2(y3,x3);
  let rx=x3+r3*Math.cos(ad);
  let ry=y3+r3*Math.sin(ad);
//drawPoint(rx,ry,"yellow");
  //p.moveTo(x3,y3-r3);
//  if (FA[2]) {
  p.moveTo(rx,ry);
  p.arc(x3,y3,r3,ad,ad+TP/2);
  p.moveTo(rx,ry);
  p.arc(x3,y3,r3,ad,ad-TP/2,true);
/*
} else {
  let rx=x3-r3*Math.cos(ad);
  let ry=y3-r3*Math.sin(ad);
  p.moveTo(rx,ry);
  p.arc(x3,y3,r3,ad+TP/2,ad,true);
  p.moveTo(rx,ry);
  p.arc(x3,y3,r3,ad-TP/2,ad);
}
*/
  //p.moveTo(x3,y3-r3);
  //p.arc(x3,y3,r3,3*TP/4,TP/4,true);

  let x4=3*R+R*Math.sin(KA[4]+t/KB[4]);
  let y4=0;
  let d4=getDistance(x1,y1,x4,y4);
  let d5=getDistance(x3,y3,x4,y4);
  let r4=Math.min(R,d4-r1,d5-r3);
  r4=Math.max(0,r4);
  p.moveTo(x4+r4,0);
  p.arc(x4,y4,r4,0,TP/2);

  let x5=R+R*Math.sin(KA[5]+t/KB[5]);
  let y5=2*SQ3*R+R*Math.sin(KA[6]+t/KB[6]);
//  let r5=Math.min(x5,R);
  let d6=getDistance(x2,y2,x5,y5);
  let d7=getDistance(x3,y3,x5,y5);
  let r5=Math.min(R,x5,d6-r2,d7-r3);
  r5=Math.max(0,r5);
  //let ad2=Math.PI+Math.atan2(y5,x5);
  let ad2=(FA[3]?Math.PI:0)+Math.atan2(y5,x5);
  let rx5=x5+r5*Math.cos(ad2);
  let ry5=y5+r5*Math.sin(ad2);
  //p.moveTo(x5-r5,y5);
//    p.arc(x5,y5,r5,TP/2,0,true);
//drawPoint(rx5,ry5,"yellow");
  p.moveTo(rx5,ry5);
  p.arc(x5,y5,r5,ad2,ad2+TP/2);
  p.moveTo(rx5,ry5);
  p.arc(x5,y5,r5,ad2,ad2-TP/2,true);

  let x6=3*R+R*Math.sin(KA[7]+t/KB[7]);
  let y6=2*SQ3*R+R*Math.sin(KA[8]+t/KB[8]);
  let d8=getDistance(x3,y3,x6,y6);
  let d9=getDistance(x5,y5,x6,y6);
  let r6=Math.min(R,d8-r3,d9-r5);
  r6=Math.max(0,r6);
  let ad3=(FA[4]?Math.PI:0)+Math.atan2(y6,x6);
  let rx6=x6+r6*Math.cos(ad3);
  let ry6=y6+r6*Math.sin(ad3);
//drawPoint(rx6,ry6,"yellow");
  p.moveTo(rx6,ry6);
  p.arc(x6,y6,r6,ad3,ad3+TP/2);
  p.moveTo(rx6,ry6);
  p.arc(x6,y6,r6,ad3,ad3-TP/2,true);

  p.addPath(p,dmx);
  p.addPath(p,dmy);

  //dash1=120*(1-Math.cos(TP*t/DT1));	// ? max 120 to 240?
dash1=maxDash*(1-Math.cos(TP*t/DT1));	// ? max 120 to 240?
  dash2=24+120*(1-Math.cos(DO2+TP*t/DT2));
  ctx.setLineDash([dash1,dash2]);

  ctx.strokeStyle="#00000020";
  ctx.lineWidth=8
  ctx.stroke(p);
  ctx.lineWidth=2
  ctx.strokeStyle=color.getRGB();
  ctx.stroke(p);

}

onresize();

draw();

/*
  ctx.setLineDash([]);
  ctx.strokeStyle="white";
  ctx.arc(R,0,R,0,TP);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(2*R,SQ3*R,R,0,TP);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0,SQ3*R,R,0,TP);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(3*R,0,R,0,TP);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(R,2*SQ3*R,R,0,TP);
  ctx.stroke();
  drawPoint(0,0);
  drawPoint(0,SQ3*R,"blue");
  drawPoint(2*R,SQ3*R,"blue");
*/
