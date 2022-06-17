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
//c.style.outline="0.4px dotted gray";
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

var Circle=function(x,y,radius) {
  this.x=x;
  this.y=y;
  this.radius=radius;
  this.a=Math.atan2(y,x);
  this.r=Math.pow(x*x+y*y,0.5);
}

var getColors=()=>{
  let c=[];
  let colorCount=4;
  //let hue=getRandomInt(0,90,true)+30;
  let hue=getRandomInt(0,360);
  for (let i=0; i<colorCount; i++) {
    //let hd=Math.round(360/colorCount)*i+getRandomInt(-20,20);
    let hd=Math.round(200/colorCount)*i+getRandomInt(-8,8);
    let sat=90+getRandomInt(0,11);
    //let lum=40+getRandomInt(0,21);
    let lum=50;
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}
var colors=getColors();
//var colors2=getColors();
//colors[0]="black";

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,2,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

const WID=32;

ctx.strokeStyle="yellow";

let p8=new Path2D();
p8.arc(0,0,8,0,TP);
let p10=new Path2D();
p10.arc(0,0,10,0,TP);
let p16=new Path2D();
p16.arc(0,0,16,0,TP);
let p20=new Path2D();
p20.arc(0,0,20,0,TP);
let p24=new Path2D();
p24.arc(0,0,24,0,TP);
let p32=new Path2D();
p32.arc(0,0,32,0,TP);
let p40=new Path2D();
p40.arc(0,0,40,0,TP);
let p48=new Path2D();
p48.arc(0,0,48,0,TP);
let p56=new Path2D();
p56.arc(0,0,56,0,TP);
let p60=new Path2D();
p60.arc(0,0,60,0,TP);
let p64=new Path2D();
p64.arc(0,0,64,0,TP);

let counter=0;
let hctr=0;

const rps={8:p8,10:p10,16:p16,32:p32,60:p60,48:p48};

const hexInPath=(path,x,y,rad)=>{
  for (let j=0; j<6; j++) {
    let x2=x+HE*rad*Math.cos(j*TP/6);
    let y2=y+HE*rad*Math.sin(j*TP/6);
//    let x2=x+1.18*rad*Math.cos(j*TP/6);	// 1.4 arbitrary
//    let y2=y+1.18*rad*Math.sin(j*TP/6);
//drawPoint(x2,y2);
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
    if (r>RP) continue;
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
  let dm2=new DOMMatrix([1,0,0,-1,0,0]);
  let p=new Path2D();
  for (let i=0; i<10000; i++) {
    if (pointArray.length==0) {
      console.log("done "+i);
      //ca.sort((a,b)=>{ return a.r-b.r; });
      return ca;
    }
    //let radius=i>20?i>80?20:40:60;
    //let radius=i>40?i>400?i>2000?8:20:40:80;
    //let radius=i>32?i>400?i>2000?8:16:32:48;
    let radius=i>12?i>200?i>2000?8:16:32:48;

/*
    let fd=CSIZE-radius;
    let x=Math.round(fd*(1-2*Math.random()));
    let y=Math.round(fd*(1-2*Math.random()));
*/
let idx=getRandomInt(0,pointArray.length);
let x=pointArray[idx].x;
let y=pointArray[idx].y;

if (pointArray[idx].r+radius>RP) {
  if (radius==8) pointArray.splice(idx,1);
  continue;
}

if (x>0 && pointArray[idx].x-radius<0) {
  if (radius==8) pointArray.splice(idx,1);
  continue;
}

if (y>0 && pointArray[idx].y-radius<0) {
  if (radius==8) pointArray.splice(idx,1);
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
    ca.push(new Circle(x,y,radius));
    ca.push(new Circle(x,-y,radius));
    ca.push(new Circle(-x,y,radius));
    ca.push(new Circle(-x,-y,radius));
    pointArray.splice(idx,1);
  }
console.log(counter+" "+hctr);
debugger;
  return ca;
}

var sw=0;

const draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  draw2(1);
  return draw2(0);
//  return draw2(sw);
}

const draw2=(swp)=>{
//ctx.fillStyle="#00000008";
//ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let dm=new DOMMatrix([1,0,0,1,0,0]);
  let dms=new DOMMatrix([0.5,0,0,0.5,0,0]);
//  let bPath=new Path2D();
  let gPath=new Path2D();
  let yPath=new Path2D();
  let rPath=new Path2D();
  let paths=[gPath,yPath,rPath];
  let pos={8:p8,16:p16,32:p32};
  let dps={8:rPath,16:yPath,32:p32};
//  let sfx=(4+Math.sin(3*TP/4+t/23))/3;
//  let sfy=(4+Math.sin(3*TP/4+t/22))/3;
  let dcount=0;
  //let circleArray=cset[sw];
  let circleArray=cset[swp?1:0];
  for (let i=0; i<circleArray.length; i++) {
    if (circleArray[i].radius==48) { dcount++; continue; }
    let pth=new Path2D();
    //dm.e=(ca[i].r+100*Math.pow(Math.sin(ca[i].a/2+t/40),2))*Math.cos(ca[i].a+t/120);
    //dm.f=(ca[i].r+100*Math.pow(Math.sin(ca[i].a/2+t/40),2))*Math.sin(ca[i].a+t/120);
//    dm.e=(ca[i].r+200*Math.pow(Math.sin(ca[i].a+t/100),2)*Math.pow(Math.sin(t/80),2))*Math.cos(ca[i].a);
//    dm.f=(ca[i].r+200*Math.pow(Math.sin(ca[i].a+t/100),2)*Math.pow(Math.sin(t/80),2))*Math.sin(ca[i].a);
    //dm.e=(ca[i].r+200*Math.pow(Math.sin(t/80),2))*Math.cos(ca[i].a);
    //dm.f=(ca[i].r+200*Math.pow(Math.sin(t/80),2))*Math.sin(ca[i].a);
    //dm.e=ca[i].r*Math.cos(ca[i].a);
    //dm.f=ca[i].r*Math.sin(ca[i].a);
    //dm.e=ca[i].r*(2+Math.sin(t/20))*Math.cos(ca[i].a);
    //dm.f=ca[i].r*(2+Math.sin(t/20))*Math.sin(ca[i].a);
    //dm.f=ca[i].r*(Math.sin(ca[i].a+t/20));
    //dm.e=ca[i].x+40*(2+Math.cos(ca[i].x/400+t/20));
    //dm.f=ca[i].y+40*(2+Math.sin(ca[i].x/400+t/20));
//    let x=ca[i].radius*Math.sin(t/23)*Math.cos(ca[i].a);
//    let y=ca[i].radius*Math.sin(t/23);


if (circleArray[i].t+t>30) {
if (swp) {
   continue;
} else {
    dm.a=1;
    dm.d=1;
    dcount++;
}


    //dm.a=(RP-ca[i].r)/RP;
    //dm.d=(RP-ca[i].r)/RP;
    //dm.a=0.5;	// scale matrix.mult(loc matrix
    //dm.d=0.5;
} else if (circleArray[i].t+t>0) {
    let zc=(t+circleArray[i].t)/30;
if (swp) zc=1-(t+circleArray[i].t)/30;


    dm.a=zc;
    dm.d=zc;
} else {

  if (swp) {
      dm.a=1;
      dm.d=1;
    dcount++;
  } else {
    continue;
  }

}
    dm.e=circleArray[i].x;
    dm.f=circleArray[i].y;

// for (let i=0; i<4; i++) { //use 1/4 ca.length, rotate

//let dmx=dms.multiply(dm);
    if (circleArray[i].radius==8) {
      rPath.addPath(p8,dm);
    } else if (circleArray[i].radius==16) {
      yPath.addPath(p16,dm);
    } else if (circleArray[i].radius==32) {
      gPath.addPath(p32,dm);
    } else if (ca[i].radius==48) {
debugger;
//      bPath.addPath(p48,dm);
    }
//    dcount++;
  } 
//  colx=colorSet[sw];
  for (let p=0; p<4; p++) { 
    ctx.fillStyle=colors[p];
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
  //if (draw2()) {
let dc=draw();
  //if (dc==cset[sw].length) {
  if (dc>=cset[0].length) {
    t=0;
    sw=++sw%2;
//console.log(dc+" "+cset[0].length);
    cset.reverse();

if (cset[0].name=="ca2") {
  ca=generateCircles();
  cset[0]=ca;
} else {
  ca2=generateCircles();
  ca2.name="ca2";
  cset[0]=ca2;
}
rTimeCircles(sw);
//    colors=getColors();
  } else {
//    t=0;
//    stopped=true;
  }
//if (t>tmax) stopped=true;
  requestAnimationFrame(animate);
}

onresize();

const speed=1;

var rTimeCircles=(fl)=>{
  //ca.sort((a,b)=>{ return a.r+a.radius-b.r-b.radius; });
let cax1=cset[0];
let cax2=cset[1];
  cax1.sort((a,b)=>{ return a.r-b.r; });
  cax2.sort((a,b)=>{ return a.r-b.r; });	// this sort redundant, except initial run
  let k=10+Math.abs(ca.length-ca2.length)/8;
//console.log("k "+k);
  //let ost=fl?0:-k;
  //let ost=(speed1>speed2)?0:-k;
  let ost=-k;
let speed1=speed*ca2.length/ca.length;
let speed2=speed*ca.length/ca2.length;
  for (let i=0, j=0; i<cax1.length; i++) {
    if (i%4==0) j++;
    //ca[i].t=ost-j*speed1;
    cax1[i].t=Math.round((ost-j)*speed);
  }
  //ost=fl?-k:0;
  ost=0;
  for (let i=0, j=0; i<cset[1].length; i++) {
    if (i%4==0) j++;
    //ca2[i].t=ost-j*speed;
    //ca2[i].t=ost-Math.round(j*speed2);
    //cset[1][i].t=Math.round((ost-j)*speed);
    cset[1][i].t=-j*speed;
  }
//console.log(cax1.length+" "+cax2.length);
//console.log(fl+" "+cset[0][0].t+" "+cset[1][0].t);
}

var ca=generateCircles();
var ca2=generateCircles();
ca2.name="ca2";
var cset=[ca,ca2];
//var tmax=ca.length/4*speed+48;

rTimeCircles(sw);

//draw2();
start();
