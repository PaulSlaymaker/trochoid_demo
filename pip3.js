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

var ca=[];	// circle array

var Circle=function(idx) {
  this.a=0;	
  this.a2=0;	// location radius angle
  this.cca=[];
  //this.inc=(Math.random()<0.5?1:-1)*getRandomInt(2400,3600);
  //this.inc=getRandomInt(4000,20000);
  //this.inc2=getRandomInt(6000,10000);
  //this.inc=getRandomInt(800,4000);
  //this.inc2=getRandomInt(8000,80000);
  this.inc=2400+1200*getRandomInt(0,3);
  if (idx%2) this.inc=-this.inc;
  this.inc2=6400+3200*getRandomInt(0,3);
//this.inc=800+10*idx;
//this.inc2=4000+20*idx;
  ca.push(this);
  this.move=(q)=>{
    this.a+=q*TP/this.inc;
    this.a2+=q*TP/this.inc2;
    let rz=340*Math.pow(Math.sin(this.a2),2);
//let os=(idx%2)?0:TP/2;
    this.x=rz*Math.cos(this.a);
    this.y=rz*Math.sin(this.a);
  }
  this.setPath=()=>{
    this.path=new Path2D();
    this.path.arc(this.x,this.y,this.r,0,TP);
  }
  this.setRadius=(r)=>{
    this.r=r;
    this.path=new Path2D();
    if (r>0) this.path.arc(this.x,this.y,r,0,TP);
  }
}

/*
var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,2,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}
*/

const WID=16;
ctx.lineWidth=WID;

//ctx.fillStyle="#FFFF0080";
var draw=()=>{
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<ca.length; i++) {
    ctx.beginPath();
    let dr=ca[i].r-WID/2;
    if (dr>0) {
      ctx.arc(ca[i].x,ca[i].y,dr,0,TP);
//ctx.globalCompositeOperation="lighter";
ctx.fillStyle="hsla("+(hue+Math.round(ca[i].r)%360)+",90%,30%,0.5)";
ctx.fill();
//ctx.globalCompositeOperation="source-over";
      ctx.strokeStyle="hsl("+(hue+Math.round(ca[i].r)%360)+",100%,50%)";
      ctx.stroke();
    }
  }
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

var hue=getRandomInt(0,360);
var stopped=true;
var t=0;
function animate(ts) {
  if (stopped) return;
t++;
  hue+=0.004;
  transit();
  requestAnimationFrame(animate);
}

onresize();

for (let i=0; i<40; i++) new Circle(i);

var setCircleRadii=()=>{
  for (let i=0; i<ca.length; i++) {
    ca[i].cca=[];
    let maxr=CSIZE-Math.pow(ca[i].x*ca[i].x+ca[i].y*ca[i].y,0.5);
    for (let j=i-1; j>=0; j--) {
      if (ctx.isPointInPath(ca[j].path,ca[i].x+CSIZE,ca[i].y+CSIZE)) { 
        let pd=Math.pow((ca[j].x-ca[i].x)*(ca[j].x-ca[i].x)+(ca[j].y-ca[i].y)*(ca[j].y-ca[i].y),0.5);
        //maxr=Math.max(0,ca[j].r-WID); 
        maxr=Math.max(0,ca[j].r-WID-pd);
        if (maxr==0) break;
        for (let k=0; k<ca[j].cca.length; k++) {
          // pd test for k members with ca[i]
          let pd=Math.pow(
            (ca[j].cca[k].x-ca[i].x)*(ca[j].cca[k].x-ca[i].x)+
            (ca[j].cca[k].y-ca[i].y)*(ca[j].cca[k].y-ca[i].y),
            0.5);
          maxr=Math.min(maxr,pd-ca[j].cca[k].r);
        }
        ca[j].cca.push(ca[i]);
        break; 
      }	else {
        let pd=Math.pow((ca[j].x-ca[i].x)*(ca[j].x-ca[i].x)+(ca[j].y-ca[i].y)*(ca[j].y-ca[i].y),0.5);
        maxr=Math.min(maxr,pd-ca[j].r);
      }
    }
    ca[i].setRadius(maxr);
  }
}

/*
var markCircles=()=>{
  drawPoint(ca[0].x,ca[0].y,"green");
  drawPoint(ca[1].x,ca[1].y,"white");
  ctx.beginPath();
  ctx.arc(0,0,380+WID/2,0,TP);
  ctx.strokeStyle="gray";
  ctx.stroke();
}
*/

var transit=()=>{
  for (let i=0; i<ca.length; i++) ca[i].move(1);
  setCircleRadii();
  draw();
//markCircles();
}

//transit();
//draw();
for (let i=0; i<ca.length; i++) ca[i].move(-3000);
start();
