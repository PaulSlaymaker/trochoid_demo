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
//ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=154;
  const CT=255-CBASE;
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(o+this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(o+this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(o+this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=400+400*Math.random();
    this.GK1=400+400*Math.random();
    this.BK1=400+400*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();

var ES;

function Circle(x,y,r,a,d) {
  this.x=x;
  this.y=y;
  this.r=r;
  this.a=a;
  this.dir=d;
this.ocp="";
  this.getCirclePath=()=>{
    let p=new Path2D();
    p.arc(x,y,r,0,TP);
    return p;
  }
  this.getD=()=>{ 
    let xd=this.x-CSIZE;
    let yd=this.y-CSIZE;
    return Math.pow(xd*xd+yd*yd,0.5); 
  }
  this.getPathS=(da)=>{
    let p=new Path2D();
    let az2=this.a+Math.PI;
    if (this.dir==1) {
      //p.arc(x,y,r,da,az2);
p.arc(x,y,r,az2,da,true);
    } else {
      //p.arc(x,y,r,da,az2,true);
p.arc(x,y,r,az2,da);
    }
    return p;
  }
  this.getPathF=(da,f)=>{  // odd for now, dir==1
    let p=new Path2D();
    if (this.dir==1) {
      let az2=this.a+Math.PI;
      //p.arc(x,y,r,da,az2);
      p.arc(x,y,r,(f)*da+(1-f)*az2,az2);	// good, count odd
    } else {
      let az2=this.a-Math.PI;
      p.arc(x,y,r,az2,(f)*da+(1-f)*az2);
//p.arc(x,y,r,(f)*da+(1-f)*az2,da,true);
//p.arc(x,y,r,(1-f)*az2+f*da,az2);
//p.arc(x,y,r,da,az2,true);
    }
    return p;
  }
  this.getPath=(da,f)=>{
    let p=new Path2D();
if (this.dir==1) {
    let az2=this.a+Math.PI;
  //let az2=(this.a+Math.PI)%TP;
  //p.arc(x,y,r,(1-f)*da+f*az2,da);
  //p.arc(x,y,r,f*da+(1-f)*az2,da);
//p.arc(x,y,r,da,f*da+(1-f)*az2);
p.arc(x,y,r,da,(1-f)*da+f*az2);
  //p.arc(x,y,r,az2,da);
  //p.arc(x,y,r,az2,da);
} else {
  let az2=this.a-Math.PI;
  //p.arc(x,y,r,az2,(1-f)*az2+(f)*da);
  //p.arc(x,y,r,az2,da);  // ok?
p.arc(x,y,r,(f)*az2+(1-f)*da,da);
  //p.arc(x,y,r,da,(1-f)*az2+f*da);
//  p.arc(x,y,r,(f)*da+(1-f)*az2,az2,true);
}
    return p;
  }

  this.generate2=(l)=>{		// ? shortening r, directional a
//    let gc=[];
//    let ga=TP*Math.random();	// favor 0,TP
    //let ga=(TP*Math.random()+Math.PI)%TP;
let ga=(this.a+TP*Math.random())%TP;
//    if (this.a>ga+Math.PI) ga+=Math.PI/2;
//    if (this.a>ga+Math.PI) ga+=Math.PI/4;
if (this.a>ga+Math.PI) {
  this.di=(this.a-ga+Math.PI).toFixed(1);
  ga+=8*Math.PI/8;	// over circled
  //ga+=4*Math.PI/4;	
  this.ocp="p";
}
if (this.a<ga-Math.PI) {
  ga-=8*Math.PI/8;
  this.ocp="n";
}

if (ga<0) ga+=TP;
else ga%=TP;
//if (this.a>ga+Math.PI) ga+=Math.PI/2;
/*
    if (this.a>ga+Math.PI) {	// over circled
console.log("oc",l,ca.length,ga.toFixed(1));
      return this.generate2(l+1);
    }
*/
//console.log(ca[1].a>ca[0].a+Math.PI);
    //let gr=MINR+(MAXR-MINR)*Math.random();
    let gr=MINR+(MAXR-MINR)*Math.pow(Math.random(),l+1);
    let gx=this.x+(this.r+gr)*Math.cos(ga);
    let gy=this.y+(this.r+gr)*Math.sin(ga);
    if (checkCircle(gx,gy,gr)) {
//gc.push([Math.pow(gx*gx+gy*gy,0.5),gx,gy,gr,ga]);
//gc.push(new Circle(gx,gy,gr,ga,-this.dir));
//console.log(l);
ES=l;
      return new Circle(gx,gy,gr,ga,-this.dir);
    } else {

if (l>100) {
  console.log(l,ca.length);
  return false;
}
      return this.generate2(l+1);
    }
  }
}


ctx.font="bold 11px sans-serif";
ctx.textAlign="center";
var showC=()=>{
  ctx.lineWidth=1;
//  ctx.strokeStyle="yellow";
//  ctx.stroke(ca[0].getCirclePath());
  ctx.strokeStyle="silver";
  ctx.fillStyle="white";
  for (let i=0; i<ca.length; i++) {
    ctx.stroke(ca[i].getCirclePath());
    //let rep=i+" "+ca[i].a.toFixed(1);
    ctx.fillText(i,ca[i].x,ca[i].y-7);
    ctx.fillText(ca[i].a.toFixed(2),ca[i].x,ca[i].y+3);
    ctx.fillText(ca[i].ocp,ca[i].x,ca[i].y+13);
  }
  ctx.arc(CSIZE,CSIZE,CSIZE,0,TP);
  ctx.stroke();
}

var f=1;
var draw=()=>{	// ? states: moving, growing, shrinking
if (ca.length<2) return;
  ctx.clearRect(0,0,2*CSIZE,2*CSIZE);
  //showC();
  //for (let i=1; i<ca.length; i++) {
  //f=1-t/800;
  f=t/DUR;
  let p=new Path2D(ca[0].getPath(ca[1].a,1-f));
  //for (let i=1; i<6; i++) {
//for (let i=1; i<Math.min(6,ca.length-1); i++) {
  for (let i=1; i<ca.length-2; i++) {
    p.addPath(ca[i].getPathS(ca[i+1].a));
  }
  p.addPath(ca[ca.length-2].getPathF(ca[ca.length-1].a,f));
ctx.lineWidth=8;
  ctx.strokeStyle=color.getRGB(0);
  ctx.stroke(p);
//ctx.lineWidth=4;
//ctx.strokeStyle="red";
//ctx.stroke(ca[ca.length-2].getPathF(ca[ca.length-1].a,f));
}

var stopped=true;
//const DUR=36;
const DUR=20;
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
var animate=(ts)=>{
  if (stopped) return;
  t++;
  //if (t%20==0) grow();
//if (EM && t%100==0) stopped=true
  if (t>=DUR) {
//    stopped=true
    if (!grow()) {
      showC();
return;	// test
    }
    t=0;
  }
  draw();
if (ca.length<2) stopped=true;
  requestAnimationFrame(animate);
}

// statuses:  f:b,  1:1, 0:1, N,G,S: normal, grow, shrink

var checkCircle=(x,y,r)=>{	// ? remove corners, spacer+lineWidth
  let dc=Math.pow((x-CSIZE)*(x-CSIZE)+(y-CSIZE)*(y-CSIZE),0.5);
  if (dc+r>CSIZE) return false;
/*
  if (x<r) return false;
  if (y<r) return false;
  if (x>2*CSIZE-r) return false;
  if (y>2*CSIZE-r) return false;
*/
  for (let i=0; i<ca.length-1; i++) {
    let d=-12+Math.pow((ca[i].x-x)*(ca[i].x-x)+(ca[i].y-y)*(ca[i].y-y),0.5);
    if (d<r+ca[i].r) return false;
  }
  return true;
}

onresize();

const MAXR=80;
const MINR=20;
//const MINR=16;
//const MINR=32;
const COUNT=4; //getRandomInt(5,12);
//console.log("count",COUNT);

let x=MAXR+2*(CSIZE-MAXR)*Math.random();
let y=MAXR+2*(CSIZE-MAXR)*Math.random();
let r=MINR+(MAXR-MINR)*Math.random();
let a=Math.PI/4; //0.3+0.7*TP*Math.random();

x=370;
y=60;
r=20;
a=0.1;
var ca=[new Circle(x,y,r,a,1)];

/*
ca[0].x=370;
ca[0].y=60;
ca[0].r=20;
ca[0].a=0;
*/

for (let i=0; i<COUNT; i++) {
  let circle=ca[i].generate2(0);
  //if (!circle) break;
if (!circle) break;	// test for very short ca
  ca.push(circle);
}

//ca.shift();
console.log(ca.length);

draw();

ctx.strokeStyle="green";
//ctx.stroke(new Path2D(ca[ca.length-2].getPath(ca[ca.length-1].a,1)));
ctx.stroke(new Path2D(ca[ca.length-3].getPath(ca[ca.length-2].a,1)));

var grow=()=>{
  let circle=ca[ca.length-1].generate2(0);
  if (circle) {
    let circle2=ca[ca.length-1].generate2(0);
    if (circle2) {
//console.log(circle.getD().toFixed(1),circle2.getD().toFixed(1));
      if (circle.getD()>circle2.getD()) {
        circle=circle2;
      }
      let circle3=ca[ca.length-1].generate2(0);
      if (circle3) {
	if (circle.getD()>circle3.getD()) circle=circle3;
      }
    }  // else
    ca.shift();
    ca.push(circle);
    return true;
  } else {
    ca.shift();
    return false;
  }
}


/*
if (ca.length>1) {
console.log(ca[0].a>ca[1].a);
console.log(ca[1].a>ca[0].a);
console.log(ca[1].a>ca[0].a+Math.PI);
console.log(ca[0].a>ca[1].a+Math.PI);
}
*/


// draw, dash, no clear
// worm, multi
