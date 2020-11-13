"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
body.style.textAlign="center";
body.style.margin="20";

const canvas=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
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
}

onresize=function() { 
  let D=0.9*Math.min(window.innerWidth,window.innerHeight); 
  canvas.width=D;
  canvas.height=D;
  R=canvas.width/(2*(1+Math.sin(TP/(4*(Count+1)))));
  RR=canvas.width/2-R;
  rad=Math.asin(RR/R);
  ctx.translate(D/2,D/2);
  ctx.lineWidth=2;
}

var R=260;
var Z=2;
var RR=0;  // max
var r=R;
var rad=Math.asin(RR/r);
var Count=getRandomInt(5,25);
var tsStyle="white";
var B=[];

var generateB=()=>{
  let b=[];
  let hue=getRandomInt(0,360);
  let c1=["hsl("+hue+",90%,70%)","hsl("+(hue+72)+",80%,30%)"];
  let c2=["hsl("+(hue+144)+",90%,70%)","hsl("+(hue+216)+",80%,30%)"];
  let c=[c1,c2];
  //c.push("hsl("+(hue+getRandomInt(90,180))+",90%,70%)");
  let tf=[true,false];
  let dot=[tf[getRandomInt(0,2)],tf[getRandomInt(0,2)]];
  let hrat=[getRandomInt(4,7),getRandomInt(4,7)];
  let offset=TP*Math.random();
  for (let i=0; i<Count; i++) {
    let desync=(1-2*Math.random())/50;
    //b.push(new Ball(i*TP/Count+desync,c[i%2])); // dispersed
    //b.push(new Ball(i*TP/Count,c[i%2])); // dispersed
    let ball=new Ball((offset+i*2.05*rad)%TP,c[i%2]); // inline
    ball.dot=dot[i%2];
    ball.hr=hrat[i%2];
    b.push(ball);
  }
  return b;
}

var VMAX=0.00012;
//var VMAX=0.005;
var vr2=[-VMAX,-VMAX/2,0,VMAX/2,VMAX];
var vr3=[-VMAX,-2*VMAX/3,VMAX/3,0,VMAX/3,2*VMAX/3,VMAX];
var vr4=[-VMAX,-3*VMAX/4,-VMAX/2,-VMAX/4,0,VMAX/4,VMAX/2,3*VMAX/4,VMAX];
var randomize=()=>{
  let vs=(()=>{ 
    let a=[];
    //for (let i in B) { a.push(vr3[getRandomInt(0,7)]); }
    for (let i in B) { a.push(vr4[getRandomInt(0,9)]); }
    a.sort((a,b)=>{ 
      if (a>b) return -1;
      if (b>a) return 1;
      return 0;
    });
    return a;
  })();
//debugger;
  //let vi=VMAX/Count;
  for (let i in B) { 
    //B[i].v=i*vi;
    B[i].v=vs[i];
//console.log(i+" "+B[i].v);
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
    ctx.fillStyle=B[i].color[0];
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
    if (B[i].dot) {
      ctx.beginPath();
      ctx.arc(B[i].x,B[i].y,RR/B[i].hr,0,TP);
      ctx.fillStyle=B[i].color[1];
      ctx.closePath();
      ctx.fill();
    }
  }
  let ra=0.025*R;
  ctx.beginPath();
  ctx.moveTo(ra,0);
  ctx.arc(0,0,ra,0,TP);
  ctx.fillStyle="#133";
  ctx.fill();
}

var reset=(m)=>{
//  console.log("reset "+m);
  cancelAnimationFrame(AF);
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

var contact=(b1,b2)=>{
  let d=Math.abs(b1.o-b2.o);
  if (d<2.01*rad) {
    return true;
  } else if (TP-d<2.01*rad) {
    return true;
  }
  return false;
}

var detect=(b1,b2)=>{
  let d=Math.abs(b1.o-b2.o);
  let collided=false;
  if (d<2.04*rad) {
    return [d<2*rad,true];
  } else if (TP-d<2.04*rad) {
    return [TP-d<2*rad,true];
  }
  return [false,false];
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
//console.log("restarted");
//debugger;
    reset("del");
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
    }
  }
  return adj;
}

var ratchet=performance.now()+60000;
var stopped=true;
var AF=0;
var animate=(ts)=>{
  if (stopped) return;
  if (ts>ratchet) {
    reset("time");
  }
  for (let s=0; s<80; s++) {
    //let cdel=[];
    for (let i in B) {
      B[i].move(B[i].v);
    }
    collide();
let counter=0;
do {
  if (counter>20) {
    reset("adj");
    return;
  }
    //if (counter%2==1) console.log("adj "+counter);
  counter++; 
} while (adjust());
//if (counter>1) console.log("adjusted "+counter);
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
    tsStyle="hsl("+getRandomInt(0,360)+",60%,40%)";
    maxdel=0;
    Count=getRandomInt(5,25);
    R=canvas.width/(2*(1+Math.sin(TP/(4*(Count+1)))));
    RR=canvas.width/2-R;
    //let RRx=canvas.width/(1.7*Count);
    //let Rx=canvas.width/2-RR;
    rad=Math.asin(RR/R);
    B=generateB();
    randomize();
    ratchet=performance.now()+60000;
    AF=requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
canvas.addEventListener("click", start, false);

onresize();
start();

var bd=()=>{
  for (let i=0; i<B.length; i++) {
    let j=(i+1)%B.length;
    let d=B[i].o-B[j].o;
    console.log(B[i].o.toFixed(3)+" "+d);
  }
}
