"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/WNMOXZK
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
//c.style.outline="1px solid #444";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var wid=10;
var ratio=0.7;

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var A=getRandomInt(160,320);
var B=getRandomInt(130,260);
var C=getRandomInt(100,200);
var D=getRandomInt(80,160);
var E=getRandomInt(60,120);
var F=getRandomInt(40,80);
var G=getRandomInt(30,60);
var H=getRandomInt(20,40);
var I=getRandomInt(16,32);
var J=getRandomInt(12,24);
var roa=TP*Math.random();
var rob=TP*Math.random();
var stopped=true;
var t=0;
function animate(ts) {
  if (stopped) return;
  t++;
  ratio=0.5+0.3*Math.sin(t/600);
  setDimensions();
  a1=TP*Math.sin(t/A+roa);
  a2=TP*Math.sin(t/B+rob);
  a3=TP*Math.sin(t/C);
  a4=TP*Math.sin(t/D);
  a5=TP*Math.sin(t/E);
  a6=TP*Math.sin(t/F);
  a7=TP*Math.sin(t/G);
  a8=TP*Math.sin(t/H);
  a9=TP*Math.sin(t/I);
  a10=TP*Math.sin(t/J);
  draw();
  requestAnimationFrame(animate);
}

/*
var huex=getRandomInt(0,360);
var hues=[];
var getHues=()=>{
  let h=[];
  let hueCount=3;
  let hr=Math.round(90/hueCount);
  let hue=getRandomInt(-20,20);
  for (let i=0; i<hueCount; i++) {
    let hd=(hue+Math.round(240/hueCount)*i+getRandomInt(-hr,hr))%360;
    h.splice(getRandomInt(0,h.length+1),0,hd);
  }
  return h;
}
*/

var colors=new Array(3);
var dcolors=new Array(3);
var getColors=(dark)=>{
  let c=[];
  let colorCount=3;
  let hue=getRandomInt(0,90,true)+30;
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-20,20);
    let sat=90+getRandomInt(0,11);
    let lum=(dark?10:50)+getRandomInt(0,21);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}

ctx.lineWidth=wid;

var a1=0,a2=0,a3=0,a4=0,a5=0,a6=0,a7=0,a8=0,a9=0,a10=0;

var ra=[];
var xa=[];
const COUNT=11;
var setDimensions=()=>{
  ra=[];
  xa=[];
  for (let i=0; i<COUNT; i++) {
    let f=Math.pow(ratio,i);
    if (2*wid-f*CSIZE>0) break;
    ra.push(f*CSIZE-wid);	
    xa.push((1-f)*CSIZE-(2*i-1)*wid/2);
  }
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let pa=[];
  let dmr= new DOMMatrix([Math.cos(a1),Math.sin(a1),-Math.sin(a1),Math.cos(a1),0,0])
  let dmr2=new DOMMatrix([Math.cos(a2),Math.sin(a2),-Math.sin(a2),Math.cos(a2),0,0])
  let dmr3=new DOMMatrix([Math.cos(a3),Math.sin(a3),-Math.sin(a3),Math.cos(a3),0,0])
  let dmr4=new DOMMatrix([Math.cos(a4),Math.sin(a4),-Math.sin(a4),Math.cos(a4),0,0])
  let dmr5=new DOMMatrix([Math.cos(a5),Math.sin(a5),-Math.sin(a5),Math.cos(a5),0,0])
  let dmr6=new DOMMatrix([Math.cos(a6),Math.sin(a6),-Math.sin(a6),Math.cos(a6),0,0])
  let dmr7=new DOMMatrix([Math.cos(a7),Math.sin(a7),-Math.sin(a7),Math.cos(a7),0,0])
  let dmr8=new DOMMatrix([Math.cos(a8),Math.sin(a8),-Math.sin(a8),Math.cos(a8),0,0])
  let dmr9=new DOMMatrix([Math.cos(a9),Math.sin(a9),-Math.sin(a9),Math.cos(a9),0,0])
  let dmr10=new DOMMatrix([Math.cos(a10),Math.sin(a10),-Math.sin(a10),Math.cos(a10),0,0])
  let idm=new DOMMatrix([1,0,0,1,0,0]);
  for (let i=0; i<xa.length; i++) {
    let dp=new DOMPoint();
/*
    if (i==11) {
      let x11=xa[11]-xa[10];
      dp=dp.matrixTransform(new DOMMatrix([1,0,0,1,x11,0]));
      dp=dp.matrixTransform(dmr11);
    }
*/
    if (i>9) { idm.e=xa[10]-xa[9]; dp=dp.matrixTransform(dmr10.multiply(idm)); }
    if (i>8) { idm.e=xa[9]-xa[8]; dp=dp.matrixTransform(dmr9.multiply(idm)); }
    if (i>7) { idm.e=xa[8]-xa[7]; dp=dp.matrixTransform(dmr8.multiply(idm)); }
    if (i>6) { idm.e=xa[7]-xa[6]; dp=dp.matrixTransform(dmr7.multiply(idm)); }
    if (i>5) { idm.e=xa[6]-xa[5]; dp=dp.matrixTransform(dmr6.multiply(idm)); }
    if (i>4) { idm.e=xa[5]-xa[4]; dp=dp.matrixTransform(dmr5.multiply(idm)); }
    if (i>3) { idm.e=xa[4]-xa[3]; dp=dp.matrixTransform(dmr4.multiply(idm)); }
    if (i>2) { idm.e=xa[3]-xa[2]; dp=dp.matrixTransform(dmr3.multiply(idm)); }
    if (i>1) { idm.e=xa[2]-xa[1]; dp=dp.matrixTransform(dmr2.multiply(idm)); }
    if (i>0) {
      idm.e=xa[1];
      dp=dp.matrixTransform(idm);
    } else {
      idm.e=xa[0];
      dp=dp.matrixTransform(idm);
    }
    dp=dp.matrixTransform(dmr);
    let p=new Path2D();
    p.arc(dp.x,dp.y,ra[i],0,TP);
    pa[i]=p;
  }
  for (let i=0; i<pa.length; i++) {
    ctx.fillStyle=dcolors[i%dcolors.length];
    ctx.fill(pa[i]);
    ctx.strokeStyle=colors[i%colors.length];
    ctx.stroke(pa[i]);
  }
}

onresize();

colors=getColors();
dcolors=getColors(true);

start();
