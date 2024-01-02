"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S6=Math.sin(Math.PI/3);
const CSIZE=360;
const CSO=60;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
c.style.outline="1px dotted gray";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

const ctxo=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSO;
  return c.getContext("2d", {"willReadFrequently": true});
  //return c.getContext("2d");
})();
ctxo.setTransform(1,0,0,1,CSO,CSO);
ctxo.lineCap="round";
ctxo.beginPath();
ctxo.moveTo(-0.732*(CSO+1),0);	// 2*Math.cos(TP/12)-1
ctxo.lineTo(CSO+1,-CSO-1);
ctxo.lineTo(CSO+1,CSO+1);
ctxo.closePath();
ctxo.clip();
/*
ctxo.lineWidth=2;
ctxo.strokeStyle="red";
ctxo.stroke();
*/

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
ctx.lineDashOffset=LDF*t;
//if (EM && t%300==0) stopped=true;
  draw();
  if (t==KTD) {
    color.randomize();
    D=4*Math.random();
    D2=2*Math.random();
    LDF=10-20*Math.random();
    circ.randomize();
    t=0;
//stopped=true;
  }
  requestAnimationFrame(animate);
}

var Circle=function() { 
  this.randomize=()=>{
    let z=TP*Math.random();
    let r=0.8*CSO*Math.random();
    this.x=r*Math.cos(z);
    this.y=r*Math.sin(z);
    this.ka=TP*Math.random();
    this.ka2=0.003*Math.pow([-1,1][getRandomInt(0,2)]*Math.random(),5);
    this.et=(80+160*Math.random())*[-1,1][getRandomInt(0,2)];
    this.erk=1+3*Math.random();	
  }
  this.randomize();
  this.getPath=(r)=>{
    let p=new Path2D();
    let ko=this.ka+TP*Math.sin(this.ka2*t);
    //p.moveTo(this.x+r*Math.cos(this.ka+t/this.et),this.y+r*Math.sin(this.ka+t/this.et));
    //p.ellipse(this.x,this.y,r,r/this.erk,this.ka+t/this.et,0,TP);
    p.moveTo(this.x+r*Math.cos(ko+t/this.et),this.y+r*Math.sin(ko+t/this.et));
    p.ellipse(this.x,this.y,r,r/this.erk,ko+t/this.et,0,TP);
    return p;
  }
}

const circ=new Circle();
const KT=3200; 
const KTD=KT/4; 
var D=4*Math.random();
var D2=2*Math.random();
var LDF=10-20*Math.random();
const SO=2*(1-S6);

const symArray=[
  [1,0,0,1],
  [-1,0,0,1],
  [0.5,S6,S6,-0.5],
  [0.5,-S6,-S6,-0.5],
  [-0.5,S6,-S6,-0.5],
  [-0.5,-S6,S6,-0.5]
];

var draw=()=>{
  //let r=circ.erk*2*CSO*(Math.sin(TP*t/KT));
let r=circ.erk*1.5*CSO*(Math.sin(TP*t/KT));
  let p=circ.getPath(r);
  ctxo.setLineDash([D*r,D2*r]);
  ctxo.lineWidth=Math.min(r,6);
  ctxo.strokeStyle="#00000014";
  ctxo.stroke(p);
  ctxo.lineWidth=Math.min(r,1);
  ctxo.strokeStyle=color.getRGB();
  ctxo.stroke(p);
  symArray.forEach((sa,idx)=>{
    ctx.setTransform(sa[0],sa[1],sa[2],sa[3],CSIZE,CSIZE);
    for (let i=-8; i<7; i+=2) {
      if (i%4==0) {
	for (let j=-7; j<6; j+=6) ctx.drawImage(ctxo.canvas,(i*S6-SO)*CSO,j*CSO);
      } else {
	ctx.drawImage(ctxo.canvas,(i*S6-SO)*CSO,-4*CSO);
	ctx.drawImage(ctxo.canvas,(i*S6-SO)*CSO,2*CSO);
      }
    }
    if (idx==2) ctx.drawImage(ctxo.canvas,-8.928*CSO,-4*CSO);
    else if (idx==3) ctx.drawImage(ctxo.canvas,-8.928*CSO,2*CSO);
    else if (idx==4) ctx.drawImage(ctxo.canvas,-8.928*CSO,-4*CSO);
    else if (idx==5) ctx.drawImage(ctxo.canvas,-8.928*CSO,2*CSO);
  });
}

onresize();

start();

/*
var test=()=>{
  ctx.drawImage(ctxo.canvas,-CSIZE,-CSIZE);
  ctx.drawImage(ctxo.canvas,0,0);
}
*/

