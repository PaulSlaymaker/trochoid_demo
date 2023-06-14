"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/QWJLBVz
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;
const BW=160;
const BH=4;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();

const ctxo=(()=>{
  let c=document.createElement("canvas");
  c.width=BW;
  c.height=4;
  return c.getContext("2d");
})();

const ctxo2=(()=>{
  let c=document.createElement("canvas");
  c.width=BW+2;
  c.height=8;
  return c.getContext("2d");
})();

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

const pixd=ctx.createImageData(BW,100*BH); 
for (let i=0; i<BW*100*BH; i++) pixd.data[i*4+3]=255;
const pixs=ctx.createImageData(BW+4,12); 
for (let i=0; i<(BW+4)*(12); i++) pixs.data[i*4+3]=27;

var setImageData=()=>{
  let csr1=[0,32,64][getRandomInt(0,3)];
  let csr2=[191,223,255][getRandomInt(0,3)]-csr1;
  let csg1=[0,32,64][getRandomInt(0,3)];
  let csg2=[191,223,255][getRandomInt(0,3)]-csg1;
  let csb1=[0,32,64][getRandomInt(0,3)];
  let csb2=[191,223,255][getRandomInt(0,3)]-csb1;
  let ro=TP*Math.random();
  let go=TP*Math.random();
  let bo=TP*Math.random();
  let rf=(200+300*Math.random())*[-1,1][getRandomInt(0,2)];
  let gf=(200+300*Math.random())*[-1,1][getRandomInt(0,2)];
  let bf=(200+300*Math.random())*[-1,1][getRandomInt(0,2)];
//console.log(rf.toFixed(0),gf.toFixed(0),bf.toFixed(0));
  let rf2=(200+300*Math.random())*[-1,1][getRandomInt(0,2)];
  let gf2=(200+300*Math.random())*[-1,1][getRandomInt(0,2)];
  let bf2=(200+300*Math.random())*[-1,1][getRandomInt(0,2)];
//console.log(rf2.toFixed(0),gf2.toFixed(0),bf2.toFixed(0));
  for (let i=0; i<BW; i++) {
    for (let j=0; j<100*BH; j++) {
      //let red=Math.round(csr1+csr2*Math.pow(Math.sin(TP*i/rf+ro+TP*j/rf2),2));
      //let green=Math.round(csg1+csg2*Math.pow(Math.sin(TP*i/gf+ro+TP*j/gf2),2));
      let blue=Math.round(csb1+csb2*Math.pow(Math.sin(TP*i/bf+ro+TP*j/bf2),2));
      pixd.data[(i*4)+j*4*BW]  =Math.round(csr1+csr2*Math.pow(Math.sin(TP*i/rf+ro+TP*j/rf2),2));
      pixd.data[(i*4)+j*4*BW+1]=Math.round(csg1+csg2*Math.pow(Math.sin(TP*i/gf+ro+TP*j/gf2),2));
      pixd.data[(i*4)+j*4*BW+2]=blue;
    }
  }
}
setImageData();

// flip half-image?
//var ixgd=getImageData();
//ctx.putImageData(pixd,0,0);	// diag

var F1,F2,F3,F4,dur,durc=400;
var DC={"4":800,"5":1000,"6":1200,"7":1400,"8":1600,"10":2000,"11":2200,"12":2400,"13":2600,"14":2800,
        "15":3000,"16":3200,"17":3400,"18":1800,"19":1900,"20":2000,"21":2100,"22":2200,"23":2300,
        "24":2400,"25":2500,"26":2600,"27":2700,"28":2800,"29":2900,"30":3000,"31":3100,"32":1600,
        "33":3300,"34":1700,"35":3500,"36":1800,"37":3700,"38":1900,"39":3900,"40":2000,"41":4100,
        "42":2100,"43":4300,"44":2200,"45":1500,"46":2300,"47":4700,"48":1600,"49":700,"50":2500,
        "51":1700,"52":2600};
//var durc;//=DC[dur/400];

var reset=()=>{
  setImageData();
/*
  let fa=[7,5,9,3,11,1,13];
  F1=fa[getRandomInt(0,7,true)];
  F2=fa[getRandomInt(0,7,true)];
  F3=fa[getRandomInt(0,7,true)];
  F4=fa[getRandomInt(0,7,true)];
*/
  F1=getRandomInt(1,14);
  F2=getRandomInt(1,14);
  F3=getRandomInt(1,14);
  F4=getRandomInt(1,14);
//F1=3,F2=5,F3=5,F4=3;
  dur=(F1+F2+F3+F4)*400;
  durc=DC[dur/400];
//console.log("durc "+durc);
//console.log(F1,F2,F3,F4);
//console.log(F1+F2+F3+F4);
}
reset();

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

var t=-1;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  if (t<Math.round(dur/4)) draw();
  if (t>dur/4+400) {
    ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
    ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    reset();
    t=-1;
    ctx.canvas.style.opacity=1;
  } else if (t>Math.round(dur/4+200)) {
    ctx.canvas.style.opacity=1-(t-dur/4-200)/200;
if (EM) stopped=true;
  }

  requestAnimationFrame(animate);
}

onresize();

/*
var drawPath=()=>{	// diag
  ctx.beginPath();
  ctx.moveTo(340,0);
  for (let i=0; i<400; i++) {
    let z=i*TP/400;
    let x=340*(Math.cos(F1*z)/2+Math.cos(F2*z)/2);
    let y=340*(Math.sin(F3*z)/2+Math.sin(F4*z)/2);
    ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.strokeStyle="#333300";
  ctx.stroke();
}
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
drawPath();
*/

ctxo2.putImageData(pixs,0,0);

var brush=()=>{ 
  ctx.drawImage(ctxo2.canvas,-82,-4,164,12);
  ctx.drawImage(ctxo.canvas,-BW/2,-BH/2,BW,BH); 
}

var draw=()=>{
//ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
//ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let a=TP*t/dur;
  let wf2=Math.sin(TP*t/durc);
  let x=wf2*320*(Math.cos(F1*a)/2+Math.cos(F2*a)/2);
  let y=wf2*320*(Math.sin(F3*a)/2+Math.sin(F4*a)/2);
  let bh=-396*4*t/dur;
  ctxo.putImageData(pixd,0,bh);
  
/*
  let wf=1;//Math.sin(TP*t/400);
  x*=wf2;
  y*=wf2;
  let dw=BW*wf;
  let dw2=(BW+4)*wf;
  let brush=()=>{ 
    //ctx.drawImage(ctxo2.canvas,-dw2/2,-(BH+4)/2,dw2,12);
    //ctx.drawImage(ctxo.canvas,-dw/2,-4/2,dw,4); 
    ctx.drawImage(ctxo2.canvas,-82,-4,164,12);
    ctx.drawImage(ctxo.canvas,-80,-2,160,4); 
  }
*/
  let ap=TP/4+Math.atan2(-F3*Math.cos(F3*a)/2-F4*Math.cos(F4*a)/2,F1*Math.sin(F1*a)/2+F2*Math.sin(F2*a)/2);
  let strc=wf2*Math.cos(ap);
  let strs=wf2*Math.sin(ap);
  ctx.setTransform(strc,strs,-strs,strc,x+CSIZE,y+CSIZE);
  brush();
  ctx.setTransform(-strc,strs,strs,strc,-x+CSIZE,y+CSIZE);
  brush();
  ctx.setTransform(strc,-strs,-strs,-strc,x+CSIZE,-y+CSIZE);
  brush();
  ctx.setTransform(-strc,-strs,strs,-strc,-x+CSIZE,-y+CSIZE);
  brush();
}

start();
