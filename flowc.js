"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const CSIZE=400;
const CYCLE=1440;
//const CYCLE=720;
const LSIZE=120;
const SIDE=96;

var trackCtx=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
trackCtx.translate(CSIZE,CSIZE);

var ctx=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

var controlContainer=function() {
  let d=document.createElement("div");
  let s=d.style;
  s.gridRow="2";
  s.display="grid";
  s.gridTemplateColumns="1fr 10px 1fr";
  s.gridTemplateRows="40px 20px 40px";
  s.padding="8px 10px";
  s.border="3px solid #AAA";
  s.borderRadius="10px";
  let cs=document.createElement("div");
  cs.style.height="100%";
  cs.style.display="grid";
  cs.style.gridTemplateRows="1fr 120px 1fr";
  cs.append(d);
  return cs;
}

var container=(()=>{
  let co=document.createElement("div");
  co.style.margin="0 auto";
  co.style.display="grid";	
  co.style.gridTemplateColumns=SIDE+"px auto 96px";
  let ltBox=document.createElement("div");
  ltBox.style.gridColumn="1";
  ltBox.append(controlContainer());
  co.append(ltBox);
  let cBox=document.createElement("div");
  cBox.style.gridColumn="2";
  cBox.style.position="relative";
  co.append(cBox);
  let rtBox=document.createElement("div");
  rtBox.style.gridColumn="3";
  rtBox.append(controlContainer());
  co.append(rtBox);
  cBox.append(trackCtx.canvas);
  cBox.append(ctx.canvas);
  body.append(co);
  return co;
})();

const hues=[0,240];
const colors=["hsl(0,100%,60%)","hsl(240,100%,60%)"];
const LEFT=0, RIGHT=1;
const RED=0, BLUE=1;
const UP=0, RND=1, DOWN=2;

var controls=[];

var Control=function(gate,color,dir,i) {
  this.cc=document.createElement("canvas").getContext("2d");
  let d=document.createElement("div");
  if (i%2==1) d.style.gridColumn=3;
  d.append(this.cc.canvas);
  if (gate==1) {
    container.children[2].children[0].children[0].append(d);
  } else {
    container.children[0].children[0].children[0].append(d);
  }
  this.cc.canvas.width=30;
  if (dir==RND) this.cc.canvas.height=20;
  else this.cc.canvas.height=40;
  this.cc.canvas.style.cursor="pointer";
  this.cc.strokeStyle=colors[color];
  this.cc.fillStyle=colors[color];
  this.lightColor="hsl("+hues[color]+",100%,20%)";
  this.drawUp=()=>{
    this.cc.beginPath();
    this.cc.moveTo(0,40);
    this.cc.lineTo(15,0);
    this.cc.lineTo(30,40);
    this.cc.closePath();
    this.cc.fill();
    this.cc.stroke();
  }
  this.drawDown=()=>{
    this.cc.beginPath();
    this.cc.moveTo(0,0);
    this.cc.lineTo(15,40);
    this.cc.lineTo(30,0);
    this.cc.closePath();
    this.cc.fill();
    this.cc.stroke();
  }
  this.drawRnd=()=>{
    this.cc.clearRect(0,0,30,20);
    this.cc.fillRect(0,0,30,20);
    this.cc.strokeRect(0,0,30,20);
  }
  this.draw=()=>{
    if (dir==RND) {
      this.cc.lineWidth=5;
      if (logic[gate][color]==RND) {
        this.cc.fillStyle=colors[color];
      } else {
	this.cc.fillStyle=this.lightColor;
      }
      this.drawRnd();
    } else {
      this.cc.clearRect(0,0,30,40);
      if (logic[gate][color]==dir) {
	this.cc.fillStyle=colors[color];
	if (dir==UP) {
	  this.drawUp();
	} else if (dir==DOWN) {
          this.drawDown();
	}
      } else {
	// non-dir
	this.cc.fillStyle=this.lightColor;
	this.cc.lineWidth=3;
	this.cc.strokeStyle=colors[color];
	if (dir==UP) {
	  this.drawUp();
	} else if (dir==DOWN) {
          this.drawDown();
	}
      }
    }
  }
  this.mouseEnter=()=>{
    this.cc.strokeStyle="white";
    this.cc.lineWidth=2;
    if (dir==UP) {
      this.drawUp();
    } else if (dir==DOWN) {
      this.drawDown();
    } else {
      this.drawRnd();
    }
  }
  this.mouseLeave=()=>{
    this.cc.strokeStyle=colors[color];
    if (dir==UP) {
      this.cc.lineWidth=3;
      this.drawUp();
    } else if (dir==DOWN) {
      this.cc.lineWidth=3;
      this.drawDown();
    } else {
      this.cc.lineWidth=5;
      this.drawRnd();
    }
  }
  this.setDir=()=>{
    state=false;
    logic[gate][color]=dir;
    setControls();
  }
  this.cc.canvas.addEventListener("click", this.setDir, false);
  this.cc.canvas.addEventListener("mouseenter", this.mouseEnter, false);
  this.cc.canvas.addEventListener("mouseleave", this.mouseLeave, false);
}

var controls=[];
for (let gate=0; gate<2; gate++) {
  for (let dir=0,i=0; dir<3; dir++) {
    for (let col=0; col<2; col++,i++) {
      controls.push(new Control(gate,col,dir,i));
    }
  }
}

var layerContext=function(show) {
  let c=document.createElement("canvas");
  c.width=LSIZE;
  c.height=LSIZE;
  c.style.display="block";
if (show) { body.append(c); }
  this.ctx=c.getContext("2d");
  this.ctx.translate(LSIZE/2,LSIZE/2);
}

var R=CSIZE/2.2;

var l1Ctx=new layerContext().ctx;
var l2Ctx=new layerContext().ctx;
var l3Ctx=new layerContext().ctx;
var l4Ctx=new layerContext().ctx;

onresize=function() {
  let S=2*SIDE;
  let D=Math.min(window.innerWidth,window.innerHeight+S)-40; 
  container.style.height=D-S+"px";
  container.style.width=D+"px";
  ctx.canvas.style.width=D-S+"px";
  ctx.canvas.style.height=D-S+"px";
  trackCtx.canvas.style.width=D-S+"px";
  trackCtx.canvas.style.height=D-S+"px";

/*
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.height=D+"px";
  container.style.width=D+2*SIDE+"px";
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
  trackCtx.canvas.style.width=D+"px";
  trackCtx.canvas.style.height=D+"px";
*/

}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var Curve=function(xp,yp,rp,o) {
  this.x=xp;
  this.y=yp;
  this.r=rp;
  this.pts=[];
  this.drawCenterTrack=(width,color)=>{
    let ct=o>0?l2Ctx:l4Ctx;
    ct.lineWidth=width;
    ct.strokeStyle=color;
    ct.beginPath();
    let spread=Math.round(CYCLE/27);  // must be shorter than l1Ctx due to ellipse short radius
    let lower=CYCLE/4-spread;
    let upper=CYCLE/4+spread;  
    ct.moveTo(this.getX(lower),-this.y+this.getY(lower));
    //for (let i=163; i<199; i++) {
    let W=(color=="black")?2:0;
    for (let i=lower+1-W; i<upper+W; i++) {
      ct.lineTo(this.getX(i),-this.y+this.getY(i));
    }
/*
ct.strokeStyle="white";
ct.lineWidth=1;
ct.strokeRect(-LSIZE/2,-LSIZE/2,LSIZE,LSIZE);
*/
    ct.closePath();
    ct.stroke();
  }
  this.draw=(width,color)=>{
    trackCtx.lineWidth=width;
    trackCtx.strokeStyle=color;
    trackCtx.beginPath();
    trackCtx.moveTo(this.getX(0),this.getY(0));
    for (let i=0; i<CYCLE; i++) {
      trackCtx.lineTo(this.getX(i), this.getY(i));
    }
    trackCtx.closePath();
    trackCtx.stroke();
    this.drawCenterTrack(width,color);
  }
  this.getX=(t)=>{ 
    let d=o>0?1:-1;
    return this.x+2*this.r*Math.cos(d*TP*(t+o)/CYCLE); 
  }
  this.getY=(t)=>{ 
    let d=o>0?1:-1;
    return this.y+this.r*Math.sin(d*2*TP*(t+o)/CYCLE); 
  }
  this.getA=(to)=>{ 
    let d=o>0?1:-1;
    let ar=d*TP*to/CYCLE;
    return Math.atan(Math.sin(ar)/(Math.cos(2*ar))); 
  }
}

var logic=[[0,0],[0,0]];
var state=true;

var setControls=()=>{ controls.forEach((c)=>{ c.draw(); }); }

var randomizeLogic=()=>{
  logic[LEFT]=[getRandomInt(0,3),getRandomInt(0,3)];
  logic[RIGHT]=[getRandomInt(0,3),getRandomInt(0,3)];
  setControls();
}

var Ellipse=function(offset,color) {
  this.o=offset*CYCLE;
  this.color=color;
  this.ps=0;
  //this.ps=getRandomInt(0,2);
  this.draw=()=>{
    ctx.beginPath();
    let rpos=t+this.o;
    let x=p[this.ps].getX(rpos);
    let y=p[this.ps].getY(rpos);
    let a=p[this.ps].getA(rpos);
    ctx.ellipse(x,y,32,10,a,0,TP);
    //ctx.arc(x,y,32,0,TP);
    ctx.closePath();
    ctx.fillStyle=colors[this.color];
    ctx.fill();
    let ct=this.ps==0?l1Ctx:l3Ctx;
    let position=(t+this.o)%CYCLE;
    let spread=Math.round(CYCLE/32);  // must be shorter than l1Ctx due to ellipse short radius
    let lower=3/4*CYCLE-spread;  // move out of loop
    let upper=3/4*CYCLE+spread;
    //if (position>1032 && position<1128) {  // 3/4 cycle +/- 5%
    //if (position>516 && position<564) {  // 3/4 cycle +/- 5%
    if (position>lower && position<upper) {  // 3/4 cycle +/- 5%
      ct.beginPath();
      ct.ellipse(x,y-p[this.ps].y,32,10,a,0,TP);
      ct.closePath();
      ct.fillStyle=colors[this.color];
      ct.fill();
    }
//this.cText(x,y);
  }
  this.cText=(x,y)=>{
    ctx.fillStyle="white";
    ctx.font="20px sans-serif";
    ctx.fillText(((t+this.o)%CYCLE).toFixed(0),x,y);
  }
  this.junction=()=>{
    if ((t+this.o)%CYCLE==540) {
    //if ((t+this.o)%CYCLE==270) {
      // only left junction
      if (logic[LEFT][this.color]==UP) this.ps=0;
      else if (logic[LEFT][this.color]==DOWN) this.ps=1;
      else if (Math.random()<0.5) { this.ps=++this.ps%2; }
    } else if ((t+this.o)%CYCLE==1260) {
    //} else if ((t+this.o)%CYCLE==640) {
      if (logic[RIGHT][this.color]==UP) this.ps=0;
      else if (logic[RIGHT][this.color]==DOWN) this.ps=1;
      else if (Math.random()<0.5) { this.ps=++this.ps%2; }
    }
  }
}

var t=0;
var p=[new Curve(0,-R,R,0), new Curve(0,R,R,TP/2)];

p[0].draw(72,"#DDD");
p[1].draw(72,"#DDD");
//trackCtx.globalCompositeOperation="source-atop";
p[0].draw(64,"black");
p[1].draw(64,"black");
//trackCtx.globalCompositeOperation="source-over";

var orbs=[];
for (let i=0; i<40; i++) {
  orbs.push(new Ellipse(i/40,i%2));
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  l1Ctx.clearRect(-LSIZE/2,-LSIZE/2,LSIZE,LSIZE);
  l3Ctx.clearRect(-LSIZE/2,-LSIZE/2,LSIZE,LSIZE);
  orbs.forEach((o)=>{ o.draw(); });
  ctx.drawImage(l2Ctx.canvas,-LSIZE/2,p[0].y-LSIZE/2)
  ctx.drawImage(l1Ctx.canvas,-LSIZE/2,p[0].y-LSIZE/2)
//l4Ctx.strokeRect(-LSIZE/2,-LSIZE/2,LSIZE,LSIZE);
  ctx.drawImage(l4Ctx.canvas,-LSIZE/2,p[1].y-LSIZE/2)
  ctx.drawImage(l3Ctx.canvas,-LSIZE/2,p[1].y-LSIZE/2)
}

var setDir=(id)=>{
  console.log(id);
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

var animate=(ts)=>{
  if (stopped) return;
  t+=2;
  if (state && t%2000==0) {
    randomizeLogic();
  }
  orbs.forEach((o)=>{ o.junction(); });
  draw();
//stopped=true;
  requestAnimationFrame(animate);
}

onresize();
setControls();
start();
