"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/vYPNXJZ
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=480;
const CSO=60;

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

const ctxo=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSO;
  return c.getContext("2d", {"willReadFrequently": true});
  //return c.getContext("2d");
})();
ctxo.setTransform(1,0,0,1,CSO,CSO);
ctxo.lineCap="round";

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
var to=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  to++;
  draw();
  if (t==KTD) {
    color.randomize();
    //D=6*Math.random();
    D=0.1+6*Math.pow(Math.random(),2);
    D2=0.1+6*Math.pow(Math.random(),2);
    circ.randomize();
    t=0;
  }
if (EM && t%300==0) stopped=true;
  requestAnimationFrame(animate);
}

var Circle=function() { 
  this.randomize=()=>{
    let z=TP*Math.random();
    let r=CSO*Math.random();
    this.x=r*Math.cos(z);
    this.y=r*Math.sin(z);
    this.ka=TP*Math.random();		// vary
    //this.ka2=0.005-0.01*Math.pow(Math.random(),5);
this.ka2=0.003*Math.pow([-1,1][getRandomInt(0,2)]*Math.random(),5);
    this.et=(80+160*Math.random())*[-1,1][getRandomInt(0,2)];
    this.erk=1+3*Math.random();		// vary
  }
  this.randomize();
  this.rand2=()=>{
    this.ka=TP*Math.random();
    this.et=(100+200*Math.random())*[-1,1][getRandomInt(0,2)];
    this.erk=1+2*Math.random();
  }
  this.getPath=(r,t)=>{
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
var D=3+3*Math.random();	// vary
var D2=6*Math.random();

var setTile=()=>{
  //r=3.2*CSO*(Math.sin(TP*t/KT));
  let r=circ.erk*2*CSO*(Math.sin(TP*t/KT));
  let p=circ.getPath(r,t);
  ctxo.setLineDash([D*r,D2*r]);
  ctxo.lineWidth=Math.min(r,6);
  ctxo.strokeStyle="#00000014";
  ctxo.stroke(p);
  ctxo.lineWidth=Math.min(r,1);
  ctxo.strokeStyle=color.getRGB();
  ctxo.stroke(p);
}

const Ks=TP*Math.random();
const Ks2=TP*Math.random();

var draw=()=>{
  setTile();
/*
  let f=1+0.3*Math.sin(Ks+to/510);
  let s1=f;
  let s2=(2-s1);
  let f2=1+0.3*Math.sin(Ks2+to/550);
  let ss1=f2;
  let ss2=(2-ss1);
  //let sa=[s1,s2,s2,s1,s1,s2,s2,s1];
  let sa=[s1,s2,ss1,ss2,ss2,ss1,s2,s1];
  //let sa=[ sa4[0],sa4[1],sa4[2],sa4[3],sa4[3],sa4[2],sa4[1],sa4[0] ];
  //let sa=[ sa4[0],2-sa4[0],sa4[1],2-sa4[1],sa4[3],sa4[2],sa4[1],sa4[0] ];
*/

  for (let j=0; j<8; j++) {
    let pry=[1,-1][j%2];
    let yos=((2*j)%4+2*j)*CSO;
    for (let i=0; i<8; i++) {
      let prx=[1,-1][i%2];
      let xos=((2*i)%4+2*i)*CSO;
      //ctx.setTransform(prx*sa[i],0,0,s1,xos,0);
      //ctx.setTransform(prx*sa[i],0,0,pry*sa[j],xos,yos);
ctx.setTransform(prx,0,0,pry,xos,yos);
      ctx.drawImage(ctxo.canvas,0,0);
    }
  }

}

onresize();

start();
