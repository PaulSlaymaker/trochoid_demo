"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const HE=2*Math.tan(TP/12);
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
ctx.translate(CSIZE,CSIZE);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var Circle=function(x,y,r,radius) {
  this.x=x;
  this.y=y;
  this.radius=radius;
  this.a=Math.atan2(y,x);
  this.r=r;
}

var getColors=()=>{
  let c=[];
  let colorCount=3;
  //let hue=getRandomInt(0,90,true)+30;
  let hue=getRandomInt(150,360);
//console.log("hue "+hue);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(160/colorCount)*i+getRandomInt(-8,8);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+",100%,50%)");
  }
  return c;
}

let p8=new Path2D();
p8.arc(0,0,8,0,TP);
let p16=new Path2D();
p16.arc(0,0,16,0,TP);
let p24=new Path2D();
p24.arc(0,0,24,0,TP);
let p32=new Path2D();
p32.arc(0,0,32,0,TP);
let p48=new Path2D();
p48.arc(0,0,48,0,TP);

let counter=0;
let hctr=0;

const rps={8:p8,16:p16,32:p32,48:p48};

const hexInPath=(path,x,y,rad)=>{
  for (let j=0; j<6; j++) {
    let x2=x+HE*rad*Math.cos(j*TP/6);
    let y2=y+HE*rad*Math.sin(j*TP/6);
//    let x2=x+1.18*rad*Math.cos(j*TP/6);	// 1.4 arbitrary
//    let y2=y+1.18*rad*Math.sin(j*TP/6);
    if (ctx.isPointInPath(path,x2+CSIZE,y2+CSIZE)) {
      return true;
    }
  }
  return false;
}

const RP=CSIZE;
var createPointArray=()=>{
  let pointArray=[];
//for (let i=-388; i<389; i+=8) {
//  for (let j=-388; j<389; j+=8) {
for (let i=0; i<RP; i+=8) {
  for (let j=0; j<RP; j+=8) {
    let r=Math.pow(i*i+j*j,0.5);
    if (r<8) continue;
    if (r>RP-8) continue;
    pointArray.push({"x":i,"y":j,"r":r});
  }
}
  return pointArray;
}

var generateCircles=()=>{
  let ca=[];
  let pointArray=createPointArray();
let counter=0;
let hctr=0;
  let dm=new DOMMatrix([1,0,0,1,0,0]);
  let p=new Path2D();
  for (let i=0; i<10000; i++) {
    if (pointArray.length==0) {
//console.log("done "+i);
      ca.sort((a,b)=>{ return a.r-b.r; });
      return ca;
    }
    //let radius=i>20?i>80?20:40:60;
    //let radius=i>40?i>400?i>2000?8:20:40:80;
    //let radius=i>32?i>400?i>2000?8:16:32:48;
    let radius=i>12?i>200?i>2000?8:16:32:48;
    let idx=getRandomInt(0,pointArray.length);
    let x=pointArray[idx].x;
    let y=pointArray[idx].y;

    if (pointArray[idx].r+radius>RP) {
      if (radius==8) pointArray.splice(idx,1);
counter++;
      continue;
    }
    if (x>0 && pointArray[idx].x-radius<0) {
      if (radius==8) pointArray.splice(idx,1);
counter++;
      continue;
    }
    if (y>0 && pointArray[idx].y-radius<0) {
      if (radius==8) pointArray.splice(idx,1);
counter++;
      continue;
    }
    if (ctx.isPointInPath(p,x+CSIZE,y+CSIZE)) {
counter++;
      pointArray.splice(idx,1);
      continue;
    }
    if (hexInPath(p,x,y,radius)) {
      if (radius==8) pointArray.splice(idx,1);
hctr++;
      continue;
    }
    dm.e=x;
    dm.f=y;
    p.addPath(rps[radius],dm);
    ca.push(new Circle(x,y,pointArray[idx].r,radius));
    ca.push(new Circle(x,-y,pointArray[idx].r,radius));
    ca.push(new Circle(-x,y,pointArray[idx].r,radius));
    ca.push(new Circle(-x,-y,pointArray[idx].r,radius));
    pointArray.splice(idx,1);
  }
}

var colorSet=[getColors(),getColors()];

const draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  draw2(1);
  return draw2(0);
}

const draw2=(swp)=>{
  let dm=new DOMMatrix([1,0,0,1,0,0]);
  //let dms=new DOMMatrix([0.5,0,0,0.5,0,0]);
//  let bPath=new Path2D();
  //let gPath=new Path2D();
  let yPath=new Path2D();
  let rPath=new Path2D();
  let paths=[new Path2D(),yPath,rPath];
  let pos={8:rps[8],16:p16,32:p32};
  let dps={8:rPath,16:yPath,32:paths[0]};
  let dcount=0;
  let circleArray=cset[swp];
  for (let i=0; i<circleArray.length; i++) {
    if (circleArray[i].radius==48) { dcount++; continue; }
    if (circleArray[i].t+t>30) {
      if (swp) continue;
      else dm.a=1,dm.d=1,dcount++;
    } else if (circleArray[i].t+t>0) {
      let zc=(t+circleArray[i].t)/30;
      if (swp) zc-=1;
      dm.a=zc,dm.d=zc;
    } else {
      if (swp) dm.a=1,dm.d=1,dcount++;
      else continue;
    }
    dm.e=circleArray[i].x;
    dm.f=circleArray[i].y;
    dps[circleArray[i].radius].addPath(pos[circleArray[i].radius],dm);
/*
//let dmx=dms.multiply(dm);
    if (circleArray[i].radius==8) {
      dps[circleArray[i].radius].addPath(pos[circleArray[i].radius],dm);
      //rPath.addPath(p8,dm);
    } else if (circleArray[i].radius==16) {
      dps[circleArray[i].radius].addPath(pos[circleArray[i].radius],dm);
      //yPath.addPath(p16,dm);
    } else if (circleArray[i].radius==32) {
      gPath.addPath(p32,dm);
    //} else if (ca[i].radius==48) {
    } else {
debugger;
    }
*/
  } 
  for (let p=0; p<3; p++) { 
    ctx.fillStyle=colorSet[swp][p];
    ctx.fill(paths[p]);
  }
  return dcount;
}

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
var t=0;
function animate(ts) {
  if (stopped) return;
  t++;
  if (draw()>=cset[0].length) {
    t=0;
    //sw=++sw%2;
    cset.reverse();
    cset[0]=generateCircles();
    rTimeCircles();
    colorSet.unshift(getColors()), colorSet.pop();
  }
  requestAnimationFrame(animate);
}

onresize();

const speed=2;

var k=12;

var rTimeCircles=()=>{
  k=10+Math.abs(cset[0].length-cset[1].length)/4;
  for (let i=0, j=0; i<cset[0].length; i++) {
    if (i%4==0) j++;
    cset[0][i].t=Math.round((-k-j)*speed);
  }
  //ost=fl?-k:0;
  for (let i=0, j=0; i<cset[1].length; i++) {
    if (i%4==0) j++;
    //cset[1][i].t=Math.round((ost-j)*speed);
    cset[1][i].t=-j*speed;
  }
}

var cset=[generateCircles(),generateCircles()];

rTimeCircles();

//draw2();
start();
