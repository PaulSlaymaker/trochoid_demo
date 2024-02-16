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
ctx.translate(CSIZE,2*CSIZE);
//ctx.globalCompositeOperation="destination-over";
ctx.setLineDash([1,2000]);
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
  const CBASE=160;
  const CT=255-CBASE;
  this.getRGB=()=>{
   let red=Math.round(CBASE+CT*(this.fr*Math.cos(this.RK2+tt/this.RK1)+(1-this.fr)*Math.cos(tt/this.RK3)));
   let grn=Math.round(CBASE+CT*(this.fg*Math.cos(this.GK2+tt/this.GK1)+(1-this.fg)*Math.cos(tt/this.GK3)));
   let blu=Math.round(CBASE+CT*(this.fb*Math.cos(this.BK2+tt/this.BK1)+(1-this.fb)*Math.cos(tt/this.BK3)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomizeF=()=>{
    this.RK3=1+5*Math.random();
    this.GK3=1+5*Math.random();
    this.BK3=1+5*Math.random();
    this.fr=1-Math.pow(0.9*Math.random(),3);
    this.fg=1-Math.pow(0.9*Math.random(),3);
    this.fb=1-Math.pow(0.9*Math.random(),3);
  }
  this.randomize=()=>{
    this.RK1=40+40*Math.random();
    this.GK1=40+40*Math.random();
    this.BK1=40+40*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.randomizeF();
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

var dur=640;
var tt=0;
var pause=0;
var trans=false;
var animate=(ts)=>{
  if (stopped) return;
  tt++;
  if (tt>dur || ca.length>200) {
    if (!trans) {
      trans=true;
      pause=tt+200;
//if (EM) stopped=true;
//stopped=true;
    } else {
      if (tt>pause) {
	color.randomize();
	ctx.clearRect(-CSIZE,-2*CSIZE,2*CSIZE,2*CSIZE);
        ctx.canvas.style.opacity=1;
        ctx.canvas.style.transform="scale(1,1)";
	tt=0;
	reset();
	trans=false;
      } else if (tt>pause-100) {
        let f=(pause-tt)/100;
        ctx.canvas.style.opacity=f;
        ctx.canvas.style.transform="scale("+f+","+f+")";
      }
    }
  } else {
    for (let i=0; i<ca.length; i++) ca[i].t++;
    draw();
    for (let i=0; i<ca.length; i++) {
      if (ca[i].t==ca[i].kt) {
	ca[i].t=0;
	ca[i].split();
      }
    }
  }
  requestAnimationFrame(animate);
}

var Circle=function() { 
  this.dir=false;
  this.t=0; //getRandomInt(-200,0);
  this.getRandomR=()=>{
//    return 200/Math.pow(ca.length,0.48);
//return 8+200*(1-tt/dur);
    return 8+200*(1-tt/dur)*(1+Math.random())/2;
//return 8+200*(1-tt/dur)*(1+Math.pow(Math.random(),4))/2;
  }
  this.getRandomA=()=>{ 
//return TP/24+5*TP/12*Math.random(); 
//return 11*TP/24-ca.length/10;
//return 11*TP/24-10*TP/24*tt/dur;
return 11*TP/24-(10*TP/24*tt/dur)*(1+Math.random())/2;
//return 11*TP/24-(10*TP/24*tt/dur)*(1+Math.pow(Math.random(),4))/2;
  }
  this.randomize=()=>{
    this.r=this.getRandomR();
    this.a=-TP/28;//0; //3*TP/4; //TP*Math.random();
    this.x=this.r*Math.cos(this.a);
    this.y=this.r*Math.sin(this.a);
    //this.a2=TP/12+TP/3*Math.random();
    this.a2=this.getRandomA();
    this.kt=Math.round(this.r*(TP/2-this.a2));
if (this.kt<=0) debugger;
  }
  this.split=()=>{

//if (Math.random()<0.7) { // non-random a,r
if (Math.random()<0.58) {
//if (false) {
let r3=this.getRandomR();
let x3=this.x+(this.r-r3)*Math.cos(this.a-this.a2);
let y3=this.y+(this.r-r3)*Math.sin(this.a-this.a2);
let c=new Circle();
c.r=r3;
//c.a=c.a+c.a2;
c.x=x3,c.y=y3;
//c.a=this.a-this.a2; //TP*Math.random();
c.a=TP/2+this.a-this.a2; //TP*Math.random();
c.dir=this.dir;
//if (c.dir) c.a2=-TP/6;
if (c.dir) c.a2=-this.getRandomA();
else c.a2=this.getRandomA();
if (c.dir) c.kt=Math.round(c.r*(TP/2+c.a2));
else {
  let an=TP/2-c.a2;
  if (an<0) an+=TP;
  c.kt=Math.round(c.r*an);
}
c.setPath();
ca.push(c);
if (c.kt<=0) debugger;
}

    let r2=this.getRandomR();
    let x2=this.x+(this.r+r2)*Math.cos(this.a-this.a2);
    let y2=this.y+(this.r+r2)*Math.sin(this.a-this.a2);
    this.r=r2;
    this.a=this.a-this.a2;
    this.x=x2,this.y=y2;
    this.dir=!this.dir;
    //if (this.dir) this.a2=-TP/6-TP/12*Math.random();
    if (this.dir) this.a2=-this.getRandomA();
    else this.a2=this.getRandomA();
    if (this.dir) {
      //this.kt=Math.round(this.r/2*(TP/2-this.a2));
//let an=TP/4-this.a2/2;
//let an=TP/2+this.a2;
      this.kt=Math.round(this.r*(TP/2+this.a2));
    } else {
      let an=TP/2-this.a2;
      if (an<0) an+=TP;
      this.kt=Math.round(this.r*an);
    }
    this.setPath();
    if (this.kt<=0) debugger;
  }
  this.setPath=()=>{
    this.path=new Path2D();
    this.path.arc(this.x,this.y,this.r,TP/2+this.a,this.a-this.a2,this.dir);
  }
}

onresize();

var ca=[];
var reset=()=>{
  ca=[new Circle()];
  ca[0].randomize();
  ca[0].setPath();
}
reset();

var draw=()=>{
  let lw=Math.max(2,80*(1-tt/dur));
  //if (tt>dur-30) lw=2+36*(1-(dur-tt)/30);
  if (tt>dur-30) lw=2+18*(1-Math.cos(TP*(dur-tt)/30));
  for (let i=0; i<ca.length; i++) {
    if (i>20) ctx.globalCompositeOperation="destination-over";
    else if (i<10) ctx.globalCompositeOperation="source-over";
    else {
      if (i%2) ctx.globalCompositeOperation="destination-over";
      else ctx.globalCompositeOperation="source-over";
    }
    ctx.lineDashOffset=-ca[i].t;
    //let p=ca[i].getPath();
//let lw=60/Math.pow(ca.length,0.2);
//if (tt>799) console.log(ctx.lineWidth);
//if (ctx.lineWidth==10) debugger;
    ctx.setTransform(1,0,0,1,CSIZE-2,2*CSIZE+2);
    ctx.strokeStyle="#0000000A";
    ctx.lineWidth=lw+10;	// 10 as f(lw)?
    ctx.stroke(ca[i].path);

    ctx.setTransform(1,0,0,1,CSIZE,2*CSIZE);
    ctx.strokeStyle=color.getRGB();
    ctx.lineWidth=lw;
    ctx.stroke(ca[i].path);
  }
}

start();

