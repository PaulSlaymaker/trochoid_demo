"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/zYXzaZJ
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
if (EM && t%300==0) stopped=true;
  draw();
  requestAnimationFrame(animate);
}

let R=92;

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

ctx.lineCap="round";

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
var d1,d2;
//const DO1=0; //TP*Math.random();
var DO2=TP*Math.random();
const DT1=DUR;
var DT2=400+2000*Math.random();

var reset=(test)=>{
if (!test) for (let i in KA) KA[i]=TP*Math.random();
  for (let i in KB) KB[i]=100+100*Math.random();
  for (let i in FA) FA[i]=Math.random()<0.5;
}
reset(true);

var draw=()=>{
if (t<0) return;
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let p=new Path2D();
  let x1=R+R*Math.sin(KA[0]+t/KB[0]);
  let y2=SQ3*R+R*Math.sin(KA[1]+t/KB[1]);
  let p1=[[x1,0]];
  FA[0]?p1.push([0,y2]):p1.unshift([0,y2]);
  p.moveTo(...p1[0]);
  p.lineTo(...p1[1]);

  let x3=2*R+R*Math.sin(KA[2]+t/KB[2]);
  let y3=SQ3*R+R*Math.sin(KA[3]+t/KB[3]);
//  let y4=y3;
  let p2=[[0,y2]];
  FA[1]?p2.push([x3,y3]):p2.unshift([x3,y3]);
  p.moveTo(...p2[0]);
  p.lineTo(...p2[1]);
  //p.moveTo(0,y2);
  //p.lineTo(x4,y3);
  let p3=[[x1,0]];
  FA[2]?p3.push([x3,y3]):p3.unshift([x3,y3]);
//  p.moveTo(x1,0);
//  p.lineTo(x3,y3);
  p.moveTo(...p3[0]);
  p.lineTo(...p3[1]);

  let x4=R+R*Math.sin(KA[4]+t/KB[4]);
  let y4=2*SQ3*R+R*Math.sin(KA[5]+t/KB[5]);
  let p4=[[0,y2]];
  FA[3]?p4.push([x4,y4]):p4.unshift([x4,y4]);
//  p.moveTo(0,y2);
//  p.lineTo(x5,y4);
  p.moveTo(...p4[0]);
  p.lineTo(...p4[1]);
  let p5=[[x3,y3]];
  FA[4]?p5.push([x4,y4]):p5.unshift([x4,y4]);
//  p.moveTo(x3,y3);
//  p.lineTo(x5,y4);
  p.moveTo(...p5[0]);
  p.lineTo(...p5[1]);

  let x5=3*R+R*Math.sin(KA[6]+t/KB[6]);
  let y5=0;
  let p6=[[x3,y3]];
  FA[5]?p6.push([x5,y5]):p6.unshift([x5,y5]);
//  p.moveTo(x3,y3);
//  p.lineTo(x5,y5);
  p.moveTo(...p6[0]);
  p.lineTo(...p6[1]);

  let x6=4*R+R*Math.sin(KA[7]+t/KB[7]);
  let y6=SQ3*R+R*Math.sin(KA[8]+t/KB[8]);
  let p7=[[x5,y5]];
  FA[6]?p7.push([x6,y6]):p7.unshift([x6,y6]);
  //p.moveTo(x5,y5);
  //p.lineTo(x6,y6);
  p.moveTo(...p7[0]);
  p.lineTo(...p7[1]);
  let p8=[[x3,y3]];
  FA[7]?p8.push([x6,y6]):p8.unshift([x6,y6]);
  //p.moveTo(x3,y3);
  //p.lineTo(x6,y6);
  p.moveTo(...p8[0]);
  p.lineTo(...p8[1]);

  let x7=3*R+R*Math.sin(KA[9]+t/KB[9]);
  let y7=2*SQ3*R+R*Math.sin(KA[10]+t/KB[10]);
  let p9=[[x6,y6]];
  FA[8]?p9.push([x7,y7]):p9.unshift([x7,y7]);
  p.moveTo(...p9[0]);
  p.lineTo(...p9[1]);
//  p.moveTo(x6,y6);
//  p.lineTo(x7,y7);
  let p10=[[x4,y4]];
  FA[9]?p10.push([x7,y7]):p10.unshift([x7,y7]);
  //p.moveTo(x4,y4);
  //p.lineTo(x7,y7);
  p.moveTo(...p10[0]);
  p.lineTo(...p10[1]);
  let p11=[[x3,y3]];
  FA[10]?p11.push([x7,y7]):p11.unshift([x7,y7]);
//  p.moveTo(x3,y3);
//  p.lineTo(x7,y7);
  p.moveTo(...p11[0]);
  p.lineTo(...p11[1]);

  let x9=0;
  let y9=3*SQ3*R+R*Math.sin(KA[11]+t/KB[11]);
  let p12=[[x4,y4]];
  FA[11]?p12.push([x9,y9]):p12.unshift([x9,y9]);
  //p.moveTo(x4,y4);
  //p.lineTo(x9,y9);
  p.moveTo(...p12[0]);
  p.lineTo(...p12[1]);

  p.addPath(p,dmx);
  p.addPath(p,dmy);

  d1=120*(1-Math.cos(TP*t/DT1));
  d2=24+120*(1-Math.cos(DO2+TP*t/DT2));
  //d2=121+120*Math.sin(t/DT2);
  if (t==DUR) {
    reset();
  //  stopped=true;
    DO2=TP*Math.random();
    //DT2=1000+1000*Math.random();
DT2=400+2000*Math.random();
    color.randomize();
    t=-240;
  }
  ctx.setLineDash([d1,d2]);
  ctx.strokeStyle="#00000020";
  ctx.lineWidth=8
  //ctx.lineWidth=0.5
  ctx.stroke(p);
  ctx.strokeStyle=color.getRGB();
  ctx.lineWidth=2;
  //ctx.lineWidth=0.125;
  ctx.stroke(p);
}

onresize();

start();
