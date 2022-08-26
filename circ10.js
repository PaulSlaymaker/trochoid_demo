"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/rNdRadV
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
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var hues=[];
//var colors=[];
var setHues=()=>{
//  let c=[];
  let colorCount=4;
  let hue=getRandomInt(180,270);
//console.log("hue "+hue);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(200/colorCount)*i+getRandomInt(-10,10);
    let sat=70+getRandomInt(0,31);
    let lum=50+getRandomInt(0,11);
let h=(hue+hd)%360;
//hues.push(h);
hues.splice(getRandomInt(0,hues.length+1),0,h);
    //c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
//  return c;
}

var t=getRandomInt(0,200);
var ca=[];
var lw=8;

var Circle=function(rl,pc) {
  this.rl=rl;
  this.os=TP*400*Math.random();
//this.os=[0,1000,2000][getRandomInt(0,3)];
//this.os=0; if (rl) this.os=1000;
  if (pc) this.level=pc.level+1;
  else this.level=0;
  this.setPaths=()=>{
    let os2=pc?pc.os:0;
    this.path=new Path2D();
    let pr=pc?pc.radius:0.414*CSIZE/2+CSIZE;
    let xd=pc?pc.x:0;
    let yd=pc?pc.y:0;
let os3=os2*Math.sin(TP*t/4000);
let frnd=Math.pow(Math.sin(((4*this.level+1)*t+os3)/500),2);
    //let rt=rnd*(0.793*pr)+(1-rnd)*0.2071*pr+17;
    //let rt=rnd*(0.5*pr)+(1-rnd)*0.2071*pr;
let rt=frnd*(0.6*pr)+(1-frnd)*0.182*pr;
    if (rl) {
      //let r1a=rt;	// min 0.414*CSIZE/2
      let r2a=pr-lw;
      let r=(rt+r2a)/2;
      let r2=(r2a-rt)/2;
      let x=r*Math.sin(TP/8);
      let y=r*Math.sin(TP/8);
      this.radius=r2;  
      let rr=Math.max(0,this.radius);
      if (rl==1) {
	this.x=xd+x;
	this.y=yd+y;
      } else if (rl==2) {
	this.x=xd+x;
	this.y=yd-y;
      } else if (rl==3) {
	this.x=xd-x;
	this.y=yd-y;
      } else if (rl==4) {
	this.x=xd-x;
	this.y=yd+y;
      }
//else debugger;
      this.path.arc(this.x,this.y,rr,0,TP);
    } else {
      this.radius=rt-lw;
      let x=this.radius/4*Math.cos(TP/8);
      let y=this.radius/4*Math.sin(TP/8);
      this.x=xd;
      this.y=yd;
      let rr=Math.max(0,this.radius);
      this.path.arc(this.x,this.y,rr,0,TP);
    }
//    this.path.moveTo(this.x+this.radius,this.y);
  }

  this.add2=()=>{
    ca.push(new Circle(0,this));
    ca.push(new Circle(1,this));
    ca.push(new Circle(2,this));
    ca.push(new Circle(3,this));
    ca.push(new Circle(4,this));
  }
}

ctx.lineWidth=lw;
//var rnd=Math.random();
//var rnd=[0,0.5,1][getRandomInt(0,3)];
var rnd=0;
//var rnd=0.5;

/*
var draw=()=>{
  ctx.strokeStyle="white";
  ctx.arc(CSIZE/2,CSIZE/2,CSIZE/2,0,TP);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle="white";
  ctx.arc(0,0,0.414*CSIZE/2,0,TP);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0,0,0.414*CSIZE/2+CSIZE,0,TP);
  ctx.stroke();
}
*/

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var animate=()=>{
  if (stopped) return;
  t++;
  for (let i=0; i<ca.length; i++) ca[i].setPaths();
  if (t%20==0) hues.forEach((h,i)=>{ hues[i]=++h%360; });
//hues[2]=hues[2]+(Math.round(10*Math.sin(t/2000)))%360;
  draw();
  requestAnimationFrame(animate);
}

ca=[new Circle(0),new Circle(1),new Circle(2),new Circle(3),new Circle(4)];
for (let i=0; i<ca.length; i++) {
  if (ca.length<780) {	// 5,30,155,780 	5,5+5*5, 5+5*5+5*5*5, 5
    ca[i].add2();
  } else break;
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<ca.length; i++) {
/*
    let q=Math.round(ca[i].radius);
    let h=(hues[ca[i].level%hues.length]+q)%360;
    let col="hsl("+h+",95%,55%)";
*/
    let col="hsl("+hues[ca[i].level%hues.length]+",95%,55%)";
    ctx.strokeStyle=col;
    //ctx.strokeStyle=colors[ca[i].level%colors.length];
    ctx.stroke(ca[i].path);
  }
}

for (let i=0; i<ca.length; i++) ca[i].setPaths();

onresize();

setHues();
//draw();
start();
