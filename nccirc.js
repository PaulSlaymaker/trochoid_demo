"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
body.style.textAlign="center";
body.style.margin="20";

const canvas=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  //c.style.border="1px solid silver";
  body.append(c);
  return c;
})();

var ctx=canvas.getContext("2d");

const TP=2*Math.PI;

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var Ball=function(os,color) {
  this.o=os;
  this.v=0;
  this.color=color;
  this.move=(m)=>{
    this.o+=m;
    if (this.o>TP) {
      this.o-=TP;
    } else if (this.o<0) {
      this.o+=TP;
    }
  }
  this.setRadians=()=>{
    if (this.o>TP) {
      this.o-=TP;
    } else if (this.o<0) {
      this.o+=TP;
    }
  }
}

onresize=function() { 
  let D=0.9*Math.min(window.innerWidth,window.innerHeight); 
  canvas.width=D;
  canvas.height=D;
  //RR=D/12;
  //RR=D/(2*Count);
  RR=D/(1.7*Count);
  R=D/2-RR;
  rad=Math.asin(RR/R);
  ctx.translate(D/2,D/2);
  ctx.fillStyle="hsl("+getRandomInt(0,360)+",90%,70%)";
  //ctx.strokeStyle="hsl("+getRandomInt(0,360)+",90%,70%)";
  ctx.lineWidth=2;
}

var R=260;
var Z=2;
var RR=0;  // max
//var r=R-RR;
var r=R;
var rad=Math.asin(RR/r);
var Count=getRandomInt(5,18);
var tsStyle="black";
var B=[];

var generateB=()=>{
  let b=[];
  let hue=getRandomInt(0,360);
  let c=["hsl("+hue+",90%,70%)"];
  c.push("hsl("+(hue+getRandomInt(90,180))+",90%,70%)");
  for (let i=0; i<Count; i++) {
    let desync=(1-2*Math.random())/50;
    //b.push(new Ball(i*TP/Count+desync,c[i%2])); // dispersed
    //b.push(new Ball(i*2.05*rad+desync,c[i%2])); // inline
    b.push(new Ball(i*2.05*rad,c[i%2])); // inline
  }
  return b;
}

var VMAX=0.00014;
var vr2=[-VMAX,-VMAX/2,0,VMAX/2,VMAX];
var vr3=[-VMAX,-2*VMAX/3,VMAX/3,0,VMAX/3,2*VMAX/3,VMAX];
var randomize=()=>{
  let vs=(()=>{ 
    let a=[];
    for (let i in B) { a.push(vr3[getRandomInt(0,7)]); }
    a.sort();
    //a.reverse();
    return a;
  })();
  //let vi=VMAX/Count;
  for (let i in B) { 
    //B[i].v=i*vi;
    B[i].v=vs[i];
    //B[i].v=vs[B.length-i];
    //B[i].v=vr3[getRandomInt(0,7)]/2;
  }
}

var draw=()=> {
  let pts=[];
  ctx.beginPath();
  for (let i in B) {
    let q=B[i].o;
    ctx.moveTo(0,0);
    let x=R*Math.sin(q);
    let y=R*Math.cos(q);
    pts.push({"x":x,"y":y});
    B[i].x=x;
    B[i].y=y;
    ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.strokeStyle=tsStyle;
  ctx.stroke();
  ctx.strokeStyle="gray";
  for (let i in B) {
    ctx.beginPath();
    ctx.moveTo(RR+B[i].x,B[i].y);
    ctx.arc(B[i].x,B[i].y,RR,0,TP);
    ctx.fillStyle=B[i].color;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}

var reset=()=>{
  cancelAnimationFrame(AF);
  maxdel=0;
//  B=generateB();
//  randomize();
  stopped=true;
  start();
}

var colCheck=(b1,b2)=>{
  // could check 3 body, or more
  let del=-1; // 0 should be collision
  let d=Math.abs(b1.o-b2.o);
  if (d<2*rad) {
    del=2*rad-d;
  } else if (TP-d<2*rad) {
    del=2*rad-TP+d;
  }
  return del;
}

var detect=()=>{
  for (let i=0; i<B.length; i++) {
    let j=(i+1)%B.length;
    let del=colCheck(B[i],B[j]);
    if (del>=0) {
      return true;
    }
  }
  return false;
}

var maxdel=0;

var collide=()=>{
// sort by del
  for (let i=0; i<B.length; i++) {
    let j=(i+1)%B.length;
    let del=colCheck(B[i],B[j]);
if (del>maxdel) { 
  maxdel=del; 
  if (maxdel>rad/4) {
console.log("restarted");
//debugger;
    reset();
    return false;
  }
}
    if (del>=0) {
      B[i].move(-B[i].v);
      B[j].move(-B[j].v);
      let v0=B[i].v;
      B[i].v=B[j].v;
      B[j].v=v0;
      B[i].move(+B[i].v);
      B[j].move(+B[j].v);
    }
  }
  return true;
}

var adjust=()=>{
  let adj=false;
  for (let i=0; i<B.length; i++) {
    let j=(i+1)%B.length;
    let del=colCheck(B[i],B[j]);
    if (del>=0) {
      let d=B[i].o-B[j].o;
      let desync=0.0005;
      if (d<0) {
        B[i].move(-del/2+desync);
        B[j].move(+del/2+desync);
      } else {
        B[i].move(+del/2+desync);
        B[j].move(-del/2+desync);
      }
      adj=true;
console.log("adjusted");
    }
  }
  return adj;
}

var time=0;
var stopped=true;
var AF=0;
var animate=(ts)=>{
  if (stopped) return;
  for (let s=0; s<100; s++) {
    //let cdel=[];
    for (let i in B) {
      B[i].move(B[i].v);
    }
    collide();
let counter=0;
do {
  if (counter>20) {
    //debugger;
    console.log("reset");
    reset();
    return;
  }
    //if (counter%2==1) console.log("adj "+counter);
  counter++; 
} while (adjust());
  }

  ctx.clearRect(-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
  draw();

////
/*
  if (!time) { time=ts; }
  let progress=ts-time;
  if (progress<10) {
    frac=progress/duration;
  } else {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw(frac,0);
    time=0;
    frac=0;
  }
*/
////
  AF=requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    stopped=false;
    tsStyle="hsl("+getRandomInt(0,360)+",70%,30%)";
    maxdel=0;
Count=getRandomInt(5,18);
RR=canvas.width/(1.7*Count);
R=canvas.width/2-RR;
rad=Math.asin(RR/R);
    B=generateB();
    randomize();
    AF=requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
canvas.addEventListener("click", start, false);

onresize();
//B=generateB();
//randomize();
start();
