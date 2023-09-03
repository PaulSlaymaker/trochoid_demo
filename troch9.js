"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
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
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
ctx.globalAlpha=0.3;

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=144;
  const CT=255-CBASE;
  this.randomize=()=>{
    this.RK1=50+50*Math.random();
    this.GK1=50+50*Math.random();
    this.BK1=50+50*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
 this.randomize();
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
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

var pauseTS=1000;
var pause=(ts)=>{
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  if (t%200==0) {
    color.randomize();
    color2.randomize();
    [R1,R2]=[2+80*Math.pow(Math.random()*Math.random(),2),
             2+80*Math.pow(Math.random()*Math.random(),2)
            ].sort((a,b)=>{ return b-a; });
    E1=[2,4][getRandomInt(0,2)];
    E2=[2,4][getRandomInt(0,2)];
    pauseTS=performance.now()+600;
    requestAnimationFrame(pause);
  } else {
    draw();
    requestAnimationFrame(animate);
  }
}

var ED=CSIZE-60;

/*
var patht=new Path2D();
patht.moveTo(ED,0);
for (let i=0; i<480; i++) {
  let a=i*TP/480;
  let x=ED/2*(Math.cos(7*a)+Math.cos(a));
  let y=ED/2*(Math.sin(a)+Math.sin(7*a));
  patht.lineTo(x,y);
}
patht.closePath();
*/

var color=new Color();
var color2=new Color();
ctx.lineWidth=3;

var R1=2+40*Math.random();
var R2=2+40*Math.random();
var E1=[2,4][getRandomInt(0,2)];
var E2=[2,4][getRandomInt(0,2)];

var drawPoint=(x,y,col,rad)=>{	// diag
  ctx.beginPath();
  if (rad) ctx.arc(x,y,rad,0,TP);
  else ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var drawN=()=>{
//ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<24; i++) {
    let a=t*TP/4800+i*TP/24;	//  9600/24=400
    let x=ED/2*(Math.cos(7*a)+Math.cos(a));
    let y=ED/2*(Math.sin(a)+Math.sin(7*a));
    let ap=Math.atan2(-7*Math.cos(7*a)-Math.cos(a),7*Math.sin(7*a)+Math.sin(a));
    ctx.setTransform(Math.cos(ap),Math.sin(ap),-Math.sin(ap),Math.cos(ap),CSIZE+x,CSIZE+y);
    //let rad1=Math.max(0.1,R1*Math.pow(Math.sin(TP*t/400),E1));
    let rad1=R1*Math.pow(Math.sin(TP*t/200),E1);
    let rad2=R2*Math.pow(Math.sin(TP*t/200),E2);
    ctx.fillStyle=color.getRGB();
    //ctx.setTransform(Math.cos(ap),Math.sin(ap),-Math.sin(ap),Math.cos(ap),CSIZE+x-rad1/5,CSIZE+y-rad1);
    //ctx.strokeRect(x-rad1/5,y-rad1,2*rad1/5,2*rad1);
    ctx.fillRect(-3,-rad1,6,2*rad1);
    ctx.fillStyle=color2.getRGB();
    ctx.fillRect(-6,-rad2,12,2*rad2);
/*
    ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
    drawPoint(x,y);
*/

    a=-t*TP/4800+i*TP/24;
    x=ED/2*(Math.cos(7*a)+Math.cos(a));
    y=ED/2*(Math.sin(a)+Math.sin(7*a));
    ap=Math.atan2(-7*Math.cos(7*a)-Math.cos(a),7*Math.sin(7*a)+Math.sin(a));
    ctx.setTransform(Math.cos(ap),Math.sin(ap),-Math.sin(ap),Math.cos(ap),CSIZE+x,CSIZE+y);
//    ctx.setTransform(1,0,0,1,CSIZE+x,CSIZE+y);
    ctx.fillStyle=color.getRGB();
    ctx.fillRect(-3,-rad1,6,2*rad1);
    ctx.fillStyle=color2.getRGB();
    ctx.fillRect(-6,-rad2,12,2*rad2);
//    let ap=Math.atan2(-7*Math.cos(7*a)-Math.cos(a),7*Math.sin(a)+Math.sin(a));
  } 
/*
  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
  ctx.strokeStyle="yellow";
  ctx.stroke(patht);
*/
}

var draw=()=>{
drawN(); return;
  let p1=new Path2D();
  let p2=new Path2D();
  let p3=new Path2D();
  let p4=new Path2D();
  for (let i=0; i<24; i++) {
    let tt=t;//i%2?-t:t;
    let a=tt*TP/9600+i*TP/24;
    let x=ED/2*(Math.cos(7*a)+Math.cos(a));
    let y=ED/2*(Math.sin(a)+Math.sin(7*a));
    let rad1=Math.max(0.1,R1*Math.pow(Math.sin(TP*tt/400),E1));
    let rad2=Math.max(0.1,R2*Math.pow(Math.sin(TP*tt/400),E2));
    p1.moveTo(x+rad1,y);
    p1.arc(x,y,rad1,0,TP);
    p2.moveTo(x+rad2,y);
    p2.arc(x,y,rad2,0,TP);
    a=-tt*TP/9600+i*TP/24;
    x=ED/2*(Math.cos(7*a)+Math.cos(a));
    y=ED/2*(Math.sin(a)+Math.sin(7*a));
    p3.moveTo(x+rad1,y);
    p3.arc(x,y,rad1,0,TP);
    p4.moveTo(x+rad2,y);
    p4.arc(x,y,rad2,0,TP);
  }
  ctx.strokeStyle=color.getRGB();
  ctx.stroke(p1);
  ctx.stroke(p3);
  ctx.fillStyle=color2.getRGB();
  ctx.fill(p2);
  ctx.fill(p4);
}

onresize();

start();
