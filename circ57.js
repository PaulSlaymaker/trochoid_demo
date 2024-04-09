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
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

const ctxo=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=CSIZE;
  return c.getContext("2d", {"willReadFrequently": true});
})();

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
  this.getRGB=(c)=>{
   let red=Math.round(CBASE+CT*(Math.cos(this.RK2+c/this.RK1)));
   let grn=Math.round(CBASE+CT*(Math.cos(this.GK2+c/this.GK1)));
   let blu=Math.round(CBASE+CT*(Math.cos(this.BK2+c/this.BK1)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=20+20*Math.random();
    this.GK1=20+20*Math.random();
    this.BK1=20+20*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var t=0;
const DUR=800;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  draw();
if (EM && t%100==0) stopped=true;
  requestAnimationFrame(animate);
}

var Circle=function(x,y) { 
  this.x=x;
  this.y=y;
  this.K1x=TP*Math.random();
  this.K2x=200+200*Math.random();
  this.K1y=TP*Math.random();
  this.K2y=200+200*Math.random();
//this.maxr=160;
  this.r=0;
  this.nd=false;
  this.setPath=()=>{
    this.path=new Path2D();
if (this.r>0)
    this.path.arc(this.x,this.y,this.r,0,TP);
  }
  this.reset=()=>{ 
    this.r=0; 
    this.nd=false; 
    this.x=(CSIZE-120)*(1+Math.sin(this.K1x+t/this.K2x))/2;
    this.y=(CSIZE-120)*(1+Math.sin(this.K1y+t/this.K2y))/2;
  }
  this.getPath=(r)=>{
    r=Math.max(0,r);
    let p=new Path2D();
    p.arc(this.x,this.y,r,0,TP);
    return p;
  }
}

var getDistance=(p1,p2)=>{
  let dx=p2.x-p1.x;
  let dy=p2.y-p1.y;
  return Math.pow(dx*dx+dy*dy,0.5);
}

var ca=[];

for (let i=0; i<40; i++) ca.push(new Circle());

var cpath=new Path2D();

var setRadii=()=>{
  for (let i=0; i<ca.length; i++) ca[i].reset();
  ca[0].r=20+100*(1+Math.sin(TP*t/DUR))/2;
  ca[0].setPath();
  cpath=new Path2D(); 
  cpath.addPath(ca[0].path);
  for (let i=1; i<ca.length; i++) {	// evaluate each ca[i]
    if (ctx.isPointInPath(cpath,ca[i].x+CSIZE,ca[i].y+CSIZE)) {
      ca[i].nd=true;
//console.log("ng",i);
      continue;
    }
//console.log("good",i);
    let jr=Infinity;
  //let jr=ca[i].maxr;
    let jidx=undefined;
    for (let j=0; j<i; j++) {	// test against ca[i].j
      if (ca[j].nd) continue;
      let d=getDistance(ca[i],ca[j]);
      if (d-ca[j].r<jr) {
	jr=d-ca[j].r;
  if (jr<0) {	// handle possible webkit-type isPointInPath bug, not affecting FF
    ca[i].nd=true;
//console.log("ng3",i,j);
    continue;
  }
	jidx=i;
      }
      //jr=Math.min(getDistance(ca[i],ca[j])-ca[j].r,jr);
    }
if (!jidx) {	// handle possible webkit-type isPointInPath bug, not affecting FF
  ca[i].nd=true;
//console.log("ng2",i,jidx);
//debugger;
ctx.strokeStyle="red";
  continue;
}
  //console.log(jidx,jr);
    ca[jidx].r=jr;
    ca[jidx].setPath();
    cpath.addPath(ca[jidx].path);
  }
}

ctxo.fillStyle="#00000008";
ctxo.lineWidth=12;

var draw=()=>{
  setRadii();
  ctxo.fillRect(0,0,CSIZE,CSIZE);
  for (let i=0; i<ca.length; i++) {
    if (!ca[i].nd) {
      for (let j=0; j<8; j++) {
        ctxo.strokeStyle=color.getRGB(ca[i].r-(j*32)-6+t/10);
        ctxo.stroke(ca[i].getPath(ca[i].r-(j*32)-6));
      }
    }
  }
  ctx.drawImage(ctxo.canvas,0,0);
  ctx.setTransform(1,0,0,-1,CSIZE,CSIZE);
  ctx.drawImage(ctxo.canvas,0,0);
  ctx.setTransform(-1,0,0,-1,CSIZE,CSIZE);
  ctx.drawImage(ctxo.canvas,0,0);
  ctx.setTransform(-1,0,0,1,CSIZE,CSIZE);
  ctx.drawImage(ctxo.canvas,0,0);
  ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
}

onresize();

start();
