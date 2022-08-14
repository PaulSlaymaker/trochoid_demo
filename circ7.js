"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/WNzdLLe
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
c.style.outline="1px dotted gray";
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

var colors=[];
var getColors=()=>{
  let c=[];
  let colorCount=4;
  let hue=getRandomInt(90,270);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(240/colorCount)*i+getRandomInt(-20,20);
    let sat=70+getRandomInt(0,31);
    let lum=50+getRandomInt(0,11);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}


//const rad=120;	// no variable radius for now, motion by position
const rad=100;	// no variable radius for now, motion by position
var ww=12;
var lw=12;
var t=0;
var speed=2;
const SPACER=18;
const dm1=new DOMMatrix([0,1,-1,0,0,0]);
const dm2=new DOMMatrix([-1,0,0,-1,0,0]);

var Circle=function(x,y,a,r,pc) {
  this.x=x;
  this.y=y;
  this.x2=x;
  this.y2=y;
  this.a=a;
  this.radius=rad-SPACER;	// can be modified
  this.pc=pc;
  //this.c=[];	// TODO, no array, one child
  this.level=0;
  this.sr=1;
  this.setSpokes=()=>{
    this.spokes=new Path2D();
    //let a=-t/(this.radius);
    this.spokes.moveTo(0,0);
    this.spokes.lineTo(this.radius-(lw+ww)/2,0);
    this.spokes.addPath(this.spokes,dm1);
    this.spokes.addPath(this.spokes,dm2);
  }
  this.setSpokes();

  this.setPaths=()=>{
    this.path=new Path2D();
    let rr=(lw+ww)/2;
    let xt=(1-frac)*this.x+frac*this.x2;
    let yt=(1-frac)*this.y+frac*this.y2;
//if (a==0) console.log(this.x+" "+this.x2);
    this.path.moveTo(xt+this.radius-rr,yt);
    this.path.arc(xt,yt,this.radius-rr,0,TP);
    if (this.level==2) {
      this.path.moveTo(xt+this.radius/2-rr,yt);
      this.path.arc(xt,yt,this.radius/2-rr,0,TP);
    }

  }
  this.getSpokes=()=>{	// with motion, no need for separate func
    let xt=(1-frac)*this.x+frac*this.x2;
    let yt=(1-frac)*this.y+frac*this.y2;
    let p=new Path2D();
//    let a=-t/(this.radius);
    let ra=-speed*t/(this.radius)/this.sr;
    p.addPath(this.spokes,new DOMMatrix([Math.cos(ra),Math.sin(ra),-Math.sin(ra),Math.cos(ra),xt,yt]));
    return p;
  }
}

var Link=function(c1,c2) {
  c1.level++;
  c2.level++;

  //c2.sr*=c1.level/c2.level;
  c2.sr=c1.sr*c1.level/c2.level;
  //this.sr=c2.sr/c1.sr;
  this.sr=c2.sr;

  this.c1rad=c1.level>1?c1.radius/2:c1.radius;
/*
  this.setPath=()=>{
    this.lpath=new Path2D();
    let aa=Math.atan2(c2.y-c1.y,c2.x-c1.x);
    let d=Math.pow((c1.x-c2.x)*(c1.x-c2.x)+(c1.y-c2.y)*(c1.y-c2.y),0.5);
    let th=Math.asin((this.c1rad-c2.radius)/d);
    let aa1=-th+aa+TP/4
    let aa2=th+aa-TP/4
    // set up 3 paths, 4th is from closePath
    let x1=c1.x+this.c1rad*Math.cos(aa1);
    let y1=c1.y+this.c1rad*Math.sin(aa1);
    let x3=c2.x+c2.radius*Math.cos(aa1);
    let y3=c2.y+c2.radius*Math.sin(aa1);
    let x4=c2.x+c2.radius*Math.cos(aa2);
    let y4=c2.y+c2.radius*Math.sin(aa2);
  }
*/

  this.setPath=()=>{
    this.lpath=new Path2D();
    let aa=Math.atan2(c2.y-c1.y,c2.x-c1.x);
    let d=Math.pow((c1.x-c2.x)*(c1.x-c2.x)+(c1.y-c2.y)*(c1.y-c2.y),0.5);
    //let c2rad=c1.level>1?c2.radius/2:c2.radius;
    let th=Math.asin((this.c1rad-c2.radius)/d);
    let aa1=-th+aa+TP/4
    let aa2=th+aa-TP/4
    // set up 3 paths, 4th is from closePath
    let x1=c1.x+this.c1rad*Math.cos(aa1);
    let y1=c1.y+this.c1rad*Math.sin(aa1);
    let x3=c2.x+c2.radius*Math.cos(aa1);
    let y3=c2.y+c2.radius*Math.sin(aa1);
    let x4=c2.x+c2.radius*Math.cos(aa2);
    let y4=c2.y+c2.radius*Math.sin(aa2);
    this.lpath.moveTo(x1,y1);
    this.lpath.arc(c1.x,c1.y,this.c1rad,aa1,aa2);
    this.lpath.lineTo(x4,y4);
    this.lpath.arc(c2.x,c2.y,c2.radius,th+aa-TP/4,-th+aa+TP/4);
    this.lpath.closePath();

    let len=2*Math.pow((x1-x3)*(x1-x3)+(y1-y3)*(y1-y3),0.5);
    //let len2=(TP-((-th+aa+TP/4)-(th+aa-TP/4)))*c1rad;
    //let len2=(TP-((-th+TP/4)-(th-TP/4)))*c1rad;
    //let len2=(TP/2+2*th)*c1rad;//((-th+aa+TP/4)-(th+aa-TP/4))*c1rad;
    len+=(TP/2+2*th)*this.c1rad;
    len+=(TP/2-2*th)*c2.radius;
    this.dash=[len/30,len/30];
  }
  this.setPath();

  this.draw=()=>{
    ctx.setLineDash([]);
    ctx.strokeStyle=colors[1];
    ctx.lineWidth=3;
    ctx.stroke(this.lpath);
    ctx.setLineDash(this.dash);
    ctx.lineDashOffset=t*speed/this.sr;
    ctx.strokeStyle="#222";
    ctx.lineWidth=lw;
    ctx.stroke(this.lpath);
    ctx.strokeStyle=colors[2];
    ctx.lineWidth=lw-2;
    ctx.stroke(this.lpath);
  }
}

var mval=()=>{
  for (let i=0; i<ca.length; i++) {
    if (Math.pow(ca[i].x2*ca[i].x2+ca[i].y2*ca[i].y2,0.5)>CSIZE-rad+SPACER) {
//console.log("on edge");
      return false;
    }
    for (let j=i+1; j<ca.length; j++) {
      let xd=ca[i].x2-ca[j].x2;
      let yd=ca[i].y2-ca[j].y2;
      if (Math.abs(xd)>2.5*rad) continue;
      if (Math.abs(yd)>2.5*rad) continue;
      let d=Math.pow(xd*xd+yd*yd,0.5)+1;
      //if (Math.pow(xd*xd+yd*yd,0.5)+1<2*rad) {
      if (j==i+1 && d>2.4*rad) { return false; }
      if (d<2*rad) {
//console.log(i+" and "+j+" too close");
        return false;
      }
    }
  }
  return true;
}

var cval=(x,y)=>{
  //if (Math.abs(x)>CSIZE-rad) return false;
  //if (Math.abs(y)>CSIZE-rad) return false;
  if (Math.pow(x*x+y*y,0.5)>CSIZE-rad+SPACER) return false;	// TODO ? accept larger than canvas, this.radius=radius-18;
  //if (Math.pow(x*x+y*y,0.5)>CSIZE-rad-50) return false;	// 50 minimum motion
  //if (Math.pow(x*x+y*y,0.5)>CSIZE-rad) return false;
  for (let i=0; i<ca.length; i++) {
    let xd=ca[i].x-x;
    let yd=ca[i].y-y;
//    let d=Math.pow(xd*xd+yd*yd,0.5)+1;
//    if (d>4*rad) return false;
    //if (d<2*rad || d>3*rad) return false;
    if (Math.abs(xd)>2*rad) continue;
    if (Math.abs(yd)>2*rad) continue;
    //if (Math.pow(xd*xd+yd*yd,0.5)<rt+40) {
    if (Math.pow(xd*xd+yd*yd,0.5)+1<2*rad) return false;
  }
  return true;
}

var grow=()=>{
  //let c=eg ?ca[ca.length-1-getRandomInt(0,ca.length,true)] :
  let c=ca[getRandomInt(0,ca.length)];
//if (c.c.length>0) return false;
if (c.c) return false;
  let a=TP*Math.random();
//a=c.ga+Math.PI*(1-2*Math.random());
let qrad=(2+Math.random())*rad;
  let x=c.x+qrad*Math.cos(a);
  let y=c.y+qrad*Math.sin(a);
  //let x=c.x+(2*rad)*Math.cos(a);
  //let y=c.y+(2*rad)*Math.sin(a);
  if (cval(x,y)) {
//    let xp=c.x+c.radius*Math.cos(a);
//    let yp=c.y+c.radius*Math.sin(a);
    let circle=new Circle(x,y,a,qrad,c);
    //c.c.push(circle);
if (ca.length>1)
    c.c=circle;
    ca.push(circle);
    return true;
  }
  return false;
}

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,5,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var fade=()=>{	// diag
  ctx.fillStyle="#00000033";
  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.setLineDash([]);
  ctx.strokeStyle=colors[0];
  ctx.lineWidth=ww;
  for (let i=0; i<ca.length; i++) {
    ctx.stroke(ca[i].path);
    ctx.stroke(ca[i].getSpokes());
  }
  for (let i=0; i<links.length; i++) { links[i].draw(); }
}

/*
//let aa=Math.atan((ca[1].y-ca[0].y)/(ca[1].x-ca[0].x));
let aa=Math.atan2((ca[1].y-ca[0].y),(ca[1].x-ca[0].x));
console.log("aa "+aa);
*/

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var frac=0;
var m=0;
var animate=()=>{
  if (stopped) return;
  t++;
  m++;
  if (m==100) {
    reset();
    m=0;
  }
  frac=m/100;
  for (let i=0; i<ca.length; i++) { ca[i].setPaths(); }
  draw();
  requestAnimationFrame(animate);
}

var ca=[new Circle(200*Math.random(),200*Math.random(),0)];

onresize();

colors=getColors();

for (let i=0; i<300; i++) {
  grow();
  if (ca.length>4) {
    console.log(i);
    break;
  }
  if (i==299) console.log("99");
}

var links=[];

for (let i=0; i<ca.length; i++) { 
  if (ca[i].pc) {
    if (!ca[i].c && Math.random()<0.5) {
      //ca[i].sr/=2;
      ca[i].radius/=2;
      ca[i].setSpokes();
    }
    links.push(new Link(ca[i].pc,ca[i]));
  }
}
for (let i=0; i<ca.length; i++) { ca[i].setPaths(); }

var moveCircles=(distance)=>{
  for (let i=0; i<ca.length; i++) { 
    ca[i].x2=ca[i].x+distance-2*distance*Math.random(); 
    ca[i].y2=ca[i].y+distance-2*distance*Math.random(); 
  }
  return mval();
}

var moveCirclesP=(fp)=>{
console.log(fp);
  for (let i=0; i<ca.length; i++) { 
    if (Math.random()<fp) {
      ca[i].x2=ca[i].x+40-80*Math.random(); 
      ca[i].y2=ca[i].y+40-80*Math.random(); 
    } else {
      ca[i].x2=ca[i].x;
      ca[i].y2=ca[i].y;
    }
  }
  return mval();
}

var moveCirclesA=(fp)=>{
console.log(fp);
  let mx=fp*(40-80*Math.random()); 
  let my=fp*(40-80*Math.random()); 
  ca[0].x2=ca[0].x+mx;
  ca[0].y2=ca[0].y+my;
  for (let i=0; i<ca.length; i++) { 
    let a2=cp.a+fp*(1-2*Math.random());
//    let r2=
  }
  return mval();
}

var reset=()=>{
//let moved=false;
  for (let i=0; i<ca.length; i++) {
    ca[i].x=ca[i].x2;
    ca[i].y=ca[i].y2;
  }
  for (let i=0; i<80; i++) {
    //if (moveCircles((40-i)/40)) {
    if (moveCircles(80-i)) {
/*
      for (let i=0; i<ca.length; i++) {
	ca[i].x=ca[i].x2;
	ca[i].y=ca[i].y2;
	ca[i].setPaths();
      }
*/
      for (let i=0; i<links.length; i++) {
	links[i].setPath();
      }
//moved=true;
console.log("mv idx "+i);
      break; 
    }
if (i==79) console.log("79");
  }

//if (!moved) for (let i=0; i<ca.length

//  if (mval()) console.log("good");
//  else console.log("nofit");
}

//draw();
start();
