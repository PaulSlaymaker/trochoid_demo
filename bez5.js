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
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var t=0;
var animate=()=>{
  if (stopped) return;
  t++;
  if (t%4==0) {
    for (let i=0; i<hues.length; i++) {
      if (i%2==0) {
        hues[i]=++hues[i]%360;
        strokes[i].col="hsl("+hues[i]+",90%,60%)";
      }
    }
  }
  setPath2();
  draw();
  requestAnimationFrame(animate);
}

const dm1=new DOMMatrix([1,0,0,-1,0,0]);
const dm2=new DOMMatrix([-1,0,0,1,0,0]);
const dm3=new DOMMatrix([0,1,1,0,0,0]);

var path=new Path2D();
const strokes=new Array(7);
var hues=[getRandomInt(0,360),0,getRandomInt(0,360),0,getRandomInt(0,360),0,getRandomInt(0,360)];

var setStrokes=()=>{ 
  //let w=[24,18,13,7,2];
  let w=[36,30,24,18,13,7,2];
  for (let i=0; i<strokes.length; i++) {
    let kda1=TP*Math.random();
    let kdb1=100+100*Math.random();
    let kda2=TP*Math.random();
    let kdb2=100+100*Math.random();
    let kda3=TP*Math.random();
    let kdb3=100+100*Math.random();
    //let k1=5-10*Math.random();
    let k1=1-2*Math.random();
    strokes[i]={"col":i%2?"#000000C0":"hsl("+hues[i]+",90%,60%)",
               //"dash":[getRandomInt(100,1200),getRandomInt(100,1200),getRandomInt(100,1200)],
               "dash":(t)=>{ return [
                             620+580*Math.sin(kda1+t/kdb1),
                             620+580*Math.sin(kda2+t/kdb2),
                             620+580*Math.sin(kda3+t/kdb3)];
                           },
//                 "os":(t)=>{ return k1*t; },
                "wid":w[i]};
  }
};

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<strokes.length; i++) {
    ctx.strokeStyle=strokes[i].col;
    //ctx.setLineDash(strokes[i].dash);
    ctx.setLineDash(strokes[i].dash(t));
    //ctx.lineDashOffset=strokes[i].os(t);
    ctx.lineWidth=strokes[i].wid;
    ctx.stroke(path);
  }
}

/*
var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}
*/

onresize();
setStrokes();

/*
var r1=80+160*Math.random();
var r2=r1+40+(280-r1)*Math.random();
var r3=r2+40+(320-r2)*Math.random();
*/
var k1a=TP*Math.random();
var k1b=200+100*Math.random();
var k2a=TP*Math.random();
var k2b=200+100*Math.random();
var k3a=TP*Math.random();
var k3b=200+100*Math.random();

var setPath2=()=>{
/*
var r1=40+160*Math.random();
  let r2=r1+40+(280-r1)*Math.random();
  let r3=r2+40+(320-r2)*Math.random();
*/
  let r1=40+160*Math.pow(Math.sin(k1a+t/k1b),2);
//  let r2=r1+40+(280-r1)*Math.pow(Math.sin(ka2+t/k2b),2);
//  let r3=r2+40+(320-r2)*Math.pow(Math.sin(k3a+t/200),2);
  let r2=r1+60+(240-r1)*Math.pow(Math.sin(k2a+t/k2b),2);
  let r3=r2+60+(280-r2)*Math.pow(Math.sin(k3a+t/k3b),2);
  let x1=r1,y1=0;
  let x2=r2*Math.cos(TP/16);
  let y2=r2*Math.sin(TP/16);
  let x3=r3, y3=0;
  let x4=r3*Math.cos(TP/8);
  let y4=r3*Math.sin(TP/8);
  let x5=r1*Math.cos(TP/8);
  let y5=r1*Math.sin(TP/8);
  let cp1x=r1+40;
  let cp1y=0;
  let cp2x=(r2-40)*Math.cos(TP/16);
  let cp2y=(r2-40)*Math.sin(TP/16);
  let cp3x=(r2+40)*Math.cos(TP/16);
  let cp3y=(r2+40)*Math.sin(TP/16);
  let cp4x=r3-40;
  let cp4y=0
  let cp5x=CSIZE*Math.cos(TP/8);
  let cp5y=CSIZE*Math.sin(TP/8);
  let cp6x=(r3+40)*Math.cos(TP/8);
  let cp6y=(r3+40)*Math.sin(TP/8);
  let cp7x=(r3-40)*Math.cos(TP/8);
  let cp7y=(r3-40)*Math.sin(TP/8);
  let cp8x=(r1+40)*Math.cos(TP/8);
  let cp8y=(r1+40)*Math.sin(TP/8);
  path=new Path2D();
  path.moveTo(0,0);
  path.lineTo(x1,y1);
  path.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x2,y2);
  path.bezierCurveTo(cp3x,cp3y,cp4x,cp4y,x3,y3);
  let px=(CSIZE+cp5x)/2;
  let py=(cp5y)/2;
  path.bezierCurveTo(r3+40,0,CSIZE,0,px,py);
  path.bezierCurveTo(cp5x,cp5y,cp6x,cp6y,x4,y4);
  path.bezierCurveTo(cp7x,cp7y,cp3x,cp3y,x2,y2);
  path.bezierCurveTo(cp2x,cp2y,cp8x,cp8y,x5,y5);
  path.closePath();
  path.addPath(path,dm1); 
  path.addPath(path,dm2); 
  path.addPath(path,dm3); 
}

setPath2();

start();
