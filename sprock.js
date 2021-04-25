"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const CSIZE=600;

var createContext=()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  let context=c.getContext("2d");
  context.translate(CSIZE,CSIZE);
  return context;
}

const ctx=createContext();

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="0 auto";
  co.append(ctx.canvas);
  body.append(co);
  return co;
})();

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.height=D+"px";
  container.style.width=D+"px";
  let canvs=document.getElementsByTagName("canvas");
  for (let i=0; i<canvs.length; i++) {
    canvs.item(i).style.width=D+"px";
    canvs.item(i).style.height=D+"px";
  }
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const R=100;
//const RATE=720;
//const RATE2=840;	// 7/6*RATE
const RATE=360;
const RATE2=420;	// 7/6*RATE
//const RATE=300;
//const RATE2=350;	// 7/6*RATE

var circle=(()=>{ let p=new Path2D(); p.arc(0,0,R,0,TP); return p; })();

var path1=(()=>{ 
  let p=new Path2D(); 
  //p.moveTo(R,0);
  p.moveTo(0,9*R/10);
  let K=40;
  for (let i=0; i<K; i++) {
    //p.lineTo(R*Math.cos(i*TP/K),R/2*Math.sin(2*i*TP/K));
    p.lineTo(R/2*Math.sin(2*i*TP/K),9*R/10*Math.cos(i*TP/K));
  }
  p.closePath();
  p.addPath(circle);
  return p; 
})();

var path2=(()=>{ 
  let p=new Path2D(); 
  p.moveTo(9*R/10,0);
  let K=40;
  for (let i=0; i<K; i++) {
    p.lineTo(9*R/10*Math.cos(i*TP/K),R/2*Math.sin(2*i*TP/K));
  }
  p.closePath();
  p.addPath(circle);
  return p; 
})();

var s1Count=0;

function Ball(sp) {
  this.rx=0;
  this.ry=0;
  this.sprocket=sp;
  this.slot=getRandomInt(0,this.sprocket.count);
  //this.color="hsla("+getRandomInt(0,360)+",100%,65%,0.3)";
  this.color="hsla("+getRandomInt(0,360)+",100%,70%,0.3)";
  this.path=[path1,path2,circle,circle][getRandomInt(0,4)];
  this.draw=()=>{
    if (this.sprocket.junction(this)) {  // move contents to Sprocket, test single sock1
if (this.sprocket==sprock1) {
  this.sprocket=[sprock6,sprock7][getRandomInt(0,2)];
  s1Count--;
} else {
  if (s1Count==0) {
    if (Math.random()<0.05) {
      this.sprocket=sprock1;
      sprock1.t=4*sprock1.rate/6;
      s1Count++;
    } else {
      this.sprocket=[sprock6,sprock7][getRandomInt(0,2)];
    }
  }
}
      this.slot=this.sprocket.getSlot();
    }
    ctx.beginPath();
    let p=new Path2D();
    //let x=this.sprocket.x+2*R*Math.cos(z);
    //this.dm.f=2*R*Math.sin(z);
    //this.dm.e=x;
    //this.dm.e=this.sprocket.getX(this.slot);
    //this.dm.f=this.sprocket.getY(this.slot);
    //p.addPath(circle,this.sprocket.getMatrix(this.slot));
    p.addPath(this.path,this.sprocket.getMatrix(this.slot));
    ctx.fillStyle=this.color;
    ctx.fill(p,"evenodd");
  }
}

function Sprocket(p2d,px,py,pa,count,direction,rate) {
  this.x=px;
  this.y=py;	// currently all 0, not used
  this.r=Math.abs(px)-R;
  this.p2d=p2d;
  this.jangle=pa;
  this.count=count;
  this.t=0;
  this.rate=rate;
  this.dm=new DOMMatrix();
  if (count==1) {
    this.increment=()=>{ 
      this.t=++this.t%(rate*2); 
      if (this.t==0) {
        balls.push(new Ball(sprock1));
        s1Count++;
      }
    }
  } else {
    this.increment=()=>{ this.t=++this.t%rate; }
  }
  this.getRadial=()=>{ return direction*this.t/rate*TP; }
  this.getMatrix=(s)=>{
    let z=this.getRadial()+s*TP/count;
    if (count==1) {
	this.dm.e=0;
	this.dm.f=this.y-38+2*R*TP*this.t/rate;	// solve for f=0 for junc
    } else {
	this.dm.e=this.x+(this.r+R)*Math.cos(z);
	this.dm.f=this.y+(this.r+R)*Math.sin(z);
    }
    return this.dm;
  }
/*
  this.junction6=(s)=>{
    if (this.t%(rate/count)!=0) return false;	// only 0-angle junction, try rate/6/count for hex junc
    //return this.t%rate==this.jangle/count*rate;
    return (this.t+(count-s)*rate/count)%rate==this.jangle/count*rate;
  }
*/
  if (count==1) {
    //this.junction=()=>{ return this.t==480; }
    this.junction=(ball)=>{ 
      if (this.t==4*rate/6) return true; 	// 4*RATE/6
//else if (this.t==9*rate/6) return true;
      //else if (this.t==2*rate-1) balls.splice(balls.indexOf(ball),1);
      else if (this.t==3*rate/2) {
        balls.splice(balls.indexOf(ball),1);
        s1Count--;
      }
      return false;
    }
  } else {
    this.junction=(ball)=>{
      if (this.t%(rate/count)!=0) return false;	// only 0-angle junction, try rate/6/count for hex junc
      return this.t/rate*count==(count-direction*ball.slot+this.jangle)%count;
    }
  }
  if (count==1) {
    this.getSlot=()=>{ return 0; } 	// what slot would obviate s1Count?
    //this.getSlot=()=>{ return this.t/rate; }
  } else {
    this.getSlot=()=>{ return (count-direction*this.t/rate*count+this.jangle)%count; }
  }
}

var sprock1=new Sprocket(null,0,-CSIZE-2*R,0,1,1,RATE);

var sprock7=(()=>{
  let p2d=new Path2D();
  let rf=R/Math.sin(TP/14);	// =230.5
/*
  let x=rf;
  let y=0;
  p2d.moveTo(x+R*Math.cos(2*TP/7),R*Math.sin(2*TP/7));
  //p2d.arc(x,y,R,2*TP/7,5*TP/7);	// 9-19/28
  p2d.arc(x,y,R,9*TP/28,19*TP/28);	// 9-19/28
  x=rf*Math.cos(6*TP/7);
  y=rf*Math.sin(6*TP/7);
  p2d.arc(x,y,R,5*TP/28,15*TP/28);
*/

  for (let i=0; i<7; i++) {
    let x=rf*Math.cos((7-i)*TP/7);
    let y=rf*Math.sin((7-i)*TP/7);
//    if (i==0) p2d.moveTo(x+R*Math.cos(10*TP/28),R*Math.sin(19*TP/28));  // not correct
    p2d.arc(x,y,R,((37-i*4)%28)*TP/28,((47-i*4)%28)*TP/28);
  }
  p2d.closePath();
  return new Sprocket(p2d,-rf,0,0,7,1,RATE2);
})();

var sprock6=(()=>{
  let p2d=new Path2D();
  for (let i=0; i<6; i++) {
    let x=2*R*Math.cos((6-i)*TP/6);
    let y=2*R*Math.sin((6-i)*TP/6);
//    if (i==0) p2d.moveTo(x+R*Math.cos(2*TP/6),R*Math.sin(2*TP/6));
    p2d.arc(x,y,R,((8-i)%6)*TP/6,((10-i)%6)*TP/6);
  }
  p2d.closePath();
  return new Sprocket(p2d,2*R,0,3,6,-1,RATE);
})();

/*
var sprock6O=(()=>{
  let p2d=new Path2D();
  let x=2*R;
  let y=0;
  p2d.moveTo(x+R*Math.cos(TP/3),R*Math.sin(TP/3));
  p2d.arc(x,0,R,TP/3,2*TP/3);
x=2*R*Math.cos(5*TP/6);
  y=2*R*Math.sin(5*TP/6);
  p2d.arc(x,y,R,TP/6,TP/2);
x=2*R*Math.cos(2*TP/3);
  y=2*R*Math.sin(2*TP/3);
  p2d.arc(x,y,R,0,TP/3);
  x=-2*R;
  y=0;
  p2d.arc(x,y,R,5*TP/6,TP/6);
  x=2*R*Math.cos(TP/3);
  y=2*R*Math.sin(TP/3);
  p2d.arc(x,y,R,2*TP/3,0);
  x=2*R*Math.cos(TP/6);
  y=2*R*Math.sin(TP/6);
  p2d.arc(x,y,R,TP/2,5*TP/6);
  p2d.closePath();
  return p2d;
})();
*/

ctx.strokeStyle="yellow";
ctx.lineWidth=2;

var balls=(()=>{
  let b=[];
  //for (let i=0; i<28; i++) { b.push(new Ball()); }
  for (let i=0; i<10; i++) { b.push(new Ball([sprock6,sprock7][getRandomInt(0,2)])); }
  return b;
})();

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let dp=new Path2D();
  let z=sprock7.getRadial();
  let dm=new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),sprock7.x,0]);
  dp.addPath(sprock7.p2d,dm);
  z=sprock6.getRadial();
  dp.addPath(
    sprock6.p2d,
    new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),sprock6.x,0])
  );
  ctx.fillStyle="#333";
  ctx.fill(dp);
  balls.forEach((b)=>{ b.draw(); });
}

var animate=(ts)=>{
  if (stopped) return;
  sprock1.increment();
  sprock6.increment();
  sprock7.increment();
  draw();
  requestAnimationFrame(animate);
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
body.addEventListener("click", start, false);

onresize();
start();
//draw();
