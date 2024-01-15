"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/details/VwRZdao
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
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);

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
    this.RK3=1+6*Math.random();
    this.GK3=1+6*Math.random();
    this.BK3=1+6*Math.random();
    this.fr=1-Math.pow(Math.random(),3);
    this.fg=1-Math.pow(Math.random(),3);
    this.fb=1-Math.pow(Math.random(),3);
  }
  this.randomize=()=>{
    this.RK1=60+60*Math.random();
    this.GK1=60+60*Math.random();
    this.BK1=60+60*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.randomizeF();
  }
  this.randomize();
}

var color=new Color();

var drawPoint=(x,y,col,rp)=>{	// diag
  let r=rp?rp:3;
  ctx.beginPath();
  ctx.arc(x,y,r,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

/*
var V=4;
var setQuads=()=>{
  for (let i=1; i<qba.length; i++) {
    //let f=(i%2)?frac:1-frac;
//    let f=frac;
    let f=qba[i].t/dur;
    if (qba[i].dir) f=1-f;
    for (let j=0; j<V; j++) {
      let j2=(j+1)%V;
      qba[i].pa[j].x=(1-f)*qba[i-1].pa[j].x+f*qba[i-1].pa[j2].x;
      qba[i].pa[j].y=(1-f)*qba[i-1].pa[j].y+f*qba[i-1].pa[j2].y;
    }
  }
}
*/

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var pauseTS=1000;
var pause=(ts)=>{
  if (stopped) return;
if (EM) stopped=true;
  if (ts<pauseTS) requestAnimationFrame(pause);
  else requestAnimationFrame(animate);
}

var stopped=true;
var t=200;
var frac=0;
var dur=1200;
function animate(ts) {
  if (stopped) return;
  t++;
  draw();
  if (t%1500==0) {
    color.randomize();
    K1=2*getRandomInt(0,4,true)+1;
    K2=2*getRandomInt(0,4,true)+1;
    K3=2*getRandomInt(0,4,true)+1;
    K4=2*getRandomInt(0,4,true)+1;
    D1=[-1,1][getRandomInt(0,2)];
    D2=[-1,1][getRandomInt(0,2)];
    D3=[-1,1][getRandomInt(0,2)];
//console.log(K1,K2,K3,K4);
//console.log(D1,D2,D3);
if (t>=KT) t=0;
      pauseTS=performance.now()+3600;
    requestAnimationFrame(pause);
//stopped=true;
  } else 
  requestAnimationFrame(animate);
if (EM && t==747) stopped=true;
}

var K1=2*getRandomInt(0,4,true)+1;
var K2=2*getRandomInt(0,4,true)+1;
var K3=2*getRandomInt(0,4,true)+1;
var K4=2*getRandomInt(0,4,true)+1;
var D1=[-1,1][getRandomInt(0,2)];
var D2=[-1,1][getRandomInt(0,2)];
var D3=[-1,1][getRandomInt(0,2)];
//console.log(K1,K2,K3,K4);
//console.log(D1,D2,D3);

const KT=3000;

var draw=()=>{
  let z=TP*t/KT;
  let r=CSIZE*(1-Math.cos(z))/2;
  let c1=Math.pow(Math.cos(D1*z),K1);
//let c1=0.6*Math.cos(z)+0.4*Math.cos(3*z);
  let c2=Math.pow(Math.sin(D3*z),K2);
  let c3=-Math.pow(Math.sin(D3*z),K3);
  let c4=Math.pow(Math.cos(D2*z),K4);
  ctx.setTransform(c1,c2,c3,c4,CSIZE,CSIZE);

  ctx.lineWidth=9;
  ctx.strokeStyle="#0000001C";
  ctx.strokeRect(-r,-r,2*r,2*r);
  ctx.lineWidth=4;
  ctx.strokeStyle=color.getRGB();
  ctx.strokeRect(-r,-r,2*r,2*r);

/*
ctx.lineDashOffset=2*r;
  ctx.lineWidth=8;
  ctx.strokeStyle="#0000001C";
  ctx.strokeRect(-r,-r,2*r,2*r);
  ctx.lineWidth=3;
  ctx.strokeStyle=colors[1].getRGB();
  ctx.strokeRect(-r,-r,2*r,2*r);
*/
}

onresize();

start();
