"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
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

var t=0;

var getColors=()=>{
  let c=["black"];
  let colorCount=2;
  let hr=Math.round(60/colorCount);
  //let hue=getRandomInt(0,90,true)+30;
  let hue=getRandomInt(0,360);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-hr,hr);
    let sat=70+getRandomInt(0,31);
    //let lum=40+getRandomInt(0,41);
    //let lum=40+20*Math.pow(Math.cos((hue+60)*TP/360),2);
    let col=(hue+hd)%360;
    let lf=Math.random();
    //let lum=Math.round(30+50*Math.pow(Math.sin((col+90)*TP/360),2));
    let lum=Math.round(50+30*Math.pow(Math.sin((col+90)*TP/360),2));
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+col+","+sat+"%,"+lum+"%)");
  }
  c.splice(getRandomInt(0,c.length+1),0,"black");
  return c;
}

var SS=2;
var speed=10;
//var udms=[];
var udms2=[];

const syma=(()=>{
  let ua=[];
  for (let i=0; i<64; i++) {
    let z=i*TP/64;
    ua.push(new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),0,0]));
  }
  return ua;
})();

var setSymmetries=()=>{
  udms2=[];
  for (let i=0; i<3; i++) udms2.push([8,16,4,2,1][getRandomInt(0,5,true)]);
  let as=udms2.reduce((a,b)=>{ return a+64/b; });
//console.log(as);
  speed=Math.round(1200/as);
console.log(udms2);
}

/*
var setSymmetriesO=()=>{
  const ca=[8,4,16,32,64];
  udms=[];
  //let c=[8,4,16,32,6,12,24][getRandomInt(0,7,true)];
  let c=ca[getRandomInt(0,5,true)];
  let ua=[];
  for (let i=0; i<c; i++) {
    let z=i*TP/c;
    ua.push(new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),0,0]));
  }
  udms.push(ua);
  //let c2=[8,4,16,32,6,12,24][getRandomInt(0,7,true)];
  let c2=ca[getRandomInt(0,5,true)];
  let ua2=[];
  for (let i=0; i<c2; i++) {
    let z=i*TP/c2;
    ua2.push(new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),0,0]));
  }
  udms.push(ua2);
  //let c3=[8,4,16,32,6,12,24][getRandomInt(0,7,true)];
  let c3=ca[getRandomInt(0,5,true)];
  let ua3=[];
  for (let i=0; i<c3; i++) {
    let z=i*TP/c3;
    ua3.push(new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),0,0]));
  }
  udms.push(ua3);
  speed=Math.round(1200/(c+c2+c3));
}
*/

var draw=()=>{
  let path=new Path2D();
  if (Math.random()<0.3) SS=3;
  else if (Math.random()<0.3) SS=1;
  else SS=2;
  for (let i=0; i<speed; i++) {
    let x=SS*Math.round((-CSIZE+2*CSIZE*Math.random())/SS);
    let y=SS*Math.round((-CSIZE+2*CSIZE*Math.random())/SS);
    let p=new Path2D();
    let p2=new Path2D();
    p.rect(x,y,SS,SS);
    p2.rect(y,x,SS,SS);
    for (let px of [p,p2]) {
      for (let s=0; s<64; s+=udms2[i%3]) {
	path.addPath(px,syma[s]);
      }
/* for (let mt of udms[i%3]) { path.addPath(px,mt); } */
    }
  }
  ctx.fillStyle=colors[t%colors.length];
  ctx.fill(path);
}

var colors=getColors();

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    colors=getColors();
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var animate=(ts)=>{
  if (stopped) return;
  t++;
  if (t%400==0) colors=getColors();
  if (t%1000==0) setSymmetries();
  draw();
  requestAnimationFrame(animate);
}

onresize();

//setSymmetries();
udms2=[16,16,16];
start();
