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
c.style.outline="1px dotted gray";
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

var Circle=function(x,y,r,radius,path) {
  this.x=x;
  this.y=y;
  this.radius=radius;
//  this.a=Math.atan2(y,x);
  this.r=r;
//  this.path=path;
}

var getColors=()=>{
  let c=[];
  let colorCount=4;
  let hue=getRandomInt(150,360);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(240/colorCount)*i+getRandomInt(-8,8);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+",100%,50%)");
  }
  return c;
}

const radii=[8,20,40,72];

const rps={};	// radii paths
for (let i of radii) {
  rps[i]=new Path2D();
  rps[i].arc(0,0,i,0,TP);
}

const hexInPath=(path,x,y,rad)=>{
  for (let j=0; j<6; j++) {
    let x2=x+HE*rad*Math.cos(j*TP/6);
    let y2=y+HE*rad*Math.sin(j*TP/6);
    if (ctx.isPointInPath(path,x2+CSIZE,y2+CSIZE)) {
      return true;
    }
  }
  return false;
}

const RP=CSIZE-100;
var createPointArray=()=>{
  let pointArray=[];
  for (let i=0; i<RP; i+=8) {
    for (let j=0; j<RP; j+=8) {
      let r=Math.pow(i*i+j*j,0.5);
      if (r<8) continue;
      if (r>RP-8) continue;
      pointArray.splice(getRandomInt(0,pointArray.length+1),0,{"x":i,"y":j,"r":r});
    }
  }
  return pointArray;
}

var generateCircles=()=>{
  let pointArray=createPointArray();
  let ca=[];
//  let pointArray=createPointArray();
//let counter=0;
//let hctr=0;
  let dm=new DOMMatrix([1,0,0,1,0,0]);
  let p=new Path2D();
  let idx=0;
//let radii=[8,16,40,72];
let ri=3;
  for (let i=0; i<80000; i++) {
    if (pointArray.length==0) {
console.log("done "+i);
      ca.sort((a,b)=>{ return a.r-b.r; });
      return ca;
    }
    if (idx>100) {
//console.log(pointArray.length);
      ri=Math.max(0,--ri);
      idx=0;
    }
    let radius=radii[ri];
//    let idx=getRandomInt(0,pointArray.length);
    let x=pointArray[idx].x;
    let y=pointArray[idx].y;
    if (pointArray[idx].r+radius>RP) {
      if (ri==0) {
        pointArray.splice(idx,1);
        idx=0;
      } else idx++;
      continue;
    }
    //if (x>0 && x-radius<0) {
    if (x<radius) {
      if (ri==0) {
        pointArray.splice(idx,1);
        idx=0;
      } else idx++;
      continue;
    }
    //if (y>0 && y-radius<0) {
    if (y-radius<0) {
      if (ri==0) {
        pointArray.splice(idx,1);
        idx=0;
      } else idx++;
      continue;
    }
    if (ctx.isPointInPath(p,x+CSIZE,y+CSIZE)) {
      pointArray.splice(idx,1);
      idx=0;
      continue;
    }
    if (hexInPath(p,x,y,radius)) {
      if (ri==0) {
        pointArray.splice(idx,1);
        idx=0;
      } else idx++;
      continue;
    }
    dm.e=x;
    dm.f=y;
    p.addPath(rps[radius],dm);
/*
    //ca.push(new Circle(x,y,pointArray[idx].r,radius,rps[radius]));
    //ca.push(new Circle(x,-y,pointArray[idx].r,radius,rps[radius]));
    //ca.push(new Circle(-x,y,pointArray[idx].r,radius,rps[radius]));
    //ca.push(new Circle(-x,-y,pointArray[idx].r,radius,rps[radius]));
*/
    ca.push(new Circle(x,y,pointArray[idx].r,radius));
    ca.push(new Circle(x,-y,pointArray[idx].r,radius));
    ca.push(new Circle(-x,y,pointArray[idx].r,radius));
    ca.push(new Circle(-x,-y,pointArray[idx].r,radius));
    //pointArray.splice(idx,1);
//pax.push(pointArray.splice(idx,1)[0]);
idx=0;
  }
console.log("notdone");
return ca;
}

//var colorSet=[getColors(),getColors()];
var colors=getColors();

/*
const draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  draw2(1);
  return draw2(0);
}
*/

var hue=getRandomInt(200,300);

const draw2=()=>{
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
ctx.fillStyle="#0000000F";
ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let dm=new DOMMatrix([1,0,0,1,0,0]);
  let paths=[new Path2D(),new Path2D(),new Path2D(),new Path2D];
  //let drawPaths={8:paths[0],16:paths[1],40:paths[2],72:paths[3]};
  let dcount=0;
  let circleArray=ca;
  //for (let i=0; i<circleArray.length; i++) {
  for (let i=0; i<92; i++) {
//    let f=Math.pow(Math.sin(t/200),2);
    let dp=new Path2D();
    let r=(1-f)*circleArray[i].radius+f*ca2[i].radius;
    //dp.arc(0,0,r,0,TP);
    //r*=0.2+0.8*Math.pow(Math.cos(TP*f/2),2);
    //r*=0.2+0.8*Math.pow(Math.cos(TP*f/2),2);
    r=Math.max(3,r*Math.pow(Math.cos(TP*f/2),2));
    //if (circleArray[i].radius==72) { dcount++; continue; }
    //dm.e=circleArray[i].x;
    //dm.f=circleArray[i].y;
    dm.e=(1-f)*circleArray[i].x+f*ca2[i].x;
    dm.f=(1-f)*circleArray[i].y+f*ca2[i].y;
    let sf=1+1.3*Math.pow(Math.sin(TP*f/2),2);
dm.e*=sf;
dm.f*=sf;
    dp.arc(dm.e,dm.f,r,0,TP);
//console.log(Math.trunc(i/4));
//    paths[Math.trunc(i/4)%4].addPath(dp,dm);
    //drawPaths[circleArray[i].radius].addPath(dp,dm);
    //drawPaths[circleArray[i].radius].addPath(circleArray[i].path,dm);
    //dp.addPath(dp,dm);
    //ctx.fillStyle=colors[Math.trunc(i/4)%4];
ctx.fillStyle="hsl("+((hue+60*Math.pow(r,0.5))%360)+",100%,50%)";
    ctx.fill(dp);
  } 
/*
  for (let p=0; p<4; p++) { 
    ctx.fillStyle=colors[p];
    ctx.fill(paths[p]);
  }
*/
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
var f=0;
function animate(ts) {
  if (stopped) return;
  t++;
  draw2();
  if (t==400) ca=generateCircles(createPointArray());
  if (t==800) { ca2=generateCircles(createPointArray()); t=0; }
  f=Math.pow(Math.sin(TP*t/1600),2);
//let dc=draw();
//  if (dc==cset[0].length-4) { stopped=true; return; }
/*
  if (draw()>=cset[0].length) {
    t=0;
    cset.reverse();
    cset[0]=generateCircles();
    rTimeCircles();
    colorSet.unshift(getColors()), colorSet.pop();
  }
*/
  if (t%10==0) hue=(++hue%360);
  requestAnimationFrame(animate);
}

onresize();

const speed=2;

var k=12;

var rTimeCircles=()=>{
  k=20+Math.abs(cset[0].length-cset[1].length)/2.5;
//let speed1=speed*cset[0].length/cset[1].length;
//let speed2=speed*cset[1].length/cset[0].length;
  for (let i=0, j=0; i<cset[0].length; i++) {
    if (i%4==0) j++;
    cset[0][i].t=Math.round(-k-j*speed);
  }
  for (let i=0, j=0; i<cset[1].length; i++) {
    if (i%4==0) j++;
    cset[1][i].t=Math.round(-j*speed);
  }
}

//var cset=[generateCircles(),generateCircles()];
//var cset=[generateCircles()];

//rTimeCircles();

var pa1=createPointArray();
var pa2=createPointArray();
var ca=generateCircles(pa1);
var ca2=generateCircles(pa2);

/*
var test2=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
pa1.push(pa1.shift());
  ca=generateCircles(pa1,pa2);
  draw2(ca);
}
*/

draw2();
start();
