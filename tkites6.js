"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/eYQYZVM
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const CSIZE=400;
const CSO=52;

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

const ctxo=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSO;
  return c.getContext("2d");
})();
ctxo.setTransform(1,0,0,1,CSO,CSO);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var sq=2*CSO;
let pixd=ctx.createImageData(sq,sq); 
for (let i=0; i<sq*sq; i++) pixd.data[i*4+3]=255;

var rm=2*getRandomInt(1,6,true);
var gm=2*getRandomInt(1,6,true);
var bm=2*getRandomInt(1,6,true);
var rk1=200+200*Math.random();
var rk2=TP*Math.random();
var rk3=200+200*Math.random();
var gk1=200+200*Math.random();
var gk2=TP*Math.random();
var gk3=200+200*Math.random();
var bk1=200+200*Math.random();
var bk2=TP*Math.random();
var bk3=200+200*Math.random();

var colors=[255,255,255];
var setColor=[
  ()=>{ 
    rm=2*getRandomInt(1,7,true); 
    rk1=200+200*Math.random();
    rk2=TP*Math.random();
    rk3=200+200*Math.random();
  },
  ()=>{ 
    gm=2*getRandomInt(1,7,true); 
    gk1=200+200*Math.random();
    gk2=TP*Math.random();
    gk3=200+200*Math.random();
  },
  ()=>{ 
    bm=2*getRandomInt(1,7,true); 
    bk1=200+200*Math.random();
    bk2=TP*Math.random();
    bk3=200+200*Math.random();
  },
];

var setImageData=()=>{
  let ro=TP*Math.sin(t/rk1+rk2);
  let go=TP*Math.sin(t/gk1+gk2);
  let bo=TP*Math.sin(t/bk1+bk2);
  let rf=40+300*Math.pow(Math.sin(t/rk3),2);
  let gf=40+300*Math.pow(Math.sin(t/gk3),2);
  let bf=40+300*Math.pow(Math.sin(t/bk3),2);
  let shft=CSO*Math.sin(t/500);
  let red=64+colors[0]-64;
  let grn=64+colors[1]-64;
  let blu=64+colors[2]-64;
  for (let i=0; i<sq; i++) {
    for (let j=0; j<sq; j++) {
      let x=j-sq/2+shft;
      let y=i-sq/2-shft;
      let r=Math.pow(x*x+y*y,0.5);
      let a=Math.atan2(y,x);
      pixd.data[(i*4*sq)+j*4]  =Math.round(red*Math.pow(Math.sin(TP*r/rf+ro)*Math.cos(rm*a),2));
      pixd.data[(i*4*sq)+j*4+1]=Math.round(grn*Math.pow(Math.sin(TP*r/gf+go)*Math.cos(gm*a),2));
      pixd.data[(i*4*sq)+j*4+2]=Math.round(blu*Math.pow(Math.sin(TP*r/bf+bo)*Math.cos(bm*a),2));
    }
  }
  return pixd;
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var t=0;
var cchange;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  if (cchange!=undefined) {
    if (t%1000<256) {
      colors[cchange]--;
    } else if (t%1000==256) {
      setColor[cchange]();
    } else if (t%1000<512) {
      colors[cchange]++;
    } else {
      cchange=undefined;
    }
  }
  if (t%1000==0) {
    cchange=getRandomInt(0,3);
  }
  draw();
  requestAnimationFrame(animate);
}

const S6=Math.sin(TP/6);
const tta=[0,0.5,S6,1,S6,0.5,0,-0.5,-S6,-1,-S6,-0.5];
const ttb=[0,1,2,2,2,1,0,-1,-2,-2,-2,-1];

var drawTiles=()=>{
  for (let i=0; i<12; i+=2) {
    let a1=(i+4)%12, a2=(i+1)%12, a3=(i+5)%12, a4=(i+2)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],CSIZE,CSIZE);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+4)%12, a2=(i+1)%12, a3=(i+3)%12, a4=(i+0)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],CSIZE,CSIZE);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+2)%12, a2=(i+5)%12, a3=(i+6)%12, a4=(i+9)%12;
    let b1=(i+1)%12, b2=(i+0)%12, b3=(i+3)%12, b4=(i+4)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],
      CSIZE+(ttb[b1]+ttb[b2]*S6)*CSO,CSIZE+(ttb[b3]+ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+9)%12, a3=(i+5)%12, a4=(i+8)%12;
    b1=(i+3)%12, b2=(i+4)%12, b3=(i+7)%12, b4=(i+6)%12;
    ctx.setTransform(tta[a1],tta[i],tta[a3],tta[a4],
      CSIZE+(ttb[b1]+ttb[b2]*S6)*CSO,CSIZE+(ttb[b3]+ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+3)%12, a4=(i+9)%12;
    b1=(i+8)%12, b2=(i+7)%12, b3=(i+4)%12, b4=(i+5)%12;
    ctx.setTransform(tta[a1],tta[i],tta[i],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+6)%12, a2=(i+3)%12, a3=(i+3)%12;
    b1=(i+5)%12, b2=(i+4)%12, b3=(i+1)%12, b4=(i+2)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[i],
      CSIZE+(ttb[b1]+ttb[b2]*S6)*CSO,CSIZE+(ttb[b3]+ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+2)%12, a2=(i+5)%12, a4=(i+3)%12;
    b1=(i+4)%12, b2=(i+5)%12, b3=(i+8)%12, b4=(i+7)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[i],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+5)%12, a2=(i+2)%12, a3=(i+7)%12, a4=(i+4)%12;
    b1=(i+10)%12, b2=(i+9)%12, b3=(i+6)%12, b4=(i+7)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+2)%12, a2=(i+11)%12, a3=(i+7)%12, a4=(i+4)%12;
    b1=(i+4)%12, b2=(i+5)%12, b3=(i+2)%12, b4=(i+1)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
    a1=(i+2)%12, a2=(i+5)%12, a3=(i+7)%12, a4=(i+10)%12;
    b1=(i+4)%12, b2=(i+5)%12, b3=(i+8)%12, b4=(i+7)%12;
    ctx.setTransform(tta[a1],tta[a2],tta[a3],tta[a4],
      CSIZE+(1.5*ttb[b1]+2*ttb[b2]*S6)*CSO,CSIZE+(1.5*ttb[b3]+2*ttb[b4]*S6)*CSO);
    ctx.drawImage(ctxo.canvas,0,0);
  }
}

var draw=()=>{
  setImageData();
  ctxo.clearRect(-CSO,-CSO,2*CSO,2*CSO);
  ctxo.putImageData(pixd,0,0);
  drawTiles();
}

onresize();

start();
